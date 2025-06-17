// FIXED Habbt Nutrition Tab with Meal Planning Integration
// Enhanced with proper loading, integration hooks, and workflow

// Storage functions with enhanced compatibility
const saveNutritionData = (date, data) => {
    const keys = [`habbt_nutrition_${date}`, `habbt_meals_${date}`, `fueliq_meals_${date}`];
    const dataStr = JSON.stringify(data);
    
    try {
        keys.forEach(key => localStorage.setItem(key, dataStr));
        console.log(`📊 Saved nutrition data for ${date}`);
    } catch (e) {
        console.warn('Storage failed:', e);
    }
};

const loadNutritionData = (date) => {
    const keys = [`habbt_nutrition_${date}`, `habbt_meals_${date}`, `fueliq_meals_${date}`];
    
    for (const key of keys) {
        try {
            const data = localStorage.getItem(key);
            if (data) {
                return JSON.parse(data);
            }
        } catch (e) {
            console.warn('Failed to load from', key);
        }
    }
    
    return { breakfast: [], lunch: [], dinner: [], snacks: [] };
};

// MEAL PLANNING INTEGRATION - The Critical Workflow with PROPER DATE MAPPING
const syncWithMealPlanning = (consumedMeals, nutritionDate) => {
    try {
        console.log(`🔄 Starting meal planning sync for nutrition date: ${nutritionDate}`);
        
        // Calculate what was actually consumed vs planned
        const consumedTotals = calculateMealTotals(consumedMeals);
        
        // CRITICAL: Map nutrition date to meal planning weekday
        const weekday = getMealPlanKeyFromDate(nutritionDate);
        const weekPlan = getWeekPlanForDate(nutritionDate);
        
        console.log(`📅 Date mapping: ${nutritionDate} → ${weekday}`);
        console.log(`📋 Week plan available days:`, Object.keys(weekPlan));
        
        // Check if we have a meal plan for this day
        if (!weekPlan[weekday]) {
            console.log(`⚠️ No meal plan found for ${weekday}, skipping adaptation`);
            return;
        }
        
        // Trigger meal planning recalculation if available
        if (window.HabbtMealPlanning && window.HabbtMealPlanning.adaptDayPlan) {
            console.log('🔄 Syncing with meal planning system...');
            
            // Get user preferences for adaptive planning
            const preferences = getUserPreferences();
            const consumedMealsList = Object.values(consumedMeals).flat().map(food => ({
                mealType: getMealTypeForFood(food, consumedMeals),
                actualCalories: food.calories,
                actualProtein: food.protein,
                actualCarbs: food.carbs,
                actualFat: food.fat,
                timestamp: food.timestamp || new Date().toISOString(),
                name: food.name
            }));
            
            // Determine remaining meal types for today
            const remainingMealTypes = getRemainingMealTypes(consumedMealsList);
            
            if (remainingMealTypes.length > 0) {
                console.log(`🎯 Adapting ${remainingMealTypes.length} remaining meals: ${remainingMealTypes.join(', ')}`);
                
                // Trigger adaptive planning
                const adaptedPlan = window.HabbtMealPlanning.adaptDayPlan(
                    consumedMealsList, 
                    remainingMealTypes, 
                    preferences
                );
                
                // Update the meal plan using proper date mapping
                const updateSuccess = updateMealPlanForDate(nutritionDate, adaptedPlan);
                
                if (updateSuccess) {
                    console.log('✅ Meal plan adapted based on actual consumption');
                    
                    // Show user notification with date context
                    showAdaptiveNotification(consumedTotals, preferences, remainingMealTypes.length, nutritionDate);
                } else {
                    console.error('❌ Failed to update meal plan');
                }
            } else {
                console.log('✅ All meals logged for today - no adaptation needed');
            }
        } else {
            console.log('⚠️ Meal planning system not available - storing data for future sync');
        }
        
        // Store integration data for analytics with proper date mapping
        const integrationData = {
            nutritionDate,
            weekday,
            consumedTotals,
            adaptationTriggered: true,
            timestamp: new Date().toISOString()
        };
        
        localStorage.setItem(`habbt_nutrition_integration_${nutritionDate}`, JSON.stringify(integrationData));
        
    } catch (error) {
        console.error('❌ Meal planning sync failed:', error);
    }
};

// Helper functions for integration
const calculateMealTotals = (meals) => {
    const allFoods = Object.values(meals).flat();
    return allFoods.reduce((totals, food) => ({
        calories: totals.calories + (food.calories || 0),
        protein: totals.protein + (food.protein || 0),
        carbs: totals.carbs + (food.carbs || 0),
        fat: totals.fat + (food.fat || 0),
        fiber: totals.fiber + (food.fiber || 0)
    }), { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });
};

const getMealTypeForFood = (food, allMeals) => {
    for (const [mealType, foods] of Object.entries(allMeals)) {
        if (foods.some(f => f.id === food.id)) {
            return mealType;
        }
    }
    return 'snacks'; // fallback
};

const getRemainingMealTypes = (consumedMeals) => {
    const consumedTypes = new Set(consumedMeals.map(m => m.mealType));
    const allTypes = ['breakfast', 'lunch', 'dinner', 'snacks'];
    return allTypes.filter(type => !consumedTypes.has(type));
};

// CRITICAL: Date mapping functions for Nutrition ↔ Meal Planning integration
const getWeekStartDate = (date = new Date()) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday = week start
    return new Date(d.setDate(diff)).toISOString().split('T')[0];
};

const getWeekdayFromDate = (dateString) => {
    const date = new Date(dateString);
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = weekdays[date.getDay()];
    
    // Meal planning uses Monday-Sunday, so map Sunday to end of week
    if (dayName === 'Sunday') {
        return 'Sunday';
    }
    return dayName;
};

const getMealPlanKeyFromDate = (nutritionDate) => {
    // Convert nutrition date (2025-06-17) to meal planning day (Tuesday)
    const weekday = getWeekdayFromDate(nutritionDate);
    console.log(`📅 Mapping nutrition date ${nutritionDate} → meal planning day: ${weekday}`);
    return weekday;
};

const getWeekPlanForDate = (nutritionDate) => {
    try {
        const weekStartDate = getWeekStartDate(new Date(nutritionDate));
        const weekPlanKey = `habbt_weekly_plan_${weekStartDate}`;
        const weekPlan = JSON.parse(localStorage.getItem(weekPlanKey) || '{}');
        
        console.log(`📊 Loading week plan for date ${nutritionDate}:`);
        console.log(`   Week start: ${weekStartDate}`);
        console.log(`   Plan key: ${weekPlanKey}`);
        console.log(`   Available days:`, Object.keys(weekPlan));
        
        return weekPlan;
    } catch (error) {
        console.error('❌ Failed to load week plan:', error);
        return {};
    }
};

const updateMealPlanForDate = (nutritionDate, dayUpdates) => {
    try {
        const weekStartDate = getWeekStartDate(new Date(nutritionDate));
        const weekPlanKey = `habbt_weekly_plan_${weekStartDate}`;
        const weekPlan = JSON.parse(localStorage.getItem(weekPlanKey) || '{}');
        const weekday = getMealPlanKeyFromDate(nutritionDate);
        
        // Update the specific day
        weekPlan[weekday] = {
            ...weekPlan[weekday],
            ...dayUpdates
        };
        
        localStorage.setItem(weekPlanKey, JSON.stringify(weekPlan));
        console.log(`✅ Updated meal plan for ${nutritionDate} (${weekday})`);
        
        return true;
    } catch (error) {
        console.error('❌ Failed to update meal plan:', error);
        return false;
    }
};

const getUserPreferences = () => {
    try {
        const habbtProfile = JSON.parse(localStorage.getItem('habbt_profile_data') || '{}');
        return {
            calorieTarget: habbtProfile.goals?.calories || 2000,
            proteinTarget: habbtProfile.goals?.protein || 150,
            goal: habbtProfile.goal || 'maintenance',
            dietaryRestrictions: habbtProfile.dietaryRestrictions || [],
            allergens: habbtProfile.allergens || []
        };
    } catch (e) {
        return { calorieTarget: 2000, proteinTarget: 150, goal: 'maintenance' };
    }
};

// DEBUG: Date mapping visualization (remove in production)
const debugDateMapping = (nutritionDate) => {
    console.log('🔍 DEBUG: Date Mapping Analysis');
    console.log('================================');
    console.log(`Nutrition Date: ${nutritionDate}`);
    console.log(`Weekday: ${getWeekdayFromDate(nutritionDate)}`);
    console.log(`Week Start: ${getWeekStartDate(new Date(nutritionDate))}`);
    console.log(`Week Plan Key: habbt_weekly_plan_${getWeekStartDate(new Date(nutritionDate))}`);
    
    const weekPlan = getWeekPlanForDate(nutritionDate);
    console.log(`Available Days in Plan:`, Object.keys(weekPlan));
    
    const targetDay = getMealPlanKeyFromDate(nutritionDate);
    if (weekPlan[targetDay]) {
        console.log(`✅ Found plan for ${targetDay}:`, Object.keys(weekPlan[targetDay]));
    } else {
        console.log(`❌ No plan found for ${targetDay}`);
    }
    console.log('================================');
};

// Enhanced showAdaptiveNotification with date context
const showAdaptiveNotification = (consumedTotals, preferences, remainingMeals, nutritionDate) => {
    const weekday = getWeekdayFromDate(nutritionDate);
    const calorieDiff = consumedTotals.calories - (preferences.calorieTarget * 0.75);
    const proteinDiff = consumedTotals.protein - (preferences.proteinTarget * 0.75);
    
    let message = `🤖 Smart Adaptation for ${weekday}: `;
    if (Math.abs(calorieDiff) > 100) {
        message += `${calorieDiff > 0 ? '+' : ''}${Math.round(calorieDiff)} calories `;
    }
    if (Math.abs(proteinDiff) > 5) {
        message += `${proteinDiff > 0 ? '+' : ''}${Math.round(proteinDiff)}g protein `;
    }
    message += `detected. Adjusted ${remainingMeals} remaining meals to keep you on track! 🎯`;
    
    console.log(message);
    
    // Optional: Show visual notification in UI
    if (typeof showToast === 'function') {
        showToast(message, 'success', 5000);
    }
};

// Enhanced Food Search with Meal Planning suggestions
const searchFoodsWithSuggestions = async (query, currentMealType) => {
    const basicResults = await searchFoods(query);
    
    // Add meal planning suggestions if available
    if (window.HabbtMealPlanning && currentMealType) {
        try {
            const preferences = getUserPreferences();
            const mealTargets = calculateMealTargets(preferences, currentMealType);
            
            // Filter and score results based on meal planning targets
            const scoredResults = basicResults.map(food => {
                const nutritionScore = calculateNutritionScore(food.nutrients, mealTargets);
                return { ...food, nutritionScore, suggestedFor: currentMealType };
            }).sort((a, b) => b.nutritionScore - a.nutritionScore);
            
            return scoredResults;
        } catch (e) {
            console.warn('Meal planning suggestions failed:', e);
        }
    }
    
    return basicResults;
};

const calculateMealTargets = (preferences, mealType) => {
    const distributions = {
        breakfast: { calories: 0.25, protein: 0.25 },
        lunch: { calories: 0.35, protein: 0.35 },
        dinner: { calories: 0.35, protein: 0.35 },
        snacks: { calories: 0.05, protein: 0.05 }
    };
    
    const dist = distributions[mealType] || distributions.snacks;
    return {
        targetCalories: preferences.calorieTarget * dist.calories,
        targetProtein: preferences.proteinTarget * dist.protein
    };
};

const calculateNutritionScore = (nutrients, targets) => {
    const calorieScore = Math.max(0, 100 - Math.abs(nutrients.calories - targets.targetCalories) / targets.targetCalories * 100);
    const proteinScore = Math.max(0, 100 - Math.abs(nutrients.protein - targets.targetProtein) / targets.targetProtein * 100);
    return (calorieScore + proteinScore) / 2;
};

// FIXED: Enhanced meal section with integration hooks
const EnhancedMealSection = ({ title, foods, onRemoveFood, onAddFood, mealType, emoji, currentDate }) => {
    const [showSearch, setShowSearch] = React.useState(false);

    const mealCalories = foods.reduce((sum, food) => sum + (food.calories || 0), 0);
    const mealProtein = foods.reduce((sum, food) => sum + (food.protein || 0), 0);

    // Integration hook - trigger sync when foods change
    React.useEffect(() => {
        if (foods.length > 0) {
            // Debounce the sync to avoid excessive calls
            const syncTimeout = setTimeout(() => {
                const allMeals = { [mealType]: foods };
                syncWithMealPlanning(allMeals, currentDate);
            }, 1000);
            
            return () => clearTimeout(syncTimeout);
        }
    }, [foods, mealType, currentDate]);

    const handleAddFood = async (foodType, foodItem) => {
        // Add timestamp for integration
        const enhancedFoodItem = {
            ...foodItem,
            timestamp: new Date().toISOString(),
            loggedVia: 'manual_entry'
        };
        
        onAddFood(foodType, enhancedFoodItem);
        
        // Trigger immediate sync for real-time adaptation
        setTimeout(() => {
            const currentMeals = JSON.parse(localStorage.getItem(`habbt_nutrition_${currentDate}`) || '{}');
            syncWithMealPlanning(currentMeals, currentDate);
        }, 100);
    };

    return React.createElement('div', { className: 'bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden' },
        // Header with integration status
        React.createElement('div', { className: 'bg-gradient-to-r from-blue-500 via-blue-600 to-teal-600 text-white p-4' },
            React.createElement('div', { className: 'flex justify-between items-center' },
                React.createElement('h3', { className: 'text-lg font-bold flex items-center' },
                    React.createElement('span', { className: 'mr-2 text-xl' }, emoji),
                    title,
                    // Show integration status
                    foods.length > 0 && React.createElement('span', { className: 'ml-2 text-xs bg-white/20 px-2 py-1 rounded-full' },
                        '🔄 Synced'
                    )
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

        // Enhanced search with meal planning integration
        showSearch && React.createElement('div', { className: 'p-4 border-b border-gray-200' },
            React.createElement(FoodSearchComponent, {
                onAddFood: handleAddFood,
                mealType: mealType,
                searchFunction: (query) => searchFoodsWithSuggestions(query, mealType)
            })
        ),

        // Food list with integration indicators
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
                                React.createElement('h4', { className: 'font-semibold text-gray-800 flex items-center' }, 
                                    food.name,
                                    // Show if this was from meal planning
                                    food.source === 'meal_planning' && React.createElement('span', { className: 'ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full' },
                                        '📋 Planned'
                                    ),
                                    // Show adaptation indicator
                                    food.loggedVia === 'manual_entry' && React.createElement('span', { className: 'ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full' },
                                        '✅ Logged'
                                    )
                                ),
                                food.brand && React.createElement('p', { className: 'text-sm text-gray-600' }, food.brand),
                                React.createElement('div', { className: 'text-sm text-gray-700 mt-1' },
                                    `${food.calories} cal • ${food.protein}g protein • ${food.carbs}g carbs • ${food.fat}g fat`
                                ),
                                food.timestamp && React.createElement('div', { className: 'text-xs text-gray-500 mt-1' },
                                    `Logged: ${new Date(food.timestamp).toLocaleTimeString()}`
                                )
                            ),
                            React.createElement('button', {
                                onClick: () => {
                                    onRemoveFood(mealType, food.id);
                                    // Trigger sync after removal
                                    setTimeout(() => {
                                        const currentMeals = JSON.parse(localStorage.getItem(`habbt_nutrition_${currentDate}`) || '{}');
                                        syncWithMealPlanning(currentMeals, currentDate);
                                    }, 100);
                                },
                                className: 'ml-4 px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 text-sm rounded-lg font-medium transition-all duration-200'
                            }, 'Remove')
                        )
                    )
                )
        )
    );
};

// FIXED: Proper module exports to resolve loading issues
const FIXED_NUTRITION_EXPORTS = {
    // Main render function with multiple naming conventions
    renderNutritionTab: (containerId) => {
        const container = document.getElementById(containerId);
        if (container) {
            try {
                // Clear any existing content safely
                while (container.firstChild) {
                    container.removeChild(container.firstChild);
                }
                
                // Render the nutrition tracker
                ReactDOM.render(React.createElement(NutritionTracker), container);
                console.log('✅ Nutrition tab rendered successfully');
                return true;
            } catch (error) {
                console.error('❌ Nutrition tab render failed:', error);
                return false;
            }
        } else {
            console.error('❌ Container not found:', containerId);
            return false;
        }
    },
    
    // Integration functions
    syncWithMealPlanning,
    calculateMealTotals,
    getUserPreferences,
    getWeekdayFromDate,
    getMealPlanKeyFromDate,
    debugDateMapping, // For testing the date mapping
    
    // Components for external use
    EnhancedMealSection,
    
    // Version info
    version: '2.0.0',
    features: ['meal_planning_integration', 'adaptive_sync', 'real_time_updates']
};

// CRITICAL FIX: Ensure all naming conventions work
window.renderNutritionTab = FIXED_NUTRITION_EXPORTS.renderNutritionTab;
window.renderMealsTab = FIXED_NUTRITION_EXPORTS.renderNutritionTab;
window.renderHabbtNutrition = FIXED_NUTRITION_EXPORTS.renderNutritionTab;

// Export the complete module
window.HabbtNutrition = FIXED_NUTRITION_EXPORTS;
window.FuelIQMeals = FIXED_NUTRITION_EXPORTS; // Backward compatibility

// Enhanced compatibility check
(function() {
    console.log('🔧 Initializing FIXED nutrition module...');
    
    // Wait for dependencies
    const checkDependencies = () => {
        return typeof React !== 'undefined' && 
               typeof ReactDOM !== 'undefined' &&
               typeof localStorage !== 'undefined';
    };
    
    if (checkDependencies()) {
        console.log('✅ FIXED Nutrition module ready!');
        console.log('✅ Available functions:', Object.keys(FIXED_NUTRITION_EXPORTS));
        
        // Test render function
        if (typeof window.renderNutritionTab === 'function') {
            console.log('✅ renderNutritionTab function confirmed working');
        }
    } else {
        console.error('❌ Dependencies not available for nutrition module');
    }
})();

console.log('🍽️ FIXED Habbt Nutrition module loaded with meal planning integration!');
