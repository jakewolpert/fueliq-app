// FuelIQ Profile Tab - Combined Setup + Journey Module (FIXED VERSION)
(function() {
    // Prevent multiple loading
    if (window.FuelIQProfile) {
        return;
    }

    // Safe Storage Functions
    const isLocalStorageAvailable = () => {
        try {
            const test = '__localStorage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    };

    const memoryStorage = {};

    const saveProfileData = (data) => {
        const key = 'fueliq_unified_profile';
        const dataStr = JSON.stringify(data);
        
        if (isLocalStorageAvailable()) {
            try {
                localStorage.setItem(key, dataStr);
                // Also save to unified data manager
                if (window.UnifiedDataManager) {
                    window.UnifiedDataManager.setUserProfile(data.personal);
                    window.UnifiedDataManager.setGoals(data.goals);
                }
            } catch (e) {
                console.warn('localStorage failed, using memory storage:', e);
                memoryStorage[key] = dataStr;
            }
        } else {
            memoryStorage[key] = dataStr;
        }
    };

    const loadProfileData = () => {
        const key = 'fueliq_unified_profile';
        let data = null;
        
        if (isLocalStorageAvailable()) {
            try {
                data = localStorage.getItem(key);
            } catch (e) {
                console.warn('localStorage failed, using memory storage:', e);
                data = memoryStorage[key];
            }
        } else {
            data = memoryStorage[key];
        }
        
        if (data) {
            return JSON.parse(data);
        }

        // Try to migrate from old format
        const oldProfile = localStorage.getItem('fueliq_user_profile');
        const oldWeightData = localStorage.getItem('fueliq_weight_journey');
        
        if (oldProfile || oldWeightData) {
            const migrated = migrateOldData(oldProfile, oldWeightData);
            saveProfileData(migrated);
            return migrated;
        }

        // Default data structure
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

    const migrateOldData = (oldProfile, oldWeightData) => {
        const profile = oldProfile ? JSON.parse(oldProfile) : {};
        const weightData = oldWeightData ? JSON.parse(oldWeightData) : {};

        return {
            personal: {
                name: profile.name || '',
                birthday: profile.age ? calculateBirthday(profile.age) : '',
                height: profile.height || '',
                gender: profile.gender || 'male'
            },
            current: {
                weight: profile.weight || '',
                activityLevel: profile.activityLevel || 'moderate',
                lastWeightEntry: weightData.entries?.[weightData.entries.length - 1] || null
            },
            goals: {
                primaryGoal: profile.goal || 'fat_loss',
                targetWeight: weightData.targetWeight || '',
                targetDate: weightData.targetDate || '',
                calories: 2000,
                protein: 150,
                carbs: 250,
                fat: 67
            },
            dietary: {
                restrictions: profile.dietaryRestrictions || [],
                allergies: profile.allergies || [],
                healthConcerns: profile.healthConcerns || []
            },
            preferences: {
                foodsILove: profile.foodsILove || [],
                foodsIAvoid: profile.foodsIAvoid || [],
                cuisines: profile.cuisinePreferences || [],
                antiBloutPreference: profile.antiBloutPreference || false
            },
            weightHistory: weightData.entries || [],
            planGenerated: false, // Reset for migrated users so they see the new experience
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

        const recentWeights = profile.weightHistory.slice(-5).reverse();
        const weightTrend = recentWeights.length >= 2 ? 
            recentWeights[0].weight - recentWeights[1].weight : 0;

        // Personalized message
        const getPersonalizedMessage = () => {
            const name = profile.personal.name;
            const goal = profile.goals.primaryGoal;
            const goalMessages = {
                fat_loss: `${name ? `${name}, your` : 'Your'} fat loss journey is uniquely tailored to your metabolism and lifestyle.`,
                muscle_gain: `${name ? `${name}, your` : 'Your'} muscle building plan is customized for your body composition and training.`,
                maintenance: `${name ? `${name}, your` : 'Your'} maintenance plan keeps you balanced and energized.`,
                recomp: `${name ? `${name}, your` : 'Your'} body recomposition strategy is designed for your specific goals.`
            };
            return goalMessages[goal] || `${name ? `${name}, your` : 'Your'} nutrition plan is completely personalized for you.`;
        };

        return React.createElement('div', { className: 'bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-6 mb-6' },
            React.createElement('h3', { className: 'text-xl font-bold text-gray-800 mb-2 flex items-center' },
                React.createElement('span', { className: 'text-2xl mr-3' }, '⚡'),
                `${profile.personal.name ? `${profile.personal.name}'s` : 'Your'} Quick Stats`
            ),
            
            // Personalized message
            React.createElement('div', { className: 'bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-3 mb-4 border-l-4 border-orange-500' },
                React.createElement('p', { className: 'text-sm text-orange-800 font-medium' }, 
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
                
                age && React.createElement('div', { className: 'text-center p-4 bg-purple-50 rounded-lg' },
                    React.createElement('div', { className: 'text-2xl font-bold text-purple-600' }, `${age} yrs`),
                    React.createElement('div', { className: 'text-sm text-gray-600' }, 'Age')
                ),
                
                bmi && React.createElement('div', { className: 'text-center p-4 bg-green-50 rounded-lg' },
                    React.createElement('div', { className: 'text-2xl font-bold text-green-600' }, bmi.toFixed(1)),
                    React.createElement('div', { className: `text-sm ${bmiInfo.color}` }, bmiInfo.category),
                    React.createElement('div', { className: 'text-xs text-gray-500' }, 'BMI')
                ),
                
                weightTrend !== 0 && React.createElement('div', { className: 'text-center p-4 bg-orange-50 rounded-lg' },
                    React.createElement('div', { className: `text-2xl font-bold ${weightTrend > 0 ? 'text-orange-600' : 'text-green-600'}` }, 
                        `${weightTrend > 0 ? '+' : ''}${weightTrend.toFixed(1)}`
                    ),
                    React.createElement('div', { className: 'text-sm text-gray-600' }, 'Recent Change')
                )
            ),

            // Quick Weight Entry
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

    // Basic Info Component (unchanged)
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
                    React.createElement('label', { className: 'block text-sm font-semibold text-gray-700 mb-2' }, 'Height (inches)'),
                    React.createElement('input', {
                        type: 'number',
                        value: profile.personal.height,
                        onChange: (e) => handleChange('personal.height', e.target.value),
                        className: 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all duration-200',
                        placeholder: '70'
                    })
                ),
                
                React.createElement('div', null,
                    React.createElement('label', { className: 'block text-sm font-semibold text-gray-700 mb-2' }, 'Gender'),
                    React.createElement('select', {
                        value: profile.personal.gender,
                        onChange: (e) => handleChange('personal.gender', e.target.value),
                        className: 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all duration-200'
                    },
                        React.createElement('option', { value: 'male' }, 'Male'),
                        React.createElement('option', { value: 'female' }, 'Female')
                    )
                )
            )
        );
    };

    // Goals & Activity Component with Timeline
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
                        className: 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all duration-200'
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
                        className: 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all duration-200'
                    },
                        React.createElement('option', { value: 'fat_loss' }, 'Fat Loss'),
                        React.createElement('option', { value: 'muscle_gain' }, 'Muscle Gain'),
                        React.createElement('option', { value: 'maintenance' }, 'Maintenance'),
                        React.createElement('option', { value: 'recomp' }, 'Body Recomposition')
                    )
                ),
                
                React.createElement('div', null,
                    React.createElement('label', { className: 'block text-sm font-semibold text-gray-700 mb-2' }, 'Target Weight (lbs)'),
                    React.createElement('input', {
                        type: 'number',
                        value: profile.goals.targetWeight,
                        onChange: (e) => handleChange('goals.targetWeight', e.target.value),
                        className: 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all duration-200',
                        placeholder: 'Goal weight'
                    })
                ),
                
                React.createElement('div', null,
                    React.createElement('label', { className: 'block text-sm font-semibold text-gray-700 mb-2' }, 'Target Date'),
                    React.createElement('input', {
                        type: 'date',
                        value: profile.goals.targetDate,
                        onChange: (e) => handleChange('goals.targetDate', e.target.value),
                        className: 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all duration-200',
                        min: formatDate(new Date())
                    })
                )
            ),

            // Calculated Goals Display with Timeline
            profile.goals.calories && React.createElement('div', { className: 'p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-200' },
                React.createElement('h4', { className: 'font-bold text-orange-800 mb-3' }, 'Calculated Daily Targets'),
                React.createElement('div', { className: 'grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-4' },
                    React.createElement('div', null,
                        React.createElement('div', { className: 'text-2xl font-bold text-orange-600' }, profile.goals.calories || '--'),
                        React.createElement('div', { className: 'text-sm text-gray-600' }, 'Calories')
                    ),
                    React.createElement('div', null,
                        React.createElement('div', { className: 'text-2xl font-bold text-red-500' }, `${profile.goals.protein || '--'}g`),
                        React.createElement('div', { className: 'text-sm text-gray-600' }, 'Protein')
                    ),
                    React.createElement('div', null,
                        React.createElement('div', { className: 'text-2xl font-bold text-green-500' }, `${profile.goals.carbs || '--'}g`),
                        React.createElement('div', { className: 'text-sm text-gray-600' }, 'Carbs')
                    ),
                    React.createElement('div', null,
                        React.createElement('div', { className: 'text-2xl font-bold text-yellow-500' }, `${profile.goals.fat || '--'}g`),
                        React.createElement('div', { className: 'text-sm text-gray-600' }, 'Fat')
                    )
                ),
                
                // Goal Timeline
                timeline && React.createElement('div', { className: 'pt-4 border-t border-orange-200' },
                    React.createElement('div', { className: 'text-center' },
                        React.createElement('h5', { className: 'font-bold text-orange-800 mb-2' }, '🎯 Your Goal Timeline'),
                        React.createElement('p', { className: 'text-sm text-orange-700 mb-1' },
                            `${timeline.isGainGoal ? 'Gain' : 'Lose'} ${timeline.weightToChange.toFixed(1)} lbs in ${timeline.weeksToGoal} weeks`
                        ),
                        React.createElement('p', { className: 'text-sm text-orange-600 mb-2' },
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

    // Enhanced Advanced Settings Component with Foods I Avoid
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

        const foodsILoveOptions = [
            'Chicken', 'Salmon', 'Beef', 'Pork', 'Eggs', 'Tofu', 'Beans', 'Lentils',
            'Rice', 'Pasta', 'Quinoa', 'Bread', 'Oats', 'Potatoes', 'Sweet Potatoes',
            'Broccoli', 'Spinach', 'Tomatoes', 'Peppers', 'Mushrooms', 'Avocado',
            'Berries', 'Bananas', 'Apples', 'Cheese', 'Yogurt', 'Nuts', 'Seeds'
        ];

        const foodsIAvoidOptions = [
            'Liver', 'Sardines', 'Anchovies', 'Brussels Sprouts', 'Cauliflower', 'Kale',
            'Cottage Cheese', 'Blue Cheese', 'Spicy Foods', 'Very Sweet Foods',
            'Fried Foods', 'Processed Meats', 'Soda', 'Energy Drinks', 'Artificial Sweeteners',
            'Gluten', 'Dairy', 'Red Meat', 'Shellfish', 'Coconut', 'Cilantro', 'Olives'
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
                    'Advanced Settings'
                ),
                React.createElement('span', { className: `text-2xl transition-transform ${isVisible ? 'rotate-180' : ''}` }, '▼')
            ),
            
            isVisible && React.createElement('div', { className: 'px-6 pb-6 space-y-6' },
                // Dietary Restrictions
                React.createElement('div', null,
                    React.createElement('h4', { className: 'text-lg font-bold text-gray-800 mb-3' }, 'Dietary Preferences'),
                    React.createElement('div', { className: 'grid grid-cols-2 md:grid-cols-4 gap-2' },
                        dietaryOptions.map(option => 
                            React.createElement('button', {
                                key: option,
                                onClick: () => handleArrayChange('dietary', 'restrictions', option),
                                className: `p-2 rounded-lg border text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                                    profile.dietary.restrictions.includes(option)
                                        ? 'border-orange-500 bg-orange-50 text-orange-700'
                                        : 'border-gray-200 bg-white text-gray-600 hover:border-orange-300'
                                }`
                            }, option)
                        )
                    )
                ),

                // Allergies
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

                // Foods I Love
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

                // Foods I Avoid - NEW SECTION
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
                )
            )
        );
    };

    // Weight History Component (unchanged)
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
                            isLatest ? 'bg-orange-50 border border-orange-200' : 'bg-gray-50'
                        }`
                    },
                        React.createElement('div', null,
                            React.createElement('div', { className: `font-semibold ${isLatest ? 'text-orange-800' : 'text-gray-800'}` }, 
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
                        isLatest && React.createElement('span', { className: 'text-sm font-semibold text-orange-600' }, 'Latest')
                    );
                })
            )
        );
    };

    // Personalized Analysis Component
    const PersonalizedAnalysis = ({ profile, onComplete }) => {
        const [isGenerating, setIsGenerating] = React.useState(false);
        // Initialize showAnalysis based on whether plan was already generated
        const [showAnalysis, setShowAnalysis] = React.useState(profile.planGenerated || false);

        // Update showAnalysis when profile.planGenerated changes
        React.useEffect(() => {
            setShowAnalysis(profile.planGenerated || false);
        }, [profile.planGenerated]);

        const generatePersonalizedPlan = async () => {
            setIsGenerating(true);
            
            // Simulate AI analysis (you can replace with real AI later)
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
            const foodsLoved = profile.preferences.foodsILove;
            const foodsAvoided = profile.preferences.foodsIAvoid;

            const insights = [];

            // Goal-specific insights
            if (primaryGoal === 'fat_loss') {
                insights.push(`${name}, your fat loss plan combines a ${profile.goals.calories}-calorie target with ${profile.goals.protein}g protein to preserve muscle while burning fat.`);
            } else if (primaryGoal === 'muscle_gain') {
                insights.push(`${name}, your muscle building strategy focuses on ${profile.goals.protein}g daily protein and a ${profile.goals.calories}-calorie surplus to fuel growth.`);
            }

            // Activity-specific insights
            if (activityLevel === 'very_active') {
                insights.push("Your high activity level means we've increased your carb intake to fuel those intense training sessions.");
            } else if (activityLevel === 'sedentary') {
                insights.push("We've optimized your macros for a desk-based lifestyle while keeping you energized throughout the day.");
            }

            // Dietary preference insights
            if (restrictions.includes('Vegetarian') || restrictions.includes('Vegan')) {
                insights.push("Your plant-based approach is built into every recommendation - we'll focus on complete proteins and B12-rich foods.");
            }
            if (restrictions.includes('Keto')) {
                insights.push("Your ketogenic targets emphasize healthy fats while keeping carbs minimal for optimal ketosis.");
            }

            // Food preference insights
            if (foodsLoved.length > 0) {
                const favorites = foodsLoved.slice(0, 3).join(', ');
                insights.push(`We've noted your love for ${favorites} - expect meal suggestions featuring these favorites!`);
            }
            if (foodsAvoided.length > 0) {
                const avoided = foodsAvoided.slice(0, 2).join(' and ');
                insights.push(`Don't worry - you'll never see ${avoided} in your recommendations. Your preferences are respected.`);
            }

            // Allergy safety
            if (allergies.length > 0) {
                insights.push(`Your ${allergies.join(', ')} allergies are programmed into our safety filters - every suggestion is automatically screened.`);
            }

            return insights;
        };

        const isProfileComplete = () => {
            return profile.personal.name && 
                   profile.personal.birthday && 
                   profile.personal.height && 
                   profile.current.weight &&
                   profile.goals.targetWeight;
        };

        if (!isProfileComplete()) {
            return React.createElement('div', { className: 'bg-gradient-to-r from-orange-100 to-red-100 rounded-3xl p-6 mb-6 border-l-4 border-orange-500' },
                React.createElement('h4', { className: 'text-lg font-bold text-orange-800 mb-2' }, '✨ Almost Ready!'),
                React.createElement('p', { className: 'text-orange-700' }, 
                    'Complete your basic info and goals above to generate your personalized nutrition plan.'
                )
            );
        }

        if (showAnalysis) {
            const insights = getPersonalizedInsights();
            
            return React.createElement('div', { className: 'bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-6 mb-6' },
                React.createElement('h3', { className: 'text-xl font-bold text-gray-800 mb-4 flex items-center' },
                    React.createElement('span', { className: 'text-2xl mr-3' }, '🎯'),
                    `${profile.personal.name}'s Personalized Plan`
                ),
                
                React.createElement('div', { className: 'bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 mb-4 border border-green-200' },
                    React.createElement('div', { className: 'flex items-center mb-3' },
                        React.createElement('span', { className: 'text-2xl mr-3' }, '✅'),
                        React.createElement('h4', { className: 'text-lg font-bold text-green-800' }, 'Plan Generated Successfully!')
                    ),
                    React.createElement('p', { className: 'text-green-700 font-medium' }, 
                        `Welcome to FuelIQ, ${profile.personal.name}! Your completely customized nutrition experience is ready.`
                    )
                ),

                React.createElement('div', { className: 'space-y-4 mb-6' },
                    ...insights.map((insight, index) => 
                        React.createElement('div', { 
                            key: index,
                            className: 'flex items-start space-x-3 p-3 bg-gray-50 rounded-lg'
                        },
                            React.createElement('span', { className: 'text-orange-500 font-bold mt-1' }, '•'),
                            React.createElement('p', { className: 'text-gray-700 text-sm leading-relaxed' }, insight)
                        )
                    )
                ),

                React.createElement('div', { className: 'bg-gradient-to-r from-orange-500 to-red-600 rounded-lg p-4 text-white' },
                    React.createElement('h4', { className: 'font-bold mb-2' }, '🚀 What Happens Next?'),
                    React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-3 gap-4 text-sm' },
                        React.createElement('div', { className: 'flex items-center space-x-2' },
                            React.createElement('span', { className: 'text-lg' }, '🍽️'),
                            React.createElement('span', null, 'Meal suggestions tailored to your tastes')
                        ),
                        React.createElement('div', { className: 'flex items-center space-x-2' },
                            React.createElement('span', { className: 'text-lg' }, '📊'),
                            React.createElement('span', null, 'Progress tracking aligned with your goals')
                        ),
                        React.createElement('div', { className: 'flex items-center space-x-2' },
                            React.createElement('span', { className: 'text-lg' }, '🔄'),
                            React.createElement('span', null, 'Automatic adjustments as you progress')
                        )
                    )
                ),

                React.createElement('div', { className: 'flex gap-3 mt-6' },
                    React.createElement('button', {
                        onClick: () => {
                            // Use your app's direct navigation method
                            if (window.setCurrentView) {
                                window.setCurrentView('meals');
                            } else if (window.dispatchEvent) {
                                window.dispatchEvent(new CustomEvent('navigateToTab', { detail: 'meals' }));
                            }
                        },
                        className: 'flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white rounded-lg font-semibold shadow-lg transform hover:scale-105 transition-all duration-200'
                    }, '🍽️ Start Tracking Meals'),
                    React.createElement('button', {
                        onClick: () => {
                            // Use your app's direct navigation method
                            if (window.setCurrentView) {
                                window.setCurrentView('dashboard');
                            } else if (window.dispatchEvent) {
                                window.dispatchEvent(new CustomEvent('navigateToTab', { detail: 'dashboard' }));
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
            
            React.createElement('div', { className: 'bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4 mb-4 border border-orange-200' },
                React.createElement('p', { className: 'text-orange-800 font-medium mb-2' }, 
                    `Ready to create your custom nutrition experience, ${profile.personal.name}?`
                ),
                React.createElement('p', { className: 'text-orange-700 text-sm' }, 
                    'Based on your inputs, we\'ll generate personalized meal recommendations, macro targets, and progress tracking tailored specifically to you.'
                )
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
        const [isFirstTime, setIsFirstTime] = React.useState(!profile.personal.name);
        const [planGenerated, setPlanGenerated] = React.useState(profile.planGenerated || false);

        // Auto-save profile changes
        React.useEffect(() => {
            if (profile.personal.name) { // Only save if there's actual data
                const updatedProfile = {
                    ...profile,
                    goals: calculateGoals(profile)
                };
                setProfile(updatedProfile);
                saveProfileData(updatedProfile);
            }
        }, [profile.personal, profile.current, profile.goals.primaryGoal, profile.goals.targetWeight]);

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
            setPlanGenerated(true);
            // Save that plan has been generated
            const updatedProfile = {
                ...profile,
                planGenerated: true,
                planGeneratedDate: new Date().toISOString()
            };
            setProfile(updatedProfile);
            saveProfileData(updatedProfile);
        };

        return React.createElement('div', { className: 'min-h-screen bg-gradient-card' },
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

            // Advanced Settings (collapsible)
            React.createElement(AdvancedSettings, { 
                profile: profile, 
                onChange: setProfile,
                isVisible: showAdvanced,
                onToggle: () => setShowAdvanced(!showAdvanced)
            }),

            // Personalized Analysis & Plan Generation
            React.createElement(PersonalizedAnalysis, {
                profile: profile,
                onComplete: handlePlanGenerated
            }),

            // Weight History
            React.createElement(WeightHistory, { profile: profile })
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
        cleanup: () => {} // Add cleanup if needed
    };

    console.log('✅ FuelIQ Profile tab loaded - unified setup and journey functionality with FIXES');

})();
