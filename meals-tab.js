// Habbt Nutrition Tab - Complete JavaScript Module
// Enhanced with Barcode Scanner and AI Suggestions
// USDA API Functions
const searchFoods = async (query) => {
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

// Enhanced Fallback Food Database with More Options
const FALLBACK_FOODS = {
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

// Enhanced Barcode API (Open Food Facts)
const lookupBarcode = async (barcode) => {
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
        console.error('Barcode lookup failed:', error);
        return null;
    }
};

// Storage functions with Habbt branding and backward compatibility
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

const saveMealData = (date, data) => {
    const keys = [`habbt_meals_${date}`, `fueliq_meals_${date}`]; // Save to both for compatibility
    const dataStr = JSON.stringify(data);
    
    if (isLocalStorageAvailable()) {
        try {
            keys.forEach(key => localStorage.setItem(key, dataStr));
        } catch (e) {
            console.warn('localStorage failed, using memory storage:', e);
            keys.forEach(key => memoryStorage[key] = dataStr);
        }
    } else {
        keys.forEach(key => memoryStorage[key] = dataStr);
    }
};

const loadMealData = (date) => {
    const keys = [`habbt_meals_${date}`, `fueliq_meals_${date}`]; // Try both keys
    let data = null;
    
    if (isLocalStorageAvailable()) {
        try {
            for (const key of keys) {
                data = localStorage.getItem(key);
                if (data) break;
            }
        } catch (e) {
            console.warn('localStorage failed, using memory storage:', e);
            for (const key of keys) {
                data = memoryStorage[key];
                if (data) break;
            }
        }
    } else {
        for (const key of keys) {
            data = memoryStorage[key];
            if (data) break;
        }
    }
    
    return data ? JSON.parse(data) : {
        breakfast: [],
        lunch: [],
        dinner: [],
        snacks: []
    };
};

// Enhanced camera/scanner component
const CameraScanner = ({ onScan, onClose }) => {
    const [isScanning, setIsScanning] = React.useState(false);
    const [manualBarcode, setManualBarcode] = React.useState('');
    const [error, setError] = React.useState('');
    const videoRef = React.useRef(null);
    const streamRef = React.useRef(null);

    React.useEffect(() => {
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const startCamera = async () => {
        try {
            setError('');
            setIsScanning(true);
            
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: 'environment' }
            });
            
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error('Camera access failed:', err);
            setError('Camera access denied. Please allow camera permission and try again.');
            setIsScanning(false);
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        setIsScanning(false);
    };

    const simulateScan = () => {
        const mockBarcodes = [
            '0123456789012',
            '0737628064502', // Cheerios
            '0016000275157', // Coca-Cola
            '0041196891171'  // Kraft Mac & Cheese
        ];
        const randomBarcode = mockBarcodes[Math.floor(Math.random() * mockBarcodes.length)];
        onScan(randomBarcode);
        onClose();
    };

    const handleManualEntry = () => {
        if (manualBarcode.trim()) {
            onScan(manualBarcode.trim());
            onClose();
        }
    };

    return React.createElement('div', { 
        className: 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50' 
    },
        React.createElement('div', { 
            className: 'bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto flex flex-col' 
        },
            React.createElement('div', { className: 'flex justify-between items-center mb-4' },
                React.createElement('h3', { className: 'text-xl font-bold text-gray-800' }, 'Barcode Scanner'),
                React.createElement('button', { 
                    onClick: onClose,
                    className: 'text-gray-500 hover:text-gray-700 text-xl font-bold' 
                }, '×')
            ),

            React.createElement('div', { className: 'mb-4 p-3 bg-blue-50 rounded-lg' },
                React.createElement('p', { className: 'text-blue-800 text-sm' },
                    '📷 Point camera at barcode or enter manually below'
                )
            ),

            !isScanning ? 
                React.createElement('div', { className: 'text-center space-y-3' },
                    React.createElement('div', { className: 'w-32 h-32 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4' },
                        React.createElement('span', { className: 'text-4xl' }, '📷')
                    ),
                    React.createElement('button', {
                        onClick: startCamera,
                        className: 'w-full bg-gradient-to-r from-blue-500 to-teal-600 hover:from-blue-600 hover:to-teal-700 text-white px-6 py-3 rounded-lg font-semibold mb-2 transition-all duration-200'
                    }, '📷 Start Camera'),
                    
                    React.createElement('button', {
                        onClick: simulateScan,
                        className: 'w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-200'
                    }, '🎯 Demo Scan (Random Product)')
                ) :
                React.createElement('div', { className: 'relative' },
                    React.createElement('video', {
                        ref: videoRef,
                        autoPlay: true,
                        playsInline: true,
                        className: 'w-full h-48 bg-black rounded-lg object-cover'
                    }),
                    React.createElement('div', { className: 'absolute inset-0 flex items-center justify-center' },
                        React.createElement('div', { className: 'w-32 h-20 border-2 border-blue-500 rounded-lg' })
                    ),
                    React.createElement('div', { className: 'text-center mt-3' },
                        React.createElement('p', { className: 'text-sm text-gray-600 mb-3' }, 'Point camera at barcode'),
                        React.createElement('div', { className: 'flex gap-2 justify-center' },
                            React.createElement('button', {
                                onClick: simulateScan,
                                className: 'bg-gradient-to-r from-blue-500 to-teal-600 hover:from-blue-600 hover:to-teal-700 text-white px-4 py-2 rounded-lg'
                            }, 'Simulate Scan'),
                            React.createElement('button', {
                                onClick: stopCamera,
                                className: 'bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg'
                            }, 'Stop')
                        )
                    )
                ),

            error && React.createElement('div', { className: 'bg-red-50 border border-red-200 rounded-lg p-3 mb-4' },
                React.createElement('p', { className: 'text-red-700 text-sm' }, error)
            ),

            React.createElement('div', { className: 'border-t pt-4 mt-4' },
                React.createElement('h4', { className: 'font-semibold text-gray-700 mb-3' }, 'Or enter manually:'),
                React.createElement('div', { className: 'flex gap-2' },
                    React.createElement('input', {
                        type: 'text',
                        value: manualBarcode,
                        onChange: (e) => setManualBarcode(e.target.value),
                        placeholder: 'Enter barcode number',
                        className: 'flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200'
                    }),
                    React.createElement('button', {
                        onClick: handleManualEntry,
                        disabled: !manualBarcode.trim(),
                        className: 'bg-gradient-to-r from-blue-500 to-teal-600 hover:from-blue-600 hover:to-teal-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg'
                    }, 'Add')
                )
            )
        )
    );
};

// Enhanced food search with better UX
const FoodSearchComponent = ({ onAddFood, mealType }) => {
    const [searchQuery, setSearchQuery] = React.useState('');
    const [searchResults, setSearchResults] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [showScanner, setShowScanner] = React.useState(false);
    const [nutritionData, setNutritionData] = React.useState(null);

    const handleSearch = async (query) => {
        if (query.length < 2) {
            setSearchResults([]);
            return;
        }

        setLoading(true);
        try {
            const results = await searchFoods(query);
            
            if (results.length === 0) {
                const fallbackKeys = Object.keys(FALLBACK_FOODS).filter(key => 
                    key.toLowerCase().includes(query.toLowerCase())
                );
                
                const fallbackResults = fallbackKeys.map(key => ({
                    fdcId: `fallback_${key}`,
                    description: key.charAt(0).toUpperCase() + key.slice(1),
                    brandOwner: 'Habbt Database',
                    nutrients: FALLBACK_FOODS[key],
                    dataType: 'Fallback',
                    source: 'fallback'
                }));
                
                setSearchResults(fallbackResults);
            } else {
                setSearchResults(results);
            }
        } catch (error) {
            console.error('Search failed:', error);
            setSearchResults([]);
        } finally {
            setLoading(false);
        }
    };

    const handleBarcodeScan = async (barcode) => {
        setLoading(true);
        try {
            const product = await lookupBarcode(barcode);
            if (product) {
                setSearchResults([product]);
                setSearchQuery(product.description);
            } else {
                alert('Product not found. Please try manual entry.');
            }
        } catch (error) {
            console.error('Barcode lookup failed:', error);
            alert('Barcode lookup failed. Please try manual entry.');
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        const debounceTimer = setTimeout(() => {
            handleSearch(searchQuery);
        }, 300);

        return () => clearTimeout(debounceTimer);
    }, [searchQuery]);

    const addFood = (food, servingSize = 100) => {
        const foodItem = {
            id: Date.now() + Math.random(),
            name: food.description,
            brand: food.brandOwner || '',
            calories: Math.round((food.nutrients.calories || 0) * (servingSize / 100)),
            protein: Math.round((food.nutrients.protein || 0) * (servingSize / 100) * 10) / 10,
            carbs: Math.round((food.nutrients.carbs || 0) * (servingSize / 100) * 10) / 10,
            fat: Math.round((food.nutrients.fat || 0) * (servingSize / 100) * 10) / 10,
            fiber: Math.round((food.nutrients.fiber || 0) * (servingSize / 100) * 10) / 10,
            sodium: Math.round((food.nutrients.sodium || 0) * (servingSize / 100)),
            sugar: Math.round((food.nutrients.sugar || 0) * (servingSize / 100) * 10) / 10,
            servingSize: servingSize,
            fdcId: food.fdcId,
            source: food.source || 'usda',
            barcode: food.barcode || null,
            timestamp: new Date().toISOString()
        };

        onAddFood(mealType, foodItem);
        setSearchQuery('');
        setSearchResults([]);
    };

    return React.createElement('div', { className: 'bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-4 border border-white/20' },
        React.createElement('div', { className: 'flex flex-col space-y-4' },
            React.createElement('div', { className: 'flex space-x-2' },
                React.createElement('input', {
                    type: 'text',
                    value: searchQuery,
                    onChange: (e) => setSearchQuery(e.target.value),
                    placeholder: 'Search foods (e.g., chicken breast, apple)...',
                    className: 'flex-1 px-4 py-3 bg-white/70 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 font-medium'
                }),
                React.createElement('button', {
                    onClick: () => setShowScanner(true),
                    className: 'px-4 py-3 bg-gradient-to-r from-blue-500 to-teal-600 hover:from-blue-600 hover:to-teal-700 text-white rounded-xl font-semibold shadow-lg transform hover:scale-105 transition-all duration-200'
                }, '📷')
            ),

            loading && React.createElement('div', { className: 'text-center py-4' },
                React.createElement('div', { className: 'animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto' }),
                React.createElement('p', { className: 'text-gray-600 mt-2' }, 'Searching...')
            ),

            searchResults.length > 0 && React.createElement('div', { className: 'max-h-80 overflow-y-auto space-y-2' },
                ...searchResults.map(food => 
                    React.createElement('div', { 
                        key: food.fdcId,
                        className: 'border border-gray-200 rounded-xl p-3 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 cursor-pointer'
                    },
                        React.createElement('div', { className: 'flex justify-between items-start' },
                            React.createElement('div', { className: 'flex-1' },
                                React.createElement('h4', { className: 'font-semibold text-gray-800' }, food.description),
                                food.brandOwner && React.createElement('p', { className: 'text-sm text-gray-600' }, food.brandOwner),
                                React.createElement('div', { className: 'text-xs text-gray-500 mt-1' },
                                    `${Math.round(food.nutrients.calories || 0)} cal, ${Math.round(food.nutrients.protein || 0)}g protein per 100g`
                                ),
                                React.createElement('div', { className: 'text-xs font-medium mt-1' },
                                    React.createElement('span', { 
                                        className: `px-2 py-1 rounded-full ${
                                            food.source === 'usda' ? 'bg-green-100 text-green-700' :
                                            food.source === 'openfoodfacts' ? 'bg-blue-100 text-blue-700' :
                                            'bg-gray-100 text-gray-700'
                                        }`
                                    }, food.dataType || 'Unknown')
                                )
                            ),
                            React.createElement('button', {
                                onClick: () => addFood(food),
                                className: 'ml-4 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-sm rounded-lg font-semibold shadow-md transform hover:scale-105 transition-all duration-200'
                            }, 'Add')
                        )
                    )
                )
            ),

            showScanner && React.createElement(CameraScanner, {
                onScan: handleBarcodeScan,
                onClose: () => setShowScanner(false)
            })
        )
    );
};

// Enhanced macro display with better visuals
const MacroDisplay = ({ meals }) => {
    const calculateTotals = () => {
        const allFoods = [...meals.breakfast, ...meals.lunch, ...meals.dinner, ...meals.snacks];
        return allFoods.reduce((totals, food) => ({
            calories: totals.calories + (food.calories || 0),
            protein: totals.protein + (food.protein || 0),
            carbs: totals.carbs + (food.carbs || 0),
            fat: totals.fat + (food.fat || 0),
            fiber: totals.fiber + (food.fiber || 0),
            sodium: totals.sodium + (food.sodium || 0),
            sugar: totals.sugar + (food.sugar || 0)
        }), { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sodium: 0, sugar: 0 });
    };

    const totals = calculateTotals();
    const goals = getGoals();

    const getProgressColor = (current, goal) => {
        if (!goal) return 'bg-gray-300';
        const percentage = (current / goal) * 100;
        if (percentage < 50) return 'bg-red-400';
        if (percentage < 80) return 'bg-yellow-400';
        if (percentage <= 110) return 'bg-green-400';
        return 'bg-blue-400';
    };

    const getProgressPercentage = (current, goal) => {
        if (!goal) return 0;
        return Math.min((current / goal) * 100, 100);
    };

    return React.createElement('div', { className: 'bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20' },
        React.createElement('h3', { className: 'text-xl font-bold text-gray-800 mb-4 flex items-center' },
            React.createElement('span', { className: 'mr-2 text-2xl' }, '📊'),
            'Daily Nutrition Summary'
        ),

        React.createElement('div', { className: 'grid grid-cols-2 md:grid-cols-4 gap-4 mb-6' },
            React.createElement('div', { className: 'text-center p-4 bg-gradient-to-br from-blue-50 to-teal-50 rounded-xl border border-blue-200' },
                React.createElement('div', { className: 'text-2xl font-bold text-blue-600' }, Math.round(totals.calories)),
                React.createElement('div', { className: 'text-sm text-gray-600' }, 'Calories'),
                goals.calories && React.createElement('div', { className: 'text-xs text-blue-600 mt-1' }, 
                    `Goal: ${goals.calories}`
                )
            ),
            React.createElement('div', { className: 'text-center p-4 bg-gradient-to-br from-red-50 to-pink-50 rounded-xl border border-red-200' },
                React.createElement('div', { className: 'text-2xl font-bold text-red-600' }, `${Math.round(totals.protein)}g`),
                React.createElement('div', { className: 'text-sm text-gray-600' }, 'Protein'),
                goals.protein && React.createElement('div', { className: 'text-xs text-red-600 mt-1' }, 
                    `Goal: ${goals.protein}g`
                )
            ),
            React.createElement('div', { className: 'text-center p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border border-yellow-200' },
                React.createElement('div', { className: 'text-2xl font-bold text-yellow-600' }, `${Math.round(totals.carbs)}g`),
                React.createElement('div', { className: 'text-sm text-gray-600' }, 'Carbs'),
                goals.carbs && React.createElement('div', { className: 'text-xs text-yellow-600 mt-1' }, 
                    `Goal: ${goals.carbs}g`
                )
            ),
            React.createElement('div', { className: 'text-center p-4 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-200' },
                React.createElement('div', { className: 'text-2xl font-bold text-purple-600' }, `${Math.round(totals.fat)}g`),
                React.createElement('div', { className: 'text-sm text-gray-600' }, 'Fat'),
                goals.fat && React.createElement('div', { className: 'text-xs text-purple-600 mt-1' }, 
                    `Goal: ${goals.fat}g`
                )
            )
        ),

        // Progress bars
        goals.calories && React.createElement('div', { className: 'space-y-3' },
            React.createElement('div', null,
                React.createElement('div', { className: 'flex justify-between text-sm mb-1' },
                    React.createElement('span', null, 'Calories'),
                    React.createElement('span', null, `${Math.round(totals.calories)}/${goals.calories}`)
                ),
                React.createElement('div', { className: 'w-full bg-gray-200 rounded-full h-2' },
                    React.createElement('div', {
                        className: `h-2 rounded-full transition-all duration-500 ${getProgressColor(totals.calories, goals.calories)}`,
                        style: { width: `${getProgressPercentage(totals.calories, goals.calories)}%` }
                    })
                )
            ),
            
            goals.protein && React.createElement('div', null,
                React.createElement('div', { className: 'flex justify-between text-sm mb-1' },
                    React.createElement('span', null, 'Protein'),
                    React.createElement('span', null, `${Math.round(totals.protein)}g/${goals.protein}g`)
                ),
                React.createElement('div', { className: 'w-full bg-gray-200 rounded-full h-2' },
                    React.createElement('div', {
                        className: `h-2 rounded-full transition-all duration-500 ${getProgressColor(totals.protein, goals.protein)}`,
                        style: { width: `${getProgressPercentage(totals.protein, goals.protein)}%` }
                    })
                )
            )
        ),

        React.createElement('div', { className: 'mt-4 pt-4 border-t border-gray-200' },
            React.createElement('div', { className: 'grid grid-cols-3 gap-4 text-center text-sm' },
                React.createElement('div', null,
                    React.createElement('div', { className: 'font-semibold text-green-600' }, `${Math.round(totals.fiber)}g`),
                    React.createElement('div', { className: 'text-gray-600' }, 'Fiber')
                ),
                React.createElement('div', null,
                    React.createElement('div', { className: 'font-semibold text-cyan-600' }, `${Math.round(totals.sodium)}mg`),
                    React.createElement('div', { className: 'text-gray-600' }, 'Sodium')
                ),
                React.createElement('div', null,
                    React.createElement('div', { className: 'font-semibold text-pink-600' }, `${Math.round(totals.sugar)}g`),
                    React.createElement('div', { className: 'text-gray-600' }, 'Sugar')
                )
            )
        )
    );
};

// Enhanced meal section with better styling
const MealSection = ({ title, foods, onRemoveFood, onAddFood, mealType, emoji }) => {
    const [showSearch, setShowSearch] = React.useState(false);

    const mealCalories = foods.reduce((sum, food) => sum + (food.calories || 0), 0);
    const mealProtein = foods.reduce((sum, food) => sum + (food.protein || 0), 0);

    return React.createElement('div', { className: 'bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden' },
        React.createElement('div', { className: 'bg-gradient-to-r from-blue-500 via-blue-600 to-teal-600 text-white p-4' },
            React.createElement('div', { className: 'flex justify-between items-center' },
                React.createElement('h3', { className: 'text-lg font-bold flex items-center' },
                    React.createElement('span', { className: 'mr-2 text-xl' }, emoji),
                    title
                ),
                React.createElement('div', { className: 'text-right text-sm' },
                    React.createElement('div', null, `${Math.round(mealCalories)} cal`),
                    React.createElement('div', null, `${Math.round(mealProtein)}g protein`)
                )
            ),
            React.createElement('button', {
                onClick: () => setShowSearch(!showSearch),
                className: 'mt-3 w-full px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg font-semibold transition-all duration-200 backdrop-blur-sm'
            }, `${showSearch ? '✕ Close' : '+ Add Food'}`)
        ),

        showSearch && React.createElement('div', { className: 'p-4 border-b border-gray-200' },
            React.createElement(FoodSearchComponent, {
                onAddFood: onAddFood,
                mealType: mealType
            })
        ),

        React.createElement('div', { className: 'p-4' },
            foods.length === 0 ? 
                React.createElement('p', { className: 'text-gray-500 text-center py-8' }, `No foods added to ${title.toLowerCase()} yet`) :
                React.createElement('div', { className: 'space-y-3' },
                    ...foods.map(food => 
                        React.createElement('div', { 
                            key: food.id,
                            className: 'flex justify-between items-start p-3 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-200'
                        },
                            React.createElement('div', { className: 'flex-1' },
                                React.createElement('h4', { className: 'font-semibold text-gray-800' }, food.name),
                                food.brand && React.createElement('p', { className: 'text-sm text-gray-600' }, food.brand),
                                React.createElement('div', { className: 'text-sm text-gray-700 mt-1' },
                                    `${food.calories} cal • ${food.protein}g protein • ${food.carbs}g carbs • ${food.fat}g fat`
                                ),
                                food.servingSize && food.servingSize !== 100 && React.createElement('div', { className: 'text-xs text-gray-500 mt-1' },
                                    `Serving: ${food.servingSize}g`
                                )
                            ),
                            React.createElement('button', {
                                onClick: () => onRemoveFood(mealType, food.id),
                                className: 'ml-4 px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 text-sm rounded-lg font-medium transition-all duration-200'
                            }, 'Remove')
                        )
                    )
                )
        )
    );
};

// Get user goals from profile
const getGoals = () => {
    try {
        const habbtProfile = JSON.parse(localStorage.getItem('habbt_profile_data') || '{}');
        const fueliqProfile = JSON.parse(localStorage.getItem('fueliq_profile_data') || '{}'); // Fallback
        const profile = habbtProfile.goals || fueliqProfile.goals || {};
        
        return {
            calories: profile.calories || 2000,
            protein: profile.protein || 150,
            carbs: profile.carbs || 250,
            fat: profile.fat || 67
        };
    } catch (e) {
        return { calories: 2000, protein: 150, carbs: 250, fat: 67 };
    }
};

// AI meal suggestions based on current intake
const AITips = ({ meals }) => {
    const totals = Object.values(meals).flat().reduce((acc, food) => ({
        calories: acc.calories + (food.calories || 0),
        protein: acc.protein + (food.protein || 0),
        carbs: acc.carbs + (food.carbs || 0),
        fat: acc.fat + (food.fat || 0)
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

    const goals = getGoals();
    const suggestions = [];

    if (totals.protein < goals.protein * 0.8) {
        suggestions.push({
            type: 'protein',
            message: `You're ${Math.round(goals.protein - totals.protein)}g short on protein. Try adding Greek yogurt, chicken breast, or protein powder.`,
            icon: '🥩'
        });
    }

    if (totals.calories < goals.calories * 0.6) {
        suggestions.push({
            type: 'calories',
            message: `Your intake is quite low at ${Math.round(totals.calories)} calories. Consider adding healthy fats like nuts or avocado.`,
            icon: '🥑'
        });
    }

    if (totals.carbs < goals.carbs * 0.5 && totals.protein > goals.protein * 0.8) {
        suggestions.push({
            type: 'carbs',
            message: 'Great protein intake! Add some complex carbs like quinoa or sweet potato for energy.',
            icon: '🍠'
        });
    }

    if (suggestions.length === 0) {
        suggestions.push({
            type: 'positive',
            message: 'Your nutrition is looking balanced! Keep up the great habits! 🌟',
            icon: '✨'
        });
    }

    return React.createElement('div', { className: 'bg-gradient-to-r from-blue-50 to-teal-50 rounded-2xl p-4 border border-blue-200' },
        React.createElement('h3', { className: 'text-lg font-bold text-blue-800 mb-3 flex items-center' },
            React.createElement('span', { className: 'mr-2 text-xl' }, '🤖'),
            'AI Nutrition Coach'
        ),
        React.createElement('div', { className: 'space-y-2' },
            ...suggestions.map((tip, index) => 
                React.createElement('div', { 
                    key: index,
                    className: 'flex items-start space-x-3 p-3 bg-white/60 rounded-lg'
                },
                    React.createElement('span', { className: 'text-lg' }, tip.icon),
                    React.createElement('p', { className: 'text-sm text-blue-700 leading-relaxed' }, tip.message)
                )
            )
        )
    );
};

// Main nutrition component
const NutritionTracker = () => {
    const [currentDate, setCurrentDate] = React.useState(new Date().toISOString().split('T')[0]);
    const [meals, setMeals] = React.useState(loadMealData(currentDate));

    React.useEffect(() => {
        setMeals(loadMealData(currentDate));
    }, [currentDate]);

    React.useEffect(() => {
        saveMealData(currentDate, meals);
    }, [meals, currentDate]);

    const addFood = (mealType, food) => {
        setMeals(prev => ({
            ...prev,
            [mealType]: [...prev[mealType], food]
        }));
    };

    const removeFood = (mealType, foodId) => {
        setMeals(prev => ({
            ...prev,
            [mealType]: prev[mealType].filter(food => food.id !== foodId)
        }));
    };

    const navigateDate = (direction) => {
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() + direction);
        setCurrentDate(newDate.toISOString().split('T')[0]);
    };

    const isToday = currentDate === new Date().toISOString().split('T')[0];

    return React.createElement('div', { className: 'min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-cyan-50' },
        React.createElement('div', { className: 'max-w-7xl mx-auto p-6' },
            // Header
            React.createElement('div', { className: 'bg-gradient-to-r from-blue-600 to-teal-600 rounded-3xl shadow-2xl p-8 mb-8 text-white' },
                React.createElement('div', { className: 'text-center' },
                    React.createElement('h1', { className: 'text-4xl font-bold mb-2' }, '🍽️ Nutrition Habits'),
                    React.createElement('p', { className: 'text-xl opacity-90 mb-4' }, 'Track your daily nutrition for better habits'),
                    
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
                                max: new Date().toISOString().split('T')[0],
                                className: 'bg-transparent text-white font-semibold focus:outline-none'
                            })
                        ),
                        React.createElement('button', {
                            onClick: () => navigateDate(1),
                            disabled: isToday,
                            className: `px-4 py-2 ${isToday ? 'bg-gray-500 cursor-not-allowed' : 'bg-white/20 hover:bg-white/30'} rounded-lg font-semibold transition-all duration-200 backdrop-blur-sm`
                        }, 'Next →')
                    )
                )
            ),

            // Macro Summary and AI Tips
            React.createElement('div', { className: 'grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8' },
                React.createElement(MacroDisplay, { meals }),
                React.createElement(AITips, { meals })
            ),

            // Meal Sections
            React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-6' },
                React.createElement(MealSection, {
                    title: 'Breakfast',
                    foods: meals.breakfast,
                    onRemoveFood: removeFood,
                    onAddFood: addFood,
                    mealType: 'breakfast',
                    emoji: '🌅'
                }),
                React.createElement(MealSection, {
                    title: 'Lunch',
                    foods: meals.lunch,
                    onRemoveFood: removeFood,
                    onAddFood: addFood,
                    mealType: 'lunch',
                    emoji: '☀️'
                }),
                React.createElement(MealSection, {
                    title: 'Dinner',
                    foods: meals.dinner,
                    onRemoveFood: removeFood,
                    onAddFood: addFood,
                    mealType: 'dinner',
                    emoji: '🌙'
                }),
                React.createElement(MealSection, {
                    title: 'Snacks',
                    foods: meals.snacks,
                    onRemoveFood: removeFood,
                    onAddFood: addFood,
                    mealType: 'snacks',
                    emoji: '🍿'
                })
            )
        )
    );
};

// Export for integration with both Habbt and FuelIQ (backward compatibility)
const renderNutritionTab = (containerId) => {
    const container = document.getElementById(containerId);
    if (container) {
        ReactDOM.render(React.createElement(NutritionTracker), container);
    }
};

// Make available globally with both naming conventions
window.HabbtNutrition = {
    NutritionTracker,
    renderNutritionTab
};

// Backward compatibility
window.FuelIQMeals = window.HabbtNutrition;

console.log('✅ Habbt Nutrition tab loaded - Complete rebranded version with beautiful blue-teal design');
// Enhanced Habbt Compatibility Layer
(function() {
    console.log('🔧 Creating enhanced nutrition compatibility...');
    
    // Wait for React and ReactDOM to be available
    function waitForDependencies() {
        return typeof React !== 'undefined' && typeof ReactDOM !== 'undefined';
    }
    
    function createNutritionCompatibility() {
        if (!waitForDependencies()) {
            console.warn('❌ React dependencies not ready for nutrition module');
            return false;
        }
        
        // Create all the expected global references
        if (typeof renderNutritionTab === 'function') {
            console.log('✅ renderNutritionTab function available');
            
            // Ensure all possible naming conventions work
            window.renderMealsTab = renderNutritionTab;
            window.renderHabbtNutrition = renderNutritionTab;
            window.renderHabbtMeals = renderNutritionTab;
            
            console.log('✅ All nutrition render functions created');
            return true;
        } else {
            console.error('❌ renderNutritionTab function not found');
            return false;
        }
    }
    
    // Try immediate setup
    if (!createNutritionCompatibility()) {
        // Wait for dependencies
        let attempts = 0;
        const maxAttempts = 30;
        
        const interval = setInterval(() => {
            attempts++;
            console.log(`🔄 Nutrition compatibility attempt ${attempts}/30...`);
            
            if (createNutritionCompatibility() || attempts >= maxAttempts) {
                clearInterval(interval);
                
                if (attempts >= maxAttempts) {
                    console.error('❌ Nutrition compatibility failed after 30 attempts');
                } else {
                    console.log('✅ Nutrition compatibility setup complete!');
                }
            }
        }, 100);
    }
})();

console.log('🍽️ Habbt Nutrition module fully loaded with enhanced compatibility');
