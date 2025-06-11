// FuelIQ Weight Journey Module
// Add this to your existing FuelIQ app structure

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

const saveWeightData = (data) => {
    const key = 'fueliq_weight_journey';
    const dataStr = JSON.stringify(data);
    
    if (isLocalStorageAvailable()) {
        try {
            localStorage.setItem(key, dataStr);
        } catch (e) {
            console.warn('localStorage failed, using memory storage:', e);
            memoryStorage[key] = dataStr;
        }
    } else {
        memoryStorage[key] = dataStr;
    }
};

const loadWeightData = () => {
    const key = 'fueliq_weight_journey';
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
    
    return data ? JSON.parse(data) : {
        entries: [],
        startWeight: null,
        targetWeight: null,
        targetDate: null,
        startDate: null
    };
};

// Helper Functions
const formatDate = (date) => {
    return date.toISOString().split('T')[0];
};

const calculateBMI = (weightLbs, heightInches) => {
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

const calculateProgress = (startWeight, currentWeight, targetWeight) => {
    if (!startWeight || !currentWeight || !targetWeight) return 0;
    const totalLoss = startWeight - targetWeight;
    const currentLoss = startWeight - currentWeight;
    return totalLoss !== 0 ? (currentLoss / totalLoss) * 100 : 0;
};

const getDaysRemaining = (targetDate) => {
    if (!targetDate) return null;
    const today = new Date();
    const target = new Date(targetDate);
    const diffTime = target - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const getWeeklyLossRate = (startWeight, currentWeight, daysPassed) => {
    if (!startWeight || !currentWeight || daysPassed <= 0) return 0;
    const totalLoss = startWeight - currentWeight;
    const weeksPassded = daysPassed / 7;
    return totalLoss / weeksPassded;
};

// Weight Entry Component
const WeightEntryForm = ({ onAddEntry, latestWeight }) => {
    const [weight, setWeight] = React.useState('');
    const [date, setDate] = React.useState(formatDate(new Date()));

    const handleSubmit = (e) => {
        e.preventDefault();
        if (weight && date) {
            onAddEntry({
                weight: parseFloat(weight),
                date: date,
                timestamp: new Date(date).getTime()
            });
            setWeight('');
            setDate(formatDate(new Date()));
        }
    };

    return React.createElement('div', { className: 'bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow' },
        React.createElement('h3', { className: 'text-xl font-bold text-gray-800 mb-4 flex items-center' },
            React.createElement('span', { className: 'text-2xl mr-3' }, '⚖️'),
            'Log Your Weight'
        ),
        React.createElement('form', { onSubmit: handleSubmit, className: 'space-y-4' },
            React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-4' },
                React.createElement('div', null,
                    React.createElement('label', { className: 'block text-sm font-semibold text-gray-700 mb-2' }, 'Weight (lbs)'),
                    React.createElement('input', {
                        type: 'number',
                        value: weight,
                        onChange: (e) => setWeight(e.target.value),
                        step: '0.1',
                        min: '50',
                        max: '500',
                        placeholder: latestWeight ? `Last: ${latestWeight} lbs` : 'Enter weight',
                        className: 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20',
                        required: true
                    })
                ),
                React.createElement('div', null,
                    React.createElement('label', { className: 'block text-sm font-semibold text-gray-700 mb-2' }, 'Date'),
                    React.createElement('input', {
                        type: 'date',
                        value: date,
                        onChange: (e) => setDate(e.target.value),
                        max: formatDate(new Date()),
                        className: 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20',
                        required: true
                    })
                )
            ),
            React.createElement('button', {
                type: 'submit',
                className: 'w-full bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200'
            }, 'Add Weight Entry')
        )
    );
};

// Goal Setting Component
const GoalSetting = ({ weightData, onUpdateGoal, userProfile }) => {
    const [targetWeight, setTargetWeight] = React.useState(weightData.targetWeight || '');
    const [targetDate, setTargetDate] = React.useState(weightData.targetDate || '');
    const [showForm, setShowForm] = React.useState(!weightData.targetWeight);

    const currentWeight = weightData.entries.length > 0 ? 
        weightData.entries[weightData.entries.length - 1].weight : null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (targetWeight && targetDate && currentWeight) {
            const target = parseFloat(targetWeight);
            const targetDateObj = new Date(targetDate);
            const today = new Date();
            const daysToGoal = Math.ceil((targetDateObj - today) / (1000 * 60 * 60 * 24));
            const weightToLose = currentWeight - target;
            const weeklyRate = (weightToLose / daysToGoal) * 7;

            // Validate safe weight loss rate (max 2 lbs/week)
            if (weightToLose > 0 && weeklyRate > 2.5) {
                alert('This goal requires losing more than 2.5 lbs per week, which may not be safe. Please choose a more realistic timeline.');
                return;
            }

            if (weightToLose < 0 && weeklyRate < -1) {
                alert('This goal requires gaining more than 1 lb per week. Please choose a more realistic timeline.');
                return;
            }

            onUpdateGoal({
                targetWeight: target,
                targetDate: targetDate,
                startWeight: weightData.startWeight || currentWeight,
                startDate: weightData.startDate || formatDate(new Date())
            });
            setShowForm(false);
        }
    };

    const minDate = new Date();
    minDate.setDate(minDate.getDate() + 7); // At least 1 week from now
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 2); // Max 2 years

    if (!showForm && weightData.targetWeight) {
        const progress = calculateProgress(weightData.startWeight, currentWeight, weightData.targetWeight);
        const daysRemaining = getDaysRemaining(weightData.targetDate);
        const isGainGoal = weightData.targetWeight > weightData.startWeight;

        return React.createElement('div', { className: 'bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow' },
            React.createElement('div', { className: 'flex justify-between items-center mb-4' },
                React.createElement('h3', { className: 'text-xl font-bold text-gray-800 flex items-center' },
                    React.createElement('span', { className: 'text-2xl mr-3' }, '🎯'),
                    'Your Goal'
                ),
                React.createElement('button', {
                    onClick: () => setShowForm(true),
                    className: 'text-orange-600 hover:text-orange-700 font-semibold'
                }, 'Edit Goal')
            ),
            React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-3 gap-4 mb-6' },
                React.createElement('div', { className: 'text-center p-4 bg-orange-50 rounded-lg' },
                    React.createElement('div', { className: 'text-2xl font-bold text-orange-600' }, 
                        `${Math.abs(weightData.startWeight - weightData.targetWeight).toFixed(1)} lbs`
                    ),
                    React.createElement('div', { className: 'text-sm text-gray-600' }, 
                        `To ${isGainGoal ? 'Gain' : 'Lose'}`
                    )
                ),
                React.createElement('div', { className: 'text-center p-4 bg-blue-50 rounded-lg' },
                    React.createElement('div', { className: 'text-2xl font-bold text-blue-600' }, 
                        `${weightData.targetWeight} lbs`
                    ),
                    React.createElement('div', { className: 'text-sm text-gray-600' }, 'Target Weight')
                ),
                React.createElement('div', { className: 'text-center p-4 bg-green-50 rounded-lg' },
                    React.createElement('div', { className: 'text-2xl font-bold text-green-600' }, 
                        daysRemaining > 0 ? `${daysRemaining} days` : 'Goal Reached!'
                    ),
                    React.createElement('div', { className: 'text-sm text-gray-600' }, 'Remaining')
                )
            ),
            React.createElement('div', { className: 'mb-4' },
                React.createElement('div', { className: 'flex justify-between items-center mb-2' },
                    React.createElement('span', { className: 'font-semibold text-gray-700' }, 'Progress'),
                    React.createElement('span', { className: 'text-sm text-gray-600' }, `${Math.max(0, progress).toFixed(1)}%`)
                ),
                React.createElement('div', { className: 'w-full bg-gray-200 rounded-full h-3' },
                    React.createElement('div', { 
                        className: 'h-3 rounded-full bg-orange-500 transition-all duration-500',
                        style: { width: `${Math.min(Math.max(progress, 0), 100)}%` }
                    })
                )
            )
        );
    }

    return React.createElement('div', { className: 'bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow' },
        React.createElement('h3', { className: 'text-xl font-bold text-gray-800 mb-4 flex items-center' },
            React.createElement('span', { className: 'text-2xl mr-3' }, '🎯'),
            'Set Your Goal'
        ),
        React.createElement('form', { onSubmit: handleSubmit, className: 'space-y-4' },
            React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-4' },
                React.createElement('div', null,
                    React.createElement('label', { className: 'block text-sm font-semibold text-gray-700 mb-2' }, 'Target Weight (lbs)'),
                    React.createElement('input', {
                        type: 'number',
                        value: targetWeight,
                        onChange: (e) => setTargetWeight(e.target.value),
                        step: '0.1',
                        min: '50',
                        max: '500',
                        placeholder: currentWeight ? `Current: ${currentWeight} lbs` : 'Enter target',
                        className: 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20',
                        required: true
                    })
                ),
                React.createElement('div', null,
                    React.createElement('label', { className: 'block text-sm font-semibold text-gray-700 mb-2' }, 'Target Date'),
                    React.createElement('input', {
                        type: 'date',
                        value: targetDate,
                        onChange: (e) => setTargetDate(e.target.value),
                        min: formatDate(minDate),
                        max: formatDate(maxDate),
                        className: 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20',
                        required: true
                    })
                )
            ),
            React.createElement('button', {
                type: 'submit',
                className: 'w-full bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200'
            }, 'Set Goal'),
            weightData.targetWeight && React.createElement('button', {
                type: 'button',
                onClick: () => setShowForm(false),
                className: 'w-full mt-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50'
            }, 'Cancel')
        )
    );
};

// Stats Summary Component
const StatsSummary = ({ entries, targetWeight, startWeight, userProfile }) => {
    if (entries.length === 0) return null;

    const latestEntry = entries[entries.length - 1];
    const currentWeight = latestEntry.weight;
    const bmi = userProfile.height ? calculateBMI(currentWeight, userProfile.height) : null;
    const bmiInfo = bmi ? getBMICategory(bmi) : null;

    // Calculate weight change from start
    const weightChange = startWeight ? currentWeight - startWeight : 0;
    const isGaining = weightChange > 0;

    // Calculate weekly rate if we have multiple entries
    let weeklyRate = 0;
    if (entries.length > 1 && startWeight) {
        const firstEntry = entries[0];
        const daysPassed = (latestEntry.timestamp - firstEntry.timestamp) / (1000 * 60 * 60 * 24);
        weeklyRate = getWeeklyLossRate(startWeight, currentWeight, daysPassed);
    }

    return React.createElement('div', { className: 'bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow' },
        React.createElement('h3', { className: 'text-xl font-bold text-gray-800 mb-4 flex items-center' },
            React.createElement('span', { className: 'text-2xl mr-3' }, '📊'),
            'Current Stats'
        ),
        React.createElement('div', { className: 'grid grid-cols-2 md:grid-cols-4 gap-4' },
            React.createElement('div', { className: 'text-center p-4 bg-blue-50 rounded-lg' },
                React.createElement('div', { className: 'text-2xl font-bold text-blue-600' }, `${currentWeight} lbs`),
                React.createElement('div', { className: 'text-sm text-gray-600' }, 'Current Weight')
            ),
            bmi && React.createElement('div', { className: 'text-center p-4 bg-purple-50 rounded-lg' },
                React.createElement('div', { className: 'text-2xl font-bold text-purple-600' }, bmi.toFixed(1)),
                React.createElement('div', { className: `text-sm ${bmiInfo.color}` }, bmiInfo.category),
                React.createElement('div', { className: 'text-xs text-gray-500' }, 'BMI')
            ),
            startWeight && React.createElement('div', { className: `text-center p-4 rounded-lg ${isGaining ? 'bg-orange-50' : 'bg-green-50'}` },
                React.createElement('div', { className: `text-2xl font-bold ${isGaining ? 'text-orange-600' : 'text-green-600'}` }, 
                    `${isGaining ? '+' : ''}${weightChange.toFixed(1)} lbs`
                ),
                React.createElement('div', { className: 'text-sm text-gray-600' }, 'Total Change')
            ),
            weeklyRate !== 0 && React.createElement('div', { className: 'text-center p-4 bg-gray-50 rounded-lg' },
                React.createElement('div', { className: 'text-2xl font-bold text-gray-600' }, `${Math.abs(weeklyRate).toFixed(1)}`),
                React.createElement('div', { className: 'text-sm text-gray-600' }, `lbs/week ${weeklyRate > 0 ? 'loss' : 'gain'}`)
            )
        )
    );
};

// Recent Entries Component
const RecentEntries = ({ entries, onDeleteEntry }) => {
    const sortedEntries = [...entries].sort((a, b) => b.timestamp - a.timestamp).slice(0, 5);

    return React.createElement('div', { className: 'bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow' },
        React.createElement('h3', { className: 'text-xl font-bold text-gray-800 mb-4 flex items-center' },
            React.createElement('span', { className: 'text-2xl mr-3' }, '📝'),
            'Recent Entries'
        ),
        sortedEntries.length === 0 ? 
            React.createElement('div', { className: 'text-center py-8 text-gray-400' },
                React.createElement('p', null, 'No weight entries yet'),
                React.createElement('p', { className: 'text-sm' }, 'Add your first weight entry above')
            ) :
            React.createElement('div', { className: 'space-y-3' },
                ...sortedEntries.map((entry, index) => {
                    const date = new Date(entry.timestamp);
                    const isLatest = index === 0;
                    return React.createElement('div', { 
                        key: entry.timestamp,
                        className: `flex justify-between items-center p-3 rounded-lg ${isLatest ? 'bg-orange-50 border border-orange-200' : 'bg-gray-50'}`
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
                        React.createElement('button', {
                            onClick: () => onDeleteEntry(entry.timestamp),
                            className: 'text-red-500 hover:text-red-700 text-sm'
                        }, '×')
                    );
                })
            )
    );
};

// Simple Progress Chart Component (without Chart.js for now)
const SimpleProgressChart = ({ entries }) => {
    if (entries.length < 2) {
        return React.createElement('div', { className: 'bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow' },
            React.createElement('h3', { className: 'text-xl font-bold text-gray-800 mb-4 flex items-center' },
                React.createElement('span', { className: 'text-2xl mr-3' }, '📈'),
                'Progress Chart'
            ),
            React.createElement('div', { className: 'text-center py-12' },
                React.createElement('div', { className: 'text-6xl mb-4' }, '📊'),
                React.createElement('h4', { className: 'text-xl font-semibold text-gray-600 mb-2' }, 'Chart Coming Soon!'),
                React.createElement('p', { className: 'text-gray-500' }, 'Add at least 2 weight entries to see your progress trend.')
            )
        );
    }

    const sortedEntries = [...entries].sort((a, b) => a.timestamp - b.timestamp);
    const weights = sortedEntries.map(entry => entry.weight);
    const minWeight = Math.min(...weights);
    const maxWeight = Math.max(...weights);
    const range = maxWeight - minWeight || 1;

    return React.createElement('div', { className: 'bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow' },
        React.createElement('h3', { className: 'text-xl font-bold text-gray-800 mb-4 flex items-center' },
            React.createElement('span', { className: 'text-2xl mr-3' }, '📈'),
            'Progress Trend'
        ),
        React.createElement('div', { className: 'space-y-3' },
            ...sortedEntries.map((entry, index) => {
                const date = new Date(entry.timestamp);
                const heightPercent = ((entry.weight - minWeight) / range) * 100;
                const prevWeight = index > 0 ? sortedEntries[index - 1].weight : entry.weight;
                const change = entry.weight - prevWeight;
                const isIncrease = change > 0;
                
                return React.createElement('div', { key: entry.timestamp, className: 'flex items-center gap-4' },
                    React.createElement('div', { className: 'w-24 text-sm text-gray-600' },
                        date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                    ),
                    React.createElement('div', { className: 'flex-1 flex items-center gap-2' },
                        React.createElement('div', { className: 'flex-1 bg-gray-200 rounded-full h-3 relative' },
                            React.createElement('div', {
                                className: 'absolute left-0 top-0 h-3 bg-orange-500 rounded-full transition-all duration-500',
                                style: { width: `${heightPercent}%` }
                            })
                        ),
                        React.createElement('div', { className: 'w-16 text-sm font-semibold text-gray-800' }, 
                            `${entry.weight} lbs`
                        ),
                        index > 0 && React.createElement('div', { 
                            className: `w-16 text-xs ${isIncrease ? 'text-orange-600' : 'text-green-600'}` 
                        }, 
                            `${isIncrease ? '+' : ''}${change.toFixed(1)}`
                        )
                    )
                );
            })
        )
    );
};

// Main Weight Journey Component
const WeightJourney = () => {
    const [weightData, setWeightData] = React.useState(loadWeightData());
    
    // Load user profile for height/BMI calculations
    const userProfile = React.useMemo(() => {
        try {
            return JSON.parse(localStorage.getItem('fueliq_user_profile') || '{}');
        } catch (e) {
            return {};
        }
    }, []);

    React.useEffect(() => {
        saveWeightData(weightData);
    }, [weightData]);

    const addWeightEntry = (entry) => {
        setWeightData(prev => ({
            ...prev,
            entries: [...prev.entries, entry],
            startWeight: prev.startWeight || entry.weight,
            startDate: prev.startDate || entry.date
        }));
    };

    const updateGoal = (goalData) => {
        setWeightData(prev => ({
            ...prev,
            ...goalData
        }));
    };

    const deleteEntry = (timestamp) => {
        setWeightData(prev => ({
            ...prev,
            entries: prev.entries.filter(entry => entry.timestamp !== timestamp)
        }));
    };

    const latestWeight = weightData.entries.length > 0 ? 
        weightData.entries[weightData.entries.length - 1].weight : null;

    return React.createElement('div', { className: 'max-w-7xl mx-auto p-6' },
        // Header
        React.createElement('div', { className: 'bg-orange-500 rounded-xl p-6 mb-6 text-white' },
            React.createElement('h1', { className: 'text-3xl font-bold mb-2' }, 'Weight Journey'),
            React.createElement('p', { className: 'text-lg opacity-90' }, 'Track your progress toward your ideal weight')
        ),

        // Main Grid
        React.createElement('div', { className: 'grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6' },
            React.createElement(WeightEntryForm, { 
                onAddEntry: addWeightEntry, 
                latestWeight: latestWeight 
            }),
            React.createElement(GoalSetting, { 
                weightData: weightData, 
                onUpdateGoal: updateGoal,
                userProfile: userProfile
            })
        ),

        // Stats
        weightData.entries.length > 0 && React.createElement('div', { className: 'mb-6' },
            React.createElement(StatsSummary, { 
                entries: weightData.entries, 
                targetWeight: weightData.targetWeight,
                startWeight: weightData.startWeight,
                userProfile: userProfile
            })
        ),

        // Chart and Recent Entries
        React.createElement('div', { className: 'grid grid-cols-1 lg:grid-cols-2 gap-6' },
            React.createElement(SimpleProgressChart, { 
                entries: weightData.entries
            }),
            React.createElement(RecentEntries, { 
                entries: weightData.entries, 
                onDeleteEntry: deleteEntry
            })
        )
    );
};

// Export for integration with your existing app
const renderWeightJourney = (containerId) => {
    ReactDOM.render(React.createElement(WeightJourney), document.getElementById(containerId));
};

// Make available globally
window.FuelIQWeightJourney = {
    WeightJourney,
    renderWeightJourney
};
