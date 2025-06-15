// grocery-delivery.js - FuelIQ Grocery Delivery Integration
(function() {
  'use strict';

  // Simulated grocery delivery services and their product catalogs
  const DELIVERY_SERVICES = {
    instacart: {
      name: 'Instacart',
      logo: '🛒',
      deliveryFee: 5.99,
      minOrder: 35,
      deliveryTime: '1-2 hours',
      coverage: ['Whole Foods', 'Safeway', 'Costco', 'Target'],
      rating: 4.7
    },
    amazon_fresh: {
      name: 'Amazon Fresh',
      logo: '📦',
      deliveryFee: 0, // Free with Prime
      minOrder: 35,
      deliveryTime: '2-4 hours',
      coverage: ['Amazon Fresh Stores'],
      rating: 4.5
    },
    walmart: {
      name: 'Walmart Grocery',
      logo: '🟨',
      deliveryFee: 7.95,
      minOrder: 35,
      deliveryTime: '1-3 hours',
      coverage: ['Walmart Supercenter'],
      rating: 4.3
    },
    target: {
      name: 'Target Shipt',
      logo: '🎯',
      deliveryFee: 5.99,
      minOrder: 35,
      deliveryTime: '1-2 hours',
      coverage: ['Target', 'CVS', 'Petco'],
      rating: 4.6
    }
  };

  // Comprehensive product database with realistic pricing
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
    'extra firm tofu': {
      name: 'Organic Extra Firm Tofu',
      category: 'protein',
      prices: {
        instacart: { price: 3.49, unit: 'pack', store: 'Whole Foods' },
        amazon_fresh: { price: 2.99, unit: 'pack', store: 'Amazon Fresh' },
        walmart: { price: 2.48, unit: 'pack', store: 'Walmart' },
        target: { price: 3.19, unit: 'pack', store: 'Target' }
      },
      image: '🧈',
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
    'ground beef': {
      name: 'Organic Ground Beef',
      category: 'protein',
      prices: {
        instacart: { price: 12.99, unit: 'lb', store: 'Whole Foods' },
        amazon_fresh: { price: 10.49, unit: 'lb', store: 'Amazon Fresh' },
        walmart: { price: 8.98, unit: 'lb', store: 'Walmart' },
        target: { price: 11.99, unit: 'lb', store: 'Target' }
      },
      image: '🥩',
      organic: true,
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
    'mushrooms': {
      name: 'Fresh Button Mushrooms',
      category: 'vegetables',
      prices: {
        instacart: { price: 3.99, unit: 'container', store: 'Whole Foods' },
        amazon_fresh: { price: 2.99, unit: 'container', store: 'Amazon Fresh' },
        walmart: { price: 1.98, unit: 'container', store: 'Walmart' },
        target: { price: 3.49, unit: 'container', store: 'Target' }
      },
      image: '🍄',
      organic: false,
      inStock: true
    },
    'sweet potatoes': {
      name: 'Organic Sweet Potatoes',
      category: 'vegetables',
      prices: {
        instacart: { price: 2.99, unit: 'lb', store: 'Whole Foods' },
        amazon_fresh: { price: 2.49, unit: 'lb', store: 'Amazon Fresh' },
        walmart: { price: 1.68, unit: 'lb', store: 'Walmart' },
        target: { price: 2.79, unit: 'lb', store: 'Target' }
      },
      image: '🍠',
      organic: true,
      inStock: true
    },

    // Grains
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

  let selectedService = 'instacart';
  let shoppingCart = [];
  let deliveryPreferences = {
    address: '',
    timeSlot: '',
    instructions: ''
  };

  // Enhanced ingredient to product matching
  function findBestProductMatch(ingredientName) {
    const normalizedIngredient = ingredientName.toLowerCase();
    
    // Direct match
    if (PRODUCT_DATABASE[normalizedIngredient]) {
      return PRODUCT_DATABASE[normalizedIngredient];
    }
    
    // Fuzzy matching for common variations
    const fuzzyMatches = {
      'chicken': 'chicken breast',
      'salmon': 'salmon fillet',
      'tofu': 'extra firm tofu',
      'turkey': 'ground turkey',
      'beef': 'ground beef',
      'tomato': 'tomatoes',
      'pepper': 'bell peppers',
      'peppers': 'bell peppers',
      'onion': 'onions',
      'carrot': 'carrots',
      'mushroom': 'mushrooms',
      'sweet potato': 'sweet potatoes',
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
  }

  // Price comparison across services
  function compareServicePrices(cart) {
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
  }

  // Create grocery delivery interface
  function createGroceryDeliveryInterface(containerId, groceryList = null) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
        <!-- Header -->
        <div class="bg-gradient-to-r from-orange-500 to-red-600 shadow-2xl">
          <div class="max-w-7xl mx-auto px-6 py-8">
            <div class="text-center text-white">
              <h1 class="text-4xl font-bold mb-2" style="font-family: Georgia, Times, serif;">
                🚚 Smart Grocery Delivery
              </h1>
              <p class="text-xl opacity-90">From meal plans to your doorstep</p>
            </div>
          </div>
        </div>

        <div class="max-w-7xl mx-auto p-6">
          <!-- Service Selection -->
          <div class="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 mb-8 border border-white/20">
            <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              🏪 Choose Your Delivery Service
            </h2>
            <div id="serviceSelector" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <!-- Services will be populated here -->
            </div>
          </div>

          <!-- Shopping Lists Import -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <!-- Import Options -->
            <div class="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20">
              <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
                📋 Import Shopping List
              </h3>
              <div class="space-y-4">
                <button id="importFromMealPlan" class="w-full p-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl hover:scale-105 transition-all duration-200 font-bold">
                  📅 From Meal Plan
                </button>
                <button id="uploadGroceryList" class="w-full p-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-2xl hover:scale-105 transition-all duration-200 font-bold">
                  📄 Upload List
                </button>
                <button id="manualEntry" class="w-full p-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl hover:scale-105 transition-all duration-200 font-bold">
                  ✏️ Manual Entry
                </button>
              </div>
            </div>

            <!-- Price Comparison -->
            <div class="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20">
              <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
                💰 Price Comparison
              </h3>
              <div id="priceComparison">
                <p class="text-gray-600 text-center py-8">Add items to cart to see price comparison</p>
              </div>
            </div>
          </div>

          <!-- Product Search & Cart -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Product Browser -->
            <div class="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20">
              <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
                🔍 Browse Products
              </h3>
              <div class="mb-4">
                <input id="productSearch" type="text" placeholder="Search for products..." 
                       class="w-full px-4 py-3 bg-white/50 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all duration-200 font-medium">
              </div>
              <div id="productGrid" class="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                <!-- Products will be populated here -->
              </div>
            </div>

            <!-- Shopping Cart -->
            <div class="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20">
              <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
                🛒 Shopping Cart
                <span id="cartCount" class="ml-2 px-2 py-1 bg-orange-100 text-orange-600 rounded-full text-sm">0</span>
              </h3>
              <div id="cartItems" class="space-y-3 mb-6 max-h-64 overflow-y-auto">
                <p class="text-gray-600 text-center py-8">Your cart is empty</p>
              </div>
              <div id="cartSummary" class="border-t pt-4">
                <!-- Cart summary will be populated here -->
              </div>
              <button id="proceedToCheckout" class="w-full mt-4 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-2xl hover:from-orange-600 hover:to-red-700 font-bold transition-all duration-200" disabled>
                🚚 Proceed to Checkout
              </button>
            </div>
          </div>
        </div>

        <!-- Checkout Modal -->
        <div id="checkoutModal" class="fixed inset-0 bg-black/50 hidden items-center justify-center z-50 p-4">
          <div class="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div id="checkoutContent">
              <!-- Checkout content will be populated here -->
            </div>
          </div>
        </div>

        <!-- Upload Modal -->
        <div id="uploadModal" class="fixed inset-0 bg-black/50 hidden items-center justify-center z-50 p-4">
          <div class="bg-white rounded-3xl shadow-2xl max-w-lg w-full">
            <div class="p-8">
              <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold text-gray-800">📄 Upload Grocery List</h2>
                <button id="closeUpload" class="text-gray-500 hover:text-gray-700 text-3xl">&times;</button>
              </div>
              
              <div class="space-y-4">
                <div class="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                  <div class="text-4xl mb-4">📱</div>
                  <p class="text-gray-600 mb-4">Take a photo of your grocery list or paste text</p>
                  <input type="file" id="fileUpload" accept="image/*,.txt" class="hidden">
                  <button onclick="document.getElementById('fileUpload').click()" 
                          class="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl hover:from-orange-600 hover:to-red-700 font-bold transition-all duration-200">
                    📷 Upload Photo/File
                  </button>
                </div>
                
                <div class="text-center text-gray-500">or</div>
                
                <textarea id="manualListEntry" 
                          placeholder="Enter your grocery list here (one item per line)..."
                          class="w-full h-32 px-4 py-3 bg-white/50 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all duration-200 resize-none"></textarea>
                
                <button id="processUpload" 
                        class="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 font-bold transition-all duration-200">
                  ✨ Process List
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Initialize the interface
    renderServiceSelector();
    renderProductGrid();
    updateCart();
    setupGroceryEventListeners();

    // Auto-import with better checks
    setTimeout(() => {
      const pendingList = localStorage.getItem('fueliq_pending_grocery_list');
      if (pendingList && !window.importInProgress && !window.autoImportCompleted) {
        console.log('🔄 Auto-importing grocery list from meal planning...');
        
        window.autoImportCompleted = true;
        
        const importButton = document.getElementById('importFromMealPlan');
        if (importButton) {
          importButton.textContent = '⏳ Auto-importing...';
          importButton.disabled = true;
        }
        
        setTimeout(() => {
          importFromMealPlan();
          
          setTimeout(() => {
            if (importButton) {
              importButton.textContent = '📅 From Meal Plan';
              importButton.disabled = false;
            }
          }, 2000);
        }, 1000);
      }
    }, 500);

    if (groceryList) {
      importGroceryList(groceryList);
    }
  }

  function renderServiceSelector() {
    const container = document.getElementById('serviceSelector');
    if (!container) return;

    container.innerHTML = Object.entries(DELIVERY_SERVICES).map(([id, service]) => `
      <div class="service-card ${selectedService === id ? 'selected' : ''}" data-service="${id}"
           onclick="selectDeliveryService('${id}')">
        <div class="p-6 border-2 rounded-2xl transition-all duration-200 cursor-pointer hover:scale-105 ${
          selectedService === id 
            ? 'border-orange-500 bg-gradient-to-r from-orange-50 to-red-50' 
            : 'border-gray-200 bg-white hover:border-orange-300'
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
      </div>
    `).join('');
  }

  function renderProductGrid(searchTerm = '') {
    const container = document.getElementById('productGrid');
    if (!container) return;

    const products = Object.entries(PRODUCT_DATABASE).filter(([key, product]) => {
      if (!searchTerm) return true;
      return product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
             key.toLowerCase().includes(searchTerm.toLowerCase()) ||
             product.category.toLowerCase().includes(searchTerm.toLowerCase());
    });

    container.innerHTML = products.map(([key, product]) => {
      const price = product.prices[selectedService];
      if (!price) return '';
      
      return `
        <div class="product-card bg-white rounded-xl border border-gray-200 p-4 hover:scale-105 transition-all duration-200 cursor-pointer"
             onclick="addToCart('${key}')">
          <div class="text-center">
            <div class="text-3xl mb-2">${product.image}</div>
            <h4 class="font-medium text-sm text-gray-800 mb-2">${product.name}</h4>
            <div class="text-lg font-bold text-orange-600">$${price.price}</div>
            <div class="text-xs text-gray-500">per ${price.unit}</div>
            <div class="text-xs text-gray-500 mt-1">${price.store}</div>
            ${product.organic ? '<div class="text-xs text-green-600 mt-1">🌱 Organic</div>' : ''}
          </div>
        </div>
      `;
    }).join('');
  }

  function updateCart() {
    const cartItems = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');
    const cartSummary = document.getElementById('cartSummary');
    const checkoutBtn = document.getElementById('proceedToCheckout');

    if (!cartItems || !cartCount || !cartSummary || !checkoutBtn) return;

    cartCount.textContent = shoppingCart.length;

    if (shoppingCart.length === 0) {
      cartItems.innerHTML = '<p class="text-gray-600 text-center py-8">Your cart is empty</p>';
      cartSummary.innerHTML = '';
      checkoutBtn.disabled = true;
      return;
    }

    // Render cart items with improved remove buttons
    cartItems.innerHTML = shoppingCart.map((item, index) => {
      const price = item.product.prices[selectedService];
      const itemTotal = price.price * item.quantity;
      
      return `
        <div class="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
          <div class="flex items-center space-x-3">
            <div class="text-2xl">${item.product.image}</div>
            <div>
              <div class="font-medium text-sm">${item.product.name}</div>
              <div class="text-xs text-gray-600">$${price.price} per ${price.unit}</div>
            </div>
          </div>
          <div class="flex items-center space-x-2">
<button onclick="window.updateCartQuantity(${index}, ${item.quantity - 1})"                    class="w-8 h-8 bg-red-100 hover:bg-red-200 text-red-600 rounded-full flex items-center justify-center text-lg font-bold hover:scale-110 transition-all duration-200 ${item.quantity <= 1 ? 'hover:bg-red-500 hover:text-white' : ''}">−</button>
            <span class="font-medium text-lg min-w-[2rem] text-center">${item.quantity}</span>
<button onclick="window.updateCartQuantity(${index}, ${item.quantity + 1})"                    class="w-8 h-8 bg-green-100 hover:bg-green-200 text-green-600 rounded-full flex items-center justify-center text-lg font-bold hover:scale-110 transition-all duration-200">+</button>
            <div class="ml-3 text-right">
              <div class="font-bold text-orange-600">$${itemTotal.toFixed(2)}</div>
<button onclick="window.removeFromCart(${index})"
class="text-xs text-red-500 hover:text-red-700 underline">Remove</button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Calculate totals
    const subtotal = shoppingCart.reduce((sum, item) => {
      const price = item.product.prices[selectedService];
      return sum + (price.price * item.quantity);
    }, 0);

    const service = DELIVERY_SERVICES[selectedService];
    const deliveryFee = subtotal >= service.minOrder ? service.deliveryFee : service.deliveryFee + 5;
    const total = subtotal + deliveryFee;

    cartSummary.innerHTML = `
      <div class="space-y-2">
        <div class="flex justify-between">
          <span>Subtotal:</span>
          <span>$${subtotal.toFixed(2)}</span>
        </div>
        <div class="flex justify-between">
          <span>Delivery Fee:</span>
          <span>$${deliveryFee.toFixed(2)}</span>
        </div>
        ${subtotal < service.minOrder ? `
          <div class="text-red-600 text-sm">
            Add $${(service.minOrder - subtotal).toFixed(2)} to reach minimum order
          </div>
        ` : ''}
        <div class="border-t pt-2 flex justify-between font-bold text-lg">
          <span>Total:</span>
          <span class="text-orange-600">$${total.toFixed(2)}</span>
        </div>
      </div>
    `;

    checkoutBtn.disabled = subtotal < service.minOrder;
    updatePriceComparison();
  }

  // Remove item from cart
  function removeFromCart(index) {
    if (index >= 0 && index < shoppingCart.length) {
      const removedItem = shoppingCart[index];
      shoppingCart.splice(index, 1);
      updateCart();
      console.log(`✅ Removed ${removedItem.product.name} from cart`);
    }
  }

  function updatePriceComparison() {
    const container = document.getElementById('priceComparison');
    if (!container || shoppingCart.length === 0) return;

    const comparison = compareServicePrices(shoppingCart);
    const sortedServices = Object.entries(comparison).sort((a, b) => a[1].total - b[1].total);

    container.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        ${sortedServices.map(([serviceId, data], index) => `
          <div class="p-4 rounded-xl border-2 ${serviceId === selectedService ? 'border-orange-500 bg-orange-50' : 'border-gray-200'} 
                      ${index === 0 ? 'ring-2 ring-green-300 bg-green-50' : ''}">
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center space-x-2">
                <span class="text-2xl">${data.service.logo}</span>
                <span class="font-bold">${data.service.name}</span>
                ${index === 0 ? '<span class="text-green-600 text-sm">💰 Best Price</span>' : ''}
              </div>
              <button onclick="selectDeliveryService('${serviceId}')" 
                      class="text-sm px-3 py-1 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200">
                Select
              </button>
            </div>
            <div class="text-sm space-y-1">
              <div>Items: ${data.availableItems}/${data.totalItems}</div>
              <div>Subtotal: $${data.subtotal.toFixed(2)}</div>
              <div>Delivery: $${data.deliveryFee.toFixed(2)}</div>
              <div class="font-bold">Total: $${data.total.toFixed(2)}</div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  function setupGroceryEventListeners() {
    // Product search
    document.getElementById('productSearch')?.addEventListener('input', (e) => {
      renderProductGrid(e.target.value);
    });

    // Import button with duplicate prevention
    const importBtn = document.getElementById('importFromMealPlan');
    if (importBtn) {
      const newImportBtn = importBtn.cloneNode(true);
      importBtn.parentNode.replaceChild(newImportBtn, importBtn);
      
      newImportBtn.addEventListener('click', () => {
        console.log('🖱️ Manual import button clicked');
        importFromMealPlan();
      });
    }

    document.getElementById('uploadGroceryList')?.addEventListener('click', () => {
      document.getElementById('uploadModal').classList.remove('hidden');
      document.getElementById('uploadModal').classList.add('flex');
    });

    document.getElementById('manualEntry')?.addEventListener('click', () => {
      document.getElementById('uploadModal').classList.remove('hidden');
      document.getElementById('uploadModal').classList.add('flex');
      document.getElementById('manualListEntry').focus();
    });

    // Upload modal
    document.getElementById('closeUpload')?.addEventListener('click', () => {
      document.getElementById('uploadModal').classList.add('hidden');
    });

    document.getElementById('processUpload')?.addEventListener('click', processUploadedList);
    document.getElementById('proceedToCheckout')?.addEventListener('click', showCheckout);

    // Close modals when clicking outside
    ['checkoutModal', 'uploadModal'].forEach(modalId => {
      document.getElementById(modalId)?.addEventListener('click', (e) => {
        if (e.target.id === modalId) {
          document.getElementById(modalId).classList.add('hidden');
        }
      });
    });
  }

  // Local addToCart function
function addToCart(productKey, quantity = 1, updateUI = true) {
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

  if (updateUI) updateCart();
}

// FIXED: Smart quantity calculation to prevent crazy prices
function calculateSmartQuantity(rawQuantity, product, itemName) {
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
}

function getMaxQuantityForProduct(product) {
  // Maximum quantities to prevent cart explosion
  switch (product.category) {
    case 'grains':
    case 'fats':
      return 2; // Max 2 bags/bottles of pantry items
    case 'vegetables':
      return 4; // Max 4 lbs/bunches of vegetables  
    case 'protein':
      return 3; // Max 3 lbs of protein
    case 'dairy':
      return 3; // Max 3 containers of dairy
    default:
      return 4; // Default max
  }
}

// Helper function to convert meal plan format
function convertMealPlanToGroceryList(mealPlan) {
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
}

function importFromMealPlan() {
  if (window.importInProgress) {
    console.log('⚠️ Import already in progress, skipping...');
    return;
  }
  
  window.importInProgress = true;
  console.log('🔄 Starting import from meal plan...');
  
  try {
    let groceryList = null;
    
    // Try pending list first (from meal planning)
    try {
      const pendingList = localStorage.getItem('fueliq_pending_grocery_list');
      if (pendingList) {
        groceryList = JSON.parse(pendingList);
        console.log('📋 Found pending grocery list:', groceryList.length, 'items');
        localStorage.removeItem('fueliq_pending_grocery_list');
      }
    } catch (e) {
      console.warn('Could not load pending grocery list:', e.message);
    }

    // Fallback to meal plan if no pending list
    if (!groceryList || groceryList.length === 0) {
      try {
        const mealPlan = localStorage.getItem('fueliq_meal_plan');
        if (!mealPlan) {
          alert('❌ No meal plan found. Please create a meal plan first.');
          return;
        }
        
        const parsedPlan = JSON.parse(mealPlan);
        if (Object.keys(parsedPlan).length === 0) {
          alert('❌ Meal plan is empty. Please generate a meal plan first.');
          return;
        }
        
        groceryList = convertMealPlanToGroceryList(parsedPlan);
        console.log('📋 Converted meal plan to grocery list:', groceryList.length, 'items');
        
      } catch (e) {
        console.error('Error loading meal plan:', e);
        alert('❌ Error loading meal plan. Please try again.');
        return;
      }
    }

    if (!groceryList || groceryList.length === 0) {
      alert('❌ No items found to import.');
      return;
    }

    // Add items to cart with smart quantities
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
          const combinedQuantity = existingItem.quantity + smartQuantity;
          existingItem.quantity = Math.min(combinedQuantity, getMaxQuantityForProduct(product));
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

    updateCart();
    
    // Success message
    let message = `✅ Imported ${addedCount} items from meal plan!`;
    if (failedItems.length > 0) {
      message += `\n\n⚠️ Could not find: ${failedItems.slice(0, 3).join(', ')}`;
      if (failedItems.length > 3) {
        message += ` and ${failedItems.length - 3} more`;
      }
    }
    
    alert(message);
    console.log(`✅ Successfully imported ${addedCount} items`);

  } catch (error) {
    console.error('❌ Import error:', error);
    alert('❌ Error importing meal plan. Please try again.');
  } finally {
    setTimeout(() => {
      window.importInProgress = false;
      console.log('🔓 Import complete');
    }, 1000);
  }
}
function processUploadedList() {
  const textInput = document.getElementById('manualListEntry')?.value;
  const fileInput = document.getElementById('fileUpload')?.files[0];

  if (textInput) {
    const items = textInput.split('\n').filter(item => item.trim());
    let addedCount = 0;
    
    items.forEach(item => {
      const product = findBestProductMatch(item.trim());
      if (product) {
        addToCart(item.trim().toLowerCase(), 1, false);
        addedCount++;
      }
    });
    
    updateCart();
    document.getElementById('uploadModal').classList.add('hidden');
    alert(`✅ Added ${addedCount} items from your list!`);
  } else if (fileInput) {
    alert('📱 OCR processing would happen here in a real app. For now, please use text input.');
  } else {
    alert('Please enter a grocery list or upload a file.');
  }
}

function showCheckout() {
  const modal = document.getElementById('checkoutModal');
  const content = document.getElementById('checkoutContent');
  
  if (!modal || !content) return;

  const service = DELIVERY_SERVICES[selectedService];
  const subtotal = shoppingCart.reduce((sum, item) => {
    const price = item.product.prices[selectedService];
    return sum + (price.price * item.quantity);
  }, 0);
  
  const total = subtotal + service.deliveryFee;

  content.innerHTML = `
    <div class="p-8">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-3xl font-bold text-gray-800">🚚 Checkout</h2>
        <button onclick="document.getElementById('checkoutModal').classList.add('hidden')" 
                class="text-gray-500 hover:text-gray-700 text-3xl">&times;</button>
      </div>
      
      <div class="space-y-6">
        <div class="bg-gray-50 rounded-2xl p-6">
          <h3 class="font-bold text-lg mb-4">📦 Delivery Service</h3>
          <div class="flex items-center space-x-4">
            <span class="text-3xl">${service.logo}</span>
            <div>
              <div class="font-bold">${service.name}</div>
              <div class="text-sm text-gray-600">${service.deliveryTime} • $${service.deliveryFee} delivery</div>
            </div>
          </div>
        </div>

        <div>
          <h3 class="font-bold text-lg mb-4">📍 Delivery Address</h3>
          <input id="deliveryAddress" type="text" placeholder="Enter your delivery address" 
                 value="${deliveryPreferences.address}"
                 class="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all duration-200">
        </div>

        <div>
          <h3 class="font-bold text-lg mb-4">⏰ Delivery Time</h3>
          <select id="timeSlot" class="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all duration-200">
            <option value="">Select a time slot</option>
            <option value="asap">ASAP (${service.deliveryTime})</option>
            <option value="morning">Tomorrow Morning (8am-12pm)</option>
            <option value="afternoon">Tomorrow Afternoon (12pm-5pm)</option>
            <option value="evening">Tomorrow Evening (5pm-9pm)</option>
          </select>
        </div>

        <div>
          <h3 class="font-bold text-lg mb-4">📝 Special Instructions</h3>
          <textarea id="instructions" placeholder="Leave at door, ring doorbell, etc."
                    class="w-full h-20 px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all duration-200 resize-none">${deliveryPreferences.instructions}</textarea>
        </div>

        <div class="bg-gray-50 rounded-2xl p-6">
          <h3 class="font-bold text-lg mb-4">📋 Order Summary</h3>
          <div class="space-y-2 mb-4">
            ${shoppingCart.map(item => {
              const price = item.product.prices[selectedService];
              return `
                <div class="flex justify-between">
                  <span>${item.product.name} x${item.quantity}</span>
                  <span>$${(price.price * item.quantity).toFixed(2)}</span>
                </div>
              `;
            }).join('')}
          </div>
          <div class="border-t pt-4 space-y-2">
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
              <span class="text-orange-600">$${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <button onclick="placeOrder()" 
                class="w-full px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl hover:from-green-600 hover:to-emerald-700 font-bold text-lg shadow-xl transform hover:scale-105 transition-all duration-200">
          💳 Place Order - $${total.toFixed(2)}
        </button>
      </div>
    </div>
  `;

  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

// Global functions for event handlers
window.selectDeliveryService = function(serviceId) {
  selectedService = serviceId;
  renderServiceSelector();
  renderProductGrid();
  updateCart();
};

window.addToCart = function(productKey, quantity = 1, updateUI = true) {
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

  if (updateUI) updateCart();
};

window.updateCartQuantity = function(index, newQuantity) {
  if (index < 0 || index >= shoppingCart.length) {
    console.warn('Invalid cart index:', index);
    return;
  }
  
  if (newQuantity <= 0) {
    const removedItem = shoppingCart[index];
    shoppingCart.splice(index, 1);
    console.log(`✅ Removed ${removedItem.product.name} from cart`);
  } else {
    shoppingCart[index].quantity = newQuantity;
    console.log(`✅ Updated ${shoppingCart[index].product.name} quantity to ${newQuantity}`);
  }
  
  updateCart();
};

window.removeFromCart = function(index) {
  if (index >= 0 && index < shoppingCart.length) {
    const removedItem = shoppingCart[index];
    shoppingCart.splice(index, 1);
    updateCart();
    console.log(`✅ Removed ${removedItem.product.name} from cart`);
  }
};

window.placeOrder = function() {
  const address = document.getElementById('deliveryAddress')?.value;
  const timeSlot = document.getElementById('timeSlot')?.value;
  const instructions = document.getElementById('instructions')?.value;

  if (!address || !timeSlot) {
    alert('Please fill in delivery address and time slot.');
    return;
  }

  deliveryPreferences = { address, timeSlot, instructions };

  const orderNumber = 'FIQ' + Math.random().toString(36).substr(2, 9).toUpperCase();
  
  if (window.FuelIQIntegration) {
    window.FuelIQIntegration.updatePantryFromGrocery(
      shoppingCart.map(item => ({
        name: item.product.name,
        category: item.product.category,
        quantity: item.quantity,
        organic: item.product.organic
      })),
      'grocery_delivery'
    );
    
    if (window.FuelIQIntegration.utils) {
      window.FuelIQIntegration.utils.showSuccessMessage('Order placed! Pantry updated automatically.');
    }
  } else {
    updatePantryWithPurchase();
  }

  alert(`🎉 Order placed successfully!
  
Order #: ${orderNumber}
Service: ${DELIVERY_SERVICES[selectedService].name}
Delivery: ${timeSlot === 'asap' ? 'ASAP' : timeSlot}
Address: ${address}

Items automatically added to your pantry!`);

  shoppingCart = [];
  updateCart();
  document.getElementById('checkoutModal').classList.add('hidden');
};

function updatePantryWithPurchase() {
  try {
    const pantryItems = JSON.parse(localStorage.getItem('fueliq_pantry') || '{"items": []}');
    const items = pantryItems.items || [];
    
    shoppingCart.forEach(item => {
      const existingItem = items.find(p => p.name === item.product.name);
      if (existingItem) {
        existingItem.quantity += item.quantity;
      } else {
        items.push({
          name: item.product.name,
          category: item.product.category,
          quantity: item.quantity,
          dateAdded: new Date().toISOString(),
          source: 'grocery_delivery'
        });
      }
    });
    
    localStorage.setItem('fueliq_pantry', JSON.stringify({ items }));
  } catch (e) {
    console.warn('Could not update pantry:', e);
  }
}

function importGroceryList(groceryList) {
  if (groceryList && groceryList.ingredients) {
    Object.values(groceryList.ingredients).forEach(ingredient => {
      const product = findBestProductMatch(ingredient.name);
      if (product) {
        addToCart(ingredient.name.toLowerCase(), 1, false);
      }
    });
    updateCart();
  }
}

function cleanup() {
  shoppingCart = [];
  selectedService = 'instacart';
  deliveryPreferences = { address: '', timeSlot: '', instructions: '' };
  
  window.selectDeliveryService = null;
  window.addToCart = null;
  window.updateCartQuantity = null;
  window.placeOrder = null;
}

window.FuelIQGroceryDelivery = {
  renderGroceryDelivery: createGroceryDeliveryInterface,
  cleanup: cleanup
};

// Integration event listener with safeguards
if (window.FuelIQIntegration) {
  try {
    window.FuelIQIntegration.off('groceryListGenerated');
  } catch (e) {
    // Ignore if off method doesn't exist
  }
  
  window.FuelIQIntegration.on('groceryListGenerated', (data) => {
    console.log('🛒 Integration event: Received grocery list from meal planning:', data);
    
    if (document.getElementById('serviceSelector') && !window.importInProgress && !window.integrationImportCompleted) {
      console.log('🔄 Integration auto-import triggered');
      window.integrationImportCompleted = true;
      
      setTimeout(() => {
        importFromMealPlan();
      }, 500);
    } else {
      console.log('⚠️ Skipping integration auto-import (conditions not met)');
    }
  });
  
  console.log('🔗 Grocery Delivery connected to integration system');
}

// Cleanup function to reset flags
function resetImportFlags() {
  window.importInProgress = false;
  window.autoImportCompleted = false;
  window.integrationImportCompleted = false;
  console.log('🧹 Import flags reset');
}

window.addEventListener('beforeunload', resetImportFlags);

setInterval(() => {
  if (window.importInProgress) {
    console.log('⚠️ Import seems stuck, resetting flags...');
    resetImportFlags();
  }
}, 30000);

})();
