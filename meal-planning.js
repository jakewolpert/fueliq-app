// meal-planning.js - Clean FuelIQ Meal Planning Module with Food Preferences
(function() {
  'use strict';

  // Enhanced Recipe Database with Food Preference Compatibility
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
      cuisine: 'Mediterranean',
      tags: ['high-protein', 'gluten-free', 'mediterranean', 'anti-bloat'],
      dietaryCompatible: ['gluten-free', 'dairy-free'],
      mainIngredients: ['Chicken', 'Quinoa', 'Tomatoes'],
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
      cuisine: 'American',
      tags: ['high-protein', 'omega-3', 'gluten-free', 'paleo'],
      dietaryCompatible: ['gluten-free', 'dairy-free', 'paleo', 'pescatarian'],
      mainIngredients: ['Salmon', 'Sweet Potatoes', 'Asparagus'],
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
      cuisine: 'Asian',
      tags: ['vegetarian', 'vegan', 'low-calorie', 'anti-bloat'],
      dietaryCompatible: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free'],
      mainIngredients: ['Tofu', 'Broccoli', 'Peppers'],
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
      cuisine: 'Mediterranean',
      tags: ['high-protein', 'low-carb', 'mediterranean', 'anti-bloat'],
      dietaryCompatible: ['gluten-free', 'low-carb', 'mediterranean'],
      mainIngredients: ['Chicken', 'Spinach', 'Tomatoes'],
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
      cuisine: 'American',
      tags: ['high-protein', 'high-fiber', 'quick'],
      dietaryCompatible: ['dairy-free'],
      mainIngredients: ['Turkey', 'Avocado', 'Spinach'],
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
      cuisine: 'American',
      tags: ['high-protein', 'high-fiber', 'make-ahead', 'vegetarian', 'breakfast'],
      dietaryCompatible: ['vegetarian', 'gluten-free'],
      mainIngredients: ['Oats', 'Berries', 'Nuts'],
      ingredients: [
        { name: 'Rolled Oats', amount: '1/2 cup', category: 'grains' },
        { name: 'Protein Powder', amount: '1 scoop', category: 'protein' },
        { name: 'Almond Milk', amount: '3/4 cup', category: 'dairy' },
        { name: 'Chia Seeds', amount: '1 tbsp', category: 'fats' },
        { name: 'Banana', amount: '1/2 medium', category: 'fruits' },
        { name: 'Berries', amount: '1/2 cup', category: 'fruits' },
        { name: 'Almond Butter', amount: '1 tbsp', category: 'fats' }
      ]
    },
    {
      id: 'beef-stir-fry',
      name: 'Asian Beef Stir-Fry',
      image: '🥩',
      cookTime: '20 min',
      servings: 2,
      difficulty: 'Easy',
      calories: 480,
      protein: 38,
      carbs: 32,
      fat: 20,
      fiber: 6,
      cuisine: 'Asian',
      tags: ['high-protein', 'quick-cook', 'anti-bloat'],
      dietaryCompatible: ['gluten-free', 'dairy-free'],
      mainIngredients: ['Beef', 'Broccoli', 'Rice'],
      ingredients: [
        { name: 'Lean Beef', amount: '8 oz', category: 'protein' },
        { name: 'Brown Rice', amount: '1 cup cooked', category: 'grains' },
        { name: 'Broccoli', amount: '2 cups', category: 'vegetables' },
        { name: 'Bell Peppers', amount: '1 large', category: 'vegetables' },
        { name: 'Olive Oil', amount: '1 tbsp', category: 'fats' },
        { name: 'Garlic', amount: '2 cloves', category: 'seasonings' }
      ]
    },
    {
      id: 'pasta-primavera',
      name: 'Italian Pasta Primavera',
      image: '🍝',
      cookTime: '25 min',
      servings: 2,
      difficulty: 'Easy',
      calories: 420,
      protein: 18,
      carbs: 68,
      fat: 12,
      fiber: 10,
      cuisine: 'Italian',
      tags: ['vegetarian', 'high-fiber'],
      dietaryCompatible: ['vegetarian'],
      mainIngredients: ['Pasta', 'Broccoli', 'Tomatoes'],
      ingredients: [
        { name: 'Whole Wheat Pasta', amount: '8 oz', category: 'grains' },
        { name: 'Broccoli', amount: '2 cups', category: 'vegetables' },
        { name: 'Cherry Tomatoes', amount: '1 cup', category: 'vegetables' },
        { name: 'Bell Peppers', amount: '1 large', category: 'vegetables' },
        { name: 'Olive Oil', amount: '2 tbsp', category: 'fats' },
        { name: 'Garlic', amount: '3 cloves', category: 'seasonings' }
      ]
    }
  ];

  let currentWeekStart = new Date();
  let mealPlan = {};
  let userGoals = {};
  let userProfile = {};

  // Load user data and preferences
  function loadUserData() {
    try {
      const goals = localStorage.getItem('fueliq_user_goals');
      const profile = localStorage.getItem('fueliq_user_profile');
      
      if (goals) userGoals = JSON.parse(goals);
      if (profile) userProfile = JSON.parse(profile);
      
      console.log('✅ User preferences loaded:', userProfile);
    } catch (e) {
      console.warn('Could not load user data:', e);
    }
  }

  // Smart recipe filtering based on food preferences
  function getFilteredRecipes() {
    loadUserData();
    
    return RECIPE_DATABASE.filter(recipe => {
      // Check foods to avoid
      if (userProfile.foodsIAvoid && userProfile.foodsIAvoid.length > 0) {
        const hasAvoidedIngredients = userProfile.foodsIAvoid.some(avoidedFood => 
          recipe.mainIngredients.some(ingredient => 
            ingredient.toLowerCase().includes(avoidedFood.toLowerCase()) ||
            avoidedFood.toLowerCase().includes(ingredient.toLowerCase())
          )
        );
        if (hasAvoidedIngredients) return false;
      }

      // Check dietary restrictions
      if (userProfile.dietaryRestrictions && userProfile.dietaryRestrictions.length > 0) {
        const hasCompatibleDiet = userProfile.dietaryRestrictions.some(diet => 
          recipe.dietaryCompatible.includes(diet.toLowerCase()) || 
          recipe.tags.includes(diet.toLowerCase().replace(/\s+/g, '-'))
        );
        if (userProfile.dietaryRestrictions.length > 0 && !hasCompatibleDiet) return false;
      }

      // Check allergies
      if (userProfile.allergies && userProfile.allergies.length > 0) {
        const allergenKeywords = {
          'Dairy/Lactose': ['dairy', 'cheese', 'milk', 'yogurt', 'feta'],
          'Gluten/Wheat': ['wheat', 'gluten', 'bread', 'pasta', 'tortilla'],
          'Nuts (Tree Nuts)': ['nuts', 'almond', 'walnut', 'pecan'],
          'Peanuts': ['peanut'],
          'Shellfish': ['shrimp', 'crab', 'lobster'],
          'Fish': ['fish', 'salmon', 'tuna'],
          'Eggs': ['egg'],
          'Soy': ['soy', 'tofu']
        };
        
        const hasAllergen = userProfile.allergies.some(allergy => {
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
      if (userProfile.antiBloutPreference && !recipe.tags.includes('anti-bloat')) {
        return false;
      }

      return true;
    });
  }

  // Score recipes based on user preferences
  function scoreMealByPreferences(recipe) {
    let score = 0;

    // Boost for loved foods
    if (userProfile.foodsILove && userProfile.foodsILove.length > 0) {
      const lovedIngredientsCount = userProfile.foodsILove.filter(lovedFood => 
        recipe.mainIngredients.some(ingredient => 
          ingredient.toLowerCase().includes(lovedFood.toLowerCase()) ||
          lovedFood.toLowerCase().includes(ingredient.toLowerCase())
        )
      ).length;
      score += lovedIngredientsCount * 10;
    }

    // Boost for preferred cuisines
    if (userProfile.cuisinePreferences && userProfile.cuisinePreferences.includes(recipe.cuisine)) {
      score += 5;
    }

    // Boost for anti-bloat if preferred
    if (userProfile.antiBloutPreference && recipe.tags.includes('anti-bloat')) {
      score += 3;
    }

    return score;
  }

  // Generate personalized meal plan for a day
  function generateDayMealPlan(targetCalories) {
    const filteredRecipes = getFilteredRecipes();
    const dayPlan = { breakfast: null, lunch: null, dinner: null };
    
    console.log(`🍽️ Generating plan from ${filteredRecipes.length} filtered recipes`);
    
    const calorieTargets = {
      breakfast: Math.round(targetCalories * 0.25),
      lunch: Math.round(targetCalories * 0.35),
      dinner: Math.round(targetCalories * 0.35)
    };

    for (const mealType of ['breakfast', 'lunch', 'dinner']) {
      const target = calorieTargets[mealType];
      let suitableRecipes = filteredRecipes.filter(recipe => {
        const calorieMatch = Math.abs(recipe.calories - target) < target * 0.4;
        
        if (mealType === 'breakfast') {
          return calorieMatch && recipe.tags.includes('breakfast');
        }
        return calorieMatch;
      });

      // If no breakfast-specific recipes, use any suitable recipes
      if (mealType === 'breakfast' && suitableRecipes.length === 0) {
        suitableRecipes = filteredRecipes.filter(recipe => 
          Math.abs(recipe.calories - target) < target * 0.4
        );
      }

      if (suitableRecipes.length > 0) {
        // Score and sort by preferences
        const scoredRecipes = suitableRecipes.map(recipe => ({
          ...recipe,
          preferenceScore: scoreMealByPreferences(recipe)
        })).sort((a, b) => b.preferenceScore - a.preferenceScore);
        
        // Select from top-scored recipes with some randomization
        const topRecipes = scoredRecipes.slice(0, Math.min(3, scoredRecipes.length));
        const selectedRecipe = topRecipes[Math.floor(Math.random() * topRecipes.length)];
        
        dayPlan[mealType] = selectedRecipe;
        
        console.log(`✅ ${mealType}: ${selectedRecipe.name} (score: ${selectedRecipe.preferenceScore})`);
      } else {
        console.warn(`⚠️ No suitable recipes for ${mealType}`);
      }
    }

    return dayPlan;
  }

  // Get Monday of the week
  function getMondayOfWeek(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  }

  // Create meal planning interface
  function createMealPlanningInterface(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    loadUserData();
    currentWeekStart = getMondayOfWeek(new Date());

    container.innerHTML = `
      <div class="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
        <div class="bg-gradient-to-r from-orange-500 to-red-600 shadow-2xl">
          <div class="max-w-7xl mx-auto px-6 py-8">
            <div class="text-center text-white">
              <h1 class="text-4xl font-bold mb-2">🍽️ Smart Meal Planning</h1>
              <p class="text-xl opacity-90">Personalized meal plans based on your preferences</p>
            </div>
          </div>
        </div>

        <div class="max-w-7xl mx-auto p-6">
          ${renderPreferencesDisplay()}
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <button id="generateWeekPlan" class="p-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl shadow-xl hover:scale-105 transition-all duration-200 font-bold text-lg">
              ✨ Generate Personalized Plan
            </button>
            <button id="viewRecipeBank" class="p-6 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-2xl shadow-xl hover:scale-105 transition-all duration-200 font-bold text-lg">
              📚 Browse Recipes
            </button>
            <button id="generateGroceryList" class="p-6 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl shadow-xl hover:scale-105 transition-all duration-200 font-bold text-lg">
              🛒 Create Grocery List
            </button>
          </div>

          <div class="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20">
            <h2 class="text-2xl font-bold text-gray-800 mb-6">📅 Weekly Meal Plan</h2>
            <div id="weeklyCalendar" class="grid grid-cols-1 lg:grid-cols-7 gap-4">
              <!-- Days will be populated here -->
            </div>
          </div>

          <div class="mt-8 bg-gradient-to-r from-orange-500 via-red-600 to-pink-600 rounded-3xl shadow-2xl p-8 text-white">
            <h3 class="text-2xl font-bold mb-6">📊 Weekly Nutrition Overview</h3>
            <div id="nutritionSummary" class="grid grid-cols-2 md:grid-cols-4 gap-6">
              <!-- Nutrition data will be populated here -->
            </div>
          </div>
        </div>
      </div>
    `;

    setupEventListeners();
    renderWeeklyCalendar();
    updateNutritionSummary();
  }

  // Render user preferences display
  function renderPreferencesDisplay() {
    const hasPreferences = (userProfile.foodsILove && userProfile.foodsILove.length > 0) ||
                          (userProfile.foodsIAvoid && userProfile.foodsIAvoid.length > 0) ||
                          (userProfile.cuisinePreferences && userProfile.cuisinePreferences.length > 0) ||
                          (userProfile.dietaryRestrictions && userProfile.dietaryRestrictions.length > 0);

    if (!hasPreferences) {
      return `
        <div class="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-8">
          <h3 class="text-blue-800 font-bold mb-2">💡 Enhance Your Experience</h3>
          <p class="text-blue-700">Complete your food preferences in Setup to get personalized meal recommendations!</p>
        </div>
      `;
    }

    return `
      <div class="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-6 mb-8 border border-white/20">
        <h2 class="text-2xl font-bold text-gray-800 mb-4 flex items-center">
          <span class="mr-3 text-2xl">🎯</span>
          Your Personalized Preferences
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          ${userProfile.foodsILove && userProfile.foodsILove.length > 0 ? `
            <div class="bg-green-50 p-4 rounded-xl">
              <h3 class="font-bold text-green-800 mb-2">❤️ Foods You Love</h3>
              <p class="text-sm text-green-700">${userProfile.foodsILove.slice(0, 3).join(', ')}${userProfile.foodsILove.length > 3 ? ` +${userProfile.foodsILove.length - 3} more` : ''}</p>
            </div>
          ` : ''}
          ${userProfile.foodsIAvoid && userProfile.foodsIAvoid.length > 0 ? `
            <div class="bg-red-50 p-4 rounded-xl">
              <h3 class="font-bold text-red-800 mb-2">🚫 Foods You Avoid</h3>
              <p class="text-sm text-red-700">${userProfile.foodsIAvoid.slice(0, 3).join(', ')}${userProfile.foodsIAvoid.length > 3 ? ` +${userProfile.foodsIAvoid.length - 3} more` : ''}</p>
            </div>
          ` : ''}
          ${userProfile.cuisinePreferences && userProfile.cuisinePreferences.length > 0 ? `
            <div class="bg-purple-50 p-4 rounded-xl">
              <h3 class="font-bold text-purple-800 mb-2">🌍 Favorite Cuisines</h3>
              <p class="text-sm text-purple-700">${userProfile.cuisinePreferences.slice(0, 2).join(', ')}${userProfile.cuisinePreferences.length > 2 ? ` +${userProfile.cuisinePreferences.length - 2} more` : ''}</p>
            </div>
          ` : ''}
          ${userProfile.dietaryRestrictions && userProfile.dietaryRestrictions.length > 0 ? `
            <div class="bg-orange-50 p-4 rounded-xl">
              <h3 class="font-bold text-orange-800 mb-2">🥗 Diet Style</h3>
              <p class="text-sm text-orange-700">${userProfile.dietaryRestrictions.join(', ')}</p>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  // Render weekly calendar
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
            ${renderMealSlot('breakfast', '🌅', dayPlan.breakfast, 'orange')}
            ${renderMealSlot('lunch', '☀️', dayPlan.lunch, 'green')}
            ${renderMealSlot('dinner', '🌙', dayPlan.dinner, 'purple')}
          </div>

          <div class="mt-4 pt-3 border-t border-gray-200">
            <div class="text-xs text-gray-600 text-center">
              ${calculateDayCalories(dayPlan)} / ${userGoals.dailyCalories || 2000} cal
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // Render meal slot with preference indicators
  function renderMealSlot(mealType, emoji, meal, color) {
    const colorClasses = {
      orange: {
        text: 'text-orange-600',
        bg: 'bg-gradient-to-r from-orange-100 to-orange-200'
      },
      green: {
        text: 'text-green-600', 
        bg: 'bg-gradient-to-r from-green-100 to-green-200'
      },
      purple: {
        text: 'text-purple-600',
        bg: 'bg-gradient-to-r from-purple-100 to-purple-200'
      }
    };

    const colorClass = colorClasses[color] || colorClasses.orange;

    if (meal) {
      // Check if meal contains loved ingredients
      const hasLovedIngredients = userProfile.foodsILove && userProfile.foodsILove.some(loved => 
        meal.mainIngredients.some(ingredient => 
          ingredient.toLowerCase().includes(loved.toLowerCase())
        )
      );

      return `
        <div class="meal-slot">
          <div class="text-xs font-semibold ${colorClass.text} mb-1">${emoji} ${mealType.toUpperCase()}</div>
          <div class="p-3 ${colorClass.bg} rounded-xl">
            <div class="font-medium text-sm flex items-center justify-between">
              <span>${meal.name}</span>
              ${hasLovedIngredients ? '<span class="text-lg">❤️</span>' : ''}
            </div>
            <div class="text-xs text-gray-600">${meal.calories} cal • ${meal.cuisine}</div>
            ${meal.preferenceScore > 0 ? '<div class="text-xs text-green-600">✨ Personalized for you</div>' : ''}
          </div>
        </div>
      `;
    } else {
      return `
        <div class="meal-slot">
          <div class="text-xs font-semibold ${colorClass.text} mb-1">${emoji} ${mealType.toUpperCase()}</div>
          <div class="p-3 border-2 border-dashed border-gray-300 rounded-xl text-center text-gray-500">
            <div class="text-xs">+ Add Meal</div>
          </div>
        </div>
      `;
    }
  }

  // Calculate daily calories
  function calculateDayCalories(dayPlan) {
    let total = 0;
    if (dayPlan.breakfast) total += dayPlan.breakfast.calories;
    if (dayPlan.lunch) total += dayPlan.lunch.calories;
    if (dayPlan.dinner) total += dayPlan.dinner.calories;
    return total;
  }

  // Update nutrition summary
  function updateNutritionSummary() {
    const summaryContainer = document.getElementById('nutritionSummary');
    if (!summaryContainer) return;

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

  // Setup event listeners
  function setupEventListeners() {
    document.getElementById('generateWeekPlan')?.addEventListener('click', generateWeeklyPlan);
    document.getElementById('viewRecipeBank')?.addEventListener('click', showRecipeBank);
    document.getElementById('generateGroceryList')?.addEventListener('click', generateGroceryList);
  }

  // Generate weekly meal plan
  function generateWeeklyPlan() {
    const targetCalories = userGoals.dailyCalories || 2000;
    
    console.log('🚀 Generating personalized weekly meal plan...');
    
    // Generate plan for each day of the week
    for (let i = 0; i < 7; i++) {
      const date = new Date(currentWeekStart);
      date.setDate(currentWeekStart.getDate() + i);
      const dateKey = date.toISOString().split('T')[0];
      
      mealPlan[dateKey] = generateDayMealPlan(targetCalories);
    }

    // Save meal plan
    try {
      localStorage.setItem('fueliq_meal_plan', JSON.stringify(mealPlan));
    } catch (e) {
      console.warn('Could not save meal plan:', e);
    }
    
    // Re-render calendar and update nutrition
    renderWeeklyCalendar();
    updateNutritionSummary();

    // Show personalized success message
    const filteredCount = getFilteredRecipes().length;
    const totalCount = RECIPE_DATABASE.length;
    
    alert(`✨ Personalized meal plan generated!\n\n🎯 Used ${filteredCount}/${totalCount} recipes that match your preferences\n💚 Meals prioritize your favorite ingredients\n🚫 Avoided foods you don't like\n🍽️ Optimized for your nutrition goals`);
  }

  // Show recipe bank
  function showRecipeBank() {
    const filteredRecipes = getFilteredRecipes();
    
    alert(`📚 Recipe Bank\n\nShowing ${filteredRecipes.length} recipes that match your dietary preferences and restrictions.\n\nFull recipe browsing interface coming soon! 🚀`);
  }

  // Generate grocery list
  function generateGroceryList() {
    if (Object.keys(mealPlan).length === 0) {
      alert('❌ Please generate a meal plan first!');
      return;
    }
    
    alert('🛒 Smart grocery list generation coming soon!\n\nYour list will automatically exclude foods you avoid and include all ingredients from your personalized meal plan.');
  }

  // Load existing meal plan
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

  // Initialize
  loadMealPlan();

  // Public API
  window.FuelIQMealPlanning = {
    renderMealPlanning: createMealPlanningInterface,
    cleanup: function() {
      console.log('🧹 Cleaning up meal planning module');
    }
  };

})();
