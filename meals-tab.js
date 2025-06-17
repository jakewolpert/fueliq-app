// Fixed Nutrition Tab - React DOM Mounting Issue Resolved
// This prevents the "removeChild" errors and ensures proper loading

(function() {
    'use strict';

    // Store React root references to prevent conflicts
    let currentNutritionRoot = null;
    let currentMealPlanningRoot = null;

    // Enhanced container management with proper cleanup
    const safelyRenderToContainer = (containerId, component, componentName) => {
        console.log(`🔧 Safely rendering ${componentName} to ${containerId}`);
        
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`❌ Container ${containerId} not found`);
            return false;
        }

        try {
            // Clear any existing content safely
            if (containerId === 'nutrition-container' && currentNutritionRoot) {
                console.log('🧹 Cleaning up existing nutrition root');
                try {
                    currentNutritionRoot.unmount();
                } catch (e) {
                    console.warn('⚠️ Root unmount warning:', e);
                }
                currentNutritionRoot = null;
            }

            if (containerId === 'meal-planning-container' && currentMealPlanningRoot) {
                console.log('🧹 Cleaning up existing meal planning root');
                try {
                    currentMealPlanningRoot.unmount();
                } catch (e) {
                    console.warn('⚠️ Root unmount warning:', e);
                }
                currentMealPlanningRoot = null;
            }

            // Clear container innerHTML as backup
            container.innerHTML = '';

            // Small delay to ensure DOM is ready
            setTimeout(() => {
                try {
                    if (typeof ReactDOM.createRoot !== 'undefined') {
                        // React 18+ createRoot
                        const root = ReactDOM.createRoot(container);
                        root.render(component);
                        
                        if (containerId === 'nutrition-container') {
                            currentNutritionRoot = root;
                        } else if (containerId === 'meal-planning-container') {
                            currentMealPlanningRoot = root;
                        }
                    } else {
                        // React 17 render
                        ReactDOM.render(component, container);
                    }
                    
                    console.log(`✅ ${componentName} rendered successfully`);
                    return true;
                } catch (renderError) {
                    console.error(`❌ ${componentName} render error:`, renderError);
                    
                    // Fallback: create fresh container
                    container.innerHTML = `
                        <div class="p-8 text-center">
                            <div class="text-6xl mb-4">🔧</div>
                            <h3 class="text-xl font-bold text-gray-800 mb-2">Loading ${componentName}...</h3>
                            <p class="text-gray-600">Initializing components...</p>
                            <button onclick="location.reload()" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg">
                                Refresh if needed
                            </button>
                        </div>
                    `;
                    return false;
                }
            }, 100);

        } catch (error) {
            console.error(`❌ Fatal error rendering ${componentName}:`, error);
            container.innerHTML = `
                <div class="p-8 text-center">
                    <div class="text-6xl mb-4">❌</div>
                    <h3 class="text-xl font-bold text-red-600 mb-2">Error Loading ${componentName}</h3>
                    <p class="text-gray-600 mb-4">There was a technical issue. Please refresh the page.</p>
                    <button onclick="location.reload()" class="px-4 py-2 bg-red-500 text-white rounded-lg">
                        Refresh Page
                    </button>
                </div>
            `;
            return false;
        }
    };

    // Enhanced nutrition tracking with proper React mounting
    const FixedNutritionTracker = () => {
        const [currentDate, setCurrentDate] = React.useState(new Date().toISOString().split('T')[0]);
        const [nutritionData, setNutritionData] = React.useState({
            meals: [],
            totalCalories: 0,
            totalProtein: 0,
            totalCarbs: 0,
            totalFat: 0,
            totalFiber: 0
        });
        const [userGoals, setUserGoals] = React.useState({
            calories: 2000,
            protein: 150,
            carbs: 250,
            fat: 67,
            fiber: 25
        });
        const [isLoading, setIsLoading] = React.useState(true);

        // Load user goals safely
        React.useEffect(() => {
            try {
                console.log('📊 Loading nutrition goals...');
                
                // Check for unified data manager
                if (typeof window.UnifiedDataManager !== 'undefined') {
                    const goals = window.UnifiedDataManager.getGoals();
                    if (goals && Object.keys(goals).length > 0) {
                        setUserGoals(goals);
                        console.log('✅ Goals loaded from UnifiedDataManager:', goals);
                    }
                } else {
                    // Fallback to localStorage
                    const habbtProfile = localStorage.getItem('habbt_profile_data');
                    const fueliqProfile = localStorage.getItem('fueliq_profile_data');
                    
                    if (habbtProfile || fueliqProfile) {
                        const profile = JSON.parse(habbtProfile || fueliqProfile);
                        if (profile.goals) {
                            setUserGoals(profile.goals);
                            console.log('✅ Goals loaded from localStorage:', profile.goals);
                        }
                    }
                }
                
                setIsLoading(false);
            } catch (error) {
                console.error('❌ Error loading goals:', error);
                setIsLoading(false);
            }
        }, []);

        // Load nutrition data for current date
        React.useEffect(() => {
            try {
                const storageKey = `nutrition_${currentDate}`;
                const stored = localStorage.getItem(storageKey);
                if (stored) {
                    const data = JSON.parse(stored);
                    setNutritionData(data);
                    console.log(`📊 Nutrition data loaded for ${currentDate}:`, data);
                }
            } catch (error) {
                console.error('❌ Error loading nutrition data:', error);
            }
        }, [currentDate]);

        const addMeal = (meal) => {
            const newMeal = {
                id: Date.now(),
                ...meal,
                timestamp: new Date().toISOString()
            };

            const updatedData = {
                ...nutritionData,
                meals: [...nutritionData.meals, newMeal],
                totalCalories: nutritionData.totalCalories + (meal.calories || 0),
                totalProtein: nutritionData.totalProtein + (meal.protein || 0),
                totalCarbs: nutritionData.totalCarbs + (meal.carbs || 0),
                totalFat: nutritionData.totalFat + (meal.fat || 0),
                totalFiber: nutritionData.totalFiber + (meal.fiber || 0)
            };

            setNutritionData(updatedData);
            
            // Save to localStorage
            const storageKey = `nutrition_${currentDate}`;
            localStorage.setItem(storageKey, JSON.stringify(updatedData));
            
            console.log('✅ Meal added:', newMeal);
        };

        const removeMeal = (mealId) => {
            const mealToRemove = nutritionData.meals.find(m => m.id === mealId);
            if (!mealToRemove) return;

            const updatedData = {
                ...nutritionData,
                meals: nutritionData.meals.filter(m => m.id !== mealId),
                totalCalories: nutritionData.totalCalories - (mealToRemove.calories || 0),
                totalProtein: nutritionData.totalProtein - (mealToRemove.protein || 0),
                totalCarbs: nutritionData.totalCarbs - (mealToRemove.carbs || 0),
                totalFat: nutritionData.totalFat - (mealToRemove.fat || 0),
                totalFiber: nutritionData.totalFiber - (mealToRemove.fiber || 0)
            };

            setNutritionData(updatedData);
            
            const storageKey = `nutrition_${currentDate}`;
            localStorage.setItem(storageKey, JSON.stringify(updatedData));
            
            console.log('🗑️ Meal removed:', mealToRemove);
        };

        if (isLoading) {
            return React.createElement('div', { className: 'flex items-center justify-center p-12' },
                React.createElement('div', { className: 'text-center' },
                    React.createElement('div', { className: 'text-4xl mb-4' }, '🔄'),
                    React.createElement('p', { className: 'text-gray-600' }, 'Loading nutrition tracker...')
                )
            );
        }

        return React.createElement('div', { className: 'min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-cyan-50' },
            React.createElement('div', { className: 'max-w-7xl mx-auto p-6' },
                // Header
                React.createElement('div', { className: 'bg-gradient-to-r from-blue-600 to-teal-600 rounded-3xl shadow-2xl p-8 mb-8 text-white' },
                    React.createElement('div', { className: 'text-center' },
                        React.createElement('h1', { className: 'text-4xl font-bold mb-4' }, 
                            '🍽️ Nutrition Tracking'
                        ),
                        React.createElement('div', { className: 'bg-white/20 backdrop-blur-sm rounded-2xl p-4' },
                            React.createElement('p', { className: 'text-lg mb-3' }, 
                                'Track your daily nutrition goals'
                            ),
                            React.createElement('input', {
                                type: 'date',
                                value: currentDate,
                                onChange: (e) => setCurrentDate(e.target.value),
                                className: 'px-4 py-2 rounded-lg text-gray-800 bg-white/90'
                            })
                        )
                    )
                ),

                // Progress Cards
                React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-5 gap-6 mb-8' },
                    [
                        { label: 'Calories', current: nutritionData.totalCalories, goal: userGoals.calories, color: 'blue', unit: '' },
                        { label: 'Protein', current: nutritionData.totalProtein, goal: userGoals.protein, color: 'red', unit: 'g' },
                        { label: 'Carbs', current: nutritionData.totalCarbs, goal: userGoals.carbs, color: 'yellow', unit: 'g' },
                        { label: 'Fat', current: nutritionData.totalFat, goal: userGoals.fat, color: 'purple', unit: 'g' },
                        { label: 'Fiber', current: nutritionData.totalFiber, goal: userGoals.fiber, color: 'green', unit: 'g' }
                    ].map(item => {
                        const percentage = Math.round((item.current / item.goal) * 100);
                        const isOnTrack = percentage >= 90 && percentage <= 110;
                        
                        return React.createElement('div', { 
                            key: item.label,
                            className: 'bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20'
                        },
                            React.createElement('h3', { className: 'text-lg font-bold text-gray-800 mb-2' }, item.label),
                            React.createElement('div', { className: `text-3xl font-bold text-${item.color}-600 mb-2` }, 
                                `${Math.round(item.current)}${item.unit}`
                            ),
                            React.createElement('div', { className: 'text-sm text-gray-600 mb-3' }, 
                                `Goal: ${item.goal}${item.unit}`
                            ),
                            React.createElement('div', { className: 'w-full bg-gray-200 rounded-full h-2' },
                                React.createElement('div', { 
                                    className: `h-2 rounded-full ${isOnTrack ? 'bg-green-500' : percentage > 110 ? 'bg-red-500' : `bg-${item.color}-500`}`,
                                    style: { width: `${Math.min(percentage, 100)}%` }
                                })
                            ),
                            React.createElement('div', { className: `text-xs mt-1 font-semibold ${isOnTrack ? 'text-green-600' : 'text-gray-600'}` }, 
                                `${percentage}%`
                            )
                        );
                    })
                ),

                // Meals List
                React.createElement('div', { className: 'bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20 mb-8' },
                    React.createElement('h2', { className: 'text-2xl font-bold text-gray-800 mb-6' }, 
                        `🍽️ Meals for ${new Date(currentDate).toLocaleDateString()}`
                    ),
                    nutritionData.meals.length === 0 ? 
                        React.createElement('div', { className: 'text-center py-12' },
                            React.createElement('div', { className: 'text-6xl mb-4' }, '🍽️'),
                            React.createElement('p', { className: 'text-gray-600' }, 'No meals logged yet today')
                        ) :
                        React.createElement('div', { className: 'space-y-4' },
                            nutritionData.meals.map(meal => 
                                React.createElement('div', { 
                                    key: meal.id,
                                    className: 'bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl p-4 border border-blue-200'
                                },
                                    React.createElement('div', { className: 'flex justify-between items-start' },
                                        React.createElement('div', { className: 'flex-1' },
                                            React.createElement('h3', { className: 'font-bold text-gray-800 mb-1' }, meal.name || 'Unnamed Meal'),
                                            React.createElement('p', { className: 'text-sm text-gray-600 mb-2' }, 
                                                new Date(meal.timestamp).toLocaleTimeString()
                                            ),
                                            React.createElement('div', { className: 'grid grid-cols-5 gap-4 text-sm' },
                                                React.createElement('div', null,
                                                    React.createElement('span', { className: 'font-semibold text-blue-600' }, meal.calories || 0),
                                                    React.createElement('div', { className: 'text-xs text-gray-500' }, 'cal')
                                                ),
                                                React.createElement('div', null,
                                                    React.createElement('span', { className: 'font-semibold text-red-600' }, `${meal.protein || 0}g`),
                                                    React.createElement('div', { className: 'text-xs text-gray-500' }, 'protein')
                                                ),
                                                React.createElement('div', null,
                                                    React.createElement('span', { className: 'font-semibold text-yellow-600' }, `${meal.carbs || 0}g`),
                                                    React.createElement('div', { className: 'text-xs text-gray-500' }, 'carbs')
                                                ),
                                                React.createElement('div', null,
                                                    React.createElement('span', { className: 'font-semibold text-purple-600' }, `${meal.fat || 0}g`),
                                                    React.createElement('div', { className: 'text-xs text-gray-500' }, 'fat')
                                                ),
                                                React.createElement('div', null,
                                                    React.createElement('span', { className: 'font-semibold text-green-600' }, `${meal.fiber || 0}g`),
                                                    React.createElement('div', { className: 'text-xs text-gray-500' }, 'fiber')
                                                )
                                            )
                                        ),
                                        React.createElement('button', {
                                            onClick: () => removeMeal(meal.id),
                                            className: 'ml-4 px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-semibold transition-all duration-200'
                                        }, '🗑️ Remove')
                                    )
                                )
                            )
                        )
                ),

                // Quick Add Section
                React.createElement('div', { className: 'bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20' },
                    React.createElement('h2', { className: 'text-2xl font-bold text-gray-800 mb-6' }, '➕ Quick Add Meal'),
                    React.createElement(QuickAddMealForm, { onAddMeal: addMeal })
                )
            )
        );
    };

    // Quick Add Meal Form Component
    const QuickAddMealForm = ({ onAddMeal }) => {
        const [mealData, setMealData] = React.useState({
            name: '',
            calories: '',
            protein: '',
            carbs: '',
            fat: '',
            fiber: ''
        });

        const handleSubmit = (e) => {
            e.preventDefault();
            
            if (!mealData.name.trim()) {
                alert('Please enter a meal name');
                return;
            }

            const meal = {
                name: mealData.name.trim(),
                calories: parseFloat(mealData.calories) || 0,
                protein: parseFloat(mealData.protein) || 0,
                carbs: parseFloat(mealData.carbs) || 0,
                fat: parseFloat(mealData.fat) || 0,
                fiber: parseFloat(mealData.fiber) || 0
            };

            onAddMeal(meal);
            
            // Reset form
            setMealData({
                name: '',
                calories: '',
                protein: '',
                carbs: '',
                fat: '',
                fiber: ''
            });
        };

        const updateField = (field, value) => {
            setMealData(prev => ({ ...prev, [field]: value }));
        };

        return React.createElement('form', { onSubmit: handleSubmit, className: 'space-y-4' },
            React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-4' },
                React.createElement('div', null,
                    React.createElement('label', { className: 'block text-sm font-semibold text-gray-700 mb-2' }, 'Meal Name'),
                    React.createElement('input', {
                        type: 'text',
                        value: mealData.name,
                        onChange: (e) => updateField('name', e.target.value),
                        className: 'w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                        placeholder: 'e.g., Chicken Caesar Salad'
                    })
                ),
                React.createElement('div', null,
                    React.createElement('label', { className: 'block text-sm font-semibold text-gray-700 mb-2' }, 'Calories'),
                    React.createElement('input', {
                        type: 'number',
                        value: mealData.calories,
                        onChange: (e) => updateField('calories', e.target.value),
                        className: 'w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                        placeholder: '350'
                    })
                )
            ),
            
            React.createElement('div', { className: 'grid grid-cols-2 md:grid-cols-4 gap-4' },
                ['protein', 'carbs', 'fat', 'fiber'].map(nutrient => 
                    React.createElement('div', { key: nutrient },
                        React.createElement('label', { className: 'block text-sm font-semibold text-gray-700 mb-2' }, 
                            nutrient.charAt(0).toUpperCase() + nutrient.slice(1) + ' (g)'
                        ),
                        React.createElement('input', {
                            type: 'number',
                            step: '0.1',
                            value: mealData[nutrient],
                            onChange: (e) => updateField(nutrient, e.target.value),
                            className: 'w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                            placeholder: '0'
                        })
                    )
                )
            ),
            
            React.createElement('button', {
                type: 'submit',
                className: 'w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-teal-600 hover:from-blue-600 hover:to-teal-700 text-white rounded-lg font-bold text-lg transform hover:scale-105 transition-all duration-200'
            }, '✅ Add Meal')
        );
    };

    // Render function with enhanced error handling
    const renderNutritionTab = (containerId = 'nutrition-container') => {
        console.log('🔧 Attempting to render nutrition tab...');
        
        try {
            const component = React.createElement(FixedNutritionTracker);
            return safelyRenderToContainer(containerId, component, 'Nutrition Tracker');
        } catch (error) {
            console.error('❌ Critical error in renderNutritionTab:', error);
            
            const container = document.getElementById(containerId);
            if (container) {
                container.innerHTML = `
                    <div class="p-8 text-center">
                        <div class="text-6xl mb-4">❌</div>
                        <h3 class="text-xl font-bold text-red-600 mb-2">Critical Error</h3>
                        <p class="text-gray-600 mb-4">Unable to load nutrition tracker. Please refresh the page.</p>
                        <button onclick="location.reload()" class="px-4 py-2 bg-red-500 text-white rounded-lg">
                            Refresh Page
                        </button>
                    </div>
                `;
            }
            return false;
        }
    };

    // Enhanced meal planning render with dates
    const renderMealPlanningWithDates = (containerId = 'meal-planning-container') => {
        console.log('🔧 Attempting to render meal planning with dates...');
        
        try {
            // Check if meal planning component exists
            if (typeof window.HabbtMealPlanning?.IntelligentMealPlanningApp === 'function') {
                const component = React.createElement(window.HabbtMealPlanning.IntelligentMealPlanningApp);
                return safelyRenderToContainer(containerId, component, 'Meal Planning');
            } else {
                console.warn('⚠️ Meal planning component not found, rendering placeholder');
                
                const container = document.getElementById(containerId);
                if (container) {
                    container.innerHTML = `
                        <div class="p-8 text-center">
                            <div class="text-6xl mb-4">🍽️</div>
                            <h3 class="text-xl font-bold text-gray-800 mb-2">Meal Planning Loading...</h3>
                            <p class="text-gray-600 mb-4">Please wait while we load the meal planning system.</p>
                            <div class="animate-pulse bg-gray-200 h-4 rounded w-3/4 mx-auto"></div>
                        </div>
                    `;
                }
                return false;
            }
        } catch (error) {
            console.error('❌ Error rendering meal planning:', error);
            return false;
        }
    };

    // Global exports with safe rendering
    window.HabbtNutrition = {
        FixedNutritionTracker,
        renderNutritionTab,
        renderMealPlanningWithDates,
        safelyRenderToContainer
    };

    // Backwards compatibility
    window.FuelIQNutrition = window.HabbtNutrition;
    window.renderNutritionTab = renderNutritionTab;
    window.renderMealPlanning = renderMealPlanningWithDates;

    console.log('✅ Fixed Nutrition Tab loaded - React DOM mounting issues resolved');
    console.log('✅ Available functions: renderNutritionTab, renderMealPlanningWithDates');

})();
