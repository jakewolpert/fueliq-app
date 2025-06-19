// Enhanced Unified Data Manager - Firebase Sync + Habbt Integration
window.FuelIQDataManager = (function() {
    'use strict';
    
    // Storage keys
    const STORAGE_KEYS = {
        USER_GOALS: 'fueliq_user_goals',
        USER_PROFILE: 'fueliq_user_profile', 
        MEALS: 'fueliq_meals_', // + date
        JOURNAL: 'fueliq_journal_', // + date
        ACTIVITY: 'fueliq_activity_', // + date
        RECENT_FOODS: 'fueliq_recent_foods',
        MEAL_PLAN: 'fueliq_meal_plan',
        PANTRY: 'fueliq_pantry'
    };

    // Habbt to FuelIQ key mapping
    const HABBT_KEY_MAPPING = {
        'habbt_profile_data': 'fueliq_user_profile',
        'habbt_user_goals': 'fueliq_user_goals',
        'habbt_meals_': 'fueliq_meals_',
        'habbt_journal_': 'fueliq_journal_',
        'habbt_dashboard_health_data': 'fueliq_health_data',
        'habbt_dashboard_settings': 'fueliq_settings'
    };

    // Firebase sync state
    let isOnline = navigator.onLine;
    let syncQueue = [];
    let lastSyncTime = null;

    // Default data structures
    const DEFAULT_GOALS = {
        calories: 2000,
        protein: 150,
        carbs: 250,
        fat: 67
    };

    const DEFAULT_PROFILE = {
        name: '',
        age: '',
        gender: '',
        height: '',
        weight: '',
        activityLevel: 'moderate',
        goal: 'maintain'
    };

    // Safe storage operations with Firebase sync
    const safeGet = (key, defaultValue = null) => {
        try {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : defaultValue;
        } catch (error) {
            console.error(`Failed to get ${key}:`, error);
            return defaultValue;
        }
    };

    const safeSet = async (key, value, skipSync = false) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            console.log(`✅ Saved ${key}:`, value);
            
            // Auto-sync to Firebase if not skipped
            if (!skipSync) {
                await syncToFirebase(key, value);
            }
            
            return true;
        } catch (error) {
            console.error(`Failed to set ${key}:`, error);
            return false;
        }
    };

    // Enhanced get with Firebase fallback
    const safeGetWithFirebaseFallback = async (key, defaultValue = null) => {
        try {
            // Try localStorage first
            const localValue = localStorage.getItem(key);
            if (localValue) {
                return JSON.parse(localValue);
            }
            
            // Fallback to Firebase
            if (window.firebaseAuth?.currentUser) {
                console.log(`☁️ Loading from Firebase: ${key}`);
                const firebaseData = await loadFromFirebase(key);
                if (firebaseData) {
                    // Save back to localStorage
                    localStorage.setItem(key, JSON.stringify(firebaseData));
                    console.log(`✅ Restored from Firebase: ${key}`);
                    return firebaseData;
                }
            }
            
            return defaultValue;
        } catch (error) {
            console.error(`Failed to get ${key} with Firebase fallback:`, error);
            return defaultValue;
        }
    };

    // Firebase sync functions
    const syncToFirebase = async (key, data) => {
        if (!window.firebaseAuth?.currentUser || !window.CloudDataManager) {
            console.log('⏳ Queueing for sync:', key);
            syncQueue.push({ key, data, action: 'save' });
            return false;
        }

        try {
            const userId = window.firebaseAuth.currentUser.uid;
            
            if (key === 'fueliq_user_profile' || key === 'habbt_profile_data') {
                await window.CloudDataManager.saveProfile(userId, data);
            } else if (key === 'fueliq_user_goals' || key === 'habbt_user_goals') {
                // Save goals as part of profile
                const existingProfile = await window.CloudDataManager.loadProfile(userId) || {};
                await window.CloudDataManager.saveProfile(userId, { ...existingProfile, goals: data });
            } else if (key.includes('meals_')) {
                const date = key.replace('fueliq_meals_', '').replace('habbt_meals_', '');
                await window.CloudDataManager.saveMealData(userId, date, data);
            } else if (key.includes('journal_')) {
                const date = key.replace('fueliq_journal_', '').replace('habbt_journal_', '');
                await saveJournalToFirebase(userId, date, data);
            } else {
                // Generic data save
                await saveGenericDataToFirebase(userId, key, data);
            }
            
            console.log(`☁️ Synced to Firebase: ${key}`);
            lastSyncTime = new Date().toISOString();
            return true;
        } catch (error) {
            console.error(`❌ Firebase sync failed for ${key}:`, error);
            syncQueue.push({ key, data, action: 'save' });
            return false;
        }
    };

    const loadFromFirebase = async (key) => {
        if (!window.firebaseAuth?.currentUser || !window.CloudDataManager) {
            return null;
        }

        try {
            const userId = window.firebaseAuth.currentUser.uid;
            
            if (key === 'fueliq_user_profile' || key === 'habbt_profile_data') {
                return await window.CloudDataManager.loadProfile(userId);
            } else if (key === 'fueliq_user_goals' || key === 'habbt_user_goals') {
                const profile = await window.CloudDataManager.loadProfile(userId);
                return profile?.goals || null;
            } else if (key.includes('meals_')) {
                const date = key.replace('fueliq_meals_', '').replace('habbt_meals_', '');
                return await window.CloudDataManager.loadMealData(userId, date);
            } else if (key.includes('journal_')) {
                const date = key.replace('fueliq_journal_', '').replace('habbt_journal_', '');
                return await loadJournalFromFirebase(userId, date);
            } else {
                return await loadGenericDataFromFirebase(userId, key);
            }
        } catch (error) {
            console.error(`❌ Firebase load failed for ${key}:`, error);
            return null;
        }
    };

    // Journal-specific Firebase functions
    const saveJournalToFirebase = async (userId, date, journalData) => {
        const docRef = window.firebaseUtils.doc(window.firebaseDB, 'userJournals', `${userId}_${date}`);
        await window.firebaseUtils.setDoc(docRef, {
            ...journalData,
            userId,
            date,
            updatedAt: new Date().toISOString()
        });
    };

    const loadJournalFromFirebase = async (userId, date) => {
        const docRef = window.firebaseUtils.doc(window.firebaseDB, 'userJournals', `${userId}_${date}`);
        const docSnap = await window.firebaseUtils.getDoc(docRef);
        return docSnap.exists() ? docSnap.data() : null;
    };

    // Generic data Firebase functions
    const saveGenericDataToFirebase = async (userId, key, data) => {
        const docRef = window.firebaseUtils.doc(window.firebaseDB, 'userData', `${userId}_${key}`);
        await window.firebaseUtils.setDoc(docRef, {
            data,
            updatedAt: new Date().toISOString()
        });
    };

    const loadGenericDataFromFirebase = async (userId, key) => {
        const docRef = window.firebaseUtils.doc(window.firebaseDB, 'userData', `${userId}_${key}`);
        const docSnap = await window.firebaseUtils.getDoc(docRef);
        return docSnap.exists() ? docSnap.data().data : null;
    };

    // Habbt compatibility functions
    const mapHabbtKey = (habbtKey) => {
        // Direct mapping for exact matches
        if (HABBT_KEY_MAPPING[habbtKey]) {
            return HABBT_KEY_MAPPING[habbtKey];
        }
        
        // Pattern matching for dated keys
        for (const [habbtPattern, fueliqPattern] of Object.entries(HABBT_KEY_MAPPING)) {
            if (habbtPattern.endsWith('_') && habbtKey.startsWith(habbtPattern)) {
                const suffix = habbtKey.replace(habbtPattern, '');
                return fueliqPattern + suffix;
            }
        }
        
        return habbtKey; // Return original if no mapping found
    };

    const saveHabbtData = async (habbtKey, data) => {
        const fueliqKey = mapHabbtKey(habbtKey);
        console.log(`🔄 Mapping ${habbtKey} → ${fueliqKey}`);
        
        // Save to both keys for compatibility
        localStorage.setItem(habbtKey, JSON.stringify(data));
        await safeSet(fueliqKey, data);
        
        return true;
    };

    const loadHabbtData = async (habbtKey, defaultValue = null) => {
        const fueliqKey = mapHabbtKey(habbtKey);
        
        // Try habbt key first (for immediate compatibility)
        let data = safeGet(habbtKey);
        if (data) {
            return data;
        }
        
        // Try fueliq key
        data = await safeGetWithFirebaseFallback(fueliqKey, defaultValue);
        if (data) {
            // Save to habbt key for compatibility
            localStorage.setItem(habbtKey, JSON.stringify(data));
        }
        
        return data;
    };

    // Unified goal management (enhanced)
    const getGoals = async () => {
        // Try multiple sources and merge
        const goals = await safeGetWithFirebaseFallback(STORAGE_KEYS.USER_GOALS, {});
        const profile = await safeGetWithFirebaseFallback(STORAGE_KEYS.USER_PROFILE, {});
        
        // Also check habbt keys for compatibility
        const habbtGoals = safeGet('habbt_user_goals', {});
        const habbtProfile = safeGet('habbt_profile_data', {});
        
        // Merge all sources
        const mergedGoals = {
            ...DEFAULT_GOALS,
            ...profile,
            ...habbtProfile,
            ...goals,
            ...habbtGoals
        };

        // Ensure we have the right property names
        const finalGoals = {
            calories: mergedGoals.calories || mergedGoals.dailyCalories || DEFAULT_GOALS.calories,
            protein: mergedGoals.protein || DEFAULT_GOALS.protein,
            carbs: mergedGoals.carbs || mergedGoals.carbohydrates || DEFAULT_GOALS.carbs,
            fat: mergedGoals.fat || DEFAULT_GOALS.fat
        };

        console.log('📊 Unified goals loaded:', finalGoals);
        return finalGoals;
    };

    const setGoals = async (newGoals) => {
        // Get existing goals and merge
        const currentGoals = await getGoals();
        const updatedGoals = {
            ...currentGoals,
            ...newGoals
        };

        // Save to both fueliq and habbt keys for compatibility
        await safeSet(STORAGE_KEYS.USER_GOALS, updatedGoals);
        localStorage.setItem('habbt_user_goals', JSON.stringify(updatedGoals));
        
        // Notify all tabs about the update
        broadcastGoalsUpdate(updatedGoals);
        console.log('🎯 Goals updated successfully:', updatedGoals);
        
        return true;
    };

    // Profile management (enhanced)
    const getProfile = async () => {
        const profile = await safeGetWithFirebaseFallback(STORAGE_KEYS.USER_PROFILE, {});
        const habbtProfile = safeGet('habbt_profile_data', {});
        
        return {
            ...DEFAULT_PROFILE,
            ...profile,
            ...habbtProfile
        };
    };

    const setProfile = async (newProfile) => {
        const currentProfile = await getProfile();
        const updatedProfile = {
            ...currentProfile,
            ...newProfile
        };
        
        // Save to both keys for compatibility
        await safeSet(STORAGE_KEYS.USER_PROFILE, updatedProfile);
        localStorage.setItem('habbt_profile_data', JSON.stringify(updatedProfile));
        
        return true;
    };

    // Meal data management (enhanced)
    const getMealData = async (date) => {
        const dateStr = typeof date === 'string' ? date : date.toISOString().split('T')[0];
        const key = STORAGE_KEYS.MEALS + dateStr;
        const habbtKey = 'habbt_meals_' + dateStr;
        
        // Try habbt key first, then fueliq key with Firebase fallback
        let data = safeGet(habbtKey);
        if (!data) {
            data = await safeGetWithFirebaseFallback(key, {
                breakfast: [],
                lunch: [],
                dinner: [],
                snacks: []
            });
            
            // Save to habbt key for compatibility
            if (data) {
                localStorage.setItem(habbtKey, JSON.stringify(data));
            }
        }
        
        return data;
    };

    const setMealData = async (date, mealData) => {
        const dateStr = typeof date === 'string' ? date : date.toISOString().split('T')[0];
        const key = STORAGE_KEYS.MEALS + dateStr;
        const habbtKey = 'habbt_meals_' + dateStr;
        
        // Save to both keys for compatibility
        await safeSet(key, mealData);
        localStorage.setItem(habbtKey, JSON.stringify(mealData));
        
        return true;
    };

    // Journal data management (enhanced)
    const getJournalData = async (date) => {
        const dateStr = typeof date === 'string' ? date : date.toISOString().split('T')[0];
        const key = STORAGE_KEYS.JOURNAL + dateStr;
        const habbtKey = 'habbt_journal_' + dateStr;
        
        // Try habbt key first, then fueliq key with Firebase fallback
        let data = safeGet(habbtKey);
        if (!data) {
            data = await safeGetWithFirebaseFallback(key, {});
            
            // Save to habbt key for compatibility
            if (data) {
                localStorage.setItem(habbtKey, JSON.stringify(data));
            }
        }
        
        return data;
    };

    const setJournalData = async (date, journalData) => {
        const dateStr = typeof date === 'string' ? date : date.toISOString().split('T')[0];
        const key = STORAGE_KEYS.JOURNAL + dateStr;
        const habbtKey = 'habbt_journal_' + dateStr;
        
        const dataWithMeta = {
            ...journalData,
            date: dateStr,
            timestamp: new Date().toISOString()
        };
        
        // Save to both keys for compatibility
        await safeSet(key, dataWithMeta);
        localStorage.setItem(habbtKey, JSON.stringify(dataWithMeta));
        
        return true;
    };

    // Activity data management
    const getActivityData = async (date) => {
        const dateStr = typeof date === 'string' ? date : date.toISOString().split('T')[0];
        const key = STORAGE_KEYS.ACTIVITY + dateStr;
        
        return await safeGetWithFirebaseFallback(key, {});
    };

    const setActivityData = async (date, activityData) => {
        const dateStr = typeof date === 'string' ? date : date.toISOString().split('T')[0];
        const key = STORAGE_KEYS.ACTIVITY + dateStr;
        
        const dataWithMeta = {
            ...activityData,
            date: dateStr,
            timestamp: new Date().toISOString()
        };
        
        return await safeSet(key, dataWithMeta);
    };

    // Cross-tab communication
    const broadcastGoalsUpdate = (goals) => {
        window.dispatchEvent(new CustomEvent('fueliq-goals-updated', {
            detail: { goals }
        }));
    };

    const onGoalsUpdated = (callback) => {
        window.addEventListener('fueliq-goals-updated', (event) => {
            callback(event.detail.goals);
        });
    };

    // Data validation
    const validateGoals = (goals) => {
        const errors = [];
        
        if (!goals.calories || goals.calories < 800 || goals.calories > 5000) {
            errors.push('Calories must be between 800-5000');
        }
        
        if (!goals.protein || goals.protein < 10 || goals.protein > 300) {
            errors.push('Protein must be between 10-300g');
        }
        
        if (!goals.carbs || goals.carbs < 20 || goals.carbs > 500) {
            errors.push('Carbs must be between 20-500g');
        }
        
        if (!goals.fat || goals.fat < 10 || goals.fat > 200) {
            errors.push('Fat must be between 10-200g');
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    };

    // Full data restore from Firebase
    const restoreAllDataFromFirebase = async () => {
        if (!window.firebaseAuth?.currentUser) {
            console.log('❌ No user logged in for restore');
            return false;
        }

        try {
            console.log('🔄 Restoring all data from Firebase...');
            const userId = window.firebaseAuth.currentUser.uid;

            // Restore profile and goals
            const profile = await window.CloudDataManager.loadProfile(userId);
            if (profile) {
                await setProfile(profile);
                if (profile.goals) {
                    await setGoals(profile.goals);
                }
            }

            // Restore recent meal and journal data (last 30 days)
            const today = new Date();
            for (let i = 0; i < 30; i++) {
                const date = new Date(today);
                date.setDate(date.getDate() - i);
                const dateStr = date.toISOString().split('T')[0];
                
                const mealData = await window.CloudDataManager.loadMealData(userId, dateStr);
                if (mealData) {
                    await setMealData(dateStr, mealData);
                }

                const journalData = await loadJournalFromFirebase(userId, dateStr);
                if (journalData) {
                    await setJournalData(dateStr, journalData);
                }
            }

            console.log('✅ Data restore completed');
            return true;
        } catch (error) {
            console.error('❌ Data restore failed:', error);
            return false;
        }
    };

    // Network status handlers
    const handleOnline = () => {
        console.log('🌐 Connection restored - processing sync queue...');
        isOnline = true;
        processSyncQueue();
    };

    const handleOffline = () => {
        console.log('📵 Connection lost - queuing changes...');
        isOnline = false;
    };

    // Process queued sync operations
    const processSyncQueue = async () => {
        if (!isOnline || !window.firebaseAuth?.currentUser || syncQueue.length === 0) {
            return;
        }

        console.log(`🔄 Processing ${syncQueue.length} queued operations...`);
        const operations = [...syncQueue];
        syncQueue = [];

        for (const operation of operations) {
            try {
                if (operation.action === 'save') {
                    await syncToFirebase(operation.key, operation.data);
                }
            } catch (error) {
                console.error('Failed to process queued operation:', error);
                syncQueue.push(operation); // Re-queue failed operations
            }
        }
    };

    // Data backup and restore (enhanced)
    const backupAllData = () => {
        try {
            const backup = {
                timestamp: new Date().toISOString(),
                goals: safeGet(STORAGE_KEYS.USER_GOALS, {}),
                profile: safeGet(STORAGE_KEYS.USER_PROFILE, {}),
                meals: {},
                journals: {},
                activities: {}
            };
            
            // Get all dated data (both fueliq and habbt keys)
            const allKeys = Object.keys(localStorage).filter(key => 
                key.startsWith('fueliq_') || key.startsWith('habbt_')
            );
            
            allKeys.forEach(key => {
                if (key.includes('meals_')) {
                    const date = key.split('meals_')[1];
                    backup.meals[date] = safeGet(key, {});
                } else if (key.includes('journal_')) {
                    const date = key.split('journal_')[1];
                    backup.journals[date] = safeGet(key, {});
                } else if (key.includes('activity_')) {
                    const date = key.split('activity_')[1];
                    backup.activities[date] = safeGet(key, {});
                }
            });
            
            return backup;
        } catch (error) {
            console.error('Backup failed:', error);
            return null;
        }
    };

    const restoreFromBackup = async (backup) => {
        try {
            // Restore goals and profile
            await setGoals(backup.goals);
            await setProfile(backup.profile);
            
            // Restore meal data
            for (const [date, data] of Object.entries(backup.meals || {})) {
                await setMealData(date, data);
            }
            
            // Restore journal data
            for (const [date, data] of Object.entries(backup.journals || {})) {
                await setJournalData(date, data);
            }
            
            // Restore activity data
            for (const [date, data] of Object.entries(backup.activities || {})) {
                await setActivityData(date, data);
            }
            
            console.log('✅ Data restored successfully');
            return true;
        } catch (error) {
            console.error('Restore failed:', error);
            return false;
        }
    };

    // Debug utilities (enhanced)
    const debugStorage = () => {
        console.log('=== ENHANCED FUELIQ STORAGE DEBUG ===');
        console.log('Goals:', safeGet(STORAGE_KEYS.USER_GOALS, {}));
        console.log('Profile:', safeGet(STORAGE_KEYS.USER_PROFILE, {}));
        console.log('Habbt Goals:', safeGet('habbt_user_goals', {}));
        console.log('Habbt Profile:', safeGet('habbt_profile_data', {}));
        
        const allKeys = Object.keys(localStorage).filter(key => 
            key.startsWith('fueliq_') || key.startsWith('habbt_')
        );
        console.log('All keys:', allKeys);
        
        console.log('Firebase user:', window.firebaseAuth?.currentUser?.email);
        console.log('Sync queue length:', syncQueue.length);
        console.log('Last sync time:', lastSyncTime);
        
        return {
            goals: safeGet(STORAGE_KEYS.USER_GOALS, {}),
            profile: safeGet(STORAGE_KEYS.USER_PROFILE, {}),
            habbtGoals: safeGet('habbt_user_goals', {}),
            habbtProfile: safeGet('habbt_profile_data', {}),
            allKeys,
            syncStatus: {
                isOnline,
                queueLength: syncQueue.length,
                lastSync: lastSyncTime,
                hasUser: !!window.firebaseAuth?.currentUser
            }
        };
    };

    // Initialize enhanced data manager
    const init = async () => {
        console.log('🚀 Enhanced FuelIQ Data Manager initializing...');
        
        // Monitor online/offline status
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        
        // Ensure goals exist
        const goals = await getGoals();
        const profile = await getProfile();
        
        // Auto-save goals if they don't exist
        if (!safeGet(STORAGE_KEYS.USER_GOALS)) {
            await setGoals(goals);
        }
        
        // Set up Firebase auth listener for data restore
        if (window.firebaseAuth && window.firebaseUtils) {
            window.firebaseUtils.onAuthStateChanged(window.firebaseAuth, async (user) => {
                if (user) {
                    console.log('👤 User logged in - checking for data restore...');
                    
                    // Check if we need to restore data (localStorage mostly empty)
                    const hasLocalData = safeGet('habbt_profile_data') || safeGet('fueliq_user_profile');
                    
                    if (!hasLocalData) {
                        console.log('📥 Restoring data from Firebase...');
                        await restoreAllDataFromFirebase();
                        
                        // Trigger a refresh of the current view to show restored data
                        setTimeout(() => {
                            if (window.setCurrentView && typeof window.setCurrentView === 'function') {
                                const currentView = document.querySelector('.bg-teal-500')?.textContent?.toLowerCase() || 'dashboard';
                                window.setCurrentView(currentView);
                            }
                        }, 1000);
                    }
                }
            });
        }
        
        console.log('✅ Enhanced Data Manager initialized with Firebase sync');
        
        return {
            goals,
            profile
        };
    };

    // Public API (enhanced)
    return {
        // Goal management
        getGoals,
        setGoals,
        onGoalsUpdated,
        validateGoals,
        
        // Profile management
        getProfile,
        setProfile,
        
        // Data management
        getMealData,
        setMealData,
        getJournalData,
        setJournalData,
        getActivityData,
        setActivityData,
        
        // Habbt compatibility
        saveHabbtData,
        loadHabbtData,
        mapHabbtKey,
        
        // Firebase sync
        syncToFirebase,
        loadFromFirebase,
        restoreAllDataFromFirebase,
        processSyncQueue,
        
        // Utility
        backupAllData,
        restoreFromBackup,
        debugStorage,
        init,
        
        // Status
        getStatus: () => ({
            isOnline,
            queueLength: syncQueue.length,
            lastSync: lastSyncTime,
            hasUser: !!window.firebaseAuth?.currentUser
        }),
        
        // Constants
        STORAGE_KEYS,
        DEFAULT_GOALS,
        DEFAULT_PROFILE,
        HABBT_KEY_MAPPING
    };
})();

// Auto-initialize when Firebase is ready
function initEnhancedDataManager() {
    if (window.firebaseAuth && window.firebaseDB) {
        window.FuelIQDataManager.init();
    } else {
        setTimeout(initEnhancedDataManager, 100);
    }
}

// Start initialization
initEnhancedDataManager();

console.log('✅ Enhanced Unified Data Manager loaded with Firebase sync and Habbt compatibility!');
