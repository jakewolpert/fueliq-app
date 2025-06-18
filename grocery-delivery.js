// COMPLETE Habbt-Branded Delivery Tab with Safe Mounting
// Beautiful Blue/Teal Design + Ultra-Safe Loading + Full Functionality

(function() {
    'use strict';

    console.log('🚚 Loading Habbt Smart Delivery system...');

    // Delivery Services with Enhanced Data
    const DELIVERY_SERVICES = {
        instacart: {
            name: 'Instacart',
            logo: '🛒',
            deliveryFee: 5.99,
            minOrder: 35,
            deliveryTime: '1-2 hours',
            coverage: ['Whole Foods', 'Safeway', 'Costco', 'Target'],
            rating: 4.7,
            color: 'from-green-500 to-emerald-600'
        },
        amazon_fresh: {
            name: 'Amazon Fresh',
            logo: '📦',
            deliveryFee: 0, // Free with Prime
            minOrder: 35,
            deliveryTime: '2-4 hours',
            coverage: ['Amazon Fresh Stores'],
            rating: 4.5,
            color: 'from-orange-500 to-amber-600'
        },
        walmart: {
            name: 'Walmart Grocery',
            logo: '🟨',
            deliveryFee: 7.95,
            minOrder: 35,
            deliveryTime: '1-3 hours',
            coverage: ['Walmart Supercenter'],
            rating: 4.3,
            color: 'from-blue-500 to-indigo-600'
        },
        target: {
            name: 'Target Shipt',
            logo: '🎯',
            deliveryFee: 5.99,
            minOrder: 35,
            deliveryTime: '1-2 hours',
            coverage: ['Target', 'CVS', 'Petco'],
            rating: 4.6,
            color: 'from-red-500 to-pink-600'
        }
    };

    // Comprehensive Product Database
    const PRODUCT_DATABASE = {
        // Proteins
        'chicken breast': {
            name: 'Organic Chicken Breast',
            category: 'protein',
            prices: {
                instacart: { price: 8.99, unit: 'lb', store: 'Whole Foods' },
                amazon_fresh: { price: 7.49, unit: 'lb', store: 'Amazon Fresh' },
                walmart: { price: 5.98, unit: 'lb', store: 'Walmart' },
                target: { price: 7.99, unit: 'lb', store: 'Target' }
            },
            image: '🍗',
            organic: true,
            inStock: true
        },
        'salmon fillet': {
            name: 'Fresh Atlantic Salmon Fillet',
            category: 'protein',
            prices: {
                instacart: { price: 14.99, unit: 'lb', store: 'Whole Foods' },
                amazon_fresh: { price: 12.99, unit: 'lb', store: 'Amazon Fresh' },
                walmart: { price: 11.98, unit: 'lb', store: 'Walmart' },
                target: { price: 13.99, unit: 'lb', store: 'Target' }
            },
            image: '🐟',
            organic: false,
            inStock: true
        },
        'eggs': {
            name: 'Organic Free-Range Eggs',
            category: 'protein',
            prices: {
                instacart: { price: 6.99, unit: 'dozen', store: 'Whole Foods' },
                amazon_fresh: { price: 5.49, unit: 'dozen', store: 'Amazon Fresh' },
                walmart: { price: 3.98, unit: 'dozen', store: 'Walmart' },
                target: { price: 5.99, unit: 'dozen', store: 'Target' }
            },
            image: '🥚',
            organic: true,
            inStock: true
        },
        'ground turkey': {
            name: 'Organic Ground Turkey',
            category: 'protein',
            prices: {
                instacart: { price: 9.99, unit: 'lb', store: 'Whole Foods' },
                amazon_fresh: { price: 8.49, unit: 'lb', store: 'Amazon Fresh' },
                walmart: { price: 6.98, unit: 'lb', store: 'Walmart' },
                target: { price: 8.99, unit: 'lb', store: 'Target' }
            },
            image: '🦃',
            organic: true,
            inStock: true
        },

        // Vegetables
        'bell peppers': {
            name: 'Organic Bell Pepper Variety Pack',
            category: 'vegetables',
            prices: {
                instacart: { price: 5.99, unit: 'pack', store: 'Whole Foods' },
                amazon_fresh: { price: 4.99, unit: 'pack', store: 'Amazon Fresh' },
                walmart: { price: 3.98, unit: 'pack', store: 'Walmart' },
                target: { price: 5.49, unit: 'pack', store: 'Target' }
            },
            image: '🫑',
            organic: true,
            inStock: true
        },
        'tomatoes': {
            name: 'Organic Roma Tomatoes',
            category: 'vegetables',
            prices: {
                instacart: { price: 4.99, unit: 'lb', store: 'Whole Foods' },
                amazon_fresh: { price: 3.99, unit: 'lb', store: 'Amazon Fresh' },
                walmart: { price: 2.98, unit: 'lb', store: 'Walmart' },
                target: { price: 4.49, unit: 'lb', store: 'Target' }
            },
            image: '🍅',
            organic: true,
            inStock: true
        },
        'onions': {
            name: 'Organic Yellow Onions',
            category: 'vegetables',
            prices: {
                instacart: { price: 2.99, unit: 'bag', store: 'Whole Foods' },
                amazon_fresh: { price: 2.49, unit: 'bag', store: 'Amazon Fresh' },
                walmart: { price: 1.68, unit: 'bag', store: 'Walmart' },
                target: { price: 2.79, unit: 'bag', store: 'Target' }
            },
            image: '🧅',
            organic: true,
            inStock: true
        },
        'broccoli': {
            name: 'Fresh Broccoli Crowns',
            category: 'vegetables',
            prices: {
                instacart: { price: 3.99, unit: 'bunch', store: 'Whole Foods' },
                amazon_fresh: { price: 2.99, unit: 'bunch', store: 'Amazon Fresh' },
                walmart: { price: 1.98, unit: 'bunch', store: 'Walmart' },
                target: { price: 3.49, unit: 'bunch', store: 'Target' }
            },
            image: '🥦',
            organic: false,
            inStock: true
        },
        'carrots': {
            name: 'Organic Baby Carrots',
            category: 'vegetables',
            prices: {
                instacart: { price: 3.49, unit: 'bag', store: 'Whole Foods' },
                amazon_fresh: { price: 2.99, unit: 'bag', store: 'Amazon Fresh' },
                walmart: { price: 1.98, unit: 'bag', store: 'Walmart' },
                target: { price: 3.19, unit: 'bag', store: 'Target' }
            },
            image: '🥕',
            organic: true,
            inStock: true
        },
        'spinach': {
            name: 'Organic Baby Spinach',
            category: 'vegetables',
            prices: {
                instacart: { price: 4.49, unit: 'bag', store: 'Whole Foods' },
                amazon_fresh: { price: 3.99, unit: 'bag', store: 'Amazon Fresh' },
                walmart: { price: 2.98, unit: 'bag', store: 'Walmart' },
                target: { price: 3.99, unit: 'bag', store: 'Target' }
            },
            image: '🥬',
            organic: true,
            inStock: true
        },

        // Grains & Pantry
        'quinoa': {
            name: 'Organic Tri-Color Quinoa',
            category: 'grains',
            prices: {
                instacart: { price: 8.99, unit: 'bag', store: 'Whole Foods' },
                amazon_fresh: { price: 7.49, unit: 'bag', store: 'Amazon Fresh' },
                walmart: { price: 5.98, unit: 'bag', store: 'Walmart' },
                target: { price: 7.99, unit: 'bag', store: 'Target' }
            },
            image: '🌾',
            organic: true,
            inStock: true
        },
        'brown rice': {
            name: 'Organic Brown Rice',
            category: 'grains',
            prices: {
                instacart: { price: 4.99, unit: 'bag', store: 'Whole Foods' },
                amazon_fresh: { price: 3.99, unit: 'bag', store: 'Amazon Fresh' },
                walmart: { price: 2.98, unit: 'bag', store: 'Walmart' },
                target: { price: 4.49, unit: 'bag', store: 'Target' }
            },
            image: '🍚',
            organic: true,
            inStock: true
        },
        'oats': {
            name: 'Organic Old-Fashioned Rolled Oats',
            category: 'grains',
            prices: {
                instacart: { price: 5.99, unit: 'container', store: 'Whole Foods' },
                amazon_fresh: { price: 4.99, unit: 'container', store: 'Amazon Fresh' },
                walmart: { price: 3.48, unit: 'container', store: 'Walmart' },
                target: { price: 5.49, unit: 'container', store: 'Target' }
            },
            image: '🥣',
            organic: true,
            inStock: true
        },

        // Dairy
        'greek yogurt': {
            name: 'Organic Greek Yogurt',
            category: 'dairy',
            prices: {
                instacart: { price: 6.99, unit: 'container', store: 'Whole Foods' },
                amazon_fresh: { price: 5.99, unit: 'container', store: 'Amazon Fresh' },
                walmart: { price: 4.98, unit: 'container', store: 'Walmart' },
                target: { price: 6.49, unit: 'container', store: 'Target' }
            },
            image: '🥛',
            organic: true,
            inStock: true
        },
        'milk': {
            name: 'Organic Whole Milk',
            category: 'dairy',
            prices: {
                instacart: { price: 4.99, unit: 'gallon', store: 'Whole Foods' },
                amazon_fresh: { price: 3.99, unit: 'gallon', store: 'Amazon Fresh' },
                walmart: { price: 2.98, unit: 'gallon', store: 'Walmart' },
                target: { price: 4.49, unit: 'gallon', store: 'Target' }
            },
            image: '🥛',
            organic: true,
            inStock: true
        },
        'cheese': {
            name: 'Organic Cheddar Cheese',
            category: 'dairy',
            prices: {
                instacart: { price: 6.99, unit: 'block', store: 'Whole Foods' },
                amazon_fresh: { price: 5.99, unit: 'block', store: 'Amazon Fresh' },
                walmart: { price: 4.98, unit: 'block', store: 'Walmart' },
                target: { price: 6.49, unit: 'block', store: 'Target' }
            },
            image: '🧀',
            organic: true,
            inStock: true
        },

        // Fats & Oils
        'olive oil': {
            name: 'Extra Virgin Olive Oil',
            category: 'fats',
            prices: {
                instacart: { price: 12.99, unit: 'bottle', store: 'Whole Foods' },
                amazon_fresh: { price: 10.99, unit: 'bottle', store: 'Amazon Fresh' },
                walmart: { price: 7.98, unit: 'bottle', store: 'Walmart' },
                target: { price: 11.99, unit: 'bottle', store: 'Target' }
            },
            image: '🫒',
            organic: false,
            inStock: true
        },
        'mixed nuts': {
            name: 'Organic Mixed Nuts',
            category: 'fats',
            prices: {
                instacart: { price: 11.99, unit: 'bag', store: 'Whole Foods' },
                amazon_fresh: { price: 9.99, unit: 'bag', store: 'Amazon Fresh' },
                walmart: { price: 7.98, unit: 'bag', store: 'Walmart' },
                target: { price: 10.99, unit: 'bag', store: 'Target' }
            },
            image: '🥜',
            organic: true,
            inStock: true
        }
    };

    // State Management
    let selectedService = 'instacart';
    let shoppingCart = [];
    let deliveryPreferences = {
        address: '',
        timeSlot: '',
        instructions: ''
    };

    // Storage Functions
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

    const saveDeliveryData = (key, data) => {
        const dataStr = JSON.stringify(data);
        if (isLocalStorageAvailable()) {
            try {
                localStorage.setItem(key, dataStr);
            } catch (e) {
                memoryStorage[key] = dataStr;
            }
        } else {
            memoryStorage[key] = dataStr;
        }
    };

    const loadDeliveryData = (key, defaultValue = null) => {
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
        return data ? JSON.parse(data) : defaultValue;
    };

    // Enhanced Product Matching
    const findBestProductMatch = (ingredientName) => {
        const normalizedIngredient = ingredientName.toLowerCase();
        
        // Direct match
        if (PRODUCT_DATABASE[normalizedIngredient]) {
            return PRODUCT_DATABASE[normalizedIngredient];
        }
        
        // Fuzzy matching for common variations
        const fuzzyMatches = {
            'chicken': 'chicken breast',
            'salmon': 'salmon fillet',
            'turkey': 'ground turkey',
            'tomato': 'tomatoes',
            'pepper': 'bell peppers',
            'peppers': 'bell peppers',
            'onion': 'onions',
            'carrot': 'carrots',
            'rice': 'brown rice',
            'yogurt': 'greek yogurt',
            'nuts': 'mixed nuts',
            'oil': 'olive oil'
        };
        
        for (const [key, value] of Object.entries(fuzzyMatches)) {
            if (normalizedIngredient.includes(key)) {
                return PRODUCT_DATABASE[value];
            }
        }
        
        return null;
    };

    // Smart Quantity Calculation
    const calculateSmartQuantity = (rawQuantity, product, itemName) => {
        const qty = parseFloat(rawQuantity) || 1;
        
        // For pantry staples - usually buy one regardless of recipe amount
        if (product.category === 'grains' || product.category === 'fats' || 
            itemName.includes('oil') || itemName.includes('rice') || itemName.includes('quinoa')) {
            return 1;
        }
        
        // For fresh produce - reasonable amounts
        if (product.category === 'vegetables') {
            return Math.min(3, Math.max(1, Math.ceil(qty * 0.8))); // Cap at 3, reduce multiplier
        }
        
        // For proteins - realistic portions
        if (product.category === 'protein') {
            return Math.min(2, Math.max(1, Math.ceil(qty))); // Cap at 2 lbs/packs
        }
        
        // For dairy - moderate amounts
        if (product.category === 'dairy') {
            return Math.min(2, Math.max(1, Math.ceil(qty)));
        }
        
        // Default: reasonable quantity with cap
        return Math.min(3, Math.max(1, Math.ceil(qty)));
    };

    // Price Comparison
    const compareServicePrices = (cart) => {
        const comparison = {};
        
        Object.keys(DELIVERY_SERVICES).forEach(serviceId => {
            const service = DELIVERY_SERVICES[serviceId];
            let total = 0;
            let availableItems = 0;
            
            cart.forEach(item => {
                const product = item.product;
                if (product.prices[serviceId]) {
                    total += product.prices[serviceId].price * item.quantity;
                    availableItems++;
                }
            });
            
            comparison[serviceId] = {
                subtotal: total,
                deliveryFee: service.deliveryFee,
                total: total + service.deliveryFee,
                availableItems,
                totalItems: cart.length,
                service: service
            };
        });
        
        return comparison;
    };

    // Meal Plan Conversion
    const convertMealPlanToGroceryList = (mealPlan) => {
        const ingredientsList = {};
        
        try {
            Object.values(mealPlan).forEach(dayPlan => {
                if (!dayPlan) return;
                
                ['breakfast', 'lunch', 'dinner'].forEach(mealType => {
                    const meal = dayPlan[mealType];
                    if (meal && meal.ingredients && Array.isArray(meal.ingredients)) {
                        meal.ingredients.forEach(ingredient => {
                            if (!ingredient || !ingredient.name) return;
                            
                            const key = ingredient.name.toLowerCase();
                            const amount = parseFloat(ingredient.amount) || 1;
                            
                            if (ingredientsList[key]) {
                                ingredientsList[key].totalAmount += amount;
                            } else {
                                ingredientsList[key] = {
                                    name: ingredient.name,
                                    totalAmount: amount,
                                    unit: ingredient.unit || 'item',
                                    category: ingredient.category || 'other'
                                };
                            }
                        });
                    }
                });
            });
        } catch (e) {
            console.error('Error converting meal plan:', e);
            return [];
        }

        return Object.values(ingredientsList);
    };

    // Main Smart Delivery Component
    const SmartDeliveryTab = () => {
        const [activeView, setActiveView] = React.useState('services');
        const [searchQuery, setSearchQuery] = React.useState('');
        const [selectedCategory, setSelectedCategory] = React.useState('All');
        const [showCheckout, setShowCheckout] = React.useState(false);
        const [showUpload, setShowUpload] = React.useState(false);
        const [isImporting, setIsImporting] = React.useState(false);

        // Load saved cart and preferences
        React.useEffect(() => {
            const savedCart = loadDeliveryData('habbt_delivery_cart', []);
            const savedService = loadDeliveryData('habbt_delivery_service', 'instacart');
            const savedPrefs = loadDeliveryData('habbt_delivery_prefs', deliveryPreferences);
            
            shoppingCart = savedCart;
            selectedService = savedService;
            deliveryPreferences = savedPrefs;
        }, []);

        // Save data when it changes
        React.useEffect(() => {
            saveDeliveryData('habbt_delivery_cart', shoppingCart);
            saveDeliveryData('habbt_delivery_service', selectedService);
            saveDeliveryData('habbt_delivery_prefs', deliveryPreferences);
        }, [shoppingCart.length, selectedService]);

        const addToCart = (productKey, quantity = 1) => {
            const product = PRODUCT_DATABASE[productKey];
            if (!product || !product.prices[selectedService]) return;

            const existingItem = shoppingCart.find(item => item.productKey === productKey);
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                shoppingCart.push({
                    productKey,
                    product,
                    quantity
                });
            }
            
            // Force re-render
            setActiveView(prev => prev);
        };

        const updateCartQuantity = (index, newQuantity) => {
            if (newQuantity <= 0) {
                shoppingCart.splice(index, 1);
            } else {
                shoppingCart[index].quantity = newQuantity;
            }
            setActiveView(prev => prev);
        };

        const removeFromCart = (index) => {
            shoppingCart.splice(index, 1);
            setActiveView(prev => prev);
        };

        const selectService = (serviceId) => {
            selectedService = serviceId;
            setActiveView(prev => prev);
        };

        const importFromMealPlan = async () => {
            if (isImporting) return;
            setIsImporting(true);

            try {
                // Try pending list first
                let groceryList = null;
                const pendingList = loadDeliveryData('fueliq_pending_grocery_list');
                
                if (pendingList) {
                    groceryList = pendingList;
                    saveDeliveryData('fueliq_pending_grocery_list', null);
                } else {
                    // Fallback to meal plan
                    const mealPlan = loadDeliveryData('fueliq_meal_plan');
                    if (!mealPlan) {
                        alert('❌ No meal plan found. Please create a meal plan first.');
                        return;
                    }
                    groceryList = convertMealPlanToGroceryList(mealPlan);
                }

                let addedCount = 0;
                const failedItems = [];

                groceryList.forEach(item => {
                    const itemName = item.name || item.ingredient?.name || 'Unknown';
                    const product = findBestProductMatch(itemName);
                    
                    if (product) {
                        const rawQuantity = item.neededAmount || item.totalAmount || item.amount || 1;
                        const smartQuantity = calculateSmartQuantity(rawQuantity, product, itemName);
                        
                        const existingItem = shoppingCart.find(cartItem => cartItem.productKey === itemName.toLowerCase());
                        if (existingItem) {
                            existingItem.quantity = Math.min(existingItem.quantity + smartQuantity, 4);
                        } else {
                            shoppingCart.push({
                                productKey: itemName.toLowerCase(),
                                product: product,
                                quantity: smartQuantity
                            });
                        }
                        addedCount++;
                    } else {
                        failedItems.push(itemName);
                    }
                });

                let message = `✅ Imported ${addedCount} items from meal plan!`;
                if (failedItems.length > 0) {
                    message += `\n\n⚠️ Could not find: ${failedItems.slice(0, 3).join(', ')}`;
                    if (failedItems.length > 3) {
                        message += ` and ${failedItems.length - 3} more`;
                    }
                }
                
                alert(message);
                setActiveView(prev => prev);

            } catch (error) {
                console.error('Import error:', error);
                alert('❌ Error importing meal plan. Please try again.');
            } finally {
                setIsImporting(false);
            }
        };

        const processManualList = (text) => {
            const items = text.split('\n').filter(item => item.trim());
            let addedCount = 0;
            
            items.forEach(item => {
                const product = findBestProductMatch(item.trim());
                if (product) {
                    addToCart(item.trim().toLowerCase(), 1);
                    addedCount++;
                }
            });
            
            alert(`✅ Added ${addedCount} items from your list!`);
            setShowUpload(false);
            setActiveView(prev => prev);
        };

        const placeOrder = (orderDetails) => {
            const orderNumber = 'HBT' + Math.random().toString(36).substr(2, 9).toUpperCase();
            
            // Update pantry automatically
            updatePantryWithPurchase();

            alert(`🎉 Order placed successfully!
            
Order #: ${orderNumber}
Service: ${DELIVERY_SERVICES[selectedService].name}
Delivery: ${orderDetails.timeSlot === 'asap' ? 'ASAP' : orderDetails.timeSlot}
Address: ${orderDetails.address}

Items automatically added to your pantry!`);

            shoppingCart.length = 0; // Clear cart
            setShowCheckout(false);
            setActiveView('services');
        };

        const updatePantryWithPurchase = () => {
            try {
                const pantryKeys = ['habbt_pantry', 'fueliq_pantry'];
                
                pantryKeys.forEach(key => {
                    const pantryData = loadDeliveryData(key, { items: [] });
                    const items = pantryData.items || [];
                    
                    shoppingCart.forEach(item => {
                        const existingItem = items.find(p => p.name === item.product.name);
                        if (existingItem) {
                            existingItem.quantity = (existingItem.quantity || 1) + item.quantity;
                        } else {
                            items.push({
                                id: Date.now() + Math.random(),
                                name: item.product.name,
                                category: item.product.category,
                                quantity: item.quantity,
                                addedDate: new Date().toISOString(),
                                source: 'grocery_delivery',
                                notes: `Delivered via ${DELIVERY_SERVICES[selectedService].name}`
                            });
                        }
                    });
                    
                    saveDeliveryData(key, { items });
                });
            } catch (e) {
                console.warn('Could not update pantry:', e);
            }
        };

        const filteredProducts = Object.entries(PRODUCT_DATABASE).filter(([key, product]) => {
            const matchesSearch = !searchQuery || 
                product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                key.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
            return matchesSearch && matchesCategory && product.prices[selectedService];
        });

        const categories = ['All', ...new Set(Object.values(PRODUCT_DATABASE).map(p => p.category))];

        const cartTotal = shoppingCart.reduce((sum, item) => {
            const price = item.product.prices[selectedService];
            return sum + (price ? price.price * item.quantity : 0);
        }, 0);

        const service = DELIVERY_SERVICES[selectedService];
        const deliveryFee = cartTotal >= service.minOrder ? service.deliveryFee : service.deliveryFee + 5;
        const grandTotal = cartTotal + deliveryFee;

        const comparison = shoppingCart.length > 0 ? compareServicePrices(shoppingCart) : null;

        return React.createElement('div', { className: 'min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-cyan-50' },
            
            // Header with Habbt branding
            React.createElement('div', { className: 'bg-gradient-to-r from-blue-600 to-teal-600 shadow-2xl' },
                React.createElement('div', { className: 'max-w-7xl mx-auto px-6 py-8' },
                    React.createElement('div', { className: 'text-center text-white' },
                        React.createElement('h1', { className: 'text-4xl font-bold mb-2' }, '🚚 Smart Delivery'),
                        React.createElement('p', { className: 'text-xl opacity-90' }, 'From meal plans to your doorstep'),
                        React.createElement('div', { className: 'mt-6 grid grid-cols-3 gap-4 max-w-md mx-auto' },
                            React.createElement('div', { className: 'text-center' },
                                React.createElement('div', { className: 'text-2xl font-bold' }, shoppingCart.length),
                                React.createElement('div', { className: 'text-sm opacity-90' }, 'Cart Items')
                            ),
                            React.createElement('div', { className: 'text-center' },
                                React.createElement('div', { className: 'text-2xl font-bold' }, `$${cartTotal.toFixed(2)}`),
                                React.createElement('div', { className: 'text-sm opacity-90' }, 'Subtotal')
                            ),
                            React.createElement('div', { className: 'text-center' },
                                React.createElement('div', { className: 'text-2xl font-bold' }, DELIVERY_SERVICES[selectedService].logo),
                                React.createElement('div', { className: 'text-sm opacity-90' }, selectedService)
                            )
                        )
                    )
                )
            ),

            React.createElement('div', { className: 'max-w-7xl mx-auto p-6' },
                
                // Quick Actions Bar
                React.createElement('div', { className: 'bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-4 mb-6' },
                    React.createElement('div', { className: 'flex flex-wrap gap-3 justify-center' },
                        React.createElement('button', {
                            onClick: importFromMealPlan,
                            disabled: isImporting,
                            className: 'px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 text-white rounded-lg font-semibold transition-all'
                        }, isImporting ? '⏳ Importing...' : '📅 Import Meal Plan'),
                        
                        React.createElement('button', {
                            onClick: () => setShowUpload(true),
                            className: 'px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-lg font-semibold transition-all'
                        }, '📝 Manual List'),
                        
                        React.createElement('button', {
                            onClick: () => setActiveView('products'),
                            className: 'px-6 py-3 bg-gradient-to-r from-blue-500 to-teal-600 hover:from-blue-600 hover:to-teal-700 text-white rounded-lg font-semibold transition-all'
                        }, '🛒 Browse Products'),
                        
                        shoppingCart.length > 0 && React.createElement('button', {
                            onClick: () => setShowCheckout(true),
                            disabled: cartTotal < service.minOrder,
                            className: `px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 disabled:opacity-50 text-white rounded-lg font-semibold transition-all`
                        }, `🚚 Checkout ($${grandTotal.toFixed(2)})`)
                    )
                ),

                // Service Selection
                React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8' },
                    ...Object.entries(DELIVERY_SERVICES).map(([id, service]) =>
                        React.createElement('div', { 
                            key: id,
                            onClick: () => selectService(id),
                            className: `p-6 rounded-xl cursor-pointer transition-all duration-200 hover:scale-105 ${
                                selectedService === id 
                                    ? 'border-2 border-blue-500 bg-gradient-to-r from-blue-50 to-teal-50 shadow-xl' 
                                    : 'border-2 border-gray-200 bg-white/80 hover:border-blue-300'
                            }`
                        },
                            React.createElement('div', { className: 'text-center' },
                                React.createElement('div', { className: 'text-4xl mb-2' }, service.logo),
                                React.createElement('h3', { className: 'font-bold text-lg text-gray-800' }, service.name),
                                React.createElement('div', { className: 'text-sm text-gray-600 mt-2 space-y-1' },
                                    React.createElement('div', null, `⭐ ${service.rating}/5.0`),
                                    React.createElement('div', null, `⏱️ ${service.deliveryTime}`),
                                    React.createElement('div', null, `💰 $${service.deliveryFee} delivery`),
                                    React.createElement('div', null, `📦 $${service.minOrder} minimum`)
                                )
                            )
                        )
                    )
                ),

                // Price Comparison (if cart has items)
                comparison && React.createElement('div', { className: 'bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6 mb-8' },
                    React.createElement('h3', { className: 'text-xl font-bold text-gray-800 mb-4' }, '💰 Price Comparison'),
                    React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4' },
                        ...Object.entries(comparison).sort((a, b) => a[1].total - b[1].total).map(([serviceId, data], index) =>
                            React.createElement('div', { 
                                key: serviceId,
                                className: `p-4 rounded-lg border-2 ${
                                    serviceId === selectedService ? 'border-blue-500 bg-blue-50' : 
                                    index === 0 ? 'border-green-500 bg-green-50' : 'border-gray-200'
                                }`
                            },
                                React.createElement('div', { className: 'flex items-center justify-between mb-2' },
                                    React.createElement('div', { className: 'flex items-center space-x-2' },
                                        React.createElement('span', { className: 'text-2xl' }, data.service.logo),
                                        React.createElement('span', { className: 'font-bold' }, data.service.name),
                                        index === 0 && React.createElement('span', { className: 'text-green-600 text-xs' }, '💰 Best')
                                    )
                                ),
                                React.createElement('div', { className: 'text-sm space-y-1' },
                                    React.createElement('div', null, `Items: ${data.availableItems}/${data.totalItems}`),
                                    React.createElement('div', null, `Subtotal: $${data.subtotal.toFixed(2)}`),
                                    React.createElement('div', null, `Delivery: $${data.deliveryFee.toFixed(2)}`),
                                    React.createElement('div', { className: 'font-bold' }, `Total: $${data.total.toFixed(2)}`)
                                ),
                                serviceId !== selectedService && React.createElement('button', {
                                    onClick: () => selectService(serviceId),
                                    className: 'mt-2 w-full text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200'
                                }, 'Select')
                            )
                        )
                    )
                ),

                // Products Grid and Cart
                React.createElement('div', { className: 'grid grid-cols-1 lg:grid-cols-3 gap-8' },
                    
                    // Products Section
                    React.createElement('div', { className: 'lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6' },
                        React.createElement('h3', { className: 'text-xl font-bold text-gray-800 mb-4' }, '🛒 Browse Products'),
                        
                        // Search and Filters
                        React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-4 mb-6' },
                            React.createElement('input', {
                                type: 'text',
                                placeholder: 'Search products...',
                                value: searchQuery,
                                onChange: (e) => setSearchQuery(e.target.value),
                                className: 'px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500'
                            }),
                            React.createElement('select', {
                                value: selectedCategory,
                                onChange: (e) => setSelectedCategory(e.target.value),
                                className: 'px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500'
                            },
                                ...categories.map(cat => 
                                    React.createElement('option', { key: cat, value: cat }, cat)
                                )
                            )
                        ),

                        // Products Grid
                        React.createElement('div', { className: 'grid grid-cols-2 md:grid-cols-3 gap-4 max-h-96 overflow-y-auto' },
                            ...filteredProducts.map(([key, product]) => {
                                const price = product.prices[selectedService];
                                return React.createElement('div', { 
                                    key: key,
                                    onClick: () => addToCart(key),
                                    className: 'bg-white rounded-lg border border-gray-200 p-3 hover:scale-105 transition-all cursor-pointer hover:shadow-md'
                                },
                                    React.createElement('div', { className: 'text-center' },
                                        React.createElement('div', { className: 'text-2xl mb-2' }, product.image),
                                        React.createElement('h4', { className: 'font-medium text-xs text-gray-800 mb-2' }, product.name),
                                        React.createElement('div', { className: 'text-lg font-bold text-blue-600' }, `$${price.price}`),
                                        React.createElement('div', { className: 'text-xs text-gray-500' }, `per ${price.unit}`),
                                        React.createElement('div', { className: 'text-xs text-gray-500 mt-1' }, price.store),
                                        product.organic && React.createElement('div', { className: 'text-xs text-green-600 mt-1' }, '🌱 Organic')
                                    )
                                );
                            })
                        )
                    ),

                    // Shopping Cart
                    React.createElement('div', { className: 'bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6' },
                        React.createElement('h3', { className: 'text-xl font-bold text-gray-800 mb-4 flex items-center' },
                            '🛒 Shopping Cart',
                            React.createElement('span', { className: 'ml-2 px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-sm' }, shoppingCart.length)
                        ),

                        shoppingCart.length === 0 ? 
                            React.createElement('div', { className: 'text-center py-8 text-gray-500' },
                                React.createElement('div', { className: 'text-4xl mb-2' }, '🛒'),
                                'Your cart is empty'
                            ) :
                            React.createElement('div', { className: 'space-y-3 mb-6 max-h-64 overflow-y-auto' },
                                ...shoppingCart.map((item, index) => {
                                    const price = item.product.prices[selectedService];
                                    const itemTotal = price ? price.price * item.quantity : 0;
                                    
                                    return React.createElement('div', { 
                                        key: index,
                                        className: 'flex items-center justify-between p-3 bg-gray-50 rounded-lg'
                                    },
                                        React.createElement('div', { className: 'flex items-center space-x-3' },
                                            React.createElement('div', { className: 'text-xl' }, item.product.image),
                                            React.createElement('div', null,
                                                React.createElement('div', { className: 'font-medium text-sm' }, item.product.name),
                                                price && React.createElement('div', { className: 'text-xs text-gray-600' }, `$${price.price} per ${price.unit}`)
                                            )
                                        ),
                                        React.createElement('div', { className: 'flex items-center space-x-2' },
                                            React.createElement('button', {
                                                onClick: () => updateCartQuantity(index, item.quantity - 1),
                                                className: 'w-6 h-6 bg-red-100 hover:bg-red-200 text-red-600 rounded-full flex items-center justify-center text-sm font-bold'
                                            }, '−'),
                                            React.createElement('span', { className: 'font-medium min-w-[1.5rem] text-center' }, item.quantity),
                                            React.createElement('button', {
                                                onClick: () => updateCartQuantity(index, item.quantity + 1),
                                                className: 'w-6 h-6 bg-green-100 hover:bg-green-200 text-green-600 rounded-full flex items-center justify-center text-sm font-bold'
                                            }, '+'),
                                            React.createElement('div', { className: 'ml-2 text-right' },
                                                React.createElement('div', { className: 'font-bold text-blue-600 text-sm' }, `$${itemTotal.toFixed(2)}`),
                                                React.createElement('button', {
                                                    onClick: () => removeFromCart(index),
                                                    className: 'text-xs text-red-500 hover:text-red-700 underline'
                                                }, 'Remove')
                                            )
                                        )
                                    );
                                })
                            ),

                        // Cart Summary
                        shoppingCart.length > 0 && React.createElement('div', { className: 'border-t pt-4' },
                            React.createElement('div', { className: 'space-y-2' },
                                React.createElement('div', { className: 'flex justify-between' },
                                    React.createElement('span', null, 'Subtotal:'),
                                    React.createElement('span', null, `$${cartTotal.toFixed(2)}`)
                                ),
                                React.createElement('div', { className: 'flex justify-between' },
                                    React.createElement('span', null, 'Delivery Fee:'),
                                    React.createElement('span', null, `$${deliveryFee.toFixed(2)}`)
                                ),
                                cartTotal < service.minOrder && React.createElement('div', { className: 'text-red-600 text-sm' },
                                    `Add $${(service.minOrder - cartTotal).toFixed(2)} to reach minimum order`
                                ),
                                React.createElement('div', { className: 'border-t pt-2 flex justify-between font-bold text-lg' },
                                    React.createElement('span', null, 'Total:'),
                                    React.createElement('span', { className: 'text-blue-600' }, `$${grandTotal.toFixed(2)}`)
                                )
                            )
                        )
                    )
                )
            ),

            // Upload Modal
            showUpload && React.createElement(UploadModal, {
                onClose: () => setShowUpload(false),
                onProcess: processManualList
            }),

            // Checkout Modal
            showCheckout && React.createElement(CheckoutModal, {
                cart: shoppingCart,
                service: DELIVERY_SERVICES[selectedService],
                total: grandTotal,
                onClose: () => setShowCheckout(false),
                onPlaceOrder: placeOrder
            })
        );
    };

    // Upload Modal Component
    const UploadModal = ({ onClose, onProcess }) => {
        const [manualText, setManualText] = React.useState('');

        const handleProcess = () => {
            if (manualText.trim()) {
                onProcess(manualText);
                setManualText('');
            }
        };

        return React.createElement('div', { className: 'fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4' },
            React.createElement('div', { className: 'bg-white rounded-xl shadow-2xl max-w-lg w-full' },
                React.createElement('div', { className: 'p-6' },
                    React.createElement('div', { className: 'flex justify-between items-center mb-4' },
                        React.createElement('h2', { className: 'text-xl font-bold text-gray-800' }, '📝 Add Grocery List'),
                        React.createElement('button', { 
                            onClick: onClose,
                            className: 'text-gray-500 hover:text-gray-700 text-xl font-bold' 
                        }, '×')
                    ),
                    React.createElement('textarea', {
                        placeholder: 'Enter your grocery list here (one item per line)...\n\nExample:\nChicken breast\nBroccoli\nBrown rice\nGreek yogurt',
                        value: manualText,
                        onChange: (e) => setManualText(e.target.value),
                        className: 'w-full h-32 p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none'
                    }),
                    React.createElement('div', { className: 'flex gap-3 mt-4' },
                        React.createElement('button', {
                            onClick: onClose,
                            className: 'flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50'
                        }, 'Cancel'),
                        React.createElement('button', {
                            onClick: handleProcess,
                            disabled: !manualText.trim(),
                            className: 'flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-teal-600 hover:from-blue-600 hover:to-teal-700 disabled:opacity-50 text-white rounded-lg'
                        }, 'Add Items')
                    )
                )
            )
        );
    };

    // Checkout Modal Component
    const CheckoutModal = ({ cart, service, total, onClose, onPlaceOrder }) => {
        const [address, setAddress] = React.useState(deliveryPreferences.address);
        const [timeSlot, setTimeSlot] = React.useState(deliveryPreferences.timeSlot);
        const [instructions, setInstructions] = React.useState(deliveryPreferences.instructions);

        const handlePlaceOrder = () => {
            if (!address || !timeSlot) {
                alert('Please fill in delivery address and time slot.');
                return;
            }

            deliveryPreferences = { address, timeSlot, instructions };
            onPlaceOrder({ address, timeSlot, instructions });
        };

        const subtotal = cart.reduce((sum, item) => {
            const price = item.product.prices[selectedService];
            return sum + (price ? price.price * item.quantity : 0);
        }, 0);

        return React.createElement('div', { className: 'fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4' },
            React.createElement('div', { className: 'bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto' },
                React.createElement('div', { className: 'p-6' },
                    React.createElement('div', { className: 'flex justify-between items-center mb-6' },
                        React.createElement('h2', { className: 'text-2xl font-bold text-gray-800' }, '🚚 Checkout'),
                        React.createElement('button', { 
                            onClick: onClose,
                            className: 'text-gray-500 hover:text-gray-700 text-xl font-bold' 
                        }, '×')
                    ),
                    
                    React.createElement('div', { className: 'space-y-6' },
                        // Service Info
                        React.createElement('div', { className: 'bg-gray-50 rounded-lg p-4' },
                            React.createElement('h3', { className: 'font-bold text-lg mb-2' }, '📦 Delivery Service'),
                            React.createElement('div', { className: 'flex items-center space-x-3' },
                                React.createElement('span', { className: 'text-2xl' }, service.logo),
                                React.createElement('div', null,
                                    React.createElement('div', { className: 'font-bold' }, service.name),
                                    React.createElement('div', { className: 'text-sm text-gray-600' }, `${service.deliveryTime} • $${service.deliveryFee} delivery`)
                                )
                            )
                        ),

                        // Address
                        React.createElement('div', null,
                            React.createElement('h3', { className: 'font-bold text-lg mb-2' }, '📍 Delivery Address'),
                            React.createElement('input', {
                                type: 'text',
                                placeholder: 'Enter your delivery address',
                                value: address,
                                onChange: (e) => setAddress(e.target.value),
                                className: 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500'
                            })
                        ),

                        // Time Slot
                        React.createElement('div', null,
                            React.createElement('h3', { className: 'font-bold text-lg mb-2' }, '⏰ Delivery Time'),
                            React.createElement('select', {
                                value: timeSlot,
                                onChange: (e) => setTimeSlot(e.target.value),
                                className: 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500'
                            },
                                React.createElement('option', { value: '' }, 'Select a time slot'),
                                React.createElement('option', { value: 'asap' }, `ASAP (${service.deliveryTime})`),
                                React.createElement('option', { value: 'morning' }, 'Tomorrow Morning (8am-12pm)'),
                                React.createElement('option', { value: 'afternoon' }, 'Tomorrow Afternoon (12pm-5pm)'),
                                React.createElement('option', { value: 'evening' }, 'Tomorrow Evening (5pm-9pm)')
                            )
                        ),

                        // Instructions
                        React.createElement('div', null,
                            React.createElement('h3', { className: 'font-bold text-lg mb-2' }, '📝 Special Instructions'),
                            React.createElement('textarea', {
                                placeholder: 'Leave at door, ring doorbell, etc.',
                                value: instructions,
                                onChange: (e) => setInstructions(e.target.value),
                                className: 'w-full h-20 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none'
                            })
                        ),

                        // Order Summary
                        React.createElement('div', { className: 'bg-gray-50 rounded-lg p-4' },
                            React.createElement('h3', { className: 'font-bold text-lg mb-3' }, '📋 Order Summary'),
                            React.createElement('div', { className: 'space-y-2 mb-4' },
                                ...cart.map((item, index) => {
                                    const price = item.product.prices[selectedService];
                                    return React.createElement('div', { 
                                        key: index,
                                        className: 'flex justify-between text-sm'
                                    },
                                        React.createElement('span', null, `${item.product.name} x${item.quantity}`),
                                        React.createElement('span', null, `$${(price.price * item.quantity).toFixed(2)}`)
                                    );
                                })
                            ),
                            React.createElement('div', { className: 'border-t pt-3 space-y-2' },
                                React.createElement('div', { className: 'flex justify-between' },
                                    React.createElement('span', null, 'Subtotal:'),
                                    React.createElement('span', null, `$${subtotal.toFixed(2)}`)
                                ),
                                React.createElement('div', { className: 'flex justify-between' },
                                    React.createElement('span', null, 'Delivery Fee:'),
                                    React.createElement('span', null, `$${service.deliveryFee.toFixed(2)}`)
                                ),
                                React.createElement('div', { className: 'flex justify-between font-bold text-lg border-t pt-2' },
                                    React.createElement('span', null, 'Total:'),
                                    React.createElement('span', { className: 'text-blue-600' }, `$${total.toFixed(2)}`)
                                )
                            )
                        )
                    ),

                    React.createElement('button', {
                        onClick: handlePlaceOrder,
                        className: 'w-full mt-6 px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg font-bold text-lg transition-all'
                    }, `💳 Place Order - $${total.toFixed(2)}`)
                )
            )
        );
    };

    // Ultra-Safe Rendering System (same as meals tab)
    let renderingActive = false;
    let verificationId = null;

    const cleanRenderDeliveryTab = (containerId = 'grocery-container') => {
        console.log('🚚 CLEAN rendering Habbt delivery tab...');
        
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`❌ Container ${containerId} not found`);
            return false;
        }

        try {
            // Force clean slate
            container.innerHTML = '';
            verificationId = `clean-delivery-${Date.now()}`;
            
            // Create wrapper
            const wrapper = document.createElement('div');
            wrapper.id = verificationId;
            wrapper.style.cssText = 'width: 100%; height: 100%;';
            
            // Add with delay to ensure DOM ready
            setTimeout(() => {
                container.appendChild(wrapper);
                
                setTimeout(() => {
                    try {
                        ReactDOM.render(React.createElement(SmartDeliveryTab), wrapper);
                        renderingActive = true;
                        console.log('✅ Habbt delivery tab rendered successfully');
                        startCleanMonitoring(containerId);
                    } catch (renderError) {
                        console.error('❌ React render error:', renderError);
                        container.innerHTML = `
                            <div class="max-w-6xl mx-auto p-6">
                                <div class="bg-gradient-to-r from-blue-600 to-teal-600 rounded-xl p-6 mb-6 text-white">
                                    <h1 class="text-3xl font-bold mb-4">🚚 Smart Delivery</h1>
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
                cleanRenderDeliveryTab(containerId);
            }
        }, 2000);

        window.cleanDeliveryCleanup = () => {
            clearInterval(monitoringInterval);
            renderingActive = false;
        };
    };

    // Override functions with ALL naming conventions the main app expects
    window.tryRenderDelivery = cleanRenderDeliveryTab;
    window.renderDelivery = cleanRenderDeliveryTab;
    window.renderDeliveryTab = cleanRenderDeliveryTab;
    window.tryRenderGrocery = cleanRenderDeliveryTab;
    window.renderGrocery = cleanRenderDeliveryTab;
    window.renderGroceryTab = cleanRenderDeliveryTab;

    // Export system with ALL possible naming conventions
    const createGroceryDeliveryInterface = (containerId, groceryList = null) => {
        return cleanRenderDeliveryTab(containerId);
    };

    window.FuelIQGroceryDelivery = {
        renderGroceryDelivery: createGroceryDeliveryInterface,
        SmartDeliveryTab,
        cleanup: () => {
            if (window.cleanDeliveryCleanup) {
                window.cleanDeliveryCleanup();
            }
        }
    };

    window.HabbtGroceryDelivery = window.FuelIQGroceryDelivery;
    window.FuelIQDelivery = window.FuelIQGroceryDelivery;
    window.HabbtDelivery = window.FuelIQGroceryDelivery;

    console.log('✅ Habbt Smart Delivery system loaded successfully!');
    console.log('🚚 Features: Multi-service comparison + Smart cart + Meal plan import + Safe mounting');
    console.log('🎨 Beautiful Habbt blue/teal branding + Modern UI + Auto-pantry integration');
    console.log('✅ Available as: HabbtGroceryDelivery, FuelIQGroceryDelivery, HabbtDelivery, FuelIQDelivery');
    console.log('✅ Functions: renderGroceryDelivery, tryRenderGrocery, renderGrocery, renderDelivery');

})();
