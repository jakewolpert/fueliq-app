// Safe Meals Tab Restoration - Your Working Code + Safe Mounting
// This takes your existing sophisticated meals system and adds safe mounting

(function() {
    'use strict';

    console.log('🔧 Restoring your working meals system with safe mounting...');

    // Your original sophisticated food system (keeping all functionality)
    
    // USDA API Functions (your original code)
    const searchFoods = async (query) => {
        if (!query || query.length < 2) return [];
        try {
            const response = await fetch(`https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(query)}&pageSize=10&api_key=DEMO_KEY`);
            const data = await response.json();
            return data.foods || [];
        } catch (error) {
            console.error('Error searching foods:', error);
            return [];
        }
    };

    const getFoodDetails = async (fdcId) => {
        try {
            const response = await fetch(`https://api.nal.usda.gov/fdc/v1/food/${fdcId}?api_key=DEMO_KEY`);
            return await response.json();
        } catch (error) {
            console.error('Error getting food details:', error);
            return null;
        }
    };

    // Safe Storage Functions (your original code)
    const isLocalStorageAvailable = () => {
        try {
            const test = '__localStorage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    };

    const memoryStorage = {};

    const saveMealData = (date, meals) => {
        const key = `fueliq_meals_${date}`;
        const data = JSON.stringify(meals);
        
        if (isLocalStorageAvailable()) {
            try {
                localStorage.setItem(key, data);
            } catch (e) {
                console.warn('localStorage failed, using memory storage:', e);
                memoryStorage[key] = data;
            }
        } else {
            memoryStorage[key] = data;
        }
    };

    const loadMealData = (date) => {
        const key = `fueliq_meals_${date}`;
        let data = null;
        
        if (isLocalStorageAvailable()) {
            try {
                data = localStorage.getItem(key);
            } catch (e) {
                console.warn('localStorage failed, using memory storage:', e);
                data = memoryStorage[key];
            }
        } else {
            data = memoryStorage[key];
        }
        
        return data ? JSON.parse(data) : {
            breakfast: [], lunch: [], dinner: [], snacks: []
        };
    };

    const saveRecentFoods = (foods) => {
        const key = 'fueliq_recent_foods';
        const data = JSON.stringify(foods.slice(0, 20));
        
        if (isLocalStorageAvailable()) {
            try {
                localStorage.setItem(key, data);
            } catch (e) {
                console.warn('localStorage failed, using memory storage:', e);
                memoryStorage[key] = data;
            }
        } else {
            memoryStorage[key] = data;
        }
    };

    const loadRecentFoods = () => {
        const key = 'fueliq_recent_foods';
        let data = null;
        
        if (isLocalStorageAvailable()) {
            try {
                data = localStorage.getItem(key);
            } catch (e) {
                console.warn('localStorage failed, using memory storage:', e);
                data = memoryStorage[key];
            }
        } else {
            data = memoryStorage[key];
        }
        
        return data ? JSON.parse(data) : [];
    };

    // Helper Functions (your original code)
    const formatDate = (date) => {
        return date.toISOString().split('T')[0];
    };

    const calculateNutrition = (foodItems) => {
        return foodItems.reduce((totals, item) => {
            const multiplier = item.servingSize / 100;
            return {
                calories: totals.calories + (item.calories * multiplier),
                protein: totals.protein + (item.protein * multiplier),
                carbs: totals.carbs + (item.carbs * multiplier),
                fat: totals.fat + (item.fat * multiplier),
                fiber: totals.fiber + (item.fiber * multiplier)
            };
        }, { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });
    };

    const extractNutrients = (foodData) => {
        const nutrients = foodData.foodNutrients || [];
        const getNutrient = (id) => {
            const nutrient = nutrients.find(n => n.nutrient && n.nutrient.id === id);
            return nutrient ? nutrient.amount || 0 : 0;
        };

        return {
            calories: getNutrient(1008),
            protein: getNutrient(1003),
            carbs: getNutrient(1005),
            fat: getNutrient(1004),
            fiber: getNutrient(1079)
        };
    };

    // Enhanced Food Search Component (your original code)
    const EnhancedFoodSearch = ({ onAddFood, onClose }) => {
        const [activeTab, setActiveTab] = React.useState('search');
        const [query, setQuery] = React.useState('');
        const [results, setResults] = React.useState([]);
        const [loading, setLoading] = React.useState(false);
        const [recentFoods, setRecentFoods] = React.useState(loadRecentFoods());

        React.useEffect(() => {
            const searchTimeout = setTimeout(async () => {
                if (query.length >= 2) {
                    setLoading(true);
                    const foods = await searchFoods(query);                
                    setResults(foods);
                    setLoading(false);
                } else {
                    setResults([]);
                }
            }, 300);

            return () => clearTimeout(searchTimeout);
        }, [query]);

        const handleAddFood = async (food, servingSize = 100) => {
            const details = await getFoodDetails(food.fdcId);
            if (details) {
                const nutrients = extractNutrients(details);
                const foodItem = {
                    id: Date.now(),
                    fdcId: food.fdcId,
                    name: food.description,
                    servingSize: servingSize,
                    ...nutrients
                };
                
                const updatedRecent = [foodItem, ...recentFoods.filter(f => f.fdcId !== foodItem.fdcId)];
                setRecentFoods(updatedRecent);
                saveRecentFoods(updatedRecent);
                
                onAddFood(foodItem);
                onClose();
            }
        };

        return React.createElement('div', { 
            className: 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50' 
        },
            React.createElement('div', { 
                className: 'bg-white rounded-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col' 
            },
                React.createElement('div', { className: 'flex justify-between items-center mb-4' },
                    React.createElement('h3', { className: 'text-xl font-bold text-gradient' }, 'Add Food'),
                    React.createElement('button', { 
                        onClick: onClose,
                        className: 'text-gray-500 hover:text-gray-700 text-xl font-bold' 
                    }, '×')
                ),

                // Tab Navigation
                React.createElement('div', { className: 'flex gap-2 mb-4 border-b border-gray-200' },
                    React.createElement('button', {
                        onClick: () => setActiveTab('search'),
                        className: `px-4 py-2 font-semibold transition-colors ${
                            activeTab === 'search' 
                                ? 'border-b-2 border-orange-500 text-orange-600' 
                                : 'text-gray-600 hover:text-gray-800'
                        }`
                    }, '🔍 Search'),
                    React.createElement('button', {
                        onClick: () => setActiveTab('recent'),
                        className: `px-4 py-2 font-semibold transition-colors ${
                            activeTab === 'recent' 
                                ? 'border-b-2 border-orange-500 text-orange-600' 
                                : 'text-gray-600 hover:text-gray-800'
                        }`
                    }, '⏰ Recent')
                ),

                // Tab Content
                React.createElement('div', { className: 'flex-1 overflow-y-auto' },
                    
                    // Search Tab
                    activeTab === 'search' && React.createElement('div', null,
                        React.createElement('input', {
                            type: 'text',
                            placeholder: 'Search for foods...',
                            value: query,
                            onChange: (e) => setQuery(e.target.value),
                            className: 'w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-orange-500'
                        }),

                        loading && React.createElement('div', { className: 'text-center py-8' },
                            React.createElement('div', { className: 'animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto' })
                        ),

                        !loading && results.length > 0 && React.createElement('div', { className: 'space-y-2' },
                            ...results.map(food =>
                                React.createElement('div', { 
                                    key: food.fdcId,
                                    className: 'flex justify-between items-center p-3 border border-gray-200 rounded-lg hover:border-orange-300 cursor-pointer'
                                },
                                    React.createElement('div', null,
                                        React.createElement('div', { className: 'font-semibold text-gray-800' }, food.description),
                                        React.createElement('div', { className: 'text-sm text-gray-600' }, food.brandOwner || 'Generic Food')
                                    ),
                                    React.createElement('button', { 
                                        onClick: () => handleAddFood(food),
                                        className: 'bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-all' 
                                    }, 'Add')
                                )
                            )
                        ),

                        !loading && query.length >= 2 && results.length === 0 && 
                        React.createElement('div', { className: 'text-center py-8 text-gray-500' }, 'No foods found. Try a different search term.')
                    ),

                    // Recent Tab
                    activeTab === 'recent' && React.createElement('div', null,
                        recentFoods.length === 0 ? 
                            React.createElement('div', { className: 'text-center py-8 text-gray-500' },
                                React.createElement('div', { className: 'text-4xl mb-2' }, '🕐'),
                                'No recent foods yet'
                            ) :
                            React.createElement('div', { className: 'space-y-2' },
                                ...recentFoods.map(food =>
                                    React.createElement('div', { 
                                        key: food.fdcId || food.id,
                                        className: 'flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer'
                                    },
                                        React.createElement('div', null,
                                            React.createElement('div', { className: 'font-semibold text-gray-800' }, food.name),
                                            React.createElement('div', { className: 'text-sm text-gray-600' }, 
                                                `${Math.round(food.calories)} cal per 100g${food.source ? ` • ${food.source}` : ''}`
                                            )
                                        ),
                                        React.createElement('button', { 
                                            onClick: () => handleAddFood(food),
                                            className: 'bg-orange-500 text-white px-3 py-1 rounded-lg text-sm' 
                                        }, 'Add')
                                    )
                                )
                            )
                    )
                )
            )
        );
    };

    // Food Item Component (your original code)
    const FoodItem = ({ food, onRemove, onUpdateServing }) => {
        const getCalories = (food) => {
            let calories = food.calories || 
                          food.energy || 
                          food.kcal || 
                          food.energy_kcal || 
                          (food.nutrients && food.nutrients.calories) ||
                          (food.nutrients && food.nutrients.energy) ||
                          (food.nutriments && food.nutriments['energy-kcal']) ||
                          (food.nutriments && food.nutriments.energy_kcal) ||
                          0;
            
            if (calories === 0 && (food.protein || food.carbs || food.fat)) {
                const protein = food.protein || 0;
                const carbs = food.carbs || 0;
                const fat = food.fat || 0;
                calories = (protein * 4) + (carbs * 4) + (fat * 9);
            }
            
            return calories;
        };

        const [serving, setServing] = React.useState(1);
        
        const handleServingChange = (newServing) => {
            setServing(newServing);
            onUpdateServing(food.id, newServing);
        };

        const multiplier = (serving * (food.servingSize || 100)) / 100;

        return React.createElement('div', { className: 'bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow' },
            React.createElement('div', { className: 'flex justify-between items-start mb-2' },
                React.createElement('h4', { className: 'font-semibold text-gray-800 flex-1' }, food.name),
                React.createElement('button', { 
                    onClick: () => onRemove(food.id),
                    className: 'text-red-500 hover:text-red-700 ml-2' 
                }, '×')
            ),
            React.createElement('div', { className: 'flex items-center gap-4 mb-3' },
                React.createElement('input', {
                    type: 'number',
                    value: serving,
                    onChange: (e) => handleServingChange(Number(e.target.value)),
                    className: 'w-20 p-1 border border-gray-300 rounded text-sm',
                    min: '0.1',
                    step: '0.1'
                }),
                React.createElement('span', { className: 'text-sm text-gray-600' }, 'servings')
            ),
            React.createElement('div', { className: 'grid grid-cols-2 gap-4 text-sm' },
                React.createElement('div', null,
                    React.createElement('span', { className: 'text-gray-600' }, 'Calories: '),
                    React.createElement('span', { className: 'font-semibold' }, Math.round(getCalories(food) * multiplier))
                ),
                React.createElement('div', null,
                    React.createElement('span', { className: 'text-gray-600' }, 'Protein: '),
                    React.createElement('span', { className: 'font-semibold' }, `${Math.round(food.protein * multiplier)}g`)
                ),
                React.createElement('div', null,
                    React.createElement('span', { className: 'text-gray-600' }, 'Carbs: '),
                    React.createElement('span', { className: 'font-semibold' }, `${Math.round(food.carbs * multiplier)}g`)
                ),
                React.createElement('div', null,
                    React.createElement('span', { className: 'text-gray-600' }, 'Fat: '),
                    React.createElement('span', { className: 'font-semibold' }, `${Math.round(food.fat * multiplier)}g`)
                )
            )
        );
    };

    // Progress Bar Component (your original code)
    const ProgressBar = ({ label, current, goal, unit, color = 'orange' }) => {
        const percentage = goal > 0 ? Math.min((current / goal) * 100, 100) : 0;
        const colorClasses = {
            orange: 'bg-orange-500',
            red: 'bg-red-500',
            green: 'bg-green-500',
            blue: 'bg-blue-500'
        };

        return React.createElement('div', { className: 'mb-4' },
            React.createElement('div', { className: 'flex justify-between items-center mb-2' },
                React.createElement('span', { className: 'font-semibold text-gray-700' }, label),
                React.createElement('span', { className: 'text-sm text-gray-600' }, 
                    `${Math.round(current)}${unit} / ${Math.round(goal)}${unit}`
                )
            ),
            React.createElement('div', { className: 'w-full bg-gray-200 rounded-full h-3' },
                React.createElement('div', { 
                    className: `h-3 rounded-full transition-all duration-500 ${colorClasses[color]}`,
                    style: { width: `${percentage}%` }
                })
            )
        );
    };

    // Meal Section Component (your original code)
    const MealSection = ({ title, foods, onAddFood, onRemoveFood, onUpdateServing, icon }) => {
        const [showSearch, setShowSearch] = React.useState(false);
        const totalNutrition = calculateNutrition(foods);

        return React.createElement('div', { className: 'bg-white rounded-xl p-6 shadow-lg border border-gray-100' },
            React.createElement('div', { className: 'flex justify-between items-center mb-4' },
                React.createElement('div', { className: 'flex items-center gap-3' },
                    React.createElement('span', { className: 'text-2xl' }, icon),
                    React.createElement('h3', { className: 'text-xl font-bold text-gray-800' }, title),
                    foods.length > 0 && React.createElement('span', { className: 'bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-sm font-semibold' }, 
                        `${Math.round(totalNutrition.calories)} cal`
                    )
                ),
                React.createElement('button', { 
                    onClick: () => setShowSearch(true),
                    className: 'bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-all font-semibold' 
                }, '+ Add Food')
            ),

            foods.length === 0 ? 
                React.createElement('div', { className: 'text-center py-8 text-gray-400' },
                    React.createElement('p', null, 'No foods logged yet'),
                    React.createElement('p', { className: 'text-sm' }, 'Tap "Add Food" to get started')
                ) :
                React.createElement('div', { className: 'space-y-3' },
                    ...foods.map(food =>
                        React.createElement(FoodItem, {
                            key: food.id,
                            food: food,
                            onRemove: onRemoveFood,
                            onUpdateServing: onUpdateServing
                        })
                    )
                ),

            showSearch && React.createElement(EnhancedFoodSearch, {
                onAddFood: (food) => {
                    onAddFood(food);
                    setShowSearch(false);
                },
                onClose: () => setShowSearch(false)
            })
        );
    };

    // Main Meals Component (your original code with success message)
    const SafeMealsTab = () => {
        const [currentDate, setCurrentDate] = React.useState(new Date());
        const [meals, setMeals] = React.useState(loadMealData(formatDate(currentDate)));

        const loadUserGoals = () => {
            const defaultGoals = {
                calories: 2000,
                protein: 150,
                carbs: 250,
                fat: 67
            };

            if (isLocalStorageAvailable()) {
                try {
                    let data = localStorage.getItem('fueliq_user_goals') || localStorage.getItem('habbt_profile_data') || localStorage.getItem('fueliq_profile_data');
                    
                    if (data) {
                        const parsed = JSON.parse(data);
                        
                        const goals = {
                            calories: parsed.calories || parsed.dailyCalories || (parsed.goals && parsed.goals.calories) || defaultGoals.calories,
                            protein: parsed.protein || (parsed.goals && parsed.goals.protein) || defaultGoals.protein,
                            carbs: parsed.carbs || parsed.carbohydrates || (parsed.goals && parsed.goals.carbs) || defaultGoals.carbs,
                            fat: parsed.fat || (parsed.goals && parsed.goals.fat) || defaultGoals.fat
                        };
                        
                        console.log('✅ Loaded user goals:', goals);
                        return goals;
                    }
                    
                    return defaultGoals;
                } catch (e) {
                    console.warn('Failed to load user goals from localStorage:', e);
                    return defaultGoals;
                }
            } else {
                return defaultGoals;
            }
        };

        const userGoals = loadUserGoals();
        const dailyGoals = {
            calories: userGoals.calories || 2000,
            protein: userGoals.protein || 150,
            carbs: userGoals.carbs || 250,
            fat: userGoals.fat || 67
        };

        React.useEffect(() => {
            const dateStr = formatDate(currentDate);
            setMeals(loadMealData(dateStr));
        }, [currentDate]);

        React.useEffect(() => {
            saveMealData(formatDate(currentDate), meals);
        }, [meals, currentDate]);

        const addFoodToMeal = (mealType, food) => {
            setMeals(prev => ({
                ...prev,
                [mealType]: [...prev[mealType], food]
            }));
        };

        const removeFoodFromMeal = (mealType, foodId) => {
            setMeals(prev => ({
                ...prev,
                [mealType]: prev[mealType].filter(food => food.id !== foodId)
            }));
        };

        const updateFoodServing = (mealType, foodId, newServing) => {
            setMeals(prev => ({
                ...prev,
                [mealType]: prev[mealType].map(food => 
                    food.id === foodId ? { ...food, servingSize: newServing } : food
                )
            }));
        };

        const allFoods = [...meals.breakfast, ...meals.lunch, ...meals.dinner, ...meals.snacks];
        const dailyTotals = calculateNutrition(allFoods);

        const changeDate = (days) => {
            const newDate = new Date(currentDate);
            newDate.setDate(newDate.getDate() + days);
            setCurrentDate(newDate);
        };

        const isToday = formatDate(currentDate) === formatDate(new Date());

        return React.createElement('div', { className: 'max-w-6xl mx-auto p-6' },
            // Success Alert
            React.createElement('div', { className: 'bg-green-50 border border-green-200 rounded-xl p-4 mb-6' },
                React.createElement('div', { className: 'flex items-center' },
                    React.createElement('span', { className: 'text-2xl mr-3' }, '✅'),
                    React.createElement('div', null,
                        React.createElement('h3', { className: 'text-lg font-bold text-green-800' }, 'Meals Tab Successfully Restored!'),
                        React.createElement('p', { className: 'text-green-700' }, 'Your sophisticated nutrition tracking system is now working with safe mounting.')
                    )
                )
            ),

            // Header (your original design)
            React.createElement('div', { className: 'bg-orange-500 rounded-xl p-6 mb-6 text-white' },
                React.createElement('div', { className: 'flex justify-between items-center mb-4' },
                    React.createElement('h1', { className: 'text-3xl font-bold' }, 'Daily Nutrition'),
                    React.createElement('div', { className: 'flex items-center gap-4' },
                        React.createElement('button', { 
                            onClick: () => changeDate(-1),
                            className: 'bg-white/20 hover:bg-white/30 rounded-lg p-2 transition-colors' 
                        }, '‹'),
                        React.createElement('span', { className: 'font-semibold text-lg' }, 
                            isToday ? 'Today' : currentDate.toLocaleDateString()
                        ),
                        React.createElement('button', { 
                            onClick: () => changeDate(1),
                            className: 'bg-white/20 hover:bg-white/30 rounded-lg p-2 transition-colors' 
                        }, '›')
                    )
                ),
                
                // Daily Summary (your original design)
                React.createElement('div', { className: 'grid grid-cols-2 md:grid-cols-4 gap-4' },
                    React.createElement('div', { className: 'text-center' },
                        React.createElement('div', { className: 'text-2xl font-bold' }, Math.round(dailyTotals.calories)),
                        React.createElement('div', { className: 'text-sm opacity-90' }, `/ ${dailyGoals.calories} calories`)
                    ),
                    React.createElement('div', { className: 'text-center' },
                        React.createElement('div', { className: 'text-2xl font-bold' }, `${Math.round(dailyTotals.protein)}g`),
                        React.createElement('div', { className: 'text-sm opacity-90' }, `/ ${dailyGoals.protein}g protein`)
                    ),
                    React.createElement('div', { className: 'text-center' },
                        React.createElement('div', { className: 'text-2xl font-bold' }, `${Math.round(dailyTotals.carbs)}g`),
                        React.createElement('div', { className: 'text-sm opacity-90' }, `/ ${dailyGoals.carbs}g carbs`)
                    ),
                    React.createElement('div', { className: 'text-center' },
                        React.createElement('div', { className: 'text-2xl font-bold' }, `${Math.round(dailyTotals.fat)}g`),
                        React.createElement('div', { className: 'text-sm opacity-90' }, `/ ${dailyGoals.fat}g fat`)
                    )
                )
            ),

            // Progress Bars (your original design)
            React.createElement('div', { className: 'bg-white rounded-xl p-6 mb-6 shadow-lg' },
                React.createElement('h2', { className: 'text-xl font-bold text-gray-800 mb-4' }, 'Daily Progress'),
                React.createElement(ProgressBar, { 
                    label: 'Calories', 
                    current: dailyTotals.calories, 
                    goal: dailyGoals.calories, 
                    unit: '', 
                    color: 'orange' 
                }),
                React.createElement(ProgressBar, { 
                    label: 'Protein', 
                    current: dailyTotals.protein, 
                    goal: dailyGoals.protein, 
                    unit: 'g', 
                    color: 'red' 
                }),
                React.createElement(ProgressBar, { 
                    label: 'Carbohydrates', 
                    current: dailyTotals.carbs, 
                    goal: dailyGoals.carbs, 
                    unit: 'g', 
                    color: 'blue' 
                }),
                React.createElement(ProgressBar, { 
                    label: 'Fat', 
                    current: dailyTotals.fat, 
                    goal: dailyGoals.fat, 
                    unit: 'g', 
                    color: 'green' 
                })
            ),

            // Meals Grid (your original design)
            React.createElement('div', { className: 'grid md:grid-cols-2 gap-6' },
                React.createElement(MealSection, {
                    title: 'Breakfast',
                    icon: '🍳',
                    foods: meals.breakfast,
                    onAddFood: (food) => addFoodToMeal('breakfast', food),
                    onRemoveFood: (foodId) => removeFoodFromMeal('breakfast', foodId),
                    onUpdateServing: (foodId, serving) => updateFoodServing('breakfast', foodId, serving)
                }),
                React.createElement(MealSection, {
                    title: 'Lunch',
                    icon: '🥪',
                    foods: meals.lunch,
                    onAddFood: (food) => addFoodToMeal('lunch', food),
                    onRemoveFood: (foodId) => removeFoodFromMeal('lunch', foodId),
                    onUpdateServing: (foodId, serving) => updateFoodServing('lunch', foodId, serving)
                }),
                React.createElement(MealSection, {
                    title: 'Dinner',
                    icon: '🍽️',
                    foods: meals.dinner,
                    onAddFood: (food) => addFoodToMeal('dinner', food),
                    onRemoveFood: (foodId) => removeFoodFromMeal('dinner', foodId),
                    onUpdateServing: (foodId, serving) => updateFoodServing('dinner', foodId, serving)
                }),
                React.createElement(MealSection, {
                    title: 'Snacks',
                    icon: '🍎',
                    foods: meals.snacks,
                    onAddFood: (food) => addFoodToMeal('snacks', food),
                    onRemoveFood: (foodId) => removeFoodFromMeal('snacks', foodId),
                    onUpdateServing: (foodId, serving) => updateFoodServing('snacks', foodId, serving)
                })
            )
        );
    };

    // Safe rendering system that prevents React conflicts
    let safeRenderingActive = false;
    let contentVerificationId = null;

    const safeRenderMealsTab = (containerId = 'meals-container') => {
        console.log('🔧 Safe rendering meals tab...');
        
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`❌ Container ${containerId} not found`);
            return false;
        }

        try {
            // Clear any existing content and create verification ID
            container.innerHTML = '';
            contentVerificationId = `safe-meals-${Date.now()}`;
            
            // Create wrapper with verification
            const wrapper = document.createElement('div');
            wrapper.id = contentVerificationId;
            wrapper.className = 'safe-meals-wrapper';
            container.appendChild(wrapper);

            // Render React component to wrapper
            ReactDOM.render(React.createElement(SafeMealsTab), wrapper);
            
            safeRenderingActive = true;
            console.log('✅ Safe meals tab rendered successfully');
            
            // Set up monitoring to re-render if overridden
            startSafeMonitoring(containerId);
            
            return true;
        } catch (error) {
            console.error('❌ Error in safe rendering:', error);
            container.innerHTML = `
                <div class="p-8 text-center">
                    <div class="text-6xl mb-4">⚠️</div>
                    <h3 class="text-xl font-bold text-red-600 mb-2">Rendering Error</h3>
                    <p class="text-gray-600 mb-4">Unable to load the meals tab. Please refresh the page.</p>
                    <button onclick="location.reload()" class="px-4 py-2 bg-red-500 text-white rounded-lg">
                        🔄 Refresh Page
                    </button>
                </div>
            `;
            return false;
        }
    };

    // Monitoring system to detect and recover from overrides
    const startSafeMonitoring = (containerId) => {
        console.log('🛡️ Starting safe monitoring...');

        // Check every 2 seconds
        const monitoringInterval = setInterval(() => {
            const container = document.getElementById(containerId);
            const ourContent = document.getElementById(contentVerificationId);
            
            if (container && !ourContent && safeRenderingActive) {
                console.log('🔄 Content was overridden, re-rendering...');
                safeRenderMealsTab(containerId);
            }
        }, 2000);

        // Also use MutationObserver for immediate detection
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    const container = document.getElementById(containerId);
                    const ourContent = document.getElementById(contentVerificationId);
                    
                    if (container && !ourContent && safeRenderingActive) {
                        console.log('🚨 Override detected by observer, re-rendering...');
                        setTimeout(() => safeRenderMealsTab(containerId), 100);
                    }
                }
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });

        // Store references for cleanup
        window.safeMealsCleanup = () => {
            clearInterval(monitoringInterval);
            observer.disconnect();
            safeRenderingActive = false;
        };
    };

    // Override the problematic functions
    const originalTryRenderMeals = window.tryRenderMeals;
    window.tryRenderMeals = safeRenderMealsTab;
    window.renderMeals = safeRenderMealsTab;
    window.renderMealsTab = safeRenderMealsTab;

    // Export your original system with safe mounting
    window.FuelIQMeals = {
        SafeMealsTab,
        renderMealsTab: safeRenderMealsTab,
        cleanup: () => {
            if (window.safeMealsCleanup) {
                window.safeMealsCleanup();
            }
        }
    };

    // Also export as Habbt for compatibility
    window.HabbtMeals = window.FuelIQMeals;

    console.log('✅ Your sophisticated meals system has been safely restored!');
    console.log('🎯 All original functionality preserved with React conflict protection');

})();
