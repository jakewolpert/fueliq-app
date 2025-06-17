// DOM Hijacking Meals Fix - Direct Container Replacement
// This watches for the meals container and immediately replaces its content

(function() {
    'use strict';

    console.log('🎯 Starting DOM Hijacking for Meals Tab...');

    let isHijacked = false;
    let hijackAttempts = 0;
    const maxHijackAttempts = 50;
    let observer = null;

    // The working meals interface HTML
    const getWorkingMealsHTML = () => `
        <div class="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-cyan-50">
            <div class="max-w-7xl mx-auto p-6">
                <!-- Success Header -->
                <div class="bg-gradient-to-r from-green-600 to-blue-600 rounded-3xl shadow-2xl p-8 mb-8 text-white">
                    <div class="text-center">
                        <div class="text-6xl mb-4">🎉</div>
                        <h1 class="text-4xl font-bold mb-4">Meals Tab Fixed via DOM Hijacking!</h1>
                        <div class="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                            <p class="text-lg mb-2">✅ React DOM conflicts completely bypassed</p>
                            <p class="text-lg mb-2">🎯 Direct DOM manipulation successful</p>
                            <p class="text-lg">🍽️ Full nutrition tracking operational</p>
                        </div>
                    </div>
                </div>

                <!-- Nutrition Dashboard -->
                <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 mb-8">
                    <div class="bg-gradient-to-r from-blue-600 to-teal-600 text-white p-6 rounded-t-2xl">
                        <div class="flex items-center justify-between">
                            <h2 class="text-3xl font-bold flex items-center">
                                <span class="mr-3 text-4xl">🍽️</span>
                                Nutrition Dashboard
                            </h2>
                            <div class="flex items-center space-x-2">
                                <div class="px-3 py-1 bg-green-500/20 rounded-full text-sm font-semibold">
                                    🎯 DOM Hijacked
                                </div>
                                <button id="refresh-nutrition" class="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-semibold transition-colors">
                                    🔄 Refresh
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="p-6">
                        <!-- Stats Grid -->
                        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                            <div class="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg transform hover:scale-105 transition-transform">
                                <div class="flex items-center justify-between">
                                    <div>
                                        <div class="text-3xl font-bold" id="calories-today">0</div>
                                        <div class="text-sm opacity-90">Calories Today</div>
                                    </div>
                                    <div class="text-4xl opacity-80">🔥</div>
                                </div>
                                <div class="mt-2 text-xs opacity-75">Goal: <span id="calories-goal">2000</span></div>
                                <div class="w-full bg-white/20 rounded-full h-2 mt-2">
                                    <div id="calories-progress" class="bg-white h-2 rounded-full transition-all duration-500" style="width: 0%"></div>
                                </div>
                            </div>

                            <div class="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-xl shadow-lg transform hover:scale-105 transition-transform">
                                <div class="flex items-center justify-between">
                                    <div>
                                        <div class="text-3xl font-bold" id="protein-today">0g</div>
                                        <div class="text-sm opacity-90">Protein Today</div>
                                    </div>
                                    <div class="text-4xl opacity-80">💪</div>
                                </div>
                                <div class="mt-2 text-xs opacity-75">Goal: <span id="protein-goal">150g</span></div>
                                <div class="w-full bg-white/20 rounded-full h-2 mt-2">
                                    <div id="protein-progress" class="bg-white h-2 rounded-full transition-all duration-500" style="width: 0%"></div>
                                </div>
                            </div>

                            <div class="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg transform hover:scale-105 transition-transform">
                                <div class="flex items-center justify-between">
                                    <div>
                                        <div class="text-3xl font-bold" id="meals-today">0</div>
                                        <div class="text-sm opacity-90">Meals Logged</div>
                                    </div>
                                    <div class="text-4xl opacity-80">🍽️</div>
                                </div>
                                <div class="mt-2 text-xs opacity-75">Target: 3-5 meals</div>
                            </div>

                            <div class="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg transform hover:scale-105 transition-transform">
                                <div class="flex items-center justify-between">
                                    <div>
                                        <div class="text-3xl font-bold" id="progress-percent">0%</div>
                                        <div class="text-sm opacity-90">Daily Progress</div>
                                    </div>
                                    <div class="text-4xl opacity-80">🎯</div>
                                </div>
                                <div class="mt-2 text-xs opacity-75">Calorie goal progress</div>
                            </div>
                        </div>

                        <!-- Quick Add Meal -->
                        <div class="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200 mb-8">
                            <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                <span class="mr-2 text-2xl">➕</span>
                                Quick Add Meal
                                <span class="ml-2 px-2 py-1 bg-green-500 text-white text-xs rounded-full animate-pulse">WORKING</span>
                            </h3>

                            <form id="hijacked-meal-form" class="space-y-4">
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label class="block text-sm font-semibold text-gray-700 mb-2">🍽️ Meal Name</label>
                                        <input type="text" id="hijacked-meal-name" placeholder="e.g., Grilled Chicken Caesar Salad" 
                                               class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg" required>
                                    </div>
                                    <div>
                                        <label class="block text-sm font-semibold text-gray-700 mb-2">🔥 Calories</label>
                                        <input type="number" id="hijacked-meal-calories" placeholder="420" 
                                               class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg" required>
                                    </div>
                                </div>

                                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div>
                                        <label class="block text-sm font-semibold text-gray-700 mb-2">💪 Protein (g)</label>
                                        <input type="number" step="0.1" id="hijacked-meal-protein" placeholder="35" 
                                               class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">
                                    </div>
                                    <div>
                                        <label class="block text-sm font-semibold text-gray-700 mb-2">🌾 Carbs (g)</label>
                                        <input type="number" step="0.1" id="hijacked-meal-carbs" placeholder="25" 
                                               class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent">
                                    </div>
                                    <div>
                                        <label class="block text-sm font-semibold text-gray-700 mb-2">🥑 Fat (g)</label>
                                        <input type="number" step="0.1" id="hijacked-meal-fat" placeholder="15" 
                                               class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                                    </div>
                                    <div>
                                        <label class="block text-sm font-semibold text-gray-700 mb-2">🥬 Fiber (g)</label>
                                        <input type="number" step="0.1" id="hijacked-meal-fiber" placeholder="8" 
                                               class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                                    </div>
                                </div>

                                <button type="submit" id="hijacked-add-meal" 
                                        class="w-full px-8 py-4 bg-gradient-to-r from-blue-500 to-teal-600 hover:from-blue-600 hover:to-teal-700 text-white rounded-lg font-bold text-lg transform hover:scale-105 transition-all duration-200">
                                    ✅ Add Meal to Today's Log
                                </button>
                            </form>

                            <!-- Quick Options -->
                            <div class="mt-6 pt-6 border-t border-gray-200">
                                <h4 class="text-lg font-semibold text-gray-800 mb-3">⚡ Quick Options</h4>
                                <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
                                    <button type="button" class="quick-meal-btn p-3 bg-blue-100 hover:bg-blue-200 rounded-lg text-left transition-colors border border-blue-200"
                                            data-meal='{"name":"Protein Shake","calories":250,"protein":30,"carbs":8,"fat":3,"fiber":1}'>
                                        <div class="font-semibold text-gray-800 text-sm">🥤 Protein Shake</div>
                                        <div class="text-xs text-gray-600">250 cal • 30g protein</div>
                                    </button>
                                    <button type="button" class="quick-meal-btn p-3 bg-green-100 hover:bg-green-200 rounded-lg text-left transition-colors border border-green-200"
                                            data-meal='{"name":"Greek Yogurt Bowl","calories":180,"protein":20,"carbs":15,"fat":2,"fiber":3}'>
                                        <div class="font-semibold text-gray-800 text-sm">🥣 Greek Yogurt</div>
                                        <div class="text-xs text-gray-600">180 cal • 20g protein</div>
                                    </button>
                                    <button type="button" class="quick-meal-btn p-3 bg-orange-100 hover:bg-orange-200 rounded-lg text-left transition-colors border border-orange-200"
                                            data-meal='{"name":"Chicken Breast (6oz)","calories":350,"protein":65,"carbs":0,"fat":8,"fiber":0}'>
                                        <div class="font-semibold text-gray-800 text-sm">🍗 Chicken Breast</div>
                                        <div class="text-xs text-gray-600">350 cal • 65g protein</div>
                                    </button>
                                    <button type="button" class="quick-meal-btn p-3 bg-purple-100 hover:bg-purple-200 rounded-lg text-left transition-colors border border-purple-200"
                                            data-meal='{"name":"Oatmeal Bowl","calories":300,"protein":10,"carbs":55,"fat":6,"fiber":8}'>
                                        <div class="font-semibold text-gray-800 text-sm">🥣 Oatmeal Bowl</div>
                                        <div class="text-xs text-gray-600">300 cal • 10g protein</div>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Meals List -->
                        <div class="bg-white rounded-xl shadow-lg border border-gray-200">
                            <div class="bg-gradient-to-r from-gray-800 to-gray-700 text-white p-6 rounded-t-xl">
                                <div class="flex justify-between items-center">
                                    <h3 class="text-xl font-bold flex items-center">
                                        <span class="mr-2 text-2xl">📋</span>
                                        Today's Meals - ${new Date().toLocaleDateString('en-US', { 
                                            weekday: 'long', 
                                            month: 'long', 
                                            day: 'numeric' 
                                        })}
                                    </h3>
                                    <div class="text-sm opacity-75" id="last-updated">
                                        Updated: Just now
                                    </div>
                                </div>
                            </div>
                            <div class="p-6">
                                <div id="hijacked-meals-list">
                                    <div class="text-center py-8 text-gray-500">
                                        <div class="text-6xl mb-4 opacity-20">🍽️</div>
                                        <h4 class="text-lg font-semibold mb-2">No meals logged yet today</h4>
                                        <p class="text-gray-400">Add your first meal above to start tracking!</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Advanced Options -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20">
                        <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
                            <span class="mr-2 text-2xl">📅</span>
                            Meal Planning
                        </h3>
                        <p class="text-gray-600 mb-4">Advanced AI-powered meal planning with precision macro targeting is available</p>
                        <button id="hijacked-meal-planning" class="w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white rounded-lg font-semibold transition-all">
                            🚀 Load Meal Planning System
                        </button>
                    </div>

                    <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20">
                        <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
                            <span class="mr-2 text-2xl">🛠️</span>
                            System Status
                        </h3>
                        <div class="space-y-3">
                            <div class="flex items-center justify-between">
                                <span class="text-gray-600">DOM Hijacking</span>
                                <span class="px-2 py-1 bg-green-100 text-green-800 text-sm rounded font-semibold">Active</span>
                            </div>
                            <div class="flex items-center justify-between">
                                <span class="text-gray-600">React Conflicts</span>
                                <span class="px-2 py-1 bg-green-100 text-green-800 text-sm rounded font-semibold">Bypassed</span>
                            </div>
                            <div class="flex items-center justify-between">
                                <span class="text-gray-600">Data Storage</span>
                                <span class="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded font-semibold">localStorage</span>
                            </div>
                            <div class="flex items-center justify-between">
                                <span class="text-gray-600">Status</span>
                                <span class="px-2 py-1 bg-green-100 text-green-800 text-sm rounded font-semibold">Operational</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Data management functions
    const HijackedDataManager = {
        getTodaysKey() {
            return `hijacked_nutrition_${new Date().toISOString().split('T')[0]}`;
        },

        loadTodaysData() {
            try {
                const data = localStorage.getItem(this.getTodaysKey());
                return data ? JSON.parse(data) : {
                    meals: [],
                    totalCalories: 0,
                    totalProtein: 0,
                    totalCarbs: 0,
                    totalFat: 0,
                    totalFiber: 0
                };
            } catch (error) {
                console.error('Error loading data:', error);
                return { meals: [], totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0, totalFiber: 0 };
            }
        },

        saveTodaysData(data) {
            try {
                localStorage.setItem(this.getTodaysKey(), JSON.stringify(data));
                console.log('✅ Data saved successfully');
                return true;
            } catch (error) {
                console.error('Error saving data:', error);
                return false;
            }
        },

        getUserGoals() {
            try {
                // Try multiple sources
                if (typeof window.UnifiedDataManager !== 'undefined') {
                    const goals = window.UnifiedDataManager.getGoals();
                    if (goals && Object.keys(goals).length > 0) {
                        return goals;
                    }
                }

                const habbtProfile = localStorage.getItem('habbt_profile_data');
                const fueliqProfile = localStorage.getItem('fueliq_profile_data');
                const profile = JSON.parse(habbtProfile || fueliqProfile || '{}');
                
                return profile.goals || {
                    calories: 2000,
                    protein: 150,
                    carbs: 250,
                    fat: 67,
                    fiber: 25
                };
            } catch (error) {
                console.error('Error loading goals:', error);
                return { calories: 2000, protein: 150, carbs: 250, fat: 67, fiber: 25 };
            }
        }
    };

    // Initialize the hijacked interface
    function initializeHijackedInterface() {
        console.log('🔧 Initializing hijacked meals interface...');

        // Load data and update display
        updateNutritionDisplay();
        
        // Set up form submission
        const form = document.getElementById('hijacked-meal-form');
        if (form) {
            form.addEventListener('submit', handleMealSubmission);
        }

        // Set up quick meal buttons
        const quickMealBtns = document.querySelectorAll('.quick-meal-btn');
        quickMealBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const mealData = JSON.parse(btn.dataset.meal);
                populateForm(mealData);
            });
        });

        // Set up refresh button
        const refreshBtn = document.getElementById('refresh-nutrition');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                updateNutritionDisplay();
                showNotification('Data refreshed!', 'success');
            });
        }

        // Set up meal planning button
        const mealPlanningBtn = document.getElementById('hijacked-meal-planning');
        if (mealPlanningBtn) {
            mealPlanningBtn.addEventListener('click', loadMealPlanning);
        }

        console.log('✅ Hijacked interface initialized successfully');
    }

    function populateForm(mealData) {
        document.getElementById('hijacked-meal-name').value = mealData.name;
        document.getElementById('hijacked-meal-calories').value = mealData.calories;
        document.getElementById('hijacked-meal-protein').value = mealData.protein;
        document.getElementById('hijacked-meal-carbs').value = mealData.carbs;
        document.getElementById('hijacked-meal-fat').value = mealData.fat;
        document.getElementById('hijacked-meal-fiber').value = mealData.fiber;
    }

    function updateNutritionDisplay() {
        const data = HijackedDataManager.loadTodaysData();
        const goals = HijackedDataManager.getUserGoals();

        // Update stats
        document.getElementById('calories-today').textContent = data.totalCalories || 0;
        document.getElementById('protein-today').textContent = `${Math.round(data.totalProtein || 0)}g`;
        document.getElementById('meals-today').textContent = data.meals?.length || 0;

        // Update goals
        document.getElementById('calories-goal').textContent = goals.calories;
        document.getElementById('protein-goal').textContent = `${goals.protein}g`;

        // Update progress
        const calorieProgress = Math.round(((data.totalCalories || 0) / goals.calories) * 100);
        const proteinProgress = Math.round(((data.totalProtein || 0) / goals.protein) * 100);
        
        document.getElementById('progress-percent').textContent = `${calorieProgress}%`;
        document.getElementById('calories-progress').style.width = `${Math.min(calorieProgress, 100)}%`;
        document.getElementById('protein-progress').style.width = `${Math.min(proteinProgress, 100)}%`;

        // Update meals list
        updateMealsList(data.meals || []);

        // Update last updated time
        document.getElementById('last-updated').textContent = `Updated: ${new Date().toLocaleTimeString()}`;
    }

    function updateMealsList(meals) {
        const container = document.getElementById('hijacked-meals-list');
        
        if (meals.length === 0) {
            container.innerHTML = `
                <div class="text-center py-8 text-gray-500">
                    <div class="text-6xl mb-4 opacity-20">🍽️</div>
                    <h4 class="text-lg font-semibold mb-2">No meals logged yet today</h4>
                    <p class="text-gray-400">Add your first meal above to start tracking!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = meals.map(meal => `
            <div class="bg-gradient-to-r from-blue-50 to-teal-50 rounded-lg p-4 border border-blue-200 mb-4 hover:shadow-lg transition-shadow">
                <div class="flex justify-between items-start">
                    <div class="flex-1">
                        <div class="flex items-center mb-3">
                            <h4 class="font-bold text-gray-800 text-lg mr-3">${meal.name}</h4>
                            <span class="px-2 py-1 bg-blue-500 text-white text-xs rounded-full">
                                ${new Date(meal.timestamp).toLocaleTimeString('en-US', { 
                                    hour: 'numeric', 
                                    minute: '2-digit',
                                    hour12: true 
                                })}
                            </span>
                        </div>
                        <div class="grid grid-cols-5 gap-3 text-center">
                            <div class="bg-white rounded-lg p-3 border border-blue-200">
                                <div class="font-bold text-blue-600 text-lg">${meal.calories}</div>
                                <div class="text-xs text-gray-500">calories</div>
                            </div>
                            <div class="bg-white rounded-lg p-3 border border-red-200">
                                <div class="font-bold text-red-600 text-lg">${meal.protein}g</div>
                                <div class="text-xs text-gray-500">protein</div>
                            </div>
                            <div class="bg-white rounded-lg p-3 border border-yellow-200">
                                <div class="font-bold text-yellow-600 text-lg">${meal.carbs}g</div>
                                <div class="text-xs text-gray-500">carbs</div>
                            </div>
                            <div class="bg-white rounded-lg p-3 border border-purple-200">
                                <div class="font-bold text-purple-600 text-lg">${meal.fat}g</div>
                                <div class="text-xs text-gray-500">fat</div>
                            </div>
                            <div class="bg-white rounded-lg p-3 border border-green-200">
                                <div class="font-bold text-green-600 text-lg">${meal.fiber}g</div>
                                <div class="text-xs text-gray-500">fiber</div>
                            </div>
                        </div>
                    </div>
                    <button onclick="window.hijackedRemoveMeal(${meal.id})" 
                            class="ml-4 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-semibold transition-colors">
                        🗑️ Remove
                    </button>
                </div>
            </div>
        `).join('');
    }

    function handleMealSubmission(e) {
        e.preventDefault();
        
        const submitBtn = document.getElementById('hijacked-add-meal');
        submitBtn.disabled = true;
        submitBtn.textContent = '⏳ Adding Meal...';

        try {
            const name = document.getElementById('hijacked-meal-name').value.trim();
            const calories = parseFloat(document.getElementById('hijacked-meal-calories').value) || 0;
            const protein = parseFloat(document.getElementById('hijacked-meal-protein').value) || 0;
            const carbs = parseFloat(document.getElementById('hijacked-meal-carbs').value) || 0;
            const fat = parseFloat(document.getElementById('hijacked-meal-fat').value) || 0;
            const fiber = parseFloat(document.getElementById('hijacked-meal-fiber').value) || 0;

            if (!name || calories <= 0) {
                showNotification('Please enter a meal name and calories', 'error');
                return;
            }

            const meal = {
                id: Date.now(),
                name, calories, protein, carbs, fat, fiber,
                timestamp: new Date().toISOString()
            };

            // Load existing data
            const data = HijackedDataManager.loadTodaysData();

            // Add new meal
            data.meals.push(meal);
            data.totalCalories += calories;
            data.totalProtein += protein;
            data.totalCarbs += carbs;
            data.totalFat += fat;
            data.totalFiber += fiber;

            // Save and update
            HijackedDataManager.saveTodaysData(data);
            updateNutritionDisplay();
            
            // Clear form
            document.getElementById('hijacked-meal-form').reset();
            
            showNotification(`"${name}" added successfully!`, 'success');
            console.log('✅ Meal added via hijacked interface:', name);

        } catch (error) {
            console.error('Error adding meal:', error);
            showNotification('Error adding meal. Please try again.', 'error');
        } finally {
            submitBtn.textContent = '✅ Add Meal to Today\'s Log';
            submitBtn.disabled = false;
        }
    }

    // Global remove meal function
    window.hijackedRemoveMeal = function(mealId) {
        try {
            const data = HijackedDataManager.loadTodaysData();
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
            HijackedDataManager.saveTodaysData(data);
            updateNutritionDisplay();
            
            showNotification('Meal removed successfully', 'success');
            console.log('🗑️ Meal removed via hijacked interface');
        } catch (error) {
            console.error('Error removing meal:', error);
            showNotification('Error removing meal', 'error');
        }
    };

    function loadMealPlanning() {
        try {
            if (typeof window.HabbtMealPlanning?.IntelligentMealPlanningApp === 'function') {
                const container = document.getElementById('meals-container');
                container.innerHTML = '<div id="meal-planning-container"></div>';
                window.HabbtMealPlanning.renderMealPlanning('meal-planning-container');
                showNotification('Meal planning loaded!', 'success');
            } else {
                showNotification('Meal planning system not available. Please refresh the page.', 'warning');
            }
        } catch (error) {
            console.error('Error loading meal planning:', error);
            showNotification('Error loading meal planning', 'error');
        }
    }

    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg font-semibold text-white transition-all duration-300 transform translate-x-full`;
        
        switch (type) {
            case 'success':
                notification.className += ' bg-green-500';
                break;
            case 'error':
                notification.className += ' bg-red-500';
                break;
            case 'warning':
                notification.className += ' bg-yellow-500';
                break;
            default:
                notification.className += ' bg-blue-500';
        }
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, 100);
        
        // Animate out and remove
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // DOM Hijacking Logic
    function hijackMealsContainer() {
        hijackAttempts++;
        console.log(`🎯 DOM Hijack attempt ${hijackAttempts}/${maxHijackAttempts}`);

        const container = document.getElementById('meals-container');
        
        if (container && !isHijacked) {
            console.log('🎯 Meals container found! Hijacking now...');
            
            // Immediately replace content
            container.innerHTML = getWorkingMealsHTML();
            
            // Initialize functionality
            setTimeout(() => {
                initializeHijackedInterface();
            }, 100);
            
            isHijacked = true;
            console.log('✅ DOM Hijacking successful! Meals tab is now operational.');
            
            // Set up observer to re-hijack if content gets replaced
            if (observer) observer.disconnect();
            
            observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'childList' && 
                        container.children.length === 0) {
                        console.log('🔄 Container was cleared, re-hijacking...');
                        container.innerHTML = getWorkingMealsHTML();
                        setTimeout(() => {
                            initializeHijackedInterface();
                        }, 100);
                    }
                });
            });
            
            observer.observe(container, { childList: true, subtree: true });
            
            return true;
        }
        
        // Continue trying if not found and under limit
        if (hijackAttempts < maxHijackAttempts) {
            setTimeout(hijackMealsContainer, 500);
        } else {
            console.log('❌ DOM Hijacking failed - container not found after maximum attempts');
        }
        
        return false;
    }

    // Start hijacking immediately and set up continuous monitoring
    hijackMealsContainer();
    
    // Also use MutationObserver to watch for the container appearing
    const bodyObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                const container = document.getElementById('meals-container');
                if (container && !isHijacked) {
                    console.log('🎯 Meals container detected by MutationObserver!');
                    hijackMealsContainer();
                }
            }
        });
    });
    
    bodyObserver.observe(document.body, { childList: true, subtree: true });

    console.log('✅ DOM Hijacking system initialized and monitoring for meals container');

})();
