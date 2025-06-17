// Main App Override - Complete Fix for tryRenderMeals
// This completely replaces the main app's problematic function

(function() {
    'use strict';

    console.log('🔧 Starting main app override to fix React DOM conflicts...');

    // NUCLEAR OPTION: Completely override the main app's tryRenderMeals function
    window.tryRenderMeals = function(containerId = 'meals-container') {
        console.log(`🎯 OVERRIDE: tryRenderMeals called for ${containerId}`);
        
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`❌ Container ${containerId} not found`);
            return false;
        }

        try {
            // Immediately clear any existing React roots to prevent conflicts
            console.log('🧹 Clearing container and any React roots...');
            
            // Try multiple cleanup methods
            try {
                // Method 1: ReactDOM unmount (React 17)
                if (typeof ReactDOM !== 'undefined' && typeof ReactDOM.unmountComponentAtNode === 'function') {
                    ReactDOM.unmountComponentAtNode(container);
                }
            } catch (e) {
                console.log('ReactDOM.unmountComponentAtNode not available or failed');
            }

            // Method 2: Clear innerHTML completely
            container.innerHTML = '';

            // Method 3: Remove all child nodes manually
            while (container.firstChild) {
                container.removeChild(container.firstChild);
            }

            // Show immediate loading state
            container.innerHTML = `
                <div class="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-cyan-50 flex items-center justify-center">
                    <div class="text-center">
                        <div class="text-6xl mb-4 animate-bounce">🍽️</div>
                        <h3 class="text-2xl font-bold text-gray-800 mb-2">Loading Meals & Nutrition</h3>
                        <div class="flex justify-center">
                            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                        <p class="text-gray-600 mt-4">Initializing nutrition tracking...</p>
                    </div>
                </div>
            `;

            // NO WAITING - render immediately with a slight delay to ensure DOM is clean
            setTimeout(() => {
                try {
                    console.log('🚀 Rendering meals tab immediately...');
                    
                    // Create the complete meals interface without any complex React mounting
                    const mealsHTML = `
                        <div class="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-cyan-50">
                            <div class="max-w-7xl mx-auto p-6">
                                <!-- Header -->
                                <div class="bg-gradient-to-r from-blue-600 to-teal-600 rounded-3xl shadow-2xl p-8 mb-8 text-white">
                                    <div class="text-center">
                                        <h1 class="text-4xl font-bold mb-4">🍽️ Nutrition & Meal Planning</h1>
                                        <div class="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                                            <p class="text-lg mb-3">Track your nutrition goals and plan healthy meals</p>
                                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <button id="nutrition-section-btn" class="px-6 py-3 bg-white/20 hover:bg-white/30 rounded-lg font-semibold transition-all">
                                                    📊 Nutrition Tracking
                                                </button>
                                                <button id="meal-planning-section-btn" class="px-6 py-3 bg-white/20 hover:bg-white/30 rounded-lg font-semibold transition-all">
                                                    📅 Meal Planning
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Content Sections -->
                                <div id="nutrition-section" class="content-section">
                                    <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-white/20">
                                        <h2 class="text-2xl font-bold text-gray-800 mb-6">📊 Nutrition Tracking</h2>
                                        
                                        <!-- Quick Stats -->
                                        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                                            <div class="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl">
                                                <div class="text-3xl font-bold" id="calories-display">0</div>
                                                <div class="text-sm opacity-75">Calories Today</div>
                                            </div>
                                            <div class="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-xl">
                                                <div class="text-3xl font-bold" id="protein-display">0g</div>
                                                <div class="text-sm opacity-75">Protein Today</div>
                                            </div>
                                            <div class="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl">
                                                <div class="text-3xl font-bold" id="meals-display">0</div>
                                                <div class="text-sm opacity-75">Meals Logged</div>
                                            </div>
                                            <div class="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl">
                                                <div class="text-3xl font-bold" id="progress-display">0%</div>
                                                <div class="text-sm opacity-75">Daily Progress</div>
                                            </div>
                                        </div>

                                        <!-- Quick Add Meal -->
                                        <div class="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
                                            <h3 class="text-xl font-bold text-gray-800 mb-4">➕ Quick Add Meal</h3>
                                            <form id="quick-meal-form" class="space-y-4">
                                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <input type="text" id="meal-name" placeholder="Meal name (e.g., Chicken Salad)" 
                                                           class="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" required>
                                                    <input type="number" id="meal-calories" placeholder="Calories" 
                                                           class="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" required>
                                                </div>
                                                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                                                    <input type="number" step="0.1" id="meal-protein" placeholder="Protein (g)" 
                                                           class="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500">
                                                    <input type="number" step="0.1" id="meal-carbs" placeholder="Carbs (g)" 
                                                           class="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500">
                                                    <input type="number" step="0.1" id="meal-fat" placeholder="Fat (g)" 
                                                           class="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500">
                                                    <input type="number" step="0.1" id="meal-fiber" placeholder="Fiber (g)" 
                                                           class="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500">
                                                </div>
                                                <button type="submit" class="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-teal-600 hover:from-blue-600 hover:to-teal-700 text-white rounded-lg font-bold text-lg transform hover:scale-105 transition-all">
                                                    ✅ Add Meal
                                                </button>
                                            </form>
                                        </div>

                                        <!-- Meals List -->
                                        <div class="mt-8">
                                            <h3 class="text-xl font-bold text-gray-800 mb-4">📋 Today's Meals</h3>
                                            <div id="meals-list" class="space-y-4">
                                                <div class="text-center py-8 text-gray-500">
                                                    <div class="text-4xl mb-2">🍽️</div>
                                                    <p>No meals logged yet today</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div id="meal-planning-section" class="content-section hidden">
                                    <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-white/20">
                                        <h2 class="text-2xl font-bold text-gray-800 mb-6">📅 Meal Planning</h2>
                                        <div class="text-center py-12">
                                            <div class="text-6xl mb-4">🔧</div>
                                            <h3 class="text-xl font-bold text-gray-800 mb-2">Meal Planning Available</h3>
                                            <p class="text-gray-600 mb-6">Advanced meal planning with precision targeting is available!</p>
                                            <button id="load-meal-planning" class="px-6 py-3 bg-gradient-to-r from-blue-500 to-teal-600 hover:from-blue-600 hover:to-teal-700 text-white rounded-lg font-semibold">
                                                🚀 Load Meal Planning
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;

                    container.innerHTML = mealsHTML;

                    // Add functionality without React
                    addMealsFunctionality();

                    console.log('✅ Meals tab loaded successfully (non-React version)');
                    return true;
                } catch (renderError) {
                    console.error('❌ Error in immediate render:', renderError);
                    
                    // Ultimate fallback
                    container.innerHTML = `
                        <div class="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-cyan-50 flex items-center justify-center">
                            <div class="text-center max-w-md">
                                <div class="text-6xl mb-4">🍽️</div>
                                <h2 class="text-2xl font-bold text-gray-800 mb-4">Meals & Nutrition</h2>
                                <p class="text-gray-600 mb-6">The advanced nutrition system is being prepared...</p>
                                <button onclick="location.reload()" class="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold">
                                    🔄 Refresh to Load
                                </button>
                            </div>
                        </div>
                    `;
                    return false;
                }
            }, 200);

            return true;
        } catch (error) {
            console.error('❌ Critical error in tryRenderMeals override:', error);
            
            container.innerHTML = `
                <div class="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
                    <div class="text-center max-w-md">
                        <div class="text-6xl mb-4">⚠️</div>
                        <h2 class="text-2xl font-bold text-red-600 mb-4">Loading Error</h2>
                        <p class="text-gray-600 mb-6">There was an issue loading the meals tab.</p>
                        <button onclick="location.reload()" class="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold">
                            🔄 Refresh Page
                        </button>
                    </div>
                </div>
            `;
            return false;
        }
    };

    // Add functionality without React
    function addMealsFunctionality() {
        console.log('🔧 Adding meals functionality...');

        // Load existing nutrition data
        loadNutritionData();

        // Section switching
        const nutritionBtn = document.getElementById('nutrition-section-btn');
        const mealPlanningBtn = document.getElementById('meal-planning-section-btn');
        const nutritionSection = document.getElementById('nutrition-section');
        const mealPlanningSection = document.getElementById('meal-planning-section');

        if (nutritionBtn && mealPlanningBtn) {
            nutritionBtn.addEventListener('click', () => {
                nutritionSection.className = 'content-section';
                mealPlanningSection.className = 'content-section hidden';
                nutritionBtn.className = 'px-6 py-3 bg-white/30 rounded-lg font-semibold transition-all';
                mealPlanningBtn.className = 'px-6 py-3 bg-white/20 hover:bg-white/30 rounded-lg font-semibold transition-all';
            });

            mealPlanningBtn.addEventListener('click', () => {
                mealPlanningSection.className = 'content-section';
                nutritionSection.className = 'content-section hidden';
                mealPlanningBtn.className = 'px-6 py-3 bg-white/30 rounded-lg font-semibold transition-all';
                nutritionBtn.className = 'px-6 py-3 bg-white/20 hover:bg-white/30 rounded-lg font-semibold transition-all';
            });
        }

        // Meal form functionality
        const mealForm = document.getElementById('quick-meal-form');
        if (mealForm) {
            mealForm.addEventListener('submit', (e) => {
                e.preventDefault();
                addMeal();
            });
        }

        // Load meal planning button
        const loadMealPlanningBtn = document.getElementById('load-meal-planning');
        if (loadMealPlanningBtn) {
            loadMealPlanningBtn.addEventListener('click', () => {
                if (typeof window.HabbtMealPlanning?.renderMealPlanning === 'function') {
                    mealPlanningSection.innerHTML = '<div id="meal-planning-container"></div>';
                    window.HabbtMealPlanning.renderMealPlanning('meal-planning-container');
                } else {
                    alert('🔧 Meal planning system is being prepared. Please refresh the page and try again.');
                }
            });
        }
    }

    function loadNutritionData() {
        try {
            const today = new Date().toISOString().split('T')[0];
            const stored = localStorage.getItem(`nutrition_${today}`);
            
            if (stored) {
                const data = JSON.parse(stored);
                updateDisplays(data);
            }
        } catch (error) {
            console.error('Error loading nutrition data:', error);
        }
    }

    function addMeal() {
        try {
            const name = document.getElementById('meal-name').value.trim();
            const calories = parseFloat(document.getElementById('meal-calories').value) || 0;
            const protein = parseFloat(document.getElementById('meal-protein').value) || 0;
            const carbs = parseFloat(document.getElementById('meal-carbs').value) || 0;
            const fat = parseFloat(document.getElementById('meal-fat').value) || 0;
            const fiber = parseFloat(document.getElementById('meal-fiber').value) || 0;

            if (!name || calories <= 0) {
                alert('❌ Please enter a meal name and calories');
                return;
            }

            const meal = {
                id: Date.now(),
                name, calories, protein, carbs, fat, fiber,
                timestamp: new Date().toISOString()
            };

            // Load existing data
            const today = new Date().toISOString().split('T')[0];
            const stored = localStorage.getItem(`nutrition_${today}`);
            const data = stored ? JSON.parse(stored) : {
                meals: [],
                totalCalories: 0,
                totalProtein: 0,
                totalCarbs: 0,
                totalFat: 0,
                totalFiber: 0
            };

            // Add new meal
            data.meals.push(meal);
            data.totalCalories += calories;
            data.totalProtein += protein;
            data.totalCarbs += carbs;
            data.totalFat += fat;
            data.totalFiber += fiber;

            // Save and update
            localStorage.setItem(`nutrition_${today}`, JSON.stringify(data));
            updateDisplays(data);
            
            // Clear form
            document.getElementById('quick-meal-form').reset();
            
            console.log('✅ Meal added:', name);
        } catch (error) {
            console.error('Error adding meal:', error);
            alert('❌ Error adding meal. Please try again.');
        }
    }

    function updateDisplays(data) {
        // Update stats
        document.getElementById('calories-display').textContent = data.totalCalories || 0;
        document.getElementById('protein-display').textContent = `${Math.round(data.totalProtein || 0)}g`;
        document.getElementById('meals-display').textContent = data.meals?.length || 0;
        
        // Calculate progress (assuming 2000 calorie goal)
        const progress = Math.round(((data.totalCalories || 0) / 2000) * 100);
        document.getElementById('progress-display').textContent = `${progress}%`;

        // Update meals list
        const mealsList = document.getElementById('meals-list');
        if (data.meals && data.meals.length > 0) {
            mealsList.innerHTML = data.meals.map(meal => `
                <div class="bg-gradient-to-r from-blue-50 to-teal-50 rounded-lg p-4 border border-blue-200">
                    <div class="flex justify-between items-start">
                        <div class="flex-1">
                            <h4 class="font-bold text-gray-800 mb-1">${meal.name}</h4>
                            <div class="grid grid-cols-5 gap-2 text-sm">
                                <div class="text-center">
                                    <div class="font-semibold text-blue-600">${meal.calories}</div>
                                    <div class="text-xs text-gray-500">cal</div>
                                </div>
                                <div class="text-center">
                                    <div class="font-semibold text-red-600">${meal.protein}g</div>
                                    <div class="text-xs text-gray-500">protein</div>
                                </div>
                                <div class="text-center">
                                    <div class="font-semibold text-yellow-600">${meal.carbs}g</div>
                                    <div class="text-xs text-gray-500">carbs</div>
                                </div>
                                <div class="text-center">
                                    <div class="font-semibold text-purple-600">${meal.fat}g</div>
                                    <div class="text-xs text-gray-500">fat</div>
                                </div>
                                <div class="text-center">
                                    <div class="font-semibold text-green-600">${meal.fiber}g</div>
                                    <div class="text-xs text-gray-500">fiber</div>
                                </div>
                            </div>
                        </div>
                        <button onclick="removeMeal(${meal.id})" class="ml-4 px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm">
                            🗑️
                        </button>
                    </div>
                </div>
            `).join('');
        } else {
            mealsList.innerHTML = `
                <div class="text-center py-8 text-gray-500">
                    <div class="text-4xl mb-2">🍽️</div>
                    <p>No meals logged yet today</p>
                </div>
            `;
        }
    }

    // Global remove meal function
    window.removeMeal = function(mealId) {
        try {
            const today = new Date().toISOString().split('T')[0];
            const stored = localStorage.getItem(`nutrition_${today}`);
            if (!stored) return;

            const data = JSON.parse(stored);
            const mealIndex = data.meals.findIndex(m => m.id === mealId);
            if (mealIndex === -1) return;

            const meal = data.meals[mealIndex];
            
            // Remove meal and update totals
            data.meals.splice(mealIndex, 1);
            data.totalCalories -= meal.calories;
            data.totalProtein -= meal.protein;
            data.totalCarbs -= meal.carbs;
            data.totalFat -= meal.fat;
            data.totalFiber -= meal.fiber;

            // Save and update
            localStorage.setItem(`nutrition_${today}`, JSON.stringify(data));
            updateDisplays(data);
            
            console.log('🗑️ Meal removed');
        } catch (error) {
            console.error('Error removing meal:', error);
        }
    };

    // Also override any other problematic functions
    window.renderMeals = window.tryRenderMeals;
    window.renderMealsTab = window.tryRenderMeals;

    console.log('✅ Main app override complete - tryRenderMeals completely replaced');
    console.log('🎯 React DOM conflicts should be eliminated');

})();
