// Enhanced Habbt Firebase Sync Manager with Meal Planning
// Replace your existing sync manager file with this complete version

window.HabbtSyncManager = (function() {
  'use strict';

  let isOnline = navigator.onLine;
  let syncQueue = [];
  let lastSyncTime = null;

  // Key mapping between localStorage and Firebase
  const KEY_MAPPING = {
    'habbt_profile_data': 'profile',
    'habbt_user_goals': 'goals',
    'habbt_meals_': 'meals',
    'habbt_journal_': 'journal',
    'habbt_dashboard_health_data': 'health',
    'habbt_dashboard_settings': 'settings'
  };

  // Initialize meal planning system
  function ensureMealPlanningSystem() {
    console.log('🍽️ Initializing meal planning system...');
    
    // Ensure HabbtMealPlanning exists
    if (!window.HabbtMealPlanning) {
      window.HabbtMealPlanning = {};
    }
    
    // Add comprehensive meal database
    if (!window.HabbtMealPlanning.COMPREHENSIVE_MEAL_DATABASE) {
      window.HabbtMealPlanning.COMPREHENSIVE_MEAL_DATABASE = {
        breakfast: [
          { 
            id: "big_breakfast", 
            name: "Big Protein Breakfast", 
            calories: 650, 
            protein: 35, 
            carbs: 50, 
            fat: 25, 
            fiber: 8, 
            ingredients: ["eggs", "bacon", "toast", "avocado"], 
            prepTime: 15, 
            difficulty: "easy", 
            tags: ["high-protein", "filling"] 
          },
          { 
            id: "power_smoothie", 
            name: "Power Smoothie Bowl", 
            calories: 720, 
            protein: 40, 
            carbs: 60, 
            fat: 20, 
            fiber: 10, 
            ingredients: ["protein powder", "banana", "oats", "berries"], 
            prepTime: 10, 
            difficulty: "easy", 
            tags: ["post-workout", "quick"] 
          },
          { 
            id: "protein_pancakes", 
            name: "Protein Pancakes Stack", 
            calories: 580, 
            protein: 32, 
            carbs: 65, 
            fat: 18, 
            fiber: 6, 
            ingredients: ["protein powder", "oats", "eggs", "banana"], 
            prepTime: 20, 
            difficulty: "medium", 
            tags: ["weekend", "satisfying"] 
          }
        ],
        lunch: [
          { 
            id: "big_bowl", 
            name: "Large Quinoa Power Bowl", 
            calories: 900, 
            protein: 45, 
            carbs: 80, 
            fat: 30, 
            fiber: 12, 
            ingredients: ["quinoa", "grilled chicken", "vegetables", "tahini"], 
            prepTime: 25, 
            difficulty: "medium", 
            tags: ["balanced", "meal-prep"] 
          },
          { 
            id: "hearty_salad", 
            name: "Hearty Chicken Caesar", 
            calories: 850, 
            protein: 50, 
            carbs: 35, 
            fat: 45, 
            fiber: 8, 
            ingredients: ["chicken breast", "romaine", "parmesan", "croutons"], 
            prepTime: 15, 
            difficulty: "easy", 
            tags: ["low-carb", "protein-rich"] 
          },
          { 
            id: "wrap_combo", 
            name: "Turkey Avocado Wrap & Chips", 
            calories: 780, 
            protein: 38, 
            carbs: 75, 
            fat: 35, 
            fiber: 10, 
            ingredients: ["turkey", "avocado", "tortilla", "baked chips"], 
            prepTime: 10, 
            difficulty: "easy", 
            tags: ["portable", "quick"] 
          }
        ],
        dinner: [
          { 
            id: "big_stir_fry", 
            name: "Large Beef Stir Fry", 
            calories: 850, 
            protein: 45, 
            carbs: 60, 
            fat: 35, 
            fiber: 8, 
            ingredients: ["lean beef", "brown rice", "mixed vegetables", "teriyaki"], 
            prepTime: 25, 
            difficulty: "medium", 
            tags: ["iron-rich", "vegetables"] 
          },
          { 
            id: "salmon_dinner", 
            name: "Salmon with Sweet Potato", 
            calories: 920, 
            protein: 42, 
            carbs: 75, 
            fat: 35, 
            fiber: 10, 
            ingredients: ["salmon fillet", "roasted sweet potato", "asparagus"], 
            prepTime: 30, 
            difficulty: "medium", 
            tags: ["omega-3", "heart-healthy"] 
          },
          { 
            id: "pasta_dish", 
            name: "Chicken Alfredo Pasta", 
            calories: 880, 
            protein: 40, 
            carbs: 85, 
            fat: 32, 
            fiber: 4, 
            ingredients: ["chicken breast", "fettuccine", "alfredo sauce", "broccoli"], 
            prepTime: 20, 
            difficulty: "easy", 
            tags: ["comfort-food", "satisfying"] 
          }
        ],
        snacks: [
          { 
            id: "protein_snack", 
            name: "Protein Bar & Nuts", 
            calories: 280, 
            protein: 15, 
            carbs: 20, 
            fat: 15, 
            fiber: 5, 
            ingredients: ["protein bar", "mixed almonds"], 
            prepTime: 1, 
            difficulty: "easy", 
            tags: ["quick", "portable"] 
          },
          { 
            id: "greek_yogurt_big", 
            name: "Large Greek Yogurt Bowl", 
            calories: 320, 
            protein: 22, 
            carbs: 35, 
            fat: 12, 
            fiber: 4, 
            ingredients: ["greek yogurt", "granola", "berries", "honey"], 
            prepTime: 3, 
            difficulty: "easy", 
            tags: ["probiotics", "antioxidants"] 
          },
          { 
            id: "apple_peanut_butter", 
            name: "Apple with Peanut Butter", 
            calories: 250, 
            protein: 8, 
            carbs: 28, 
            fat: 16, 
            fiber: 6, 
            ingredients: ["large apple", "natural peanut butter"], 
            prepTime: 2, 
            difficulty: "easy", 
            tags: ["natural", "fiber"] 
          }
        ]
      };
      console.log('✅ Meal database initialized with', 
        Object.keys(window.HabbtMealPlanning.COMPREHENSIVE_MEAL_DATABASE)
          .map(cat => `${cat}: ${window.HabbtMealPlanning.COMPREHENSIVE_MEAL_DATABASE[cat].length}`)
          .join(', ')
      );
    }
    
    // Add findSuitableMeals function
    if (!window.HabbtMealPlanning.findSuitableMeals) {
      window.HabbtMealPlanning.findSuitableMeals = function(category, preferences, maxCalories, maxProtein) {
        console.log(`🔍 Finding ${category} meals (max: ${maxCalories} cal, ${maxProtein}g protein)`);
        
        const database = window.HabbtMealPlanning.COMPREHENSIVE_MEAL_DATABASE;
        if (!database || !database[category]) {
          console.log(`❌ No ${category} meals in database`);
          return [];
        }
        
        const results = database[category].filter(meal => {
          const calorieOk = meal.calories <= (maxCalories + 200); // Extra flexibility for high targets
          const proteinOk = !maxProtein || meal.protein <= (maxProtein + 10); // Protein flexibility
          
          console.log(`  ${meal.name}: ${meal.calories} cal, ${meal.protein}g protein (${calorieOk && proteinOk ? 'MATCH' : 'NO MATCH'})`);
          return calorieOk && proteinOk;
        });
        
        console.log(`✅ Found ${results.length} suitable ${category} meals`);
        return results;
      };
      console.log('✅ findSuitableMeals function added');
    }
    
    // Ensure window variables for meal planning
    const goals = JSON.parse(localStorage.getItem('habbt_user_goals') || '{"calories":2890,"protein":158,"carbs":347,"fat":96}');
    const profile = JSON.parse(localStorage.getItem('habbt_profile_data') || '{}');
    
    // Lock these variables to prevent overwrites
    Object.defineProperty(window, 'userGoals', {
      value: goals,
      writable: true,
      configurable: true
    });
    
    Object.defineProperty(window, 'userPreferences', {
      value: profile.preferences || {},
      writable: true,
      configurable: true
    });
    
    console.log('✅ Meal planning system ready with goals:', goals);
    
    // Test the system
    const testResults = window.HabbtMealPlanning.findSuitableMeals('breakfast', {}, 1000, 50);
    console.log(`🧪 System test: Found ${testResults.length} breakfast options`);
  }

  // Initialize sync manager
  function init() {
    console.log('🔄 Initializing Habbt Firebase Sync Manager...');
    
    // Monitor online/offline status
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Monitor localStorage changes
    window.addEventListener('storage', handleStorageChange);
    
    // Periodic sync
    setInterval(performPeriodicSync, 30000); // Every 30 seconds
    
    // Initialize meal planning system
    ensureMealPlanningSystem();
    
    console.log('✅ Habbt Sync Manager initialized with meal planning');
  }

  // Enhanced save with immediate Firebase sync
  async function saveData(key, data, skipSync = false) {
    try {
      // Save to localStorage first (immediate access)
      localStorage.setItem(key, JSON.stringify(data));
      console.log(`💾 Saved locally: ${key}`);
      
      // Queue for Firebase sync if user is logged in
      if (!skipSync && window.firebaseAuth?.currentUser) {
        await syncToFirebase(key, data);
      }
      
      return true;
    } catch (error) {
      console.error(`❌ Failed to save ${key}:`, error);
      return false;
    }
  }

  // Enhanced load with Firebase fallback
  async function loadData(key, defaultValue = null) {
    try {
      // Try localStorage first
      const localData = localStorage.getItem(key);
      if (localData) {
        const parsed = JSON.parse(localData);
        console.log(`📁 Loaded locally: ${key}`);
        return parsed;
      }
      
      // Fallback to Firebase if user is logged in
      if (window.firebaseAuth?.currentUser) {
        console.log(`☁️ Loading from Firebase: ${key}`);
        const firebaseData = await loadFromFirebase(key);
        if (firebaseData) {
          // Save back to localStorage for faster access
          localStorage.setItem(key, JSON.stringify(firebaseData));
          console.log(`✅ Restored from Firebase: ${key}`);
          return firebaseData;
        }
      }
      
      return defaultValue;
    } catch (error) {
      console.error(`❌ Failed to load ${key}:`, error);
      return defaultValue;
    }
  }

  // Sync specific data to Firebase
  async function syncToFirebase(key, data) {
    if (!window.firebaseAuth?.currentUser || !window.CloudDataManager) {
      console.log('⏳ Queueing for sync:', key);
      syncQueue.push({ key, data, action: 'save' });
      return false;
    }

    try {
      const userId = window.firebaseAuth.currentUser.uid;
      const firebaseKey = getFirebaseKey(key);
      
      if (key === 'habbt_profile_data') {
        await window.CloudDataManager.saveProfile(userId, data);
      } else if (key === 'habbt_user_goals') {
        // Save goals as part of profile
        const existingProfile = await window.CloudDataManager.loadProfile(userId) || {};
        await window.CloudDataManager.saveProfile(userId, { ...existingProfile, goals: data });
      } else if (key.startsWith('habbt_meals_')) {
        const date = key.replace('habbt_meals_', '');
        await window.CloudDataManager.saveMealData(userId, date, data);
      } else if (key.startsWith('habbt_journal_')) {
        const date = key.replace('habbt_journal_', '');
        await saveJournalToFirebase(userId, date, data);
      } else {
        // Generic data save
        await saveGenericDataToFirebase(userId, firebaseKey, data);
      }
      
      console.log(`☁️ Synced to Firebase: ${key}`);
      lastSyncTime = new Date().toISOString();
      return true;
    } catch (error) {
      console.error(`❌ Firebase sync failed for ${key}:`, error);
      syncQueue.push({ key, data, action: 'save' });
      return false;
    }
  }

  // Load specific data from Firebase
  async function loadFromFirebase(key) {
    if (!window.firebaseAuth?.currentUser || !window.CloudDataManager) {
      return null;
    }

    try {
      const userId = window.firebaseAuth.currentUser.uid;
      
      if (key === 'habbt_profile_data') {
        return await window.CloudDataManager.loadProfile(userId);
      } else if (key === 'habbt_user_goals') {
        const profile = await window.CloudDataManager.loadProfile(userId);
        return profile?.goals || null;
      } else if (key.startsWith('habbt_meals_')) {
        const date = key.replace('habbt_meals_', '');
        return await window.CloudDataManager.loadMealData(userId, date);
      } else if (key.startsWith('habbt_journal_')) {
        const date = key.replace('habbt_journal_', '');
        return await loadJournalFromFirebase(userId, date);
      } else {
        const firebaseKey = getFirebaseKey(key);
        return await loadGenericDataFromFirebase(userId, firebaseKey);
      }
    } catch (error) {
      console.error(`❌ Firebase load failed for ${key}:`, error);
      return null;
    }
  }

  // Journal-specific Firebase functions
  async function saveJournalToFirebase(userId, date, journalData) {
    const docRef = window.firebaseUtils.doc(window.firebaseDB, 'userJournals', `${userId}_${date}`);
    await window.firebaseUtils.setDoc(docRef, {
      ...journalData,
      userId,
      date,
      updatedAt: new Date().toISOString()
    });
  }

  async function loadJournalFromFirebase(userId, date) {
    const docRef = window.firebaseUtils.doc(window.firebaseDB, 'userJournals', `${userId}_${date}`);
    const docSnap = await window.firebaseUtils.getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  }

  // Generic data Firebase functions
  async function saveGenericDataToFirebase(userId, firebaseKey, data) {
    const docRef = window.firebaseUtils.doc(window.firebaseDB, 'userData', `${userId}_${firebaseKey}`);
    await window.firebaseUtils.setDoc(docRef, {
      data,
      updatedAt: new Date().toISOString()
    });
  }

  async function loadGenericDataFromFirebase(userId, firebaseKey) {
    const docRef = window.firebaseUtils.doc(window.firebaseDB, 'userData', `${userId}_${firebaseKey}`);
    const docSnap = await window.firebaseUtils.getDoc(docRef);
    return docSnap.exists() ? docSnap.data().data : null;
  }

  // Utility functions
  function getFirebaseKey(localKey) {
    return KEY_MAPPING[localKey] || localKey.replace('habbt_', '');
  }

  function handleOnline() {
    console.log('🌐 Connection restored - processing sync queue...');
    isOnline = true;
    processSyncQueue();
  }

  function handleOffline() {
    console.log('📵 Connection lost - queuing changes...');
    isOnline = false;
  }

  function handleStorageChange(event) {
    // Sync changes from other tabs
    if (event.key?.startsWith('habbt_') && event.newValue) {
      try {
        const data = JSON.parse(event.newValue);
        syncToFirebase(event.key, data);
      } catch (error) {
        console.warn('Failed to sync storage change:', error);
      }
    }
  }

  // Process queued sync operations
  async function processSyncQueue() {
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
  }

  // Periodic sync to catch any missed changes
  async function performPeriodicSync() {
    if (!isOnline || !window.firebaseAuth?.currentUser) {
      return;
    }

    // Sync any unsaved localStorage changes
    const habbtKeys = Object.keys(localStorage).filter(key => key.startsWith('habbt_'));
    for (const key of habbtKeys) {
      try {
        const data = JSON.parse(localStorage.getItem(key));
        // Only sync if data is recent (to avoid unnecessary uploads)
        const shouldSync = !lastSyncTime || (Date.now() - new Date(lastSyncTime).getTime()) > 300000; // 5 minutes
        if (shouldSync) {
          await syncToFirebase(key, data);
        }
      } catch (error) {
        // Skip invalid JSON
      }
    }
  }

  // Full data restore from Firebase
  async function restoreAllDataFromFirebase() {
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
        await saveData('habbt_profile_data', profile, true);
        if (profile.goals) {
          await saveData('habbt_user_goals', profile.goals, true);
        }
      }

      // Restore recent meal data (last 30 days)
      const today = new Date();
      for (let i = 0; i < 30; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        const mealData = await window.CloudDataManager.loadMealData(userId, dateStr);
        if (mealData) {
          await saveData(`habbt_meals_${dateStr}`, mealData, true);
        }

        const journalData = await loadJournalFromFirebase(userId, dateStr);
        if (journalData) {
          await saveData(`habbt_journal_${dateStr}`, journalData, true);
        }
      }

      console.log('✅ Data restore completed');
      
      // Reinitialize meal planning with restored data
      ensureMealPlanningSystem();
      
      return true;
    } catch (error) {
      console.error('❌ Data restore failed:', error);
      return false;
    }
  }

  // Enhanced wrapper for existing localStorage functions
  function wrapLocalStorage() {
    const originalSetItem = localStorage.setItem.bind(localStorage);
    
    localStorage.setItem = function(key, value) {
      originalSetItem(key, value);
      
      // Auto-sync Habbt data to Firebase
      if (key.startsWith('habbt_')) {
        try {
          const data = JSON.parse(value);
          syncToFirebase(key, data);
        } catch (error) {
          // Skip non-JSON values
        }
      }
    };
  }

  // Public API
  return {
    init,
    saveData,
    loadData,
    syncToFirebase,
    loadFromFirebase,
    restoreAllDataFromFirebase,
    processSyncQueue,
    ensureMealPlanningSystem,
    
    // Status
    getStatus: () => ({
      isOnline,
      queueLength: syncQueue.length,
      lastSync: lastSyncTime,
      hasUser: !!window.firebaseAuth?.currentUser
    }),
    
    // Debug
    debugSync: () => {
      console.log('=== HABBT SYNC DEBUG ===');
      console.log('Online:', isOnline);
      console.log('Queue length:', syncQueue.length);
      console.log('Last sync:', lastSyncTime);
      console.log('Firebase user:', window.firebaseAuth?.currentUser?.email);
      console.log('Sync queue:', syncQueue);
      console.log('Meal planning ready:', !!window.HabbtMealPlanning?.findSuitableMeals);
      console.log('User goals:', window.userGoals);
    }
  };
})();

// Auto-initialize when Firebase is ready
function initSyncWhenReady() {
  if (window.firebaseAuth && window.firebaseDB) {
    window.HabbtSyncManager.init();
    
    // Restore data on login
    window.firebaseUtils.onAuthStateChanged(window.firebaseAuth, async (user) => {
      if (user) {
        console.log('👤 User logged in - checking for data restore...');
        
        // Check if we need to restore data (localStorage mostly empty)
        const hasLocalData = localStorage.getItem('habbt_profile_data') || localStorage.getItem('habbt_user_goals');
        
        if (!hasLocalData) {
          console.log('📥 Restoring data from Firebase...');
          await window.HabbtSyncManager.restoreAllDataFromFirebase();
          
          // Trigger a refresh of the current view to show restored data
          if (window.setCurrentView && typeof window.setCurrentView === 'function') {
            const currentView = document.querySelector('.bg-teal-500')?.textContent?.toLowerCase() || 'dashboard';
            setTimeout(() => window.setCurrentView(currentView), 1000);
          }
        }
      }
    });
  } else {
    setTimeout(initSyncWhenReady, 100);
  }
}

// Start initialization
initSyncWhenReady();

console.log('🔄 Habbt Firebase Sync Manager with Meal Planning loaded!');
