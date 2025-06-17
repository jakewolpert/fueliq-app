// FuelIQ Profile Tab - FINAL FIXED VERSION
(function() {
    // Prevent multiple loading
    if (window.FuelIQProfile) {
        return;
    }

    // Robust Storage System
    const STORAGE_KEY = 'fueliq_profile_data';
    
    const saveProfileData = (data) => {
        console.log('💾 Saving profile data:', data);
        
        try {
            // Always use localStorage as primary method
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            
            // Also sync with FuelIQDataManager if available
            if (window.FuelIQDataManager && data.personal && data.goals) {
                const managerProfile = {
                    name: data.personal.name,
                    age: calculateAge(data.personal.birthday),
                    weight: data.current.weight,
                    height: data.personal.height,
                    gender: data.personal.gender,
                    activityLevel: data.current.activityLevel,
                    goal: data.goals.primaryGoal
                };
                
                const goals = {
                    calories: data.goals.calories,
                    protein: data.goals.protein,
                    carbs: data.goals.carbs,
                    fat: data.goals.fat
                };
                
                window.FuelIQDataManager.setProfile(managerProfile);
                window.FuelIQDataManager.setGoals(goals);
                console.log('✅ Profile synced with DataManager');
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
        
        if (!age || !weight || !height || isNaN(age) || isNaN(weight) || isNaN(height)) {
            return {
                calories: 2000,
                protein: 150,
                carbs: 250,
                fat: 67
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
            calories: Math.round(targetCalories),
            protein: Math.round(proteinGrams),
            carbs: Math.round(carbGrams),
            fat: Math.round(fatGrams)
        };
    };

    // Fixed Navigation Function
    const navigateToTab = (tabName) => {
        console.log(`🚀 Attempting to navigate to: ${tabName}`);
        
        // Method 1: Direct window function
        if (window.setCurrentView && typeof window.setCurrentView === 'function') {
            console.log('✅ Using window.setCurrentView');
            window.setCurrentView(tabName);
            return true;
        }
        
        // Method 2: Find React instance and update state
        const app = document.querySelector('#root');
        if (app && app._reactInternalInstance) {
            console.log('✅ Using React internal instance');
            // This is more complex and version-dependent
        }
        
        // Method 3: Custom event
        console.log('⚡ Using custom event dispatch');
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

    // Quick Stats Component
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

        return React.createElement('div', { className: 'bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-6 mb-6' },
            React.createElement('h3', { className: 'text-xl font-bold text-gray-800 mb-4 flex items-center' },
                React.createElement('span', { className: 'text-2xl mr-3' }, '⚡'),
                `${profile.personal.name ? `${profile.personal.name}'s` : 'Your'} Quick Stats`
            ),
            
            React.createElement('div', { className: 'grid grid-cols-2 md:grid-cols-4 gap-4 mb-6' },
                React.createElement('div', { className: 'text-center p-4 bg-blue-50 rounded-lg' },
                    React.createElement('div', { className: 'text-2xl font-bold text-blue-600' }, 
                        profile.current.weight ? `${profile.current.weight} lbs` : '--'
                    ),
                    React.createElement('div', { className: 'text-sm text-gray-600' }, 'Current Weight')
                ),
                
                age && React.createElement('div', { className: 'text-center p-4 bg-purple-50 rounded-lg' },
                    React.createElement('div', { className: 'text-2xl font-bold text-purple-600' }, `${age} yrs`),
                    React.createElement('div', { className: 'text-sm text-gray-600' }, 'Age')
                ),
                
                bmi && React.createElement('div', { className: 'text-center p-4 bg-green-50 rounded-lg' },
                    React.createElement('div', { className: 'text-2xl font-bold text-green-600' }, bmi.toFixed(1)),
                    React.createElement('div', { className: `text-sm ${bmiInfo.color}` }, bmiInfo.category),
                    React.createElement('div', { className: 'text-xs text-gray-500' }, 'BMI')
                )
            ),

            React.createElement('form', { onSubmit: handleQuickWeight, className: 'flex gap-2' },
                React.createElement('input', {
                    type: 'number',
                    value: quickWeight,
                    onChange: (e) => setQuickWeight(e.target.value),
                    step: '0.1',
                    min: '50',
                    max: '500',
                    placeholder: 'Today\'s weight...',
                    className: 'flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all duration-200'
                }),
                React.createElement('button', {
                    type: 'submit',
                    className: 'px-6 py-2 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white rounded-lg font-semibold shadow-lg transform hover:scale-105 transition-all duration-200'
                }, 'Log Weight')
            )
        );
    };

    // Basic Info Component
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
                        className: 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all duration-200',
                        placeholder: 'Enter your name'
                    })
                ),
                
                React.createElement('div', null,
                    React.createElement('label', { className: 'block text-sm font-semibold text-gray-700 mb-2' }, 'Birthday'),
                    React.createElement('input', {
                        type: 'date',
                        value: profile.personal.birthday,
                        onChange: (e) => handleChange('personal.birthday', e.target.value),
                        className: 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all duration-200',
                        max: formatDate(new Date())
                    })
                ),
                
                React.createElement('div', null,
                    React.createElement('label', { className: 'block text-sm font-semibold text-gray-700 mb-2' }, 'Current Weight (lbs)'),
                    React.createElement('input', {
                        type: 'number',
                        value: profile.current.weight,
                        onChange: (e) => handleChange('current.weight', e.target.value),
                        className: 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all duration-200',
                        placeholder: '150'
                    })
                ),
                
                React.createElement('div', null,
                    React.createElement('label', { className: 'block text-sm font-semibold text-gray-700 mb-2' }, 'Height (inches)'),
                    React.createElement('input', {
                        type: 'number',
                        value: profile.personal.height,
                        onChange: (e) => handleChange('personal.height', e.target.value),
                        className: 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all duration-200',
                        placeholder: '70'
                    })
                )
            )
        );
    };

    // Goals Component with Timeline
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

        const goals = calculateGoals(profile);

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
                        className: 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all duration-200'
                    },
                        React.createElement('option', { value: 'sedentary' }, 'Sedentary'),
                        React.createElement('option', { value: 'light' }, 'Light Activity'),
                        React.createElement('option', { value: 'moderate' }, 'Moderate Activity'),
                        React.createElement('option', { value: 'active' }, 'Very Active'),
                        React.createElement('option', { value: 'very_active' }, 'Extremely Active')
                    )
                ),
                
                React.createElement('div', null,
                    React.createElement('label', { className: 'block text-sm font-semibold text-gray-700 mb-2' }, 'Primary Goal'),
                    React.createElement('select', {
                        value: profile.goals.primaryGoal,
                        onChange: (e) => handleChange('goals.primaryGoal', e.target.value),
                        className: 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all duration-200'
                    },
                        React.createElement('option', { value: 'fat_loss' }, 'Fat Loss'),
                        React.createElement('option', { value: 'muscle_gain' }, 'Muscle Gain'),
                        React.createElement('option', { value: 'maintenance' }, 'Maintenance'),
                        React.createElement('option', { value: 'recomp' }, 'Body Recomposition')
                    )
                )
            ),

            // Calculated Goals Display
            goals.calories && React.createElement('div', { className: 'p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-200' },
                React.createElement('h4', { className: 'font-bold text-orange-800 mb-3' }, 'Daily Targets'),
                React.createElement('div', { className: 'grid grid-cols-2 md:grid-cols-4 gap-4 text-center' },
                    React.createElement('div', null,
                        React.createElement('div', { className: 'text-2xl font-bold text-orange-600' }, goals.calories),
                        React.createElement('div', { className: 'text-sm text-gray-600' }, 'Calories')
                    ),
                    React.createElement('div', null,
                        React.createElement('div', { className: 'text-2xl font-bold text-red-500' }, `${goals.protein}g`),
                        React.createElement('div', { className: 'text-sm text-gray-600' }, 'Protein')
                    ),
                    React.createElement('div', null,
                        React.createElement('div', { className: 'text-2xl font-bold text-green-500' }, `${goals.carbs}g`),
                        React.createElement('div', { className: 'text-sm text-gray-600' }, 'Carbs')
                    ),
                    React.createElement('div', null,
                        React.createElement('div', { className: 'text-2xl font-bold text-yellow-500' }, `${goals.fat}g`),
                        React.createElement('div', { className: 'text-sm text-gray-600' }, 'Fat')
                    )
                )
            )
        );
    };

    // Advanced Settings Component
    const AdvancedSettings = ({ profile, onChange, isVisible, onToggle }) => {
        const foodsILoveOptions = [
            'Chicken', 'Salmon', 'Beef', 'Eggs', 'Rice', 'Pasta', 'Broccoli', 'Spinach'
        ];

        const foodsIAvoidOptions = [
            'Liver', 'Brussels Sprouts', 'Spicy Foods', 'Dairy', 'Gluten', 'Shellfish'
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

        return React.createElement('div', { className: 'bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 mb-6' },
            React.createElement('button', {
                onClick: onToggle,
                className: 'w-full p-6 text-left flex justify-between items-center hover:bg-gray-50 transition-colors'
            },
                React.createElement('h3', { className: 'text-xl font-bold text-gray-800 flex items-center' },
                    React.createElement('span', { className: 'text-2xl mr-3' }, '⚙️'),
                    'Food Preferences'
                ),
                React.createElement('span', { className: `text-2xl transition-transform ${isVisible ? 'rotate-180' : ''}` }, '▼')
            ),
            
            isVisible && React.createElement('div', { className: 'px-6 pb-6 space-y-6' },
                // Foods I Love
                React.createElement('div', null,
                    React.createElement('h4', { className: 'text-lg font-bold text-gray-800 mb-3' }, 'Foods I Love'),
                    React.createElement('div', { className: 'grid grid-cols-2 md:grid-cols-4 gap-2' },
                        foodsILoveOptions.map(food => 
                            React.createElement('button', {
                                key: food,
                                onClick: () => handleArrayChange('preferences', 'foodsILove', food),
                                className: `p-2 rounded-lg border text-sm font-medium transition-all duration-200 ${
                                    profile.preferences.foodsILove.includes(food)
                                        ? 'border-green-500 bg-green-50 text-green-700'
                                        : 'border-gray-200 bg-white text-gray-600 hover:border-green-300'
                                }`
                            }, food)
                        )
                    )
                ),

                // Foods I Avoid
                React.createElement('div', null,
                    React.createElement('h4', { className: 'text-lg font-bold text-gray-800 mb-3' }, 'Foods I Avoid'),
                    React.createElement('div', { className: 'grid grid-cols-2 md:grid-cols-4 gap-2' },
                        foodsIAvoidOptions.map(food => 
                            React.createElement('button', {
                                key: food,
                                onClick: () => handleArrayChange('preferences', 'foodsIAvoid', food),
                                className: `p-2 rounded-lg border text-sm font-medium transition-all duration-200 ${
                                    profile.preferences.foodsIAvoid.includes(food)
                                        ? 'border-red-500 bg-red-50 text-red-700'
                                        : 'border-gray-200 bg-white text-gray-600 hover:border-red-300'
                                }`
                            }, food)
                        )
                    )
                )
            )
        );
    };

    // Personalized Analysis Component
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

        const isProfileComplete = () => {
            return profile.personal.name && 
                   profile.personal.birthday && 
                   profile.personal.height && 
                   profile.current.weight;
        };

        if (!isProfileComplete()) {
            return React.createElement('div', { className: 'bg-gradient-to-r from-orange-100 to-red-100 rounded-3xl p-6 mb-6 border-l-4 border-orange-500' },
                React.createElement('h4', { className: 'text-lg font-bold text-orange-800 mb-2' }, '✨ Complete Your Profile'),
                React.createElement('p', { className: 'text-orange-700' }, 
                    'Fill out your basic information above to generate your personalized plan.'
                )
            );
        }

        if (showAnalysis) {
            return React.createElement('div', { className: 'bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-6 mb-6' },
                React.createElement('h3', { className: 'text-xl font-bold text-gray-800 mb-4 flex items-center' },
                    React.createElement('span', { className: 'text-2xl mr-3' }, '✅'),
                    `${profile.personal.name}'s Personalized Plan Ready!`
                ),
                
                React.createElement('div', { className: 'bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 mb-4' },
                    React.createElement('p', { className: 'text-green-700 font-medium mb-4' }, 
                        `Your custom ${profile.goals.primaryGoal.replace('_', ' ')} plan is ready with ${calculateGoals(profile).calories} daily calories.`
                    ),
                    React.createElement('p', { className: 'text-gray-700 text-sm' }, 
                        `Based on your preferences, activity level, and goals, we've created a personalized nutrition strategy just for you.`
                    )
                ),

                React.createElement('div', { className: 'flex gap-3 mt-6' },
                    React.createElement('button', {
                        onClick: () => {
                            console.log('🍽️ Navigating to Meals Tab');
                            const success = navigateToTab('meals');
                            if (!success) {
                                alert('Navigation to meals tab failed. Please click the Meals tab manually.');
                            }
                        },
                        className: 'flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white rounded-lg font-semibold shadow-lg transform hover:scale-105 transition-all duration-200'
                    }, '🍽️ Start Tracking Meals'),
                    React.createElement('button', {
                        onClick: () => {
                            console.log('📊 Navigating to Dashboard Tab');
                            const success = navigateToTab('dashboard');
                            if (!success) {
                                alert('Navigation to dashboard tab failed. Please click the Dashboard tab manually.');
                            }
                        },
                        className: 'flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg font-semibold shadow-lg transform hover:scale-105 transition-all duration-200'
                    }, '📊 View Dashboard')
                )
            );
        }

        return React.createElement('div', { className: 'bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-6 mb-6' },
            React.createElement('h3', { className: 'text-xl font-bold text-gray-800 mb-4 flex items-center' },
                React.createElement('span', { className: 'text-2xl mr-3' }, '✨'),
                'Generate Your Personalized Plan'
            ),
            
            React.createElement('button', {
                onClick: generatePersonalizedPlan,
                disabled: isGenerating,
                className: `w-full px-6 py-4 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white rounded-lg font-bold text-lg shadow-lg transform hover:scale-105 transition-all duration-200 ${
                    isGenerating ? 'opacity-50 cursor-not-allowed' : ''
                }`
            },
                isGenerating 
                    ? React.createElement('div', { className: 'flex items-center justify-center space-x-2' },
                        React.createElement('div', { className: 'w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin' }),
                        React.createElement('span', null, 'Analyzing Your Profile...')
                      )
                    : '🎯 Generate My Personalized Plan'
            )
        );
    };

    // Main Profile Component
    const ProfileTab = () => {
        const [profile, setProfile] = React.useState(loadProfileData());
        const [showAdvanced, setShowAdvanced] = React.useState(false);

        // Auto-save with proper persistence
        React.useEffect(() => {
            if (profile.personal.name) { // Only save if there's actual data
                saveProfileData(profile);
            }
        }, [profile]);

        const handleQuickWeightUpdate = (weight) => {
            const entry = {
                weight: weight,
                date: formatDate(new Date()),
                timestamp: Date.now()
            };

            setProfile(prev => ({
                ...prev,
                current: {
                    ...prev.current,
                    weight: weight,
                    lastWeightEntry: entry
                },
                weightHistory: [...prev.weightHistory, entry]
            }));
        };

        const handlePlanGenerated = () => {
            setProfile(prev => ({
                ...prev,
                planGenerated: true,
                planGeneratedDate: new Date().toISOString()
            }));
        };

        return React.createElement('div', { className: 'min-h-screen bg-gradient-to-br from-orange-50 to-red-50' },
            React.createElement('div', { className: 'max-w-6xl mx-auto p-6' },
                // Header
                React.createElement('div', { className: 'bg-gradient-to-r from-orange-500 to-red-600 rounded-3xl shadow-2xl p-6 mb-6 text-white' },
                    React.createElement('h1', { className: 'text-3xl font-bold mb-2' }, 
                        profile.personal.name ? `${profile.personal.name}'s Profile` : 'Your Profile'
                    ),
                    React.createElement('p', { className: 'text-lg opacity-90' }, 
                        'Manage your goals, track progress, and customize preferences'
                    )
                ),

                // Components
                React.createElement(QuickStats, { 
                    profile: profile, 
                    onQuickWeightUpdate: handleQuickWeightUpdate 
                }),

                React.createElement(BasicInfo, { 
                    profile: profile, 
                    onChange: setProfile 
                }),

                React.createElement(GoalsActivity, { 
                    profile: profile, 
                    onChange: setProfile 
                }),

                React.createElement(AdvancedSettings, { 
                    profile: profile, 
                    onChange: setProfile,
                    isVisible: showAdvanced,
                    onToggle: () => setShowAdvanced(!showAdvanced)
                }),

                React.createElement(PersonalizedAnalysis, {
                    profile: profile,
                    onComplete: handlePlanGenerated
                })
            )
        );
    };

    // Export for integration
    const renderProfileTab = (containerId) => {
        const container = document.getElementById(containerId);
        if (container) {
            ReactDOM.render(React.createElement(ProfileTab), container);
        }
    };

    // Make available globally
    window.FuelIQProfile = {
        ProfileTab,
        renderProfileTab,
        navigateToTab // Export navigation function
    };

    console.log('✅ FuelIQ Profile tab loaded - FINAL FIXED VERSION with robust data persistence');

})();
