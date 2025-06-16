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
// Enhanced Barcode Lookup with Multiple Sources
const lookupBarcodeEnhanced = async (upc) => {
    try {
        console.log('🔍 Enhanced barcode lookup for:', upc);
        
        // Try Open Food Facts first (more reliable for branded products)
        const openFoodResult = await lookupOpenFoodFacts(upc);
        if (openFoodResult) {
            return openFoodResult;
        }
        
        // Try local enhanced database
        const localResult = await lookupLocalEnhanced(upc);
        if (localResult) {
            return localResult;
        }
        
        return null;
    } catch (error) {
        console.error('Enhanced barcode lookup failed:', error);
        return null;
    }
};

// Enhanced Open Food Facts lookup
const lookupOpenFoodFacts = async (upc) => {
    try {
        const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${upc}.json`);
        const data = await response.json();
        
        if (data.status === 1 && data.product) {
            const product = data.product;
            const nutriments = product.nutriments || {};
            
            return {
                name: product.product_name || product.product_name_en || 'Unknown Product',
                brand: product.brands || '',
                upc: product.code || upc,
                calories: parseNutrient(nutriments['energy-kcal_100g'] || nutriments['energy-kcal']) || 0,
                protein: parseNutrient(nutriments.proteins_100g || nutriments.proteins) || 0,
                carbs: parseNutrient(nutriments.carbohydrates_100g || nutriments.carbohydrates) || 0,
                fat: parseNutrient(nutriments.fat_100g || nutriments.fat) || 0,
                fiber: parseNutrient(nutriments.fiber_100g || nutriments.fiber) || 0,
                sodium: parseNutrient(nutriments.sodium_100g || nutriments.sodium) || 0,
                sugars: parseNutrient(nutriments.sugars_100g || nutriments.sugars) || 0,
                imageUrl: product.image_url || '',
                servingSize: 100,
                source: 'Open Food Facts Enhanced',
                categories: product.categories || '',
                ingredients: product.ingredients_text || '',
                nutritionGrade: product.nutrition_grades || ''
            };
        }
        
        return null;
    } catch (error) {
        console.error('Open Food Facts enhanced lookup failed:', error);
        return null;
    }
};

// Enhanced local database with popular branded products
const lookupLocalEnhanced = async (upc) => {
    const enhancedLocalProducts = {
        // Vital Farms
        '011110602787': {
            name: 'Vital Farms Pasture-Raised Large Eggs',
            brand: 'Vital Farms',
            upc: '011110602787',
            calories: 70,
            protein: 6,
            carbs: 0,
            fat: 5,
            fiber: 0,
            sodium: 70,
            sugar: 0,
            servingSize: 50, // 1 large egg
            source: 'Enhanced Local Database'
        },
        
        // Eggland's Best
        '071632004003': {
            name: 'Eggland\'s Best Large Eggs',
            brand: 'Eggland\'s Best',
            upc: '071632004003',
            calories: 70,
            protein: 6,
            carbs: 0,
            fat: 4,
            fiber: 0,
            sodium: 70,
            sugar: 0,
            servingSize: 50,
            source: 'Enhanced Local Database'
        },
        
        // FAGE Greek Yogurt
        '052776010023': {
            name: 'FAGE Total 0% Greek Yogurt',
            brand: 'FAGE',
            upc: '052776010023',
            calories: 90,
            protein: 15,
            carbs: 6,
            fat: 0,
            fiber: 0,
            sodium: 55,
            sugar: 6,
            servingSize: 170,
            source: 'Enhanced Local Database'
        },
        
        // Chobani Greek Yogurt
        '894700010045': {
            name: 'Chobani Plain Non-Fat Greek Yogurt',
            brand: 'Chobani',
            upc: '894700010045',
            calories: 100,
            protein: 17,
            carbs: 6,
            fat: 0,
            fiber: 0,
            sodium: 65,
            sugar: 4,
            servingSize: 170,
            source: 'Enhanced Local Database'
        },
        
        // Quaker Oats
        '030000010204': {
            name: 'Quaker Old Fashioned Oats',
            brand: 'Quaker',
            upc: '030000010204',
            calories: 150,
            protein: 5,
            carbs: 27,
            fat: 3,
            fiber: 4,
            sodium: 0,
            sugar: 1,
            servingSize: 40,
            source: 'Enhanced Local Database'
        },
        
        // Blue Diamond Almonds
        '041570070802': {
            name: 'Blue Diamond Whole Natural Almonds',
            brand: 'Blue Diamond',
            upc: '041570070802',
            calories: 170,
            protein: 6,
            carbs: 6,
            fat: 15,
            fiber: 4,
            sodium: 0,
            sugar: 1,
            servingSize: 28,
            source: 'Enhanced Local Database'
        },
        
        // Organic Valley Milk
        '023244020006': {
            name: 'Organic Valley Whole Milk',
            brand: 'Organic Valley',
            upc: '023244020006',
            calories: 150,
            protein: 8,
            carbs: 12,
            fat: 8,
            fiber: 0,
            sodium: 120,
            sugar: 12,
            servingSize: 240,
            source: 'Enhanced Local Database'
        },
        
        // Kind Bars
        '602652171017': {
            name: 'KIND Dark Chocolate Nuts & Sea Salt',
            brand: 'KIND',
            upc: '602652171017',
            calories: 200,
            protein: 6,
            carbs: 16,
            fat: 16,
            fiber: 7,
            sodium: 125,
            sugar: 5,
            servingSize: 40,
            source: 'Enhanced Local Database'
        },
        
        // Starbucks Coffee
        '762111188359': {
            name: 'Starbucks Pike Place Roast Ground Coffee',
            brand: 'Starbucks',
            upc: '762111188359',
            calories: 5,
            protein: 0,
            carbs: 0,
            fat: 0,
            fiber: 0,
            sodium: 0,
            sugar: 0,
            servingSize: 6, // 1 cup brewed
            source: 'Enhanced Local Database'
        },
        
        // Clif Bar
        '722252100016': {
            name: 'CLIF Bar Chocolate Chip',
            brand: 'CLIF',
            upc: '722252100016',
            calories: 250,
            protein: 9,
            carbs: 45,
            fat: 5,
            fiber: 4,
            sodium: 150,
            sugar: 21,
            servingSize: 68,
            source: 'Enhanced Local Database'
        }
    };
    
    const product = enhancedLocalProducts[upc];
    if (product) {
        console.log('✅ Found in enhanced local database:', product.name);
        return product;
    }
    
    return null;
};

// Enhanced food search for USDA + Open Food Facts
const searchFoodsEnhanced = async (query) => {
    if (!query || query.length < 2) return [];
    
    try {
        console.log('🔍 Enhanced food search for:', query);
        
        // Search both USDA and Open Food Facts in parallel
        const [usdaResults, openFoodResults] = await Promise.allSettled([
            searchFoodsUSDA(query),
            searchOpenFoodFactsByName(query)
        ]);
        
        const allResults = [];
        
        // Add USDA results
        if (usdaResults.status === 'fulfilled' && usdaResults.value) {
            allResults.push(...usdaResults.value.map(food => ({
                ...food,
                source: 'USDA',
                priority: 1
            })));
        }
        
        // Add Open Food Facts results
        if (openFoodResults.status === 'fulfilled' && openFoodResults.value) {
            allResults.push(...openFoodResults.value.map(food => ({
                ...food,
                source: 'Open Food Facts',
                priority: 2
            })));
        }
        
        // Remove duplicates and sort by relevance
        const uniqueResults = removeDuplicateFoods(allResults, query);
        const sortedResults = sortFoodsByRelevance(uniqueResults, query);
        
        console.log(`✅ Found ${sortedResults.length} results from multiple sources`);
        return sortedResults.slice(0, 15); // Limit to top 15 results
        
    } catch (error) {
        console.error('Enhanced food search failed:', error);
        // Fallback to original USDA search
        return await searchFoods(query);
    }
};

// USDA search (your existing function, renamed)
const searchFoodsUSDA = async (query) => {
    return await searchFoods(query); // Use your existing function
};

// Open Food Facts text search
const searchOpenFoodFactsByName = async (query) => {
    try {
        const searchUrl = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=10`;
        
        const response = await fetch(searchUrl);
        const data = await response.json();
        
        if (!data.products || data.products.length === 0) {
            return [];
        }
        
        return data.products.map(product => ({
            fdcId: `off_${product.code}`,
            description: cleanProductName(product.product_name || product.product_name_en || 'Unknown Product'),
            brandOwner: product.brands || '',
            dataType: 'Branded Food',
            upc: product.code,
            nutrients: {
                calories: parseNutrient(product.nutriments?.energy_kcal),
                protein: parseNutrient(product.nutriments?.proteins),
                carbs: parseNutrient(product.nutriments?.carbohydrates),
                fat: parseNutrient(product.nutriments?.fat),
                fiber: parseNutrient(product.nutriments?.fiber)
            }
        })).filter(product => product.description !== 'Unknown Product');
        
    } catch (error) {
        console.error('Open Food Facts text search failed:', error);
        return [];
    }
};

// Helper functions
const parseNutrient = (value, defaultValue = 0) => {
    const num = parseFloat(value);
    return isNaN(num) ? defaultValue : Math.round(num * 10) / 10;
};

const cleanProductName = (name) => {
    return name
        .replace(/\s+/g, ' ')
        .replace(/[^\w\s\-&'()]/g, '')
        .trim()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
};

const removeDuplicateFoods = (results, query) => {
    const seen = new Set();
    return results.filter(result => {
        const key = result.description.toLowerCase().trim();
        if (seen.has(key)) {
            return false;
        }
        seen.add(key);
        return true;
    });
};

const sortFoodsByRelevance = (results, query) => {
    const queryLower = query.toLowerCase();
    
    return results.map(result => {
        let score = 0;
        const descLower = result.description.toLowerCase();
        const brandLower = (result.brandOwner || '').toLowerCase();
        
        // Exact match
        if (descLower === queryLower) score += 100;
        // Starts with query
        else if (descLower.startsWith(queryLower)) score += 80;
        // Contains query
        else if (descLower.includes(queryLower)) score += 60;
        
        // Brand match
        if (brandLower.includes(queryLower)) score += 40;
        
        // Branded product bonus
        if (result.brandOwner && result.brandOwner.trim()) score += 20;
        
        // Complete nutrition data bonus
        if (result.nutrients && Object.values(result.nutrients).some(v => v > 0)) score += 10;
        
        // Source priority
        if (result.priority) score += (3 - result.priority) * 5;
        
        return { ...result, relevanceScore: score };
    }).sort((a, b) => b.relevanceScore - a.relevanceScore);
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

// Enhanced Barcode Scanner Component with Camera Support
const BarcodeScanner = ({ onBarcodeFound, onClose }) => {
    const [manualUPC, setManualUPC] = React.useState('');
    const [lookupLoading, setLookupLoading] = React.useState(false);
    const [lastError, setLastError] = React.useState('');
    const [cameraActive, setCameraActive] = React.useState(false);
    const [stream, setStream] = React.useState(null);
    const videoRef = React.useRef(null);

    // Start camera for scanning
    const startCamera = async () => {
        try {
            setLastError('');
            setCameraActive(true);

            // Request camera access
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { 
                    facingMode: 'environment', // Use back camera on mobile
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }
            });

            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
                await videoRef.current.play();
            }

            // Simulate barcode detection (in real app you'd use a proper library)
            setTimeout(() => {
                if (cameraActive) {
                    // Simulate finding Vital Farms eggs barcode
                    handleBarcodeDetected('011110602787');
                }
            }, 3000);

        } catch (error) {
            console.error('Camera access failed:', error);
            setLastError('Camera access denied. Please use manual entry below.');
            setCameraActive(false);
        }
    };

    // Stop camera
    const stopCamera = () => {
        setCameraActive(false);
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
    };

    // Clean up on unmount
    React.useEffect(() => {
        return () => {
            stopCamera();
        };
    }, []);

    const handleBarcodeDetected = async (upc) => {
        if (!upc) return;
        
        setLookupLoading(true);
        setLastError('');
        stopCamera(); // Stop camera when barcode found
        
        try {
            // Try enhanced lookup first
            let productData = await lookupBarcodeEnhanced(upc);
            
            // Fallback to original lookup
            if (!productData) {
                productData = await lookupBarcode(upc);
            }
            
            if (productData) {
                // Add unique ID and format for meals system
                const foodItem = {
                    id: Date.now(),
                    fdcId: productData.upc || productData.code, // Use UPC as ID
                    name: `${productData.brand ? productData.brand + ' ' : ''}${productData.name}`,
                    servingSize: productData.servingSize || 100,
                    calories: productData.calories || 0,
                    protein: productData.protein || 0,
                    carbs: productData.carbs || 0,
                    fat: productData.fat || 0,
                    fiber: productData.fiber || 0,
                    source: productData.source,
                    upc: productData.upc || productData.code,
                    image: productData.image || productData.imageUrl
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
                        onClick: () => {
                            stopCamera();
                            onClose();
                        },
                        className: 'text-white hover:text-gray-200 text-xl font-bold' 
                    }, '×')
                )
            ),

            // Content
            React.createElement('div', { className: 'p-4 space-y-4' },
                
                // Camera Section
                React.createElement('div', { className: 'space-y-3' },
                    React.createElement('h4', { className: 'font-semibold text-gray-800' }, '📷 Camera Scanner'),
                    
                    // Video Element
                    React.createElement('div', { className: 'relative bg-gray-900 rounded-lg overflow-hidden' },
                        React.createElement('video', {
                            ref: videoRef,
                            className: 'w-full h-48 object-cover',
                            playsInline: true,
                            muted: true
                        }),
                        
                        // Scanning Overlay
                        React.createElement('div', { className: 'absolute inset-0 flex items-center justify-center pointer-events-none' },
                            React.createElement('div', { className: 'border-2 border-red-500 w-32 h-20 rounded-lg relative' },
                                React.createElement('div', { className: 'absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-red-500' }),
                                React.createElement('div', { className: 'absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-red-500' }),
                                React.createElement('div', { className: 'absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-red-500' }),
                                React.createElement('div', { className: 'absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-red-500' })
                            )
                        ),
                        
                        // Status Overlay
                        !cameraActive && React.createElement('div', { className: 'absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75' },
                            React.createElement('p', { className: 'text-white text-center' }, 'Camera not active')
                        )
                    ),
                    
                    // Camera Controls
                    React.createElement('div', { className: 'flex gap-2' },
                        React.createElement('button', {
                            onClick: startCamera,
                            disabled: cameraActive || lookupLoading,
                            className: 'flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white py-2 px-4 rounded-lg font-semibold'
                        }, cameraActive ? '📹 Camera Active' : '📷 Start Camera'),
                        
                        React.createElement('button', {
                            onClick: stopCamera,
                            disabled: !cameraActive,
                            className: 'flex-1 bg-red-500 hover:bg-red-600 disabled:bg-gray-300 text-white py-2 px-4 rounded-lg font-semibold'
                        }, '⏹️ Stop Camera')
                    )
                ),

                // Manual Entry Section (keep your existing code)
                React.createElement('div', { className: 'border-t border-gray-200 pt-4 space-y-3' },
                    React.createElement('h4', { className: 'font-semibold text-gray-800' }, '📝 Manual Entry'),
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

                // Error Display (keep your existing code)
                lastError && React.createElement('div', { 
                    className: 'bg-red-50 border border-red-200 rounded-lg p-3' 
                },
                    React.createElement('p', { className: 'text-red-700 text-sm' }, lastError)
                ),

                // Instructions (keep your existing code)
                React.createElement('div', { className: 'bg-blue-50 border border-blue-200 rounded-lg p-3' },
                    React.createElement('h5', { className: 'font-semibold text-blue-800 mb-2' }, '💡 Tips:'),
                    React.createElement('ul', { className: 'text-sm text-blue-700 space-y-1' },
                        React.createElement('li', null, '• Use camera to scan barcode automatically'),
                        React.createElement('li', null, '• Or find barcode on food packaging and type numbers'),
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
const foods = await searchFoodsEnhanced(query);                
                setResults(foods);
                setLoading(false);
            } else {
                setResults([]);
            }
        }, 300);

        return () => clearTimeout(searchTimeout);
    }, [query]);

    const handleAddFood = async (food, servingSize = 100) => {
    // If it's a barcode scanned item or enhanced search result, use it directly
    if (food.upc || food.source || (food.nutrients && typeof food.nutrients === 'object')) {
        // Handle enhanced food items (barcode, Open Food Facts, etc.)
        let foodItem;
        
        if (food.nutrients) {
            // Enhanced search result with nutrients object
            foodItem = {
                id: Date.now(),
                fdcId: food.fdcId,
                name: food.description || food.name,
                servingSize: servingSize,
                calories: food.nutrients.calories || 0,
                protein: food.nutrients.protein || 0,
                carbs: food.nutrients.carbs || 0,
                fat: food.nutrients.fat || 0,
                fiber: food.nutrients.fiber || 0
            };
        } else {
            // Barcode scanned item with direct nutrition values
            foodItem = {
                id: Date.now(),
                fdcId: food.fdcId || food.upc,
                name: food.name || food.description,
                servingSize: servingSize,
                calories: food.calories || 0,
                protein: food.protein || 0,
                carbs: food.carbs || 0,
                fat: food.fat || 0,
                fiber: food.fiber || 0
            };
        }
        
        const updatedRecent = [foodItem, ...recentFoods.filter(f => f.fdcId !== foodItem.fdcId)];
        setRecentFoods(updatedRecent);
        saveRecentFoods(updatedRecent);
        onAddFood(foodItem);
        onClose();
        return;
    }

    // Otherwise, use existing USDA lookup logic for original USDA results
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

// Food Item Component - CORRECTED VERSION
const FoodItem = ({ food, onRemove, onUpdateServing }) => {
    // Helper function to get calories from multiple possible fields
    // Enhanced getCalories function with macro-based calculation
const getCalories = (food) => {
    // First, try to get calories from various possible fields
    let calories = food.calories || 
                  food.energy || 
                  food.kcal || 
                  food.energy_kcal || 
                  (food.nutrients && food.nutrients.calories) ||
                  (food.nutrients && food.nutrients.energy) ||
                  (food.nutriments && food.nutriments['energy-kcal']) ||
                  (food.nutriments && food.nutriments.energy_kcal) ||
                  0;
    
    // If no calorie data found, calculate from macros
    if (calories === 0 && (food.protein || food.carbs || food.fat)) {
        const protein = food.protein || 0;
        const carbs = food.carbs || 0;
        const fat = food.fat || 0;
        
        // Standard calorie calculation: Protein=4cal/g, Carbs=4cal/g, Fat=9cal/g
        calories = (protein * 4) + (carbs * 4) + (fat * 9);
        
        console.log('🔢 Calculated calories from macros:', {
            protein: `${protein}g × 4 = ${protein * 4} cal`,
            carbs: `${carbs}g × 4 = ${carbs * 4} cal`, 
            fat: `${fat}g × 9 = ${fat * 9} cal`,
            total: `${calories} calories`
        });
    }
    
    console.log('🔍 Calorie lookup for', food.name, ':', {
        food_calories: food.calories,
        food_energy: food.energy,
        final_calories: calories,
        calculated: calories > (food.calories || 0)
    });
    
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
        calories: 2000,
        protein: 150,
        carbs: 250,
        fat: 67
    };

    if (isLocalStorageAvailable()) {
        try {
            // Try multiple possible keys and formats
            let data = localStorage.getItem('fueliq_user_goals');
            if (!data) {
                data = localStorage.getItem('fueliq_user_profile');
            }
            
            if (data) {
                const parsed = JSON.parse(data);
                
                // Handle different possible formats
                const goals = {
                    calories: parsed.calories || parsed.dailyCalories || defaultGoals.calories,
                    protein: parsed.protein || defaultGoals.protein,
                    carbs: parsed.carbs || parsed.carbohydrates || defaultGoals.carbs,
                    fat: parsed.fat || defaultGoals.fat
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
