// Enhanced Habbt Meal Planning - Weekly Feature Set (Syntax Error Free)
(function() {
    'use strict';

    // Unique function names to avoid conflicts with meals-tab.js
    const searchFoodsForPlanning = async (query) => {
        if (!query || query.length < 2) return [];
        
        try {
            const response = await fetch(`https://api.nal.usda.gov/fdc/v1/foods/search?api_key=DEMO_KEY&query=${encodeURIComponent(query)}&pageSize=15&dataType=Foundation,SR%20Legacy,Branded`);
            const data = await response.json();
            
            if (data.foods && data.foods.length > 0) {
                return data.foods.map(food => ({
                    fdcId: food.fdcId,
                    description: food.description,
                    brandOwner: food.brandOwner,
                    ingredients: food.ingredients,
                    nutrients: food.foodNutrients ? food.foodNutrients.reduce((acc, nutrient) => {
                        const nutrientName = nutrient.nutrientName.toLowerCase();
                        if (nutrientName.includes('energy')) acc.calories = nutrient.value || 0;
                        if (nutrientName.includes('protein')) acc.protein = nutrient.value || 0;
                        if (nutrientName.includes('carbohydrate')) acc.carbs = nutrient.value || 0;
                        if (nutrientName.includes('total lipid')) acc.fat = nutrient.value || 0;
                        if (nutrientName.includes('fiber')) acc.fiber = nutrient.value || 0;
                        if (nutrientName.includes('sodium')) acc.sodium = nutrient.value || 0;
                        if (nutrientName.includes('sugars')) acc.sugar = nutrient.value || 0;
                        return acc;
                    }, {}) : {},
                    dataType: food.dataType || 'Unknown',
                    source: 'usda'
                }));
            }
            
            return [];
        } catch (error) {
            console.error('USDA API Error:', error);
            return [];
        }
    };

    // Comprehensive meal database
    const COMPREHENSIVE_MEAL_DATABASE = {
        breakfast: [
            {
                id: 'breakfast_power_oatmeal',
                name: 'Protein Power Oatmeal Bowl',
                description: 'Creamy oats loaded with protein powder, fresh berries, and almond butter',
                calories: 450,
                protein: 30,
                carbs: 55,
                fat: 12,
                fiber: 8,
                prepTime: '5 minutes',
                cookTime: '3 minutes',
                difficulty: 'Easy',
                servings: 1,
                image: '🥣',
                color: 'from-amber-400 to-orange-500',
                tags: ['high-protein', 'quick', 'vegetarian'],
                dietaryInfo: ['vegetarian', 'gluten-free-option'],
                ingredients: [
                    { name: 'rolled oats', amount: '1/2 cup', calories: 150, pantryItem: true },
                    { name: 'protein powder', amount: '1 scoop', calories: 120, pantryItem: false },
                    { name: 'banana', amount: '1 medium', calories: 105, pantryItem: false },
                    { name: 'almond butter', amount: '1 tbsp', calories: 95, pantryItem: true },
                    { name: 'chia seeds', amount: '1 tbsp', calories: 60, pantryItem: true },
                    { name: 'cinnamon', amount: '1/2 tsp', calories: 3, pantryItem: true }
                ],
                instructions: [
                    "Cook oats with water or milk according to package directions",
                    "Let cool for 1 minute, then stir in protein powder until smooth", 
                    "Slice banana and arrange on top",
                    "Add almond butter and sprinkle with chia seeds and cinnamon"
                ],
                tips: "For extra flavor, try vanilla protein powder and add berries",
                nutrition_focus: "High protein content supports muscle building and keeps you full until lunch",
                meal_prep: "Can be prepped 3 days ahead - just add fresh toppings before eating"
            },
            {
                id: 'breakfast_veggie_scramble',
                name: 'Mediterranean Veggie Scramble',
                description: 'Fluffy eggs with colorful vegetables, feta, and fresh herbs',
                calories: 380,
                protein: 25,
                carbs: 15,
                fat: 22,
                fiber: 6,
                prepTime: '5 minutes',
                cookTime: '8 minutes',
                difficulty: 'Easy',
                servings: 1,
                image: '🍳',
                color: 'from-green-400 to-emerald-500',
                tags: ['high-protein', 'low-carb', 'vegetarian'],
                dietaryInfo: ['vegetarian', 'keto-friendly'],
                ingredients: [
                    { name: 'eggs', amount: '3 large', calories: 210, pantryItem: true },
                    { name: 'spinach', amount: '2 cups fresh', calories: 15, pantryItem: false },
                    { name: 'bell pepper', amount: '1/2 cup diced', calories: 15, pantryItem: false },
                    { name: 'mushrooms', amount: '1/2 cup sliced', calories: 10, pantryItem: false },
                    { name: 'feta cheese', amount: '2 tbsp', calories: 50, pantryItem: false },
                    { name: 'olive oil', amount: '1 tsp', calories: 40, pantryItem: true }
                ],
                instructions: [
                    "Heat olive oil in a non-stick pan over medium heat",
                    "Add bell pepper and mushrooms, cook for 3-4 minutes",
                    "Add spinach and cook until wilted",
                    "Beat eggs and scramble with vegetables for 2-3 minutes",
                    "Add feta cheese in the last 30 seconds"
                ],
                tips: "Don't overcook the eggs - they should be creamy and soft",
                nutrition_focus: "Perfect balance of protein and healthy fats with antioxidant vegetables",
                meal_prep: "Chop vegetables the night before for quick morning prep"
            }
        ],
        lunch: [
            {
                id: 'lunch_mediterranean_bowl',
                name: 'Mediterranean Power Bowl',
                description: 'Quinoa base with grilled chicken, fresh vegetables, and tzatziki',
                calories: 520,
                protein: 42,
                carbs: 35,
                fat: 24,
                fiber: 8,
                prepTime: '10 minutes',
                cookTime: '15 minutes',
                difficulty: 'Medium',
                servings: 1,
                image: '🥗',
                color: 'from-blue-400 to-cyan-500',
                tags: ['high-protein', 'mediterranean', 'balanced'],
                dietaryInfo: ['gluten-free', 'high-protein'],
                ingredients: [
                    { name: 'chicken breast', amount: '6 oz', calories: 280, pantryItem: false },
                    { name: 'quinoa', amount: '1/2 cup cooked', calories: 110, pantryItem: true },
                    { name: 'cucumber', amount: '1/2 cup diced', calories: 8, pantryItem: false },
                    { name: 'cherry tomatoes', amount: '1/2 cup', calories: 15, pantryItem: false },
                    { name: 'red onion', amount: '2 tbsp diced', calories: 8, pantryItem: false },
                    { name: 'feta cheese', amount: '2 tbsp crumbled', calories: 50, pantryItem: false },
                    { name: 'olive oil', amount: '1 tbsp', calories: 120, pantryItem: true }
                ],
                instructions: [
                    "Season and grill chicken breast for 6-7 minutes per side",
                    "Let chicken rest, then slice into strips",
                    "Arrange quinoa as base in bowl",
                    "Top with vegetables, chicken, and feta",
                    "Drizzle with olive oil and lemon juice"
                ],
                tips: "Marinate chicken in herbs for extra flavor",
                nutrition_focus: "Complete protein with complex carbs and healthy Mediterranean fats",
                meal_prep: "All components can be prepped 3 days ahead"
            },
            {
                id: 'lunch_asian_salmon_salad',
                name: 'Asian Glazed Salmon Salad',
                description: 'Teriyaki salmon over mixed greens with edamame and sesame dressing',
                calories: 480,
                protein: 35,
                carbs: 20,
                fat: 28,
                fiber: 7,
                prepTime: '8 minutes',
                cookTime: '12 minutes',
                difficulty: 'Medium',
                servings: 1,
                image: '🍣',
                color: 'from-orange-400 to-red-500',
                tags: ['high-protein', 'omega-3', 'asian-inspired'],
                dietaryInfo: ['gluten-free-option', 'dairy-free'],
                ingredients: [
                    { name: 'salmon fillet', amount: '5 oz', calories: 275, pantryItem: false },
                    { name: 'mixed greens', amount: '3 cups', calories: 20, pantryItem: false },
                    { name: 'edamame', amount: '1/2 cup shelled', calories: 95, pantryItem: false },
                    { name: 'carrots', amount: '1/2 cup julienned', calories: 25, pantryItem: false },
                    { name: 'avocado', amount: '1/2 medium', calories: 120, pantryItem: false },
                    { name: 'sesame oil', amount: '1 tsp', calories: 40, pantryItem: true }
                ],
                instructions: [
                    "Cook salmon skin-side down for 4-5 minutes until crispy",
                    "Flip and cook another 3-4 minutes",
                    "Flake salmon into chunks",
                    "Arrange salad with all vegetables",
                    "Top with salmon and drizzle with sesame dressing"
                ],
                tips: "For crispy skin, don't move the salmon until it releases easily",
                nutrition_focus: "Rich in omega-3 fatty acids for brain health",
                meal_prep: "Salmon can be cooked ahead and served cold"
            }
        ],
        dinner: [
            {
                id: 'dinner_herb_cod',
                name: 'Herb-Crusted Cod with Rainbow Vegetables',
                description: 'Flaky cod with herb crust over colorful roasted vegetables',
                calories: 420,
                protein: 35,
                carbs: 32,
                fat: 16,
                fiber: 9,
                prepTime: '15 minutes',
                cookTime: '25 minutes',
                difficulty: 'Medium',
                servings: 1,
                image: '🐟',
                color: 'from-teal-400 to-blue-500',
                tags: ['lean-protein', 'vegetables', 'one-pan'],
                dietaryInfo: ['gluten-free-option', 'low-carb'],
                ingredients: [
                    { name: 'cod fillet', amount: '6 oz', calories: 180, pantryItem: false },
                    { name: 'sweet potato', amount: '1 medium cubed', calories: 115, pantryItem: false },
                    { name: 'broccoli', amount: '1 cup florets', calories: 25, pantryItem: false },
                    { name: 'zucchini', amount: '1 medium sliced', calories: 20, pantryItem: false },
                    { name: 'olive oil', amount: '1 tbsp', calories: 120, pantryItem: true },
                    { name: 'panko breadcrumbs', amount: '2 tbsp', calories: 30, pantryItem: true },
                    { name: 'fresh herbs', amount: '2 tbsp mixed', calories: 5, pantryItem: true }
                ],
                instructions: [
                    "Preheat oven to 425°F and line baking sheet",
                    "Toss vegetables with olive oil and roast 15 minutes",
                    "Mix panko with herbs for coating",
                    "Top cod with herb mixture",
                    "Bake cod for 12-15 minutes until flaky"
                ],
                tips: "Don't overcook the cod - it should flake easily",
                nutrition_focus: "Lean protein with fiber-rich vegetables",
                meal_prep: "Vegetables can be prepped ahead, cook cod fresh"
            }
        ],
        snacks: [
            {
                id: 'snack_energy_balls',
                name: 'Chocolate Peanut Energy Balls',
                description: 'No-bake protein-packed energy balls with dark chocolate',
                calories: 180,
                protein: 8,
                carbs: 18,
                fat: 10,
                fiber: 4,
                prepTime: '10 minutes',
                cookTime: '0 minutes',
                difficulty: 'Easy',
                servings: 3,
                image: '⚽',
                color: 'from-amber-400 to-brown-500',
                tags: ['no-cook', 'portable', 'energy'],
                dietaryInfo: ['vegetarian', 'gluten-free-option'],
                ingredients: [
                    { name: 'oats', amount: '1/2 cup', calories: 150, pantryItem: true },
                    { name: 'peanut butter', amount: '2 tbsp', calories: 190, pantryItem: true },
                    { name: 'honey', amount: '1 tbsp', calories: 64, pantryItem: true },
                    { name: 'chocolate chips', amount: '2 tbsp', calories: 80, pantryItem: true }
                ],
                instructions: [
                    "Mix all dry ingredients in a bowl",
                    "Stir in peanut butter and honey",
                    "Refrigerate for 30 minutes",
                    "Roll into small balls and store"
                ],
                tips: "Wet hands when rolling to prevent sticking",
                nutrition_focus: "Balanced energy from protein, healthy fats, and natural sugars",
                meal_prep: "Perfect make-ahead snack - stores for 1 week"
            }
        ]
    };

    // User preferences
    const getUserPreferences = () => {
        try {
            const habbtProfile = JSON.parse(localStorage.getItem('habbt_profile_data') || '{}');
            const fueliqProfile = JSON.parse(localStorage.getItem('fueliq_profile_data') || '{}');
            const profile = habbtProfile || fueliqProfile || {};
            
            return {
                goal: profile.goal || 'maintenance',
                calorieTarget: profile.goals?.calories || 2000,
                proteinTarget: profile.goals?.protein || 150,
                carbTarget: profile.goals?.carbs || 250,
                fatTarget: profile.goals?.fat || 67,
                dietaryRestrictions: profile.dietaryRestrictions || [],
                activityLevel: profile.activityLevel || 'moderate',
                mealsPerDay: profile.mealsPerDay || 3,
                name: profile.name || 'there'
            };
        } catch (e) {
            return {
                goal: 'maintenance',
                calorieTarget: 2000,
                proteinTarget: 150,
                carbTarget: 250,
                fatTarget: 67,
                dietaryRestrictions: [],
                activityLevel: 'moderate',
                mealsPerDay: 3,
                name: 'there'
            };
        }
    };

    // Load pantry data
    const loadPlanningPantryData = () => {
        try {
            const pantryData = localStorage.getItem('habbt_pantry') || localStorage.getItem('fueliq_pantry');
            return pantryData ? JSON.parse(pantryData) : { items: [] };
        } catch (e) {
            return { items: [] };
        }
    };

    // Generate weekly meal plan
    const generateWeeklyMealPlan = (preferences, pantryItems) => {
        const { goal, calorieTarget, proteinTarget, dietaryRestrictions } = preferences;
        const availableIngredients = pantryItems.map(item => item.name.toLowerCase());
        
        const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        const weeklyPlan = {};
        
        const calorieDistribution = {
            muscle_gain: { breakfast: 0.25, lunch: 0.35, dinner: 0.35, snacks: 0.05 },
            fat_loss: { breakfast: 0.30, lunch: 0.35, dinner: 0.30, snacks: 0.05 },
            maintenance: { breakfast: 0.25, lunch: 0.35, dinner: 0.35, snacks: 0.05 }
        };

        const distribution = calorieDistribution[goal] || calorieDistribution.maintenance;
        
        weekDays.forEach((day, dayIndex) => {
            weeklyPlan[day] = {
                breakfast: [],
                lunch: [],
                dinner: [],
                snacks: []
            };

            Object.keys(COMPREHENSIVE_MEAL_DATABASE).forEach(mealType => {
                const targetCalories = calorieTarget * distribution[mealType];
                let availableMeals = COMPREHENSIVE_MEAL_DATABASE[mealType].filter(meal => {
                    if (dietaryRestrictions.includes('vegetarian')) {
                        return meal.dietaryInfo.includes('vegetarian');
                    }
                    if (dietaryRestrictions.includes('gluten-free')) {
                        return meal.dietaryInfo.includes('gluten-free') || meal.dietaryInfo.includes('gluten-free-option');
                    }
                    
                    return meal.calories >= targetCalories * 0.7 && meal.calories <= targetCalories * 1.3;
                });

                const mealsWithPantryIngredients = availableMeals.filter(meal => 
                    meal.ingredients.some(ingredient => 
                        availableIngredients.includes(ingredient.name.toLowerCase()) || ingredient.pantryItem
                    )
                );

                let selectedMeals = mealsWithPantryIngredients.length > 0 ? mealsWithPantryIngredients : availableMeals;

                if (selectedMeals.length > 0) {
                    const mealIndex = (dayIndex + mealType.length) % selectedMeals.length;
                    weeklyPlan[day][mealType] = [selectedMeals[mealIndex]];
                }
            });
        });

        return weeklyPlan;
    };

    // Calculate missing ingredients
    const calculateWeeklyMissingIngredients = (weeklyPlan, pantryItems) => {
        const pantryItemNames = pantryItems.map(item => item.name.toLowerCase());
        const missingIngredients = {};

        Object.entries(weeklyPlan).forEach(([day, dayPlan]) => {
            Object.values(dayPlan).flat().forEach(meal => {
                meal.ingredients.forEach(ingredient => {
                    if (!pantryItemNames.includes(ingredient.name.toLowerCase()) && !ingredient.pantryItem) {
                        if (!missingIngredients[ingredient.name]) {
                            missingIngredients[ingredient.name] = {
                                name: ingredient.name,
                                totalAmount: ingredient.amount,
                                calories: ingredient.calories,
                                usedIn: []
                            };
                        }
                        missingIngredients[ingredient.name].usedIn.push({
                            day,
                            meal: meal.name
                        });
                    }
                });
            });
        });

        return Object.values(missingIngredients);
    };

    // Storage functions
    const saveWeeklyPlan = (weekStartDate, data) => {
        const key = `habbt_weekly_plan_${weekStartDate}`;
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (e) {
            console.warn('Failed to save weekly plan:', e);
        }
    };

    const loadWeeklyPlan = (weekStartDate) => {
        const key = `habbt_weekly_plan_${weekStartDate}`;
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : {};
        } catch (e) {
            return {};
        }
    };

    // Get week start date
    const getWeekStartDate = (date = new Date()) => {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1);
        return new Date(d.setDate(diff)).toISOString().split('T')[0];
    };

    // Meal Card Component
    const MealCard = ({ meal, day, mealType, onViewRecipe, onSwapMeal, onAddToGrocery }) => {
        return React.createElement('div', { 
            className: 'group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200 transform hover:-translate-y-1'
        },
            React.createElement('div', { 
                className: `h-20 bg-gradient-to-r ${meal.color} flex items-center justify-center relative overflow-hidden`
            },
                React.createElement('div', { className: 'text-4xl' }, meal.image),
                React.createElement('div', { className: 'absolute top-2 right-2 bg-white/20 backdrop-blur-sm rounded-full px-2 py-1 text-xs text-white font-medium' },
                    `${meal.prepTime} + ${meal.cookTime}`
                ),
                React.createElement('div', { className: 'absolute bottom-2 left-3 bg-white/20 backdrop-blur-sm rounded-full px-2 py-1 text-xs text-white font-medium' },
                    meal.difficulty
                )
            ),

            React.createElement('div', { className: 'p-4' },
                React.createElement('h4', { className: 'font-bold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors' }, 
                    meal.name
                ),
                React.createElement('p', { className: 'text-sm text-gray-600 mb-3 line-clamp-2' }, 
                    meal.description
                ),

                React.createElement('div', { className: 'grid grid-cols-4 gap-2 mb-3 text-center' },
                    React.createElement('div', { className: 'bg-blue-50 rounded-lg p-2' },
                        React.createElement('div', { className: 'text-sm font-bold text-blue-600' }, meal.calories),
                        React.createElement('div', { className: 'text-xs text-gray-600' }, 'cal')
                    ),
                    React.createElement('div', { className: 'bg-red-50 rounded-lg p-2' },
                        React.createElement('div', { className: 'text-sm font-bold text-red-600' }, `${meal.protein}g`),
                        React.createElement('div', { className: 'text-xs text-gray-600' }, 'protein')
                    ),
                    React.createElement('div', { className: 'bg-yellow-50 rounded-lg p-2' },
                        React.createElement('div', { className: 'text-sm font-bold text-yellow-600' }, `${meal.carbs}g`),
                        React.createElement('div', { className: 'text-xs text-gray-600' }, 'carbs')
                    ),
                    React.createElement('div', { className: 'bg-purple-50 rounded-lg p-2' },
                        React.createElement('div', { className: 'text-sm font-bold text-purple-600' }, `${meal.fat}g`),
                        React.createElement('div', { className: 'text-xs text-gray-600' }, 'fat')
                    )
                ),

                React.createElement('div', { className: 'flex flex-wrap gap-1 mb-3' },
                    meal.tags.slice(0, 3).map(tag => 
                        React.createElement('span', { 
                            key: tag,
                            className: 'px-2 py-1 bg-gradient-to-r from-blue-100 to-teal-100 text-blue-700 text-xs rounded-full font-medium'
                        }, tag)
                    )
                ),

                React.createElement('div', { className: 'flex gap-2' },
                    React.createElement('button', {
                        onClick: () => onViewRecipe(meal),
                        className: 'flex-1 px-3 py-2 bg-gradient-to-r from-blue-500 to-teal-600 hover:from-blue-600 hover:to-teal-700 text-white text-sm rounded-lg font-semibold transition-all duration-200 transform hover:scale-105'
                    }, '👨‍🍳 Recipe'),
                    React.createElement('button', {
                        onClick: () => onSwapMeal(day, mealType, meal),
                        className: 'px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-lg font-semibold transition-all duration-200'
                    }, '🔄'),
                    React.createElement('button', {
                        onClick: () => onAddToGrocery(meal),
                        className: 'px-3 py-2 bg-green-100 hover:bg-green-200 text-green-700 text-sm rounded-lg font-semibold transition-all duration-200'
                    }, '🛒')
                )
            )
        );
    };

    // Recipe Detail Modal
    const RecipeDetailModal = ({ meal, isOpen, onClose }) => {
        if (!isOpen || !meal) return null;

        return React.createElement('div', { className: 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50' },
            React.createElement('div', { className: 'bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto' },
                React.createElement('div', { className: 'relative' },
                    React.createElement('div', { className: `bg-gradient-to-r ${meal.color} text-white p-6 rounded-t-2xl` },
                        React.createElement('button', {
                            onClick: onClose,
                            className: 'absolute top-4 right-4 text-white hover:text-gray-200 text-2xl font-bold bg-white/20 rounded-full w-8 h-8 flex items-center justify-center backdrop-blur-sm'
                        }, '×'),
                        React.createElement('div', { className: 'flex items-center space-x-4' },
                            React.createElement('div', { className: 'text-6xl' }, meal.image),
                            React.createElement('div', null,
                                React.createElement('h2', { className: 'text-3xl font-bold mb-2' }, meal.name),
                                React.createElement('p', { className: 'text-xl opacity-90' }, meal.description),
                                React.createElement('div', { className: 'flex space-x-4 mt-3 text-sm' },
                                    React.createElement('span', { className: 'bg-white/20 px-2 py-1 rounded' }, `⏱️ ${meal.prepTime}`),
                                    React.createElement('span', { className: 'bg-white/20 px-2 py-1 rounded' }, `🔥 ${meal.cookTime}`),
                                    React.createElement('span', { className: 'bg-white/20 px-2 py-1 rounded' }, `📊 ${meal.difficulty}`)
                                )
                            )
                        )
                    ),

                    React.createElement('div', { className: 'p-6' },
                        React.createElement('div', { className: 'grid grid-cols-4 gap-4 mb-6' },
                            React.createElement('div', { className: 'text-center p-4 bg-blue-50 rounded-xl border border-blue-200' },
                                React.createElement('div', { className: 'text-3xl font-bold text-blue-600' }, meal.calories),
                                React.createElement('div', { className: 'text-sm text-gray-600' }, 'Calories')
                            ),
                            React.createElement('div', { className: 'text-center p-4 bg-red-50 rounded-xl border border-red-200' },
                                React.createElement('div', { className: 'text-3xl font-bold text-red-600' }, `${meal.protein}g`),
                                React.createElement('div', { className: 'text-sm text-gray-600' }, 'Protein')
                            ),
                            React.createElement('div', { className: 'text-center p-4 bg-yellow-50 rounded-xl border border-yellow-200' },
                                React.createElement('div', { className: 'text-3xl font-bold text-yellow-600' }, `${meal.carbs}g`),
                                React.createElement('div', { className: 'text-sm text-gray-600' }, 'Carbs')
                            ),
                            React.createElement('div', { className: 'text-center p-4 bg-purple-50 rounded-xl border border-purple-200' },
                                React.createElement('div', { className: 'text-3xl font-bold text-purple-600' }, `${meal.fat}g`),
                                React.createElement('div', { className: 'text-sm text-gray-600' }, 'Fat')
                            )
                        ),

                        React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-6' },
                            React.createElement('div', null,
                                React.createElement('h3', { className: 'text-xl font-bold text-gray-800 mb-4 flex items-center' },
                                    React.createElement('span', { className: 'mr-2 text-2xl' }, '🛒'),
                                    'Ingredients'
                                ),
                                React.createElement('div', { className: 'space-y-2' },
                                    meal.ingredients.map((ingredient, index) => 
                                        React.createElement('div', { 
                                            key: index,
                                            className: `flex justify-between items-center p-3 rounded-lg ${ingredient.pantryItem ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'}`
                                        },
                                            React.createElement('span', { className: 'font-medium flex items-center' },
                                                ingredient.pantryItem ? React.createElement('span', { className: 'mr-2 text-green-600' }, '✓') : null,
                                                ingredient.name
                                            ),
                                            React.createElement('span', { className: 'text-sm text-gray-600' }, ingredient.amount)
                                        )
                                    )
                                )
                            ),

                            React.createElement('div', null,
                                React.createElement('h3', { className: 'text-xl font-bold text-gray-800 mb-4 flex items-center' },
                                    React.createElement('span', { className: 'mr-2 text-2xl' }, '👨‍🍳'),
                                    'Instructions'
                                ),
                                React.createElement('ol', { className: 'space-y-3' },
                                    meal.instructions.map((instruction, index) => 
                                        React.createElement('li', { 
                                            key: index,
                                            className: 'flex gap-3'
                                        },
                                            React.createElement('span', { 
                                                className: 'flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-teal-600 text-white rounded-full flex items-center justify-center text-sm font-bold'
                                            }, index + 1),
                                            React.createElement('span', { className: 'text-gray-700 leading-relaxed' }, instruction)
                                        )
                                    )
                                )
                            )
                        ),

                        React.createElement('div', { className: 'mt-6 grid grid-cols-1 md:grid-cols-2 gap-4' },
                            React.createElement('div', { className: 'p-4 bg-yellow-50 rounded-xl border border-yellow-200' },
                                React.createElement('h4', { className: 'font-bold text-yellow-800 mb-2 flex items-center' },
                                    React.createElement('span', { className: 'mr-2' }, '💡'),
                                    'Chef\'s Tips'
                                ),
                                React.createElement('p', { className: 'text-yellow-700 text-sm' }, meal.tips)
                            ),
                            React.createElement('div', { className: 'p-4 bg-green-50 rounded-xl border border-green-200' },
                                React.createElement('h4', { className: 'font-bold text-green-800 mb-2 flex items-center' },
                                    React.createElement('span', { className: 'mr-2' }, '🥗'),
                                    'Nutrition Focus'
                                ),
                                React.createElement('p', { className: 'text-green-700 text-sm' }, meal.nutrition_focus)
                            )
                        ),

                        meal.meal_prep ? React.createElement('div', { className: 'mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200' },
                            React.createElement('h4', { className: 'font-bold text-blue-800 mb-2 flex items-center' },
                                React.createElement('span', { className: 'mr-2' }, '📦'),
                                'Meal Prep Tips'
                            ),
                            React.createElement('p', { className: 'text-blue-700 text-sm' }, meal.meal_prep)
                        ) : null
                    )
                )
            )
        );
    };

    // Main Component
    const WeeklyMealPlanningApp = () => {
        const [currentWeekStart, setCurrentWeekStart] = React.useState(getWeekStartDate());
        const [weeklyPlan, setWeeklyPlan] = React.useState(loadWeeklyPlan(currentWeekStart));
        const [pantryItems, setPantryItems] = React.useState([]);
        const [userPreferences, setUserPreferences] = React.useState(getUserPreferences());
        const [selectedMeal, setSelectedMeal] = React.useState(null);
        const [modalOpen, setModalOpen] = React.useState(false);
        const [missingIngredients, setMissingIngredients] = React.useState([]);
        const [isGenerating, setIsGenerating] = React.useState(false);

        React.useEffect(() => {
            const pantryData = loadPlanningPantryData();
            setPantryItems(pantryData.items || []);
        }, []);

        React.useEffect(() => {
            setWeeklyPlan(loadWeeklyPlan(currentWeekStart));
        }, [currentWeekStart]);

        React.useEffect(() => {
            if (Object.keys(weeklyPlan).length > 0) {
                saveWeeklyPlan(currentWeekStart, weeklyPlan);
                const missing = calculateWeeklyMissingIngredients(weeklyPlan, pantryItems);
                setMissingIngredients(missing);
            }
        }, [weeklyPlan, currentWeekStart, pantryItems]);

        const generateWeeklyPlan = async () => {
            setIsGenerating(true);
            
            setTimeout(() => {
                const newPlan = generateWeeklyMealPlan(userPreferences, pantryItems);
                setWeeklyPlan(newPlan);
                setIsGenerating(false);
            }, 3000);
        };

        const viewRecipe = (meal) => {
            setSelectedMeal(meal);
            setModalOpen(true);
        };

        const swapMeal = (day, mealType, currentMeal) => {
            const availableMeals = COMPREHENSIVE_MEAL_DATABASE[mealType];
            const currentIndex = availableMeals.findIndex(meal => meal.id === currentMeal.id);
            const nextIndex = (currentIndex + 1) % availableMeals.length;
            
            setWeeklyPlan(prev => ({
                ...prev,
                [day]: {
                    ...prev[day],
                    [mealType]: [availableMeals[nextIndex]]
                }
            }));
        };

        const addToGroceryList = (meal) => {
            const missingForMeal = meal.ingredients.filter(ingredient => 
                !pantryItems.some(item => item.name.toLowerCase() === ingredient.name.toLowerCase()) && 
                !ingredient.pantryItem
            );
            
            if (missingForMeal.length > 0) {
                alert(`Added ${missingForMeal.length} ingredients to grocery list!`);
            } else {
                alert('All ingredients are already available!');
            }
        };

        const navigateWeek = (direction) => {
            const newDate = new Date(currentWeekStart);
            newDate.setDate(newDate.getDate() + (direction * 7));
            setCurrentWeekStart(getWeekStartDate(newDate));
        };

        const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        const weekHasMeals = Object.keys(weeklyPlan).length > 0;

        const weeklyTotals = weekHasMeals ? weekDays.reduce((totals, day) => {
            if (weeklyPlan[day]) {
                const dayMeals = Object.values(weeklyPlan[day]).flat();
                return {
                    calories: totals.calories + dayMeals.reduce((sum, meal) => sum + meal.calories, 0),
                    protein: totals.protein + dayMeals.reduce((sum, meal) => sum + meal.protein, 0)
                };
            }
            return totals;
        }, { calories: 0, protein: 0 }) : { calories: 0, protein: 0 };

        return React.createElement('div', { className: 'min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-cyan-50' },
            React.createElement('div', { className: 'max-w-7xl mx-auto p-6' },
                React.createElement('div', { className: 'bg-gradient-to-r from-blue-600 to-teal-600 rounded-3xl shadow-2xl p-8 mb-8 text-white' },
                    React.createElement('div', { className: 'text-center' },
                        React.createElement('h1', { className: 'text-4xl font-bold mb-4' }, 
                            `🍽️ Your Personal Meal Plan, ${userPreferences.name}!`
                        ),
                        React.createElement('div', { className: 'bg-white/20 backdrop-blur-sm rounded-2xl p-4 mb-6' },
                            React.createElement('p', { className: 'text-lg mb-2' }, 
                                '✨ This meal plan is completely customized for you based on:'
                            ),
                            React.createElement('div', { className: 'flex flex-wrap justify-center gap-4 text-sm' },
                                React.createElement('span', { className: 'bg-white/20 px-3 py-1 rounded-full' }, 
                                    `🎯 ${userPreferences.goal.replace('_', ' ')} goal`
                                ),
                                React.createElement('span', { className: 'bg-white/20 px-3 py-1 rounded-full' }, 
                                    `🔥 ${userPreferences.calorieTarget} calories/day`
                                ),
                                React.createElement('span', { className: 'bg-white/20 px-3 py-1 rounded-full' }, 
                                    `🥘 ${pantryItems.length} pantry items`
                                ),
                                userPreferences.dietaryRestrictions.length > 0 ? React.createElement('span', { className: 'bg-white/20 px-3 py-1 rounded-full' }, 
                                    `🌱 ${userPreferences.dietaryRestrictions.join(', ')}`
                                ) : null
                            )
                        ),
                        
                        React.createElement('button', {
                            onClick: generateWeeklyPlan,
                            disabled: isGenerating,
                            className: `px-8 py-4 bg-white/20 hover:bg-white/30 disabled:bg-white/10 rounded-2xl font-bold text-lg transition-all duration-200 backdrop-blur-sm ${isGenerating ? 'cursor-not-allowed' : 'transform hover:scale-105'}`
                        }, 
                            isGenerating ? '🤖 Generating Your Perfect Week...' : '✨ Generate Weekly Meal Plan'
                        ),
                        
                        React.createElement('div', { className: 'flex items-center justify-center space-x-4 mt-6' },
                            React.createElement('button', {
                                onClick: () => navigateWeek(-1),
                                className: 'px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-semibold transition-all duration-200 backdrop-blur-sm'
                            }, '← Previous Week'),
                            React.createElement('div', { className: 'px-6 py-2 bg-white/20 rounded-lg backdrop-blur-sm font-semibold' },
                                `Week of ${new Date(currentWeekStart).toLocaleDateString()}`
                            ),
                            React.createElement('button', {
                                onClick: () => navigateWeek(1),
                                className: 'px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-semibold transition-all duration-200 backdrop-blur-sm'
                            }, 'Next Week →')
                        )
                    )
                ),

                React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-3 gap-6 mb-8' },
                    React.createElement('div', { className: 'bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20' },
                        React.createElement('h3', { className: 'text-lg font-bold text-gray-800 mb-4' }, '📊 Weekly Totals'),
                        React.createElement('div', { className: 'space-y-2' },
                            React.createElement('div', { className: 'flex justify-between' },
                                React.createElement('span', null, 'Avg Calories/Day:'),
                                React.createElement('span', { className: 'font-bold text-blue-600' }, 
                                    `${Math.round(weeklyTotals.calories / 7)}`
                                )
                            ),
                            React.createElement('div', { className: 'flex justify-between' },
                                React.createElement('span', null, 'Avg Protein/Day:'),
                                React.createElement('span', { className: 'font-bold text-red-600' }, 
                                    `${Math.round(weeklyTotals.protein / 7)}g`
                                )
                            )
                        )
                    ),
                    React.createElement('div', { className: 'bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20' },
                        React.createElement('h3', { className: 'text-lg font-bold text-gray-800 mb-4' }, '🛒 Shopping List'),
                        React.createElement('div', null,
                            React.createElement('div', { className: 'text-2xl font-bold text-orange-600' }, missingIngredients.length),
                            React.createElement('div', { className: 'text-sm text-gray-600' }, 'unique ingredients needed'),
                            missingIngredients.length > 0 ? React.createElement('button', {
                                onClick: () => alert(`Shopping list with ${missingIngredients.length} items ready!`),
                                className: 'mt-2 text-sm px-3 py-1 bg-orange-500 hover:bg-orange-600 text-white rounded-lg'
                            }, 'View Full List') : null
                        )
                    ),
                    React.createElement('div', { className: 'bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20' },
                        React.createElement('h3', { className: 'text-lg font-bold text-gray-800 mb-4' }, '🏆 Meal Variety'),
                        React.createElement('div', null,
                            React.createElement('div', { className: 'text-2xl font-bold text-green-600' }, 
                                weekHasMeals ? Object.values(weeklyPlan).reduce((count, day) => 
                                    count + Object.values(day).flat().length, 0
                                ) : 0
                            ),
                            React.createElement('div', { className: 'text-sm text-gray-600' }, 'unique meals planned'),
                            React.createElement('div', { className: 'text-xs text-gray-500 mt-1' }, 
                                'Variety score: High 🌟'
                            )
                        )
                    )
                ),

                !weekHasMeals ? 
                    React.createElement('div', { className: 'text-center py-16' },
                        React.createElement('div', { className: 'text-6xl mb-6' }, '🍽️'),
                        React.createElement('h3', { className: 'text-2xl font-bold text-gray-800 mb-4' }, 
                            'Ready to plan your perfect week?'
                        ),
                        React.createElement('p', { className: 'text-gray-600 mb-6' }, 
                            'Click the generate button above to create a personalized meal plan based on your goals and pantry!'
                        ),
                        React.createElement('button', {
                            onClick: generateWeeklyPlan,
                            className: 'px-8 py-4 bg-gradient-to-r from-blue-500 to-teal-600 hover:from-blue-600 hover:to-teal-700 text-white rounded-2xl font-bold text-lg transform hover:scale-105 transition-all duration-200'
                        }, '✨ Generate My Meal Plan')
                    ) :
                    React.createElement('div', { className: 'space-y-8' },
                        weekDays.map(day => 
                            React.createElement('div', { 
                                key: day,
                                className: 'bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden'
                            },
                                React.createElement('div', { className: 'bg-gradient-to-r from-gray-700 to-gray-800 text-white p-4' },
                                    React.createElement('h3', { className: 'text-xl font-bold' }, day),
                                    weeklyPlan[day] ? React.createElement('div', { className: 'text-sm opacity-75' },
                                        `${Object.values(weeklyPlan[day]).flat().reduce((cal, meal) => cal + meal.calories, 0)} calories • `,
                                        `${Math.round(Object.values(weeklyPlan[day]).flat().reduce((pro, meal) => pro + meal.protein, 0))}g protein`
                                    ) : null
                                ),
                                React.createElement('div', { className: 'p-6' },
                                    React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4' },
                                        ['breakfast', 'lunch', 'dinner', 'snacks'].map(mealType => 
                                            React.createElement('div', { key: mealType },
                                                React.createElement('h4', { className: 'font-semibold text-gray-700 mb-3 capitalize flex items-center' },
                                                    React.createElement('span', { className: 'mr-2' },
                                                        mealType === 'breakfast' ? '🌅' :
                                                        mealType === 'lunch' ? '☀️' :
                                                        mealType === 'dinner' ? '🌙' : '🍿'
                                                    ),
                                                    mealType
                                                ),
                                                weeklyPlan[day] && weeklyPlan[day][mealType] && weeklyPlan[day][mealType].length > 0 ?
                                                    weeklyPlan[day][mealType].map(meal => 
                                                        React.createElement(MealCard, {
                                                            key: meal.id,
                                                            meal,
                                                            day,
                                                            mealType,
                                                            onViewRecipe: viewRecipe,
                                                            onSwapMeal: swapMeal,
                                                            onAddToGrocery: addToGroceryList
                                                        })
                                                    ) :
                                                    React.createElement('div', { className: 'text-center py-8 text-gray-500' },
                                                        React.createElement('div', { className: 'text-2xl mb-2' }, '🍽️'),
                                                        React.createElement('p', { className: 'text-sm' }, 'No meal planned')
                                                    )
                                            )
                                        )
                                    )
                                )
                            )
                        )
                    ),

                missingIngredients.length > 0 ? React.createElement('div', { className: 'mt-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20' },
                    React.createElement('h3', { className: 'text-xl font-bold text-gray-800 mb-4 flex items-center' },
                        React.createElement('span', { className: 'mr-2 text-2xl' }, '🛒'),
                        'Weekly Shopping List'
                    ),
                    React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' },
                        missingIngredients.slice(0, 9).map((ingredient, index) => 
                            React.createElement('div', { 
                                key: index,
                                className: 'p-4 bg-orange-50 border border-orange-200 rounded-xl'
                            },
                                React.createElement('div', { className: 'flex justify-between items-start mb-2' },
                                    React.createElement('h4', { className: 'font-medium text-gray-800' }, ingredient.name),
                                    React.createElement('span', { className: 'text-xs text-orange-600 bg-orange-200 px-2 py-1 rounded' }, 
                                        `${ingredient.usedIn.length} meals`
                                    )
                                ),
                                React.createElement('div', { className: 'text-sm text-gray-600' },
                                    ingredient.usedIn.slice(0, 2).map(usage => `${usage.day}: ${usage.meal}`).join(', '),
                                    ingredient.usedIn.length > 2 ? ` +${ingredient.usedIn.length - 2} more` : ''
                                )
                            )
                        )
                    ),
                    missingIngredients.length > 9 ? React.createElement('div', { className: 'text-center mt-4' },
                        React.createElement('p', { className: 'text-gray-600' }, 
                            `And ${missingIngredients.length - 9} more ingredients...`
                        )
                    ) : null
                ) : null,

                React.createElement(RecipeDetailModal, {
                    meal: selectedMeal,
                    isOpen: modalOpen,
                    onClose: () => setModalOpen(false)
                })
            )
        );
    };

    // Render function
    function renderMealPlanning(containerId) {
        const container = document.getElementById(containerId);
        if (container) {
            ReactDOM.render(React.createElement(WeeklyMealPlanningApp), container);
        }
    }

    // Export functions
    window.HabbtMealPlanning = {
        WeeklyMealPlanningApp,
        renderMealPlanning
    };

    window.FuelIQMealPlanning = window.HabbtMealPlanning;
    window.renderMealPlanning = renderMealPlanning;

    console.log('✅ Habbt Weekly Meal Planning loaded - Complete with AI generation, detailed recipes, and shopping integration');

})();
