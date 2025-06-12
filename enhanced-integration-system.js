// enhanced-integration-system.js - FuelIQ Cross-Module Communication Hub
(function() {
  'use strict';

  // Central event bus for cross-module communication
  class FuelIQIntegrationHub {
    constructor() {
      this.events = new Map();
      this.sharedData = {
        userProfile: null,
        mealPlans: {},
        pantryItems: [],
        groceryLists: {},
        nutritionGoals: {},
        preferences: {}
      };
      this.initializeSharedData();
    }
// Module registration system
    registerModule(moduleName, moduleAPI) {
      if (!this.registeredModules) {
        this.registeredModules = {};
      }
      
      this.registeredModules[moduleName] = {
        api: moduleAPI,
        registeredAt: new Date().toISOString(),
        status: 'active'
      };
      
      console.log(`✅ Module '${moduleName}' registered successfully`);
      
      // Emit registration event
      this.emit('moduleRegistered', {
        moduleName,
        timestamp: new Date().toISOString(),
        availableModules: Object.keys(this.registeredModules)
      });
      
      return true;
    }

    // Get registered module
    getModule(moduleName) {
      return this.registeredModules?.[moduleName]?.api || null;
    }

    // List all registered modules
    getRegisteredModules() {
      return Object.keys(this.registeredModules || {});
    }

    // Update shared data method
    updateSharedData(key, data) {
      this.setSharedData(key, data);
    }

    // Initialize shared data from localStorage
    initializeSharedData() {
      try {
        this.sharedData.userProfile = JSON.parse(localStorage.getItem('fueliq_user_profile') || 'null');
        this.sharedData.mealPlans = JSON.parse(localStorage.getItem('fueliq_meal_plan') || '{}');
        this.sharedData.pantryItems = JSON.parse(localStorage.getItem('fueliq_pantry') || '[]');
        this.sharedData.nutritionGoals = JSON.parse(localStorage.getItem('fueliq_user_goals') || '{}');
        this.sharedData.preferences = JSON.parse(localStorage.getItem('fueliq_preferences') || '{}');
      } catch (e) {
        console.warn('Error initializing shared data:', e);
      }
    }

    // Event system for cross-module communication
    on(eventName, callback) {
      if (!this.events.has(eventName)) {
        this.events.set(eventName, []);
      }
      this.events.get(eventName).push(callback);
    }

    emit(eventName, data = {}) {
      if (this.events.has(eventName)) {
        this.events.get(eventName).forEach(callback => {
          try {
            callback(data);
          } catch (e) {
            console.error(`Error in event handler for ${eventName}:`, e);
          }
        });
      }
    }

    // Shared data management
    setSharedData(key, data) {
      this.sharedData[key] = data;
      this.saveToStorage(key, data);
      this.emit(`${key}Updated`, data);
    }

    getSharedData(key) {
      return this.sharedData[key];
    }

    saveToStorage(key, data) {
      try {
        const storageKey = `fueliq_${key.toLowerCase().replace(/([A-Z])/g, '_$1')}`;
        localStorage.setItem(storageKey, JSON.stringify(data));
      } catch (e) {
        console.warn(`Could not save ${key} to storage:`, e);
      }
    }

    // Meal Plan → Grocery List Integration
    generateGroceryListFromMealPlan(weekPlan) {
      const ingredientsList = {};
      const allergies = this.sharedData.userProfile?.allergies || [];
      const dietaryRestrictions = this.sharedData.userProfile?.dietaryRestrictions || [];
      
      // Extract ingredients from all meals
      Object.values(weekPlan).forEach(dayPlan => {
        ['breakfast', 'lunch', 'dinner', 'snacks'].forEach(mealType => {
          const meal = dayPlan[mealType];
          if (meal && meal.ingredients) {
            meal.ingredients.forEach(ingredient => {
              const key = ingredient.name.toLowerCase();
              
              // Skip ingredients that conflict with allergies
              if (this.ingredientConflictsWithRestrictions(ingredient, allergies, dietaryRestrictions)) {
                return;
              }
              
              if (ingredientsList[key]) {
                ingredientsList[key].totalAmount += this.parseAmount(ingredient.amount);
                ingredientsList[key].sources.push(`${mealType} - ${meal.name || 'Custom meal'}`);
              } else {
                ingredientsList[key] = {
                  name: ingredient.name,
                  totalAmount: this.parseAmount(ingredient.amount),
                  unit: ingredient.unit || 'item',
                  category: ingredient.category || 'misc',
                  sources: [`${mealType} - ${meal.name || 'Custom meal'}`],
                  priority: this.getIngredientPriority(ingredient),
                  organic: this.sharedData.preferences.preferOrganic || false
                };
              }
            });
          }
        });
      });

      // Filter against pantry items
      const pantryItems = this.sharedData.pantryItems;
      const filteredList = this.filterAgainstPantry(ingredientsList, pantryItems);
      
      const groceryList = {
        id: `grocery_${Date.now()}`,
        created: new Date().toISOString(),
        source: 'meal_plan',
        ingredients: filteredList,
        totalItems: Object.keys(filteredList).length,
        estimatedCost: this.estimateGroceryCost(filteredList),
        dietaryFilters: {
          allergies,
          restrictions: dietaryRestrictions
        }
      };

      this.emit('groceryListGenerated', groceryList);
      return groceryList;
    }

    // Check if ingredient conflicts with user restrictions
    ingredientConflictsWithRestrictions(ingredient, allergies, restrictions) {
      const ingredientName = ingredient.name.toLowerCase();
      
      // Check allergies
      for (const allergy of allergies) {
        if (this.checkAllergyConflict(ingredientName, allergy)) {
          return true;
        }
      }
      
      // Check dietary restrictions
      for (const restriction of restrictions) {
        if (this.checkDietaryConflict(ingredientName, restriction)) {
          return true;
        }
      }
      
      return false;
    }

    checkAllergyConflict(ingredientName, allergy) {
      const allergyMap = {
        'dairy/lactose': ['milk', 'cheese', 'yogurt', 'butter', 'cream', 'whey'],
        'gluten/wheat': ['wheat', 'flour', 'bread', 'pasta', 'barley', 'rye'],
        'nuts (tree nuts)': ['almond', 'walnut', 'pecan', 'cashew', 'pistachio'],
        'peanuts': ['peanut'],
        'shellfish': ['shrimp', 'crab', 'lobster', 'scallop'],
        'fish': ['salmon', 'tuna', 'cod', 'fish'],
        'eggs': ['egg'],
        'soy': ['soy', 'tofu', 'tempeh', 'edamame'],
        'sesame': ['sesame', 'tahini'],
        'corn': ['corn', 'cornstarch'],
        'nightshades': ['tomato', 'potato', 'pepper', 'eggplant'],
        'sulfites': ['wine', 'dried fruit']
      };
      
      const allergens = allergyMap[allergy.toLowerCase()] || [];
      return allergens.some(allergen => ingredientName.includes(allergen));
    }

    checkDietaryConflict(ingredientName, restriction) {
      const restrictionMap = {
        'vegetarian': ['chicken', 'beef', 'pork', 'fish', 'salmon', 'turkey', 'meat'],
        'vegan': ['chicken', 'beef', 'pork', 'fish', 'salmon', 'turkey', 'meat', 'milk', 'cheese', 'yogurt', 'butter', 'eggs'],
        'keto': ['bread', 'pasta', 'rice', 'potato', 'sugar', 'fruit'],
        'gluten-free': ['wheat', 'flour', 'bread', 'pasta', 'barley', 'rye'],
        'dairy-free': ['milk', 'cheese', 'yogurt', 'butter', 'cream', 'whey']
      };
      
      const forbidden = restrictionMap[restriction.toLowerCase()] || [];
      return forbidden.some(item => ingredientName.includes(item));
    }

    parseAmount(amountStr) {
      if (!amountStr) return 1;
      const match = amountStr.match(/(\d+\.?\d*)/);
      return match ? parseFloat(match[1]) : 1;
    }

    getIngredientPriority(ingredient) {
      const priorities = {
        'protein': 1,
        'vegetables': 2,
        'fruits': 3,
        'grains': 4,
        'dairy': 5,
        'fats': 6,
        'spices': 7
      };
      return priorities[ingredient.category] || 8;
    }

    // Filter grocery list against pantry items
    filterAgainstPantry(ingredientsList, pantryItems) {
      const filteredList = { ...ingredientsList };
      
      pantryItems.forEach(pantryItem => {
        const key = pantryItem.name.toLowerCase();
        if (filteredList[key]) {
          const needed = filteredList[key].totalAmount;
          const available = pantryItem.quantity || 0;
          
          if (available >= needed) {
            // We have enough, remove from grocery list
            delete filteredList[key];
          } else {
            // Reduce the amount needed
            filteredList[key].totalAmount = needed - available;
            filteredList[key].note = `${available} available in pantry`;
          }
        }
      });
      
      return filteredList;
    }

    estimateGroceryCost(ingredientsList) {
      // Simplified cost estimation
      let totalCost = 0;
      Object.values(ingredientsList).forEach(item => {
        const baseCost = {
          'protein': 8,
          'vegetables': 3,
          'fruits': 4,
          'grains': 2,
          'dairy': 5,
          'fats': 6,
          'spices': 3
        }[item.category] || 4;
        
        totalCost += baseCost * item.totalAmount;
      });
      
      return totalCost;
    }

    // Pantry integration
    updatePantryFromGrocery(groceryItems, source = 'grocery_delivery') {
      const pantryItems = [...this.sharedData.pantryItems];
      
      groceryItems.forEach(groceryItem => {
        const existingIndex = pantryItems.findIndex(
          item => item.name.toLowerCase() === groceryItem.name.toLowerCase()
        );
        
        if (existingIndex >= 0) {
          // Update existing item
          pantryItems[existingIndex].quantity += groceryItem.quantity || 1;
          pantryItems[existingIndex].lastUpdated = new Date().toISOString();
          pantryItems[existingIndex].source = source;
        } else {
          // Add new item
          pantryItems.push({
            id: `pantry_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name: groceryItem.name || groceryItem.product?.name,
            category: groceryItem.category || groceryItem.product?.category || 'misc',
            quantity: groceryItem.quantity || 1,
            unit: groceryItem.unit || 'item',
            dateAdded: new Date().toISOString(),
            lastUpdated: new Date().toISOString(),
            source: source,
            expiryDate: this.estimateExpiryDate(groceryItem.category),
            organic: groceryItem.organic || false
          });
        }
      });
      
      this.setSharedData('pantryItems', pantryItems);
      this.emit('pantryUpdated', pantryItems);
    }

    estimateExpiryDate(category) {
      const daysToAdd = {
        'vegetables': 7,
        'fruits': 5,
        'dairy': 10,
        'protein': 5,
        'grains': 365,
        'fats': 180,
        'spices': 365
      }[category] || 30;
      
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + daysToAdd);
      return expiryDate.toISOString();
    }

    // Nutrition tracking integration
    trackNutritionFromMeal(meal, mealType) {
      const today = new Date().toISOString().split('T')[0];
      const nutritionData = {
        date: today,
        mealType,
        meal,
        calories: meal.calories || 0,
        protein: meal.protein || 0,
        carbs: meal.carbs || 0,
        fat: meal.fat || 0,
        fiber: meal.fiber || 0,
        timestamp: new Date().toISOString()
      };
      
      this.emit('nutritionLogged', nutritionData);
      return nutritionData;
    }

    // Smart suggestions based on user profile and history
    generateSmartSuggestions() {
      const profile = this.sharedData.userProfile;
      const goals = this.sharedData.nutritionGoals;
      const pantry = this.sharedData.pantryItems;
      
      const suggestions = {
        meals: this.suggestMealsBasedOnPantry(pantry, profile),
        shopping: this.suggestShoppingItems(profile, goals),
        nutrition: this.generateNutritionTips(profile, goals)
      };
      
      this.emit('smartSuggestionsGenerated', suggestions);
      return suggestions;
    }

    suggestMealsBasedOnPantry(pantryItems, profile) {
      // Simple meal suggestions based on available ingredients
      const availableIngredients = pantryItems.map(item => item.name.toLowerCase());
      const mealSuggestions = [];
      
      // Example suggestions logic
      if (availableIngredients.includes('chicken breast') && availableIngredients.includes('rice')) {
        mealSuggestions.push({
          name: 'Chicken and Rice Bowl',
          ingredients: ['chicken breast', 'brown rice', 'vegetables'],
          estimatedTime: 25,
          calories: 450
        });
      }
      
      return mealSuggestions;
    }

    suggestShoppingItems(profile, goals) {
      const suggestions = [];
      
      // Based on dietary restrictions and goals
      if (profile?.goal === 'muscle_gain') {
        suggestions.push({
          item: 'Greek Yogurt',
          reason: 'High protein for muscle building',
          priority: 'high'
        });
      }
      
      if (profile?.dietaryRestrictions?.includes('Vegetarian')) {
        suggestions.push({
          item: 'Quinoa',
          reason: 'Complete protein source',
          priority: 'medium'
        });
      }
      
      return suggestions;
    }

    generateNutritionTips(profile, goals) {
      const tips = [];
      
      if (goals?.protein && goals.protein > 100) {
        tips.push({
          type: 'protein',
          message: 'Spread protein intake throughout the day for better absorption',
          actionable: true
        });
      }
      
      return tips;
    }

    // Integration status monitoring
    getIntegrationStatus() {
      return {
        mealPlanningConnected: !!window.FuelIQMealPlanning,
        groceryDeliveryConnected: !!window.FuelIQGroceryDelivery,
        pantryConnected: !!window.FuelIQPantry,
        dataSync: {
          userProfile: !!this.sharedData.userProfile,
          mealPlans: Object.keys(this.sharedData.mealPlans).length > 0,
          pantryItems: this.sharedData.pantryItems.length > 0,
          nutritionGoals: Object.keys(this.sharedData.nutritionGoals).length > 0
        },
        lastSync: new Date().toISOString()
      };
    }

    // Cleanup function
    cleanup() {
      this.events.clear();
      this.sharedData = {
        userProfile: null,
        mealPlans: {},
        pantryItems: [],
        groceryLists: {},
        nutritionGoals: {},
        preferences: {}
      };
    }
  }

  // Global integration hub instance
  window.FuelIQIntegration = new FuelIQIntegrationHub();

  // Integration utilities
  window.FuelIQIntegration.utils = {
    // Cross-module navigation
    navigateToModule: (moduleName, data = {}) => {
      const event = new CustomEvent('navigateToTab', { 
        detail: moduleName,
        data: data
      });
      window.dispatchEvent(event);
    },

    // Show integration status indicator
    showIntegrationStatus: (containerId = 'integration-status') => {
      const container = document.getElementById(containerId);
      if (!container) return;

      const status = window.FuelIQIntegration.getIntegrationStatus();
      container.innerHTML = `
        <div class="fixed bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-3 border border-gray-200 z-50">
          <div class="flex items-center space-x-2">
            <div class="w-3 h-3 rounded-full ${
              status.mealPlanningConnected && status.groceryDeliveryConnected && status.pantryConnected 
                ? 'bg-green-500' 
                : 'bg-yellow-500'
            }"></div>
            <span class="text-xs font-medium text-gray-700">
              Integration ${
                status.mealPlanningConnected && status.groceryDeliveryConnected && status.pantryConnected 
                  ? 'Active' 
                  : 'Partial'
              }
            </span>
          </div>
        </div>
      `;
    },

    // Show success messages
    showSuccessMessage: (message, duration = 3000) => {
      const messageDiv = document.createElement('div');
      messageDiv.className = 'fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg z-50 transform translate-x-full transition-transform duration-300';
      messageDiv.innerHTML = `
        <div class="flex items-center space-x-2">
          <span class="text-lg">✅</span>
          <span class="font-medium">${message}</span>
        </div>
      `;
      
      document.body.appendChild(messageDiv);
      
      setTimeout(() => {
        messageDiv.style.transform = 'translateX(0)';
      }, 100);
      
      setTimeout(() => {
        messageDiv.style.transform = 'translateX(100%)';
        setTimeout(() => {
          document.body.removeChild(messageDiv);
        }, 300);
      }, duration);
    }
  };

})();
