// enhanced-demo-system.js - Terry Graham Demo Integration for All FuelIQ Modules
(function() {
  'use strict';

  // Terry Graham Demo Profile Data
  const TERRY_GRAHAM_PROFILE = {
    // Basic Profile
    name: 'Terry Graham',
    age: '34',
    weight: '165',
    height: '70',
    gender: 'male',
    activityLevel: 'moderate',
    goal: 'maintenance',
    location: 'San Francisco, CA',
    
    // Dietary Preferences
    dietaryRestrictions: ['Pescatarian'],
    allergies: ['Shellfish'],
    healthConcerns: ['High Cholesterol'],
    antiBloutPreference: true,
    
    // Food Preferences
    foodsILove: ['Salmon', 'Quinoa', 'Spinach', 'Greek Yogurt', 'Avocado', 'Sweet Potatoes', 'Berries', 'Nuts'],
    foodsIAvoid: ['Red Meat', 'Fried Foods', 'Processed Snacks'],
    cuisinePreferences: ['Mediterranean', 'Asian', 'Italian', 'Japanese'],
    
    // Goals
    dailyCalories: 2200,
    protein: 165,
    carbs: 275,
    fat: 78,
    water: 110
  };

  // Terry's Wearable Data (Garmin Forerunner)
  const TERRY_WEARABLE_DATA = {
    connectedDevices: [
      {
        deviceId: 'garmin_terry_demo',
        deviceName: 'Garmin Forerunner 955',
        type: 'garmin',
        connected: true,
        lastSync: new Date().toISOString()
      }
    ],
    healthData: {
      today: {
        steps: 8247,
        calories: 445,
        distance: 4.2,
        activeMinutes: 67,
        heartRate: {
          resting: 62,
          max: 185,
          current: 78
        },
        sleep: {
          totalSleep: 465, // 7h 45m
          deepSleep: 105,
          lightSleep: 285,
          awake: 25,
          sleepScore: 83
        },
        workouts: [
          {
            type: 'Morning Run',
            duration: 35,
            calories: 320,
            timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
          }
        ]
      },
      history: []
    },
    lastSync: new Date().toISOString(),
    settings: {
      autoSync: true,
      syncInterval: 300000,
      adjustCaloriesForActivity: true
    }
  };

  // Terry's Pantry Items
  const TERRY_PANTRY_ITEMS = [
    {
      id: 'terry_salmon',
      name: 'Wild Caught Salmon',
      brand: 'Whole Foods',
      category: 'Meat & Seafood',
      quantity: 2,
      unit: 'fillets',
      expiryDate: '2025-06-20',
      purchaseDate: '2025-06-10',
      notes: 'Fresh from fish counter',
      addedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'terry_quinoa',
      name: 'Organic Tri-Color Quinoa',
      brand: 'Ancient Harvest',
      category: 'Pantry Staples',
      quantity: 1,
      unit: 'bag',
      expiryDate: '2026-06-15',
      purchaseDate: '2025-06-05',
      notes: 'Great for meal prep',
      addedDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'terry_spinach',
      name: 'Organic Baby Spinach',
      brand: 'Earthbound Farm',
      category: 'Produce',
      quantity: 2,
      unit: 'bags',
      expiryDate: '2025-06-18',
      purchaseDate: '2025-06-12',
      notes: 'Pre-washed and ready',
      addedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'terry_greek_yogurt',
      name: 'Greek Yogurt Plain',
      brand: 'Fage',
      category: 'Dairy',
      quantity: 1,
      unit: 'container',
      expiryDate: '2025-06-25',
      purchaseDate: '2025-06-10',
      notes: '0% fat, high protein',
      addedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'terry_avocado',
      name: 'Organic Avocados',
      brand: '',
      category: 'Produce',
      quantity: 4,
      unit: 'pieces',
      expiryDate: '2025-06-16',
      purchaseDate: '2025-06-13',
      notes: 'Perfect ripeness',
      addedDate: new Date().toISOString()
    },
    {
      id: 'terry_sweet_potato',
      name: 'Organic Sweet Potatoes',
      brand: '',
      category: 'Produce',
      quantity: 3,
      unit: 'lbs',
      expiryDate: '2025-06-30',
      purchaseDate: '2025-06-08',
      notes: 'Great for roasting',
      addedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'terry_blueberries',
      name: 'Organic Blueberries',
      brand: 'Driscoll\'s',
      category: 'Produce',
      quantity: 2,
      unit: 'containers',
      expiryDate: '2025-06-17',
      purchaseDate: '2025-06-12',
      notes: 'Perfect for smoothies',
      addedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'terry_almonds',
      name: 'Raw Almonds',
      brand: 'Blue Diamond',
      category: 'Snacks',
      quantity: 1,
      unit: 'bag',
      expiryDate: '2025-12-15',
      purchaseDate: '2025-06-01',
      notes: 'Unsalted, raw',
      addedDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'terry_olive_oil',
      name: 'Extra Virgin Olive Oil',
      brand: 'California Olive Ranch',
      category: 'Pantry Staples',
      quantity: 1,
      unit: 'bottle',
      expiryDate: '2026-03-15',
      purchaseDate: '2025-05-20',
      notes: 'Cold pressed',
      addedDate: new Date(Date.now() - 24 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'terry_brown_rice',
      name: 'Organic Brown Rice',
      brand: 'Lundberg',
      category: 'Pantry Staples',
      quantity: 1,
      unit: 'bag',
      expiryDate: '2026-01-15',
      purchaseDate: '2025-05-25',
      notes: 'Short grain',
      addedDate: new Date(Date.now() - 19 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'terry_eggs',
      name: 'Organic Free-Range Eggs',
      brand: 'Vital Farms',
      category: 'Dairy',
      quantity: 1,
      unit: 'dozen',
      expiryDate: '2025-06-28',
      purchaseDate: '2025-06-10',
      notes: 'Pasture-raised',
      addedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'terry_lemon',
      name: 'Organic Lemons',
      brand: '',
      category: 'Produce',
      quantity: 6,
      unit: 'pieces',
      expiryDate: '2025-06-22',
      purchaseDate: '2025-06-08',
      notes: 'Great for cooking',
      addedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'terry_broccoli',
      name: 'Fresh Broccoli Crowns',
      brand: '',
      category: 'Produce',
      quantity: 2,
      unit: 'bunches',
      expiryDate: '2025-06-19',
      purchaseDate: '2025-06-12',
      notes: 'Organic',
      addedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'terry_oats',
      name: 'Organic Rolled Oats',
      brand: 'Bob\'s Red Mill',
      category: 'Pantry Staples',
      quantity: 1,
      unit: 'container',
      expiryDate: '2025-12-30',
      purchaseDate: '2025-05-15',
      notes: 'Old-fashioned',
      addedDate: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'terry_coconut_milk',
      name: 'Coconut Milk',
      brand: 'Thai Kitchen',
      category: 'Pantry Staples',
      quantity: 3,
      unit: 'cans',
      expiryDate: '2026-08-15',
      purchaseDate: '2025-06-01',
      notes: 'Full fat, unsweetened',
      addedDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  // Terry's Weight Journey Data
  const TERRY_WEIGHT_DATA = {
    entries: [
      { weight: 168.2, date: '2025-05-15', timestamp: new Date('2025-05-15').getTime() },
      { weight: 167.8, date: '2025-05-22', timestamp: new Date('2025-05-22').getTime() },
      { weight: 167.1, date: '2025-05-29', timestamp: new Date('2025-05-29').getTime() },
      { weight: 166.5, date: '2025-06-05', timestamp: new Date('2025-06-05').getTime() },
      { weight: 165.8, date: '2025-06-12', timestamp: new Date('2025-06-12').getTime() },
      { weight: 165.2, date: '2025-06-13', timestamp: new Date('2025-06-13').getTime() }
    ],
    startWeight: 168.2,
    targetWeight: 162,
    targetDate: '2025-08-15',
    startDate: '2025-05-15'
  };

  // Terry's Recent Meal History
  const TERRY_MEAL_HISTORY = {
    '2025-06-13': {
      breakfast: [
        {
          id: Date.now() - 1000,
          fdcId: 'demo_oatmeal',
          name: 'Overnight Oats with Blueberries',
          servingSize: 250,
          calories: 320,
          protein: 12,
          carbs: 58,
          fat: 8,
          fiber: 8
        }
      ],
      lunch: [
        {
          id: Date.now() - 2000,
          fdcId: 'demo_salmon_salad',
          name: 'Salmon Spinach Salad',
          servingSize: 300,
          calories: 425,
          protein: 35,
          carbs: 12,
          fat: 28,
          fiber: 6
        }
      ],
      dinner: [
        {
          id: Date.now() - 3000,
          fdcId: 'demo_quinoa_bowl',
          name: 'Quinoa Power Bowl',
          servingSize: 350,
          calories: 485,
          protein: 18,
          carbs: 68,
          fat: 16,
          fiber: 12
        }
      ],
      snacks: [
        {
          id: Date.now() - 4000,
          fdcId: 'demo_almonds',
          name: 'Raw Almonds',
          servingSize: 30,
          calories: 170,
          protein: 6,
          carbs: 6,
          fat: 15,
          fiber: 4
        }
      ]
    }
  };

  // Terry's Meal Plan
  const TERRY_MEAL_PLAN = {
    '2025-06-14': {
      breakfast: {
        name: 'Green Smoothie Bowl',
        ingredients: [
          { name: 'Spinach', amount: '2 cups', unit: 'cups', category: 'vegetables' },
          { name: 'Blueberries', amount: '1 cup', unit: 'cup', category: 'fruits' },
          { name: 'Greek Yogurt', amount: '1/2 cup', unit: 'cup', category: 'dairy' },
          { name: 'Almond Butter', amount: '1 tbsp', unit: 'tbsp', category: 'fats' }
        ],
        calories: 285,
        protein: 18,
        carbs: 35,
        fat: 12,
        prepTime: 10
      },
      lunch: {
        name: 'Mediterranean Quinoa Salad',
        ingredients: [
          { name: 'Quinoa', amount: '3/4 cup', unit: 'cup', category: 'grains' },
          { name: 'Cucumber', amount: '1 medium', unit: 'piece', category: 'vegetables' },
          { name: 'Tomatoes', amount: '1 cup', unit: 'cup', category: 'vegetables' },
          { name: 'Olive Oil', amount: '2 tbsp', unit: 'tbsp', category: 'fats' },
          { name: 'Lemon', amount: '1/2', unit: 'piece', category: 'fruits' }
        ],
        calories: 410,
        protein: 14,
        carbs: 52,
        fat: 18,
        prepTime: 25
      },
      dinner: {
        name: 'Herb-Crusted Salmon with Sweet Potato',
        ingredients: [
          { name: 'Salmon Fillet', amount: '6 oz', unit: 'oz', category: 'protein' },
          { name: 'Sweet Potato', amount: '1 large', unit: 'piece', category: 'vegetables' },
          { name: 'Broccoli', amount: '2 cups', unit: 'cups', category: 'vegetables' },
          { name: 'Olive Oil', amount: '1 tbsp', unit: 'tbsp', category: 'fats' }
        ],
        calories: 565,
        protein: 42,
        carbs: 35,
        fat: 28,
        prepTime: 35
      }
    },
    '2025-06-15': {
      breakfast: {
        name: 'Avocado Toast with Eggs',
        ingredients: [
          { name: 'Whole Grain Bread', amount: '2 slices', unit: 'slices', category: 'grains' },
          { name: 'Avocado', amount: '1 medium', unit: 'piece', category: 'fruits' },
          { name: 'Eggs', amount: '2', unit: 'pieces', category: 'protein' },
          { name: 'Spinach', amount: '1 cup', unit: 'cup', category: 'vegetables' }
        ],
        calories: 420,
        protein: 22,
        carbs: 28,
        fat: 26,
        prepTime: 15
      },
      lunch: {
        name: 'Asian Quinoa Stir-Fry',
        ingredients: [
          { name: 'Quinoa', amount: '3/4 cup', unit: 'cup', category: 'grains' },
          { name: 'Mixed Vegetables', amount: '2 cups', unit: 'cups', category: 'vegetables' },
          { name: 'Sesame Oil', amount: '1 tbsp', unit: 'tbsp', category: 'fats' },
          { name: 'Edamame', amount: '1/2 cup', unit: 'cup', category: 'protein' }
        ],
        calories: 385,
        protein: 16,
        carbs: 48,
        fat: 16,
        prepTime: 20
      },
      dinner: {
        name: 'Coconut Curry Fish',
        ingredients: [
          { name: 'White Fish', amount: '6 oz', unit: 'oz', category: 'protein' },
          { name: 'Coconut Milk', amount: '1/2 cup', unit: 'cup', category: 'dairy' },
          { name: 'Brown Rice', amount: '3/4 cup', unit: 'cup', category: 'grains' },
          { name: 'Spinach', amount: '2 cups', unit: 'cups', category: 'vegetables' }
        ],
        calories: 520,
        protein: 38,
        carbs: 42,
        fat: 22,
        prepTime: 30
      }
    }
  };

  // Demo Mode Controller
  class TerryGrahamDemoController {
    constructor() {
      this.isEnabled = false;
      this.originalData = {};
      this.modules = new Set();
    }

    // Enable demo mode
    enable() {
      if (this.isEnabled) return;
      
      console.log('🎭 Enabling Terry Graham Demo Mode...');
      this.isEnabled = true;
      
      // Backup original data
      this.backupOriginalData();
      
      // Apply Terry's data to all storage
      this.applyTerryData();
      
      // Notify all registered modules
      this.notifyModules('demoEnabled');
      
      // Show demo indicator
      this.showDemoIndicator();
      
      console.log('✅ Terry Graham Demo Mode Active');
    }

    // Disable demo mode
    disable() {
      if (!this.isEnabled) return;
      
      console.log('🔄 Disabling Terry Graham Demo Mode...');
      this.isEnabled = false;
      
      // Restore original data
      this.restoreOriginalData();
      
      // Notify all registered modules
      this.notifyModules('demoDisabled');
      
      // Hide demo indicator
      this.hideDemoIndicator();
      
      console.log('✅ Demo Mode Disabled - Personal Data Restored');
    }

    // Toggle demo mode
    toggle() {
      if (this.isEnabled) {
        this.disable();
      } else {
        this.enable();
      }
    }

    // Register a module for demo notifications
    registerModule(moduleName, refreshCallback) {
      this.modules.add({ name: moduleName, refresh: refreshCallback });
      console.log(`📋 Registered module: ${moduleName} for demo mode`);
    }

    // Notify all modules of demo state change
    notifyModules(action) {
      this.modules.forEach(module => {
        try {
          if (typeof module.refresh === 'function') {
            module.refresh(action, this.isEnabled);
          }
        } catch (e) {
          console.warn(`Warning: Could not notify module ${module.name}:`, e);
        }
      });
    }

    // Backup original user data
    backupOriginalData() {
      const keys = [
        'fueliq_user_profile',
        'fueliq_user_goals',
        'fueliq_pantry',
        'fueliq_wearables',
        'fueliq_weight_journey',
        'fueliq_meal_plan',
        'fueliq_recent_foods'
      ];

      keys.forEach(key => {
        try {
          const data = localStorage.getItem(key);
          if (data) {
            this.originalData[key] = data;
          }
        } catch (e) {
          console.warn(`Could not backup ${key}:`, e);
        }
      });

      // Backup meal data for last 7 days
      for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        const mealKey = `fueliq_meals_${dateStr}`;
        
        try {
          const data = localStorage.getItem(mealKey);
          if (data) {
            this.originalData[mealKey] = data;
          }
        } catch (e) {
          console.warn(`Could not backup ${mealKey}:`, e);
        }
      }
    }

    // Apply Terry Graham's data
    applyTerryData() {
      try {
        // User Profile
        localStorage.setItem('fueliq_user_profile', JSON.stringify(TERRY_GRAHAM_PROFILE));
        
        // User Goals
        localStorage.setItem('fueliq_user_goals', JSON.stringify({
          dailyCalories: TERRY_GRAHAM_PROFILE.dailyCalories,
          protein: TERRY_GRAHAM_PROFILE.protein,
          carbs: TERRY_GRAHAM_PROFILE.carbs,
          fat: TERRY_GRAHAM_PROFILE.fat
        }));

        // Pantry Data
        localStorage.setItem('fueliq_pantry', JSON.stringify({
          items: TERRY_PANTRY_ITEMS,
          categories: ['Produce', 'Dairy', 'Meat & Seafood', 'Pantry Staples', 'Frozen', 'Beverages', 'Snacks', 'Other']
        }));

        // Wearables Data
        localStorage.setItem('fueliq_wearables', JSON.stringify(TERRY_WEARABLE_DATA));

        // Weight Journey Data
        localStorage.setItem('fueliq_weight_journey', JSON.stringify(TERRY_WEIGHT_DATA));

        // Meal Plan Data
        localStorage.setItem('fueliq_meal_plan', JSON.stringify(TERRY_MEAL_PLAN));

        // Recent Foods (for meals tab)
        const recentFoods = [
          { fdcId: 'demo_salmon', name: 'Wild Caught Salmon', calories: 206 },
          { fdcId: 'demo_quinoa', name: 'Organic Quinoa', calories: 222 },
          { fdcId: 'demo_spinach', name: 'Fresh Spinach', calories: 23 },
          { fdcId: 'demo_greek_yogurt', name: 'Greek Yogurt', calories: 100 },
          { fdcId: 'demo_avocado', name: 'Avocado', calories: 320 }
        ];
        localStorage.setItem('fueliq_recent_foods', JSON.stringify(recentFoods));

        // Meal History
        Object.entries(TERRY_MEAL_HISTORY).forEach(([date, meals]) => {
          localStorage.setItem(`fueliq_meals_${date}`, JSON.stringify(meals));
        });

        console.log('✅ Terry Graham data applied to all modules');
      } catch (e) {
        console.error('Error applying Terry Graham data:', e);
      }
    }

    // Restore original user data
    restoreOriginalData() {
      try {
        // Clear Terry's data first
        this.clearTerryData();
        
        // Restore backed up data
        Object.entries(this.originalData).forEach(([key, data]) => {
          localStorage.setItem(key, data);
        });

        console.log('✅ Original user data restored');
      } catch (e) {
        console.error('Error restoring original data:', e);
      }
    }

    // Clear Terry's demo data
    clearTerryData() {
      const keys = [
        'fueliq_user_profile',
        'fueliq_user_goals',
        'fueliq_pantry',
        'fueliq_wearables',
        'fueliq_weight_journey',
        'fueliq_meal_plan',
        'fueliq_recent_foods'
      ];

      keys.forEach(key => {
        try {
          localStorage.removeItem(key);
        } catch (e) {
          console.warn(`Could not clear ${key}:`, e);
        }
      });

      // Clear meal data
      Object.keys(TERRY_MEAL_HISTORY).forEach(date => {
        try {
          localStorage.removeItem(`fueliq_meals_${date}`);
        } catch (e) {
          console.warn(`Could not clear meal data for ${date}:`, e);
        }
      });
    }

    // Show demo mode indicator
    showDemoIndicator() {
      // Remove existing indicator
      this.hideDemoIndicator();
      
      const indicator = document.createElement('div');
      indicator.id = 'terry-demo-indicator';
      indicator.className = 'fixed top-4 right-4 z-50 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-xl shadow-lg flex items-center space-x-3 animate-pulse';
      indicator.innerHTML = `
        <div class="flex items-center space-x-2">
          <span class="text-lg">🎭</span>
          <span class="font-bold">DEMO MODE</span>
          <span class="text-sm opacity-90">Terry Graham</span>
        </div>
        <button onclick="window.TerryDemo.toggle()" 
                class="ml-3 bg-white/20 hover:bg-white/30 px-3 py-1 rounded-lg text-sm font-medium transition-colors">
          Exit Demo
        </button>
      `;
      
      document.body.appendChild(indicator);
    }

    // Hide demo mode indicator
    hideDemoIndicator() {
      const indicator = document.getElementById('terry-demo-indicator');
      if (indicator) {
        indicator.remove();
      }
    }

    // Get Terry's profile data
    getTerryProfile() {
      return { ...TERRY_GRAHAM_PROFILE };
    }

    // Get Terry's wearable data
    getTerryWearableData() {
      return { ...TERRY_WEARABLE_DATA };
    }

    // Get Terry's pantry items
    getTerryPantryItems() {
      return [...TERRY_PANTRY_ITEMS];
    }

    // Get Terry's weight data
    getTerryWeightData() {
      return { ...TERRY_WEIGHT_DATA };
    }

    // Get Terry's meal plan
    getTerryMealPlan() {
      return { ...TERRY_MEAL_PLAN };
    }

    // Check if demo mode is enabled
    isDemoEnabled() {
      return this.isEnabled;
    }
  }

  // Create global demo controller
  window.TerryDemo = new TerryGrahamDemoController();

  // Demo toggle function for UI
  window.toggleTerryDemo = () => {
    window.TerryDemo.toggle();
    
    // Trigger page refresh for React components
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  // Demo mode utilities
  window.TerryDemo.utils = {
    // Add demo toggle button to navigation
    addDemoToggle: (containerId = 'demo-toggle-container') => {
      const container = document.getElementById(containerId) || document.body;
      
      const toggleButton = document.createElement('button');
      toggleButton.id = 'demo-toggle-btn';
      toggleButton.className = 'fixed bottom-4 right-4 z-50 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-3 rounded-xl shadow-lg font-bold transition-all duration-200 transform hover:scale-105';
      toggleButton.innerHTML = window.TerryDemo.isDemoEnabled() 
        ? '🎭 Exit Demo' 
        : '🎭 Demo Mode';
      
      toggleButton.addEventListener('click', () => {
        window.TerryDemo.toggle();
        
        // Update button text
        toggleButton.innerHTML = window.TerryDemo.isDemoEnabled() 
          ? '🎭 Exit Demo' 
          : '🎭 Demo Mode';
        
        // Refresh page to update all components
        setTimeout(() => {
          window.location.reload();
        }, 500);
      });
      
      container.appendChild(toggleButton);
    },

    // Show demo info modal
    showDemoInfo: () => {
      const modal = document.createElement('div');
      modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4';
      modal.innerHTML = `
        <div class="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8">
          <div class="text-center mb-6">
            <div class="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span class="text-4xl text-white">🎭</span>
            </div>
            <h2 class="text-2xl font-bold text-gray-800 mb-2">Terry Graham Demo</h2>
            <p class="text-gray-600">Experience FuelIQ with realistic demo data</p>
          </div>
          
          <div class="space-y-4 mb-6">
            <div class="bg-purple-50 rounded-2xl p-4">
              <h3 class="font-bold text-purple-800 mb-2">👤 Profile</h3>
              <p class="text-purple-700 text-sm">34-year-old pescatarian from San Francisco</p>
            </div>
            
            <div class="bg-blue-50 rounded-2xl p-4">
              <h3 class="font-bold text-blue-800 mb-2">⌚ Wearables</h3>
              <p class="text-blue-700 text-sm">Garmin Forerunner with real fitness data</p>
            </div>
            
            <div class="bg-green-50 rounded-2xl p-4">
              <h3 class="font-bold text-green-800 mb-2">🥗 Pantry & Meals</h3>
              <p class="text-green-700 text-sm">15 pantry items + meal plans & history</p>
            </div>
          </div>
          
          <button onclick="this.parentElement.parentElement.remove()" 
                  class="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl hover:from-purple-600 hover:to-pink-600 font-bold">
            Got it!
          </button>
        </div>
      `;
      
      document.body.appendChild(modal);
    },

    // Get demo status
    getDemoStatus: () => {
      return {
        enabled: window.TerryDemo.isDemoEnabled(),
        profile: window.TerryDemo.isDemoEnabled() ? 'Terry Graham' : 'Personal',
        modules: Array.from(window.TerryDemo.modules).map(m => m.name)
      };
    }
  };

  // Auto-initialize demo toggle button
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
      window.TerryDemo.utils.addDemoToggle();
    }, 1000);
  });

  console.log('🎭 Terry Graham Demo System Loaded');
  console.log('Use window.TerryDemo.enable() to start demo mode');

})();
