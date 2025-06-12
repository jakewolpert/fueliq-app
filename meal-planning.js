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

  // Enhanced Shopping List Generation with Clear Quantities
// Replace the generateShoppingList function in meal-planning.js

const generateShoppingList = (weekPlan) => {
  const pantryData = loadPantryData();
  const pantryItems = pantryData.items || [];
  const requiredIngredients = {};

  // Collect all ingredients from meal plan with recipe context
  Object.entries(weekPlan).forEach(([day, dayPlan]) => {
    ['breakfast', 'lunch', 'dinner'].forEach(mealType => {
      const meal = dayPlan[mealType];
      if (meal && meal.ingredients) {
        meal.ingredients.forEach(ingredient => {
          const key = ingredient.name.toLowerCase();
          if (requiredIngredients[key]) {
            // Aggregate quantities
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

  // Filter out items available in pantry with smart matching
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
    // Proteins
    'chicken breast': 'lbs',
    'ground beef': 'lbs', 
    'salmon fillet': 'lbs',
    'ground turkey': 'lbs',
    'eggs': 'pieces',
    'tofu': 'blocks',
    'greek yogurt': 'containers',

    // Vegetables  
    'broccoli': 'heads',
    'spinach': 'bags',
    'bell peppers': 'pieces',
    'tomatoes': 'pieces',
    'onions': 'pieces',
    'carrots': 'pieces',
    'mushrooms': 'cups',
    'sweet potatoes': 'pieces',
    'avocado': 'pieces',

    // Grains
    'brown rice': 'cups',
    'quinoa': 'cups', 
    'oats': 'cups',
    'bread': 'loaves',
    'pasta': 'boxes',

    // Dairy
    'milk': 'cups',
    'cheese': 'cups',
    'butter': 'sticks',

    // Pantry staples
    'olive oil': 'tbsp',
    'salt': 'tsp',
    'pepper': 'tsp',
    'herbs': 'tsp'
  };

  const ingredientKey = ingredientName.toLowerCase();
  
  // Direct match
  if (unitMap[ingredientKey]) {
    return unitMap[ingredientKey];
  }
  
  // Partial match
  for (const [key, unit] of Object.entries(unitMap)) {
    if (ingredientKey.includes(key) || key.includes(ingredientKey)) {
      return unit;
    }
  }
  
  // Category defaults
  const categoryDefaults = {
    'protein': 'lbs',
    'vegetables': 'pieces', 
    'grains': 'cups',
    'dairy': 'containers',
    'fats': 'tbsp',
    'seasonings': 'tsp'
  };
  
  return categoryDefaults[category] || 'pieces';
}

// Estimate cost for budgeting
function estimateIngredientCost(ingredientName) {
  const costMap = {
    'chicken breast': 3.50,
    'salmon fillet': 8.99,
    'ground beef': 5.99,
    'broccoli': 2.99,
    'spinach': 3.49,
    'bell peppers': 1.99,
    'brown rice': 2.49,
    'quinoa': 4.99,
    'eggs': 3.99,
    'milk': 3.49
  };
  
  const key = ingredientName.toLowerCase();
  return costMap[key] || 2.99; // Default estimate
}

// Smart pantry matching
function findPantryMatch(ingredient, pantryItems) {
  return pantryItems.find(pantryItem => {
    const ingredientName = ingredient.name.toLowerCase();
    const pantryName = pantryItem.name.toLowerCase();
    
    // Exact match
    if (pantryName === ingredientName) return true;
    
    // Contains match
    if (pantryName.includes(ingredientName) || ingredientName.includes(pantryName)) return true;
    
    // Common variations
    const variations = {
      'chicken': 'chicken breast',
      'ground beef': 'beef',
      'spinach': 'baby spinach',
      'bell peppers': 'peppers',
      'sweet potatoes': 'sweet potato'
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

  // Calculate total estimated cost
  const totalCost = shoppingList.reduce((sum, item) => sum + (item.estimatedCost * item.neededAmount), 0);

  // Group by category
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

      <!-- Pantry Optimization Tips -->
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
  // Handle decimal formatting
  const num = parseFloat(amount);
  const formatted = num % 1 === 0 ? num.toString() : num.toFixed(1);
  
  // Handle singular/plural
  const singularUnits = {
    'pieces': 'piece',
    'heads': 'head', 
    'bags': 'bag',
    'blocks': 'block',
    'containers': 'container',
    'loaves': 'loaf',
    'boxes': 'box',
    'sticks': 'stick'
  };
  
  const displayUnit = (num === 1 && singularUnits[unit]) ? singularUnits[unit] : unit;
  
  return `${formatted} ${displayUnit}`;
}

function getCategoryIcon(category) {
  const icons = {
    'protein': '🥩',
    'vegetables': '🥬', 
    'grains': '🌾',
    'dairy': '🥛',
    'fats': '🫒',
    'seasonings': '🧂'
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
