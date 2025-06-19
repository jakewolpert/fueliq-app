// Unified FuelIQ Data Manager - Prevents data conflicts and resets
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

    // Safe storage operations
    const safeGet = (key, defaultValue = null) => {
        try {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : defaultValue;
        } catch (error) {
            console.error(`Failed to get ${key}:`, error);
            return defaultValue;
        }
    };

    const safeSet = (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            console.log(`✅ Saved ${key}:`, value);
            return true;
        } catch (error) {
            console.error(`Failed to set ${key}:`, error);
            return false;
        }
    };

    // Unified goal management
    const getGoals = () => {
        // Try multiple sources and merge
        const goals = safeGet(STORAGE_KEYS.USER_GOALS, {});
        const profile = safeGet(STORAGE_KEYS.USER_PROFILE, {});
        
        // Merge and prioritize goals over profile
        const mergedGoals = {
            ...DEFAULT_GOALS,
            ...profile, // Profile might have goal data
            ...goals   // Goals take priority
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

    const setGoals = (newGoals) => {
        // Get existing goals and merge
        const currentGoals = getGoals();
        const updatedGoals = {
            ...currentGoals,
            ...newGoals
        };

        // Save to goals storage
        const success = safeSet(STORAGE_KEYS.USER_GOALS, updatedGoals);
        
        if (success) {
            // Notify all tabs about the update
            broadcastGoalsUpdate(updatedGoals);
            console.log('🎯 Goals updated successfully:', updatedGoals);
        }
        
        return success;
    };

    // Profile management
    const getProfile = () => {
        const profile = safeGet(STORAGE_KEYS.USER_PROFILE, {});
        return {
            ...DEFAULT_PROFILE,
            ...profile
        };
    };

    const setProfile = (newProfile) => {
        const currentProfile = getProfile();
        const updatedProfile = {
            ...currentProfile,
            ...newProfile
        };
        
        return safeSet(STORAGE_KEYS.USER_PROFILE, updatedProfile);
    };

    // Meal data management
    const getMealData = (date) => {
        const dateStr = typeof date === 'string' ? date : date.toISOString().split('T')[0];
        const key = STORAGE_KEYS.MEALS + dateStr;
        
        return safeGet(key, {
            breakfast: [],
            lunch: [],
            dinner: [],
            snacks: []
        });
    };

    const setMealData = (date, mealData) => {
        const dateStr = typeof date === 'string' ? date : date.toISOString().split('T')[0];
        const key = STORAGE_KEYS.MEALS + dateStr;
        
        return safeSet(key, mealData);
    };

    // Journal data management
    const getJournalData = (date) => {
        const dateStr = typeof date === 'string' ? date : date.toISOString().split('T')[0];
        const key = STORAGE_KEYS.JOURNAL + dateStr;
        
        return safeGet(key, {});
    };

    const setJournalData = (date, journalData) => {
        const dateStr = typeof date === 'string' ? date : date.toISOString().split('T')[0];
        const key = STORAGE_KEYS.JOURNAL + dateStr;
        
        return safeSet(key, {
            ...journalData,
            date: dateStr,
            timestamp: new Date().toISOString()
        });
    };

    // Activity data management
    const getActivityData = (date) => {
        const dateStr = typeof date === 'string' ? date : date.toISOString().split('T')[0];
        const key = STORAGE_KEYS.ACTIVITY + dateStr;
        
        return safeGet(key, {});
    };

    const setActivityData = (date, activityData) => {
        const dateStr = typeof date === 'string' ? date : date.toISOString().split('T')[0];
        const key = STORAGE_KEYS.ACTIVITY + dateStr;
        
        return safeSet(key, {
            ...activityData,
            date: dateStr,
            timestamp: new Date().toISOString()
        });
    };

    // Cross-tab communication
    const broadcastGoalsUpdate = (goals) => {
        // Use storage events to notify other tabs
        window.dispatchEvent(new CustomEvent('fueliq-goals-updated', {
            detail: { goals }
        }));
    };

    // Listen for goal updates from other tabs
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

    // Data backup and restore
    const backupAllData = () => {
        try {
            const backup = {
                timestamp: new Date().toISOString(),
                goals: getGoals(),
                profile: getProfile(),
                meals: {},
                journals: {},
                activities: {}
            };
            
            // Get all dated data
            const allKeys = Object.keys(localStorage).filter(key => key.startsWith('fueliq_'));
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

    const restoreFromBackup = (backup) => {
        try {
            // Restore goals and profile
            setGoals(backup.goals);
            setProfile(backup.profile);
            
            // Restore meal data
            Object.entries(backup.meals || {}).forEach(([date, data]) => {
                setMealData(date, data);
            });
            
            // Restore journal data
            Object.entries(backup.journals || {}).forEach(([date, data]) => {
                setJournalData(date, data);
            });
            
            // Restore activity data
            Object.entries(backup.activities || {}).forEach(([date, data]) => {
                setActivityData(date, data);
            });
            
            console.log('✅ Data restored successfully');
            return true;
        } catch (error) {
            console.error('Restore failed:', error);
            return false;
        }
    };

    // Debug utilities
    const debugStorage = () => {
        console.log('=== FUELIQ STORAGE DEBUG ===');
        console.log('Goals:', getGoals());
        console.log('Profile:', getProfile());
        
        const allKeys = Object.keys(localStorage).filter(key => key.startsWith('fueliq_'));
        console.log('All FuelIQ keys:', allKeys);
        
        return {
            goals: getGoals(),
            profile: getProfile(),
            allKeys
        };
    };

    // Initialize data manager
    const init = () => {
        console.log('🚀 FuelIQ Data Manager initialized');
        
        // Ensure goals exist
        const goals = getGoals();
        const profile = getProfile();
        
        // Auto-save goals if they don't exist
        if (!safeGet(STORAGE_KEYS.USER_GOALS)) {
            setGoals(goals);
        }
        
        return {
            goals,
            profile
        };
    };

    // Public API
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
        
        // Utility
        backupAllData,
        restoreFromBackup,
        debugStorage,
        init,
        
        // Constants
        STORAGE_KEYS,
        DEFAULT_GOALS,
        DEFAULT_PROFILE
    };
})();

// Auto-initialize
window.FuelIQDataManager.init();

console.log('✅ Unified FuelIQ Data Manager loaded - prevents goal resets!');
