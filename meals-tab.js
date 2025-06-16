// FuelIQ Meals Tab - Complete JavaScript Module
// Enhanced with Barcode Scanner and AI Suggestions

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

// Barcode Lookup Functions
const lookupBarcode = async (upc) => {
    try {
        // Try OpenFoodFacts first (free, good coverage)
        const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${upc}.json`);
        const data = await response.json();
        
        if (data.product) {
            const product = data.product;
            const nutriments = product.nutriments || {};
            
            return {
                name: product.product_name || product.product_name_en || 'Unknown Product',
                brand: product.brands || '',
                upc: product.code || '',
                calories: nutriments['energy-kcal_100g'] || nutriments['energy-kcal'] || 0,
                protein: nutriments.proteins_100g || nutriments.proteins || 0,
                carbs: nutriments.carbohydrates_100g || nutriments.carbohydrates || 0,
                fat: nutriments.fat_100g || nutriments.fat || 0,
                fiber: nutriments.fiber_100g || nutriments.fiber || 0,
                sodium: nutriments.sodium_100g || nutriments.sodium || 0,
                sugars: nutriments.sugars_100g || nutriments.sugars || 0,
                image: product.image_url || '',
                servingSize: 100,
                source: 'OpenFoodFacts'
            };
        }
        
        return null;
    } catch (error) {
        console.error('Barcode lookup failed:', error);
        return null;
    }
};

// AI Suggestions Component
const AISuggestions = ({ currentMeals, userGoals, currentDate }) => {
    const [suggestions, setSuggestions] = React.useState([]);
    const [isVisible, setIsVisible] = React.useState(true);

    React.useEffect(() => {
        generateAISuggestions();
    }, [currentMeals, currentDate]);

    const generateAISuggestions = () => {
        const allFoods = [...currentMeals.breakfast, ...currentMeals.lunch, ...currentMeals.dinner, ...currentMeals.snacks];
        const currentTotals = calculateNutrition(allFoods);
        const timeOfDay = new Date().getHours();
        const isToday = formatDate(new Date()) === formatDate(currentDate);
        
        const newSuggestions = [];

        // Real-time calorie guidance
        const remainingCalories = userGoals.calories - currentTotals.calories;
        const remainingMeals = getRemainingMeals(currentMeals, timeOfDay);
        
        if (isToday && remainingCalories > 0 && remainingMeals.length > 0) {
            const caloriesPerMeal = Math.round(remainingCalories / remainingMeals.length);
            newSuggestions.push({
                type: 'calorie-guidance',
                icon: '🎯',
                title: 'Calorie Distribution',
                message: `You have ${remainingCalories} calories left for ${remainingMeals.join(' & ')}. Aim for ~${caloriesPerMeal} calories per meal.`,
                priority: 'high',
                action: 'plan-remaining'
            });
        }

        // Macro imbalance warnings
        const proteinPercentage = (currentTotals.protein * 4) / currentTotals.calories;
        if (currentTotals.calories > 500 && proteinPercentage < 0.15) {
            newSuggestions.push({
                type: 'macro-warning',
                icon: '🥩',
                title: 'Low Protein Alert',
                message: `Only ${Math.round(proteinPercentage * 100)}% of calories from protein. Add lean protein like chicken, fish, or Greek yogurt.`,
                priority: 'medium',
                action: 'suggest-protein'
            });
        }

        // Fat intake analysis
        const fatPercentage = (currentTotals.fat * 9) / currentTotals.calories;
        if (currentTotals.calories > 500 && fatPercentage > 0.4) {
            newSuggestions.push({
                type: 'macro-warning',
                icon: '🥑',
                title: 'High Fat Intake',
                message: `${Math.round(fatPercentage * 100)}% calories from fat. Consider lean proteins and vegetables for remaining meals.`,
                priority: 'medium',
                action: 'suggest-lowfat'
            });
        }

        // Historical pattern analysis
        const historicalSuggestions = analyzeRecentPatterns();
        newSuggestions.push(...historicalSuggestions);

        // Time-based suggestions
        if (isToday) {
            const timeSuggestions = getTimeBasedSuggestions(timeOfDay, currentMeals);
            newSuggestions.push(...timeSuggestions);
        }

        // Meal completion reminders
        const completionSuggestions = getMealCompletionSuggestions(currentMeals, timeOfDay, isToday);
        newSuggestions.push(...completionSuggestions);

        setSuggestions(newSuggestions.slice(0, 3)); // Limit to top 3 suggestions
    };

    const getRemainingMeals = (meals, hour) => {
        const remaining = [];
        if (meals.breakfast.length === 0 && hour < 11) remaining.push('breakfast');
        if (meals.lunch.length === 0 && hour < 16) remaining.push('lunch'); 
        if (meals.dinner.length === 0 && hour < 22) remaining.push('dinner');
        return remaining;
    };

    const analyzeRecentPatterns = () => {
        const suggestions = [];
        const last3Days = [];
        
        // Get last 3 days of data
        for (let i = 1; i <= 3; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = formatDate(date);
            const dayMeals = loadMealData(dateStr);
            const dayFoods = [...dayMeals.breakfast, ...dayMeals.lunch, ...dayMeals.dinner, ...dayMeals.snacks];
            if (dayFoods.length > 0) {
                last3Days.push(calculateNutrition(dayFoods));
            }
        }

        if (last3Days.length >= 2) {
            const avgProtein = last3Days.reduce((sum, day) => sum + day.protein, 0) / last3Days.length;
            const avgFat = last3Days.reduce((sum, day) => sum + day.fat, 0) / last3Days.length;
            const avgCalories = last3Days.reduce((sum, day) => sum + day.calories, 0) / last3Days.length;

            // Protein trend analysis
            if (avgProtein < userGoals.protein * 0.8) {
                suggestions.push({
                    type: 'historical-pattern',
                    icon: '📊',
                    title: 'Protein Pattern Alert',
                    message: `You've averaged ${Math.round(avgProtein)}g protein vs ${userGoals.protein}g goal over 3 days. Focus on protein-rich foods today.`,
                    priority: 'medium',
                    action: 'boost-protein'
                });
            }

            // Fat trend analysis  
            if (avgFat > userGoals.fat * 1.2) {
                suggestions.push({
                    type: 'historical-pattern',
                    icon: '⚖️',
                    title: 'Fat Intake Pattern',
                    message: `High fat intake lately (avg ${Math.round(avgFat)}g vs ${userGoals.fat}g goal). Try lean proteins and steamed vegetables.`,
                    priority: 'medium',
                    action: 'reduce-fat'
                });
            }

            // Calorie trend analysis
            if (avgCalories < userGoals.calories * 0.8) {
                suggestions.push({
                    type: 'historical-pattern',
                    icon: '⚠️',
                    title: 'Low Calorie Pattern',
                    message: `You've been under-eating (avg ${Math.round(avgCalories)} vs ${userGoals.calories} calories). This can slow metabolism.`,
                    priority: 'high',
                    action: 'increase-calories'
                });
            }
        }

        return suggestions;
    };

    const getTimeBasedSuggestions = (hour, meals) => {
        const suggestions = [];
        
        // Morning suggestions (6-11 AM)
        if (hour >= 6 && hour <= 11 && meals.breakfast.length === 0) {
            suggestions.push({
                type: 'time-based',
                icon: '🌅',
                title: 'Good Morning!',
                message: 'Starting your day with protein helps stabilize blood sugar and energy levels. Try eggs, Greek yogurt, or protein oats.',
                priority: 'low',
                action: 'suggest-breakfast'
            });
        }

        // Afternoon suggestions (12-5 PM)
        if (hour >= 12 && hour <= 17 && meals.lunch.length === 0) {
            suggestions.push({
                type: 'time-based', 
                icon: '☀️',
                title: 'Lunch Time Reminder',
                message: 'Your body needs fuel for the afternoon. A balanced lunch with protein and complex carbs will maintain your energy.',
                priority: 'medium',
                action: 'suggest-lunch'
            });
        }

        // Evening suggestions (6-9 PM)
        if (hour >= 18 && hour <= 21 && meals.dinner.length === 0) {
            const remainingCals = userGoals.calories - calculateNutrition([...meals.breakfast, ...meals.lunch, ...meals.snacks]).calories;
            suggestions.push({
                type: 'time-based',
                icon: '🌆', 
                title: 'Dinner Planning',
                message: `You have ${Math.round(remainingCals)} calories for dinner. Consider lean protein with vegetables for better sleep quality.`,
                priority: 'medium',
                action: 'suggest-dinner'
            });
        }

        return suggestions;
    };

    const getMealCompletionSuggestions = (meals, hour, isToday) => {
        const suggestions = [];
        
        if (!isToday) return suggestions;

        // Check for missed meals
        if (hour > 10 && meals.breakfast.length === 0) {
            suggestions.push({
                type: 'completion',
                icon: '⏰',
                title: 'Breakfast Missed',
                message: "It's getting late for breakfast. Even a quick protein shake can jumpstart your metabolism.",
                priority: 'low',
                action: 'quick-breakfast'
            });
        }

        if (hour > 14 && meals.lunch.length === 0) {
            suggestions.push({
                type: 'completion',
                icon: '🚨',
                title: 'Lunch Alert',
                message: "You haven't had lunch yet. Your energy and focus may be declining. Quick options: salad with protein, wrap, or leftovers.",
                priority: 'high',
                action: 'urgent-lunch'
            });
        }

        return suggestions;
    };

    const handleSuggestionAction = (action) => {
        // These would trigger specific food suggestions or quick-add options
        switch (action) {
            case 'suggest-protein':
                console.log('Suggesting protein foods...');
                break;
            case 'suggest-lowfat':
                console.log('Suggesting low-fat options...');
                break;
            case 'plan-remaining':
                console.log('Planning remaining meals...');
                break;
            default:
                console.log('Action:', action);
        }
    };

    if (!isVisible || suggestions.length === 0) {
        return null;
    }

    return React.createElement('div', { className: 'bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 mb-6 border border-purple-200' },
        React.createElement('div', { className: 'flex justify-between items-center mb-3' },
            React.createElement('h3', { className: 'text-lg font-bold text-purple-800 flex items-center gap-2' },
                React.createElement('span', { className: 'text-xl' }, '🤖'),
                'AI Nutrition Coach'
            ),
            React.createElement('button', {
                onClick: () => setIsVisible(false),
                className: 'text-purple-600 hover:text-purple-800 text-sm'
            }, '✕')
        ),

        React.createElement('div', { className: 'space-y-3' },
            ...suggestions.map((suggestion, index) =>
                React.createElement('div', {
                    key: index,
                    className: `p-3 rounded-lg border-l-4 ${
                        suggestion.priority === 'high' ? 'border-red-400 bg-red-50' :
                        suggestion.priority === 'medium' ? 'border-yellow-400 bg-yellow-50' :
                        'border-blue-400 bg-blue-50'
                    }`
                },
                    React.createElement('div', { className: 'flex items-start justify-between' },
                        React.createElement('div', { className: 'flex-1' },
                            React.createElement('div', { className: 'flex items-center gap-2 mb-1' },
                                React.createElement('span', { className: 'text-lg' }, suggestion.icon),
                                React.createElement('h4', { 
                                    className: `font-semibold ${
                                        suggestion.priority === 'high' ? 'text-red-700' :
                                        suggestion.priority === 'medium' ? 'text-yellow-700' :
                                        'text-blue-700'
                                    }`
                                }, suggestion.title)
                            ),
                            React.createElement('p', { 
                                className: `text-sm ${
                                    suggestion.priority === 'high' ? 'text-red-600' :
                                    suggestion.priority === 'medium' ? 'text-yellow-600' :
                                    'text-blue-600'
                                }`
                            }, suggestion.message)
                        ),
                        suggestion.action && React.createElement('button', {
                            onClick: () => handleSuggestionAction(suggestion.action),
                            className: `ml-3 px-3 py-1 text-xs font-semibold rounded-full ${
                                suggestion.priority === 'high' ? 'bg-red-100 text-red-700 hover:bg-red-200' :
                                suggestion.priority === 'medium' ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' :
                                'bg-blue-100 text-blue-700 hover:bg-blue-200'
                            }`
                        }, 'Help')
                    )
                )
            )
        )
    );
};

// Barcode Scanner Component
const BarcodeScanner = ({ onBarcodeFound, onClose }) => {
    const [manualUPC, setManualUPC] = React.useState('');
    const [lookupLoading, setLookupLoading] = React.useState(false);
    const [lastError, setLastError] = React.useState('');

    const handleBarcodeDetected = async (upc) => {
        if (!upc) return;
        
        setLookupLoading(true);
        setLastError('');
        
        try {
            const productData = await lookupBarcode(upc);
            if (productData) {
                // Add unique ID and format for meals system
                const foodItem = {
                    id: Date.now(),
                    fdcId: productData.upc, // Use UPC as ID
                    name: `${productData.brand ? productData.brand + ' ' : ''}${productData.name}`,
                    servingSize: productData.servingSize || 100,
                    calories: productData.calories || 0,
                    protein: productData.protein || 0,
                    carbs: productData.carbs || 0,
                    fat: productData.fat || 0,
                    fiber: productData.fiber || 0,
                    source: productData.source,
                    upc: productData.upc,
                    image: productData.image
                };
                
                onBarcodeFound(foodItem);
            } else {
                setLastError('Product not found in database. Try manual search.');
            }
        } catch (error) {
            console.error('Barcode lookup error:', error);
            setLastError('Failed to lookup product. Try manual search.');
        } finally {
            setLookupLoading(false);
        }
    };

    const handleManualLookup = async () => {
        if (!manualUPC || manualUPC.length < 8) {
            setLastError('Please enter a valid UPC/barcode');
            return;
        }
        
        await handleBarcodeDetected(manualUPC);
    };

    return React.createElement('div', { 
        className: 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50' 
    },
        React.createElement('div', { 
            className: 'bg-white rounded-xl w-full max-w-md overflow-hidden' 
        },
            // Header
            React.createElement('div', { className: 'bg-gradient-to-r from-orange-500 to-red-500 text-white p-4' },
                React.createElement('div', { className: 'flex justify-between items-center' },
                    React.createElement('h3', { className: 'text-xl font-bold' }, '📱 Barcode Scanner'),
                    React.createElement('button', { 
                        onClick: onClose,
                        className: 'text-white hover:text-gray-200 text-xl font-bold' 
                    }, '×')
                )
            ),

            // Content
            React.createElement('div', { className: 'p-4 space-y-4' },
                // Manual Entry Section
                React.createElement('div', { className: 'space-y-3' },
                    React.createElement('h4', { className: 'font-semibold text-gray-800' }, 'Enter Barcode'),
                    React.createElement('input', {
                        type: 'text',
                        placeholder: 'Enter UPC/barcode manually...',
                        value: manualUPC,
                        onChange: (e) => setManualUPC(e.target.value),
                        className: 'w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500'
                    }),
                    React.createElement('button', {
                        onClick: handleManualLookup,
                        disabled: lookupLoading || !manualUPC,
                        className: 'w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2'
                    },
                        lookupLoading ? 
                            React.createElement('div', { className: 'animate-spin rounded-full h-4 w-4 border-b-2 border-white' }) :
                            React.createElement('span', null, '🔍'),
                        lookupLoading ? 'Looking up...' : 'Lookup Product'
                    )
                ),

                // Error Display
                lastError && React.createElement('div', { 
                    className: 'bg-red-50 border border-red-200 rounded-lg p-3' 
                },
                    React.createElement('p', { className: 'text-red-700 text-sm' }, lastError)
                ),

                // Instructions
                React.createElement('div', { className: 'bg-blue-50 border border-blue-200 rounded-lg p-3' },
                    React.createElement('h5', { className: 'font-semibold text-blue-800 mb-2' }, '💡 Tips:'),
                    React.createElement('ul', { className: 'text-sm text-blue-700 space-y-1' },
                        React.createElement('li', null, '• Find barcode on food packaging'),
                        React.createElement('li', null, '• Type or paste the numbers here'),
                        React.createElement('li', null, '• Most food products have UPC codes'),
                        React.createElement('li', null, '• If not found, try manual search instead')
                    )
                )
            )
        )
    );
};

// Enhanced Food Search Component
const EnhancedFoodSearch = ({ onAddFood, onClose }) => {
    const [activeTab, setActiveTab] = React.useState('search');
    const [query, setQuery] = React.useState('');
    const [results, setResults] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [recentFoods, setRecentFoods] = React.useState(loadRecentFoods());
    const [showBarcodeScanner, setShowBarcodeScanner] = React.useState(false);

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
        // If it's a barcode scanned item, use it directly
        if (food.upc) {
            const updatedRecent = [food, ...recentFoods.filter(f => f.fdcId !== food.fdcId)];
            setRecentFoods(updatedRecent);
            saveRecentFoods(updatedRecent);
            onAddFood(food);
            onClose();
            return;
        }

        // Otherwise, use existing USDA lookup logic
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

    const handleBarcodeFound = (foodItem) => {
        setShowBarcodeScanner(false);
        handleAddFood(foodItem);
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
                    onClick: () => setActiveTab('barcode'),
                    className: `px-4 py-2 font-semibold transition-colors ${
                        activeTab === 'barcode' 
                            ? 'border-b-2 border-orange-500 text-orange-600' 
                            : 'text-gray-600 hover:text-gray-800'
                    }`
                }, '📱 Barcode'),
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

                // Barcode Tab
                activeTab === 'barcode' && React.createElement('div', { className: 'space-y-4' },
                    React.createElement('div', { className: 'text-center py-8' },
                        React.createElement('div', { className: 'text-6xl mb-4' }, '📱'),
                        React.createElement('h4', { className: 'text-xl font-bold text-gray-800 mb-2' }, 'Barcode Scanner'),
                        React.createElement('p', { className: 'text-gray-600 mb-6' }, 
                            'Quickly add foods by scanning their barcode'
                        ),
                        React.createElement('button', {
                            onClick: () => setShowBarcodeScanner(true),
                            className: 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg transform hover:scale-105 transition-all'
                        }, '📷 Open Scanner')
                    )
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
            ),

            // Barcode Scanner Modal
            showBarcodeScanner && React.createElement(BarcodeScanner, {
                onBarcodeFound: handleBarcodeFound,
                onClose: () => setShowBarcodeScanner(false)
            })
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

        showSearch && React.createElement(EnhancedFoodSearch, {
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

        // AI Suggestions
        React.createElement(AISuggestions, {
            currentMeals: meals,
            userGoals: dailyGoals,
            currentDate: currentDate
        }),

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

// Render function for integration
const renderMealsTab = (containerId) => {
    ReactDOM.render(React.createElement(MealsTab), document.getElementById(containerId));
};

// Export for integration with your existing app
window.FuelIQMeals = {
    MealsTab,
    renderMealsTab,
    cleanup: () => {} // Add cleanup function for integration
};

console.log('✅ Enhanced FuelIQ Meals tab loaded with barcode scanner and AI suggestions');
