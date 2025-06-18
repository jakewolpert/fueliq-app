// CLEAN Enhanced Meals Tab - Syntax Error Fixed
// Natural Language + Barcode Scanner + Ultra-Safe Mounting

(function() {
    'use strict';

    console.log('🔧 Loading CLEAN enhanced meals system...');

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

    // Barcode API
    const searchByBarcode = async (barcode) => {
        try {
            const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
            const data = await response.json();
            
            if (data.status === 1 && data.product) {
                const product = data.product;
                const nutriments = product.nutriments || {};
                
                return {
                    id: Date.now(),
                    name: product.product_name || 'Unknown Product',
                    brand: product.brands || '',
                    barcode: barcode,
                    servingSize: 100,
                    calories: nutriments['energy-kcal_100g'] || nutriments['energy-kcal'] || 0,
                    protein: nutriments['proteins_100g'] || nutriments.proteins || 0,
                    carbs: nutriments['carbohydrates_100g'] || nutriments.carbohydrates || 0,
                    fat: nutriments['fat_100g'] || nutriments.fat || 0,
                    fiber: nutriments['fiber_100g'] || nutriments.fiber || 0,
                    source: 'Barcode Scan',
                    confidence: 'high'
                };
            }
            return null;
        } catch (error) {
            console.error('Error searching barcode:', error);
            return null;
        }
    };

    // Common Foods Database
    const commonFoods = {
        'eggs': { calories: 70, protein: 6, carbs: 1, fat: 5 },
        'toast': { calories: 80, protein: 3, carbs: 15, fat: 1 },
        'bacon': { calories: 43, protein: 3, carbs: 0, fat: 3.3 },
        'chicken breast': { calories: 165, protein: 31, carbs: 0, fat: 3.6 },
        'salmon': { calories: 208, protein: 22, carbs: 0, fat: 12 },
        'hamburger': { calories: 540, protein: 25, carbs: 40, fat: 31 },
        'pizza slice': { calories: 285, protein: 12, carbs: 36, fat: 10 },
        'pasta': { calories: 220, protein: 8, carbs: 44, fat: 1 },
        'rice': { calories: 205, protein: 4, carbs: 45, fat: 0.5 },
        'salad': { calories: 33, protein: 3, carbs: 6, fat: 0 },
        'french fries': { calories: 365, protein: 4, carbs: 63, fat: 17 },
        'big mac': { calories: 563, protein: 26, carbs: 45, fat: 33 },
        'apple': { calories: 95, protein: 0, carbs: 25, fat: 0 },
        'banana': { calories: 105, protein: 1, carbs: 27, fat: 0 }
    };

    // Portion multipliers
    const portionSizes = {
        'small': 0.7, 'medium': 1.0, 'large': 1.4, 'extra large': 1.8,
        '1': 1.0, '2': 2.0, '3': 3.0, '4': 4.0, 'half': 0.5, 'quarter': 0.25
    };

    // Natural Language Parser
    const parseDescription = (description) => {
        const foods = [];
        const text = description.toLowerCase().trim();
        
        let portionMultiplier = 1.0;
        for (const [size, multiplier] of Object.entries(portionSizes)) {
            if (text.includes(size)) {
                portionMultiplier = multiplier;
                break;
            }
        }
        
        const numberMatch = text.match(/(\d+)\s*(slice|slices|piece|pieces)?/);
        if (numberMatch) {
            const number = parseInt(numberMatch[1]);
            if (number > 0 && number <= 10) {
                portionMultiplier = number;
            }
        }
        
        for (const [foodName, nutrition] of Object.entries(commonFoods)) {
            if (text.includes(foodName)) {
                foods.push({
                    id: Date.now() + Math.random(),
                    name: `${foodName} (estimated)`,
                    servingSize: 100 * portionMultiplier,
                    calories: nutrition.calories,
                    protein: nutrition.protein,
                    carbs: nutrition.carbs,
                    fat: nutrition.fat,
                    fiber: 2,
                    source: 'Natural Language',
                    confidence: 'medium'
                });
            }
        }
        
        if (foods.length === 0) {
            foods.push({
                id: Date.now(),
                name: `"${description}" (rough estimate)`,
                servingSize: 100,
                calories: 400, protein: 20, carbs: 45, fat: 15, fiber: 3,
                source: 'General Estimate', confidence: 'low'
            });
        }
        
        return foods;
    };

    // Storage functions  
    const isLocalStorageAvailable = () => {
        try {
            const test = '__test__';
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
                data = memoryStorage[key];
            }
        } else {
            data = memoryStorage[key];
        }
        
        return data ? JSON.parse(data) : [];
    };

    // Helper functions
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

    // Enhanced Food Search Component
    const EnhancedFoodSearch = ({ onAddFood, onClose }) => {
        const [activeTab, setActiveTab] = React.useState('search');
        const [query, setQuery] = React.useState('');
        const [results, setResults] = React.useState([]);
        const [loading, setLoading] = React.useState(false);
        const [recentFoods, setRecentFoods] = React.useState(loadRecentFoods());
        const [description, setDescription] = React.useState('');
        const [parsedFoods, setParsedFoods] = React.useState([]);
        const [parseLoading, setParseLoading] = React.useState(false);
        const [scannedProducts, setScannedProducts] = React.useState([]);
        const [scanLoading, setScanLoading] = React.useState(false);

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

        const handleParseDescription = () => {
            if (!description.trim()) return;
            
            setParseLoading(true);
            setTimeout(() => {
                const foods = parseDescription(description);
                setParsedFoods(foods);
                setParseLoading(false);
            }, 500);
        };

        const handleAddParsedFood = (food) => {
            const updatedRecent = [food, ...recentFoods.filter(f => f.id !== food.id)];
            setRecentFoods(updatedRecent);
            saveRecentFoods(updatedRecent);
            
            onAddFood(food);
            onClose();
        };

        const handleScanBarcode = async (barcode) => {
            setScanLoading(true);
            const product = await searchByBarcode(barcode);
            
            if (product) {
                setScannedProducts(prev => [product, ...prev.filter(p => p.barcode !== barcode)]);
            } else {
                setScannedProducts(prev => [{
                    id: Date.now(),
                    name: `Product ${barcode}`,
                    barcode: barcode,
                    servingSize: 100,
                    calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0,
                    source: 'Manual Entry Needed',
                    confidence: 'unknown',
                    needsManualEntry: true
                }, ...prev]);
            }
            setScanLoading(false);
        };

        const handleManualBarcodeEntry = (barcode) => {
            if (barcode && barcode.length >= 8) {
                handleScanBarcode(barcode);
            }
        };

        const getConfidenceColor = (confidence) => {
            switch(confidence) {
                case 'high': return 'text-green-600 bg-green-100';
                case 'medium': return 'text-yellow-600 bg-yellow-100';
                case 'low': return 'text-red-600 bg-red-100';
                default: return 'text-gray-600 bg-gray-100';
            }
        };

        return React.createElement('div', { 
            className: 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50' 
        },
            React.createElement('div', { 
                className: 'bg-white rounded-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col' 
            },
                React.createElement('div', { className: 'flex justify-between items-center mb-4' },
                    React.createElement('h3', { className: 'text-xl font-bold text-gray-800' }, 'Add Food'),
                    React.createElement('button', { 
                        onClick: onClose,
                        className: 'text-gray-500 hover:text-gray-700 text-xl font-bold' 
                    }, '×')
                ),

                // Tab Navigation  
                React.createElement('div', { className: 'flex gap-1 mb-4 border-b border-gray-200 overflow-x-auto' },
                    React.createElement('button', {
                        onClick: () => setActiveTab('search'),
                        className: `px-3 py-2 font-semibold transition-colors whitespace-nowrap ${
                            activeTab === 'search' 
                                ? 'border-b-2 border-blue-500 text-blue-600' 
                                : 'text-gray-600 hover:text-gray-800'
                        }`
                    }, '🔍 Search'),
                    React.createElement('button', {
                        onClick: () => setActiveTab('recent'),
                        className: `px-3 py-2 font-semibold transition-colors whitespace-nowrap ${
                            activeTab === 'recent' 
                                ? 'border-b-2 border-blue-500 text-blue-600' 
                                : 'text-gray-600 hover:text-gray-800'
                        }`
                    }, '⏰ Recent'),
                    React.createElement('button', {
                        onClick: () => setActiveTab('describe'),
                        className: `px-3 py-2 font-semibold transition-colors whitespace-nowrap ${
                            activeTab === 'describe' 
                                ? 'border-b-2 border-blue-500 text-blue-600' 
                                : 'text-gray-600 hover:text-gray-800'
                        }`
                    }, '💭 Describe'),
                    React.createElement('button', {
                        onClick: () => setActiveTab('scan'),
                        className: `px-3 py-2 font-semibold transition-colors whitespace-nowrap ${
                            activeTab === 'scan' 
                                ? 'border-b-2 border-blue-500 text-blue-600' 
                                : 'text-gray-600 hover:text-gray-800'
                        }`
                    }, '📱 Scan')
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
                            className: 'w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-blue-500'
                        }),

                        loading && React.createElement('div', { className: 'text-center py-8' },
                            React.createElement('div', { className: 'animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto' })
                        ),

                        !loading && results.length > 0 && React.createElement('div', { className: 'space-y-2' },
                            ...results.map(food =>
                                React.createElement('div', { 
                                    key: food.fdcId,
                                    className: 'flex justify-between items-center p-3 border border-gray-200 rounded-lg hover:border-blue-300'
                                },
                                    React.createElement('div', null,
                                        React.createElement('div', { className: 'font-semibold text-gray-800' }, food.description),
                                        React.createElement('div', { className: 'text-sm text-gray-600' }, food.brandOwner || 'Generic Food')
                                    ),
                                    React.createElement('button', { 
                                        onClick: () => handleAddFood(food),
                                        className: 'bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-all' 
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
                                        className: 'flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100'
                                    },
                                        React.createElement('div', null,
                                            React.createElement('div', { className: 'font-semibold text-gray-800' }, food.name),
                                            React.createElement('div', { className: 'text-sm text-gray-600' }, 
                                                `${Math.round(food.calories)} cal per 100g${food.source ? ` • ${food.source}` : ''}`
                                            )
                                        ),
                                        React.createElement('button', { 
                                            onClick: () => handleAddParsedFood(food),
                                            className: 'bg-blue-500 text-white px-3 py-1 rounded-lg text-sm' 
                                        }, 'Add')
                                    )
                                )
                            )
                    ),

                    // Describe Tab
                    activeTab === 'describe' && React.createElement('div', null,
                        React.createElement('div', { className: 'bg-blue-50 p-4 rounded-lg mb-4' },
                            React.createElement('div', { className: 'flex items-center gap-2 mb-2' },
                                React.createElement('span', { className: 'text-blue-600 text-lg' }, '💡'),
                                React.createElement('span', { className: 'font-semibold text-blue-800' }, 'Smart Meal Estimation')
                            ),
                            React.createElement('p', { className: 'text-sm text-blue-700' }, 
                                'Describe what you ate and we\'ll estimate the nutrition!'
                            )
                        ),

                        React.createElement('textarea', {
                            placeholder: 'Describe what you ate...\n\nExamples:\n• "Chicken Caesar salad with garlic bread"\n• "2 slices pepperoni pizza and a Coke"\n• "Big Mac meal with medium fries"',
                            value: description,
                            onChange: (e) => setDescription(e.target.value),
                            className: 'w-full h-32 p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-blue-500 resize-none',
                            rows: 4
                        }),

                        React.createElement('button', {
                            onClick: handleParseDescription,
                            disabled: !description.trim() || parseLoading,
                            className: `w-full bg-gradient-to-r from-blue-500 to-teal-600 text-white px-4 py-3 rounded-lg font-semibold mb-4 ${
                                (!description.trim() || parseLoading) ? 'opacity-50 cursor-not-allowed' : 'hover:from-blue-600 hover:to-teal-700'
                            }`
                        }, parseLoading ? 'Analyzing...' : '🤖 Estimate Nutrition'),

                        parseLoading && React.createElement('div', { className: 'text-center py-4' },
                            React.createElement('div', { className: 'animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto' })
                        ),

                        parsedFoods.length > 0 && React.createElement('div', { className: 'space-y-3' },
                            React.createElement('h4', { className: 'font-semibold text-gray-800 mb-3 border-t pt-4' }, 'Estimated Foods:'),
                            ...parsedFoods.map(food =>
                                React.createElement('div', { 
                                    key: food.id,
                                    className: 'border border-gray-200 rounded-lg p-3 bg-gray-50'
                                },
                                    React.createElement('div', { className: 'flex justify-between items-start mb-2' },
                                        React.createElement('div', { className: 'flex-1' },
                                            React.createElement('div', { className: 'font-semibold text-gray-800' }, food.name),
                                            React.createElement('div', { className: 'flex items-center gap-2 mt-1' },
                                                React.createElement('span', { 
                                                    className: `text-xs px-2 py-1 rounded-full ${getConfidenceColor(food.confidence)}`
                                                }, `${food.confidence} confidence`),
                                                React.createElement('span', { className: 'text-xs text-gray-500' }, food.source)
                                            )
                                        ),
                                        React.createElement('button', { 
                                            onClick: () => handleAddParsedFood(food),
                                            className: 'bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm ml-3' 
                                        }, 'Add')
                                    ),
                                    React.createElement('div', { className: 'grid grid-cols-4 gap-2 text-sm text-gray-600' },
                                        React.createElement('div', null, `${Math.round(food.calories)} cal`),
                                        React.createElement('div', null, `${Math.round(food.protein)}g protein`),
                                        React.createElement('div', null, `${Math.round(food.carbs)}g carbs`),
                                        React.createElement('div', null, `${Math.round(food.fat)}g fat`)
                                    )
                                )
                            )
                        )
                    ),

                    // Scan Tab
                    activeTab === 'scan' && React.createElement('div', null,
                        React.createElement('div', { className: 'bg-blue-50 p-4 rounded-lg mb-4' },
                            React.createElement('div', { className: 'flex items-center gap-2 mb-2' },
                                React.createElement('span', { className: 'text-blue-600 text-lg' }, '📱'),
                                React.createElement('span', { className: 'font-semibold text-blue-800' }, 'Barcode Scanner')
                            ),
                            React.createElement('p', { className: 'text-sm text-blue-700' }, 
                                'Scan product barcodes for precise nutrition information.'
                            )
                        ),

                        React.createElement('div', { className: 'mb-4' },
                            React.createElement('label', { className: 'block text-sm font-semibold text-gray-700 mb-2' }, 'Enter Barcode:'),
                            React.createElement('div', { className: 'flex gap-2' },
                                React.createElement('input', {
                                    type: 'text',
                                    placeholder: 'Enter barcode number...',
                                    className: 'flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500',
                                    onKeyPress: (e) => {
                                        if (e.key === 'Enter') {
                                            handleManualBarcodeEntry(e.target.value);
                                            e.target.value = '';
                                        }
                                    }
                                }),
                                React.createElement('button', {
                                    onClick: (e) => {
                                        const input = e.target.parentElement.querySelector('input');
                                        handleManualBarcodeEntry(input.value);
                                        input.value = '';
                                    },
                                    className: 'bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg'
                                }, 'Look Up')
                            )
                        ),

                        scanLoading && React.createElement('div', { className: 'text-center py-4' },
                            React.createElement('div', { className: 'animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto mb-2' }),
                            React.createElement('p', { className: 'text-sm text-gray-600' }, 'Looking up product...')
                        ),

                        scannedProducts.length > 0 && React.createElement('div', { className: 'space-y-3' },
                            React.createElement('h4', { className: 'font-semibold text-gray-800 mb-3 border-t pt-4' }, 'Scanned Products:'),
                            ...scannedProducts.map(product =>
                                React.createElement('div', { 
                                    key: product.id,
                                    className: `border border-gray-200 rounded-lg p-3 ${product.needsManualEntry ? 'bg-yellow-50' : 'bg-gray-50'}`
                                },
                                    React.createElement('div', { className: 'flex justify-between items-start mb-2' },
                                        React.createElement('div', { className: 'flex-1' },
                                            React.createElement('div', { className: 'font-semibold text-gray-800' }, product.name),
                                            product.brand && React.createElement('div', { className: 'text-sm text-gray-600' }, product.brand),
                                            React.createElement('div', { className: 'flex items-center gap-2 mt-1' },
                                                React.createElement('span', { className: 'text-xs text-gray-500' }, `Barcode: ${product.barcode}`),
                                                React.createElement('span', { 
                                                    className: `text-xs px-2 py-1 rounded-full ${getConfidenceColor(product.confidence)}`
                                                }, product.confidence === 'unknown' ? 'needs manual entry' : `${product.confidence} confidence`)
                                            )
                                        ),
                                        !product.needsManualEntry && React.createElement('button', { 
                                            onClick: () => handleAddParsedFood(product),
                                            className: 'bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm ml-3' 
                                        }, 'Add')
                                    ),
                                    !product.needsManualEntry ? 
                                        React.createElement('div', { className: 'grid grid-cols-4 gap-2 text-sm text-gray-600' },
                                            React.createElement('div', null, `${Math.round(product.calories)} cal`),
                                            React.createElement('div', null, `${Math.round(product.protein)}g protein`),
                                            React.createElement('div', null, `${Math.round(product.carbs)}g carbs`),
                                            React.createElement('div', null, `${Math.round(product.fat)}g fat`)
                                        ) :
                                        React.createElement('div', { className: 'bg-yellow-100 p-2 rounded text-sm text-yellow-800' },
                                            'Product not found in database. Try the Search tab instead.'
                                        )
                                )
                            )
                        ),

                        scannedProducts.length === 0 && !scanLoading && React.createElement('div', { className: 'border-t pt-4 mt-4' },
                            React.createElement('h4', { className: 'font-semibold text-gray-700 mb-3' }, 'Try these demo barcodes:'),
                            React.createElement('div', { className: 'grid grid-cols-1 gap-2' },
                                React.createElement('button', {
                                    onClick: () => handleManualBarcodeEntry('7622210771704'),
                                    className: 'text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50'
                                },
                                    React.createElement('div', { className: 'font-medium' }, 'Nutella (7622210771704)'),
                                    React.createElement('div', { className: 'text-sm text-gray-600' }, 'Chocolate hazelnut spread')
                                ),
                                React.createElement('button', {
                                    onClick: () => handleManualBarcodeEntry('8076800105987'),
                                    className: 'text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50'
                                },
                                    React.createElement('div', { className: 'font-medium' }, 'Coca-Cola (8076800105987)'),
                                    React.createElement('div', { className: 'text-sm text-gray-600' }, 'Classic soft drink')
                                )
                            )
                        )
                    )
                )
            )
        );
    };

    // Food Item Component
    const FoodItem = ({ food, onRemove, onUpdateServing }) => {
        const [serving, setServing] = React.useState(1);
        
        const handleServingChange = (newServing) => {
            setServing(newServing);
            onUpdateServing(food.id, newServing);
        };

        const multiplier = (serving * (food.servingSize || 100)) / 100;

        return React.createElement('div', { className: 'bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow' },
            React.createElement('div', { className: 'flex justify-between items-start mb-2' },
                React.createElement('div', { className: 'flex-1' },
                    React.createElement('h4', { className: 'font-semibold text-gray-800' }, food.name),
                    food.source && React.createElement('div', { className: 'text-xs text-gray-500 mt-1' }, food.source)
                ),
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
    const ProgressBar = ({ label, current, goal, unit, color = 'blue' }) => {
        const percentage = goal > 0 ? Math.min((current / goal) * 100, 100) : 0;
        const colorClasses = {
            blue: 'bg-blue-500',
            teal: 'bg-teal-500',
            green: 'bg-green-500',
            red: 'bg-red-500'
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
                    foods.length > 0 && React.createElement('span', { className: 'bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-semibold' }, 
                        `${Math.round(totalNutrition.calories)} cal`
                    )
                ),
                React.createElement('button', { 
                    onClick: () => setShowSearch(true),
                    className: 'bg-gradient-to-r from-blue-500 to-teal-600 hover:from-blue-600 hover:to-teal-700 text-white px-4 py-2 rounded-lg transition-all font-semibold' 
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
    const SafeMealsTab = () => {
        const [currentDate, setCurrentDate] = React.useState(new Date());
        const [meals, setMeals] = React.useState(loadMealData(formatDate(currentDate)));

        const loadUserGoals = () => {
            const defaultGoals = { calories: 2000, protein: 150, carbs: 250, fat: 67 };

            if (isLocalStorageAvailable()) {
                try {
                    const keys = ['fueliq_user_goals', 'habbt_profile_data', 'fueliq_profile_data', 'unified_goals_data'];
                    
                    for (const key of keys) {
                        const data = localStorage.getItem(key);
                        if (data) {
                            const parsed = JSON.parse(data);
                            return {
                                calories: parsed.calories || parsed.dailyCalories || (parsed.goals && parsed.goals.calories) || defaultGoals.calories,
                                protein: parsed.protein || (parsed.goals && parsed.goals.protein) || defaultGoals.protein,
                                carbs: parsed.carbs || parsed.carbohydrates || (parsed.goals && parsed.goals.carbs) || defaultGoals.carbs,
                                fat: parsed.fat || (parsed.goals && parsed.goals.fat) || defaultGoals.fat
                            };
                        }
                    }
                } catch (e) {
                    console.warn('Failed to load goals:', e);
                }
            }
            
            return defaultGoals;
        };

        const dailyGoals = loadUserGoals();

        React.useEffect(() => {
            try {
                const dateStr = formatDate(currentDate);
                setMeals(loadMealData(dateStr));
            } catch (error) {
                console.error('Error loading meals:', error);
                setMeals({ breakfast: [], lunch: [], dinner: [], snacks: [] });
            }
        }, [currentDate]);

        React.useEffect(() => {
            try {
                saveMealData(formatDate(currentDate), meals);
            } catch (error) {
                console.error('Error saving meals:', error);
            }
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

        const allFoods = [...(meals.breakfast || []), ...(meals.lunch || []), ...(meals.dinner || []), ...(meals.snacks || [])];
        let dailyTotals;
        
        try {
            dailyTotals = calculateNutrition(allFoods);
        } catch (error) {
            dailyTotals = { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };
        }

        const changeDate = (days) => {
            const newDate = new Date(currentDate);
            newDate.setDate(newDate.getDate() + days);
            setCurrentDate(newDate);
        };

        const isToday = formatDate(currentDate) === formatDate(new Date());

        return React.createElement('div', { className: 'max-w-6xl mx-auto p-6' },
            // Header
            React.createElement('div', { className: 'bg-gradient-to-r from-blue-600 to-teal-600 rounded-xl p-6 mb-6 text-white' },
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
                    label: 'Calories', current: dailyTotals.calories, goal: dailyGoals.calories, unit: '', color: 'blue' 
                }),
                React.createElement(ProgressBar, { 
                    label: 'Protein', current: dailyTotals.protein, goal: dailyGoals.protein, unit: 'g', color: 'teal' 
                }),
                React.createElement(ProgressBar, { 
                    label: 'Carbohydrates', current: dailyTotals.carbs, goal: dailyGoals.carbs, unit: 'g', color: 'blue' 
                }),
                React.createElement(ProgressBar, { 
                    label: 'Fat', current: dailyTotals.fat, goal: dailyGoals.fat, unit: 'g', color: 'teal' 
                })
            ),

            // Meals Grid
            React.createElement('div', { className: 'grid md:grid-cols-2 gap-6' },
                React.createElement(MealSection, {
                    title: 'Breakfast', icon: '🍳', foods: meals.breakfast,
                    onAddFood: (food) => addFoodToMeal('breakfast', food),
                    onRemoveFood: (foodId) => removeFoodFromMeal('breakfast', foodId),
                    onUpdateServing: (foodId, serving) => updateFoodServing('breakfast', foodId, serving)
                }),
                React.createElement(MealSection, {
                    title: 'Lunch', icon: '🥪', foods: meals.lunch,
                    onAddFood: (food) => addFoodToMeal('lunch', food),
                    onRemoveFood: (foodId) => removeFoodFromMeal('lunch', foodId),
                    onUpdateServing: (foodId, serving) => updateFoodServing('lunch', foodId, serving)
                }),
                React.createElement(MealSection, {
                    title: 'Dinner', icon: '🍽️', foods: meals.dinner,
                    onAddFood: (food) => addFoodToMeal('dinner', food),
                    onRemoveFood: (foodId) => removeFoodFromMeal('dinner', foodId),
                    onUpdateServing: (foodId, serving) => updateFoodServing('dinner', foodId, serving)
                }),
                React.createElement(MealSection, {
                    title: 'Snacks', icon: '🍎', foods: meals.snacks,
                    onAddFood: (food) => addFoodToMeal('snacks', food),
                    onRemoveFood: (foodId) => removeFoodFromMeal('snacks', foodId),
                    onUpdateServing: (foodId, serving) => updateFoodServing('snacks', foodId, serving)
                })
            )
        );
    };

    // CLEAN Ultra-Safe Rendering System
    let renderingActive = false;
    let verificationId = null;

    const cleanRenderMealsTab = (containerId = 'meals-container') => {
        console.log('🔧 CLEAN rendering meals tab...');
        
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`❌ Container ${containerId} not found`);
            return false;
        }

        try {
            // Force clean slate
            container.innerHTML = '';
            verificationId = `clean-meals-${Date.now()}`;
            
            // Create wrapper
            const wrapper = document.createElement('div');
            wrapper.id = verificationId;
            wrapper.style.cssText = 'width: 100%; height: 100%;';
            
            // Add with delay to ensure DOM ready
            setTimeout(() => {
                container.appendChild(wrapper);
                
                setTimeout(() => {
                    try {
                        ReactDOM.render(React.createElement(SafeMealsTab), wrapper);
                        renderingActive = true;
                        console.log('✅ CLEAN meals tab rendered successfully');
                        startCleanMonitoring(containerId);
                    } catch (renderError) {
                        console.error('❌ React render error:', renderError);
                        container.innerHTML = `
                            <div class="max-w-6xl mx-auto p-6">
                                <div class="bg-gradient-to-r from-blue-600 to-teal-600 rounded-xl p-6 mb-6 text-white">
                                    <h1 class="text-3xl font-bold mb-4">Daily Nutrition</h1>
                                    <div class="bg-yellow-100 text-yellow-800 p-4 rounded-lg">
                                        <p class="font-semibold mb-2">⚠️ Loading Enhanced Features...</p>
                                        <p class="text-sm">Please refresh the page if this persists.</p>
                                        <button onclick="location.reload()" class="mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                                            🔄 Refresh Page
                                        </button>
                                    </div>
                                </div>
                            </div>
                        `;
                    }
                }, 100);
            }, 50);
            
            return true;
        } catch (error) {
            console.error('❌ Critical error in clean rendering:', error);
            return false;
        }
    };

    const startCleanMonitoring = (containerId) => {
        const monitoringInterval = setInterval(() => {
            const container = document.getElementById(containerId);
            const ourContent = document.getElementById(verificationId);
            
            if (container && !ourContent && renderingActive) {
                console.log('🔄 Content was overridden, re-rendering...');
                cleanRenderMealsTab(containerId);
            }
        }, 2000);

        window.cleanMealsCleanup = () => {
            clearInterval(monitoringInterval);
            renderingActive = false;
        };
    };

    // Override functions
    window.tryRenderMeals = cleanRenderMealsTab;
    window.renderMeals = cleanRenderMealsTab;
    window.renderMealsTab = cleanRenderMealsTab;

    // Export system
    window.FuelIQMeals = {
        SafeMealsTab,
        renderMealsTab: cleanRenderMealsTab,
        parseDescription,
        searchByBarcode,
        cleanup: () => {
            if (window.cleanMealsCleanup) {
                window.cleanMealsCleanup();
            }
        }
    };

    window.HabbtMeals = window.FuelIQMeals;

    console.log('✅ CLEAN enhanced meals system loaded successfully!');
    console.log('🎯 Features: Search + Recent + Describe + Scan + Ultra-safe mounting');

})();
