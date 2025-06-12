// Enhanced meal-planning.js with Pantry Integration
(function() {
  'use strict';

  // Load pantry data helper
  const loadPantryData = () => {
    try {
      const pantryData = localStorage.getItem('fueliq_pantry');
      return pantryData ? JSON.parse(pantryData) : { items: [] };
    } catch (e) {
      console.warn('Could not load pantry data:', e);
      return { items: [] };
    }
  };

  // Enhanced recipe database with ingredient matching
  const RECIPE_DATABASE = [
    {
      id: 'chicken-quinoa-bowl',
      name: 'Mediterranean Chicken Quinoa Bowl',
      image: '🥗',
      cookTime: '25 min',
      servings: 2,
      calories: 420,
      protein: 35,
      carbs: 45,
      fat: 12,
      cuisine: 'Mediterranean',
      mealType: 'lunch',
      ingredients: [
        { name: 'Chicken Breast', amount: '1 lb', category: 'protein' },
        { name: 'Quinoa', amount: '1 cup', category: 'grains' },
        { name: 'Bell Peppers', amount: '2 pieces', category: 'vegetables' },
        { name: 'Olive Oil', amount: '2 tbsp', category: 'fats' },
        { name: 'Tomatoes', amount: '2 pieces', category: 'vegetables' }
      ]
    },
    {
      id: 'salmon-broccoli',
      name: 'Herb-Crusted Salmon with Broccoli',
      image: '🐟',
      cookTime: '20 min',
      servings: 2,
      calories: 380,
      protein: 32,
      carbs: 15,
      fat: 22,
      cuisine: 'American',
      mealType: 'dinner',
      ingredients: [
        { name: 'Salmon Fillet', amount: '1 lb', category: 'protein' },
        { name: 'Broccoli', amount: '2 head', category: 'vegetables' },
        { name: 'Mixed Herbs', amount: '1 package', category: 'seasonings' },
        { name: 'Olive Oil', amount: '1 tbsp', category: 'fats' }
      ]
    },
    {
      id: 'beef-stir-fry',
      name: 'Asian Beef Stir Fry',
      image: '🥢',
      cookTime: '15 min',
      servings: 2,
      calories: 450,
      protein: 28,
      carbs: 35,
      fat: 18,
      cuisine: 'Asian',
      mealType: 'dinner',
      ingredients: [
        { name: 'Ground Beef', amount: '1 lb', category: 'protein' },
        { name: 'Bell Peppers', amount: '2 pieces', category: 'vegetables' },
        { name: 'Onions', amount: '1 piece', category: 'vegetables' },
        { name: 'Brown Rice', amount: '1 cup', category: 'grains' }
      ]
    },
    {
      id: 'veggie-scramble',
      name: 'Garden Veggie Scramble',
      image: '🍳',
      cookTime: '10 min',
      servings: 1,
      calories: 280,
      protein: 18,
      carbs: 12,
      fat: 18,
      cuisine: 'American',
      mealType: 'breakfast',
      ingredients: [
        { name: 'Eggs', amount: '3 pieces', category: 'protein' },
        { name: 'Spinach', amount: '1 cup', category: 'vegetables' },
        { name: 'Mushrooms', amount: '1/2 cup', category: 'vegetables' },
        { name: 'Cheese', amount: '1/4 cup', category: 'dairy' }
      ]
    },
    {
      id: 'greek-yogurt-bowl',
      name: 'Protein Greek Yogurt Bowl',
      image: '🥣',
      cookTime: '5 min',
      servings: 1,
      calories: 320,
      protein: 25,
      carbs: 35,
      fat: 8,
      cuisine: 'Mediterranean',
      mealType: 'breakfast',
      ingredients: [
        { name: 'Greek Yogurt', amount: '1 container', category: 'protein' },
        { name: 'Mixed Nuts', amount: '1/4 cup', category: 'fats' },
        { name: 'Oats', amount: '1/2 cup', category: 'grains' }
      ]
    },
    {
      id: 'turkey-sweet-potato',
      name: 'Turkey & Sweet Potato Hash',
      image: '🍠',
      cookTime: '20 min',
      servings: 2,
      calories: 390,
      protein: 30,
      carbs: 40,
      fat: 12,
      cuisine: 'American',
      mealType: 'lunch',
      ingredients: [
        { name: 'Ground Turkey', amount: '1 lb', category: 'protein' },
        { name: 'Sweet Potatoes', amount: '2 pieces', category: 'vegetables' },
        { name: 'Onions', amount: '1 piece', category: 'vegetables' },
        { name: 'Olive Oil', amount: '1 tbsp', category: 'fats' }
      ]
    },
    {
      id: 'tofu-stir-fry',
      name: 'Teriyaki Tofu Stir Fry',
      image: '🥘',
      cookTime: '18 min',
      servings: 2,
      calories: 340,
      protein: 20,
      carbs: 42,
      fat: 14,
      cuisine: 'Asian',
      mealType: 'lunch',
      ingredients: [
        { name: 'Extra Firm Tofu', amount: '1 block', category: 'protein' },
        { name: 'Broccoli', amount: '1 head', category: 'vegetables' },
        { name: 'Carrots', amount: '2 pieces', category: 'vegetables' },
        { name: 'Brown Rice', amount: '1 cup', category: 'grains' }
      ]
    },
    {
      id: 'overnight-oats',
      name: 'Protein Overnight Oats',
      image: '🌾',
      cookTime: '5 min',
      servings: 1,
      calories: 350,
      protein: 15,
      carbs: 55,
      fat: 8,
      cuisine: 'American',
      mealType: 'breakfast',
      ingredients: [
        { name: 'Rolled Oats', amount: '1/2 cup', category: 'grains' },
        { name: 'Greek Yogurt', amount: '1/2 container', category: 'protein' },
        { name: 'Mixed Nuts', amount: '2 tbsp', category: 'fats' },
        { name: 'Milk', amount: '1/2 cup', category: 'dairy' }
      ]
    }
  ];

  // Smart ingredient matching
  const findPantryMatches = (recipeIngredients, pantryItems) => {
    const matches = [];
    const missing = [];

    recipeIngredients.forEach(ingredient => {
      const pantryMatch = pantryItems.find(pantryItem => {
        const recipeName = ingredient.name.toLowerCase();
        const pantryName = pantryItem.name.toLowerCase();
        
        // Exact match or contains match
        return pantryName.includes(recipeName) || 
               recipeName.includes(pantryName) ||
               // Handle common variations
               (recipeName.includes('chicken') && pantryName.includes('chicken')) ||
               (recipeName.includes('beef') && pantryName.includes('beef')) ||
               (recipeName.includes('salmon') && pantryName.includes('salmon')) ||
               (recipeName.includes('tofu') && pantryName.includes('tofu')) ||
               (recipeName.includes('yogurt') && pantryName.includes('yogurt'));
      });

      if (pantryMatch) {
        matches.push({
          ingredient,
          pantryItem: pantryMatch,
          available: true
        });
      } else {
        missing.push({
          ingredient,
          available: false
        });
      }
    });

    return { matches, missing };
  };

  // Calculate pantry score for recipe
  const calculatePantryScore = (recipe, pantryItems) => {
    const { matches, missing } = findPantryMatches(recipe.ingredients, pantryItems);
    const matchPercentage = matches.length / recipe.ingredients.length;
    
    // Bonus for using expiring ingredients
    const expiringBonus = matches.some(match => {
      const daysUntilExpiry = getDaysUntilExpiry(match.pantryItem.expiryDate);
      return daysUntilExpiry !== null && daysUntilExpiry <= 3;
    }) ? 0.2 : 0;

    return {
      score: matchPercentage + expiringBonus,
      matchPercentage,
      availableIngredients: matches.length,
      totalIngredients: recipe.ingredients.length,
      missingIngredients: missing.length,
      matches,
      missing,
      hasExpiringIngredients: expiringBonus > 0
    };
  };

  // Helper function for expiry calculation
  const getDaysUntilExpiry = (expiryDate) => {
    if (!expiryDate) return null;
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Enhanced meal planning with pantry integration
  const generateSmartMealPlan = (preferences = {}, days = 7) => {
    const pantryData = loadPantryData();
    const pantryItems = pantryData.items || [];
    
    console.log('🛒 Pantry items loaded:', pantryItems.length);

    // Score all recipes based on preferences and pantry
    const scoredRecipes = RECIPE_DATABASE.map(recipe => {
      const pantryAnalysis = calculatePantryScore(recipe, pantryItems);
      const preferenceScore = calculatePreferenceScore(recipe, preferences);
      
      return {
        ...recipe,
        pantryAnalysis,
        preferenceScore,
        totalScore: (pantryAnalysis.score * 0.4) + (preferenceScore * 0.6) // Weight pantry 40%, preferences 60%
      };
    });

    // Sort by total score
    scoredRecipes.sort((a, b) => b.totalScore - a.totalScore);

    console.log('📊 Top scored recipes:', scoredRecipes.slice(0, 3).map(r => ({
      name: r.name,
      pantryScore: r.pantryAnalysis.score.toFixed(2),
      preferenceScore: r.preferenceScore.toFixed(2),
      totalScore: r.totalScore.toFixed(2)
    })));

    // Generate weekly plan
    const weekPlan = {};
    const usedRecipes = [];

    for (let day = 0; day < days; day++) {
      const dayName = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][day];
      
      // Select best available recipes for each meal type
      const breakfast = selectBestRecipe(scoredRecipes, 'breakfast', usedRecipes);
      const lunch = selectBestRecipe(scoredRecipes, 'lunch', usedRecipes);
      const dinner = selectBestRecipe(scoredRecipes, 'dinner', usedRecipes);

      weekPlan[dayName] = { breakfast, lunch, dinner };
    }

    return weekPlan;
  };

  // Enhanced preference scoring
  const calculatePreferenceScore = (recipe, preferences) => {
    let score = 0.5; // Base score

    // Foods I Love bonus
    if (preferences.foodsILove) {
      const lovedIngredients = recipe.ingredients.filter(ingredient =>
        preferences.foodsILove.some(loved => 
          ingredient.name.toLowerCase().includes(loved.toLowerCase()) ||
          loved.toLowerCase().includes(ingredient.name.toLowerCase())
        )
      );
      score += lovedIngredients.length * 0.15;
    }

    // Foods I Avoid penalty
    if (preferences.foodsIAvoid) {
      const avoidedIngredients = recipe.ingredients.filter(ingredient =>
        preferences.foodsIAvoid.some(avoided => 
          ingredient.name.toLowerCase().includes(avoided.toLowerCase()) ||
          avoided.toLowerCase().includes(ingredient.name.toLowerCase())
        )
      );
      if (avoidedIngredients.length > 0) {
        score = 0; // Completely avoid recipes with disliked ingredients
      }
    }

    // Cuisine preference bonus
    if (preferences.cuisinePreferences && preferences.cuisinePreferences.includes(recipe.cuisine)) {
      score += 0.1;
    }

    return Math.min(score, 1); // Cap at 1.0
  };

  // Select best recipe for meal type
  const selectBestRecipe = (scoredRecipes, mealType, usedRecipes) => {
    const availableRecipes = scoredRecipes.filter(recipe => 
      recipe.mealType === mealType && !usedRecipes.includes(recipe.id)
    );

    if (availableRecipes.length === 0) {
      // Fallback to any recipe of this type
      const fallback = scoredRecipes.find(recipe => recipe.mealType === mealType);
      return fallback || null;
    }

    const selected = availableRecipes[0];
    usedRecipes.push(selected.id);
    return selected;
  };

  // Generate shopping list from meal plan
  const generateShoppingList = (weekPlan) => {
    const pantryData = loadPantryData();
    const pantryItems = pantryData.items || [];
    const requiredIngredients = {};

    // Collect all ingredients from meal plan
    Object.values(weekPlan).forEach(dayPlan => {
      ['breakfast', 'lunch', 'dinner'].forEach(mealType => {
        const meal = dayPlan[mealType];
        if (meal && meal.ingredients) {
          meal.ingredients.forEach(ingredient => {
            const key = ingredient.name.toLowerCase();
            if (requiredIngredients[key]) {
              requiredIngredients[key].amount += parseFloat(ingredient.amount) || 1;
              requiredIngredients[key].recipes.push(meal.name);
            } else {
              requiredIngredients[key] = {
                ...ingredient,
                amount: parseFloat(ingredient.amount) || 1,
                recipes: [meal.name]
              };
            }
          });
        }
      });
    });

    // Filter out items available in pantry
    const shoppingList = [];
    Object.values(requiredIngredients).forEach(ingredient => {
      const pantryMatch = pantryItems.find(pantryItem => {
        const ingredientName = ingredient.name.toLowerCase();
        const pantryName = pantryItem.name.toLowerCase();
        return pantryName.includes(ingredientName) || ingredientName.includes(pantryName);
      });

      if (!pantryMatch) {
        shoppingList.push(ingredient);
      }
    });

    return shoppingList;
  };

  // Main render function
  const renderMealPlanning = (containerId) => {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Load user profile for preferences
    const userProfile = JSON.parse(localStorage.getItem('fueliq_user_profile') || '{}');
    const pantryData = loadPantryData();

    container.innerHTML = `
      <div class="max-w-6xl mx-auto p-6">
        <!-- Header with Pantry Integration -->
        <div class="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl p-6 mb-6 text-white">
          <h1 class="text-3xl font-bold mb-2">🍽️ Smart Meal Planning</h1>
          <p class="text-lg opacity-90 mb-4">AI-powered meal suggestions using your pantry</p>
          
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="text-center">
              <div class="text-2xl font-bold">${pantryData.items?.length || 0}</div>
              <div class="text-sm opacity-90">Pantry Items</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold">${userProfile.foodsILove?.length || 0}</div>
              <div class="text-sm opacity-90">Loved Foods</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold">${userProfile.cuisinePreferences?.length || 0}</div>
              <div class="text-sm opacity-90">Cuisines</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold">${RECIPE_DATABASE.length}</div>
              <div class="text-sm opacity-90">Recipes</div>
            </div>
          </div>
        </div>

        <!-- Smart Suggestions -->
        <div id="smart-suggestions" class="mb-6"></div>

        <!-- Generate Plan Button -->
        <div class="text-center mb-6">
          <button id="generate-plan-btn" class="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg transform hover:scale-105 transition-all">
            ✨ Generate Smart Meal Plan
          </button>
        </div>

        <!-- Meal Plan Display -->
        <div id="meal-plan-display" class="hidden">
          <div class="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 class="text-2xl font-bold text-gray-800 mb-4">📅 Your Weekly Meal Plan</h2>
            <div id="weekly-calendar" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"></div>
          </div>
          
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h2 class="text-2xl font-bold text-gray-800 mb-4">🛒 Smart Shopping List</h2>
            <div id="shopping-list" class="space-y-2"></div>
          </div>
        </div>
      </div>
    `;

    // Show smart suggestions
    showSmartSuggestions();

    // Bind generate plan button
    document.getElementById('generate-plan-btn').addEventListener('click', () => {
      generatePlan();
    });
  };

  // Show smart suggestions based on pantry
  const showSmartSuggestions = () => {
    const pantryData = loadPantryData();
    const pantryItems = pantryData.items || [];
    const suggestionsContainer = document.getElementById('smart-suggestions');

    if (pantryItems.length === 0) {
      suggestionsContainer.innerHTML = `
        <div class="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <p class="text-yellow-800">💡 <strong>Tip:</strong> Add items to your pantry to get personalized meal suggestions!</p>
        </div>
      `;
      return;
    }

    // Find recipes that use expiring ingredients
    const expiringItems = pantryItems.filter(item => {
      const days = getDaysUntilExpiry(item.expiryDate);
      return days !== null && days <= 3 && days >= 0;
    });

    // Find recipes with high pantry match
    const userProfile = JSON.parse(localStorage.getItem('fueliq_user_profile') || '{}');
    const scoredRecipes = RECIPE_DATABASE.map(recipe => ({
      ...recipe,
      pantryAnalysis: calculatePantryScore(recipe, pantryItems)
    })).filter(recipe => recipe.pantryAnalysis.matchPercentage >= 0.5)
      .sort((a, b) => b.pantryAnalysis.score - a.pantryAnalysis.score)
      .slice(0, 3);

    let suggestionsHTML = '';

    if (expiringItems.length > 0) {
      suggestionsHTML += `
        <div class="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-4">
          <h3 class="font-bold text-orange-800 mb-2">⚠️ Use Expiring Ingredients</h3>
          <p class="text-orange-700 text-sm">${expiringItems.length} item(s) expiring soon: ${expiringItems.map(item => item.name).join(', ')}</p>
        </div>
      `;
    }

    if (scoredRecipes.length > 0) {
      suggestionsHTML += `
        <div class="bg-green-50 border border-green-200 rounded-xl p-4">
          <h3 class="font-bold text-green-800 mb-3">🎯 Recommended Recipes (Using Your Pantry)</h3>
          <div class="space-y-2">
            ${scoredRecipes.map(recipe => `
              <div class="flex items-center justify-between bg-white rounded-lg p-3">
                <div class="flex items-center gap-3">
                  <span class="text-2xl">${recipe.image}</span>
                  <div>
                    <div class="font-semibold">${recipe.name}</div>
                    <div class="text-sm text-gray-600">${recipe.pantryAnalysis.availableIngredients}/${recipe.pantryAnalysis.totalIngredients} ingredients available</div>
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-sm font-bold text-green-600">${Math.round(recipe.pantryAnalysis.matchPercentage * 100)}% match</div>
                  ${recipe.pantryAnalysis.hasExpiringIngredients ? '<div class="text-xs text-orange-600">⚠️ Uses expiring items</div>' : ''}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    suggestionsContainer.innerHTML = suggestionsHTML;
  };

  // Generate and display meal plan
  const generatePlan = () => {
    const userProfile = JSON.parse(localStorage.getItem('fueliq_user_profile') || '{}');
    const weekPlan = generateSmartMealPlan(userProfile, 7);
    const shoppingList = generateShoppingList(weekPlan);

    // Show meal plan
    displayWeekPlan(weekPlan);
    displayShoppingList(shoppingList);

    // Show the meal plan section
    document.getElementById('meal-plan-display').classList.remove('hidden');

    // Save meal plan
    localStorage.setItem('fueliq_meal_plan', JSON.stringify(weekPlan));

    console.log('✅ Smart meal plan generated with pantry integration!');
  };

  // Display weekly calendar
  const displayWeekPlan = (weekPlan) => {
    const calendar = document.getElementById('weekly-calendar');
    
    calendar.innerHTML = Object.entries(weekPlan).map(([day, meals]) => `
      <div class="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
        <h3 class="font-bold text-purple-800 mb-3">${day}</h3>
        <div class="space-y-3">
          ${['breakfast', 'lunch', 'dinner'].map(mealType => {
            const meal = meals[mealType];
            if (!meal) return '';
            
            const pantryData = loadPantryData();
            const pantryAnalysis = calculatePantryScore(meal, pantryData.items || []);
            
            return `
              <div class="bg-white rounded-lg p-3 border border-purple-100">
                <div class="flex items-center justify-between mb-2">
                  <div class="flex items-center gap-2">
                    <span class="text-lg">${meal.image}</span>
                    <div>
                      <div class="font-semibold text-sm">${meal.name}</div>
                      <div class="text-xs text-gray-600">${mealType} • ${meal.cookTime}</div>
                    </div>
                  </div>
                  ${pantryAnalysis.matchPercentage > 0.5 ? '<span class="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">🛒 Pantry Match</span>' : ''}
                </div>
                <div class="text-xs text-gray-600">
                  ${pantryAnalysis.availableIngredients}/${pantryAnalysis.totalIngredients} ingredients available
                  ${pantryAnalysis.hasExpiringIngredients ? ' • ⚠️ Uses expiring items' : ''}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `).join('');
  };

  // Display shopping list
  const displayShoppingList = (shoppingList) => {
    const container = document.getElementById('shopping-list');
    
    if (shoppingList.length === 0) {
      container.innerHTML = `
        <div class="text-center py-6">
          <span class="text-4xl">🎉</span>
          <p class="text-lg font-semibold text-green-600 mt-2">You have everything you need!</p>
          <p class="text-gray-600">All ingredients are available in your pantry.</p>
        </div>
      `;
      return;
    }

    // Group by category
    const grouped = {};
    shoppingList.forEach(item => {
      if (!grouped[item.category]) grouped[item.category] = [];
      grouped[item.category].push(item);
    });

    container.innerHTML = Object.entries(grouped).map(([category, items]) => `
      <div class="border border-gray-200 rounded-lg p-4">
        <h4 class="font-semibold text-gray-800 mb-2 capitalize">${category}</h4>
        <div class="space-y-1">
          ${items.map(item => `
            <div class="flex items-center justify-between text-sm">
              <span>${item.name}</span>
              <span class="text-gray-500">${item.amount} ${item.unit || ''}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `).join('');
  };

  // Cleanup function
  const cleanup = () => {
    // Remove event listeners if needed
  };

  // Export
  window.FuelIQMealPlanning = {
    renderMealPlanning,
    cleanup,
    generateSmartMealPlan,
    generateShoppingList
  };

})();
