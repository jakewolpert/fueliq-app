// Habbt Profile Tab - FULL FEATURED VERSION with Beautiful Blue-Teal Design
(function() {
    // Prevent multiple loading
    if (window.HabbtProfile || window.FuelIQProfile) {
        return;
    }

    // Robust Storage System - Updated for Habbt
    const STORAGE_KEY = 'habbt_profile_data';
    
    const saveProfileData = (data) => {
        console.log('💾 Saving profile data:', data);
        
        try {
            // Always use localStorage as primary method
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            
            // Also sync with HabbtDataManager if available (backward compatibility with FuelIQ)
            if (window.HabbtDataManager && data.personal && data.goals) {
                const managerProfile = {
                    name: data.personal.name,
                    age: calculateAge(data.personal.birthday),
                    weight: data.current.weight,
                    height: data.personal.height,
                    gender: data.personal.gender,
                    activityLevel: data.current.activityLevel,
                    goal: data.goals.primaryGoal,
                    dietaryRestrictions: data.dietary.restrictions,
                    allergies: data.dietary.allergies,
                    healthConcerns: data.dietary.healthConcerns,
                    foodsILove: data.preferences.foodsILove,
                    foodsIAvoid: data.preferences.foodsIAvoid,
                    cuisinePreferences: data.preferences.cuisines
                };
                
                const goals = {
                    calories: data.goals.calories,
                    protein: data.goals.protein,
                    carbs: data.goals.carbs,
                    fat: data.goals.fat
                };
                
                window.HabbtDataManager.setProfile(managerProfile);
                window.HabbtDataManager.setGoals(goals);
                console.log('✅ Profile synced with Habbt DataManager');
            } else if (window.FuelIQDataManager && data.personal && data.goals) {
                // Backward compatibility
                const managerProfile = {
                    name: data.personal.name,
                    age: calculateAge(data.personal.birthday),
                    weight: data.current.weight,
                    height: data.personal.height,
                    gender: data.personal.gender,
                    activityLevel: data.current.activityLevel,
                    goal: data.goals.primaryGoal,
                    dietaryRestrictions: data.dietary.restrictions,
                    allergies: data.dietary.allergies,
                    healthConcerns: data.dietary.healthConcerns,
                    foodsILove: data.preferences.foodsILove,
                    foodsIAvoid: data.preferences.foodsIAvoid,
                    cuisinePreferences: data.preferences.cuisines
                };
                
                const goals = {
                    calories: data.goals.calories,
                    protein: data.goals.protein,
                    carbs: data.goals.carbs,
                    fat: data.goals.fat
                };
                
                window.FuelIQDataManager.setProfile(managerProfile);
                window.FuelIQDataManager.setGoals(goals);
                console.log('✅ Profile synced with FuelIQ DataManager (compatibility)');
            }
        } catch (e) {
            console.error('❌ Failed to save profile data:', e);
        }
    };

    const loadProfileData = () => {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            if (data) {
                const parsed = JSON.parse(data);
                console.log('✅ Profile data loaded from localStorage:', parsed);
                return parsed;
            }
            
            // Try to load from old FuelIQ storage for migration
            const oldData = localStorage.getItem('fueliq_profile_data');
            if (oldData) {
                const parsed = JSON.parse(oldData);
                console.log('🔄 Migrating profile data from FuelIQ to Habbt');
                saveProfileData(parsed); // Save in new format
                return parsed;
            }
        } catch (e) {
            console.error('❌ Failed to load profile data:', e);
        }

        // Return default structure
        return {
            personal: {
                name: '',
                birthday: '',
                height: '',
                gender: 'male'
            },
            current: {
                weight: '',
                activityLevel: 'moderate',
                lastWeightEntry: null
            },
            goals: {
                primaryGoal: 'fat_loss',
                targetWeight: '',
                targetDate: '',
                calories: 2000,
                protein: 150,
                carbs: 250,
                fat: 67
            },
            dietary: {
                restrictions: [],
                allergies: [],
                healthConcerns: []
            },
            preferences: {
                foodsILove: [],
                foodsIAvoid: [],
                cuisines: [],
                antiBloutPreference: false
            },
            weightHistory: [],
            planGenerated: false,
            planGeneratedDate: null
        };
    };

    // Helper Functions
    const calculateAge = (birthday) => {
        if (!birthday) return '';
        const today = new Date();
        const birth = new Date(birthday);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    };

    const calculateBirthday = (age) => {
        if (!age) return '';
        const today = new Date();
        const birthYear = today.getFullYear() - parseInt(age);
        return `${birthYear}-01-01`;
    };

    const formatDate = (date) => {
        return date.toISOString().split('T')[0];
    };

    const calculateBMI = (weightLbs, heightInches) => {
        if (!weightLbs || !heightInches) return null;
        const weightKg = weightLbs / 2.205;
        const heightM = heightInches * 0.0254;
        return weightKg / (heightM * heightM);
    };

    const getBMICategory = (bmi) => {
        if (bmi < 18.5) return { category: 'Underweight', color: 'text-blue-600' };
        if (bmi < 25) return { category: 'Normal', color: 'text-green-600' };
        if (bmi < 30) return { category: 'Overweight', color: 'text-yellow-600' };
        return { category: 'Obese', color: 'text-red-600' };
    };

    const calculateGoals = (profile) => {
        const age = calculateAge(profile.personal.birthday);
        const { weight } = profile.current;
        const { height, gender } = profile.personal;
        const { activityLevel, primaryGoal } = profile.goals;
        
        // Validate inputs to prevent NaN
        if (!age || !weight || !height || isNaN(age) || isNaN(weight) || isNaN(height)) {
            return {
                ...profile.goals,
                calories: profile.goals.calories || 2000,
                protein: profile.goals.protein || 150,
                carbs: profile.goals.carbs || 250,
                fat: profile.goals.fat || 67
            };
        }
        
        const weightKg = parseFloat(weight) / 2.205;
        const heightCm = parseFloat(height) * 2.54;
        const ageNum = parseInt(age);
        
        let bmr;
        if (gender === 'male') {
            bmr = 10 * weightKg + 6.25 * heightCm - 5 * ageNum + 5;
        } else {
            bmr = 10 * weightKg + 6.25 * heightCm - 5 * ageNum - 161;
        }
        
        const activityMultipliers = {
            sedentary: 1.2,
            light: 1.375,
            moderate: 1.55,
            active: 1.725,
            very_active: 1.9
        };
        
        const tdee = bmr * (activityMultipliers[activityLevel] || 1.55);
        
        const goalAdjustments = {
            fat_loss: -500,
            muscle_gain: 300,
            maintenance: 0,
            recomp: -200
        };
        
        const targetCalories = tdee + (goalAdjustments[primaryGoal] || 0);
        
        const proteinPerKg = primaryGoal === 'muscle_gain' ? 2.2 : primaryGoal === 'fat_loss' ? 2.0 : 1.8;
        const proteinGrams = (weightKg * proteinPerKg);
        const proteinCalories = proteinGrams * 4;
        
        const fatPercentage = primaryGoal === 'fat_loss' ? 0.25 : 0.30;
        const fatCalories = targetCalories * fatPercentage;
        const fatGrams = fatCalories / 9;
        
        const carbCalories = targetCalories - proteinCalories - fatCalories;
        const carbGrams = carbCalories / 4;
        
        return {
            ...profile.goals,
            calories: Math.round(targetCalories),
            protein: Math.round(proteinGrams),
            carbs: Math.round(carbGrams),
            fat: Math.round(fatGrams)
        };
    };

    // Enhanced Navigation Function for Habbt
    const navigateToTab = (tabName) => {
        console.log(`🚀 Attempting to navigate to: ${tabName}`);
        
        // Method 1: Direct window function
        if (window.setCurrentView && typeof window.setCurrentView === 'function') {
            console.log('✅ Using window.setCurrentView');
            window.setCurrentView(tabName);
            return true;
        }
        
        // Method 2: Custom event for Habbt
        console.log('⚡ Using Habbt custom event dispatch');
        window.dispatchEvent(new CustomEvent('habbt-navigate', { 
            detail: { tab: tabName }
        }));
        
        // Method 3: Fallback to FuelIQ event for compatibility
        window.dispatchEvent(new CustomEvent('fueliq-navigate', { 
            detail: { tab: tabName }
        }));
        
        // Method 4: Simulate tab click
        const tabButtons = document.querySelectorAll(`[data-tab="${tabName}"], button[onclick*="${tabName}"]`);
        if (tabButtons.length > 0) {
            console.log('🖱️ Simulating tab click');
            tabButtons[0].click();
            return true;
        }
        
        console.log('❌ All navigation methods failed');
        return false;
    };

    // Quick Stats Component with Habbt Blue-Teal Design
    const QuickStats = ({ profile, onQuickWeightUpdate }) => {
        const [quickWeight, setQuickWeight] = React.useState('');
        const age = calculateAge(profile.personal.birthday);
        const bmi = calculateBMI(profile.current.weight, profile.personal.height);
        const bmiInfo = bmi ? getBMICategory(bmi) : null;

        const handleQuickWeight = (e) => {
            e.preventDefault();
            if (quickWeight) {
                onQuickWeightUpdate(parseFloat(quickWeight));
                setQuickWeight('');
            }
        };

        const recentWeights = profile.weightHistory.slice(-5).reverse();
        const weightTrend = recentWeights.length >= 2 ? 
            recentWeights[0].weight - recentWeights[1].weight : 0;

        // Personalized message for habit building
        const getPersonalizedMessage = () => {
            const name = profile.personal.name;
            const goal = profile.goals.primaryGoal;
            const goalMessages = {
                fat_loss: `${name ? `${name}, your` : 'Your'} fat loss journey is systematically designed with sustainable habits.`,
                muscle_gain: `${name ? `${name}, your` : 'Your'} muscle building system focuses on consistent nutrition habits.`,
                maintenance: `${name ? `${name}, your` : 'Your'} maintenance system keeps you balanced with healthy habits.`,
                recomp: `${name ? `${name}, your` : 'Your'} body recomposition system combines optimal nutrition habits.`
            };
            return goalMessages[goal] || `${name ? `${name}, your` : 'Your'} nutrition system is built around your unique habits.`;
        };

        return React.createElement('div', { className: 'bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-6 mb-6' },
            React.createElement('h3', { className: 'text-xl font-bold text-gray-800 mb-2 flex items-center' },
                React.createElement('span', { className: 'text-2xl mr-3' }, '⚡'),
                `${profile.personal.name ? `${profile.personal.name}'s` : 'Your'} Quick Stats`
            ),
            
            // Personalized message with Habbt branding
            React.createElement('div', { className: 'bg-gradient-to-r from-blue-50 to-teal-50 rounded-lg p-3 mb-4 border-l-4 border-blue-500' },
                React.createElement('p', { className: 'text-sm text-blue-800 font-medium' }, 
                    getPersonalizedMessage()
                )
            ),
            
            React.createElement('div', { className: 'grid grid-cols-2 md:grid-cols-4 gap-4 mb-6' },
                React.createElement('div', { className: 'text-center p-4 bg-blue-50 rounded-lg' },
                    React.createElement('div', { className: 'text-2xl font-bold text-blue-600' }, 
                        profile.current.weight ? `${profile.current.weight} lbs` : '--'
                    ),
                    React.createElement('div', { className: 'text-sm text-gray-600' }, 'Current Weight')
                ),
                
                age && React.createElement('div', { className: 'text-center p-4 bg-teal-50 rounded-lg' },
                    React.createElement('div', { className: 'text-2xl font-bold text-teal-600' }, `${age} yrs`),
                    React.createElement('div', { className: 'text-sm text-gray-600' }, 'Age')
                ),
                
                bmi && React.createElement('div', { className: 'text-center p-4 bg-green-50 rounded-lg' },
                    React.createElement('div', { className: 'text-2xl font-bold text-green-600' }, bmi.toFixed(1)),
                    React.createElement('div', { className: `text-sm ${bmiInfo.color}` }, bmiInfo.category),
                    React.createElement('div', { className: 'text-xs text-gray-500' }, 'BMI')
                ),
                
                weightTrend !== 0 && React.createElement('div', { className: 'text-center p-4 bg-cyan-50 rounded-lg' },
                    React.createElement('div', { className: `text-2xl font-bold ${weightTrend > 0 ? 'text-cyan-600' : 'text-green-600'}` }, 
                        `${weightTrend > 0 ? '+' : ''}${weightTrend.toFixed(1)}`
                    ),
                    React.createElement('div', { className: 'text-sm text-gray-600' }, 'Recent Change')
                )
            ),

            // Quick Weight Entry with Habbt colors
            React.createElement('form', { onSubmit: handleQuickWeight, className: 'flex gap-2' },
                React.createElement('input', {
                    type: 'number',
                    value: quickWeight,
                    onChange: (e) => setQuickWeight(e.target.value),
                    step: '0.1',
                    min: '50',
                    max: '500',
                    placeholder: 'Today\'s weight...',
                    className: 'flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200'
                }),
                React.createElement('button', {
                    type: 'submit',
                    className: 'px-6 py-2 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white rounded-lg font-semibold shadow-lg transform hover:scale-105 transition-all duration-200'
                }, 'Log Weight')
            )
        );
    };

    // Basic Info Component with Habbt styling
    const BasicInfo = ({ profile, onChange }) => {
        const handleChange = (field, value) => {
            if (field.includes('.')) {
                const [section, key] = field.split('.');
                onChange({
                    ...profile,
                    [section]: {
                        ...profile[section],
                        [key]: value
                    }
                });
            } else {
                onChange({ ...profile, [field]: value });
            }
        };

        return React.createElement('div', { className: 'bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-6 mb-6' },
            React.createElement('h3', { className: 'text-xl font-bold text-gray-800 mb-4 flex items-center' },
                React.createElement('span', { className: 'text-2xl mr-3' }, '👤'),
                'Basic Information'
            ),
            
            React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-4' },
                React.createElement('div', null,
                    React.createElement('label', { className: 'block text-sm font-semibold text-gray-700 mb-2' }, 'Name'),
                    React.createElement('input', {
                        type: 'text',
                        value: profile.personal.name,
                        onChange: (e) => handleChange('personal.name', e.target.value),
                        className: 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200',
                        placeholder: 'Enter your name'
                    })
                ),
                
                React.createElement('div', null,
                    React.createElement('label', { className: 'block text-sm font-semibold text-gray-700 mb-2' }, 'Birthday'),
                    React.createElement('input', {
                        type: 'date',
                        value: profile.personal.birthday,
                        onChange: (e) => handleChange('personal.birthday', e.target.value),
                        className: 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200',
                        max: formatDate(new Date())
                    })
                ),
                
                React.createElement('div', null,
                    React.createElement('label', { className: 'block text-sm font-semibold text-gray-700 mb-2' }, 'Current Weight (lbs)'),
                    React.createElement('input', {
                        type: 'number',
                        value: profile.current.weight,
                        onChange: (e) => handleChange('current.weight', e.target.value),
                        className: 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200',
                        placeholder: '150'
                    })
                ),
                
                React.createElement('div', null,
                    React.createElement('label', { className: 'block text-sm font-semibold text-gray-700 mb-2' }, 'Height (inches)'),
                    React.createElement('input', {
                        type: 'number',
                        value: profile.personal.height,
                        onChange: (e) => handleChange('personal.height', e.target.value),
                        className: 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200',
                        placeholder: '70'
                    })
                ),
                
                React.createElement('div', null,
                    React.createElement('label', { className: 'block text-sm font-semibold text-gray-700 mb-2' }, 'Gender'),
                    React.createElement('select', {
                        value: profile.personal.gender,
                        onChange: (e) => handleChange('personal.gender', e.target.value),
                        className: 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200'
                    },
                        React.createElement('option', { value: 'male' }, 'Male'),
                        React.createElement('option', { value: 'female' }, 'Female')
                    )
                )
            )
        );
    };

    // Goals & Activity Component with Habbt design and timeline
    const GoalsActivity = ({ profile, onChange }) => {
        const handleChange = (field, value) => {
            const [section, key] = field.split('.');
            onChange({
                ...profile,
                [section]: {
                    ...profile[section],
                    [key]: value
                }
            });
        };

        // Calculate goal timeline
        const getGoalTimeline = () => {
            const currentWeight = parseFloat(profile.current.weight);
            const targetWeight = parseFloat(profile.goals.targetWeight);
            const targetDate = profile.goals.targetDate;
            
            if (!currentWeight || !targetWeight || !targetDate) return null;
            
            const weightToChange = currentWeight - targetWeight;
            const isGainGoal = weightToChange < 0;
            const today = new Date();
            const target = new Date(targetDate);
            const daysToGoal = Math.ceil((target - today) / (1000 * 60 * 60 * 24));
            const weeksToGoal = daysToGoal / 7;
            
            if (weeksToGoal <= 0) return null;
            
            const weeklyRate = Math.abs(weightToChange / weeksToGoal);
            
            return {
                weightToChange: Math.abs(weightToChange),
                weeksToGoal: Math.round(weeksToGoal),
                daysToGoal,
                weeklyRate,
                isGainGoal,
                isTooAggressive: weeklyRate > 2.5 && !isGainGoal,
                isTooSlow: weeklyRate < 0.5 && !isGainGoal
            };
        };

        const timeline = getGoalTimeline();

        return React.createElement('div', { className: 'bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-6 mb-6' },
            React.createElement('h3', { className: 'text-xl font-bold text-gray-800 mb-4 flex items-center' },
                React.createElement('span', { className: 'text-2xl mr-3' }, '🎯'),
                'Goals & Activity'
            ),
            
            React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-4 mb-6' },
                React.createElement('div', null,
                    React.createElement('label', { className: 'block text-sm font-semibold text-gray-700 mb-2' }, 'Activity Level'),
                    React.createElement('select', {
                        value: profile.current.activityLevel,
                        onChange: (e) => handleChange('current.activityLevel', e.target.value),
                        className: 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200'
                    },
                        React.createElement('option', { value: 'sedentary' }, 'Sedentary (desk job, no exercise)'),
                        React.createElement('option', { value: 'light' }, 'Light (light exercise 1-3 days/week)'),
                        React.createElement('option', { value: 'moderate' }, 'Moderate (moderate exercise 3-5 days/week)'),
                        React.createElement('option', { value: 'active' }, 'Active (hard exercise 6-7 days/week)'),
                        React.createElement('option', { value: 'very_active' }, 'Very Active (2x/day, intense training)')
                    )
                ),
                
                React.createElement('div', null,
                    React.createElement('label', { className: 'block text-sm font-semibold text-gray-700 mb-2' }, 'Primary Goal'),
                    React.createElement('select', {
                        value: profile.goals.primaryGoal,
                        onChange: (e) => handleChange('goals.primaryGoal', e.target.value),
                        className: 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200'
                    },
                        React.createElement('option', { value: 'fat_loss' }, 'Fat Loss'),
                        React.createElement('option', { value: 'muscle_gain' }, 'Muscle Gain'),
                        React.createElement('option', { value: 'maintenance' }, 'Maintenance'),
                        React.createElement('option', { value: 'recomp' }, 'Body Recomposition')
                    )
                ),
                
                React.createElement('div', null,
    React.createElement('label', { className: 'block text-sm font-semibold text-gray-700 mb-2' }, 'Target Weight (Optional)'),
    React.createElement('input', {
        type: 'number',
        value: profile.goals.targetWeight,
        onChange: (e) => handleChange('goals.targetWeight', e.target.value),
        className: 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200',
        placeholder: 'Optional - focus on habits instead'
    })
),
                
                React.createElement('div', null,
                    React.createElement('label', { className: 'block text-sm font-semibold text-gray-700 mb-2' }, 'Target Date'),
                    React.createElement('input', {
                        type: 'date',
                        value: profile.goals.targetDate,
                        onChange: (e) => handleChange('goals.targetDate', e.target.value),
                        className: 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200',
                        min: formatDate(new Date())
                    })
                )
            ),

            // Enhanced Macro Goals with Suggested vs Custom toggle
            profile.goals.calories && React.createElement('div', { className: 'p-4 bg-gradient-to-r from-blue-50 to-teal-50 rounded-lg border border-blue-200' },
                // Macro Toggle Header
                React.createElement('div', { className: 'flex items-center justify-between mb-4' },
                    React.createElement('h4', { className: 'font-bold text-blue-800' }, 'Daily Macro Targets'),
                    React.createElement('div', { className: 'flex bg-white rounded-lg p-1 shadow-sm' },
                        React.createElement('button', {
                            onClick: () => handleChange('goals.macroMode', 'suggested'),
                            className: `px-3 py-1 text-sm font-medium rounded transition-all ${
                                (profile.goals.macroMode || 'suggested') === 'suggested' 
                                    ? 'bg-blue-500 text-white shadow' 
                                    : 'text-blue-600 hover:bg-blue-50'
                            }`
                        }, '🎯 Suggested'),
                        React.createElement('button', {
                            onClick: () => handleChange('goals.macroMode', 'custom'),
                            className: `px-3 py-1 text-sm font-medium rounded transition-all ${
                                profile.goals.macroMode === 'custom' 
                                    ? 'bg-blue-500 text-white shadow' 
                                    : 'text-blue-600 hover:bg-blue-50'
                            }`
                        }, '⚙️ Custom')
                    )
                ),

                // Suggested Mode (default calculated macros)
                (profile.goals.macroMode || 'suggested') === 'suggested' && React.createElement('div', null,
                    React.createElement('div', { className: 'grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-4' },
                        React.createElement('div', null,
                            React.createElement('div', { className: 'text-2xl font-bold text-blue-600' }, profile.goals.calories || '--'),
                            React.createElement('div', { className: 'text-sm text-gray-600' }, 'Calories')
                        ),
                        React.createElement('div', null,
                            React.createElement('div', { className: 'text-2xl font-bold text-teal-500' }, `${profile.goals.protein || '--'}g`),
                            React.createElement('div', { className: 'text-sm text-gray-600' }, 'Protein')
                        ),
                        React.createElement('div', null,
                            React.createElement('div', { className: 'text-2xl font-bold text-green-500' }, `${profile.goals.carbs || '--'}g`),
                            React.createElement('div', { className: 'text-sm text-gray-600' }, 'Carbs')
                        ),
                        React.createElement('div', null,
                            React.createElement('div', { className: 'text-2xl font-bold text-cyan-500' }, `${profile.goals.fat || '--'}g`),
                            React.createElement('div', { className: 'text-sm text-gray-600' }, 'Fat')
                        )
                    ),
                    React.createElement('div', { className: 'text-xs text-blue-700 bg-blue-100 rounded p-2 text-center' },
                        '✨ Calculated based on your goal, activity level, and body composition'
                    )
                ),

                // Custom Mode (manual input fields)
                profile.goals.macroMode === 'custom' && React.createElement('div', null,
                    React.createElement('div', { className: 'grid grid-cols-2 md:grid-cols-4 gap-4 mb-4' },
                        React.createElement('div', null,
                            React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-1' }, 'Calories'),
                            React.createElement('input', {
                                type: 'number',
                                value: profile.goals.customCalories || profile.goals.calories || '',
                                onChange: (e) => handleChange('goals.customCalories', e.target.value),
                                className: 'w-full px-3 py-2 border border-gray-300 rounded focus:border-blue-500 text-center',
                                placeholder: '2000'
                            })
                        ),
                        React.createElement('div', null,
                            React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-1' }, 'Protein (g)'),
                            React.createElement('input', {
                                type: 'number',
                                value: profile.goals.customProtein || profile.goals.protein || '',
                                onChange: (e) => handleChange('goals.customProtein', e.target.value),
                                className: 'w-full px-3 py-2 border border-gray-300 rounded focus:border-blue-500 text-center',
                                placeholder: '150'
                            })
                        ),
                        React.createElement('div', null,
                            React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-1' }, 'Carbs (g)'),
                            React.createElement('input', {
                                type: 'number',
                                value: profile.goals.customCarbs || profile.goals.carbs || '',
                                onChange: (e) => handleChange('goals.customCarbs', e.target.value),
                                className: 'w-full px-3 py-2 border border-gray-300 rounded focus:border-blue-500 text-center',
                                placeholder: '250'
                            })
                        ),
                        React.createElement('div', null,
                            React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-1' }, 'Fat (g)'),
                            React.createElement('input', {
                                type: 'number',
                                value: profile.goals.customFat || profile.goals.fat || '',
                                onChange: (e) => handleChange('goals.customFat', e.target.value),
                                className: 'w-full px-3 py-2 border border-gray-300 rounded focus:border-blue-500 text-center',
                                placeholder: '67'
                            })
                        )
                    ),
                   React.createElement('div', { className: 'text-xs text-blue-700 bg-blue-100 rounded p-2 text-center' },
                    '⚙️ Set your own macro targets based on your preferences or coach recommendations'
                )
            ),
                
                // Goal Timeline with Habbt colors
                timeline && React.createElement('div', { className: 'pt-4 border-t border-blue-200' },
                    React.createElement('div', { className: 'text-center' },
                        React.createElement('h5', { className: 'font-bold text-blue-800 mb-2' }, '🎯 Your Goal Timeline'),
                        React.createElement('p', { className: 'text-sm text-blue-700 mb-1' },
                            `${timeline.isGainGoal ? 'Gain' : 'Lose'} ${timeline.weightToChange.toFixed(1)} lbs in ${timeline.weeksToGoal} weeks`
                        ),
                        React.createElement('p', { className: 'text-sm text-blue-600 mb-2' },
                            `Target rate: ${timeline.weeklyRate.toFixed(1)} lbs per week ${timeline.isGainGoal ? 'gain' : 'loss'}`
                        ),
                        timeline.isTooAggressive && React.createElement('p', { className: 'text-xs text-red-600 bg-red-50 rounded p-2' },
                            '⚠️ This rate may be too aggressive for healthy weight loss. Consider extending your timeline.'
                        ),
                        timeline.isTooSlow && React.createElement('p', { className: 'text-xs text-yellow-600 bg-yellow-50 rounded p-2' },
                            '💡 This is a very gradual approach - perfect for sustainable long-term results!'
                        )
                    )
                )
            )
        );
    };

    // FULL COMPREHENSIVE Advanced Settings Component with Habbt design
    const AdvancedSettings = ({ profile, onChange, isVisible, onToggle }) => {
        const dietaryOptions = [
            'Vegetarian', 'Vegan', 'Pescatarian', 'Keto', 'Paleo', 'Mediterranean', 
            'Low Carb', 'Low Fat', 'Gluten-Free', 'Dairy-Free', 'Sugar-Free', 
            'Intermittent Fasting', 'FODMAP', 'Whole30', 'Raw Food', 'Flexitarian'
        ];

        const allergyOptions = [
            'Dairy/Lactose', 'Gluten/Wheat', 'Nuts (Tree Nuts)', 'Peanuts', 'Shellfish', 
            'Fish', 'Eggs', 'Soy', 'Sesame', 'Corn', 'Nightshades', 'Sulfites'
        ];

        const healthConcernOptions = [
            'High Blood Pressure', 'High Cholesterol', 'Diabetes', 'Pre-diabetes', 
            'PCOS', 'Thyroid Issues', 'IBS', 'Acid Reflux', 'Kidney Issues', 
            'Heart Disease', 'Osteoporosis', 'Arthritis'
        ];

        const foodsILoveOptions = [
            'Chicken', 'Salmon', 'Beef', 'Pork', 'Eggs', 'Tofu', 'Beans', 'Lentils',
            'Rice', 'Pasta', 'Quinoa', 'Bread', 'Oats', 'Potatoes', 'Sweet Potatoes',
            'Broccoli', 'Spinach', 'Tomatoes', 'Peppers', 'Mushrooms', 'Avocado',
            'Berries', 'Bananas', 'Apples', 'Cheese', 'Yogurt', 'Nuts', 'Seeds',
            'Olive Oil', 'Coconut Oil', 'Dark Chocolate', 'Green Tea'
        ];

        const foodsIAvoidOptions = [
            'Liver', 'Sardines', 'Anchovies', 'Brussels Sprouts', 'Cauliflower', 'Kale',
            'Cottage Cheese', 'Blue Cheese', 'Spicy Foods', 'Very Sweet Foods',
            'Fried Foods', 'Processed Meats', 'Soda', 'Energy Drinks', 'Artificial Sweeteners',
            'Gluten', 'Dairy', 'Red Meat', 'Shellfish', 'Coconut', 'Cilantro', 'Olives',
            'Mushrooms', 'Onions', 'Garlic', 'Pickles', 'Vinegar', 'Spicy Peppers'
        ];

        const cuisineOptions = [
            'Italian', 'Mexican', 'Asian', 'Mediterranean', 'Indian', 'Thai', 
            'American', 'French', 'Greek', 'Japanese', 'Korean', 'Middle Eastern'
        ];

        const handleArrayChange = (section, field, item) => {
            const currentArray = profile[section][field];
            const newArray = currentArray.includes(item)
                ? currentArray.filter(x => x !== item)
                : [...currentArray, item];
            
            onChange({
                ...profile,
                [section]: {
                    ...profile[section],
                    [field]: newArray
                }
            });
        };

        const handlePreferenceChange = (field, value) => {
            onChange({
                ...profile,
                preferences: {
                    ...profile.preferences,
                    [field]: value
                }
            });
        };

        return React.createElement('div', { className: 'bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 mb-6' },
            React.createElement('button', {
                onClick: onToggle,
                className: 'w-full p-6 text-left flex justify-between items-center hover:bg-gray-50 transition-colors'
            },
                React.createElement('h3', { className: 'text-xl font-bold text-gray-800 flex items-center' },
                    React.createElement('span', { className: 'text-2xl mr-3' }, '⚙️'),
                    'Advanced Settings'
                ),
                React.createElement('span', { className: `text-2xl transition-transform ${isVisible ? 'rotate-180' : ''}` }, '▼')
            ),
            
            isVisible && React.createElement('div', { className: 'px-6 pb-6 space-y-6' },
                // Dietary Restrictions with Habbt colors
                React.createElement('div', null,
                    React.createElement('h4', { className: 'text-lg font-bold text-gray-800 mb-3' }, 'Dietary Preferences'),
                    React.createElement('div', { className: 'grid grid-cols-2 md:grid-cols-4 gap-2' },
                        dietaryOptions.map(option => 
                            React.createElement('button', {
                                key: option,
                                onClick: () => handleArrayChange('dietary', 'restrictions', option),
                                className: `p-2 rounded-lg border text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                                    profile.dietary.restrictions.includes(option)
                                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                                        : 'border-gray-200 bg-white text-gray-600 hover:border-blue-300'
                                }`
                            }, option)
                        )
                    )
                ),

                // Allergies with Habbt colors
                React.createElement('div', null,
                    React.createElement('h4', { className: 'text-lg font-bold text-gray-800 mb-3' }, 'Allergies & Intolerances'),
                    React.createElement('div', { className: 'grid grid-cols-2 md:grid-cols-4 gap-2' },
                        allergyOptions.map(allergy => 
                            React.createElement('button', {
                                key: allergy,
                                onClick: () => handleArrayChange('dietary', 'allergies', allergy),
                                className: `p-2 rounded-lg border text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                                    profile.dietary.allergies.includes(allergy)
                                        ? 'border-red-500 bg-red-50 text-red-700'
                                        : 'border-gray-200 bg-white text-gray-600 hover:border-red-300'
                                }`
                            }, allergy)
                        )
                    )
                ),

                // Health Concerns with Habbt colors
                React.createElement('div', null,
                    React.createElement('h4', { className: 'text-lg font-bold text-gray-800 mb-3' }, 'Health Concerns'),
                    React.createElement('div', { className: 'grid grid-cols-2 md:grid-cols-3 gap-2' },
                        healthConcernOptions.map(concern => 
                            React.createElement('button', {
                                key: concern,
                                onClick: () => handleArrayChange('dietary', 'healthConcerns', concern),
                                className: `p-2 rounded-lg border text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                                    profile.dietary.healthConcerns.includes(concern)
                                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                                        : 'border-gray-200 bg-white text-gray-600 hover:border-purple-300'
                                }`
                            }, concern)
                        )
                    )
                ),

                // Foods I Love with Habbt colors
                React.createElement('div', null,
                    React.createElement('h4', { className: 'text-lg font-bold text-gray-800 mb-3' }, 'Foods I Love'),
                    React.createElement('div', { className: 'grid grid-cols-2 md:grid-cols-4 gap-2' },
                        foodsILoveOptions.map(food => 
                            React.createElement('button', {
                                key: food,
                                onClick: () => handleArrayChange('preferences', 'foodsILove', food),
                                className: `p-2 rounded-lg border text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                                    profile.preferences.foodsILove.includes(food)
                                        ? 'border-green-500 bg-green-50 text-green-700'
                                        : 'border-gray-200 bg-white text-gray-600 hover:border-green-300'
                                }`
                            }, food)
                        )
                    )
                ),

                // Foods I Avoid with Habbt colors
                React.createElement('div', null,
                    React.createElement('h4', { className: 'text-lg font-bold text-gray-800 mb-3' }, 'Foods I Avoid'),
                    React.createElement('div', { className: 'grid grid-cols-2 md:grid-cols-4 gap-2' },
                        foodsIAvoidOptions.map(food => 
                            React.createElement('button', {
                                key: food,
                                onClick: () => handleArrayChange('preferences', 'foodsIAvoid', food),
                                className: `p-2 rounded-lg border text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                                    profile.preferences.foodsIAvoid.includes(food)
                                        ? 'border-red-500 bg-red-50 text-red-700'
                                        : 'border-gray-200 bg-white text-gray-600 hover:border-red-300'
                                }`
                            }, food)
                        )
                    )
                ),

                // Cuisine Preferences with Habbt colors
                React.createElement('div', null,
                    React.createElement('h4', { className: 'text-lg font-bold text-gray-800 mb-3' }, 'Favorite Cuisines'),
                    React.createElement('div', { className: 'grid grid-cols-2 md:grid-cols-4 gap-2' },
                        cuisineOptions.map(cuisine => 
                            React.createElement('button', {
                                key: cuisine,
                                onClick: () => handleArrayChange('preferences', 'cuisines', cuisine),
                                className: `p-2 rounded-lg border text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                                    profile.preferences.cuisines.includes(cuisine)
                                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                                        : 'border-gray-200 bg-white text-gray-600 hover:border-blue-300'
                                }`
                            }, cuisine)
                        )
                    )
                ),

                // Anti-Bloat Preference with Habbt colors
                React.createElement('div', null,
                    React.createElement('h4', { className: 'text-lg font-bold text-gray-800 mb-3' }, 'Special Preferences'),
                    React.createElement('label', { className: 'flex items-center space-x-3 p-3 bg-gray-50 rounded-lg cursor-pointer' },
                        React.createElement('input', {
                            type: 'checkbox',
                            checked: profile.preferences.antiBloutPreference,
                            onChange: (e) => handlePreferenceChange('antiBloutPreference', e.target.checked),
                            className: 'w-5 h-5 text-blue-500 rounded focus:ring-blue-500'
                        }),
                        React.createElement('span', { className: 'text-gray-700 font-medium' }, 'Prioritize anti-bloat foods'),
                        React.createElement('span', { className: 'text-sm text-gray-500' }, '(Low FODMAP, digestive-friendly options)')
                    )
                )
            )
        );
    };

    // Weight History Component (unchanged but with Habbt colors)
    const WeightHistory = ({ profile }) => {
        const sortedHistory = [...profile.weightHistory].sort((a, b) => b.timestamp - a.timestamp).slice(0, 10);

        if (sortedHistory.length === 0) {
            return React.createElement('div', { className: 'bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-6' },
                React.createElement('h3', { className: 'text-xl font-bold text-gray-800 mb-4 flex items-center' },
                    React.createElement('span', { className: 'text-2xl mr-3' }, '📈'),
                    'Weight History'
                ),
                React.createElement('div', { className: 'text-center py-8 text-gray-400' },
                    React.createElement('p', null, 'No weight entries yet'),
                    React.createElement('p', { className: 'text-sm' }, 'Start logging your weight above to see progress')
                )
            );
        }

        return React.createElement('div', { className: 'bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-6' },
            React.createElement('h3', { className: 'text-xl font-bold text-gray-800 mb-4 flex items-center' },
                React.createElement('span', { className: 'text-2xl mr-3' }, '📈'),
                'Recent Weight Entries'
            ),
            React.createElement('div', { className: 'space-y-3' },
                ...sortedHistory.map((entry, index) => {
                    const date = new Date(entry.timestamp);
                    const isLatest = index === 0;
                    return React.createElement('div', { 
                        key: entry.timestamp,
                        className: `flex justify-between items-center p-3 rounded-lg ${
                            isLatest ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
                        }`
                    },
                        React.createElement('div', null,
                            React.createElement('div', { className: `font-semibold ${isLatest ? 'text-blue-800' : 'text-gray-800'}` }, 
                                `${entry.weight} lbs`
                            ),
                            React.createElement('div', { className: 'text-sm text-gray-600' }, 
                                date.toLocaleDateString('en-US', { 
                                    weekday: 'short', 
                                    month: 'short', 
                                    day: 'numeric' 
                                })
                            )
                        ),
                        isLatest && React.createElement('span', { className: 'text-sm font-semibold text-blue-600' }, 'Latest')
                    );
                })
            )
        );
    };

    // FULL COMPREHENSIVE Personalized Analysis Component with Habbt branding
    const PersonalizedAnalysis = ({ profile, onComplete }) => {
        const [isGenerating, setIsGenerating] = React.useState(false);
        const [showAnalysis, setShowAnalysis] = React.useState(profile.planGenerated || false);

        React.useEffect(() => {
            setShowAnalysis(profile.planGenerated || false);
        }, [profile.planGenerated]);

        const generatePersonalizedPlan = async () => {
            setIsGenerating(true);
            await new Promise(resolve => setTimeout(resolve, 2000));
            setIsGenerating(false);
            setShowAnalysis(true);
            onComplete();
        };

        const getPersonalizedInsights = () => {
            const { name } = profile.personal;
            const { primaryGoal } = profile.goals;
            const { activityLevel } = profile.current;
            const restrictions = profile.dietary.restrictions;
            const allergies = profile.dietary.allergies;
            const healthConcerns = profile.dietary.healthConcerns;
            const foodsLoved = profile.preferences.foodsILove;
            const foodsAvoided = profile.preferences.foodsIAvoid;
            const cuisines = profile.preferences.cuisines;

            const insights = [];

            // Goal-specific insights with Habbt language
            if (primaryGoal === 'fat_loss') {
                insights.push(`${name}, your fat loss system combines a ${profile.goals.calories}-calorie target with ${profile.goals.protein}g protein to preserve muscle while burning fat systematically.`);
            } else if (primaryGoal === 'muscle_gain') {
                insights.push(`${name}, your muscle building system focuses on ${profile.goals.protein}g daily protein and a ${profile.goals.calories}-calorie surplus to fuel consistent growth.`);
            } else if (primaryGoal === 'maintenance') {
                insights.push(`${name}, your maintenance system keeps you balanced at ${profile.goals.calories} calories with optimal macros for sustained energy and health.`);
            }

            // Activity-specific insights
            if (activityLevel === 'very_active') {
                insights.push("Your high activity level means we've increased your carb intake to fuel those intense training sessions - your system adapts to your lifestyle.");
            } else if (activityLevel === 'sedentary') {
                insights.push("We've optimized your macros for a desk-based lifestyle while keeping you energized throughout the day - smart habits for your routine.");
            }

            // Dietary preference insights
            if (restrictions.includes('Vegetarian') || restrictions.includes('Vegan')) {
                insights.push("Your plant-based approach is built into every recommendation - we'll focus on complete proteins and B12-rich foods for optimal nutrition.");
            }
            if (restrictions.includes('Keto')) {
                insights.push("Your ketogenic targets emphasize healthy fats while keeping carbs minimal for optimal ketosis - your system for metabolic flexibility.");
            }
            if (restrictions.includes('Mediterranean')) {
                insights.push("Your Mediterranean approach prioritizes olive oil, fish, and fresh vegetables for heart-healthy nutrition - a proven system for longevity.");
            }

            // Health concern insights
            if (healthConcerns.length > 0) {
                if (healthConcerns.includes('High Blood Pressure')) {
                    insights.push("We've programmed low-sodium alternatives and DASH diet principles to support your blood pressure goals systematically.");
                }
                if (healthConcerns.includes('Diabetes') || healthConcerns.includes('Pre-diabetes')) {
                    insights.push("Your meal timing and low-glycemic food choices are optimized for stable blood sugar control - your system for metabolic health.");
                }
            }

            // Food preference insights
            if (foodsLoved.length > 0) {
                const favorites = foodsLoved.slice(0, 3).join(', ');
                insights.push(`We've noted your love for ${favorites} - expect meal suggestions featuring these favorites regularly in your personalized system!`);
            }
            if (foodsAvoided.length > 0) {
                const avoided = foodsAvoided.slice(0, 2).join(' and ');
                insights.push(`Don't worry - you'll never see ${avoided} in your recommendations. Your preferences are completely respected in your personal system.`);
            }

            // Cuisine insights
            if (cuisines.length > 0) {
                const favCuisines = cuisines.slice(0, 2).join(' and ');
                insights.push(`Your love for ${favCuisines} cuisine is reflected in our meal database - authentic flavors that fit your goals and systematic approach.`);
            }

            // Allergy safety
            if (allergies.length > 0) {
                insights.push(`Your ${allergies.join(', ')} allergies are programmed into our safety filters - every suggestion is automatically screened for your protection.`);
            }

            // Anti-bloat preference
            if (profile.preferences.antiBloutPreference) {
                insights.push("Your anti-bloat preference means we prioritize easily digestible, low-FODMAP options to keep you feeling comfortable - your system for digestive wellness.");
            }

            return insights;
        };

        const isProfileComplete = () => {
    return profile.personal.name && 
           profile.personal.birthday && 
           profile.personal.height && 
           profile.current.weight;
};

        if (!isProfileComplete()) {
            return React.createElement('div', { className: 'bg-gradient-to-r from-blue-100 to-teal-100 rounded-3xl p-6 mb-6 border-l-4 border-blue-500' },
                React.createElement('h4', { className: 'text-lg font-bold text-blue-800 mb-2' }, '✨ Almost Ready!'),
                React.createElement('p', { className: 'text-blue-700' }, 
                    'Complete your basic info and goals above to generate your personalized nutrition system.'
                )
            );
        }

        if (showAnalysis) {
            const insights = getPersonalizedInsights();
            
            return React.createElement('div', { className: 'bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-6 mb-6' },
                React.createElement('h3', { className: 'text-xl font-bold text-gray-800 mb-4 flex items-center' },
                    React.createElement('span', { className: 'text-2xl mr-3' }, '🎯'),
                    `${profile.personal.name}'s Personalized System`
                ),
                
                React.createElement('div', { className: 'bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 mb-4 border border-green-200' },
                    React.createElement('div', { className: 'flex items-center mb-3' },
                        React.createElement('span', { className: 'text-2xl mr-3' }, '✅'),
                        React.createElement('h4', { className: 'text-lg font-bold text-green-800' }, 'System Generated Successfully!')
                    ),
                    React.createElement('p', { className: 'text-green-700 font-medium' }, 
                        `Welcome to Habbt, ${profile.personal.name}! Your completely customized nutrition system is ready for better habits.`
                    )
                ),

                React.createElement('div', { className: 'space-y-4 mb-6' },
                    ...insights.map((insight, index) => 
                        React.createElement('div', { 
                            key: index,
                            className: 'flex items-start space-x-3 p-3 bg-gray-50 rounded-lg'
                        },
                            React.createElement('span', { className: 'text-blue-500 font-bold mt-1' }, '•'),
                            React.createElement('p', { className: 'text-gray-700 text-sm leading-relaxed' }, insight)
                        )
                    )
                ),

                React.createElement('div', { className: 'bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg p-4 text-white' },
                    React.createElement('h4', { className: 'font-bold mb-2' }, '🚀 What Happens Next?'),
                    React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-3 gap-4 text-sm' },
                        React.createElement('div', { className: 'flex items-center space-x-2' },
                            React.createElement('span', { className: 'text-lg' }, '🍽️'),
                            React.createElement('span', null, 'Nutrition suggestions tailored to your system')
                        ),
                        React.createElement('div', { className: 'flex items-center space-x-2' },
                            React.createElement('span', { className: 'text-lg' }, '📊'),
                            React.createElement('span', null, 'Progress tracking aligned with your habits')
                        ),
                        React.createElement('div', { className: 'flex items-center space-x-2' },
                            React.createElement('span', { className: 'text-lg' }, '🔄'),
                            React.createElement('span', null, 'Automatic adjustments as your system evolves')
                        )
                    )
                ),

                React.createElement('div', { className: 'flex gap-3 mt-6' },
                    React.createElement('button', {
                        onClick: () => {
                            const button = event.target;
                            button.innerHTML = '🍽️ Loading Nutrition...';
                            button.disabled = true;
                            
                            setTimeout(() => {
                                const success = navigateToTab('meals');
                                if (!success) {
                                    button.innerHTML = '🍽️ Click Nutrition Tab Manually';
                                    button.disabled = false;
                                    alert('Please click the Nutrition tab manually - navigation issue detected.');
                                }
                            }, 300);
                        },
                        className: 'flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white rounded-lg font-semibold shadow-lg transform hover:scale-105 transition-all duration-200'
                    }, '🍽️ Start Tracking Nutrition'),
                    React.createElement('button', {
                        onClick: () => {
                            const button = event.target;
                            button.innerHTML = '📊 Loading Dashboard...';
                            button.disabled = true;
                            
                            setTimeout(() => {
                                const success = navigateToTab('dashboard');
                                if (!success) {
                                    button.innerHTML = '📊 Click Dashboard Tab Manually';
                                    button.disabled = false;
                                    alert('Please click the Dashboard tab manually - navigation issue detected.');
                                }
                            }, 300);
                        },
                        className: 'flex-1 px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white rounded-lg font-semibold shadow-lg transform hover:scale-105 transition-all duration-200'
                    }, '📊 View Dashboard')
                )
            );
        }

        return React.createElement('div', { className: 'bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-6 mb-6' },
            React.createElement('h3', { className: 'text-xl font-bold text-gray-800 mb-4 flex items-center' },
                React.createElement('span', { className: 'text-2xl mr-3' }, '✨'),
                'Generate Your Personalized System'
            ),
            
            React.createElement('div', { className: 'bg-gradient-to-r from-blue-50 to-teal-50 rounded-lg p-4 mb-4 border border-blue-200' },
                React.createElement('p', { className: 'text-blue-800 font-medium mb-2' }, 
                    `Ready to create your custom nutrition system, ${profile.personal.name}?`
                ),
                React.createElement('p', { className: 'text-blue-700 text-sm' }, 
                    'Based on your inputs, we\'ll generate personalized meal recommendations, macro targets, and progress tracking - your system for better nutrition habits.'
                )
            ),

            React.createElement('button', {
                onClick: generatePersonalizedPlan,
                disabled: isGenerating,
                className: `w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white rounded-lg font-bold text-lg shadow-lg transform hover:scale-105 transition-all duration-200 ${
                    isGenerating ? 'opacity-50 cursor-not-allowed' : ''
                }`
            },
                isGenerating 
                    ? React.createElement('div', { className: 'flex items-center justify-center space-x-2' },
                        React.createElement('div', { className: 'w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin' }),
                        React.createElement('span', null, 'Analyzing Your Profile...')
                      )
                    : '🎯 Generate My Personalized System'
            )
        );
    };

    // Main Profile Component with Habbt design
    const ProfileTab = () => {
        const [profile, setProfile] = React.useState(loadProfileData());
        const [showAdvanced, setShowAdvanced] = React.useState(false);
        const [isFirstTime, setIsFirstTime] = React.useState(!profile.personal.name);

        // Auto-save profile changes with proper data manager integration
        React.useEffect(() => {
            if (profile.personal.name) { // Only save if there's actual data
                const updatedProfile = {
                    ...profile,
                    goals: calculateGoals(profile)
                };
                setProfile(updatedProfile);
                saveProfileData(updatedProfile);
            }
        }, [profile.personal, profile.current, profile.goals.primaryGoal, profile.goals.targetWeight, profile.dietary, profile.preferences]);

        // Show advanced on first time
        React.useEffect(() => {
            if (isFirstTime) {
                setShowAdvanced(true);
            }
        }, [isFirstTime]);

        const handleQuickWeightUpdate = (weight) => {
            const entry = {
                weight: weight,
                date: formatDate(new Date()),
                timestamp: Date.now()
            };

            const updatedProfile = {
                ...profile,
                current: {
                    ...profile.current,
                    weight: weight,
                    lastWeightEntry: entry
                },
                weightHistory: [...profile.weightHistory, entry]
            };

            setProfile(updatedProfile);
            saveProfileData(updatedProfile);
        };

        const handlePlanGenerated = () => {
            const updatedProfile = {
                ...profile,
                planGenerated: true,
                planGeneratedDate: new Date().toISOString()
            };
            setProfile(updatedProfile);
            saveProfileData(updatedProfile);
        };

        return React.createElement('div', { className: 'min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-cyan-50' },
            React.createElement('div', { className: 'max-w-6xl mx-auto p-6' },
               // Header with Habbt branding and smart messaging
React.createElement('div', { className: 'bg-gradient-to-r from-blue-600 to-teal-600 rounded-3xl shadow-2xl p-6 mb-6 text-white' },
    React.createElement('h1', { className: 'text-3xl font-bold mb-2' }, 
        profile.personal.name ? `${profile.personal.name}'s Profile` : 'Your Profile'
    ),
    React.createElement('p', { className: 'text-lg opacity-90' }, 
        (() => {
            const goal = profile.goals.primaryGoal;
            const name = profile.personal.name;
            const goalMessages = {
                fat_loss: `${name ? `${name}, let's` : 'Let\'s'} build your sustainable fat loss system with smart nutrition habits`,
                muscle_gain: `${name ? `${name}, let's` : 'Let\'s'} create your muscle building system with optimized protein and energy`,
                maintenance: `${name ? `${name}, let's` : 'Let\'s'} design your maintenance system for balanced, long-term health`,
                recomp: `${name ? `${name}, let's` : 'Let\'s'} craft your body recomposition system with precision nutrition`
            };
            return goalMessages[goal] || 'Build your personalized system for better nutrition habits';
        })()
    )
),

                // Quick Stats (always visible)
                React.createElement(QuickStats, { 
                    profile: profile, 
                    onQuickWeightUpdate: handleQuickWeightUpdate 
                }),

                // Basic Info (always visible)
                React.createElement(BasicInfo, { 
                    profile: profile, 
                    onChange: setProfile 
                }),

                // Goals & Activity (always visible)
                React.createElement(GoalsActivity, { 
                    profile: profile, 
                    onChange: setProfile 
                }),

                // Advanced Settings (collapsible) - FULL FEATURED VERSION
                React.createElement(AdvancedSettings, { 
                    profile: profile, 
                    onChange: setProfile,
                    isVisible: showAdvanced,
                    onToggle: () => setShowAdvanced(!showAdvanced)
                }),

                // Personalized Analysis & Plan Generation - FULL FEATURED VERSION
                React.createElement(PersonalizedAnalysis, {
                    profile: profile,
                    onComplete: handlePlanGenerated
                }),

                // Weight History
                React.createElement(WeightHistory, { profile: profile })
            )
        );
    };

    // Export for integration with both Habbt and FuelIQ (backward compatibility)
    const renderProfileTab = (containerId) => {
        const container = document.getElementById(containerId);
        if (container) {
            ReactDOM.render(React.createElement(ProfileTab), container);
        }
    };

    // Make available globally with both naming conventions
    window.HabbtProfile = {
        ProfileTab,
        renderProfileTab,
        navigateToTab
    };

    // Backward compatibility
    window.FuelIQProfile = window.HabbtProfile;

    console.log('✅ Habbt Profile tab loaded - FULL COMPREHENSIVE VERSION with beautiful blue-teal design');

})();
