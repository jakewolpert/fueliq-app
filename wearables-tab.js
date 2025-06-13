// FuelIQ Wearables Integration Module
// Save this as: wearables-tab.js

(function() {
    // Prevent multiple loading
    if (window.FuelIQWearables) {
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

    const saveWearableData = (data) => {
        const key = 'fueliq_wearables';
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

    const loadWearableData = () => {
        const key = 'fueliq_wearables';
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
            connectedDevices: [],
            healthData: {
                today: {},
                history: []
            },
            lastSync: null,
            settings: {
                autoSync: true,
                syncInterval: 300000, // 5 minutes
                adjustCaloriesForActivity: true
            }
        };
    };

    // Device Integration APIs
    const DeviceAPIs = {
        garmin: {
            name: 'Garmin Connect IQ',
            icon: '⌚',
            color: 'blue',
            scopes: ['activities', 'sleep', 'dailies'],
            connect: async () => {
                // In a real implementation, this would use Garmin Connect IQ SDK
                // For demo, we'll simulate the connection
                return new Promise((resolve) => {
                    setTimeout(() => {
                        resolve({
                            deviceId: 'garmin_' + Date.now(),
                            deviceName: 'Garmin Forerunner',
                            connected: true,
                            lastSync: new Date().toISOString()
                        });
                    }, 2000);
                });
            },
            fetchData: async () => {
                // Simulate Garmin data fetch
                return {
                    steps: Math.floor(Math.random() * 5000) + 8000,
                    calories: Math.floor(Math.random() * 500) + 400,
                    distance: parseFloat((Math.random() * 3 + 2).toFixed(2)),
                    activeMinutes: Math.floor(Math.random() * 60) + 30,
                    heartRate: {
                        resting: Math.floor(Math.random() * 15) + 55,
                        max: Math.floor(Math.random() * 30) + 180,
                        current: Math.floor(Math.random() * 40) + 80
                    },
                    sleep: {
                        totalSleep: Math.floor(Math.random() * 120) + 420, // minutes
                        deepSleep: Math.floor(Math.random() * 60) + 90,
                        lightSleep: Math.floor(Math.random() * 180) + 240,
                        awake: Math.floor(Math.random() * 30) + 10,
                        sleepScore: Math.floor(Math.random() * 30) + 70
                    },
                    workouts: [
                        {
                            type: 'Running',
                            duration: 35,
                            calories: 350,
                            timestamp: new Date().toISOString()
                        }
                    ]
                };
            }
        },
        apple: {
            name: 'Apple Health',
            icon: '🍎',
            color: 'gray',
            scopes: ['steps', 'heart_rate', 'sleep', 'workouts'],
            connect: async () => {
                // Simulate Apple Health connection
                return new Promise((resolve) => {
                    setTimeout(() => {
                        resolve({
                            deviceId: 'apple_' + Date.now(),
                            deviceName: 'Apple Watch',
                            connected: true,
                            lastSync: new Date().toISOString()
                        });
                    }, 1500);
                });
            },
            fetchData: async () => {
                return {
                    steps: Math.floor(Math.random() * 4000) + 9000,
                    calories: Math.floor(Math.random() * 400) + 450,
                    distance: parseFloat((Math.random() * 4 + 3).toFixed(2)),
                    activeMinutes: Math.floor(Math.random() * 50) + 40,
                    heartRate: {
                        resting: Math.floor(Math.random() * 12) + 58,
                        max: Math.floor(Math.random() * 25) + 185,
                        current: Math.floor(Math.random() * 35) + 85
                    },
                    sleep: {
                        totalSleep: Math.floor(Math.random() * 100) + 440,
                        deepSleep: Math.floor(Math.random() * 50) + 100,
                        lightSleep: Math.floor(Math.random() * 160) + 260,
                        awake: Math.floor(Math.random() * 25) + 15,
                        sleepScore: Math.floor(Math.random() * 25) + 75
                    }
                };
            }
        },
        fitbit: {
            name: 'Fitbit',
            icon: '💚',
            color: 'green',
            scopes: ['activity', 'heartrate', 'sleep'],
            connect: async () => {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        resolve({
                            deviceId: 'fitbit_' + Date.now(),
                            deviceName: 'Fitbit Versa',
                            connected: true,
                            lastSync: new Date().toISOString()
                        });
                    }, 1800);
                });
            },
            fetchData: async () => {
                return {
                    steps: Math.floor(Math.random() * 3500) + 10000,
                    calories: Math.floor(Math.random() * 300) + 500,
                    distance: parseFloat((Math.random() * 2.5 + 3.5).toFixed(2)),
                    activeMinutes: Math.floor(Math.random() * 45) + 35,
                    heartRate: {
                        resting: Math.floor(Math.random() * 10) + 60,
                        max: Math.floor(Math.random() * 20) + 190,
                        current: Math.floor(Math.random() * 30) + 90
                    },
                    sleep: {
                        totalSleep: Math.floor(Math.random() * 90) + 450,
                        deepSleep: Math.floor(Math.random() * 40) + 110,
                        lightSleep: Math.floor(Math.random() * 150) + 270,
                        awake: Math.floor(Math.random() * 20) + 20,
                        sleepScore: Math.floor(Math.random() * 20) + 80
                    }
                };
            }
        }
    };

    // Data Processing Functions
    const calculateAdjustedCalories = (baseCalories, activityData) => {
        if (!activityData) return baseCalories;
        
        // Adjust based on activity level
        const stepMultiplier = Math.max(0, (activityData.steps - 8000) / 2000) * 50;
        const exerciseCalories = activityData.calories || 0;
        
        return Math.round(baseCalories + stepMultiplier + (exerciseCalories * 0.5));
    };

    const getActivityLevel = (steps) => {
        if (steps < 5000) return { level: 'Sedentary', color: 'red', emoji: '😴' };
        if (steps < 8000) return { level: 'Lightly Active', color: 'yellow', emoji: '🚶' };
        if (steps < 12000) return { level: 'Moderately Active', color: 'green', emoji: '🏃' };
        return { level: 'Very Active', color: 'blue', emoji: '💪' };
    };

    const getSleepQuality = (sleepScore) => {
        if (sleepScore >= 85) return { quality: 'Excellent', color: 'green', emoji: '😴' };
        if (sleepScore >= 70) return { quality: 'Good', color: 'blue', emoji: '😊' };
        if (sleepScore >= 55) return { quality: 'Fair', color: 'yellow', emoji: '😐' };
        return { quality: 'Poor', color: 'red', emoji: '😵' };
    };

    // Device Connection Modal
    const DeviceConnectionModal = ({ onConnect, onClose }) => {
        const [connecting, setConnecting] = React.useState(null);

        const handleConnect = async (deviceType) => {
            setConnecting(deviceType);
            try {
                const device = await DeviceAPIs[deviceType].connect();
                onConnect(deviceType, device);
            } catch (error) {
                console.error('Connection failed:', error);
                alert('Connection failed. Please try again.');
            } finally {
                setConnecting(null);
            }
        };

        return React.createElement('div', { 
            className: 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50' 
        },
            React.createElement('div', { 
                className: 'bg-white rounded-xl p-6 w-full max-w-lg' 
            },
                React.createElement('div', { className: 'flex justify-between items-center mb-6' },
                    React.createElement('h3', { className: 'text-xl font-bold text-gray-800' }, 'Connect Your Device'),
                    React.createElement('button', { 
                        onClick: onClose,
                        className: 'text-gray-500 hover:text-gray-700 text-xl font-bold' 
                    }, '×')
                ),

                React.createElement('div', { className: 'space-y-4' },
                    ...Object.entries(DeviceAPIs).map(([key, api]) =>
                        React.createElement('button', {
                            key: key,
                            onClick: () => handleConnect(key),
                            disabled: connecting === key,
                            className: `w-full p-4 border-2 border-gray-200 rounded-lg hover:border-${api.color}-300 hover:bg-${api.color}-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed`
                        },
                            React.createElement('div', { className: 'flex items-center gap-4' },
                                React.createElement('span', { className: 'text-3xl' }, api.icon),
                                React.createElement('div', { className: 'text-left flex-1' },
                                    React.createElement('div', { className: 'font-semibold text-gray-800' }, api.name),
                                    React.createElement('div', { className: 'text-sm text-gray-600' }, 
                                        `Tracks: ${api.scopes.join(', ')}`
                                    )
                                ),
                                connecting === key ? 
                                    React.createElement('div', { className: 'animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500' }) :
                                    React.createElement('span', { className: 'text-gray-400' }, '→')
                            )
                        )
                    )
                ),

                React.createElement('div', { className: 'mt-6 p-4 bg-blue-50 rounded-lg' },
                    React.createElement('p', { className: 'text-blue-800 text-sm' },
                        '🔒 Your data stays private and secure. We only access the health metrics you choose to share.'
                    )
                )
            )
        );
    };

    // Health Metrics Dashboard
    const HealthMetricCard = ({ title, value, unit, goal, icon, color, trend }) => {
        const percentage = goal ? Math.min((value / goal) * 100, 100) : 0;
        
        return React.createElement('div', { className: 'bg-white rounded-xl p-6 shadow-lg border border-gray-200' },
            React.createElement('div', { className: 'flex items-center justify-between mb-4' },
                React.createElement('div', { className: 'flex items-center gap-3' },
                    React.createElement('span', { className: 'text-2xl' }, icon),
                    React.createElement('h3', { className: 'font-bold text-gray-800' }, title)
                ),
                trend && React.createElement('span', { 
                    className: `text-sm font-medium ${trend > 0 ? 'text-green-600' : 'text-red-600'}` 
                }, trend > 0 ? '↗️' : '↘️')
            ),
            
            React.createElement('div', { className: 'mb-4' },
                React.createElement('div', { className: 'flex items-baseline gap-2' },
                    React.createElement('span', { className: 'text-3xl font-bold text-gray-900' }, 
                        typeof value === 'number' ? value.toLocaleString() : value
                    ),
                    React.createElement('span', { className: 'text-lg text-gray-600' }, unit),
                    goal && React.createElement('span', { className: 'text-gray-400' }, 
                        `/ ${goal.toLocaleString()} ${unit}`
                    )
                )
            ),

            goal && React.createElement('div', { className: 'mb-2' },
                React.createElement('div', { className: 'w-full bg-gray-200 rounded-full h-3' },
                    React.createElement('div', {
                        className: `h-3 rounded-full bg-gradient-to-r from-${color}-400 to-${color}-600 transition-all duration-500`,
                        style: { width: `${percentage}%` }
                    })
                )
            ),

            goal && React.createElement('div', { className: 'text-sm text-gray-600' },
                `${Math.round(percentage)}% of daily goal`
            )
        );
    };

    // Sleep Analysis Component
    const SleepAnalysis = ({ sleepData }) => {
        if (!sleepData) return null;

        const totalHours = (sleepData.totalSleep / 60).toFixed(1);
        const sleepQuality = getSleepQuality(sleepData.sleepScore);

        return React.createElement('div', { className: 'bg-white rounded-xl p-6 shadow-lg border border-gray-200' },
            React.createElement('div', { className: 'flex items-center justify-between mb-6' },
                React.createElement('h3', { className: 'text-xl font-bold text-gray-800' }, '😴 Sleep Analysis'),
                React.createElement('div', { className: `px-3 py-1 rounded-full text-sm font-medium bg-${sleepQuality.color}-100 text-${sleepQuality.color}-700` },
                    `${sleepQuality.emoji} ${sleepQuality.quality}`
                )
            ),

            React.createElement('div', { className: 'grid grid-cols-2 md:grid-cols-4 gap-4 mb-6' },
                React.createElement('div', { className: 'text-center' },
                    React.createElement('div', { className: 'text-2xl font-bold text-blue-600' }, totalHours),
                    React.createElement('div', { className: 'text-sm text-gray-600' }, 'Total Hours')
                ),
                React.createElement('div', { className: 'text-center' },
                    React.createElement('div', { className: 'text-2xl font-bold text-purple-600' }, Math.round(sleepData.deepSleep / 60 * 10) / 10),
                    React.createElement('div', { className: 'text-sm text-gray-600' }, 'Deep Sleep')
                ),
                React.createElement('div', { className: 'text-center' },
                    React.createElement('div', { className: 'text-2xl font-bold text-green-600' }, Math.round(sleepData.lightSleep / 60 * 10) / 10),
                    React.createElement('div', { className: 'text-sm text-gray-600' }, 'Light Sleep')
                ),
                React.createElement('div', { className: 'text-center' },
                    React.createElement('div', { className: 'text-2xl font-bold text-gray-600' }, sleepData.sleepScore),
                    React.createElement('div', { className: 'text-sm text-gray-600' }, 'Sleep Score')
                )
            ),

            React.createElement('div', { className: 'space-y-3' },
                React.createElement('div', { className: 'flex justify-between items-center' },
                    React.createElement('span', { className: 'font-medium text-purple-600' }, 'Deep Sleep'),
                    React.createElement('div', { className: 'w-32 bg-gray-200 rounded-full h-2' },
                        React.createElement('div', { 
                            className: 'bg-purple-500 h-2 rounded-full',
                            style: { width: `${(sleepData.deepSleep / sleepData.totalSleep) * 100}%` }
                        })
                    )
                ),
                React.createElement('div', { className: 'flex justify-between items-center' },
                    React.createElement('span', { className: 'font-medium text-green-600' }, 'Light Sleep'),
                    React.createElement('div', { className: 'w-32 bg-gray-200 rounded-full h-2' },
                        React.createElement('div', { 
                            className: 'bg-green-500 h-2 rounded-full',
                            style: { width: `${(sleepData.lightSleep / sleepData.totalSleep) * 100}%` }
                        })
                    )
                ),
                React.createElement('div', { className: 'flex justify-between items-center' },
                    React.createElement('span', { className: 'font-medium text-red-600' }, 'Awake'),
                    React.createElement('div', { className: 'w-32 bg-gray-200 rounded-full h-2' },
                        React.createElement('div', { 
                            className: 'bg-red-500 h-2 rounded-full',
                            style: { width: `${(sleepData.awake / sleepData.totalSleep) * 100}%` }
                        })
                    )
                )
            )
        );
    };

    // Main Wearables Component
    const WearablesHub = () => {
        const [wearableData, setWearableData] = React.useState(loadWearableData());
        const [showConnectionModal, setShowConnectionModal] = React.useState(false);
        const [syncing, setSyncing] = React.useState(false);
        const [healthData, setHealthData] = React.useState(null);

        React.useEffect(() => {
            saveWearableData(wearableData);
        }, [wearableData]);

        React.useEffect(() => {
            if (wearableData.connectedDevices.length > 0) {
                syncData();
            }
        }, []);

        const connectDevice = (deviceType, deviceInfo) => {
            setWearableData(prev => ({
                ...prev,
                connectedDevices: [...prev.connectedDevices, { type: deviceType, ...deviceInfo }]
            }));
            setShowConnectionModal(false);
            syncData();
        };

        const syncData = async () => {
            if (wearableData.connectedDevices.length === 0) return;
            
            setSyncing(true);
            try {
                // Get data from the first connected device (in real app, you'd sync all)
                const primaryDevice = wearableData.connectedDevices[0];
                const data = await DeviceAPIs[primaryDevice.type].fetchData();
                
                setHealthData(data);
                setWearableData(prev => ({
                    ...prev,
                    healthData: {
                        today: data,
                        history: [...prev.healthData.history, { date: new Date().toISOString(), data }].slice(-30)
                    },
                    lastSync: new Date().toISOString()
                }));

                // Update calorie goals based on activity
                if (prev => prev.settings.adjustCaloriesForActivity) {
                    updateCalorieGoals(data);
                }
            } catch (error) {
                console.error('Sync failed:', error);
            } finally {
                setSyncing(false);
            }
        };

        const updateCalorieGoals = (activityData) => {
            try {
                const userProfile = JSON.parse(localStorage.getItem('fueliq_user_profile') || '{}');
                const userGoals = JSON.parse(localStorage.getItem('fueliq_user_goals') || '{}');
                
                if (userGoals.dailyCalories) {
                    const adjustedCalories = calculateAdjustedCalories(userGoals.dailyCalories, activityData);
                    const updatedGoals = { ...userGoals, dailyCalories: adjustedCalories };
                    localStorage.setItem('fueliq_user_goals', JSON.stringify(updatedGoals));
                }
            } catch (error) {
                console.error('Failed to update calorie goals:', error);
            }
        };

        const disconnectDevice = (deviceId) => {
            setWearableData(prev => ({
                ...prev,
                connectedDevices: prev.connectedDevices.filter(device => device.deviceId !== deviceId)
            }));
        };

        const activityLevel = healthData ? getActivityLevel(healthData.steps) : null;

        return React.createElement('div', { className: 'max-w-6xl mx-auto p-6' },
            // Header
            React.createElement('div', { className: 'bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 mb-6 text-white' },
                React.createElement('div', { className: 'flex items-center justify-between' },
                    React.createElement('div', null,
                        React.createElement('h1', { className: 'text-3xl font-bold mb-2' }, '⌚ Wearables Hub'),
                        React.createElement('p', { className: 'text-lg opacity-90' }, 'Connect your fitness devices for comprehensive health tracking'),
                        activityLevel && React.createElement('div', { className: 'mt-3 flex items-center gap-2' },
                            React.createElement('span', { className: 'text-xl' }, activityLevel.emoji),
                            React.createElement('span', { className: 'font-semibold' }, `Today: ${activityLevel.level}`)
                        )
                    ),
                    React.createElement('div', { className: 'text-right' },
                        React.createElement('div', { className: 'text-sm opacity-90' }, 'Connected Devices'),
                        React.createElement('div', { className: 'text-2xl font-bold' }, wearableData.connectedDevices.length),
                        wearableData.lastSync && React.createElement('div', { className: 'text-xs opacity-75 mt-1' },
                            `Last sync: ${new Date(wearableData.lastSync).toLocaleTimeString()}`
                        )
                    )
                )
            ),

            // Connection Status & Actions
            React.createElement('div', { className: 'mb-6' },
                wearableData.connectedDevices.length === 0 ? 
                    React.createElement('div', { className: 'bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center' },
                        React.createElement('div', { className: 'text-4xl mb-3' }, '📱'),
                        React.createElement('h3', { className: 'text-xl font-bold text-yellow-800 mb-2' }, 'No Devices Connected'),
                        React.createElement('p', { className: 'text-yellow-700 mb-4' }, 'Connect your fitness tracker to unlock comprehensive health insights'),
                        React.createElement('button', {
                            onClick: () => setShowConnectionModal(true),
                            className: 'bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-semibold'
                        }, 'Connect Your Device')
                    ) :
                    React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-4' },
                        // Connected Devices
                        React.createElement('div', { className: 'bg-white rounded-xl p-6 shadow-lg border border-gray-200' },
                            React.createElement('h3', { className: 'text-lg font-bold text-gray-800 mb-4' }, 'Connected Devices'),
                            React.createElement('div', { className: 'space-y-3' },
                                ...wearableData.connectedDevices.map(device => 
                                    React.createElement('div', { 
                                        key: device.deviceId,
                                        className: 'flex items-center justify-between p-3 bg-gray-50 rounded-lg'
                                    },
                                        React.createElement('div', { className: 'flex items-center gap-3' },
                                            React.createElement('span', { className: 'text-xl' }, DeviceAPIs[device.type].icon),
                                            React.createElement('div', null,
                                                React.createElement('div', { className: 'font-semibold' }, device.deviceName),
                                                React.createElement('div', { className: 'text-sm text-gray-600' }, DeviceAPIs[device.type].name)
                                            )
                                        ),
                                        React.createElement('button', {
                                            onClick: () => disconnectDevice(device.deviceId),
                                            className: 'text-red-500 hover:text-red-700 text-sm font-medium'
                                        }, 'Disconnect')
                                    )
                                )
                            )
                        ),
                        
                        // Sync Controls
                        React.createElement('div', { className: 'bg-white rounded-xl p-6 shadow-lg border border-gray-200' },
                            React.createElement('h3', { className: 'text-lg font-bold text-gray-800 mb-4' }, 'Sync Controls'),
                            React.createElement('div', { className: 'space-y-4' },
                                React.createElement('button', {
                                    onClick: syncData,
                                    disabled: syncing,
                                    className: 'w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white px-4 py-3 rounded-lg font-semibold flex items-center justify-center gap-2'
                                },
                                    syncing ? 
                                        React.createElement('div', { className: 'animate-spin rounded-full h-5 w-5 border-b-2 border-white' }) :
                                        React.createElement('span', null, '🔄'),
                                    syncing ? 'Syncing...' : 'Sync Now'
                                ),
                                React.createElement('button', {
                                    onClick: () => setShowConnectionModal(true),
                                    className: 'w-full bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg font-semibold'
                                }, '+ Add Another Device')
                            )
                        )
                    )
            ),

            // Health Metrics Dashboard
            healthData && React.createElement('div', { className: 'space-y-6' },
                // Primary Metrics
                React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6' },
                    React.createElement(HealthMetricCard, {
                        title: 'Steps',
                        value: healthData.steps,
                        unit: '',
                        goal: 10000,
                        icon: '👟',
                        color: 'blue'
                    }),
                    React.createElement(HealthMetricCard, {
                        title: 'Calories Burned',
                        value: healthData.calories,
                        unit: 'kcal',
                        goal: 600,
                        icon: '🔥',
                        color: 'orange'
                    }),
                    React.createElement(HealthMetricCard, {
                        title: 'Distance',
                        value: healthData.distance,
                        unit: 'miles',
                        goal: 5,
                        icon: '📍',
                        color: 'green'
                    }),
                    React.createElement(HealthMetricCard, {
                        title: 'Active Minutes',
                        value: healthData.activeMinutes,
                        unit: 'min',
                        goal: 30,
                        icon: '⏱️',
                        color: 'purple'
                    })
                ),

                // Heart Rate & Sleep
                React.createElement('div', { className: 'grid grid-cols-1 lg:grid-cols-2 gap-6' },
                    // Heart Rate
                    React.createElement('div', { className: 'bg-white rounded-xl p-6 shadow-lg border border-gray-200' },
                        React.createElement('h3', { className: 'text-xl font-bold text-gray-800 mb-6 flex items-center gap-2' },
                            React.createElement('span', null, '❤️'),
                            'Heart Rate'
                        ),
                        React.createElement('div', { className: 'grid grid-cols-3 gap-4' },
                            React.createElement('div', { className: 'text-center' },
                                React.createElement('div', { className: 'text-2xl font-bold text-red-600' }, healthData.heartRate.current),
                                React.createElement('div', { className: 'text-sm text-gray-600' }, 'Current BPM')
                            ),
                            React.createElement('div', { className: 'text-center' },
                                React.createElement('div', { className: 'text-2xl font-bold text-blue-600' }, healthData.heartRate.resting),
                                React.createElement('div', { className: 'text-sm text-gray-600' }, 'Resting BPM')
                            ),
                            React.createElement('div', { className: 'text-center' },
                                React.createElement('div', { className: 'text-2xl font-bold text-orange-600' }, healthData.heartRate.max),
                                React.createElement('div', { className: 'text-sm text-gray-600' }, 'Max BPM')
                            )
                        )
                    ),

                    // Sleep Analysis
                    React.createElement(SleepAnalysis, { sleepData: healthData.sleep })
                ),

                // Recent Workouts
                healthData.workouts && healthData.workouts.length > 0 && React.createElement('div', { className: 'bg-white rounded-xl p-6 shadow-lg border border-gray-200' },
                    React.createElement('h3', { className: 'text-xl font-bold text-gray-800 mb-6 flex items-center gap-2' },
                        React.createElement('span', null, '💪'),
                        'Recent Workouts'
                    ),
                    React.createElement('div', { className: 'space-y-3' },
                        ...healthData.workouts.map((workout, index) =>
                            React.createElement('div', { 
                                key: index,
                                className: 'flex items-center justify-between p-4 bg-gray-50 rounded-lg'
                            },
                                React.createElement('div', { className: 'flex items-center gap-3' },
                                    React.createElement('span', { className: 'text-xl' }, '🏃'),
                                    React.createElement('div', null,
                                        React.createElement('div', { className: 'font-semibold' }, workout.type),
                                        React.createElement('div', { className: 'text-sm text-gray-600' }, 
                                            `${workout.duration} minutes • ${workout.calories} calories`
                                        )
                                    )
                                ),
                                React.createElement('div', { className: 'text-sm text-gray-500' },
                                    new Date(workout.timestamp).toLocaleDateString()
                                )
                            )
                        )
                    )
                )
            ),

            // Modals
            showConnectionModal && React.createElement(DeviceConnectionModal, {
                onConnect: connectDevice,
                onClose: () => setShowConnectionModal(false)
            })
        );
    };

    // Export for integration
    const renderWearablesHub = (containerId) => {
        const container = document.getElementById(containerId);
        if (container) {
            ReactDOM.render(React.createElement(WearablesHub), container);
        }
    };

    // Make available globally
    window.FuelIQWearables = {
        WearablesHub,
        renderWearablesHub,
        calculateAdjustedCalories,
        getActivityLevel
    };

})();
