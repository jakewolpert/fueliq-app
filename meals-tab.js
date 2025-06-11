// FuelIQ Meals Tab - JavaScript Module
// Add this to your existing FuelIQ app structure

// USDA API Functions
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

// Safe Storage Functions with Fallbacks
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

// In-memory fallback storage
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

// Helper Functions
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

// Food Search Component
const FoodSearch = ({ onAddFood, onClose }) => {
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
            
            const updatedRecent = [foodItem, ...recentFoods.filter(f => f.fdcId !== food.fdcId)];
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
            
            React.createElement('input', {
                type: 'text',
                placeholder: 'Search for foods...',
                value: query,
                onChange: (e) => setQuery(e.target.value),
                className: 'w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-orange-500'
            }),

            React.createElement('div', { className: 'flex-1 overflow-y-auto' },
                // Recent Foods Section
                query.length < 2 && recentFoods.length > 0 && 
                React.createElement('div', { className: 'mb-6' },
                    React.createElement('h4', { className: 'font-bold text-gray-700 mb-3' }, 'Recent Foods'),
                    React.createElement('div', { className: 'space-y-2' },
                        ...recentFoods.slice(0, 5).map(food =>
                            React.createElement('div', { 
                                key: food.fdcId,
                                className: 'flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer',
                                onClick: () => handleAddFood({ fdcId: food.fdcId, description: food.name })
                            },
                                React.createElement('div', null,
                                    React.createElement('div', { className: 'font-semibold text-gray-800' }, food.name),
                                    React.createElement('div', { className: 'text-sm text-gray-600' }, 
                                        `${Math.round(food.calories)} cal per 100g`
                                    )
                                ),
                                React.createElement('button', { className: 'bg-orange-500 text-white px-3 py-1 rounded-lg text-sm' }, 'Add')
                            )
                        )
                    )
                ),

                // Search Results
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
            )
        )
    );
};

// Food Item Component
const FoodItem = ({ food, onRemove, onUpdateServing }) => {
    const [serving, setServing] = React.useState(food.servingSize);

    const handleServingChange = (newServing) => {
        setServing(newServing);
        onUpdateServing(food.id, newServing);
    };

    const multiplier = serving / 100;

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
                min: '1'
            }),
            React.createElement('span', { className: 'text-sm text-gray-600' }, 'grams')
        ),
        React.createElement('div', { className: 'grid grid-cols-2 gap-4 text-sm' },
            React.createElement('div', null,
                React.createElement('span', { className: 'text-gray-600' }, 'Calories: '),
                React.createElement('span', { className: 'font-semibold' }, Math.round(food.calories * multiplier))
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

// Progress Bar Component
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

// Meal Section Component
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

        showSearch && React.createElement(FoodSearch, {
            onAddFood: (food) => {
                onAddFood(food);
                setShowSearch(false);
            },
            onClose: () => setShowSearch(false)
        })
    );
};

// Main Meals Component
const MealsTab = () => {
    const [currentDate, setCurrentDate] = React.useState(new Date());
    const [meals, setMeals] = React.useState(loadMealData(formatDate(currentDate)));

    // Load user goals safely from localStorage (fallback to defaults)
    const loadUserGoals = () => {
        const defaultGoals = {
            dailyCalories: 2000,
            protein: 150,
            carbs: 250,
            fat: 67
        };

        if (isLocalStorageAvailable()) {
            try {
                const data = localStorage.getItem('fueliq_user_goals');
                return data ? { ...defaultGoals, ...JSON.parse(data) } : defaultGoals;
            } catch (e) {
                console.warn('Failed to load user goals from localStorage:', e);
                const memData = memoryStorage['fueliq_user_goals'];
                return memData ? { ...defaultGoals, ...JSON.parse(memData) } : defaultGoals;
            }
        } else {
            const memData = memoryStorage['fueliq_user_goals'];
            return memData ? { ...defaultGoals, ...JSON.parse(memData) } : defaultGoals;
        }
    };

    const userGoals = loadUserGoals();
    const dailyGoals = {
        calories: userGoals.dailyCalories || 2000,
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
        // Header
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
            
            // Daily Summary
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

        // Progress Bars
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

        // Meals Grid
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

// Export for integration with your existing app
// Usage: Add this to your tab switching logic
// if (activeTab === 'meals') {
//     ReactDOM.render(React.createElement(MealsTab), document.getElementById('content'));
// }

// Or if you prefer a function to call:
const renderMealsTab = (containerId) => {
    ReactDOM.render(React.createElement(MealsTab), document.getElementById(containerId));
};

// Make available globally if needed
window.FuelIQMeals = {
    MealsTab,
    renderMealsTab
};
