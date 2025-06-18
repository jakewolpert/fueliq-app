// FIXED Habbt Delivery Tab - All Interactions Working
// React State Management + Meal Plan Integration + Working Buttons

(function() {
    'use strict';

    console.log('🚚 Loading FIXED Habbt Smart Delivery system...');

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

    // Enhanced Product Database
    const PRODUCT_DATABASE = {
        'chicken breast': {
            name: 'Organic Chicken Breast', category: 'protein', image: '🍗', organic: true, inStock: true,
            prices: { instacart: { price: 8.99, unit: 'lb', store: 'Whole Foods' }, amazon_fresh: { price: 7.49, unit: 'lb', store: 'Amazon Fresh' }, walmart: { price: 5.98, unit: 'lb', store: 'Walmart' }, target: { price: 7.99, unit: 'lb', store: 'Target' } }
        },
        'salmon fillet': {
            name: 'Fresh Atlantic Salmon Fillet', category: 'protein', image: '🐟', organic: false, inStock: true,
            prices: { instacart: { price: 14.99, unit: 'lb', store: 'Whole Foods' }, amazon_fresh: { price: 12.99, unit: 'lb', store: 'Amazon Fresh' }, walmart: { price: 11.98, unit: 'lb', store: 'Walmart' }, target: { price: 13.99, unit: 'lb', store: 'Target' } }
        },
        'salmon': {
            name: 'Fresh Atlantic Salmon Fillet', category: 'protein', image: '🐟', organic: false, inStock: true,
            prices: { instacart: { price: 14.99, unit: 'lb', store: 'Whole Foods' }, amazon_fresh: { price: 12.99, unit: 'lb', store: 'Amazon Fresh' }, walmart: { price: 11.98, unit: 'lb', store: 'Walmart' }, target: { price: 13.99, unit: 'lb', store: 'Target' } }
        },
        'eggs': {
            name: 'Organic Free-Range Eggs', category: 'protein', image: '🥚', organic: true, inStock: true,
            prices: { instacart: { price: 6.99, unit: 'dozen', store: 'Whole Foods' }, amazon_fresh: { price: 5.49, unit: 'dozen', store: 'Amazon Fresh' }, walmart: { price: 3.98, unit: 'dozen', store: 'Walmart' }, target: { price: 5.99, unit: 'dozen', store: 'Target' } }
        },
        'ground turkey': {
            name: 'Organic Ground Turkey', category: 'protein', image: '🦃', organic: true, inStock: true,
            prices: { instacart: { price: 9.99, unit: 'lb', store: 'Whole Foods' }, amazon_fresh: { price: 8.49, unit: 'lb', store: 'Amazon Fresh' }, walmart: { price: 6.98, unit: 'lb', store: 'Walmart' }, target: { price: 8.99, unit: 'lb', store: 'Target' } }
        },
        'bell peppers': {
            name: 'Organic Bell Pepper Variety Pack', category: 'vegetables', image: '🫑', organic: true, inStock: true,
            prices: { instacart: { price: 5.99, unit: 'pack', store: 'Whole Foods' }, amazon_fresh: { price: 4.99, unit: 'pack', store: 'Amazon Fresh' }, walmart: { price: 3.98, unit: 'pack', store: 'Walmart' }, target: { price: 5.49, unit: 'pack', store: 'Target' } }
        },
        'tomatoes': {
            name: 'Organic Roma Tomatoes', category: 'vegetables', image: '🍅', organic: true, inStock: true,
            prices: { instacart: { price: 4.99, unit: 'lb', store: 'Whole Foods' }, amazon_fresh: { price: 3.99, unit: 'lb', store: 'Amazon Fresh' }, walmart: { price: 2.98, unit: 'lb', store: 'Walmart' }, target: { price: 4.49, unit: 'lb', store: 'Target' } }
        },
        'onions': {
            name: 'Organic Yellow Onions', category: 'vegetables', image: '🧅', organic: true, inStock: true,
            prices: { instacart: { price: 2.99, unit: 'bag', store: 'Whole Foods' }, amazon_fresh: { price: 2.49, unit: 'bag', store: 'Amazon Fresh' }, walmart: { price: 1.68, unit: 'bag', store: 'Walmart' }, target: { price: 2.79, unit: 'bag', store: 'Target' } }
        },
        'broccoli': {
            name: 'Fresh Broccoli Crowns', category: 'vegetables', image: '🥦', organic: false, inStock: true,
            prices: { instacart: { price: 3.99, unit: 'bunch', store: 'Whole Foods' }, amazon_fresh: { price: 2.99, unit: 'bunch', store: 'Amazon Fresh' }, walmart: { price: 1.98, unit: 'bunch', store: 'Walmart' }, target: { price: 3.49, unit: 'bunch', store: 'Target' } }
        },
        'carrots': {
            name: 'Organic Baby Carrots', category: 'vegetables', image: '🥕', organic: true, inStock: true,
            prices: { instacart: { price: 3.49, unit: 'bag', store: 'Whole Foods' }, amazon_fresh: { price: 2.99, unit: 'bag', store: 'Amazon Fresh' }, walmart: { price: 1.98, unit: 'bag', store: 'Walmart' }, target: { price: 3.19, unit: 'bag', store: 'Target' } }
        },
        'spinach': {
            name: 'Organic Baby Spinach', category: 'vegetables', image: '🥬', organic: true, inStock: true,
            prices: { instacart: { price: 4.49, unit: 'bag', store: 'Whole Foods' }, amazon_fresh: { price: 3.99, unit: 'bag', store: 'Amazon Fresh' }, walmart: { price: 2.98, unit: 'bag', store: 'Walmart' }, target: { price: 3.99, unit: 'bag', store: 'Target' } }
        },
        'sweet potato': {
            name: 'Organic Sweet Potatoes', category: 'vegetables', image: '🍠', organic: true, inStock: true,
            prices: { instacart: { price: 2.99, unit: 'lb', store: 'Whole Foods' }, amazon_fresh: { price: 2.49, unit: 'lb', store: 'Amazon Fresh' }, walmart: { price: 1.68, unit: 'lb', store: 'Walmart' }, target: { price: 2.79, unit: 'lb', store: 'Target' } }
        },
        'sweet potatoes': {
            name: 'Organic Sweet Potatoes', category: 'vegetables', image: '🍠', organic: true, inStock: true,
            prices: { instacart: { price: 2.99, unit: 'lb', store: 'Whole Foods' }, amazon_fresh: { price: 2.49, unit: 'lb', store: 'Amazon Fresh' }, walmart: { price: 1.68, unit: 'lb', store: 'Walmart' }, target: { price: 2.79, unit: 'lb', store: 'Target' } }
        },
        'quinoa': {
            name: 'Organic Tri-Color Quinoa', category: 'grains', image: '🌾', organic: true, inStock: true,
            prices: { instacart: { price: 8.99, unit: 'bag', store: 'Whole Foods' }, amazon_fresh: { price: 7.49, unit: 'bag', store: 'Amazon Fresh' }, walmart: { price: 5.98, unit: 'bag', store: 'Walmart' }, target: { price: 7.99, unit: 'bag', store: 'Target' } }
        },
        'brown rice': {
            name: 'Organic Brown Rice', category: 'grains', image: '🍚', organic: true, inStock: true,
            prices: { instacart: { price: 4.99, unit: 'bag', store: 'Whole Foods' }, amazon_fresh: { price: 3.99, unit: 'bag', store: 'Amazon Fresh' }, walmart: { price: 2.98, unit: 'bag', store: 'Walmart' }, target: { price: 4.49, unit: 'bag', store: 'Target' } }
        },
        'rice': {
            name: 'Organic Brown Rice', category: 'grains', image: '🍚', organic: true, inStock: true,
            prices: { instacart: { price: 4.99, unit: 'bag', store: 'Whole Foods' }, amazon_fresh: { price: 3.99, unit: 'bag', store: 'Amazon Fresh' }, walmart: { price: 2.98, unit: 'bag', store: 'Walmart' }, target: { price: 4.49, unit: 'bag', store: 'Target' } }
        },
        'oats': {
            name: 'Organic Old-Fashioned Rolled Oats', category: 'grains', image: '🥣', organic: true, inStock: true,
            prices: { instacart: { price: 5.99, unit: 'container', store: 'Whole Foods' }, amazon_fresh: { price: 4.99, unit: 'container', store: 'Amazon Fresh' }, walmart: { price: 3.48, unit: 'container', store: 'Walmart' }, target: { price: 5.49, unit: 'container', store: 'Target' } }
        },
        'greek yogurt': {
            name: 'Organic Greek Yogurt', category: 'dairy', image: '🥛', organic: true, inStock: true,
            prices: { instacart: { price: 6.99, unit: 'container', store: 'Whole Foods' }, amazon_fresh: { price: 5.99, unit: 'container', store: 'Amazon Fresh' }, walmart: { price: 4.98, unit: 'container', store: 'Walmart' }, target: { price: 6.49, unit: 'container', store: 'Target' } }
        },
        'milk': {
            name: 'Organic Whole Milk', category: 'dairy', image: '🥛', organic: true, inStock: true,
            prices: { instacart: { price: 4.99, unit: 'gallon', store: 'Whole Foods' }, amazon_fresh: { price: 3.99, unit: 'gallon', store: 'Amazon Fresh' }, walmart: { price: 2.98, unit: 'gallon', store: 'Walmart' }, target: { price: 4.49, unit: 'gallon', store: 'Target' } }
        },
        'cheese': {
            name: 'Organic Cheddar Cheese', category: 'dairy', image: '🧀', organic: true, inStock: true,
            prices: { instacart: { price: 6.99, unit: 'block', store: 'Whole Foods' }, amazon_fresh: { price: 5.99, unit: 'block', store: 'Amazon Fresh' }, walmart: { price: 4.98, unit: 'block', store: 'Walmart' }, target: { price: 6.49, unit: 'block', store: 'Target' } }
        },
        'olive oil': {
            name: 'Extra Virgin Olive Oil', category: 'fats', image: '🫒', organic: false, inStock: true,
            prices: { instacart: { price: 12.99, unit: 'bottle', store: 'Whole Foods' }, amazon_fresh: { price: 10.99, unit: 'bottle', store: 'Amazon Fresh' }, walmart: { price: 7.98, unit: 'bottle', store: 'Walmart' }, target: { price: 11.99, unit: 'bottle', store: 'Target' } }
        },
        'mixed nuts': {
            name: 'Organic Mixed Nuts', category: 'fats', image: '🥜', organic: true, inStock: true,
            prices: { instacart: { price: 11.99, unit: 'bag', store: 'Whole Foods' }, amazon_fresh: { price: 9.99, unit: 'bag', store: 'Amazon Fresh' }, walmart: { price: 7.98, unit: 'bag', store: 'Walmart' }, target: { price: 10.99, unit: 'bag', store: 'Target' } }
        }
    };

    // Global State Management
    let currentState = {
        selectedService: 'instacart',
        shoppingCart: [],
        activeView: 'services',
        searchQuery: '',
        selectedCategory: 'All',
        showCheckout: false,
        showUpload: false,
        isImporting: false
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

    const saveData = (key, data) => {
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

    const loadData = (key, defaultValue = null) => {
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
        
        // Direct match first
        if (PRODUCT_DATABASE[normalizedIngredient]) {
            return PRODUCT_DATABASE[normalizedIngredient];
        }
        
        // Fuzzy matching for common variations
        const fuzzyMatches = {
            'chicken': 'chicken breast',
            'turkey': 'ground turkey',
            'tomato': 'tomatoes',
            'pepper': 'bell peppers',
            'peppers': 'bell peppers',
            'onion': 'onions',
            'carrot': 'carrots',
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
        
        if (product.category === 'grains' || product.category === 'fats') {
            return 1; // Pantry staples
        }
        
        if (product.category === 'vegetables') {
            return Math.min(3, Math.max(1, Math.ceil(qty * 0.8)));
        }
        
        if (product.category === 'protein') {
            return Math.min(2, Math.max(1, Math.ceil(qty)));
        }
        
        return Math.min(3, Math.max(1, Math.ceil(qty)));
    };

    // Core Actions
    const actions = {
        selectService: (serviceId) => {
            currentState.selectedService = serviceId;
            saveData('habbt_delivery_service', serviceId);
            renderApp();
        },

        addToCart: (productKey, quantity = 1) => {
            const product = PRODUCT_DATABASE[productKey];
            if (!product || !product.prices[currentState.selectedService]) return;

            const existingItem = currentState.shoppingCart.find(item => item.productKey === productKey);
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                currentState.shoppingCart.push({
                    productKey,
                    product,
                    quantity
                });
            }
            
            saveData('habbt_delivery_cart', currentState.shoppingCart);
            renderApp();
        },

        updateCartQuantity: (index, newQuantity) => {
            if (newQuantity <= 0) {
                currentState.shoppingCart.splice(index, 1);
            } else {
                currentState.shoppingCart[index].quantity = newQuantity;
            }
            saveData('habbt_delivery_cart', currentState.shoppingCart);
            renderApp();
        },

        removeFromCart: (index) => {
            currentState.shoppingCart.splice(index, 1);
            saveData('habbt_delivery_cart', currentState.shoppingCart);
            renderApp();
        },

        setActiveView: (view) => {
            currentState.activeView = view;
            renderApp();
        },

        setSearchQuery: (query) => {
            currentState.searchQuery = query;
            renderApp();
        },

        setSelectedCategory: (category) => {
            currentState.selectedCategory = category;
            renderApp();
        },

        setShowCheckout: (show) => {
            currentState.showCheckout = show;
            renderApp();
        },

        setShowUpload: (show) => {
            currentState.showUpload = show;
            renderApp();
        },

        importFromMealPlan: async () => {
            if (currentState.isImporting) return;
            currentState.isImporting = true;
            renderApp();

            try {
                // Try multiple storage keys for meal plan data
                let groceryList = null;
                const storageKeys = [
                    'fueliq_pending_grocery_list',
                    'habbt_pending_grocery_list',
                    'fueliq_meal_plan',
                    'habbt_meal_plan',
                    'meal_plan'
                ];

                console.log('🔍 Searching for meal plan data...');

                // First try pending grocery lists
                for (const key of storageKeys.slice(0, 2)) {
                    const data = loadData(key);
                    if (data) {
                        groceryList = Array.isArray(data) ? data : (data.ingredients ? Object.values(data.ingredients) : []);
                        console.log(`✅ Found pending grocery list in ${key}:`, groceryList.length, 'items');
                        saveData(key, null); // Clear it
                        break;
                    }
                }

                // If no pending list, try meal plans
                if (!groceryList || groceryList.length === 0) {
                    for (const key of storageKeys.slice(2)) {
                        const mealPlan = loadData(key);
                        if (mealPlan && typeof mealPlan === 'object') {
                            groceryList = convertMealPlanToGroceryList(mealPlan);
                            console.log(`✅ Converted meal plan from ${key}:`, groceryList.length, 'items');
                            break;
                        }
                    }
                }

                if (!groceryList || groceryList.length === 0) {
                    alert('❌ No meal plan found. Please create a meal plan first.');
                    return;
                }

                let addedCount = 0;
                const failedItems = [];

                groceryList.forEach(item => {
                    const itemName = item.name || item.ingredient?.name || item.item || 'Unknown';
                    const product = findBestProductMatch(itemName);
                    
                    if (product) {
                        const rawQuantity = item.neededAmount || item.totalAmount || item.amount || item.quantity || 1;
                        const smartQuantity = calculateSmartQuantity(rawQuantity, product, itemName);
                        
                        const existingItem = currentState.shoppingCart.find(cartItem => cartItem.productKey === itemName.toLowerCase());
                        if (existingItem) {
                            existingItem.quantity = Math.min(existingItem.quantity + smartQuantity, 4);
                        } else {
                            currentState.shoppingCart.push({
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
                saveData('habbt_delivery_cart', currentState.shoppingCart);

            } catch (error) {
                console.error('Import error:', error);
                alert('❌ Error importing meal plan. Please try again.');
            } finally {
                currentState.isImporting = false;
                renderApp();
            }
        }
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

    // Render Functions
    const renderApp = () => {
        const container = document.getElementById('delivery-app-container');
        if (!container) return;

        const filteredProducts = Object.entries(PRODUCT_DATABASE).filter(([key, product]) => {
            const matchesSearch = !currentState.searchQuery || 
                product.name.toLowerCase().includes(currentState.searchQuery.toLowerCase()) ||
                key.toLowerCase().includes(currentState.searchQuery.toLowerCase());
            const matchesCategory = currentState.selectedCategory === 'All' || product.category === currentState.selectedCategory;
            return matchesSearch && matchesCategory && product.prices[currentState.selectedService];
        });

        const categories = ['All', ...new Set(Object.values(PRODUCT_DATABASE).map(p => p.category))];

        const cartTotal = currentState.shoppingCart.reduce((sum, item) => {
            const price = item.product.prices[currentState.selectedService];
            return sum + (price ? price.price * item.quantity : 0);
        }, 0);

        const service = DELIVERY_SERVICES[currentState.selectedService];
        const deliveryFee = cartTotal >= service.minOrder ? service.deliveryFee : service.deliveryFee + 5;
        const grandTotal = cartTotal + deliveryFee;

        const comparison = currentState.shoppingCart.length > 0 ? compareServicePrices(currentState.shoppingCart) : null;

        container.innerHTML = `
            <div class="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-cyan-50">
                
                <!-- Header -->
                <div class="bg-gradient-to-r from-blue-600 to-teal-600 shadow-2xl">
                    <div class="max-w-7xl mx-auto px-6 py-8">
                        <div class="text-center text-white">
                            <h1 class="text-4xl font-bold mb-2">🚚 Smart Delivery</h1>
                            <p class="text-xl opacity-90">From meal plans to your doorstep</p>
                            <div class="mt-6 grid grid-cols-3 gap-4 max-w-md mx-auto">
                                <div class="text-center">
                                    <div class="text-2xl font-bold">${currentState.shoppingCart.length}</div>
                                    <div class="text-sm opacity-90">Cart Items</div>
                                </div>
                                <div class="text-center">
                                    <div class="text-2xl font-bold">$${cartTotal.toFixed(2)}</div>
                                    <div class="text-sm opacity-90">Subtotal</div>
                                </div>
                                <div class="text-center">
                                    <div class="text-2xl font-bold">${DELIVERY_SERVICES[currentState.selectedService].logo}</div>
                                    <div class="text-sm opacity-90">${currentState.selectedService}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="max-w-7xl mx-auto p-6">
                    
                    <!-- Quick Actions -->
                    <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-4 mb-6">
                        <div class="flex flex-wrap gap-3 justify-center">
                            <button onclick="window.deliveryActions.importFromMealPlan()" 
                                    ${currentState.isImporting ? 'disabled' : ''}
                                    class="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 text-white rounded-lg font-semibold transition-all">
                                ${currentState.isImporting ? '⏳ Importing...' : '📅 Import Meal Plan'}
                            </button>
                            
                            <button onclick="window.deliveryActions.setShowUpload(true)"
                                    class="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-lg font-semibold transition-all">
                                📝 Manual List
                            </button>
                            
                            <button onclick="window.deliveryActions.setActiveView('products')"
                                    class="px-6 py-3 bg-gradient-to-r from-blue-500 to-teal-600 hover:from-blue-600 hover:to-teal-700 text-white rounded-lg font-semibold transition-all">
                                🛒 Browse Products
                            </button>
                            
                            ${currentState.shoppingCart.length > 0 ? `
                                <button onclick="window.deliveryActions.setShowCheckout(true)"
                                        ${cartTotal < service.minOrder ? 'disabled' : ''}
                                        class="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 disabled:opacity-50 text-white rounded-lg font-semibold transition-all">
                                    🚚 Checkout ($${grandTotal.toFixed(2)})
                                </button>
                            ` : ''}
                        </div>
                    </div>

                    <!-- Service Selection -->
                    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
                        ${Object.entries(DELIVERY_SERVICES).map(([id, service]) => `
                            <div onclick="window.deliveryActions.selectService('${id}')"
                                 class="p-6 rounded-xl cursor-pointer transition-all duration-200 hover:scale-105 ${
                                     currentState.selectedService === id 
                                         ? 'border-2 border-blue-500 bg-gradient-to-r from-blue-50 to-teal-50 shadow-xl' 
                                         : 'border-2 border-gray-200 bg-white/80 hover:border-blue-300'
                                 }">
                                <div class="text-center">
                                    <div class="text-4xl mb-2">${service.logo}</div>
                                    <h3 class="font-bold text-lg text-gray-800">${service.name}</h3>
                                    <div class="text-sm text-gray-600 mt-2 space-y-1">
                                        <div>⭐ ${service.rating}/5.0</div>
                                        <div>⏱️ ${service.deliveryTime}</div>
                                        <div>💰 $${service.deliveryFee} delivery</div>
                                        <div>📦 $${service.minOrder} minimum</div>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>

                    ${comparison ? `
                        <!-- Price Comparison -->
                        <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6 mb-8">
                            <h3 class="text-xl font-bold text-gray-800 mb-4">💰 Price Comparison</h3>
                            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                                ${Object.entries(comparison).sort((a, b) => a[1].total - b[1].total).map(([serviceId, data], index) => `
                                    <div class="p-4 rounded-lg border-2 ${
                                        serviceId === currentState.selectedService ? 'border-blue-500 bg-blue-50' : 
                                        index === 0 ? 'border-green-500 bg-green-50' : 'border-gray-200'
                                    }">
                                        <div class="flex items-center justify-between mb-2">
                                            <div class="flex items-center space-x-2">
                                                <span class="text-2xl">${data.service.logo}</span>
                                                <span class="font-bold">${data.service.name}</span>
                                                ${index === 0 ? '<span class="text-green-600 text-xs">💰 Best</span>' : ''}
                                            </div>
                                        </div>
                                        <div class="text-sm space-y-1">
                                            <div>Items: ${data.availableItems}/${data.totalItems}</div>
                                            <div>Subtotal: $${data.subtotal.toFixed(2)}</div>
                                            <div>Delivery: $${data.deliveryFee.toFixed(2)}</div>
                                            <div class="font-bold">Total: $${data.total.toFixed(2)}</div>
                                        </div>
                                        ${serviceId !== currentState.selectedService ? `
                                            <button onclick="window.deliveryActions.selectService('${serviceId}')" 
                                                    class="mt-2 w-full text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200">
                                                Select
                                            </button>
                                        ` : ''}
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}

                    <!-- Products and Cart -->
                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        
                        <!-- Products Section -->
                        <div class="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6">
                            <h3 class="text-xl font-bold text-gray-800 mb-4">🛒 Browse Products</h3>
                            
                            <!-- Search and Filters -->
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <input type="text" placeholder="Search products..." 
                                       value="${currentState.searchQuery}"
                                       oninput="window.deliveryActions.setSearchQuery(this.value)"
                                       class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500">
                                <select onchange="window.deliveryActions.setSelectedCategory(this.value)"
                                        class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500">
                                    ${categories.map(cat => 
                                        `<option value="${cat}" ${currentState.selectedCategory === cat ? 'selected' : ''}>${cat}</option>`
                                    ).join('')}
                                </select>
                            </div>

                            <!-- Products Grid -->
                            <div class="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                                ${filteredProducts.map(([key, product]) => {
                                    const price = product.prices[currentState.selectedService];
                                    return `
                                        <div onclick="window.deliveryActions.addToCart('${key}')"
                                             class="bg-white rounded-lg border border-gray-200 p-3 hover:scale-105 transition-all cursor-pointer hover:shadow-md">
                                            <div class="text-center">
                                                <div class="text-2xl mb-2">${product.image}</div>
                                                <h4 class="font-medium text-xs text-gray-800 mb-2">${product.name}</h4>
                                                <div class="text-lg font-bold text-blue-600">$${price.price}</div>
                                                <div class="text-xs text-gray-500">per ${price.unit}</div>
                                                <div class="text-xs text-gray-500 mt-1">${price.store}</div>
                                                ${product.organic ? '<div class="text-xs text-green-600 mt-1">🌱 Organic</div>' : ''}
                                            </div>
                                        </div>
                                    `;
                                }).join('')}
                            </div>
                        </div>

                        <!-- Shopping Cart -->
                        <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6">
                            <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                🛒 Shopping Cart
                                <span class="ml-2 px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">${currentState.shoppingCart.length}</span>
                            </h3>

                            ${currentState.shoppingCart.length === 0 ? `
                                <div class="text-center py-8 text-gray-500">
                                    <div class="text-4xl mb-2">🛒</div>
                                    Your cart is empty
                                </div>
                            ` : `
                                <div class="space-y-3 mb-6 max-h-64 overflow-y-auto">
                                    ${currentState.shoppingCart.map((item, index) => {
                                        const price = item.product.prices[currentState.selectedService];
                                        const itemTotal = price ? price.price * item.quantity : 0;
                                        
                                        return `
                                            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                <div class="flex items-center space-x-3">
                                                    <div class="text-xl">${item.product.image}</div>
                                                    <div>
                                                        <div class="font-medium text-sm">${item.product.name}</div>
                                                        ${price ? `<div class="text-xs text-gray-600">$${price.price} per ${price.unit}</div>` : ''}
                                                    </div>
                                                </div>
                                                <div class="flex items-center space-x-2">
                                                    <button onclick="window.deliveryActions.updateCartQuantity(${index}, ${item.quantity - 1})"
                                                            class="w-6 h-6 bg-red-100 hover:bg-red-200 text-red-600 rounded-full flex items-center justify-center text-sm font-bold">−</button>
                                                    <span class="font-medium min-w-[1.5rem] text-center">${item.quantity}</span>
                                                    <button onclick="window.deliveryActions.updateCartQuantity(${index}, ${item.quantity + 1})"
                                                            class="w-6 h-6 bg-green-100 hover:bg-green-200 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">+</button>
                                                    <div class="ml-2 text-right">
                                                        <div class="font-bold text-blue-600 text-sm">$${itemTotal.toFixed(2)}</div>
                                                        <button onclick="window.deliveryActions.removeFromCart(${index})"
                                                                class="text-xs text-red-500 hover:text-red-700 underline">Remove</button>
                                                    </div>
                                                </div>
                                            </div>
                                        `;
                                    }).join('')}
                                </div>

                                <!-- Cart Summary -->
                                <div class="border-t pt-4">
                                    <div class="space-y-2">
                                        <div class="flex justify-between">
                                            <span>Subtotal:</span>
                                            <span>$${cartTotal.toFixed(2)}</span>
                                        </div>
                                        <div class="flex justify-between">
                                            <span>Delivery Fee:</span>
                                            <span>$${deliveryFee.toFixed(2)}</span>
                                        </div>
                                        ${cartTotal < service.minOrder ? `
                                            <div class="text-red-600 text-sm">
                                                Add $${(service.minOrder - cartTotal).toFixed(2)} to reach minimum order
                                            </div>
                                        ` : ''}
                                        <div class="border-t pt-2 flex justify-between font-bold text-lg">
                                            <span>Total:</span>
                                            <span class="text-blue-600">$${grandTotal.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            `}
                        </div>
                    </div>
                </div>

                ${currentState.showUpload ? renderUploadModal() : ''}
                ${currentState.showCheckout ? renderCheckoutModal() : ''}
            </div>
        `;
    };

    const renderUploadModal = () => {
        return `
            <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div class="bg-white rounded-xl shadow-2xl max-w-lg w-full">
                    <div class="p-6">
                        <div class="flex justify-between items-center mb-4">
                            <h2 class="text-xl font-bold text-gray-800">📝 Add Grocery List</h2>
                            <button onclick="window.deliveryActions.setShowUpload(false)"
                                    class="text-gray-500 hover:text-gray-700 text-xl font-bold">×</button>
                        </div>
                        <textarea id="manualListEntry"
                                  placeholder="Enter your grocery list here (one item per line)...

Example:
Chicken breast
Broccoli
Brown rice
Greek yogurt"
                                  class="w-full h-32 p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none"></textarea>
                        <div class="flex gap-3 mt-4">
                            <button onclick="window.deliveryActions.setShowUpload(false)"
                                    class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                                Cancel
                            </button>
                            <button onclick="window.deliveryActions.processManualList()"
                                    class="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-teal-600 hover:from-blue-600 hover:to-teal-700 text-white rounded-lg">
                                Add Items
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    };

    const renderCheckoutModal = () => {
        const subtotal = currentState.shoppingCart.reduce((sum, item) => {
            const price = item.product.prices[currentState.selectedService];
            return sum + (price ? price.price * item.quantity : 0);
        }, 0);

        const service = DELIVERY_SERVICES[currentState.selectedService];
        const total = subtotal + service.deliveryFee;

        return `
            <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div class="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    <div class="p-6">
                        <div class="flex justify-between items-center mb-6">
                            <h2 class="text-2xl font-bold text-gray-800">🚚 Checkout</h2>
                            <button onclick="window.deliveryActions.setShowCheckout(false)"
                                    class="text-gray-500 hover:text-gray-700 text-xl font-bold">×</button>
                        </div>
                        
                        <div class="space-y-6">
                            <!-- Service Info -->
                            <div class="bg-gray-50 rounded-lg p-4">
                                <h3 class="font-bold text-lg mb-2">📦 Delivery Service</h3>
                                <div class="flex items-center space-x-3">
                                    <span class="text-2xl">${service.logo}</span>
                                    <div>
                                        <div class="font-bold">${service.name}</div>
                                        <div class="text-sm text-gray-600">${service.deliveryTime} • $${service.deliveryFee} delivery</div>
                                    </div>
                                </div>
                            </div>

                            <!-- Address -->
                            <div>
                                <h3 class="font-bold text-lg mb-2">📍 Delivery Address</h3>
                                <input type="text" id="deliveryAddress" placeholder="Enter your delivery address"
                                       class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500">
                            </div>

                            <!-- Time Slot -->
                            <div>
                                <h3 class="font-bold text-lg mb-2">⏰ Delivery Time</h3>
                                <select id="timeSlot" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500">
                                    <option value="">Select a time slot</option>
                                    <option value="asap">ASAP (${service.deliveryTime})</option>
                                    <option value="morning">Tomorrow Morning (8am-12pm)</option>
                                    <option value="afternoon">Tomorrow Afternoon (12pm-5pm)</option>
                                    <option value="evening">Tomorrow Evening (5pm-9pm)</option>
                                </select>
                            </div>

                            <!-- Instructions -->
                            <div>
                                <h3 class="font-bold text-lg mb-2">📝 Special Instructions</h3>
                                <textarea id="instructions" placeholder="Leave at door, ring doorbell, etc."
                                          class="w-full h-20 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none"></textarea>
                            </div>

                            <!-- Order Summary -->
                            <div class="bg-gray-50 rounded-lg p-4">
                                <h3 class="font-bold text-lg mb-3">📋 Order Summary</h3>
                                <div class="space-y-2 mb-4">
                                    ${currentState.shoppingCart.map((item, index) => {
                                        const price = item.product.prices[currentState.selectedService];
                                        return `
                                            <div class="flex justify-between text-sm">
                                                <span>${item.product.name} x${item.quantity}</span>
                                                <span>$${(price.price * item.quantity).toFixed(2)}</span>
                                            </div>
                                        `;
                                    }).join('')}
                                </div>
                                <div class="border-t pt-3 space-y-2">
                                    <div class="flex justify-between">
                                        <span>Subtotal:</span>
                                        <span>$${subtotal.toFixed(2)}</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span>Delivery Fee:</span>
                                        <span>$${service.deliveryFee.toFixed(2)}</span>
                                    </div>
                                    <div class="flex justify-between font-bold text-lg border-t pt-2">
                                        <span>Total:</span>
                                        <span class="text-blue-600">$${total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button onclick="window.deliveryActions.placeOrder()"
                                class="w-full mt-6 px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg font-bold text-lg transition-all">
                            💳 Place Order - $${total.toFixed(2)}
                        </button>
                    </div>
                </div>
            </div>
        `;
    };

    // Additional Actions
    actions.processManualList = () => {
        const textInput = document.getElementById('manualListEntry')?.value;
        if (!textInput) return;

        const items = textInput.split('\n').filter(item => item.trim());
        let addedCount = 0;
        
        items.forEach(item => {
            const product = findBestProductMatch(item.trim());
            if (product) {
                actions.addToCart(item.trim().toLowerCase(), 1);
                addedCount++;
            }
        });
        
        alert(`✅ Added ${addedCount} items from your list!`);
        actions.setShowUpload(false);
    };

    actions.placeOrder = () => {
        const address = document.getElementById('deliveryAddress')?.value;
        const timeSlot = document.getElementById('timeSlot')?.value;
        const instructions = document.getElementById('instructions')?.value;

        if (!address || !timeSlot) {
            alert('Please fill in delivery address and time slot.');
            return;
        }

        const orderNumber = 'HBT' + Math.random().toString(36).substr(2, 9).toUpperCase();
        
        // Update pantry automatically
        updatePantryWithPurchase();

        alert(`🎉 Order placed successfully!
        
Order #: ${orderNumber}
Service: ${DELIVERY_SERVICES[currentState.selectedService].name}
Delivery: ${timeSlot === 'asap' ? 'ASAP' : timeSlot}
Address: ${address}

Items automatically added to your pantry!`);

        currentState.shoppingCart.length = 0; // Clear cart
        saveData('habbt_delivery_cart', currentState.shoppingCart);
        actions.setShowCheckout(false);
    };

    const updatePantryWithPurchase = () => {
        try {
            const pantryKeys = ['habbt_pantry', 'fueliq_pantry'];
            
            pantryKeys.forEach(key => {
                const pantryData = loadData(key, { items: [] });
                const items = pantryData.items || [];
                
                currentState.shoppingCart.forEach(item => {
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
                            notes: `Delivered via ${DELIVERY_SERVICES[currentState.selectedService].name}`
                        });
                    }
                });
                
                saveData(key, { items });
            });
        } catch (e) {
            console.warn('Could not update pantry:', e);
        }
    };

    // Main Rendering Function
    const createGroceryDeliveryInterface = (containerId = 'grocery-container') => {
        console.log('🚚 Creating grocery delivery interface...');
        
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`❌ Container ${containerId} not found`);
            return false;
        }

        // Load saved state
        currentState.shoppingCart = loadData('habbt_delivery_cart', []);
        currentState.selectedService = loadData('habbt_delivery_service', 'instacart');

        // Create app container
        container.innerHTML = '<div id="delivery-app-container"></div>';

        // Make actions globally available
        window.deliveryActions = actions;

        // Initial render
        renderApp();

        console.log('✅ Grocery delivery interface created successfully');
        return true;
    };

    // Export with all naming conventions
    const exportObject = {
        renderGroceryDelivery: createGroceryDeliveryInterface,
        createGroceryDeliveryInterface: createGroceryDeliveryInterface,
        cleanup: () => {
            window.deliveryActions = null;
        }
    };

    window.FuelIQGroceryDelivery = exportObject;
    window.HabbtGroceryDelivery = exportObject;
    window.FuelIQDelivery = exportObject;
    window.HabbtDelivery = exportObject;

    // Global functions
    window.tryRenderDelivery = createGroceryDeliveryInterface;
    window.renderDelivery = createGroceryDeliveryInterface;
    window.renderDeliveryTab = createGroceryDeliveryInterface;
    window.tryRenderGrocery = createGroceryDeliveryInterface;
    window.renderGrocery = createGroceryDeliveryInterface;
    window.renderGroceryTab = createGroceryDeliveryInterface;

    console.log('✅ FIXED Habbt Smart Delivery system loaded successfully!');
    console.log('🚚 Features: Working buttons + Meal plan import + Smart cart + Price comparison');
    console.log('🎨 Beautiful Habbt blue/teal branding + All interactions working');
    console.log('✅ Available as: HabbtGroceryDelivery, FuelIQGroceryDelivery, HabbtDelivery, FuelIQDelivery');

})();
