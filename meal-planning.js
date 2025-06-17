// Enhanced meal-planning.js with Pantry Integration - CONFLICT-FREE VERSION
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

    // Unique fallback foods database for planning
    const PLANNING_FALLBACK_FOODS = {
        // Proteins
        'chicken breast': { calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, sodium: 74, sugar: 0 },
        'salmon': { calories: 208, protein: 20, carbs: 0, fat: 12, fiber: 0, sodium: 82, sugar: 0 },
        'tuna': { calories: 144, protein: 30, carbs: 0, fat: 1, fiber: 0, sodium: 50, sugar: 0 },
        'ground beef': { calories: 250, protein: 26, carbs: 0, fat: 15, fiber: 0, sodium: 75, sugar: 0 },
        'ground turkey': { calories: 200, protein: 27, carbs: 0, fat: 8, fiber: 0, sodium: 90, sugar: 0 },
        'eggs': { calories: 155, protein: 13, carbs: 1, fat: 11, fiber: 0, sodium: 124, sugar: 1 },
        'tofu': { calories: 144, protein: 15, carbs: 3, fat: 9, fiber: 2, sodium: 18, sugar: 1 },
        'greek yogurt': { calories: 100, protein: 17, carbs: 6, fat: 0, fiber: 0, sodium: 60, sugar: 6 },
        'cottage cheese': { calories: 98, protein: 11, carbs: 3, fat: 4, fiber: 0, sodium: 364, sugar: 3 },
        'protein powder': { calories: 120, protein: 25, carbs: 3, fat: 1, fiber: 1, sodium: 150, sugar: 1 },
        
        // Vegetables
        'broccoli': { calories: 34, protein: 3, carbs: 7, fat: 0.4, fiber: 3, sodium: 33, sugar: 2 },
        'spinach': { calories: 23, protein: 3, carbs: 4, fat: 0.4, fiber: 2, sodium: 79, sugar: 0 },
        'carrots': { calories: 41, protein: 1, carbs: 10, fat: 0.2, fiber: 3, sodium: 69, sugar: 5 },
        'bell peppers': { calories: 31, protein: 1, carbs: 7, fat: 0.3, fiber: 3, sodium: 4, sugar: 5 },
        'tomatoes': { calories: 18, protein: 1, carbs: 4, fat: 0.2, fiber: 1, sodium: 5, sugar: 3 },
        'cucumber': { calories: 16, protein: 1, carbs: 4, fat: 0.1, fiber: 1, sodium: 2, sugar: 2 },
        'lettuce': { calories: 15, protein: 1, carbs: 3, fat: 0.2, fiber: 1, sodium: 28, sugar: 1 },
        'onions': { calories: 40, protein: 1, carbs: 9, fat: 0.1, fiber: 2, sodium: 4, sugar: 4 },
        'mushrooms': { calories: 22, protein: 3, carbs: 3, fat: 0.3, fiber: 1, sodium: 5, sugar: 2 },
        'zucchini': { calories: 17, protein: 1, carbs: 3, fat: 0.3, fiber: 1, sodium: 8, sugar: 3 },
        
        // Fruits
        'apple': { calories: 52, protein: 0.3, carbs: 14, fat: 0.2, fiber: 2, sodium: 1, sugar: 10 },
        'banana': { calories: 89, protein: 1, carbs: 23, fat: 0.3, fiber: 3, sodium: 1, sugar: 12 },
        'orange': { calories: 47, protein: 1, carbs: 12, fat: 0.1, fiber: 2, sodium: 0, sugar: 9 },
        'berries': { calories: 57, protein: 1, carbs: 14, fat: 0.3, fiber: 8, sodium: 1, sugar: 10 },
        'grapes': { calories: 69, protein: 1, carbs: 16, fat: 0.2, fiber: 1, sodium: 3, sugar: 16 },
        'pineapple': { calories: 50, protein: 1, carbs: 13, fat: 0.1, fiber: 1, sodium: 1, sugar: 10 },
        'strawberries': { calories: 32, protein: 1, carbs: 8, fat: 0.3, fiber: 2, sodium: 1, sugar: 5 },
        'avocado': { calories: 160, protein: 2, carbs: 9, fat: 15, fiber: 7, sodium: 7, sugar: 1 },
        
        // Grains & Starches
        'brown rice': { calories: 111, protein: 3, carbs: 23, fat: 0.9, fiber: 2, sodium: 5, sugar: 0 },
        'white rice': { calories: 130, protein: 3, carbs: 28, fat: 0.3, fiber: 0, sodium: 5, sugar: 0 },
        'quinoa': { calories: 120, protein: 4, carbs: 22, fat: 2, fiber: 3, sodium: 7, sugar: 0 },
        'oats': { calories: 389, protein: 17, carbs: 66, fat: 7, fiber: 11, sodium: 2, sugar: 1 },
        'sweet potato': { calories: 86, protein: 2, carbs: 20, fat: 0.1, fiber: 3, sodium: 54, sugar: 4 },
        'potato': { calories: 77, protein: 2, carbs: 17, fat: 0.1, fiber: 2, sodium: 6, sugar: 1 },
        'pasta': { calories: 131, protein: 5, carbs: 25, fat: 1, fiber: 2, sodium: 6, sugar: 1 },
        'bread': { calories: 265, protein: 9, carbs: 49, fat: 3, fiber: 3, sodium: 491, sugar: 5 },
        
        // Nuts & Seeds
        'almonds': { calories: 579, protein: 21, carbs: 22, fat: 50, fiber: 12, sodium: 1, sugar: 4 },
        'walnuts': { calories: 654, protein: 15, carbs: 14, fat: 65, fiber: 7, sodium: 2, sugar: 3 },
        'peanut butter': { calories: 588, protein: 25, carbs: 20, fat: 50, fiber: 8, sodium: 17, sugar: 9 },
        'chia seeds': { calories: 486, protein: 17, carbs: 42, fat: 31, fiber: 34, sodium: 16, sugar: 0 },
        'flaxseed': { calories: 534, protein: 18, carbs: 29, fat: 42, fiber: 28, sodium: 30, sugar: 2 },
        
        // Dairy
        'milk': { calories: 42, protein: 3, carbs: 5, fat: 1, fiber: 0, sodium: 44, sugar: 5 },
        'cheese': { calories: 113, protein: 7, carbs: 1, fat: 9, fiber: 0, sodium: 186, sugar: 1 },
        'yogurt': { calories: 59, protein: 10, carbs: 4, fat: 0.4, fiber: 0, sodium: 46, sugar: 4 },
        
        // Oils & Fats
        'olive oil': { calories: 884, protein: 0, carbs: 0, fat: 100, fiber: 0, sodium: 2, sugar: 0 },
        'coconut oil': { calories: 862, protein: 0, carbs: 0, fat: 100, fiber: 0, sodium: 0, sugar: 0 },
        'butter': { calories: 717, protein: 1, carbs: 0, fat: 81, fiber: 0, sodium: 11, sugar: 0 }
    };

    // Unique barcode lookup function for planning
    const lookupBarcodeForPlanning = async (barcode) => {
        try {
            const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
            const data = await response.json();
            
            if (data.status === 1 && data.product) {
                const product = data.product;
                const nutrients = product.nutriments || {};
                
                return {
                    fdcId: barcode,
                    description: product.product_name || product.product_name_en || 'Unknown Product',
                    brandOwner: product.brands || 'Unknown Brand',
                    ingredients: product.ingredients_text || '',
                    nutrients: {
                        calories: nutrients['energy-kcal_100g'] || nutrients.energy_100g/4.184 || 0,
                        protein: nutrients.proteins_100g || 0,
                        carbs: nutrients.carbohydrates_100g || 0,
                        fat: nutrients.fat_100g || 0,
                        fiber: nutrients.fiber_100g || 0,
                        sodium: nutrients.sodium_100g || 0,
                        sugar: nutrients.sugars_100g || 0
                    },
                    dataType: 'Barcode',
                    source: 'openfoodfacts',
                    barcode: barcode
                };
            }
            
            return null;
        } catch (error) {
            console.error('Planning barcode lookup failed:', error);
            return null;
        }
    };

    // Unique storage functions for planning
    const isPlanningStorageAvailable = () => {
        try {
            const test = '__planning_localStorage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    };

    const planningMemoryStorage = {};

    const loadPlanningPantryData = () => {
        try {
            const pantryData = localStorage.getItem('habbt_pantry') || localStorage.getItem('fueliq_pantry');
            return pantryData ? JSON.parse(pantryData) : { items: [] };
        } catch (e) {
            console.error('Error loading pantry data for meal planning:', e);
            return { items: [] };
        }
    };

    const savePlanningData = (date, data) => {
        const key = `habbt_meal_plan_${date}`;
        const dataStr = JSON.stringify(data);
        
        if (isPlanningStorageAvailable()) {
            try {
                localStorage.setItem(key, dataStr);
            } catch (e) {
                console.warn('Planning localStorage failed, using memory storage:', e);
                planningMemoryStorage[key] = dataStr;
            }
        } else {
            planningMemoryStorage[key] = dataStr;
        }
    };

    const loadPlanningData = (date) => {
        const key = `habbt_meal_plan_${date}`;
        let data = null;
        
        if (isPlanningStorageAvailable()) {
            try {
                data = localStorage.getItem(key);
            } catch (e) {
                console.warn('Planning localStorage failed, using memory storage:', e);
                data = planningMemoryStorage[key];
            }
        } else {
            data = planningMemoryStorage[key];
        }
        
        return data ? JSON.parse(data) : {
            breakfast: [],
            lunch: [],
            dinner: [],
            snacks: []
        };
    };

    // AI meal suggestions based on nutritional goals and pantry
    const generateMealSuggestions = (mealType, pantryItems, nutritionalGoals) => {
        const suggestions = [];
        const availableIngredients = pantryItems.map(item => item.name.toLowerCase());
        
        // Suggest meals based on what's available in pantry
        if (mealType === 'breakfast') {
            if (availableIngredients.includes('eggs')) {
                suggestions.push({
                    name: 'Scrambled Eggs with Vegetables',
                    ingredients: ['eggs', 'spinach', 'bell peppers'],
                    calories: 250,
                    protein: 20,
                    carbs: 8,
                    fat: 15,
                    prepTime: '10 minutes',
                    difficulty: 'Easy'
                });
            }
            if (availableIngredients.includes('oats')) {
                suggestions.push({
                    name: 'Protein Oatmeal Bowl',
                    ingredients: ['oats', 'protein powder', 'berries'],
                    calories: 350,
                    protein: 25,
                    carbs: 45,
                    fat: 8,
                    prepTime: '5 minutes',
                    difficulty: 'Easy'
                });
            }
        }
        
        if (mealType === 'lunch') {
            if (availableIngredients.includes('chicken breast')) {
                suggestions.push({
                    name: 'Grilled Chicken Salad',
                    ingredients: ['chicken breast', 'lettuce', 'tomatoes', 'cucumber'],
                    calories: 300,
                    protein: 35,
                    carbs: 10,
                    fat: 12,
                    prepTime: '15 minutes',
                    difficulty: 'Medium'
                });
            }
            if (availableIngredients.includes('quinoa')) {
                suggestions.push({
                    name: 'Quinoa Power Bowl',
                    ingredients: ['quinoa', 'broccoli', 'avocado', 'almonds'],
                    calories: 420,
                    protein: 18,
                    carbs: 35,
                    fat: 25,
                    prepTime: '20 minutes',
                    difficulty: 'Easy'
                });
            }
        }
        
        if (mealType === 'dinner') {
            if (availableIngredients.includes('salmon')) {
                suggestions.push({
                    name: 'Baked Salmon with Sweet Potato',
                    ingredients: ['salmon', 'sweet potato', 'spinach'],
                    calories: 450,
                    protein: 35,
                    carbs: 25,
                    fat: 22,
                    prepTime: '25 minutes',
                    difficulty: 'Medium'
                });
            }
            if (availableIngredients.includes('ground turkey')) {
                suggestions.push({
                    name: 'Turkey and Vegetable Stir-fry',
                    ingredients: ['ground turkey', 'broccoli', 'carrots', 'brown rice'],
                    calories: 380,
                    protein: 30,
                    carbs: 35,
                    fat: 15,
                    prepTime: '20 minutes',
                    difficulty: 'Medium'
                });
            }
        }
        
        return suggestions;
    };

    // Main meal planning component
    const MealPlanningApp = () => {
        const [currentDate, setCurrentDate] = React.useState(new Date().toISOString().split('T')[0]);
        const [mealPlan, setMealPlan] = React.useState(loadPlanningData(currentDate));
        const [pantryItems, setPantryItems] = React.useState([]);
        const [selectedMeal, setSelectedMeal] = React.useState('breakfast');
        const [suggestions, setSuggestions] = React.useState([]);

        React.useEffect(() => {
            const pantryData = loadPlanningPantryData();
            setPantryItems(pantryData.items || []);
        }, []);

        React.useEffect(() => {
            setMealPlan(loadPlanningData(currentDate));
        }, [currentDate]);

        React.useEffect(() => {
            savePlanningData(currentDate, mealPlan);
        }, [mealPlan, currentDate]);

        React.useEffect(() => {
            const newSuggestions = generateMealSuggestions(selectedMeal, pantryItems, {});
            setSuggestions(newSuggestions);
        }, [selectedMeal, pantryItems]);

        const addMealToPlan = (meal, mealType) => {
            setMealPlan(prev => ({
                ...prev,
                [mealType]: [...prev[mealType], {
                    id: Date.now() + Math.random(),
                    ...meal,
                    timestamp: new Date().toISOString()
                }]
            }));
        };

        const removeMealFromPlan = (mealType, mealId) => {
            setMealPlan(prev => ({
                ...prev,
                [mealType]: prev[mealType].filter(meal => meal.id !== mealId)
            }));
        };

        const navigateDate = (direction) => {
            const newDate = new Date(currentDate);
            newDate.setDate(newDate.getDate() + direction);
            setCurrentDate(newDate.toISOString().split('T')[0]);
        };

        return React.createElement('div', { className: 'min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-cyan-50' },
            React.createElement('div', { className: 'max-w-7xl mx-auto p-6' },
                // Header
                React.createElement('div', { className: 'bg-gradient-to-r from-blue-600 to-teal-600 rounded-3xl shadow-2xl p-8 mb-8 text-white' },
                    React.createElement('div', { className: 'text-center' },
                        React.createElement('h1', { className: 'text-4xl font-bold mb-2' }, '🍽️ Meal Planning'),
                        React.createElement('p', { className: 'text-xl opacity-90 mb-4' }, 'Plan your meals with AI suggestions'),
                        
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

                // Meal Type Selector
                React.createElement('div', { className: 'bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-8 border border-white/20' },
                    React.createElement('h3', { className: 'text-xl font-bold text-gray-800 mb-4' }, 'Select Meal Type'),
                    React.createElement('div', { className: 'grid grid-cols-2 md:grid-cols-4 gap-4' },
                        ['breakfast', 'lunch', 'dinner', 'snacks'].map(mealType => 
                            React.createElement('button', {
                                key: mealType,
                                onClick: () => setSelectedMeal(mealType),
                                className: `p-4 rounded-xl border-2 transition-all duration-200 ${
                                    selectedMeal === mealType 
                                        ? 'border-blue-500 bg-blue-50 text-blue-700' 
                                        : 'border-gray-200 bg-white hover:border-blue-300 text-gray-700'
                                }`
                            }, 
                                React.createElement('div', { className: 'text-2xl mb-2' },
                                    mealType === 'breakfast' ? '🌅' :
                                    mealType === 'lunch' ? '☀️' :
                                    mealType === 'dinner' ? '🌙' : '🍿'
                                ),
                                React.createElement('div', { className: 'font-semibold capitalize' }, mealType)
                            )
                        )
                    )
                ),

                // AI Suggestions and Current Plan
                React.createElement('div', { className: 'grid grid-cols-1 lg:grid-cols-2 gap-8' },
                    // AI Suggestions
                    React.createElement('div', { className: 'bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20' },
                        React.createElement('h3', { className: 'text-xl font-bold text-gray-800 mb-4 flex items-center' },
                            React.createElement('span', { className: 'mr-2 text-2xl' }, '🤖'),
                            `AI ${selectedMeal.charAt(0).toUpperCase() + selectedMeal.slice(1)} Suggestions`
                        ),
                        
                        suggestions.length === 0 ? 
                            React.createElement('div', { className: 'text-center py-8' },
                                React.createElement('div', { className: 'text-4xl mb-4' }, '🛒'),
                                React.createElement('h4', { className: 'text-lg font-bold text-gray-700 mb-2' }, 'No Suggestions Available'),
                                React.createElement('p', { className: 'text-gray-600' }, 'Add ingredients to your pantry to get personalized meal suggestions!')
                            ) :
                            React.createElement('div', { className: 'space-y-4' },
                                ...suggestions.map((suggestion, index) => 
                                    React.createElement('div', { 
                                        key: index,
                                        className: 'border border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200'
                                    },
                                        React.createElement('div', { className: 'flex justify-between items-start mb-3' },
                                            React.createElement('h4', { className: 'font-bold text-gray-800' }, suggestion.name),
                                            React.createElement('button', {
                                                onClick: () => addMealToPlan(suggestion, selectedMeal),
                                                className: 'px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-sm rounded-lg font-semibold'
                                            }, 'Add to Plan')
                                        ),
                                        React.createElement('div', { className: 'text-sm text-gray-600 mb-2' },
                                            `${suggestion.calories} cal • ${suggestion.protein}g protein • ${suggestion.prepTime} • ${suggestion.difficulty}`
                                        ),
                                        React.createElement('div', { className: 'text-xs text-gray-500' },
                                            `Ingredients: ${suggestion.ingredients.join(', ')}`
                                        )
                                    )
                                )
                            )
                    ),

                    // Current Meal Plan
                    React.createElement('div', { className: 'bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20' },
                        React.createElement('h3', { className: 'text-xl font-bold text-gray-800 mb-4 flex items-center' },
                            React.createElement('span', { className: 'mr-2 text-2xl' }, '📋'),
                            'Today\'s Meal Plan'
                        ),
                        
                        React.createElement('div', { className: 'space-y-4' },
                            ['breakfast', 'lunch', 'dinner', 'snacks'].map(mealType => 
                                React.createElement('div', { key: mealType, className: 'border border-gray-200 rounded-xl p-4' },
                                    React.createElement('h4', { className: 'font-bold text-gray-700 mb-3 flex items-center' },
                                        React.createElement('span', { className: 'mr-2' },
                                            mealType === 'breakfast' ? '🌅' :
                                            mealType === 'lunch' ? '☀️' :
                                            mealType === 'dinner' ? '🌙' : '🍿'
                                        ),
                                        mealType.charAt(0).toUpperCase() + mealType.slice(1)
                                    ),
                                    
                                    mealPlan[mealType].length === 0 ?
                                        React.createElement('p', { className: 'text-gray-500 text-sm' }, `No ${mealType} planned`) :
                                        React.createElement('div', { className: 'space-y-2' },
                                            ...mealPlan[mealType].map(meal => 
                                                React.createElement('div', { 
                                                    key: meal.id,
                                                    className: 'flex justify-between items-center p-2 bg-gray-50 rounded-lg'
                                                },
                                                    React.createElement('div', { className: 'flex-1' },
                                                        React.createElement('div', { className: 'font-medium text-gray-800' }, meal.name),
                                                        React.createElement('div', { className: 'text-xs text-gray-600' },
                                                            `${meal.calories} cal • ${meal.protein}g protein`
                                                        )
                                                    ),
                                                    React.createElement('button', {
                                                        onClick: () => removeMealFromPlan(mealType, meal.id),
                                                        className: 'px-2 py-1 bg-red-100 hover:bg-red-200 text-red-700 text-xs rounded font-medium'
                                                    }, 'Remove')
                                                )
                                            )
                                        )
                                )
                            )
                        )
                    )
                )
            )
        );
    };

    // Render function for the main app
    function renderMealPlanning(containerId) {
        const container = document.getElementById(containerId);
        if (container) {
            ReactDOM.render(React.createElement(MealPlanningApp), container);
        }
    }

    // Export functions with Habbt compatibility
    window.HabbtMealPlanning = {
        MealPlanningApp,
        renderMealPlanning
    };

    // Backward compatibility
    window.FuelIQMealPlanning = window.HabbtMealPlanning;
    window.renderMealPlanning = renderMealPlanning;

    console.log('✅ Habbt Meal Planning loaded - Complete rebranded version with blue-teal design');
    console.log('✅ Available as: HabbtMealPlanning, FuelIQMealPlanning');
    console.log('✅ Functions: renderMealPlanning');

})();
