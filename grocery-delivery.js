// grocery-delivery.js - FuelIQ Grocery Delivery Integration (FIXED VERSION)
(function() {
    'use strict';
    
    // Prevent multiple loading
    if (window.FuelIQGroceryDelivery) {
        return;
    }

    // Simulated grocery delivery services and their product catalogs
    const DELIVERY_SERVICES = {
        instacart: {
            name: 'Instacart',
            logo: '🛒',
            deliveryFee: 5.99,
            minOrder: 35,
            estimatedDelivery: '2-3 hours',
            products: {
                'salmon': { name: 'Atlantic Salmon Fillet', price: 12.99, unit: 'lb', category: 'seafood' },
                'cod': { name: 'Wild Cod Fillet', price: 9.99, unit: 'lb', category: 'seafood' },
                'quinoa': { name: 'Organic Quinoa', price: 5.49, unit: 'lb', category: 'grains' },
                'spinach': { name: 'Baby Spinach (5oz)', price: 3.99, unit: 'container', category: 'vegetables' },
                'avocado': { name: 'Hass Avocados', price: 1.49, unit: 'each', category: 'fruits' },
                'sweet potato': { name: 'Sweet Potatoes', price: 2.49, unit: 'lb', category: 'vegetables' },
                'eggs': { name: 'Organic Eggs (12ct)', price: 4.99, unit: 'dozen', category: 'dairy' },
                'greek yogurt': { name: 'Greek Yogurt (32oz)', price: 5.99, unit: 'container', category: 'dairy' },
                'olive oil': { name: 'Extra Virgin Olive Oil', price: 8.99, unit: 'bottle', category: 'pantry' },
                'brown rice': { name: 'Brown Rice (2lb)', price: 3.99, unit: 'bag', category: 'grains' },
                'broccoli': { name: 'Fresh Broccoli', price: 2.99, unit: 'lb', category: 'vegetables' },
                'blueberries': { name: 'Fresh Blueberries', price: 4.99, unit: 'pint', category: 'fruits' },
                'almonds': { name: 'Raw Almonds', price: 8.99, unit: 'lb', category: 'nuts' },
                'lemon': { name: 'Fresh Lemons', price: 0.99, unit: 'each', category: 'fruits' },
                'garlic': { name: 'Fresh Garlic', price: 2.99, unit: 'lb', category: 'vegetables' }
            }
        },
        amazon_fresh: {
            name: 'Amazon Fresh',
            logo: '📦',
            deliveryFee: 9.99,
            minOrder: 50,
            estimatedDelivery: '4-6 hours',
            products: {
                'salmon': { name: 'Fresh Atlantic Salmon', price: 14.99, unit: 'lb', category: 'seafood' },
                'cod': { name: 'Premium Cod Fillet', price: 11.99, unit: 'lb', category: 'seafood' },
                'quinoa': { name: 'Quinoa (Organic)', price: 6.99, unit: 'lb', category: 'grains' },
                'spinach': { name: 'Organic Baby Spinach', price: 4.49, unit: 'bag', category: 'vegetables' },
                'avocado': { name: 'Premium Avocados', price: 1.99, unit: 'each', category: 'fruits' },
                'sweet potato': { name: 'Organic Sweet Potatoes', price: 3.49, unit: 'lb', category: 'vegetables' },
                'eggs': { name: 'Pasture-Raised Eggs', price: 6.99, unit: 'dozen', category: 'dairy' },
                'greek yogurt': { name: 'Premium Greek Yogurt', price: 7.99, unit: 'container', category: 'dairy' },
                'olive oil': { name: 'Premium Olive Oil', price: 12.99, unit: 'bottle', category: 'pantry' }
            }
        },
        shipt: {
            name: 'Shipt',
            logo: '🚗',
            deliveryFee: 7.99,
            minOrder: 40,
            estimatedDelivery: '1-2 hours',
            products: {
                'salmon': { name: 'Wild Salmon Fillet', price: 13.99, unit: 'lb', category: 'seafood' },
                'quinoa': { name: 'Tri-Color Quinoa', price: 5.99, unit: 'lb', category: 'grains' },
                'spinach': { name: 'Fresh Spinach Bundle', price: 3.49, unit: 'bunch', category: 'vegetables' },
                'avocado': { name: 'Ripe Avocados (4pk)', price: 4.99, unit: 'pack', category: 'fruits' },
                'eggs': { name: 'Farm Fresh Eggs', price: 5.49, unit: 'dozen', category: 'dairy' }
            }
        }
    };

    // Shopping cart state
    let cart = [];
    let selectedService = 'instacart';

    // Safe storage functions
    const isLocalStorageAvailable = () => {
        try {
            const test = '__localStorage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch(e) {
            return false;
        }
    };

    const safeStorage = {
        getItem: (key) => {
            if (isLocalStorageAvailable()) {
                return localStorage.getItem(key);
            }
            return null;
        },
        setItem: (key, value) => {
            if (isLocalStorageAvailable()) {
                try {
                    localStorage.setItem(key, value);
                } catch(e) {
                    console.warn('Storage quota exceeded');
                }
            }
        }
    };

    // FIXED: Smart consolidation function
    const consolidateIngredients = (ingredients) => {
        const consolidated = {};
        
        ingredients.forEach(ingredient => {
            const key = ingredient.name.toLowerCase().trim();
            
            if (consolidated[key]) {
                // Add quantities (convert to numbers and handle decimals)
                const existingQty = parseFloat(consolidated[key].quantity) || 1;
                const newQty = parseFloat(ingredient.quantity) || 1;
                consolidated[key].quantity = (existingQty + newQty).toFixed(1);
                
                // Track meal count for consolidation badge
                consolidated[key].mealCount = (consolidated[key].mealCount || 1) + 1;
            } else {
                consolidated[key] = {
                    ...ingredient,
                    quantity: parseFloat(ingredient.quantity) || 1,
                    mealCount: 1
                };
            }
        });
        
        return Object.values(consolidated);
    };

    // FIXED: Find matching products with better fuzzy matching
    const findMatchingProduct = (ingredientName, service) => {
        const products = DELIVERY_SERVICES[service].products;
        const searchTerm = ingredientName.toLowerCase().trim();
        
        // Direct match first
        if (products[searchTerm]) {
            return { key: searchTerm, product: products[searchTerm] };
        }
        
        // Fuzzy matching
        const matches = Object.keys(products).filter(key => {
            const productName = products[key].name.toLowerCase();
            return productName.includes(searchTerm) || 
                   searchTerm.includes(key) || 
                   key.includes(searchTerm);
        });
        
        if (matches.length > 0) {
            const bestMatch = matches[0];
            return { key: bestMatch, product: products[bestMatch] };
        }
        
        return null;
    };

    // FIXED: Calculate reasonable quantities based on ingredient amount
    const calculateReasonableQuantity = (ingredient, product) => {
        const ingredientQty = parseFloat(ingredient.quantity) || 1;
        const unit = ingredient.unit || '';
        
        // Convert common cooking amounts to grocery store units
        if (unit.includes('cup') || unit.includes('tbsp') || unit.includes('tsp')) {
            return 1; // Usually need 1 package/container for cooking measurements
        }
        
        if (unit.includes('lb') || unit.includes('pound')) {
            return Math.max(1, Math.ceil(ingredientQty)); // Round up to whole pounds
        }
        
        if (unit.includes('oz') && ingredientQty > 16) {
            return Math.ceil(ingredientQty / 16); // Convert to pounds if over 16oz
        }
        
        // For proteins, estimate reasonable portions
        if (product.category === 'seafood' && ingredientQty < 1) {
            return 1; // At least 1 lb of fish
        }
        
        // Default: use ingredient quantity but ensure minimum of 1
        return Math.max(1, Math.ceil(ingredientQty));
    };

    // FIXED: Cart management functions with proper quantity controls
    const addToCart = (ingredient, product, quantity = 1) => {
        const existingItem = cart.find(item => item.product.name === product.name);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({
                ingredient,
                product,
                quantity: quantity,
                mealCount: ingredient.mealCount || 1
            });
        }
        
        updateCartDisplay();
        saveCart();
    };

    // FIXED: Remove from cart
    const removeFromCart = (productName) => {
        cart = cart.filter(item => item.product.name !== productName);
        updateCartDisplay();
        saveCart();
    };

    // FIXED: Update cart item quantity with proper validation
    const updateCartQuantity = (productName, newQuantity) => {
        const item = cart.find(item => item.product.name === productName);
        if (item) {
            newQuantity = parseInt(newQuantity) || 0;
            if (newQuantity <= 0) {
                removeFromCart(productName);
            } else {
                item.quantity = newQuantity;
                updateCartDisplay();
                saveCart();
            }
        }
    };

    // FIXED: Calculate cart total with proper math
    const calculateCartTotal = () => {
        const subtotal = cart.reduce((sum, item) => {
            const itemPrice = parseFloat(item.product.price) || 0;
            const quantity = parseInt(item.quantity) || 1;
            return sum + (itemPrice * quantity);
        }, 0);
        
        const service = DELIVERY_SERVICES[selectedService];
        const deliveryFee = subtotal >= service.minOrder ? service.deliveryFee : service.deliveryFee + 2.99; // Extra fee for small orders
        const tax = subtotal * 0.08; // 8% tax
        
        return {
            subtotal: subtotal,
            deliveryFee: deliveryFee,
            tax: tax,
            total: subtotal + deliveryFee + tax
        };
    };

    // Save and load cart
    const saveCart = () => {
        safeStorage.setItem('grocery_cart', JSON.stringify({
            cart: cart,
            service: selectedService
        }));
    };

    const loadCart = () => {
        const saved = safeStorage.getItem('grocery_cart');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                cart = data.cart || [];
                selectedService = data.service || 'instacart';
            } catch(e) {
                console.warn('Error loading cart:', e);
            }
        }
    };

    // FIXED: Update cart display with working quantity controls
    const updateCartDisplay = () => {
        const cartContainer = document.getElementById('cart-items');
        const cartSummary = document.getElementById('cart-summary');
        
        if (!cartContainer) return;

        if (cart.length === 0) {
            cartContainer.innerHTML = '<div class="text-center text-gray-500 p-8">Your cart is empty</div>';
            if (cartSummary) cartSummary.innerHTML = '';
            return;
        }

        const totals = calculateCartTotal();

        cartContainer.innerHTML = cart.map(item => `
            <div class="flex items-center justify-between p-4 border border-gray-200 rounded-lg mb-3">
                <div class="flex-1">
                    <h4 class="font-medium text-gray-900">${item.product.name}</h4>
                    <p class="text-sm text-gray-500">$${item.product.price}/${item.product.unit}</p>
                    ${item.mealCount > 1 ? `<span class="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mt-1">🔄 ${item.mealCount} meals</span>` : ''}
                </div>
                <div class="flex items-center space-x-3">
                    <div class="flex items-center space-x-2">
                        <button onclick="window.FuelIQGroceryDelivery.updateQuantity('${item.product.name}', ${item.quantity - 1})" 
                                class="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-600 transition-colors">
                            −
                        </button>
                        <span class="w-8 text-center font-medium">${item.quantity}</span>
                        <button onclick="window.FuelIQGroceryDelivery.updateQuantity('${item.product.name}', ${item.quantity + 1})" 
                                class="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-600 transition-colors">
                            +
                        </button>
                    </div>
                    <div class="text-right">
                        <p class="font-medium">$${(item.product.price * item.quantity).toFixed(2)}</p>
                        <button onclick="window.FuelIQGroceryDelivery.removeFromCart('${item.product.name}')" 
                                class="text-red-500 hover:text-red-700 text-sm transition-colors">
                            Remove
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        if (cartSummary) {
            cartSummary.innerHTML = `
                <div class="bg-gray-50 p-4 rounded-lg">
                    <div class="flex justify-between mb-2">
                        <span>Subtotal:</span>
                        <span>$${totals.subtotal.toFixed(2)}</span>
                    </div>
                    <div class="flex justify-between mb-2">
                        <span>Delivery Fee:</span>
                        <span>$${totals.deliveryFee.toFixed(2)}</span>
                    </div>
                    <div class="flex justify-between mb-2">
                        <span>Tax:</span>
                        <span>$${totals.tax.toFixed(2)}</span>
                    </div>
                    <div class="flex justify-between font-bold text-lg border-t pt-2">
                        <span>Total:</span>
                        <span>$${totals.total.toFixed(2)}</span>
                    </div>
                    ${totals.subtotal < DELIVERY_SERVICES[selectedService].minOrder ? 
                        `<p class="text-sm text-orange-600 mt-2">Add $${(DELIVERY_SERVICES[selectedService].minOrder - totals.subtotal).toFixed(2)} more for free delivery</p>` : 
                        '<p class="text-sm text-green-600 mt-2">✓ Eligible for standard delivery</p>'
                    }
                </div>
            `;
        }
    };

    // Import from meal plan with smart consolidation
    const importFromMealPlan = () => {
        const mealPlanData = safeStorage.getItem('meal_plan_data');
        if (!mealPlanData) {
            alert('No meal plan found. Please create a meal plan first.');
            return;
        }

        try {
            const mealPlan = JSON.parse(mealPlanData);
            const allIngredients = [];

            // Extract ingredients from all meals in the plan
            Object.values(mealPlan).forEach(dayMeals => {
                ['breakfast', 'lunch', 'dinner', 'snacks'].forEach(mealType => {
                    if (dayMeals[mealType] && dayMeals[mealType].ingredients) {
                        allIngredients.push(...dayMeals[mealType].ingredients);
                    }
                });
            });

            if (allIngredients.length === 0) {
                alert('No ingredients found in meal plan.');
                return;
            }

            // FIXED: Apply smart consolidation before adding to cart
            const consolidatedIngredients = consolidateIngredients(allIngredients);
            let addedCount = 0;

            consolidatedIngredients.forEach(ingredient => {
                const match = findMatchingProduct(ingredient.name, selectedService);
                if (match) {
                    const reasonableQty = calculateReasonableQuantity(ingredient, match.product);
                    addToCart(ingredient, match.product, reasonableQty);
                    addedCount++;
                }
            });

            alert(`Successfully imported ${addedCount} items from your meal plan!`);
            
        } catch(e) {
            console.error('Error importing meal plan:', e);
            alert('Error importing meal plan. Please try again.');
        }
    };

    // Initialize the grocery delivery module
    const initGroceryDelivery = () => {
        loadCart();
        
        // Set up service selector
        const serviceSelector = document.getElementById('delivery-service-selector');
        if (serviceSelector) {
            serviceSelector.innerHTML = Object.keys(DELIVERY_SERVICES).map(key => {
                const service = DELIVERY_SERVICES[key];
                return `
                    <div class="delivery-service-option ${key === selectedService ? 'selected' : ''}" 
                         onclick="window.FuelIQGroceryDelivery.selectService('${key}')">
                        <div class="text-2xl mb-2">${service.logo}</div>
                        <h3 class="font-bold">${service.name}</h3>
                        <p class="text-sm text-gray-600">$${service.deliveryFee} delivery</p>
                        <p class="text-xs text-gray-500">${service.estimatedDelivery}</p>
                    </div>
                `;
            }).join('');
        }

        updateCartDisplay();
    };

    // Service selection
    const selectService = (serviceKey) => {
        selectedService = serviceKey;
        
        // Update UI to show selected service
        document.querySelectorAll('.delivery-service-option').forEach(option => {
            option.classList.remove('selected');
        });
        
        const selectedOption = document.querySelector(`[onclick*="${serviceKey}"]`);
        if (selectedOption) {
            selectedOption.classList.add('selected');
        }
        
        updateCartDisplay();
        saveCart();
    };

    // Checkout process
    const checkout = () => {
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }

        const totals = calculateCartTotal();
        const service = DELIVERY_SERVICES[selectedService];
        
        // Simulate checkout process
        const confirmMessage = `
Order Summary:
${cart.map(item => `• ${item.product.name} (${item.quantity})`).join('\n')}

Total: $${totals.total.toFixed(2)}
Delivery via: ${service.name}
Estimated delivery: ${service.estimatedDelivery}

Proceed with checkout?
        `;

        if (confirm(confirmMessage)) {
            // Simulate order placement
            setTimeout(() => {
                alert(`Order placed successfully! Your groceries will be delivered via ${service.name} in ${service.estimatedDelivery}.`);
                cart = [];
                updateCartDisplay();
                saveCart();
            }, 1000);
        }
    };

    // Public API
    window.FuelIQGroceryDelivery = {
        init: initGroceryDelivery,
        importFromMealPlan: importFromMealPlan,
        selectService: selectService,
        addToCart: addToCart,
        removeFromCart: removeFromCart,
        updateQuantity: updateCartQuantity,
        checkout: checkout,
        getCart: () => cart,
        getTotals: calculateCartTotal
    };

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initGroceryDelivery);
    } else {
        initGroceryDelivery();
    }

    console.log('✅ Fixed Grocery Delivery Module Loaded');
})();
