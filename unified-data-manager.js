// Enhanced Habbt Firebase Sync Manager
// Add this to your index.html right after the unified data manager script

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
    
    console.log('✅ Habbt Sync Manager initialized');
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

console.log('🔄 Habbt Firebase Sync Manager loaded!');
