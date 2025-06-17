// Comprehensive Meals Tab Fix - Complete React DOM Solution
// This replaces the entire meals loading system to prevent React conflicts

(function() {
    'use strict';

    // Global React root management to prevent conflicts
    const globalRootManager = {
        roots: new Map(),
        
        clearRoot(containerId) {
            const existingRoot = this.roots.get(containerId);
            if (existingRoot) {
                try {
                    console.log(`🧹 Clearing existing React root for ${containerId}`);
                    if (typeof existingRoot.unmount === 'function') {
                        existingRoot.unmount();
                    } else if (typeof existingRoot.render === 'function') {
                        // React 17 style
                        ReactDOM.unmountComponentAtNode(document.getElementById(containerId));
                    }
                    this.roots.delete(containerId);
                } catch (e) {
                    console.warn(`⚠️ Warning clearing root for ${containerId}:`, e);
                }
            }
        },

        createRoot(containerId, component) {
            // Always clear first
            this.clearRoot(containerId);
            
            const container = document.getElementById(containerId);
            if (!container) {
                console.error(`❌ Container ${containerId} not found`);
                return null;
            }

            // Clear innerHTML completely
            container.innerHTML = '';

            try {
                if (typeof ReactDOM.createRoot !== 'undefined') {
                    // React 18+
                    const root = ReactDOM.createRoot(container);
                    root.render(component);
                    this.roots.set(containerId, root);
                    return root;
                } else {
                    // React 17
                    ReactDOM.render(component, container);
                    this.roots.set(containerId, { container });
                    return { container };
                }
            } catch (error) {
                console.error(`❌ Error creating React root for ${containerId}:`, error);
                this.showErrorUI(container, 'React Rendering Error');
                return null;
            }
        },

        showErrorUI(container, title = 'Loading Error') {
            container.innerHTML = `
                <div class="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
                    <div class="text-center p-8 bg-white rounded-2xl shadow-lg max-w-md">
                        <div class="text-6xl mb-4">⚠️</div>
                        <h2 class="text-2xl font-bold text-red-600 mb-4">${title}</h2>
                        <p class="text-gray-600 mb-6">There was a technical issue loading this component.</p>
                        <button onclick="location.reload()" class="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors">
                            🔄 Refresh Page
                        </button>
                    </div>
                </div>
            `;
        }
    };

    // Enhanced Nutrition Tracker with bullet-proof mounting
    const ComprehensiveNutritionTracker = () => {
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
        const [isAddingMeal, setIsAddingMeal] = React.useState(false);

        // Safe goal loading with multiple fallbacks
        React.useEffect(() => {
            const loadGoals = async () => {
                try {
                    console.log('📊 Loading nutrition goals...');
                    let goalsLoaded = false;

                    // Method 1: UnifiedDataManager
                    if (typeof window.UnifiedDataManager !== 'undefined') {
                        try {
                            const goals = window.UnifiedDataManager.getGoals();
                            if (goals && Object.keys(goals).length > 0) {
                                setUserGoals(goals);
                                console.log('✅ Goals loaded from UnifiedDataManager:', goals);
                                goalsLoaded = true;
                            }
                        } catch (e) {
                            console.warn('⚠️ UnifiedDataManager failed:', e);
                        }
                    }

                    // Method 2: localStorage fallback
                    if (!goalsLoaded) {
                        try {
                            const habbtProfile = localStorage.getItem('habbt_profile_data');
                            const fueliqProfile = localStorage.getItem('fueliq_profile_data');
                            const profileData = habbtProfile || fueliqProfile;
                            
                            if (profileData) {
                                const profile = JSON.parse(profileData);
                                if (profile.goals) {
                                    setUserGoals(profile.goals);
                                    console.log('✅ Goals loaded from localStorage:', profile.goals);
                                    goalsLoaded = true;
                                }
                            }
                        } catch (e) {
                            console.warn('⚠️ localStorage profile loading failed:', e);
                        }
                    }

                    // Method 3: Default goals with notification
                    if (!goalsLoaded) {
                        console.log('📊 Using default goals - please set your goals in the Profile tab');
                    }

                    setIsLoading(false);
                } catch (error) {
                    console.error('❌ Error in goal loading:', error);
                    setIsLoading(false);
                }
            };

            loadGoals();
        }, []);

        // Load nutrition data for current date
        React.useEffect(() => {
            try {
                const storageKey = `nutrition_${currentDate}`;
                const stored = localStorage.getItem(storageKey);
                if (stored) {
                    const data = JSON.parse(stored);
                    setNutritionData(data);
                    console.log(`📊 Nutrition data loaded for ${currentDate}`);
                } else {
                    // Reset to empty for new date
                    setNutritionData({
                        meals: [],
                        totalCalories: 0,
                        totalProtein: 0,
                        totalCarbs: 0,
                        totalFat: 0,
                        totalFiber: 0
                    });
                }
            } catch (error) {
                console.error('❌ Error loading nutrition data:', error);
            }
        }, [currentDate]);

        const addMeal = (meal) => {
            try {
                setIsAddingMeal(true);
                
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
                
                console.log('✅ Meal added successfully:', newMeal.name);
                setIsAddingMeal(false);
            } catch (error) {
                console.error('❌ Error adding meal:', error);
                setIsAddingMeal(false);
            }
        };

        const removeMeal = (mealId) => {
            try {
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
                
                console.log('🗑️ Meal removed successfully');
            } catch (error) {
                console.error('❌ Error removing meal:', error);
            }
        };

        if (isLoading) {
            return React.createElement('div', { className: 'min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-cyan-50 flex items-center justify-center' },
                React.createElement('div', { className: 'text-center' },
                    React.createElement('div', { className: 'text-6xl mb-4 animate-bounce' }, '🍽️'),
                    React.createElement('h3', { className: 'text-2xl font-bold text-gray-800 mb-2' }, 'Loading Nutrition Tracker'),
                    React.createElement('div', { className: 'flex justify-center' },
                        React.createElement('div', { className: 'animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600' })
                    )
                )
            );
        }

        return React.createElement('div', { className: 'min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-cyan-50' },
            React.createElement('div', { className: 'max-w-7xl mx-auto p-6' },
                // Header
                React.createElement('div', { className: 'bg-gradient-to-r from-blue-600 to-teal-600 rounded-3xl shadow-2xl p-8 mb-8 text-white' },
                    React.createElement('div', { className: 'text-center' },
                        React.createElement('h1', { className: 'text-4xl font-bold mb-4' }, 
                            '🍽️ Nutrition Tracking Dashboard'
                        ),
                        React.createElement('div', { className: 'bg-white/20 backdrop-blur-sm rounded-2xl p-4 mb-4' },
                            React.createElement('p', { className: 'text-lg mb-3' }, 
                                'Track your daily nutrition goals and build healthy habits'
                            ),
                            React.createElement('div', { className: 'flex justify-center items-center space-x-4' },
                                React.createElement('label', { className: 'text-white font-semibold' }, 'Date:'),
                                React.createElement('input', {
                                    type: 'date',
                                    value: currentDate,
                                    onChange: (e) => setCurrentDate(e.target.value),
                                    className: 'px-4 py-2 rounded-lg text-gray-800 bg-white/90 border-0 focus:ring-2 focus:ring-blue-300'
                                }),
                                currentDate === new Date().toISOString().split('T')[0] && 
                                    React.createElement('span', { className: 'bg-green-500/20 px-3 py-1 rounded-full text-sm font-semibold' }, '📅 Today')
                            )
                        ),
                        
                        // Quick Stats
                        React.createElement('div', { className: 'grid grid-cols-2 md:grid-cols-4 gap-4 text-center' },
                            [
                                { label: 'Calories', value: nutritionData.totalCalories, goal: userGoals.calories, color: 'blue' },
                                { label: 'Protein', value: `${Math.round(nutritionData.totalProtein)}g`, goal: `${userGoals.protein}g`, color: 'red' },
                                { label: 'Meals', value: nutritionData.meals.length, goal: '3-5', color: 'green' },
                                { label: 'Progress', value: `${Math.round((nutritionData.totalCalories / userGoals.calories) * 100)}%`, goal: '100%', color: 'purple' }
                            ].map((stat, index) => 
                                React.createElement('div', { 
                                    key: index,
                                    className: 'bg-white/20 backdrop-blur-sm rounded-xl p-3'
                                },
                                    React.createElement('div', { className: `text-2xl font-bold text-${stat.color}-200` }, stat.value),
                                    React.createElement('div', { className: 'text-sm opacity-75' }, stat.label),
                                    React.createElement('div', { className: 'text-xs opacity-60' }, `Goal: ${stat.goal}`)
                                )
                            )
                        )
                    )
                ),

                // Progress Cards - Detailed Macros
                React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-5 gap-6 mb-8' },
                    [
                        { label: 'Calories', current: nutritionData.totalCalories, goal: userGoals.calories, color: 'blue', icon: '🔥', unit: '' },
                        { label: 'Protein', current: nutritionData.totalProtein, goal: userGoals.protein, color: 'red', icon: '💪', unit: 'g' },
                        { label: 'Carbs', current: nutritionData.totalCarbs, goal: userGoals.carbs, color: 'yellow', icon: '🌾', unit: 'g' },
                        { label: 'Fat', current: nutritionData.totalFat, goal: userGoals.fat, color: 'purple', icon: '🥑', unit: 'g' },
                        { label: 'Fiber', current: nutritionData.totalFiber, goal: userGoals.fiber, color: 'green', icon: '🥬', unit: 'g' }
                    ].map(item => {
                        const percentage = Math.round((item.current / item.goal) * 100);
                        const isOnTrack = percentage >= 85 && percentage <= 115;
                        const isOver = percentage > 115;
                        
                        return React.createElement('div', { 
                            key: item.label,
                            className: `bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border-l-4 ${
                                isOnTrack ? 'border-green-500' : isOver ? 'border-red-500' : 'border-gray-300'
                            } hover:shadow-xl transition-shadow`
                        },
                            React.createElement('div', { className: 'flex items-center justify-between mb-3' },
                                React.createElement('h3', { className: 'text-lg font-bold text-gray-800' }, item.label),
                                React.createElement('span', { className: 'text-2xl' }, item.icon)
                            ),
                            React.createElement('div', { className: `text-3xl font-bold text-${item.color}-600 mb-2` }, 
                                `${Math.round(item.current)}${item.unit}`
                            ),
                            React.createElement('div', { className: 'text-sm text-gray-600 mb-3' }, 
                                `Goal: ${item.goal}${item.unit}`
                            ),
                            React.createElement('div', { className: 'w-full bg-gray-200 rounded-full h-3 mb-2' },
                                React.createElement('div', { 
                                    className: `h-3 rounded-full transition-all duration-500 ${
                                        isOnTrack ? 'bg-green-500' : isOver ? 'bg-red-500' : `bg-${item.color}-500`
                                    }`,
                                    style: { width: `${Math.min(percentage, 100)}%` }
                                })
                            ),
                            React.createElement('div', { className: `text-xs font-semibold ${
                                isOnTrack ? 'text-green-600' : isOver ? 'text-red-600' : 'text-gray-600'
                            }` }, 
                                `${percentage}% ${isOnTrack ? '✅' : isOver ? '⚠️ Over' : '⬆️'}`
                            )
                        );
                    })
                ),

                // Meals List
                React.createElement('div', { className: 'bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 mb-8' },
                    React.createElement('div', { className: 'bg-gradient-to-r from-gray-800 to-gray-700 text-white p-6 rounded-t-2xl' },
                        React.createElement('div', { className: 'flex justify-between items-center' },
                            React.createElement('h2', { className: 'text-2xl font-bold flex items-center' },
                                React.createElement('span', { className: 'mr-3 text-3xl' }, '🍽️'),
                                `Meals for ${new Date(currentDate + 'T00:00:00').toLocaleDateString('en-US', { 
                                    weekday: 'long', 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric' 
                                })}`
                            ),
                            React.createElement('div', { className: 'text-right' },
                                React.createElement('div', { className: 'text-lg font-semibold' }, 
                                    `${nutritionData.meals.length} meals logged`
                                ),
                                React.createElement('div', { className: 'text-sm opacity-75' }, 
                                    `${nutritionData.totalCalories} calories total`
                                )
                            )
                        )
                    ),
                    React.createElement('div', { className: 'p-6' },
                        nutritionData.meals.length === 0 ? 
                            React.createElement('div', { className: 'text-center py-12' },
                                React.createElement('div', { className: 'text-8xl mb-6 opacity-20' }, '🍽️'),
                                React.createElement('h3', { className: 'text-2xl font-bold text-gray-600 mb-2' }, 'No meals logged yet'),
                                React.createElement('p', { className: 'text-gray-500 mb-6' }, 
                                    currentDate === new Date().toISOString().split('T')[0] ? 
                                        'Start tracking your nutrition by adding your first meal below!' :
                                        'No meals were logged on this date.'
                                ),
                                React.createElement('div', { className: 'flex justify-center space-x-4' },
                                    React.createElement('button', {
                                        onClick: () => document.getElementById('quick-add-form').scrollIntoView({ behavior: 'smooth' }),
                                        className: 'px-6 py-3 bg-gradient-to-r from-blue-500 to-teal-600 hover:from-blue-600 hover:to-teal-700 text-white rounded-lg font-semibold transform hover:scale-105 transition-all'
                                    }, '➕ Add First Meal'),
                                    React.createElement('button', {
                                        onClick: () => setCurrentDate(new Date().toISOString().split('T')[0]),
                                        className: 'px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors'
                                    }, '📅 Go to Today')
                                )
                            ) :
                            React.createElement('div', { className: 'space-y-4' },
                                nutritionData.meals
                                    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                                    .map(meal => 
                                        React.createElement('div', { 
                                            key: meal.id,
                                            className: 'bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl p-6 border border-blue-200 hover:shadow-lg transition-shadow'
                                        },
                                            React.createElement('div', { className: 'flex justify-between items-start' },
                                                React.createElement('div', { className: 'flex-1' },
                                                    React.createElement('div', { className: 'flex items-center mb-3' },
                                                        React.createElement('h3', { className: 'text-xl font-bold text-gray-800 mr-3' }, 
                                                            meal.name || 'Unnamed Meal'
                                                        ),
                                                        React.createElement('span', { className: 'px-3 py-1 bg-blue-500 text-white text-sm rounded-full' },
                                                            new Date(meal.timestamp).toLocaleTimeString('en-US', { 
                                                                hour: 'numeric', 
                                                                minute: '2-digit',
                                                                hour12: true 
                                                            })
                                                        )
                                                    ),
                                                    React.createElement('div', { className: 'grid grid-cols-5 gap-4 text-center' },
                                                        [
                                                            { label: 'Calories', value: meal.calories || 0, color: 'blue', unit: '' },
                                                            { label: 'Protein', value: meal.protein || 0, color: 'red', unit: 'g' },
                                                            { label: 'Carbs', value: meal.carbs || 0, color: 'yellow', unit: 'g' },
                                                            { label: 'Fat', value: meal.fat || 0, color: 'purple', unit: 'g' },
                                                            { label: 'Fiber', value: meal.fiber || 0, color: 'green', unit: 'g' }
                                                        ].map(macro => 
                                                            React.createElement('div', { 
                                                                key: macro.label,
                                                                className: `bg-white rounded-lg p-3 border border-${macro.color}-200`
                                                            },
                                                                React.createElement('div', { className: `text-lg font-bold text-${macro.color}-600` }, 
                                                                    `${macro.value}${macro.unit}`
                                                                ),
                                                                React.createElement('div', { className: 'text-xs text-gray-500' }, macro.label)
                                                            )
                                                        )
                                                    )
                                                ),
                                                React.createElement('button', {
                                                    onClick: () => {
                                                        if (confirm(`Remove "${meal.name}" from your nutrition log?`)) {
                                                            removeMeal(meal.id);
                                                        }
                                                    },
                                                    className: 'ml-6 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-semibold transition-colors flex items-center'
                                                }, '🗑️ Remove')
                                            )
                                        )
                                    )
                            )
                    )
                ),

                // Quick Add Section
                React.createElement('div', { 
                    id: 'quick-add-form',
                    className: 'bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20'
                },
                    React.createElement('div', { className: 'bg-gradient-to-r from-green-600 to-blue-600 text-white p-6 rounded-t-2xl' },
                        React.createElement('h2', { className: 'text-2xl font-bold flex items-center' },
                            React.createElement('span', { className: 'mr-3 text-3xl' }, '➕'),
                            'Quick Add Meal'
                        ),
                        React.createElement('p', { className: 'text-green-100 mt-2' }, 
                            'Log your nutrition quickly and accurately'
                        )
                    ),
                    React.createElement('div', { className: 'p-6' },
                        React.createElement(QuickAddMealForm, { 
                            onAddMeal: addMeal,
                            isLoading: isAddingMeal 
                        })
                    )
                )
            )
        );
    };

    // Enhanced Quick Add Meal Form
    const QuickAddMealForm = ({ onAddMeal, isLoading }) => {
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
                alert('❌ Please enter a meal name');
                return;
            }

            if (!mealData.calories || parseFloat(mealData.calories) <= 0) {
                alert('❌ Please enter valid calories');
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

        const quickMealOptions = [
            { name: 'Chicken Breast (6oz)', calories: 350, protein: 65, carbs: 0, fat: 8, fiber: 0 },
            { name: 'Greek Yogurt Cup', calories: 150, protein: 15, carbs: 20, fat: 0, fiber: 0 },
            { name: 'Protein Shake', calories: 200, protein: 25, carbs: 5, fat: 3, fiber: 1 },
            { name: 'Oatmeal Bowl', calories: 300, protein: 10, carbs: 55, fat: 6, fiber: 8 }
        ];

        return React.createElement('div', null,
            // Quick Options
            React.createElement('div', { className: 'mb-6' },
                React.createElement('h3', { className: 'text-lg font-semibold text-gray-800 mb-3' }, '⚡ Quick Options'),
                React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3' },
                    quickMealOptions.map((option, index) => 
                        React.createElement('button', {
                            key: index,
                            onClick: () => setMealData(option),
                            className: 'p-3 bg-gradient-to-r from-blue-100 to-teal-100 hover:from-blue-200 hover:to-teal-200 rounded-lg text-left transition-colors border border-blue-200'
                        },
                            React.createElement('div', { className: 'font-semibold text-gray-800 text-sm mb-1' }, option.name),
                            React.createElement('div', { className: 'text-xs text-gray-600' }, 
                                `${option.calories} cal • ${option.protein}g protein`
                            )
                        )
                    )
                )
            ),

            React.createElement('form', { onSubmit: handleSubmit, className: 'space-y-6' },
                // Meal Name
                React.createElement('div', null,
                    React.createElement('label', { className: 'block text-sm font-semibold text-gray-700 mb-2' }, 
                        '🍽️ Meal Name *'
                    ),
                    React.createElement('input', {
                        type: 'text',
                        value: mealData.name,
                        onChange: (e) => updateField('name', e.target.value),
                        className: 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg',
                        placeholder: 'e.g., Grilled Chicken Caesar Salad',
                        required: true
                    })
                ),
                
                // Macronutrients Grid
                React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-3 gap-6' },
                    React.createElement('div', null,
                        React.createElement('label', { className: 'block text-sm font-semibold text-gray-700 mb-2' }, 
                            '🔥 Calories *'
                        ),
                        React.createElement('input', {
                            type: 'number',
                            value: mealData.calories,
                            onChange: (e) => updateField('calories', e.target.value),
                            className: 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg',
                            placeholder: '350',
                            min: '0',
                            required: true
                        })
                    ),
                    React.createElement('div', null,
                        React.createElement('label', { className: 'block text-sm font-semibold text-gray-700 mb-2' }, 
                            '💪 Protein (g)'
                        ),
                        React.createElement('input', {
                            type: 'number',
                            step: '0.1',
                            value: mealData.protein,
                            onChange: (e) => updateField('protein', e.target.value),
                            className: 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-lg',
                            placeholder: '25',
                            min: '0'
                        })
                    ),
                    React.createElement('div', null,
                        React.createElement('label', { className: 'block text-sm font-semibold text-gray-700 mb-2' }, 
                            '🌾 Carbs (g)'
                        ),
                        React.createElement('input', {
                            type: 'number',
                            step: '0.1',
                            value: mealData.carbs,
                            onChange: (e) => updateField('carbs', e.target.value),
                            className: 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-lg',
                            placeholder: '30',
                            min: '0'
                        })
                    )
                ),

                React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-6' },
                    React.createElement('div', null,
                        React.createElement('label', { className: 'block text-sm font-semibold text-gray-700 mb-2' }, 
                            '🥑 Fat (g)'
                        ),
                        React.createElement('input', {
                            type: 'number',
                            step: '0.1',
                            value: mealData.fat,
                            onChange: (e) => updateField('fat', e.target.value),
                            className: 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg',
                            placeholder: '12',
                            min: '0'
                        })
                    ),
                    React.createElement('div', null,
                        React.createElement('label', { className: 'block text-sm font-semibold text-gray-700 mb-2' }, 
                            '🥬 Fiber (g)'
                        ),
                        React.createElement('input', {
                            type: 'number',
                            step: '0.1',
                            value: mealData.fiber,
                            onChange: (e) => updateField('fiber', e.target.value),
                            className: 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg',
                            placeholder: '5',
                            min: '0'
                        })
                    )
                ),
                
                React.createElement('button', {
                    type: 'submit',
                    disabled: isLoading,
                    className: `w-full px-8 py-4 bg-gradient-to-r from-blue-500 to-teal-600 hover:from-blue-600 hover:to-teal-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-lg font-bold text-lg transform hover:scale-105 transition-all duration-200 ${isLoading ? 'cursor-not-allowed' : ''}`
                }, 
                    isLoading ? '⏳ Adding Meal...' : '✅ Add Meal to Log'
                )
            )
        );
    };

    // Comprehensive rendering function that NEVER fails
    const renderNutritionTabSafely = (containerId = 'nutrition-container') => {
        console.log('🔧 Starting safe nutrition tab render...');
        
        try {
            const container = document.getElementById(containerId);
            if (!container) {
                console.error(`❌ Container ${containerId} not found`);
                return false;
            }

            // Show loading state immediately
            container.innerHTML = `
                <div class="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-cyan-50 flex items-center justify-center">
                    <div class="text-center">
                        <div class="text-6xl mb-4 animate-bounce">🍽️</div>
                        <h3 class="text-2xl font-bold text-gray-800 mb-2">Loading Nutrition Tracker</h3>
                        <div class="flex justify-center">
                            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                    </div>
                </div>
            `;

            // Create React component with delay to ensure DOM is ready
            setTimeout(() => {
                try {
                    const component = React.createElement(ComprehensiveNutritionTracker);
                    const root = globalRootManager.createRoot(containerId, component);
                    
                    if (root) {
                        console.log('✅ Nutrition tab rendered successfully');
                        return true;
                    } else {
                        throw new Error('Failed to create React root');
                    }
                } catch (renderError) {
                    console.error('❌ Render error:', renderError);
                    globalRootManager.showErrorUI(container, 'Nutrition Loading Error');
                    return false;
                }
            }, 100);

            return true;
        } catch (error) {
            console.error('❌ Critical error in renderNutritionTabSafely:', error);
            return false;
        }
    };

    // Meal planning integration
    const renderMealPlanningTabSafely = (containerId = 'meal-planning-container') => {
        console.log('🔧 Starting safe meal planning render...');
        
        try {
            const container = document.getElementById(containerId);
            if (!container) {
                console.error(`❌ Container ${containerId} not found`);
                return false;
            }

            // Check if meal planning exists
            if (typeof window.HabbtMealPlanning?.IntelligentMealPlanningApp === 'function') {
                const component = React.createElement(window.HabbtMealPlanning.IntelligentMealPlanningApp);
                const root = globalRootManager.createRoot(containerId, component);
                
                if (root) {
                    console.log('✅ Meal planning rendered successfully');
                    return true;
                } else {
                    throw new Error('Failed to create meal planning root');
                }
            } else {
                console.warn('⚠️ Meal planning component not available');
                container.innerHTML = `
                    <div class="p-8 text-center">
                        <div class="text-6xl mb-4">🍽️</div>
                        <h3 class="text-xl font-bold text-gray-800 mb-2">Meal Planning Coming Soon</h3>
                        <p class="text-gray-600">The meal planning module is being loaded...</p>
                    </div>
                `;
                return false;
            }
        } catch (error) {
            console.error('❌ Error rendering meal planning:', error);
            return false;
        }
    };

    // Enhanced main meals tab renderer that handles both nutrition and meal planning
    const renderMealsTabComplete = (containerId = 'meals-container') => {
        console.log('🔧 Starting complete meals tab render...');
        
        try {
            const container = document.getElementById(containerId);
            if (!container) {
                console.error(`❌ Container ${containerId} not found`);
                return false;
            }

            // Clear any existing content
            globalRootManager.clearRoot(containerId);
            
            // Create tabs structure
            container.innerHTML = `
                <div class="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-cyan-50">
                    <div class="max-w-7xl mx-auto p-6">
                        <!-- Tabs Header -->
                        <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 mb-8">
                            <div class="flex border-b border-gray-200">
                                <button id="nutrition-tab-btn" class="flex-1 px-6 py-4 font-semibold text-blue-600 border-b-2 border-blue-600 bg-blue-50 rounded-tl-2xl transition-colors">
                                    🍽️ Nutrition Tracking
                                </button>
                                <button id="meal-planning-tab-btn" class="flex-1 px-6 py-4 font-semibold text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-tr-2xl transition-colors">
                                    📅 Meal Planning
                                </button>
                            </div>
                        </div>

                        <!-- Tab Content -->
                        <div id="nutrition-container" class="tab-content active"></div>
                        <div id="meal-planning-container" class="tab-content hidden"></div>
                    </div>
                </div>
            `;

            // Tab switching logic
            const nutritionTabBtn = document.getElementById('nutrition-tab-btn');
            const mealPlanningTabBtn = document.getElementById('meal-planning-tab-btn');
            const nutritionContainer = document.getElementById('nutrition-container');
            const mealPlanningContainer = document.getElementById('meal-planning-container');

            const switchToNutrition = () => {
                nutritionTabBtn.className = 'flex-1 px-6 py-4 font-semibold text-blue-600 border-b-2 border-blue-600 bg-blue-50 rounded-tl-2xl transition-colors';
                mealPlanningTabBtn.className = 'flex-1 px-6 py-4 font-semibold text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-tr-2xl transition-colors';
                nutritionContainer.className = 'tab-content active';
                mealPlanningContainer.className = 'tab-content hidden';
                
                setTimeout(() => renderNutritionTabSafely('nutrition-container'), 100);
            };

            const switchToMealPlanning = () => {
                mealPlanningTabBtn.className = 'flex-1 px-6 py-4 font-semibold text-blue-600 border-b-2 border-blue-600 bg-blue-50 rounded-tr-2xl transition-colors';
                nutritionTabBtn.className = 'flex-1 px-6 py-4 font-semibold text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-tl-2xl transition-colors';
                mealPlanningContainer.className = 'tab-content active';
                nutritionContainer.className = 'tab-content hidden';
                
                setTimeout(() => renderMealPlanningTabSafely('meal-planning-container'), 100);
            };

            nutritionTabBtn.addEventListener('click', switchToNutrition);
            mealPlanningTabBtn.addEventListener('click', switchToMealPlanning);

            // Start with nutrition tab
            switchToNutrition();

            console.log('✅ Complete meals tab rendered with tabs');
            return true;
        } catch (error) {
            console.error('❌ Error rendering complete meals tab:', error);
            return false;
        }
    };

    // Global exports - EVERYTHING the main app needs
    window.HabbtNutrition = {
        ComprehensiveNutritionTracker,
        renderNutritionTabSafely,
        renderMealPlanningTabSafely,
        renderMealsTabComplete,
        globalRootManager
    };

    // Backwards compatibility 
    window.FuelIQNutrition = window.HabbtNutrition;
    window.renderNutritionTab = renderNutritionTabSafely;
    window.renderMealPlanning = renderMealPlanningTabSafely;
    window.renderMealsTab = renderMealsTabComplete;

    // Main app integration points
    window.tryRenderMeals = renderMealsTabComplete;
    window.renderMeals = renderMealsTabComplete;

    console.log('✅ Comprehensive Meals Tab Fix loaded - React DOM conflicts eliminated');
    console.log('🎯 Available functions: renderMealsTabComplete, renderNutritionTabSafely, renderMealPlanningTabSafely');

})();
