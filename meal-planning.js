// meal-planning.js - FuelIQ Meal Planning Module
(function() {
  'use strict';

  // Recipe database with nutritional information
  const RECIPE_DATABASE = [
    {
      id: 'chicken-quinoa-bowl',
      name: 'Mediterranean Chicken Quinoa Bowl',
      image: '🥗',
      cookTime: '25 min',
      servings: 2,
      difficulty: 'Easy',
      calories: 485,
      protein: 38,
      carbs: 45,
      fat: 18,
      fiber: 8,
      tags: ['high-protein', 'gluten-free', 'mediterranean', 'anti-bloat'],
      dietaryCompatible: ['gluten-free', 'dairy-free'],
      ingredients: [
        { name: 'Chicken Breast', amount: '8 oz', category: 'protein' },
        { name: 'Quinoa', amount: '1 cup', category: 'grains' },
        { name: 'Cherry Tomatoes', amount: '1 cup', category: 'vegetables' },
        { name: 'Cucumber', amount: '1 medium', category: 'vegetables' },
        { name: 'Red Onion', amount: '1/4 cup', category: 'vegetables' },
        { name: 'Olive Oil', amount: '2 tbsp', category: 'fats' },
        { name: 'Lemon', amount: '1 large', category: 'fruits' },
        { name: 'Fresh Herbs', amount: '1/4 cup', category: 'seasonings' }
      ]
    },
    {
      id: 'salmon-sweet-potato',
      name: 'Baked Salmon with Sweet Potato',
      image: '🐟',
      cookTime: '30 min',
      servings: 2,
      difficulty: 'Easy',
      calories: 520,
      protein: 42,
      carbs: 35,
      fat: 22,
      fiber: 6,
      tags: ['high-protein', 'omega-3', 'gluten-free', 'paleo'],
      dietaryCompatible: ['gluten-free', 'dairy-free', 'paleo', 'pescatarian'],
      ingredients: [
        { name: 'Salmon Fillet', amount: '8 oz', category: 'protein' },
        { name: 'Sweet Potato', amount: '2 medium', category: 'vegetables' },
        { name: 'Asparagus', amount: '1 lb', category: 'vegetables' },
        { name: 'Olive Oil', amount: '2 tbsp', category: 'fats' },
        { name: 'Garlic', amount: '3 cloves', category: 'seasonings' },
        { name: 'Lemon', amount: '1 large', category: 'fruits' }
      ]
    },
    {
      id: 'veggie-stir-fry',
      name: 'Asian Veggie Stir-Fry with Tofu',
      image: '🥬',
      cookTime: '20 min',
      servings: 2,
      difficulty: 'Easy',
      calories: 350,
      protein: 18,
      carbs: 42,
      fat: 15,
      fiber: 8,
      tags: ['vegetarian', 'vegan', 'low-calorie', 'anti-bloat'],
      dietaryCompatible: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free'],
      ingredients: [
        { name: 'Extra Firm Tofu', amount: '6 oz', category: 'protein' },
        { name: 'Brown Rice', amount: '1 cup cooked', category: 'grains' },
        { name: 'Bell Peppers', amount: '2 large', category: 'vegetables' },
        { name: 'Broccoli', amount: '2 cups', category: 'vegetables' },
        { name: 'Snap Peas', amount: '1 cup', category: 'vegetables' },
        { name: 'Sesame Oil', amount: '1 tbsp', category: 'fats' },
        { name: 'Soy Sauce', amount: '2 tbsp', category: 'seasonings' },
        { name: 'Fresh Ginger', amount: '1 tbsp', category: 'seasonings' }
      ]
    },
    {
      id: 'greek-chicken-salad',
      name: 'Greek Chicken Power Salad',
      image: '🥙',
      cookTime: '15 min',
      servings: 1,
      difficulty: 'Easy',
      calories: 420,
      protein: 35,
      carbs: 18,
      fat: 25,
      fiber: 9,
      tags: ['high-protein', 'low-carb', 'mediterranean', 'anti-bloat'],
      dietaryCompatible: ['gluten-free', 'low-carb', 'mediterranean'],
      ingredients: [
        { name: 'Chicken Breast', amount: '6 oz', category: 'protein' },
        { name: 'Mixed Greens', amount: '3 cups', category: 'vegetables' },
        { name: 'Cherry Tomatoes', amount: '1/2 cup', category: 'vegetables' },
        { name: 'Cucumber', amount: '1/2 cup', category: 'vegetables' },
        { name: 'Feta Cheese', amount: '2 oz', category: 'dairy' },
        { name: 'Kalamata Olives', amount: '10 pieces', category: 'fats' },
        { name: 'Olive Oil', amount: '2 tbsp', category: 'fats' },
        { name: 'Red Wine Vinegar', amount: '1 tbsp', category: 'seasonings' }
      ]
    },
    {
      id: 'turkey-avocado-wrap',
      name: 'Turkey Avocado Power Wrap',
      image: '🌯',
      cookTime: '10 min',
      servings: 1,
      difficulty: 'Easy',
      calories: 445,
      protein: 32,
      carbs: 35,
      fat: 20,
      fiber: 12,
      tags: ['high-protein', 'high-fiber', 'quick'],
      dietaryCompatible: ['dairy-free'],
      ingredients: [
        { name: 'Whole Wheat Tortilla', amount: '1 large', category: 'grains' },
        { name: 'Sliced Turkey', amount: '4 oz', category: 'protein' },
        { name: 'Avocado', amount: '1 medium', category: 'fats' },
        { name: 'Spinach', amount: '2 cups', category: 'vegetables' },
        { name: 'Tomato', amount: '1 medium', category: 'vegetables' },
        { name: 'Hummus', amount: '2 tbsp', category: 'protein' }
      ]
    },
    {
      id: 'overnight-oats',
      name: 'Protein-Packed Overnight Oats',
      image: '🥣',
      cookTime: '5 min prep',
      servings: 1,
      difficulty: 'Easy',
      calories: 380,
      protein: 25,
      carbs: 45,
      fat: 12,
      fiber: 10,
      tags: ['high-protein', 'high-fiber', 'make-ahead', 'vegetarian'],
      dietaryCompatible: ['vegetarian', 'gluten-free'],
      ingredients: [
        { name: 'Rolled Oats', amount: '1/2 cup', category: 'grains' },
        { name: 'Protein Powder', amount: '1 scoop', category: 'protein' },
        { name: 'Almond Milk', amount: '3/4 cup', category: 'dairy' },
        { name: 'Chia Seeds', amount: '1 tbsp', category: 'fats' },
        { name: 'Banana', amount: '1/2 medium', category: 'fruits' },
        { name: 'Berries', amount: '1/2 cup', category: 'fruits' },
        { name: 'Almond Butter', amount: '1 tbsp', category: 'fats' }
      ]
    }
  ];

  let currentWeekStart = new Date();
  let mealPlan = {};
  let userGoals = {};
  let userProfile = {};

  // Set week to Monday
  function getMondayOfWeek(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  }

  // Load user data
  function loadUserData() {
    try {
      const goals = localStorage.getItem('fueliq_user_goals');
      const profile = localStorage.getItem('fueliq_user_profile');
      
      if (goals) userGoals = JSON.parse(goals);
      if (profile) userProfile = JSON.parse(profile);
    } catch (e) {
      console.warn('Could not load user data:', e);
    }
  }

  // Filter recipes based on user preferences
  function getFilteredRecipes() {
    if (!userProfile.dietaryRestrictions && !userProfile.allergies && !userProfile.antiBloutPreference) {
      return RECIPE_DATABASE;
    }

    return RECIPE_DATABASE.filter(recipe => {
      // Check dietary restrictions
      if (userProfile.dietaryRestrictions && userProfile.dietaryRestrictions.length > 0) {
        const hasCompatibleDiet = userProfile.dietaryRestrictions.some(diet => 
          recipe.dietaryCompatible.includes(diet.toLowerCase()) || 
          recipe.tags.includes(diet.toLowerCase().replace(/\s+/g, '-'))
        );
        if (!hasCompatibleDiet) return false;
      }

      // Check allergies
      if (userProfile.allergies && userProfile.allergies.length > 0) {
        const hasAllergen = userProfile.allergies.some(allergy => {
          const allergenKeywords = {
            'Dairy/Lactose': ['dairy', 'cheese', 'milk', 'yogurt'],
            'Gluten/Wheat': ['wheat', 'gluten', 'bread', 'pasta'],
            'Nuts (Tree Nuts)': ['nuts', 'almond', 'walnut', 'pecan'],
            'Peanuts': ['peanut'],
            'Shellfish': ['shrimp', 'crab', 'lobster'],
            'Fish': ['fish', 'salmon', 'tuna'],
            'Eggs': ['egg'],
            'Soy': ['soy', 'tofu']
          };
          
          const keywords = allergenKeywords[allergy] || [];
          return keywords.some(keyword => 
            recipe.ingredients.some(ing => 
              ing.name.toLowerCase().includes(keyword.toLowerCase())
            )
          );
        });
        if (hasAllergen) return false;
      }

      // Check anti-bloat preference
      if (userProfile.antiBloutPreference) {
        if (!recipe.tags.includes('anti-bloat')) return false;
      }

      return true;
    });
  }

  // Generate meal plan for a day based on goals
  function generateDayMealPlan(targetCalories) {
    const filteredRecipes = getFilteredRecipes();
    const dayPlan = { breakfast: null, lunch: null, dinner: null, snacks: [] };
    
    const calorieTargets = {
      breakfast: Math.round(targetCalories * 0.25), // 25%
      lunch: Math.round(targetCalories * 0.35),     // 35%
      dinner: Math.round(targetCalories * 0.35),    // 35%
      snacks: Math.round(targetCalories * 0.05)     // 5%
    };

    // Simple algorithm to match recipes to meals
    for (const mealType of ['breakfast', 'lunch', 'dinner']) {
      const target = calorieTargets[mealType];
      const suitableRecipes = filteredRecipes.filter(recipe => {
        const calorieMatch = Math.abs(recipe.calories - target) < target * 0.3;
        
        if (mealType === 'breakfast') {
          return calorieMatch && (recipe.tags.includes('breakfast') || recipe.name.includes('Oats'));
        }
        return calorieMatch;
      });

      if (suitableRecipes.length > 0) {
        const randomRecipe = suitableRecipes[Math.floor(Math.random() * suitableRecipes.length)];
        dayPlan[mealType] = randomRecipe;
      }
    }

    return dayPlan;
  }

  // Create meal planning interface
  function createMealPlanningInterface(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    loadUserData();
    currentWeekStart = getMondayOfWeek(new Date());

    container.innerHTML = `
      <div class="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
        <!-- Header -->
        <div class="bg-gradient-to-r from-orange-500 to-red-600 shadow-2xl">
          <div class="max-w-7xl mx-auto px-6 py-8">
            <div class="text-center text-white">
              <h1 class="text-4xl font-bold mb-2" style="font-family: Georgia, Times, serif;">
                🍽️ Smart Meal Planning
              </h1>
              <p class="text-xl opacity-90">Plan your week, reach your goals, simplify your life</p>
            </div>
          </div>
        </div>

        <div class="max-w-7xl mx-auto p-6">
          <!-- Week Navigation -->
          <div class="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-6 mb-8 border border-white/20">
            <div class="flex items-center justify-between">
              <button id="prevWeek" class="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-2xl hover:from-orange-600 hover:to-red-700 font-bold transition-all duration-200 flex items-center">
                ← Previous Week
              </button>
              
              <div class="text-center">
                <h2 id="weekDisplay" class="text-2xl font-bold text-gray-800"></h2>
                <p class="text-gray-600">Week of <span id="weekDateRange"></span></p>
              </div>
              
              <button id="nextWeek" class="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-2xl hover:from-orange-600 hover:to-red-700 font-bold transition-all duration-200 flex items-center">
                Next Week →
              </button>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <button id="generateWeekPlan" class="p-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl shadow-xl hover:scale-105 transition-all duration-200 font-bold">
              ✨ Generate Week Plan
            </button>
            <button id="viewRecipeBank" class="p-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-2xl shadow-xl hover:scale-105 transition-all duration-200 font-bold">
              📚 Recipe Bank
            </button>
            <button id="generateGroceryList" class="p-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl shadow-xl hover:scale-105 transition-all duration-200 font-bold">
              🛒 Grocery List
            </button>
            <button id="mealPrepTips" class="p-4 bg-gradient-to-r from-yellow-500 to-orange-600 text-white rounded-2xl shadow-xl hover:scale-105 transition-all duration-200 font-bold">
              👨‍🍳 Meal Prep
            </button>
          </div>

          <!-- Weekly Calendar -->
          <div class="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20">
            <div id="weeklyCalendar" class="grid grid-cols-1 lg:grid-cols-7 gap-4">
              <!-- Days will be populated here -->
            </div>
          </div>

          <!-- Nutrition Summary -->
          <div class="mt-8 bg-gradient-to-r from-orange-500 via-red-600 to-pink-600 rounded-3xl shadow-2xl p-8 text-white">
            <h3 class="text-2xl font-bold mb-6 flex items-center">
              📊 Weekly Nutrition Overview
            </h3>
            <div id="nutritionSummary" class="grid grid-cols-2 md:grid-cols-4 gap-6">
              <!-- Nutrition data will be populated here -->
            </div>
          </div>
        </div>

        <!-- Recipe Modal -->
        <div id="recipeModal" class="fixed inset-0 bg-black/50 hidden items-center justify-center z-50 p-4">
          <div class="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div id="recipeModalContent">
              <!-- Recipe details will be populated here -->
            </div>
          </div>
        </div>

        <!-- Recipe Bank Modal -->
        <div id="recipeBankModal" class="fixed inset-0 bg-black/50 hidden items-center justify-center z-50 p-4">
          <div class="bg-white rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div class="p-8">
              <div class="flex justify-between items-center mb-6">
                <h2 class="text-3xl font-bold text-gray-800">📚 Recipe Bank</h2>
                <button id="closeRecipeBank" class="text-gray-500 hover:text-gray-700 text-3xl">&times;</button>
              </div>
              <div id="recipeBankContent" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <!-- Recipes will be populated here -->
              </div>
            </div>
          </div>
        </div>

        <!-- Grocery List Modal -->
        <div id="groceryModal" class="fixed inset-0 bg-black/50 hidden items-center justify-center z-50 p-4">
          <div class="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div id="groceryModalContent">
              <!-- Grocery list will be populated here -->
            </div>
          </div>
        </div>
      </div>
    `;

    // Initialize the interface
    updateWeekDisplay();
    renderWeeklyCalendar();
    updateNutritionSummary();
    setupEventListeners();
  }

  function updateWeekDisplay() {
    const weekDisplay = document.getElementById('weekDisplay');
    const weekDateRange = document.getElementById('weekDateRange');
    
    if (weekDisplay && weekDateRange) {
      const endDate = new Date(currentWeekStart);
      endDate.setDate(currentWeekStart.getDate() + 6);
      
      weekDisplay.textContent = 'Meal Planning';
      weekDateRange.textContent = `${currentWeekStart.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
    }
  }

  function renderWeeklyCalendar() {
    const calendar = document.getElementById('weeklyCalendar');
    if (!calendar) return;

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const dayEmojis = ['📅', '🗓️', '📋', '📝', '📄', '🎯', '✨'];

    calendar.innerHTML = days.map((day, index) => {
      const date = new Date(currentWeekStart);
      date.setDate(currentWeekStart.getDate() + index);
      const dateKey = date.toISOString().split('T')[0];
      const dayPlan = mealPlan[dateKey] || {};

      return `
        <div class="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-200 p-4 min-h-[400px]">
          <div class="text-center mb-4">
            <div class="text-2xl mb-1">${dayEmojis[index]}</div>
            <h3 class="font-bold text-gray-800">${day}</h3>
            <p class="text-sm text-gray-600">${date.getMonth() + 1}/${date.getDate()}</p>
          </div>
          
          <div class="space-y-3">
            <!-- Breakfast -->
            <div class="meal-slot" data-date="${dateKey}" data-meal="breakfast">
              <div class="text-xs font-semibold text-orange-600 mb-1">🌅 BREAKFAST</div>
              <div class="meal-item ${dayPlan.breakfast ? 'has-meal' : 'empty-meal'}" onclick="selectMealForSlot('${dateKey}', 'breakfast')">
                ${dayPlan.breakfast ? 
                  `<div class="p-3 bg-gradient-to-r from-orange-100 to-red-100 rounded-xl">
                     <div class="font-medium text-sm">${dayPlan.breakfast.name}</div>
                     <div class="text-xs text-gray-600">${dayPlan.breakfast.calories} cal</div>
                   </div>` :
                  `<div class="p-3 border-2 border-dashed border-gray-300 rounded-xl text-center text-gray-500">
                     <div class="text-xs">+ Add Meal</div>
                   </div>`
                }
              </div>
            </div>

            <!-- Lunch -->
            <div class="meal-slot" data-date="${dateKey}" data-meal="lunch">
              <div class="text-xs font-semibold text-green-600 mb-1">☀️ LUNCH</div>
              <div class="meal-item ${dayPlan.lunch ? 'has-meal' : 'empty-meal'}" onclick="selectMealForSlot('${dateKey}', 'lunch')">
                ${dayPlan.lunch ? 
                  `<div class="p-3 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl">
                     <div class="font-medium text-sm">${dayPlan.lunch.name}</div>
                     <div class="text-xs text-gray-600">${dayPlan.lunch.calories} cal</div>
                   </div>` :
                  `<div class="p-3 border-2 border-dashed border-gray-300 rounded-xl text-center text-gray-500">
                     <div class="text-xs">+ Add Meal</div>
                   </div>`
                }
              </div>
            </div>

            <!-- Dinner -->
            <div class="meal-slot" data-date="${dateKey}" data-meal="dinner">
              <div class="text-xs font-semibold text-purple-600 mb-1">🌙 DINNER</div>
              <div class="meal-item ${dayPlan.dinner ? 'has-meal' : 'empty-meal'}" onclick="selectMealForSlot('${dateKey}', 'dinner')">
                ${dayPlan.dinner ? 
                  `<div class="p-3 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl">
                     <div class="font-medium text-sm">${dayPlan.dinner.name}</div>
                     <div class="text-xs text-gray-600">${dayPlan.dinner.calories} cal</div>
                   </div>` :
                  `<div class="p-3 border-2 border-dashed border-gray-300 rounded-xl text-center text-gray-500">
                     <div class="text-xs">+ Add Meal</div>
                   </div>`
                }
              </div>
            </div>
          </div>

          <!-- Daily Summary -->
          <div class="mt-4 pt-3 border-t border-gray-200">
            <div class="text-xs text-gray-600 text-center">
              ${calculateDayCalories(dayPlan)} / ${userGoals.dailyCalories || 2000} cal
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  function calculateDayCalories(dayPlan) {
    let total = 0;
    if (dayPlan.breakfast) total += dayPlan.breakfast.calories;
    if (dayPlan.lunch) total += dayPlan.lunch.calories;
    if (dayPlan.dinner) total += dayPlan.dinner.calories;
    return total;
  }

  function updateNutritionSummary() {
    const summaryContainer = document.getElementById('nutritionSummary');
    if (!summaryContainer) return;

    // Calculate weekly averages
    let totalCalories = 0, totalProtein = 0, totalCarbs = 0, totalFat = 0;
    let plannedDays = 0;

    Object.values(mealPlan).forEach(dayPlan => {
      if (dayPlan.breakfast || dayPlan.lunch || dayPlan.dinner) {
        plannedDays++;
        totalCalories += calculateDayCalories(dayPlan);
        
        [dayPlan.breakfast, dayPlan.lunch, dayPlan.dinner].forEach(meal => {
          if (meal) {
            totalProtein += meal.protein || 0;
            totalCarbs += meal.carbs || 0;
            totalFat += meal.fat || 0;
          }
        });
      }
    });

    const avgCalories = plannedDays > 0 ? Math.round(totalCalories / plannedDays) : 0;
    const avgProtein = plannedDays > 0 ? Math.round(totalProtein / plannedDays) : 0;
    const avgCarbs = plannedDays > 0 ? Math.round(totalCarbs / plannedDays) : 0;
    const avgFat = plannedDays > 0 ? Math.round(totalFat / plannedDays) : 0;

    summaryContainer.innerHTML = `
      <div class="bg-white/20 rounded-2xl p-6 backdrop-blur-sm text-center">
        <div class="text-3xl font-bold mb-2">${avgCalories}</div>
        <div class="text-sm opacity-90">Avg Daily Calories</div>
      </div>
      <div class="bg-white/20 rounded-2xl p-6 backdrop-blur-sm text-center">
        <div class="text-3xl font-bold mb-2">${avgProtein}g</div>
        <div class="text-sm opacity-90">Avg Protein</div>
      </div>
      <div class="bg-white/20 rounded-2xl p-6 backdrop-blur-sm text-center">
        <div class="text-3xl font-bold mb-2">${avgCarbs}g</div>
        <div class="text-sm opacity-90">Avg Carbs</div>
      </div>
      <div class="bg-white/20 rounded-2xl p-6 backdrop-blur-sm text-center">
        <div class="text-3xl font-bold mb-2">${avgFat}g</div>
        <div class="text-sm opacity-90">Avg Fat</div>
      </div>
    `;
  }

  function setupEventListeners() {
    // Week navigation
    document.getElementById('prevWeek')?.addEventListener('click', () => {
      currentWeekStart.setDate(currentWeekStart.getDate() - 7);
      updateWeekDisplay();
      renderWeeklyCalendar();
    });

    document.getElementById('nextWeek')?.addEventListener('click', () => {
      currentWeekStart.setDate(currentWeekStart.getDate() + 7);
      updateWeekDisplay();
      renderWeeklyCalendar();
    });

    // Quick actions
    document.getElementById('generateWeekPlan')?.addEventListener('click', generateWeeklyPlan);
    document.getElementById('viewRecipeBank')?.addEventListener('click', showRecipeBank);
    document.getElementById('generateGroceryList')?.addEventListener('click', generateGroceryList);
    document.getElementById('mealPrepTips')?.addEventListener('click', showMealPrepTips);

    // Modal close buttons
    document.getElementById('closeRecipeBank')?.addEventListener('click', () => {
      document.getElementById('recipeBankModal').classList.add('hidden');
    });

    // Close modals when clicking outside
    ['recipeModal', 'recipeBankModal', 'groceryModal'].forEach(modalId => {
      document.getElementById(modalId)?.addEventListener('click', (e) => {
        if (e.target.id === modalId) {
          document.getElementById(modalId).classList.add('hidden');
        }
      });
    });
  }

  function generateWeeklyPlan() {
    const targetCalories = userGoals.dailyCalories || 2000;
    
    // Generate plan for each day of the week
    for (let i = 0; i < 7; i++) {
      const date = new Date(currentWeekStart);
      date.setDate(currentWeekStart.getDate() + i);
      const dateKey = date.toISOString().split('T')[0];
      
      mealPlan[dateKey] = generateDayMealPlan(targetCalories);
    }

    // Save meal plan
    saveMealPlan();
    
    // Re-render calendar and update nutrition
    renderWeeklyCalendar();
    updateNutritionSummary();

    // Show success message
    alert('✨ Weekly meal plan generated! Your meals are optimized for your goals and dietary preferences.');
  }

  function showRecipeBank() {
    const modal = document.getElementById('recipeBankModal');
    const content = document.getElementById('recipeBankContent');
    
    if (!modal || !content) return;

    const filteredRecipes = getFilteredRecipes();
    
    content.innerHTML = filteredRecipes.map(recipe => `
      <div class="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-200 p-6 cursor-pointer hover:scale-105 transition-all duration-200"
           onclick="showRecipeDetails('${recipe.id}')">
        <div class="text-4xl mb-3 text-center">${recipe.image}</div>
        <h3 class="font-bold text-lg mb-2 text-gray-800">${recipe.name}</h3>
        <div class="space-y-1 text-sm text-gray-600 mb-4">
          <div>⏱️ ${recipe.cookTime}</div>
          <div>🍽️ ${recipe.servings} servings</div>
          <div>🔥 ${recipe.calories} calories</div>
        </div>
        <div class="flex flex-wrap gap-1">
          ${recipe.tags.slice(0, 3).map(tag => 
            `<span class="px-2 py-1 bg-orange-100 text-orange-700 rounded-lg text-xs">${tag}</span>`
          ).join('')}
        </div>
      </div>
    `).join('');

    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }

  function generateGroceryList() {
    const modal = document.getElementById('groceryModal');
    const content = document.getElementById('groceryModalContent');
    
    if (!modal || !content) return;

    // Collect all ingredients from the week's meal plan
    const ingredientsList = {};
    
    Object.values(mealPlan).forEach(dayPlan => {
      ['breakfast', 'lunch', 'dinner'].forEach(mealType => {
        const meal = dayPlan[mealType];
        if (meal && meal.ingredients) {
          meal.ingredients.forEach(ingredient => {
            const key = ingredient.name.toLowerCase();
            if (ingredientsList[key]) {
              // Simple quantity addition (would need more complex logic for real app)
              ingredientsList[key].amount += ` + ${ingredient.amount}`;
            } else {
              ingredientsList[key] = { ...ingredient };
            }
          });
        }
      });
    });

    // Group by category
    const categories = {
      protein: { name: 'Proteins', emoji: '🥩', items: [] },
      vegetables: { name: 'Vegetables', emoji: '🥬', items: [] },
      fruits: { name: 'Fruits', emoji: '🍎', items: [] },
      grains: { name: 'Grains & Starches', emoji: '🌾', items: [] },
      dairy: { name: 'Dairy', emoji: '🥛', items: [] },
      fats: { name: 'Oils & Fats', emoji: '🫒', items: [] },
      seasonings: { name: 'Seasonings & Herbs', emoji: '🌿', items: [] }
    };

    Object.values(ingredientsList).forEach(ingredient => {
      const category = categories[ingredient.category] || categories.seasonings;
      category.items.push(ingredient);
    });

    content.innerHTML = `
      <div class="p-8">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-3xl font-bold text-gray-800">🛒 Smart Grocery List</h2>
          <button onclick="document.getElementById('groceryModal').classList.add('hidden')" 
                  class="text-gray-500 hover:text-gray-700 text-3xl">&times;</button>
        </div>
        
        <div class="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200">
          <h3 class="font-bold text-green-800 mb-2">💡 Smart Shopping Tips</h3>
          <p class="text-sm text-green-700">This list is optimized for your weekly meal plan. Check your pantry first and adjust quantities as needed!</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          ${Object.values(categories).filter(cat => cat.items.length > 0).map(category => `
            <div class="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <span class="text-2xl mr-2">${category.emoji}</span>
                ${category.name}
              </h3>
              <div class="space-y-2">
                ${category.items.map(item => `
                  <div class="flex items-center justify-between p-3 bg-white rounded-xl shadow-sm">
                    <span class="font-medium">${item.name}</span>
                    <span class="text-sm text-gray-600">${item.amount}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>

        <div class="mt-8 flex gap-4">
          <button class="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-2xl hover:from-orange-600 hover:to-red-700 font-bold transition-all duration-200">
            📋 Export List
          </button>
          <button class="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl hover:from-green-600 hover:to-emerald-700 font-bold transition-all duration-200">
            🚚 Order Online
          </button>
        </div>
      </div>
    `;

    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }

  function showMealPrepTips() {
    alert(`🥘 Meal Prep Master Tips:

📅 SUNDAY PREP SESSION:
• Batch cook proteins (chicken, salmon, tofu)
• Wash and chop all vegetables
• Cook grains in bulk (quinoa, rice, pasta)
• Prepare overnight oats for the week

🔥 TIME-SAVING HACKS:
• Use a slow cooker or instant pot
• Pre-portion snacks in containers
• Freeze smoothie ingredients in bags
• Keep emergency proteins on hand

📦 STORAGE SECRETS:
• Glass containers prevent odors
• Label everything with dates
• Store dressings separately
• Freeze extra portions for later

Coming soon: Full meal prep planning feature! 🚀`);
  }

  function saveMealPlan() {
    try {
      localStorage.setItem('fueliq_meal_plan', JSON.stringify(mealPlan));
    } catch (e) {
      console.warn('Could not save meal plan:', e);
    }
  }

  function loadMealPlan() {
    try {
      const saved = localStorage.getItem('fueliq_meal_plan');
      if (saved) {
        mealPlan = JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Could not load meal plan:', e);
    }
  }

  // Global functions for event handlers
  window.selectMealForSlot = function(date, mealType) {
    // For now, show recipe bank to select
    showRecipeBank();
    // Store the target slot for when a recipe is selected
    window.targetSlot = { date, mealType };
  };

  window.showRecipeDetails = function(recipeId) {
    const recipe = RECIPE_DATABASE.find(r => r.id === recipeId);
    if (!recipe) return;

    const modal = document.getElementById('recipeModal');
    const content = document.getElementById('recipeModalContent');
    
    if (!modal || !content) return;

    content.innerHTML = `
      <div class="p-8">
        <div class="flex justify-between items-start mb-6">
          <div>
            <div class="text-6xl mb-4">${recipe.image}</div>
            <h2 class="text-3xl font-bold text-gray-800 mb-2">${recipe.name}</h2>
            <div class="flex gap-4 text-sm text-gray-600">
              <span>⏱️ ${recipe.cookTime}</span>
              <span>🍽️ ${recipe.servings} servings</span>
              <span>📊 ${recipe.difficulty}</span>
            </div>
          </div>
          <button onclick="document.getElementById('recipeModal').classList.add('hidden')" 
                  class="text-gray-500 hover:text-gray-700 text-3xl">&times;</button>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 class="text-xl font-bold text-gray-800 mb-4">📊 Nutrition Facts</h3>
            <div class="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 mb-6">
              <div class="grid grid-cols-2 gap-4">
                <div class="text-center">
                  <div class="text-2xl font-bold text-orange-600">${recipe.calories}</div>
                  <div class="text-sm text-gray-600">Calories</div>
                </div>
                <div class="text-center">
                  <div class="text-2xl font-bold text-red-600">${recipe.protein}g</div>
                  <div class="text-sm text-gray-600">Protein</div>
                </div>
                <div class="text-center">
                  <div class="text-2xl font-bold text-yellow-600">${recipe.carbs}g</div>
                  <div class="text-sm text-gray-600">Carbs</div>
                </div>
                <div class="text-center">
                  <div class="text-2xl font-bold text-purple-600">${recipe.fat}g</div>
                  <div class="text-sm text-gray-600">Fat</div>
                </div>
              </div>
            </div>

            <h3 class="text-xl font-bold text-gray-800 mb-4">🏷️ Tags</h3>
            <div class="flex flex-wrap gap-2 mb-6">
              ${recipe.tags.map(tag => 
                `<span class="px-3 py-1 bg-orange-100 text-orange-700 rounded-lg text-sm">${tag}</span>`
              ).join('')}
            </div>
          </div>

          <div>
            <h3 class="text-xl font-bold text-gray-800 mb-4">🛒 Ingredients</h3>
            <div class="space-y-2 mb-6">
              ${recipe.ingredients.map(ingredient => `
                <div class="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                  <span class="font-medium">${ingredient.name}</span>
                  <span class="text-sm text-gray-600">${ingredient.amount}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <div class="flex gap-4 mt-8">
          ${window.targetSlot ? `
            <button onclick="addRecipeToSlot('${recipe.id}')" 
                    class="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl hover:from-green-600 hover:to-emerald-700 font-bold transition-all duration-200">
              ✅ Add to Meal Plan
            </button>
          ` : ''}
          <button class="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-2xl hover:from-orange-600 hover:to-red-700 font-bold transition-all duration-200">
            🍳 View Full Recipe
          </button>
        </div>
      </div>
    `;

    modal.classList.remove('hidden');
    modal.classList.add('flex');
  };

  window.addRecipeToSlot = function(recipeId) {
    if (!window.targetSlot) return;

    const recipe = RECIPE_DATABASE.find(r => r.id === recipeId);
    if (!recipe) return;

    const { date, mealType } = window.targetSlot;
    
    if (!mealPlan[date]) {
      mealPlan[date] = {};
    }
    
    mealPlan[date][mealType] = recipe;
    saveMealPlan();
    
    // Close modals and refresh display
    document.getElementById('recipeModal').classList.add('hidden');
    document.getElementById('recipeBankModal').classList.add('hidden');
    
    renderWeeklyCalendar();
    updateNutritionSummary();
    
    window.targetSlot = null;
  };

  // Cleanup function
  function cleanup() {
    // Remove event listeners and clean up
    window.selectMealForSlot = null;
    window.showRecipeDetails = null;
    window.addRecipeToSlot = null;
    window.targetSlot = null;
  }

  // Load meal plan on init
  loadMealPlan();

  // Public API
  window.FuelIQMealPlanning = {
    renderMealPlanning: createMealPlanningInterface,
    cleanup: cleanup
  };
// Enhanced Integration Features for Meal Planning

// Function to save meal plan with integration
function saveMealPlanWithIntegration(weekPlan) {
  // Save to localStorage (existing functionality)
  try {
saveMealPlanWithIntegration(weekPlan);
  } catch (e) {
    console.warn('Could not save meal plan to localStorage:', e);
  }

  // Update integration hub
  if (window.FuelIQIntegration) {
    window.FuelIQIntegration.setSharedData('mealPlans', weekPlan);
    
    // Generate smart grocery list preview
    const groceryList = window.FuelIQIntegration.generateGroceryListFromMealPlan(weekPlan);
    
    // Show success message with grocery list info
    window.FuelIQIntegration.utils.showSuccessMessage(
      `Meal plan saved! ${Object.keys(groceryList.ingredients).length} grocery items ready.`
    );
    
    console.log('📅 Meal Plan Integration:', {
      mealsSaved: Object.keys(weekPlan).length,
      groceryItems: Object.keys(groceryList.ingredients).length,
      estimatedCost: groceryList.estimatedCost
    });
  }
}

// Enhanced grocery list generation with navigation
function generateAndNavigateToGrocery() {
  if (!window.FuelIQIntegration) {
    alert('Integration system not available. Please refresh the page.');
    return;
  }

  try {
    const mealPlans = window.FuelIQIntegration.getSharedData('mealPlans');
    
    if (!mealPlans || Object.keys(mealPlans).length === 0) {
      alert('❌ No meal plan found. Please create a meal plan first.');
      return;
    }

    const groceryList = window.FuelIQIntegration.generateGroceryListFromMealPlan(mealPlans);
    
    // Show preview
    const itemCount = Object.keys(groceryList.ingredients).length;
    const confirm = window.confirm(
      `🛒 Generated grocery list with ${itemCount} items!\n\n` +
      `Estimated cost: $${groceryList.estimatedCost.toFixed(2)}\n\n` +
      `Would you like to go to the Grocery Delivery tab?`
    );
    
    if (confirm) {
      // Navigate to grocery tab with the list
      window.FuelIQIntegration.utils.navigateToModule('grocery', { groceryList });
    }
    
  } catch (e) {
    console.error('Error generating grocery list:', e);
    alert('❌ Error generating grocery list. Please try again.');
  }
}

// Add grocery list button to meal planning interface
function addGroceryListButton() {
  // Find a good place to add the button (you might need to adjust the selector)
  const container = document.querySelector('#planning-container .bg-white\\/80') || 
                   document.querySelector('#planning-container > div');
  
  if (!container) return;

  // Check if button already exists
  if (document.getElementById('grocery-list-btn')) return;

  const groceryButton = document.createElement('div');
  groceryButton.innerHTML = `
    <div class="mt-6 p-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl">
      <button id="grocery-list-btn" onclick="generateAndNavigateToGrocery()" 
              class="w-full p-4 bg-white/20 hover:bg-white/30 rounded-xl text-white font-bold text-lg transition-all duration-200 flex items-center justify-center space-x-3">
        <span class="text-2xl">🛒</span>
        <span>Generate Smart Grocery List</span>
        <span class="text-2xl">→</span>
      </button>
      <p class="text-white/80 text-sm mt-2 text-center">
        Auto-generates shopping list with dietary restrictions applied
      </p>
    </div>
  `;
  
  container.appendChild(groceryButton);
}

// Integration status for meal planning
function initializeMealPlanningIntegration() {
  if (window.FuelIQIntegration) {
    // Load existing meal plans into integration hub
    try {
      const existingPlans = JSON.parse(localStorage.getItem('fueliq_meal_plan') || '{}');
      if (Object.keys(existingPlans).length > 0) {
        window.FuelIQIntegration.setSharedData('mealPlans', existingPlans);
      }
    } catch (e) {
      console.warn('Could not load existing meal plans:', e);
    }

    // Add grocery list button
    setTimeout(addGroceryListButton, 1000);
    
    console.log('🔗 Meal Planning Integration initialized');
  }
}

// Make functions globally available
window.saveMealPlanWithIntegration = saveMealPlanWithIntegration;
window.generateAndNavigateToGrocery = generateAndNavigateToGrocery;

// Initialize integration when meal planning loads
setTimeout(initializeMealPlanningIntegration, 500);
})();
