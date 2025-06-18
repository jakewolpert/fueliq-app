// Enhanced Meals Tab with Natural Language Food Descriptions
// Adds a "Describe" tab for convenient meal logging

(function() {
    'use strict';

    console.log('🔧 Loading enhanced meals system with natural language descriptions...');

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

    // Open Food Facts API for barcode scanning
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
                    confidence: 'high',
                    image: product.image_url || null
                };
            }
            return null;
        } catch (error) {
            console.error('Error searching barcode:', error);
            return null;
        }
    };

    // Barcode scanner functionality (using device camera)
    const startBarcodeScanner = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { 
                    facingMode: 'environment' // Use back camera
                } 
            });
            
            return stream;
        } catch (error) {
            console.error('Error accessing camera:', error);
            throw error;
        }
    };
    const commonFoods = {
        // Breakfast items
        'eggs': { calories: 70, protein: 6, carbs: 1, fat: 5 },
        'toast': { calories: 80, protein: 3, carbs: 15, fat: 1 },
        'bacon': { calories: 43, protein: 3, carbs: 0, fat: 3.3 },
        'pancakes': { calories: 227, protein: 6, carbs: 28, fat: 9 },
        'oatmeal': { calories: 147, protein: 5, carbs: 28, fat: 3 },
        'cereal': { calories: 100, protein: 3, carbs: 22, fat: 1 },
        'yogurt': { calories: 100, protein: 6, carbs: 16, fat: 2 },
        'bagel': { calories: 245, protein: 10, carbs: 48, fat: 2 },
        
        // Lunch/Dinner mains
        'chicken breast': { calories: 165, protein: 31, carbs: 0, fat: 3.6 },
        'salmon': { calories: 208, protein: 22, carbs: 0, fat: 12 },
        'steak': { calories: 271, protein: 26, carbs: 0, fat: 19 },
        'pork chop': { calories: 231, protein: 23, carbs: 0, fat: 14 },
        'hamburger': { calories: 540, protein: 25, carbs: 40, fat: 31 },
        'cheeseburger': { calories: 535, protein: 26, carbs: 40, fat: 30 },
        'pizza slice': { calories: 285, protein: 12, carbs: 36, fat: 10 },
        'hot dog': { calories: 150, protein: 5, carbs: 2, fat: 13 },
        'sandwich': { calories: 320, protein: 15, carbs: 35, fat: 14 },
        'pasta': { calories: 220, protein: 8, carbs: 44, fat: 1 },
        'spaghetti': { calories: 220, protein: 8, carbs: 44, fat: 1 },
        'rice': { calories: 205, protein: 4, carbs: 45, fat: 0.5 },
        'fried rice': { calories: 238, protein: 4, carbs: 34, fat: 10 },
        
        // Sides & vegetables
        'french fries': { calories: 365, protein: 4, carbs: 63, fat: 17 },
        'salad': { calories: 33, protein: 3, carbs: 6, fat: 0 },
        'caesar salad': { calories: 170, protein: 3, carbs: 5, fat: 15 },
        'mashed potatoes': { calories: 214, protein: 4, carbs: 35, fat: 9 },
        'broccoli': { calories: 25, protein: 3, carbs: 5, fat: 0 },
        'green beans': { calories: 31, protein: 2, carbs: 7, fat: 0 },
        'corn': { calories: 86, protein: 3, carbs: 19, fat: 1 },
        
        // Popular restaurant items
        'big mac': { calories: 563, protein: 26, carbs: 45, fat: 33 },
        'whopper': { calories: 677, protein: 28, carbs: 49, fat: 40 },
        'chicken nuggets': { calories: 280, protein: 13, carbs: 16, fat: 18 },
        'taco': { calories: 170, protein: 8, carbs: 13, fat: 10 },
        'burrito': { calories: 450, protein: 15, carbs: 65, fat: 15 },
        'subway sandwich': { calories: 350, protein: 18, carbs: 45, fat: 12 },
        'chipotle bowl': { calories: 500, protein: 25, carbs: 45, fat: 25 },
        
        // Snacks & desserts
        'apple': { calories: 95, protein: 0, carbs: 25, fat: 0 },
        'banana': { calories: 105, protein: 1, carbs: 27, fat: 0 },
        'orange': { calories: 62, protein: 1, carbs: 15, fat: 0 },
        'chips': { calories: 152, protein: 2, carbs: 15, fat: 10 },
        'cookies': { calories: 142, protein: 2, carbs: 20, fat: 7 },
        'ice cream': { calories: 137, protein: 2, carbs: 16, fat: 7 },
        'chocolate': { calories: 150, protein: 2, carbs: 16, fat: 9 },
        
        // Drinks
        'soda': { calories: 140, protein: 0, carbs: 39, fat: 0 },
        'beer': { calories: 150, protein: 1, carbs: 13, fat: 0 },
        'wine': { calories: 125, protein: 0, carbs: 4, fat: 0 },
        'coffee': { calories: 2, protein: 0, carbs: 0, fat: 0 },
        'latte': { calories: 190, protein: 12, carbs: 18, fat: 7 }
    };

    // Portion size multipliers
    const portionSizes = {
        'small': 0.7,
        'medium': 1.0,
        'large': 1.4,
        'extra large': 1.8,
        'huge': 2.0,
        '1': 1.0,
        '2': 2.0,
        '3': 3.0,
        '4': 4.0,
        'half': 0.5,
        'quarter': 0.25
    };

    // Natural Language Food Parser
    const parseDescription = (description) => {
        console.log('🤖 Parsing description:', description);
        
        const foods = [];
        const text = description.toLowerCase().trim();
        
        // Look for portion indicators
        let portionMultiplier = 1.0;
        for (const [size, multiplier] of Object.entries(portionSizes)) {
            if (text.includes(size)) {
                portionMultiplier = multiplier;
                break;
            }
        }
        
        // Look for numbers (2 slices, 3 tacos, etc.)
        const numberMatch = text.match(/(\d+)\s*(slice|slices|piece|pieces|taco|tacos|cup|cups|bowl|bowls)?/);
        if (numberMatch) {
            const number = parseInt(numberMatch[1]);
            if (number > 0 && number <= 10) {
                portionMultiplier = number;
            }
        }
        
        // Search for known foods in the description
        for (const [foodName, nutrition] of Object.entries(commonFoods)) {
            if (text.includes(foodName)) {
                const estimatedFood = {
                    id: Date.now() + Math.random(),
                    name: `${foodName} (estimated)`,
                    servingSize: 100 * portionMultiplier,
                    calories: nutrition.calories,
                    protein: nutrition.protein,
                    carbs: nutrition.carbs,
                    fat: nutrition.fat,
                    fiber: nutrition.fiber || 2,
                    source: 'Natural Language',
                    confidence: 'medium'
                };
                foods.push(estimatedFood);
            }
        }
        
        // Special handling for common restaurant combinations
        if (text.includes('burger') && text.includes('fries')) {
            foods.push({
                id: Date.now() + Math.random(),
                name: 'Burger & Fries Combo (estimated)',
                servingSize: 100,
                calories: 800,
                protein: 30,
                carbs: 75,
                fat: 40,
                fiber: 4,
                source: 'Combo Estimate',
                confidence: 'medium'
            });
        }
        
        if (text.includes('pizza') && !foods.find(f => f.name.includes('pizza'))) {
            const sliceCount = numberMatch ? parseInt(numberMatch[1]) : 2;
            foods.push({
                id: Date.now() + Math.random(),
                name: `${sliceCount} Pizza Slices (estimated)`,
                servingSize: 100,
                calories: 285 * sliceCount,
                protein: 12 * sliceCount,
                carbs: 36 * sliceCount,
                fat: 10 * sliceCount,
                fiber: 2 * sliceCount,
                source: 'Pizza Estimate',
                confidence: 'medium'
            });
        }
        
        // If no specific foods found, create a general estimate
        if (foods.length === 0) {
            foods.push({
                id: Date.now() + Math.random(),
                name: `"${description}" (rough estimate)`,
                servingSize: 100,
                calories: 400,
                protein: 20,
                carbs: 45,
                fat: 15,
                fiber: 3,
                source: 'General Estimate',
                confidence: 'low'
            });
        }
        
        console.log('🎯 Parsed foods:', foods);
        return foods;
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
        
        // Always save to localStorage first for immediate access
        if (isLocalStorageAvailable()) {
            try {
                localStorage.setItem(key, data);
                console.log(`💾 Meals saved locally for ${date}`);
            } catch (e) {
                console.warn('localStorage failed, using memory storage:', e);
                memoryStorage[key] = data;
            }
        } else {
            memoryStorage[key] = data;
        }

        // Also save to a "sync queue" for Firebase when it comes back online
        try {
            const syncQueue = JSON.parse(localStorage.getItem('meals_sync_queue') || '[]');
            const existingIndex = syncQueue.findIndex(item => item.date === date);
            
            if (existingIndex >= 0) {
                syncQueue[existingIndex] = { date, meals, timestamp: Date.now() };
            } else {
                syncQueue.push({ date, meals, timestamp: Date.now() });
            }
            
            // Keep only last 30 days in sync queue
            const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
            const filteredQueue = syncQueue.filter(item => item.timestamp > thirtyDaysAgo);
            
            localStorage.setItem('meals_sync_queue', JSON.stringify(filteredQueue));
        } catch (e) {
            console.warn('Could not save to sync queue:', e);
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

    // Enhanced Food Search Component with Natural Language Tab
    const EnhancedFoodSearch = ({ onAddFood, onClose }) => {
        const [activeTab, setActiveTab] = React.useState('search');
        const [query, setQuery] = React.useState('');
        const [results, setResults] = React.useState([]);
        const [loading, setLoading] = React.useState(false);
        const [recentFoods, setRecentFoods] = React.useState(loadRecentFoods());
        
        // Natural language description state
        const [description, setDescription] = React.useState('');
        const [parsedFoods, setParsedFoods] = React.useState([]);
        const [parseLoading, setParseLoading] = React.useState(false);

        // Barcode scanner state
        const [isScanning, setIsScanning] = React.useState(false);
        const [scannedProducts, setScannedProducts] = React.useState([]);
        const [scanLoading, setScanLoading] = React.useState(false);
        const [cameraError, setCameraError] = React.useState(null);

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
            }, 500); // Small delay for better UX
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
                // If not found in Open Food Facts, create a manual entry prompt
                setScannedProducts(prev => [{
                    id: Date.now(),
                    name: `Product ${barcode}`,
                    barcode: barcode,
                    servingSize: 100,
                    calories: 0,
                    protein: 0,
                    carbs: 0,
                    fat: 0,
                    fiber: 0,
                    source: 'Manual Entry Needed',
                    confidence: 'unknown',
                    needsManualEntry: true
                }, ...prev]);
            }
            setScanLoading(false);
        };

        const startScanning = async () => {
            try {
                setCameraError(null);
                setIsScanning(true);
                
                // For demo purposes, we'll simulate barcode scanning
                // In a real implementation, you'd integrate with a barcode scanning library
                // like QuaggaJS or ZXing
                
            } catch (error) {
                setCameraError('Unable to access camera. Please ensure camera permissions are enabled.');
                setIsScanning(false);
            }
        };

        const stopScanning = () => {
            setIsScanning(false);
        };

        const handleManualBarcodeEntry = (barcode) => {
            if (barcode && barcode.length >= 8) {
                handleScanBarcode(barcode);
            }
        };
            const updatedRecent = [food, ...recentFoods.filter(f => f.id !== food.id)];
            setRecentFoods(updatedRecent);
            saveRecentFoods(updatedRecent);
            
            onAddFood(food);
            onClose();
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
                                    className: 'flex justify-between items-center p-3 border border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer'
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
                                            className: 'bg-blue-500 text-white px-3 py-1 rounded-lg text-sm' 
                                        }, 'Add')
                                    )
                                )
                            )
                    ),

                    // NEW: Describe Tab
                    activeTab === 'describe' && React.createElement('div', null,
                        React.createElement('div', { className: 'bg-blue-50 p-4 rounded-lg mb-4' },
                            React.createElement('div', { className: 'flex items-center gap-2 mb-2' },
                                React.createElement('span', { className: 'text-blue-600 text-lg' }, '💡'),
                                React.createElement('span', { className: 'font-semibold text-blue-800' }, 'Smart Meal Estimation')
                            ),
                            React.createElement('p', { className: 'text-sm text-blue-700' }, 
                                'Describe what you ate and we\'ll estimate the nutrition. Great for restaurant meals, social dining, or quick logging!'
                            )
                        ),

                        React.createElement('textarea', {
                            placeholder: 'Describe what you ate...\n\nExamples:\n• "Chicken Caesar salad with garlic bread"\n• "2 slices pepperoni pizza and a Coke"\n• "Big Mac meal with medium fries"\n• "Homemade spaghetti with meatballs"',
                            value: description,
                            onChange: (e) => setDescription(e.target.value),
                            className: 'w-full h-32 p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-blue-500 resize-none',
                            rows: 4
                        }),

                        React.createElement('button', {
                            onClick: handleParseDescription,
                            disabled: !description.trim() || parseLoading,
                            className: `w-full bg-gradient-to-r from-blue-500 to-teal-600 hover:from-blue-600 hover:to-teal-700 text-white px-4 py-3 rounded-lg transition-all font-semibold mb-4 ${
                                (!description.trim() || parseLoading) ? 'opacity-50 cursor-not-allowed' : ''
                            }`
                        }, parseLoading ? 'Analyzing...' : '🤖 Estimate Nutrition'),

                        parseLoading && React.createElement('div', { className: 'text-center py-4' },
                            React.createElement('div', { className: 'animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto' })
                        ),

                        parsedFoods.length > 0 && React.createElement('div', { className: 'space-y-3' },
                            React.createElement('div', { className: 'border-t pt-4' },
                                React.createElement('h4', { className: 'font-semibold text-gray-800 mb-3' }, 'Estimated Foods:')
                            ),
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

                    // NEW: Scan Tab
                    activeTab === 'scan' && React.createElement('div', null,
                        React.createElement('div', { className: 'bg-blue-50 p-4 rounded-lg mb-4' },
                            React.createElement('div', { className: 'flex items-center gap-2 mb-2' },
                                React.createElement('span', { className: 'text-blue-600 text-lg' }, '📱'),
                                React.createElement('span', { className: 'font-semibold text-blue-800' }, 'Barcode Scanner')
                            ),
                            React.createElement('p', { className: 'text-sm text-blue-700' }, 
                                'Scan product barcodes for precise nutrition information from packaged foods.'
                            )
                        ),

                        // Manual barcode entry
                        React.createElement('div', { className: 'mb-4' },
                            React.createElement('label', { className: 'block text-sm font-semibold text-gray-700 mb-2' }, 'Enter Barcode Manually:'),
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
                                    className: 'bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-all'
                                }, 'Look Up')
                            )
                        ),

                        // Camera scanner section
                        React.createElement('div', { className: 'border-t pt-4 mb-4' },
                            React.createElement('div', { className: 'text-center' },
                                !isScanning ? 
                                    React.createElement('div', null,
                                        React.createElement('div', { className: 'text-4xl mb-2' }, '📸'),
                                        React.createElement('p', { className: 'text-gray-600 mb-4' }, 'Use your camera to scan product barcodes'),
                                        React.createElement('button', {
                                            onClick: startScanning,
                                            className: 'bg-gradient-to-r from-blue-500 to-teal-600 hover:from-blue-600 hover:to-teal-700 text-white px-6 py-3 rounded-lg transition-all font-semibold'
                                        }, '📱 Start Camera Scanner'),
                                        cameraError && React.createElement('div', { className: 'mt-3 p-3 bg-red-100 text-red-700 rounded-lg text-sm' }, cameraError)
                                    ) :
                                    React.createElement('div', { className: 'bg-gray-100 rounded-lg p-8' },
                                        React.createElement('div', { className: 'text-4xl mb-2' }, '🎥'),
                                        React.createElement('p', { className: 'text-gray-600 mb-4' }, 'Camera scanning active...'),
                                        React.createElement('p', { className: 'text-sm text-gray-500 mb-4' }, 'Point your camera at a product barcode'),
                                        React.createElement('button', {
                                            onClick: stopScanning,
                                            className: 'bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-all'
                                        }, 'Stop Scanning'),
                                        React.createElement('div', { className: 'mt-4 text-xs text-gray-500' }, 
                                            'Note: This is a demo interface. In production, camera preview would appear here.'
                                        )
                                    )
                            )
                        ),

                        // Scan loading
                        scanLoading && React.createElement('div', { className: 'text-center py-4' },
                            React.createElement('div', { className: 'animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto mb-2' }),
                            React.createElement('p', { className: 'text-sm text-gray-600' }, 'Looking up product...')
                        ),

                        // Scanned products
                        scannedProducts.length > 0 && React.createElement('div', { className: 'space-y-3' },
                            React.createElement('div', { className: 'border-t pt-4' },
                                React.createElement('h4', { className: 'font-semibold text-gray-800 mb-3' }, 'Scanned Products:')
                            ),
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
                                        React.createElement('div', { className: 'bg-yellow-100 p-2 rounded text-sm' },
                                            React.createElement('p', { className: 'text-yellow-800' }, 'Product not found in database. You can:'),
                                            React.createElement('ul', { className: 'text-yellow-700 mt-1 ml-4' },
                                                React.createElement('li', null, '• Enter nutrition info manually'),
                                                React.createElement('li', null, '• Use the Search tab to find similar items'),
                                                React.createElement('li', null, '• Try the Describe tab instead')
                                            )
                                        )
                                )
                            )
                        ),

                        // Demo barcode suggestions
                        scannedProducts.length === 0 && !scanLoading && React.createElement('div', { className: 'border-t pt-4 mt-4' },
                            React.createElement('h4', { className: 'font-semibold text-gray-700 mb-3' }, 'Try these demo barcodes:'),
                            React.createElement('div', { className: 'grid grid-cols-1 gap-2' },
                                React.createElement('button', {
                                    onClick: () => handleManualBarcodeEntry('7622210771704'),
                                    className: 'text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors'
                                },
                                    React.createElement('div', { className: 'font-medium' }, 'Nutella (7622210771704)'),
                                    React.createElement('div', { className: 'text-sm text-gray-600' }, 'Chocolate hazelnut spread')
                                ),
                                React.createElement('button', {
                                    onClick: () => handleManualBarcodeEntry('8076800105987'),
                                    className: 'text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors'
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

    // Progress Bar Component - Updated with blue/teal colors
    const ProgressBar = ({ label, current, goal, unit, color = 'blue' }) => {
        const percentage = goal > 0 ? Math.min((current / goal) * 100, 100) : 0;
        const colorClasses = {
            orange: 'bg-orange-500',
            red: 'bg-red-500',
            green: 'bg-green-500',
            blue: 'bg-blue-500',
            teal: 'bg-teal-500'
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
            const defaultGoals = {
                calories: 2000,
                protein: 150,
                carbs: 250,
                fat: 67
            };

            // Try multiple localStorage keys and Firebase fallback
            if (isLocalStorageAvailable()) {
                try {
                    const possibleKeys = [
                        'fueliq_user_goals', 
                        'habbt_profile_data', 
                        'fueliq_profile_data',
                        'unified_goals_data',
                        'user_profile_data'
                    ];
                    
                    for (const key of possibleKeys) {
                        const data = localStorage.getItem(key);
                        if (data) {
                            const parsed = JSON.parse(data);
                            
                            const goals = {
                                calories: parsed.calories || parsed.dailyCalories || (parsed.goals && parsed.goals.calories) || defaultGoals.calories,
                                protein: parsed.protein || (parsed.goals && parsed.goals.protein) || defaultGoals.protein,
                                carbs: parsed.carbs || parsed.carbohydrates || (parsed.goals && parsed.goals.carbs) || defaultGoals.carbs,
                                fat: parsed.fat || (parsed.goals && parsed.goals.fat) || defaultGoals.fat
                            };
                            
                            console.log(`✅ Loaded user goals from ${key}:`, goals);
                            return goals;
                        }
                    }
                    
                    console.log('⚠️ No saved goals found, using defaults');
                    return defaultGoals;
                } catch (e) {
                    console.warn('Failed to load user goals from localStorage:', e);
                    return defaultGoals;
                }
            } else {
                console.log('📱 localStorage unavailable, using defaults');
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
            try {
                const dateStr = formatDate(currentDate);
                const loadedMeals = loadMealData(dateStr);
                setMeals(loadedMeals);
            } catch (error) {
                console.error('Error loading meal data:', error);
                // Fallback to empty meals if loading fails
                setMeals({
                    breakfast: [], lunch: [], dinner: [], snacks: []
                });
            }
        }, [currentDate]);

        React.useEffect(() => {
            try {
                saveMealData(formatDate(currentDate), meals);
            } catch (error) {
                console.error('Error saving meal data:', error);
            }
        }, [meals, currentDate]);

        const addFoodToMeal = (mealType, food) => {
            try {
                setMeals(prev => ({
                    ...prev,
                    [mealType]: [...prev[mealType], food]
                }));
                console.log(`✅ Added ${food.name} to ${mealType}`);
            } catch (error) {
                console.error('Error adding food to meal:', error);
            }
        };

        const removeFoodFromMeal = (mealType, foodId) => {
            try {
                setMeals(prev => ({
                    ...prev,
                    [mealType]: prev[mealType].filter(food => food.id !== foodId)
                }));
                console.log(`🗑️ Removed food from ${mealType}`);
            } catch (error) {
                console.error('Error removing food from meal:', error);
            }
        };

        const updateFoodServing = (mealType, foodId, newServing) => {
            try {
                setMeals(prev => ({
                    ...prev,
                    [mealType]: prev[mealType].map(food => 
                        food.id === foodId ? { ...food, servingSize: newServing } : food
                    )
                }));
                console.log(`📏 Updated serving size for food in ${mealType}`);
            } catch (error) {
                console.error('Error updating food serving:', error);
            }
        };

        const allFoods = [...(meals.breakfast || []), ...(meals.lunch || []), ...(meals.dinner || []), ...(meals.snacks || [])];
        let dailyTotals;
        
        try {
            dailyTotals = calculateNutrition(allFoods);
        } catch (error) {
            console.error('Error calculating nutrition:', error);
            dailyTotals = { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };
        }

        const changeDate = (days) => {
            try {
                const newDate = new Date(currentDate);
                newDate.setDate(newDate.getDate() + days);
                setCurrentDate(newDate);
                console.log(`📅 Changed date to: ${newDate.toLocaleDateString()}`);
            } catch (error) {
                console.error('Error changing date:', error);
            }
        };

        const isToday = formatDate(currentDate) === formatDate(new Date());

        return React.createElement('div', { className: 'max-w-6xl mx-auto p-6' },
            // Header (updated to blue/teal Habbt branding)
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

            // Progress Bars with blue/teal colors
            React.createElement('div', { className: 'bg-white rounded-xl p-6 mb-6 shadow-lg' },
                React.createElement('h2', { className: 'text-xl font-bold text-gray-800 mb-4' }, 'Daily Progress'),
                React.createElement(ProgressBar, { 
                    label: 'Calories', 
                    current: dailyTotals.calories, 
                    goal: dailyGoals.calories, 
                    unit: '', 
                    color: 'blue' 
                }),
                React.createElement(ProgressBar, { 
                    label: 'Protein', 
                    current: dailyTotals.protein, 
                    goal: dailyGoals.protein, 
                    unit: 'g', 
                    color: 'teal' 
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
                    color: 'teal' 
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

    // Safe rendering system that prevents React conflicts
    let safeRenderingActive = false;
    let contentVerificationId = null;

    const safeRenderMealsTab = (containerId = 'meals-container') => {
        console.log('🔧 Safe rendering enhanced meals tab...');
        
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
            console.log('✅ Enhanced meals tab rendered successfully with natural language support');
            
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

    // Override the problematic functions with ultra-safe versions
    window.tryRenderMeals = ultraSafeRenderMealsTab;
    window.renderMeals = ultraSafeRenderMealsTab;
    window.renderMealsTab = ultraSafeRenderMealsTab;

    // Export enhanced system with ultra-safe rendering
    window.FuelIQMeals = {
        SafeMealsTab,
        renderMealsTab: ultraSafeRenderMealsTab,
        parseDescription,
        searchByBarcode,
        cleanup: () => {
            if (window.ultraSafeMealsCleanup) {
                window.ultraSafeMealsCleanup();
            }
        }
    };

    // Also export as Habbt for compatibility
    window.HabbtMeals = window.FuelIQMeals;

    console.log('🎯 Enhanced meals system loaded with ultra-safe rendering!');
    console.log('💭 Features: Natural language descriptions + Barcode scanning + Ultra-safe mounting');
    console.log('🛡️ Ultra-persistent recovery system active - meals tab will stay loaded!');

})();
