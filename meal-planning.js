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
        { name: 'Chicken Breast', amount: '1', unit: 'lbs', category: 'protein' },
        { name: 'Quinoa', amount: '1', unit: 'cups', category: 'grains' },
        { name: 'Bell Peppers', amount: '2', unit: 'pieces', category: 'vegetables' },
        { name: 'Olive Oil', amount: '2', unit: 'tbsp', category: 'fats' },
        { name: 'Tomatoes', amount: '2', unit: 'pieces', category: 'vegetables' }
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
        { name: 'Salmon Fillet', amount: '1', unit: 'lbs', category: 'protein' },
        { name: 'Broccoli', amount: '2', unit: 'heads', category: 'vegetables' },
        { name: 'Mixed Herbs', amount: '1', unit: 'packages', category: 'seasonings' },
        { name: 'Olive Oil', amount: '1', unit: 'tbsp', category: 'fats' }
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
        { name: 'Ground Beef', amount: '1', unit: 'lbs', category: 'protein' },
        { name: 'Bell Peppers', amount: '2', unit: 'pieces', category: 'vegetables' },
        { name: 'Onions', amount: '1', unit: 'pieces', category: 'vegetables' },
        { name: 'Brown Rice', amount: '1', unit: 'cups', category: 'grains' }
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
        { name: 'Eggs', amount: '3', unit: 'pieces', category: 'protein' },
        { name: 'Spinach', amount: '1', unit: 'cups', category: 'vegetables' },
        { name: 'Mushrooms', amount: '0.5', unit: 'cups', category: 'vegetables' },
        { name: 'Cheese', amount: '0.25', unit: 'cups', category: 'dairy' }
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
        { name: 'Greek Yogurt', amount: '1', unit: 'containers', category: 'protein' },
        { name: 'Mixed Nuts', amount: '0.25', unit: 'cups', category: 'fats' },
        { name: 'Oats', amount: '0.5', unit: 'cups', category: 'grains' }
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
        { name: 'Ground Turkey', amount: '1', unit: 'lbs', category: 'protein' },
        { name: 'Sweet Potatoes', amount: '2', unit: 'pieces', category: 'vegetables' },
        { name: 'Onions', amount: '1', unit: 'pieces', category: 'vegetables' },
        { name: 'Olive Oil', amount: '1', unit: 'tbsp', category: 'fats' }
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
        { name: 'Extra Firm Tofu', amount: '1', unit: 'blocks', category: 'protein' },
        { name: 'Broccoli', amount: '1', unit: 'heads', category: 'vegetables' },
        { name: 'Carrots', amount: '2', unit: 'pieces', category: 'vegetables' },
        { name: 'Brown Rice', amount: '1', unit: 'cups', category: 'grains' }
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
        { name: 'Rolled Oats', amount: '0.5', unit: 'cups', category: 'grains' },
        { name: 'Greek Yogurt', amount: '0.5', unit: 'containers', category: 'protein' },
        { name: 'Mixed Nuts', amount: '2', unit: 'tbsp', category: 'fats' },
        { name: 'Milk', amount: '0.5', unit: 'cups', category: 'dairy' }
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
        
        return pantryName.includes(recipeName) || 
               recipeName.includes(pantryName) ||
               (recipeName.includes('chicken') && pantryName.includes('chicken')) ||
               (recipeName.includes('beef') && pantryName.includes('beef')) ||
               (recipeName.includes('salmon') && pantryName.includes('salmon')) ||
               (recipeName.includes('tofu') && pantryName.includes('tofu')) ||
               (recipeName.includes('yogurt') && pantryName.includes('yogurt'));
      });

      if (pantryMatch) {
        matches.push({ ingredient, pantryItem: pantryMatch, available: true });
      } else {
        missing.push({ ingredient, available: false });
      }
    });

    return { matches, missing };
  };

  // Calculate pantry score for recipe
  const calculatePantryScore = (recipe, pantryItems) => {
    const { matches, missing } = findPantryMatches(recipe.ingredients, pantryItems);
    const matchPercentage = matches.length / recipe.ingredients.length;
    
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

  // Enhanced preference scoring
  const calculatePreferenceScore = (recipe, preferences) => {
    let score = 0.5;

    if (preferences.foodsILove) {
      const lovedIngredients = recipe.ingredients.filter(ingredient =>
        preferences.foodsILove.some(loved => 
          ingredient.name.toLowerCase().includes(loved.toLowerCase()) ||
          loved.toLowerCase().includes(ingredient.name.toLowerCase())
        )
      );
      score += lovedIngredients.length * 0.15;
    }

    if (preferences.foodsIAvoid) {
      const avoidedIngredients = recipe.ingredients.filter(ingredient =>
        preferences.foodsIAvoid.some(avoided => 
          ingredient.name.toLowerCase().includes(avoided.toLowerCase()) ||
          avoided.toLowerCase().includes(ingredient.name.toLowerCase())
        )
      );
      if (avoidedIngredients.length > 0) {
        score = 0;
      }
    }

    if (preferences.cuisinePreferences && preferences.cuisinePreferences.includes(recipe.cuisine)) {
      score += 0.1;
    }

    return Math.min(score, 1);
  };

  // Select best recipe for meal type
  const selectBestRecipe = (scoredRecipes, mealType, usedRecipes) => {
    const availableRecipes = scoredRecipes.filter(recipe => 
      recipe.mealType === mealType && !usedRecipes.includes(recipe.id)
    );

    if (availableRecipes.length === 0) {
      const fallback = scoredRecipes.find(recipe => recipe.mealType === mealType);
      return fallback || null;
    }

    const selected = availableRecipes[0];
    usedRecipes.push(selected.id);
    return selected;
  };

  // Enhanced meal planning with pantry integration
  const generateSmartMealPlan = (preferences = {}, days = 7) => {
    const pantryData = loadPantryData();
    const pantryItems = pantryData.items || [];
    
    console.log('🛒 Pantry items loaded:', pantryItems.length);

    const scoredRecipes = RECIPE_DATABASE.map(recipe => {
      const pantryAnalysis = calculatePantryScore(recipe, pantryItems);
      const preferenceScore = calculatePreferenceScore(recipe, preferences);
      
      return {
        ...recipe,
        pantryAnalysis,
        preferenceScore,
        totalScore: (pantryAnalysis.score * 0.4) + (preferenceScore * 0.6)
      };
    });

    scoredRecipes.sort((a, b) => b.totalScore - a.totalScore);

    const weekPlan = {};
    const usedRecipes = [];

    for (let day = 0; day < days; day++) {
      const dayName = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][day];
      
      const breakfast = selectBestRecipe(scoredRecipes, 'breakfast', usedRecipes);
      const lunch = selectBestRecipe(scoredRecipes, 'lunch', usedRecipes);
      const dinner = selectBestRecipe(scoredRecipes, 'dinner', usedRecipes);

      weekPlan[dayName] = { breakfast, lunch, dinner };
    }

    return weekPlan;
  };

  // Enhanced Shopping List Generation with Clear Quantities
  const generateShoppingList = (weekPlan) => {
    const pantryData = loadPantryData();
    const pantryItems = pantryData.items || [];
    const requiredIngredients = {};

    Object.entries(weekPlan).forEach(([day, dayPlan]) => {
      ['breakfast', 'lunch', 'dinner'].forEach(mealType => {
        const meal = dayPlan[mealType];
        if (meal && meal.ingredients) {
          meal.ingredients.forEach(ingredient => {
            const key = ingredient.name.toLowerCase();
            if (requiredIngredients[key]) {
              requiredIngredients[key].totalAmount += parseFloat(ingredient.amount) || 1;
              requiredIngredients[key].recipes.push(`${meal.name} (${day} ${mealType})`);
              requiredIngredients[key].occasions.push({ day, mealType, meal: meal.name });
            } else {
              requiredIngredients[key] = {
                name: ingredient.name,
                category: ingredient.category,
                unit: ingredient.unit || getDefaultUnit(ingredient.name, ingredient.category),
                totalAmount: parseFloat(ingredient.amount) || 1,
                recipes: [`${meal.name} (${day} ${mealType})`],
                occasions: [{ day, mealType, meal: meal.name }],
                estimatedCost: estimateIngredientCost(ingredient.name)
              };
            }
          });
        }
      });
    });

    const shoppingList = [];
    Object.values(requiredIngredients).forEach(ingredient => {
      const pantryMatch = findPantryMatch(ingredient, pantryItems);
      
      if (!pantryMatch || pantryMatch.quantity < ingredient.totalAmount) {
        const neededAmount = pantryMatch ? 
          Math.max(0, ingredient.totalAmount - pantryMatch.quantity) : 
          ingredient.totalAmount;
          
        shoppingList.push({
          ...ingredient,
          neededAmount: neededAmount,
          originalAmount: ingredient.totalAmount,
          pantryAvailable: pantryMatch ? pantryMatch.quantity : 0,
          hasPantryItem: !!pantryMatch
        });
      }
    });

    return shoppingList;
  };

  // Get appropriate unit for ingredient
  function getDefaultUnit(ingredientName, category) {
    const unitMap = {
      'chicken breast': 'lbs', 'ground beef': 'lbs', 'salmon fillet': 'lbs',
      'ground turkey': 'lbs', 'eggs': 'pieces', 'tofu': 'blocks',
      'greek yogurt': 'containers', 'broccoli': 'heads', 'spinach': 'bags',
      'bell peppers': 'pieces', 'tomatoes': 'pieces', 'onions': 'pieces',
      'carrots': 'pieces', 'mushrooms': 'cups', 'sweet potatoes': 'pieces',
      'brown rice': 'cups', 'quinoa': 'cups', 'oats': 'cups',
      'milk': 'cups', 'cheese': 'cups', 'olive oil': 'tbsp'
    };

    const ingredientKey = ingredientName.toLowerCase();
    if (unitMap[ingredientKey]) return unitMap[ingredientKey];
    
    for (const [key, unit] of Object.entries(unitMap)) {
      if (ingredientKey.includes(key) || key.includes(ingredientKey)) {
        return unit;
      }
    }
    
    const categoryDefaults = {
      'protein': 'lbs', 'vegetables': 'pieces', 'grains': 'cups',
      'dairy': 'containers', 'fats': 'tbsp', 'seasonings': 'tsp'
    };
    
    return categoryDefaults[category] || 'pieces';
  }

  // Estimate cost for budgeting
  function estimateIngredientCost(ingredientName) {
    const costMap = {
      'chicken breast': 3.50, 'salmon fillet': 8.99, 'ground beef': 5.99,
      'broccoli': 2.99, 'spinach': 3.49, 'bell peppers': 1.99,
      'brown rice': 2.49, 'quinoa': 4.99, 'eggs': 3.99, 'milk': 3.49
    };
    
    return costMap[ingredientName.toLowerCase()] || 2.99;
  }

  // Smart pantry matching
  function findPantryMatch(ingredient, pantryItems) {
    return pantryItems.find(pantryItem => {
      const ingredientName = ingredient.name.toLowerCase();
      const pantryName = pantryItem.name.toLowerCase();
      
      if (pantryName === ingredientName) return true;
      if (pantryName.includes(ingredientName) || ingredientName.includes(pantryName)) return true;
      
      const variations = {
        'chicken': 'chicken breast', 'ground beef': 'beef', 'spinach': 'baby spinach',
        'bell peppers': 'peppers', 'sweet potatoes': 'sweet potato'
      };
      
      for (const [variation, canonical] of Object.entries(variations)) {
        if ((ingredientName.includes(variation) && pantryName.includes(canonical)) ||
            (ingredientName.includes(canonical) && pantryName.includes(variation))) {
          return true;
        }
      }
      
      return false;
    });
  }

  // Enhanced shopping list display with clear quantities and context
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

    const totalCost = shoppingList.reduce((sum, item) => sum + (item.estimatedCost * item.neededAmount), 0);

    const grouped = {};
    shoppingList.forEach(item => {
      if (!grouped[item.category]) grouped[item.category] = [];
      grouped[item.category].push(item);
    });

    container.innerHTML = `
      <div class="space-y-4">
        <!-- Shopping Summary -->
        <div class="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4">
          <div class="flex items-center justify-between mb-3">
            <div>
              <h4 class="font-bold text-blue-800">📋 Shopping Summary</h4>
              <p class="text-sm text-blue-600">
                ${shoppingList.length} items needed • Estimated total: $${totalCost.toFixed(2)}
              </p>
            </div>
            <div class="text-xs text-blue-600 text-right">
              <div>${shoppingList.filter(item => item.hasPantryItem).length} items partially in pantry</div>
              <div>${shoppingList.filter(item => !item.hasPantryItem).length} items needed completely</div>
            </div>
          </div>
        </div>

        <!-- Shopping List by Category -->
        ${Object.entries(grouped).map(([category, items]) => `
          <div class="border border-gray-200 rounded-lg p-4">
            <div class="flex items-center justify-between mb-3">
              <h4 class="font-semibold text-gray-800 capitalize flex items-center">
                ${getCategoryIcon(category)} ${category}
                <span class="ml-2 text-sm text-gray-500">(${items.length} items)</span>
              </h4>
              <div class="text-sm text-gray-600">
                Est. $${items.reduce((sum, item) => sum + (item.estimatedCost * item.neededAmount), 0).toFixed(2)}
              </div>
            </div>
            <div class="space-y-3">
              ${items.map(item => `
                <div class="bg-gray-50 rounded-lg p-3">
                  <div class="flex items-start justify-between">
                    <div class="flex-1">
                      <div class="flex items-center space-x-3">
                        <input type="checkbox" class="delivery-item" data-item='${JSON.stringify(item)}' checked>
                        <div>
                          <div class="font-medium text-gray-800">${item.name}</div>
                          <div class="text-sm text-gray-600">
                            Need: <strong>${formatQuantity(item.neededAmount, item.unit)}</strong>
                            ${item.hasPantryItem ? 
                              `• Have: ${formatQuantity(item.pantryAvailable, item.unit)} in pantry` : 
                              '• Not in pantry'
                            }
                          </div>
                          <div class="text-xs text-gray-500 mt-1">
                            For: ${item.recipes.slice(0, 2).join(', ')}
                            ${item.recipes.length > 2 ? ` +${item.recipes.length - 2} more` : ''}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="text-right ml-4">
                      <div class="text-sm font-bold text-orange-600">
                        $${(item.estimatedCost * item.neededAmount).toFixed(2)}
                      </div>
                      <div class="text-xs text-gray-500">
                        $${item.estimatedCost.toFixed(2)} per ${item.unit}
                      </div>
                      <button onclick="showIngredientDetails('${item.name}')" 
                              class="text-xs text-blue-500 hover:text-blue-600 mt-1">
                        View details
                      </button>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        `).join('')}

        ${shoppingList.some(item => item.hasPantryItem) ? `
          <div class="bg-green-50 border border-green-200 rounded-xl p-4">
            <h4 class="font-bold text-green-800 mb-2">💡 Pantry Optimization</h4>
            <div class="text-sm text-green-700 space-y-1">
              ${shoppingList.filter(item => item.hasPantryItem).slice(0, 3).map(item => 
                `<div>• You have ${formatQuantity(item.pantryAvailable, item.unit)} ${item.name}, need ${formatQuantity(item.neededAmount, item.unit)} more</div>`
              ).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    `;
  };

  // Helper functions
  function formatQuantity(amount, unit) {
    const num = parseFloat(amount);
    const formatted = num % 1 === 0 ? num.toString() : num.toFixed(1);
    
    const singularUnits = {
      'pieces': 'piece', 'heads': 'head', 'bags': 'bag', 'blocks': 'block',
      'containers': 'container', 'loaves': 'loaf', 'boxes': 'box', 'sticks': 'stick'
    };
    
    const displayUnit = (num === 1 && singularUnits[unit]) ? singularUnits[unit] : unit;
    return `${formatted} ${displayUnit}`;
  }

  function getCategoryIcon(category) {
    const icons = {
      'protein': '🥩', 'vegetables': '🥬', 'grains': '🌾',
      'dairy': '🥛', 'fats': '🫒', 'seasonings': '🧂'
    };
    return icons[category] || '📦';
  }

  // Show detailed ingredient information
  window.showIngredientDetails = function(ingredientName) {
    const ingredient = getCurrentShoppingList().find(item => item.name === ingredientName);
    if (!ingredient) return;

    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50';
    
    modal.innerHTML = `
      <div class="bg-white rounded-xl p-6 w-full max-w-lg">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-bold text-gray-800">${ingredient.name}</h3>
          <button onclick="this.parentElement.parentElement.parentElement.remove()" 
                  class="text-gray-500 hover:text-gray-700 text-xl">×</button>
        </div>
        
        <div class="space-y-4">
          <div class="bg-gray-50 rounded-lg p-4">
            <h4 class="font-semibold mb-2">Quantity Needed</h4>
            <div class="text-sm space-y-1">
              <div>Total needed: <strong>${formatQuantity(ingredient.originalAmount, ingredient.unit)}</strong></div>
              ${ingredient.hasPantryItem ? 
                `<div>Available in pantry: <strong>${formatQuantity(ingredient.pantryAvailable, ingredient.unit)}</strong></div>
                 <div>Need to buy: <strong>${formatQuantity(ingredient.neededAmount, ingredient.unit)}</strong></div>` :
                `<div>Not in pantry - need to buy: <strong>${formatQuantity(ingredient.neededAmount, ingredient.unit)}</strong></div>`
              }
            </div>
          </div>
          
          <div class="bg-gray-50 rounded-lg p-4">
            <h4 class="font-semibold mb-2">Used In Recipes</h4>
            <div class="text-sm space-y-1">
              ${ingredient.occasions.map(occasion => 
                `<div>• ${occasion.meal} (${occasion.day} ${occasion.mealType})</div>`
              ).join('')}
            </div>
          </div>
          
          <div class="bg-gray-50 rounded-lg p-4">
            <h4 class="font-semibold mb-2">Cost Estimate</h4>
            <div class="text-sm">
              <div>Price per ${ingredient.unit}: $${ingredient.estimatedCost.toFixed(2)}</div>
              <div>Total cost: <strong>$${(ingredient.estimatedCost * ingredient.neededAmount).toFixed(2)}</strong></div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
  };

  // Helper to get current shopping list
  function getCurrentShoppingList() {
    const checkboxes = document.querySelectorAll('.delivery-item');
    return Array.from(checkboxes).map(cb => JSON.parse(cb.dataset.item));
  }

  // Main render function - THIS WAS MISSING!
  const renderMealPlanning = (containerId) => {
    const container = document.getElementById(containerId);
    if (!container) return;

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

    showSmartSuggestions();

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

    const userProfile = JSON.parse(localStorage.getItem('fueliq_user_profile') || '{}');
    const scoredRecipes = RECIPE_DATABASE.map(recipe => ({
      ...recipe,
      pantryAnalysis: calculatePantryScore(recipe, pantryItems)
    })).filter(recipe => recipe.pantryAnalysis.matchPercentage >= 0.5)
      .sort((a, b) => b.pantryAnalysis.score - a.pantryAnalysis.score)
      .slice(0, 3);

    if (scoredRecipes.length > 0) {
      suggestionsContainer.innerHTML = `
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
  };

  // Generate and display meal plan
  const generatePlan = () => {
    const userProfile = JSON.parse(localStorage.getItem('fueliq_user_profile') || '{}');
    const weekPlan = generateSmartMealPlan(userProfile, 7);
    const shoppingList = generateShoppingList(weekPlan);

    displayWeekPlan(weekPlan);
    displayShoppingList(shoppingList);

    document.getElementById('meal-plan-display').classList.remove('hidden');
    localStorage.setItem('fueliq_meal_plan', JSON.stringify(weekPlan));

    console.log('✅ Smart meal plan generated with pantry integration!');
  };

  // Display weekly calendar with clickable meal cards
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
            <div class="bg-white rounded-lg p-3 border border-purple-100 hover:border-purple-300 cursor-pointer transform hover:scale-[1.02] transition-all duration-200" 
                 onclick="showRecipeDetails('${meal.id}', '${day}', '${mealType}')">
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-2">
                  <span class="text-lg">${meal.image}</span>
                  <div>
                    <div class="font-semibold text-sm hover:text-purple-600 transition-colors">${meal.name}</div>
                    <div class="text-xs text-gray-600">${mealType} • ${meal.cookTime}</div>
                  </div>
                </div>
                <div class="flex flex-col gap-1">
                  ${pantryAnalysis.matchPercentage > 0.5 ? `<span class="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">🛒 ${Math.round(pantryAnalysis.matchPercentage * 100)}%</span>` : ''}
                  <span class="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">${meal.calories} cal</span>
                </div>
              </div>
              <div class="text-xs text-gray-600 mb-2">
                ${pantryAnalysis.availableIngredients}/${pantryAnalysis.totalIngredients} ingredients available
                ${pantryAnalysis.hasExpiringIngredients ? ' • ⚠️ Uses expiring items' : ''}
              </div>
              <div class="text-xs text-gray-400 text-center">
                🍽️ Click for recipe details & instructions
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `).join('');

  // Add the recipe modal HTML to the page (only once)
  if (!document.getElementById('recipe-modal')) {
    const modalHTML = `
      <div id="recipe-modal" class="fixed inset-0 bg-black bg-opacity-50 z-50 hidden flex items-center justify-center p-4">
        <div class="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div id="recipe-modal-content">
            <!-- Recipe details will be inserted here -->
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
  }
};
// Show detailed recipe information in modal
window.showRecipeDetails = function(recipeId, day, mealType) {
  const recipe = RECIPE_DATABASE.find(r => r.id === recipeId);
  if (!recipe) return;

  const pantryData = loadPantryData();
  const pantryItems = pantryData.items || [];
  const pantryAnalysis = calculatePantryScore(recipe, pantryItems);
  
  const modalContent = document.getElementById('recipe-modal-content');
  modalContent.innerHTML = `
    <!-- Modal Header -->
    <div class="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-t-lg">
      <div class="flex justify-between items-start">
        <div>
          <h2 class="text-2xl font-bold mb-2">${recipe.image} ${recipe.name}</h2>
          <div class="flex gap-4 text-sm opacity-90">
            <span>🕒 ${recipe.cookTime}</span>
            <span>👥 ${recipe.servings} servings</span>
            <span>🏷️ ${recipe.mealType}</span>
            <span>📅 ${day} ${mealType}</span>
          </div>
        </div>
        <button onclick="closeRecipeModal()" 
                class="text-white hover:text-gray-200 text-2xl font-bold transition-colors">
          ×
        </button>
      </div>
    </div>

    <div class="p-6">
      <!-- Quick Stats Row -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div class="bg-green-50 rounded-lg p-3 text-center">
          <div class="text-2xl font-bold text-green-600">${recipe.calories}</div>
          <div class="text-sm text-gray-600">Calories</div>
        </div>
        <div class="bg-blue-50 rounded-lg p-3 text-center">
          <div class="text-2xl font-bold text-blue-600">${pantryAnalysis.availableIngredients}/${pantryAnalysis.totalIngredients}</div>
          <div class="text-sm text-gray-600">In Pantry</div>
        </div>
        <div class="bg-orange-50 rounded-lg p-3 text-center">
          <div class="text-2xl font-bold text-orange-600">${recipe.protein}g</div>
          <div class="text-sm text-gray-600">Protein</div>
        </div>
        <div class="bg-purple-50 rounded-lg p-3 text-center">
          <div class="text-2xl font-bold text-purple-600">${Math.round(pantryAnalysis.matchPercentage * 100)}%</div>
          <div class="text-sm text-gray-600">Pantry Match</div>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="grid md:grid-cols-2 gap-6">
        
        <!-- Left Column: Ingredients & Nutrition -->
        <div class="space-y-6">
          
          <!-- Ingredients List -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h3 class="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <span class="text-xl">🛒</span> Ingredients
            </h3>
            <div class="space-y-2">
              ${recipe.ingredients.map(ingredient => {
                const pantryMatch = findPantryMatch(ingredient, pantryItems);
                const hasInPantry = !!pantryMatch;
                
                return `
                  <div class="flex items-center justify-between p-2 bg-white rounded border ${hasInPantry ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}">
                    <div class="flex items-center gap-2">
                      <span class="text-lg">${hasInPantry ? '✅' : '🛒'}</span>
                      <span class="font-medium">${ingredient.name}</span>
                    </div>
                    <div class="text-right">
                      <div class="text-sm font-medium">${ingredient.amount} ${ingredient.unit}</div>
                      <div class="text-xs ${hasInPantry ? 'text-green-600' : 'text-red-600'}">
                        ${hasInPantry ? 'Have in pantry' : 'Need to buy'}
                      </div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <!-- Detailed Nutrition -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h3 class="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <span class="text-xl">📊</span> Nutrition Facts
            </h3>
            <div class="space-y-3">
              <div class="flex justify-between items-center py-2 border-b border-gray-200">
                <span class="font-medium">Calories</span>
                <span class="font-bold text-lg">${recipe.calories}</span>
              </div>
              
              <!-- Macronutrients -->
              <div class="space-y-2">
                <div class="flex justify-between items-center">
                  <span class="text-green-600 font-medium">Protein</span>
                  <div class="text-right">
                    <span class="font-bold">${recipe.protein}g</span>
                    <span class="text-sm text-gray-500 ml-1">(${Math.round((recipe.protein * 4 / recipe.calories) * 100)}%)</span>
                  </div>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-blue-600 font-medium">Carbohydrates</span>
                  <div class="text-right">
                    <span class="font-bold">${recipe.carbs}g</span>
                    <span class="text-sm text-gray-500 ml-1">(${Math.round((recipe.carbs * 4 / recipe.calories) * 100)}%)</span>
                  </div>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-orange-600 font-medium">Fat</span>
                  <div class="text-right">
                    <span class="font-bold">${recipe.fat}g</span>
                    <span class="text-sm text-gray-500 ml-1">(${Math.round((recipe.fat * 9 / recipe.calories) * 100)}%)</span>
                  </div>
                </div>
              </div>

              <!-- Visual Macro Breakdown -->
              <div class="mt-4">
                <div class="text-sm text-gray-600 mb-2">Macronutrient Distribution</div>
                <div class="flex h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div class="bg-green-500" style="width: ${Math.round((recipe.protein * 4 / recipe.calories) * 100)}%"></div>
                  <div class="bg-blue-500" style="width: ${Math.round((recipe.carbs * 4 / recipe.calories) * 100)}%"></div>
                  <div class="bg-orange-500" style="width: ${Math.round((recipe.fat * 9 / recipe.calories) * 100)}%"></div>
                </div>
                <div class="flex justify-between text-xs text-gray-500 mt-1">
                  <span>🟢 Protein</span>
                  <span>🔵 Carbs</span>
                  <span>🟠 Fat</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        <!-- Right Column: Instructions & Actions -->
        <div class="space-y-6">
          
          <!-- Cooking Instructions -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h3 class="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <span class="text-xl">👨‍🍳</span> Quick Cooking Guide
            </h3>
            <div class="space-y-3">
              ${getBasicInstructions(recipe).map((instruction, index) => `
                <div class="flex gap-3">
                  <div class="flex-shrink-0 w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    ${index + 1}
                  </div>
                  <p class="text-gray-700 leading-relaxed pt-1">${instruction}</p>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Chef's Tips -->
          <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 class="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
              <span class="text-lg">💡</span> Chef's Tips
            </h4>
            <div class="text-sm text-yellow-700 space-y-1">
              ${getChefsTips(recipe).map(tip => `<p>• ${tip}</p>`).join('')}
            </div>
          </div>

          <!-- Recipe Info -->
          <div class="flex flex-wrap gap-2">
            <span class="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
              ${recipe.cuisine}
            </span>
            <span class="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
              ${recipe.mealType}
            </span>
            <span class="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
              ${recipe.servings} servings
            </span>
          </div>

        </div>
      </div>

      <!-- Action Buttons -->
      <div class="mt-8 border-t border-gray-200 pt-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
          
          <!-- Save Recipe -->
          <button onclick="saveRecipeToFavorites('${recipe.id}')" 
                  class="bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors">
            <span class="text-lg">💾</span>
            Save Recipe
          </button>

          <!-- Order Missing Ingredients -->
          ${pantryAnalysis.missingIngredients > 0 ? `
            <button onclick="orderMissingIngredients('${recipe.id}')" 
                    class="bg-orange-500 hover:bg-orange-600 text-white px-4 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors">
              <span class="text-lg">🛒</span>
              Order Missing (${pantryAnalysis.missingIngredients})
            </button>
          ` : `
            <div class="bg-green-100 text-green-700 px-4 py-3 rounded-lg font-semibold flex items-center justify-center gap-2">
              <span class="text-lg">✅</span>
              All Ingredients Available
            </div>
          `}

          <!-- Modify Meal Plan -->
          <button onclick="modifyMealPlan('${day}', '${mealType}', '${recipe.id}')" 
                  class="bg-purple-500 hover:bg-purple-600 text-white px-4 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors">
            <span class="text-lg">✏️</span>
            Change This Meal
          </button>
          
        </div>

        <!-- Missing Ingredients List -->
        ${pantryAnalysis.missing.length > 0 ? `
          <div class="mt-4 bg-orange-50 border border-orange-200 rounded-lg p-3">
            <h4 class="font-semibold text-orange-800 mb-2">Missing Ingredients:</h4>
            <div class="grid grid-cols-2 gap-2 text-sm">
              ${pantryAnalysis.missing.map(item => `
                <span class="text-orange-700">• ${item.ingredient.name} (${item.ingredient.amount} ${item.ingredient.unit})</span>
              `).join('')}
            </div>
          </div>
        ` : ''}

      </div>
    </div>
  `;

  // Show the modal
  document.getElementById('recipe-modal').classList.remove('hidden');
  document.body.style.overflow = 'hidden'; // Prevent background scrolling
};

// Close recipe modal
window.closeRecipeModal = function() {
  document.getElementById('recipe-modal').classList.add('hidden');
  document.body.style.overflow = 'auto'; // Restore scrolling
};

// Generate basic cooking instructions based on recipe
function getBasicInstructions(recipe) {
  const instructions = [];
  
  // Category-based instructions
  if (recipe.mealType === 'breakfast') {
    instructions.push('Gather all ingredients and prep workspace');
    instructions.push('Heat pan/griddle to medium heat if needed');
    instructions.push('Combine ingredients according to recipe type');
    instructions.push('Cook for recommended time, stirring as needed');
    instructions.push('Season to taste and serve immediately');
  } else if (recipe.mealType === 'lunch') {
    instructions.push('Prep all vegetables and proteins first');
    instructions.push('Heat cooking oil in large pan or skillet');
    instructions.push('Cook proteins until almost done');
    instructions.push('Add vegetables and seasonings');
    instructions.push('Combine everything and serve hot');
  } else if (recipe.mealType === 'dinner') {
    instructions.push('Preheat oven to 400°F if baking');
    instructions.push('Season proteins and let come to room temperature');
    instructions.push('Cook proteins using preferred method');
    instructions.push('Prepare sides and vegetables');
    instructions.push('Let proteins rest, then plate and serve');
  }

  return instructions;
}

// Generate chef's tips based on recipe
function getChefsTips(recipe) {
  const tips = [];
  
  // Ingredient-specific tips
  if (recipe.ingredients.some(ing => ing.name.toLowerCase().includes('chicken'))) {
    tips.push('Use a meat thermometer - chicken should reach 165°F internal temperature');
  }
  
  if (recipe.ingredients.some(ing => ing.name.toLowerCase().includes('salmon'))) {
    tips.push('Cook salmon skin-side down first for crispy skin');
  }

  if (recipe.ingredients.some(ing => ing.name.toLowerCase().includes('quinoa'))) {
    tips.push('Rinse quinoa before cooking to remove bitter coating');
  }

  // Meal type tips
  if (recipe.mealType === 'breakfast') {
    tips.push('Prep ingredients the night before for quicker morning assembly');
  } else if (recipe.mealType === 'lunch') {
    tips.push('This recipe is perfect for meal prep - make extra portions');
  } else if (recipe.mealType === 'dinner') {
    tips.push('Let meat rest for 5 minutes after cooking for better texture');
  }

  // Default tips if none match
  if (tips.length === 0) {
    tips.push('Read through all steps before starting');
    tips.push('Prep all ingredients first (mise en place)');
    tips.push('Adjust seasoning to taste at the end');
  }

  return tips.slice(0, 3); // Limit to 3 tips
}

// Recipe action functions
window.saveRecipeToFavorites = function(recipeId) {
  const favorites = JSON.parse(localStorage.getItem('fueliq_favorite_recipes') || '[]');
  if (!favorites.includes(recipeId)) {
    favorites.push(recipeId);
    localStorage.setItem('fueliq_favorite_recipes', JSON.stringify(favorites));
    alert('Recipe saved to your favorites! 💾');
  } else {
    alert('Recipe is already in your favorites! ⭐');
  }
};

window.orderMissingIngredients = function(recipeId) {
  const recipe = RECIPE_DATABASE.find(r => r.id === recipeId);
  if (!recipe) return;
  
  const pantryData = loadPantryData();
  const pantryItems = pantryData.items || [];
  const pantryAnalysis = calculatePantryScore(recipe, pantryItems);
  
  localStorage.setItem('fueliq_recipe_shopping_list', JSON.stringify(pantryAnalysis.missing));
  
  alert(`${pantryAnalysis.missing.length} missing ingredients added to your shopping list! Redirecting to delivery options... 🛒`);
  
  // Redirect to delivery tab with shopping list
  if (window.setCurrentView) {
    window.setCurrentView('delivery');
  }
};

window.modifyMealPlan = function(day, mealType, currentRecipeId) {
  alert(`Meal modification feature coming soon!\n\nDay: ${day}\nMeal: ${mealType}\nCurrent Recipe: ${currentRecipeId}\n\nThis will allow you to browse alternative recipes and swap them in your meal plan! ✏️`);
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
