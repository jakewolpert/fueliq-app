// Enhanced Habbt Meal Planning - Complete Feature Set
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

    // Comprehensive meal database with cooking instructions
    const MEAL_DATABASE = {
        breakfast: [
            {
                id: 'breakfast_1',
                name: 'Protein Power Oatmeal',
                calories: 450,
                protein: 30,
                carbs: 55,
                fat: 12,
                fiber: 8,
                prepTime: '5 minutes',
                cookTime: '3 minutes',
                difficulty: 'Easy',
                servings: 1,
                tags: ['high-protein', 'quick', 'vegetarian'],
                ingredients: [
                    { name: 'rolled oats', amount: '1/2 cup', calories: 150 },
                    { name: 'protein powder', amount: '1 scoop', calories: 120 },
                    { name: 'banana', amount: '1 medium', calories: 105 },
                    { name: 'almond butter', amount: '1 tbsp', calories: 95 },
                    { name: 'chia seeds', amount: '1 tbsp', calories: 60 },
                    { name: 'cinnamon', amount: '1/2 tsp', calories: 3 }
                ],
                instructions: [
                    "Cook oats with water or milk according to package directions (about 3 minutes in microwave)",
                    "Let cool for 1 minute, then stir in protein powder until smooth",
                    "Slice banana and arrange on top",
                    "Add almond butter, chia seeds, and sprinkle with cinnamon",
                    "Mix everything together and enjoy!"
                ],
                tips: "For extra flavor, try vanilla protein powder and add a handful of berries",
                nutrition_focus: "High protein content supports muscle building and keeps you full until lunch"
            },
            {
                id: 'breakfast_2',
                name: 'Veggie Scramble Power Bowl',
                calories: 380,
                protein: 25,
                carbs: 15,
                fat: 22,
                fiber: 6,
                prepTime: '5 minutes',
                cookTime: '8 minutes',
                difficulty: 'Easy',
                servings: 1,
                tags: ['high-protein', 'low-carb', 'vegetarian'],
                ingredients: [
                    { name: 'eggs', amount: '3 large', calories: 210 },
                    { name: 'spinach', amount: '2 cups fresh', calories: 15 },
                    { name: 'bell pepper', amount: '1/2 cup diced', calories: 15 },
                    { name: 'mushrooms', amount: '1/2 cup sliced', calories: 10 },
                    { name: 'avocado', amount: '1/2 medium', calories: 120 },
                    { name: 'olive oil', amount: '1 tsp', calories: 40 }
                ],
                instructions: [
                    "Heat olive oil in a non-stick pan over medium heat",
                    "Add bell pepper and mushrooms, cook for 3-4 minutes until softened",
                    "Add spinach and cook until wilted (about 1 minute)",
                    "Beat eggs and pour into the pan with vegetables",
                    "Scramble everything together for 2-3 minutes until eggs are cooked",
                    "Serve topped with sliced avocado"
                ],
                tips: "Add hot sauce or herbs like basil for extra flavor without calories",
                nutrition_focus: "Perfect balance of protein and healthy fats with plenty of vegetables"
            },
            {
                id: 'breakfast_3',
                name: 'Greek Yogurt Berry Parfait',
                calories: 320,
                protein: 28,
                carbs: 35,
                fat: 8,
                fiber: 6,
                prepTime: '3 minutes',
                cookTime: '0 minutes',
                difficulty: 'Easy',
                servings: 1,
                tags: ['high-protein', 'no-cook', 'antioxidants'],
                ingredients: [
                    { name: 'greek yogurt', amount: '1 cup plain', calories: 130 },
                    { name: 'mixed berries', amount: '3/4 cup', calories: 60 },
                    { name: 'granola', amount: '1/4 cup', calories: 110 },
                    { name: 'honey', amount: '1 tbsp', calories: 64 },
                    { name: 'almonds', amount: '1 tbsp sliced', calories: 35 }
                ],
                instructions: [
                    "In a glass or bowl, add half the Greek yogurt",
                    "Layer with half the berries and a drizzle of honey",
                    "Add remaining yogurt, then top with remaining berries",
                    "Sprinkle granola and sliced almonds on top",
                    "Drizzle with remaining honey and serve immediately"
                ],
                tips: "Prepare the night before without granola, add granola just before eating to keep it crunchy",
                nutrition_focus: "High in protein and probiotics, with antioxidants from berries"
            }
        ],
        lunch: [
            {
                id: 'lunch_1',
                name: 'Mediterranean Chicken Bowl',
                calories: 520,
                protein: 42,
                carbs: 35,
                fat: 24,
                fiber: 8,
                prepTime: '10 minutes',
                cookTime: '15 minutes',
                difficulty: 'Medium',
                servings: 1,
                tags: ['high-protein', 'mediterranean', 'balanced'],
                ingredients: [
                    { name: 'chicken breast', amount: '6 oz', calories: 280 },
                    { name: 'quinoa', amount: '1/2 cup cooked', calories: 110 },
                    { name: 'cucumber', amount: '1/2 cup diced', calories: 8 },
                    { name: 'cherry tomatoes', amount: '1/2 cup', calories: 15 },
                    { name: 'red onion', amount: '2 tbsp diced', calories: 8 },
                    { name: 'feta cheese', amount: '2 tbsp crumbled', calories: 50 },
                    { name: 'olive oil', amount: '1 tbsp', calories: 120 },
                    { name: 'lemon juice', amount: '1 tbsp', calories: 4 },
                    { name: 'oregano', amount: '1 tsp dried', calories: 3 }
                ],
                instructions: [
                    "Season chicken breast with salt, pepper, and oregano",
                    "Heat a pan over medium-high heat and cook chicken 6-7 minutes per side",
                    "Let chicken rest for 3 minutes, then slice",
                    "Cook quinoa according to package directions if not already prepared",
                    "Mix olive oil, lemon juice, and remaining oregano for dressing",
                    "In a bowl, combine quinoa, cucumber, tomatoes, and red onion",
                    "Top with sliced chicken and feta cheese",
                    "Drizzle with dressing and serve"
                ],
                tips: "Marinate chicken in lemon juice and herbs for 30 minutes for extra flavor",
                nutrition_focus: "Complete protein with complex carbs and healthy Mediterranean fats"
            },
            {
                id: 'lunch_2',
                name: 'Asian Salmon Power Salad',
                calories: 480,
                protein: 35,
                carbs: 20,
                fat: 28,
                fiber: 7,
                prepTime: '8 minutes',
                cookTime: '12 minutes',
                difficulty: 'Medium',
                servings: 1,
                tags: ['high-protein', 'omega-3', 'asian-inspired'],
                ingredients: [
                    { name: 'salmon fillet', amount: '5 oz', calories: 275 },
                    { name: 'mixed greens', amount: '3 cups', calories: 20 },
                    { name: 'edamame', amount: '1/2 cup shelled', calories: 95 },
                    { name: 'carrots', amount: '1/2 cup julienned', calories: 25 },
                    { name: 'avocado', amount: '1/2 medium', calories: 120 },
                    { name: 'sesame oil', amount: '1 tsp', calories: 40 },
                    { name: 'rice vinegar', amount: '1 tbsp', calories: 0 },
                    { name: 'ginger', amount: '1 tsp fresh grated', calories: 1 },
                    { name: 'sesame seeds', amount: '1 tsp', calories: 17 }
                ],
                instructions: [
                    "Season salmon with salt and pepper",
                    "Heat a pan over medium-high heat and cook salmon 4-5 minutes per side",
                    "Let salmon rest, then flake into chunks",
                    "Whisk together sesame oil, rice vinegar, and grated ginger",
                    "In a large bowl, combine mixed greens, edamame, and carrots",
                    "Top with salmon chunks and sliced avocado",
                    "Drizzle with dressing and sprinkle with sesame seeds"
                ],
                tips: "For crispy salmon skin, start cooking skin-side down and don't flip until it releases easily",
                nutrition_focus: "Rich in omega-3 fatty acids and complete proteins with plenty of vegetables"
            }
        ],
        dinner: [
            {
                id: 'dinner_1',
                name: 'Herb-Crusted Cod with Roasted Vegetables',
                calories: 420,
                protein: 35,
                carbs: 32,
                fat: 16,
                fiber: 9,
                prepTime: '15 minutes',
                cookTime: '25 minutes',
                difficulty: 'Medium',
                servings: 1,
                tags: ['lean-protein', 'vegetables', 'herbs'],
                ingredients: [
                    { name: 'cod fillet', amount: '6 oz', calories: 180 },
                    { name: 'sweet potato', amount: '1 medium cubed', calories: 115 },
                    { name: 'broccoli', amount: '1 cup florets', calories: 25 },
                    { name: 'zucchini', amount: '1 medium sliced', calories: 20 },
                    { name: 'olive oil', amount: '1 tbsp', calories: 120 },
                    { name: 'panko breadcrumbs', amount: '2 tbsp', calories: 30 },
                    { name: 'fresh herbs', amount: '2 tbsp mixed', calories: 5 },
                    { name: 'garlic', amount: '2 cloves minced', calories: 8 },
                    { name: 'lemon', amount: '1/2 juiced', calories: 7 }
                ],
                instructions: [
                    "Preheat oven to 425°F (220°C)",
                    "Toss sweet potato cubes with 1 tsp olive oil, salt and pepper",
                    "Roast sweet potatoes for 10 minutes",
                    "Add broccoli and zucchini to the pan, roast 10-15 minutes more",
                    "Mix panko, herbs, garlic, and remaining olive oil",
                    "Place cod on a baking sheet, top with herb mixture",
                    "Bake cod for 12-15 minutes until flakes easily",
                    "Serve cod over roasted vegetables with lemon juice"
                ],
                tips: "Don't overcook the cod - it should be opaque and flake easily with a fork",
                nutrition_focus: "Lean protein with complex carbs and plenty of fiber from vegetables"
            }
        ],
        snacks: [
            {
                id: 'snack_1',
                name: 'Apple Almond Butter Energy Bites',
                calories: 180,
                protein: 8,
                carbs: 18,
                fat: 10,
                fiber: 4,
                prepTime: '5 minutes',
                cookTime: '0 minutes',
                difficulty: 'Easy',
                servings: 1,
                tags: ['no-cook', 'portable', 'energy'],
                ingredients: [
                    { name: 'apple', amount: '1 medium sliced', calories: 95 },
                    { name: 'almond butter', amount: '1 tbsp', calories: 95 },
                    { name: 'cinnamon', amount: 'pinch', calories: 0 }
                ],
                instructions: [
                    "Wash and core the apple, then slice into wedges",
                    "Arrange apple slices on a plate",
                    "Serve with almond butter for dipping",
                    "Sprinkle with cinnamon for extra flavor"
                ],
                tips: "Choose crisp apples like Honeycrisp or Gala for the best texture",
                nutrition_focus: "Natural sugars from fruit balanced with protein and healthy fats"
            }
        ]
    };

    // User preferences and goals
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
                mealsPerDay: profile.mealsPerDay || 3
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
                mealsPerDay: 3
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

    // Generate custom meal plan based on user preferences
    const generateCustomMealPlan = (preferences, pantryItems) => {
        const { goal, calorieTarget, proteinTarget, dietaryRestrictions } = preferences;
        const availableIngredients = pantryItems.map(item => item.name.toLowerCase());
        
        // Calorie distribution based on goal
        const calorieDistribution = {
            muscle_gain: { breakfast: 0.25, lunch: 0.35, dinner: 0.35, snacks: 0.05 },
            fat_loss: { breakfast: 0.30, lunch: 0.35, dinner: 0.30, snacks: 0.05 },
            maintenance: { breakfast: 0.25, lunch: 0.35, dinner: 0.35, snacks: 0.05 }
        };

        const distribution = calorieDistribution[goal] || calorieDistribution.maintenance;
        
        const mealPlan = {
            breakfast: [],
            lunch: [],
            dinner: [],
            snacks: []
        };

        // Filter meals based on dietary restrictions and preferences
        Object.keys(MEAL_DATABASE).forEach(mealType => {
            const targetCalories = calorieTarget * distribution[mealType];
            const availableMeals = MEAL_DATABASE[mealType].filter(meal => {
                // Check dietary restrictions
                if (dietaryRestrictions.includes('vegetarian') && !meal.tags.includes('vegetarian')) {
                    return meal.tags.includes('vegetarian') || !meal.ingredients.some(ing => 
                        ['chicken', 'beef', 'pork', 'fish', 'salmon', 'cod'].some(meat => 
                            ing.name.toLowerCase().includes(meat)
                        )
                    );
                }
                
                // Check if meal fits calorie target (within 20% range)
                return meal.calories >= targetCalories * 0.8 && meal.calories <= targetCalories * 1.2;
            });

            // Prioritize meals with ingredients from pantry
            const mealsWithPantryIngredients = availableMeals.filter(meal => 
                meal.ingredients.some(ingredient => 
                    availableIngredients.includes(ingredient.name.toLowerCase())
                )
            );

            // Select the best meal
            const selectedMeals = mealsWithPantryIngredients.length > 0 ? mealsWithPantryIngredients : availableMeals;
            if (selectedMeals.length > 0) {
                mealPlan[mealType] = [selectedMeals[0]]; // For now, select the first suitable meal
            }
        });

        return mealPlan;
    };

    // Calculate missing ingredients
    const calculateMissingIngredients = (mealPlan, pantryItems) => {
        const pantryItemNames = pantryItems.map(item => item.name.toLowerCase());
        const missingIngredients = [];

        Object.values(mealPlan).flat().forEach(meal => {
            meal.ingredients.forEach(ingredient => {
                if (!pantryItemNames.includes(ingredient.name.toLowerCase())) {
                    const existing = missingIngredients.find(item => 
                        item.name.toLowerCase() === ingredient.name.toLowerCase()
                    );
                    if (!existing) {
                        missingIngredients.push({
                            name: ingredient.name,
                            amount: ingredient.amount,
                            calories: ingredient.calories,
                            forMeal: meal.name
                        });
                    }
                }
            });
        });

        return missingIngredients;
    };

    // Storage functions
    const savePlanningData = (date, data) => {
        const key = `habbt_meal_plan_${date}`;
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (e) {
            console.warn('Failed to save meal plan:', e);
        }
    };

    const loadPlanningData = (date) => {
        const key = `habbt_meal_plan_${date}`;
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : { breakfast: [], lunch: [], dinner: [], snacks: [] };
        } catch (e) {
            return { breakfast: [], lunch: [], dinner: [], snacks: [] };
        }
    };

    // Shopping list functions
    const saveShoppingList = (items) => {
        try {
            localStorage.setItem('habbt_shopping_list', JSON.stringify(items));
        } catch (e) {
            console.warn('Failed to save shopping list:', e);
        }
    };

    const loadShoppingList = () => {
        try {
            const data = localStorage.getItem('habbt_shopping_list');
            return data ? JSON.parse(data) : [];
        } catch (e) {
            return [];
        }
    };

    // Meal Detail Modal Component
    const MealDetailModal = ({ meal, isOpen, onClose, onAddToPlan, mealType }) => {
        if (!isOpen || !meal) return null;

        return React.createElement('div', { className: 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50' },
            React.createElement('div', { className: 'bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto' },
                React.createElement('div', { className: 'p-6' },
                    // Header
                    React.createElement('div', { className: 'flex justify-between items-start mb-6' },
                        React.createElement('div', null,
                            React.createElement('h2', { className: 'text-2xl font-bold text-gray-800 mb-2' }, meal.name),
                            React.createElement('div', { className: 'flex flex-wrap gap-2 mb-4' },
                                ...meal.tags.map(tag => 
                                    React.createElement('span', { 
                                        key: tag,
                                        className: 'px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium'
                                    }, tag)
                                )
                            )
                        ),
                        React.createElement('button', {
                            onClick: onClose,
                            className: 'text-gray-500 hover:text-gray-700 text-2xl font-bold'
                        }, '×')
                    ),

                    // Nutrition Info
                    React.createElement('div', { className: 'grid grid-cols-4 gap-4 mb-6' },
                        React.createElement('div', { className: 'text-center p-3 bg-blue-50 rounded-lg' },
                            React.createElement('div', { className: 'text-xl font-bold text-blue-600' }, meal.calories),
                            React.createElement('div', { className: 'text-sm text-gray-600' }, 'Calories')
                        ),
                        React.createElement('div', { className: 'text-center p-3 bg-red-50 rounded-lg' },
                            React.createElement('div', { className: 'text-xl font-bold text-red-600' }, `${meal.protein}g`),
                            React.createElement('div', { className: 'text-sm text-gray-600' }, 'Protein')
                        ),
                        React.createElement('div', { className: 'text-center p-3 bg-yellow-50 rounded-lg' },
                            React.createElement('div', { className: 'text-xl font-bold text-yellow-600' }, `${meal.carbs}g`),
                            React.createElement('div', { className: 'text-sm text-gray-600' }, 'Carbs')
                        ),
                        React.createElement('div', { className: 'text-center p-3 bg-purple-50 rounded-lg' },
                            React.createElement('div', { className: 'text-xl font-bold text-purple-600' }, `${meal.fat}g`),
                            React.createElement('div', { className: 'text-sm text-gray-600' }, 'Fat')
                        )
                    ),

                    // Meal Info
                    React.createElement('div', { className: 'grid grid-cols-3 gap-4 mb-6 text-center' },
                        React.createElement('div', null,
                            React.createElement('div', { className: 'text-lg font-semibold text-gray-800' }, meal.prepTime),
                            React.createElement('div', { className: 'text-sm text-gray-600' }, 'Prep Time')
                        ),
                        React.createElement('div', null,
                            React.createElement('div', { className: 'text-lg font-semibold text-gray-800' }, meal.cookTime),
                            React.createElement('div', { className: 'text-sm text-gray-600' }, 'Cook Time')
                        ),
                        React.createElement('div', null,
                            React.createElement('div', { className: 'text-lg font-semibold text-gray-800' }, meal.difficulty),
                            React.createElement('div', { className: 'text-sm text-gray-600' }, 'Difficulty')
                        )
                    ),

                    // Ingredients
                    React.createElement('div', { className: 'mb-6' },
                        React.createElement('h3', { className: 'text-lg font-bold text-gray-800 mb-3' }, 'Ingredients'),
                        React.createElement('div', { className: 'space-y-2' },
                            ...meal.ingredients.map((ingredient, index) => 
                                React.createElement('div', { 
                                    key: index,
                                    className: 'flex justify-between items-center p-2 bg-gray-50 rounded-lg'
                                },
                                    React.createElement('span', { className: 'font-medium' }, ingredient.name),
                                    React.createElement('span', { className: 'text-sm text-gray-600' }, ingredient.amount)
                                )
                            )
                        )
                    ),

                    // Instructions
                    React.createElement('div', { className: 'mb-6' },
                        React.createElement('h3', { className: 'text-lg font-bold text-gray-800 mb-3' }, 'Cooking Instructions'),
                        React.createElement('ol', { className: 'space-y-3' },
                            ...meal.instructions.map((instruction, index) => 
                                React.createElement('li', { 
                                    key: index,
                                    className: 'flex gap-3'
                                },
                                    React.createElement('span', { 
                                        className: 'flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold'
                                    }, index + 1),
                                    React.createElement('span', { className: 'text-gray-700' }, instruction)
                                )
                            )
                        )
                    ),

                    // Tips and Nutrition Focus
                    React.createElement('div', { className: 'space-y-4 mb-6' },
                        React.createElement('div', { className: 'p-4 bg-yellow-50 rounded-lg border border-yellow-200' },
                            React.createElement('h4', { className: 'font-bold text-yellow-800 mb-2' }, '💡 Chef\'s Tip'),
                            React.createElement('p', { className: 'text-yellow-700 text-sm' }, meal.tips)
                        ),
                        React.createElement('div', { className: 'p-4 bg-green-50 rounded-lg border border-green-200' },
                            React.createElement('h4', { className: 'font-bold text-green-800 mb-2' }, '🥗 Nutrition Focus'),
                            React.createElement('p', { className: 'text-green-700 text-sm' }, meal.nutrition_focus)
                        )
                    ),

                    // Actions
                    React.createElement('div', { className: 'flex gap-3' },
                        React.createElement('button', {
                            onClick: () => {
                                onAddToPlan(meal, mealType);
                                onClose();
                            },
                            className: 'flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-teal-600 hover:from-blue-600 hover:to-teal-700 text-white rounded-lg font-semibold'
                        }, `Add to ${mealType.charAt(0).toUpperCase() + mealType.slice(1)}`),
                        React.createElement('button', {
                            onClick: onClose,
                            className: 'px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold'
                        }, 'Close')
                    )
                )
            )
        );
    };

    // Main Meal Planning Component
    const MealPlanningApp = () => {
        const [currentDate, setCurrentDate] = React.useState(new Date().toISOString().split('T')[0]);
        const [mealPlan, setMealPlan] = React.useState(loadPlanningData(currentDate));
        const [pantryItems, setPantryItems] = React.useState([]);
        const [userPreferences, setUserPreferences] = React.useState(getUserPreferences());
        const [selectedMeal, setSelectedMeal] = React.useState(null);
        const [modalOpen, setModalOpen] = React.useState(false);
        const [modalMealType, setModalMealType] = React.useState('breakfast');
        const [missingIngredients, setMissingIngredients] = React.useState([]);
        const [shoppingList, setShoppingList] = React.useState(loadShoppingList());
        const [isGenerating, setIsGenerating] = React.useState(false);

        React.useEffect(() => {
            const pantryData = loadPlanningPantryData();
            setPantryItems(pantryData.items || []);
        }, []);

        React.useEffect(() => {
            setMealPlan(loadPlanningData(currentDate));
        }, [currentDate]);

        React.useEffect(() => {
            savePlanningData(currentDate, mealPlan);
            const missing = calculateMissingIngredients(mealPlan, pantryItems);
            setMissingIngredients(missing);
        }, [mealPlan, currentDate, pantryItems]);

        const generateMealPlan = async () => {
            setIsGenerating(true);
            
            // Simulate AI processing time
            setTimeout(() => {
                const newPlan = generateCustomMealPlan(userPreferences, pantryItems);
                setMealPlan(newPlan);
                setIsGenerating(false);
            }, 2000);
        };

        const addMealToPlan = (meal, mealType) => {
            setMealPlan(prev => ({
                ...prev,
                [mealType]: [...prev[mealType], { ...meal, planId: Date.now() + Math.random() }]
            }));
        };

        const removeMealFromPlan = (mealType, planId) => {
            setMealPlan(prev => ({
                ...prev,
                [mealType]: prev[mealType].filter(meal => meal.planId !== planId)
            }));
        };

        const openMealDetail = (meal, mealType) => {
            setSelectedMeal(meal);
            setModalMealType(mealType);
            setModalOpen(true);
        };

        const addToShoppingList = (ingredient) => {
            const newList = [...shoppingList];
            const existing = newList.find(item => item.name.toLowerCase() === ingredient.name.toLowerCase());
            
            if (!existing) {
                newList.push({ ...ingredient, id: Date.now() + Math.random() });
                setShoppingList(newList);
                saveShoppingList(newList);
            }
        };

        const navigateDate = (direction) => {
            const newDate = new Date(currentDate);
            newDate.setDate(newDate.getDate() + direction);
            setCurrentDate(newDate.toISOString().split('T')[0]);
        };

        const totalCalories = Object.values(mealPlan).flat().reduce((sum, meal) => sum + meal.calories, 0);
        const totalProtein = Object.values(mealPlan).flat().reduce((sum, meal) => sum + meal.protein, 0);

        return React.createElement('div', { className: 'min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-cyan-50' },
            React.createElement('div', { className: 'max-w-7xl mx-auto p-6' },
                // Header
                React.createElement('div', { className: 'bg-gradient-to-r from-blue-600 to-teal-600 rounded-3xl shadow-2xl p-8 mb-8 text-white' },
                    React.createElement('div', { className: 'text-center' },
                        React.createElement('h1', { className: 'text-4xl font-bold mb-2' }, '🍽️ AI Meal Planning'),
                        React.createElement('p', { className: 'text-xl opacity-90 mb-6' }, 'Personalized meal plans based on your goals and pantry'),
                        
                        // Generate Button
                        React.createElement('button', {
                            onClick: generateMealPlan,
                            disabled: isGenerating,
                            className: `px-8 py-4 bg-white/20 hover:bg-white/30 disabled:bg-white/10 rounded-2xl font-bold text-lg transition-all duration-200 backdrop-blur-sm ${isGenerating ? 'cursor-not-allowed' : 'transform hover:scale-105'}`
                        }, 
                            isGenerating ? '🤖 Generating Your Perfect Meal Plan...' : '✨ Generate Custom Meal Plan'
                        ),
                        
                        // Date Navigation
                        React.createElement('div', { className: 'flex items-center justify-center space-x-4 mt-6' },
                            React.createElement('button', {
                                onClick: () => navigateDate(-1),
                                className: 'px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-semibold transition-all duration-200 backdrop-blur-sm'
                            }, '← Previous'),
                            React.createElement('div', { className: 'px-6 py-2 bg-white/20 rounded-lg backdrop-blur-sm' },
                                React.createElement('input', {
                                    type: 'date',
                                    value: currentDate,
                                    onChange: (e) => setCurrentDate(e.target.value),
                                    className: 'bg-transparent text-white font-semibold focus:outline-none'
                                })
                            ),
                            React.createElement('button', {
                                onClick: () => navigateDate(1),
                                className: 'px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-semibold transition-all duration-200 backdrop-blur-sm'
                            }, 'Next →')
                        )
                    )
                ),

                // Summary Cards
                React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-3 gap-6 mb-8' },
                    React.createElement('div', { className: 'bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20' },
                        React.createElement('h3', { className: 'text-lg font-bold text-gray-800 mb-4' }, '📊 Daily Totals'),
                        React.createElement('div', { className: 'space-y-2' },
                            React.createElement('div', { className: 'flex justify-between' },
                                React.createElement('span', null, 'Calories:'),
                                React.createElement('span', { className: 'font-bold text-blue-600' }, `${totalCalories}/${userPreferences.calorieTarget}`)
                            ),
                            React.createElement('div', { className: 'flex justify-between' },
                                React.createElement('span', null, 'Protein:'),
                                React.createElement('span', { className: 'font-bold text-red-600' }, `${Math.round(totalProtein)}g/${userPreferences.proteinTarget}g`)
                            )
                        )
                    ),
                    React.createElement('div', { className: 'bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20' },
                        React.createElement('h3', { className: 'text-lg font-bold text-gray-800 mb-4' }, '🛒 Shopping List'),
                        React.createElement('div', null,
                            React.createElement('div', { className: 'text-2xl font-bold text-orange-600' }, missingIngredients.length),
                            React.createElement('div', { className: 'text-sm text-gray-600' }, 'ingredients needed'),
                            missingIngredients.length > 0 && React.createElement('button', {
                                onClick: () => missingIngredients.forEach(addToShoppingList),
                                className: 'mt-2 text-sm px-3 py-1 bg-orange-500 hover:bg-orange-600 text-white rounded-lg'
                            }, 'Add All to Cart')
                        )
                    ),
                    React.createElement('div', { className: 'bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20' },
                        React.createElement('h3', { className: 'text-lg font-bold text-gray-800 mb-4' }, '🎯 Goal Progress'),
                        React.createElement('div', null,
                            React.createElement('div', { className: 'text-lg font-bold text-green-600' }, 
                                `${Math.round((totalCalories / userPreferences.calorieTarget) * 100)}%`
                            ),
                            React.createElement('div', { className: 'text-sm text-gray-600' }, 'of daily calories'),
                            React.createElement('div', { className: 'w-full bg-gray-200 rounded-full h-2 mt-2' },
                                React.createElement('div', {
                                    className: 'bg-green-500 h-2 rounded-full transition-all duration-500',
                                    style: { width: `${Math.min((totalCalories / userPreferences.calorieTarget) * 100, 100)}%` }
                                })
                            )
                        )
                    )
                ),

                // Meal Plan Grid
                React.createElement('div', { className: 'grid grid-cols-1 lg:grid-cols-2 gap-8' },
                    ['breakfast', 'lunch', 'dinner', 'snacks'].map(mealType => 
                        React.createElement('div', { 
                            key: mealType,
                            className: 'bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden'
                        },
                            React.createElement('div', { className: 'bg-gradient-to-r from-blue-500 via-blue-600 to-teal-600 text-white p-6' },
                                React.createElement('h3', { className: 'text-xl font-bold flex items-center' },
                                    React.createElement('span', { className: 'mr-3 text-2xl' },
                                        mealType === 'breakfast' ? '🌅' :
                                        mealType === 'lunch' ? '☀️' :
                                        mealType === 'dinner' ? '🌙' : '🍿'
                                    ),
                                    mealType.charAt(0).toUpperCase() + mealType.slice(1)
                                )
                            ),
                            React.createElement('div', { className: 'p-6' },
                                mealPlan[mealType].length === 0 ? 
                                    React.createElement('div', { className: 'text-center py-8' },
                                        React.createElement('div', { className: 'text-4xl mb-4' }, '🍽️'),
                                        React.createElement('p', { className: 'text-gray-500 mb-4' }, `No ${mealType} planned yet`),
                                        React.createElement('button', {
                                            onClick: generateMealPlan,
                                            className: 'px-4 py-2 bg-gradient-to-r from-blue-500 to-teal-600 hover:from-blue-600 hover:to-teal-700 text-white rounded-lg font-semibold'
                                        }, 'Generate Suggestions')
                                    ) :
                                    React.createElement('div', { className: 'space-y-4' },
                                        ...mealPlan[mealType].map(meal => 
                                            React.createElement('div', { 
                                                key: meal.planId || meal.id,
                                                className: 'border border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 cursor-pointer'
                                            },
                                                React.createElement('div', { 
                                                    onClick: () => openMealDetail(meal, mealType),
                                                    className: 'flex justify-between items-start mb-3'
                                                },
                                                    React.createElement('div', { className: 'flex-1' },
                                                        React.createElement('h4', { className: 'font-bold text-gray-800 mb-1' }, meal.name),
                                                        React.createElement('div', { className: 'text-sm text-gray-600 mb-2' },
                                                            `${meal.calories} cal • ${meal.protein}g protein • ${meal.prepTime}`
                                                        ),
                                                        React.createElement('div', { className: 'flex flex-wrap gap-1' },
                                                            ...meal.tags.slice(0, 3).map(tag => 
                                                                React.createElement('span', { 
                                                                    key: tag,
                                                                    className: 'px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full'
                                                                }, tag)
                                                            )
                                                        )
                                                    )
                                                ),
                                                React.createElement('div', { className: 'flex gap-2 mt-3' },
                                                    React.createElement('button', {
                                                        onClick: () => openMealDetail(meal, mealType),
                                                        className: 'flex-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg font-semibold'
                                                    }, 'View Recipe'),
                                                    React.createElement('button', {
                                                        onClick: () => removeMealFromPlan(mealType, meal.planId || meal.id),
                                                        className: 'px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 text-sm rounded-lg font-semibold'
                                                    }, 'Remove')
                                                )
                                            )
                                        )
                                    )
                            )
                        )
                    )
                ),

                // Missing Ingredients Section
                missingIngredients.length > 0 && React.createElement('div', { className: 'mt-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20' },
                    React.createElement('h3', { className: 'text-xl font-bold text-gray-800 mb-4 flex items-center' },
                        React.createElement('span', { className: 'mr-2 text-2xl' }, '🛒'),
                        'Missing Ingredients'
                    ),
                    React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' },
                        ...missingIngredients.map((ingredient, index) => 
                            React.createElement('div', { 
                                key: index,
                                className: 'flex justify-between items-center p-3 bg-orange-50 border border-orange-200 rounded-lg'
                            },
                                React.createElement('div', { className: 'flex-1' },
                                    React.createElement('div', { className: 'font-medium text-gray-800' }, ingredient.name),
                                    React.createElement('div', { className: 'text-sm text-gray-600' }, ingredient.amount),
                                    React.createElement('div', { className: 'text-xs text-orange-600' }, `For: ${ingredient.forMeal}`)
                                ),
                                React.createElement('button', {
                                    onClick: () => addToShoppingList(ingredient),
                                    className: 'px-3 py-1 bg-orange-500 hover:bg-orange-600 text-white text-sm rounded-lg font-semibold'
                                }, 'Add to Cart')
                            )
                        )
                    )
                ),

                // Meal Detail Modal
                React.createElement(MealDetailModal, {
                    meal: selectedMeal,
                    isOpen: modalOpen,
                    onClose: () => setModalOpen(false),
                    onAddToPlan: addMealToPlan,
                    mealType: modalMealType
                })
            )
        );
    };

    // Render function
    function renderMealPlanning(containerId) {
        const container = document.getElementById(containerId);
        if (container) {
            ReactDOM.render(React.createElement(MealPlanningApp), container);
        }
    }

    // Export functions
    window.HabbtMealPlanning = {
        MealPlanningApp,
        renderMealPlanning
    };

    window.FuelIQMealPlanning = window.HabbtMealPlanning;
    window.renderMealPlanning = renderMealPlanning;

    console.log('✅ Habbt Meal Planning loaded - Complete with AI generation, recipe details, and shopping integration');

})();
