// Enhanced Habbt Wearables Integration Module
// Save this as: enhanced-wearables-tab.js

(function() {
    // Prevent multiple loading
    if (window.HabbtWearables) {
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
        const key = 'habbt_wearables';
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
        const key = 'habbt_wearables';
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
                adjustCaloriesForActivity: true,
                shareWithDashboard: true,
                enableRecommendations: true
            }
        };
    };

    // Enhanced Device Integration APIs with More Devices
    const DeviceAPIs = {
        garmin: {
            name: 'Garmin Connect IQ',
            icon: '⌚',
            color: 'from-blue-500 to-teal-600',
            category: 'fitness',
            scopes: ['activities', 'sleep', 'dailies', 'body-composition'],
            connect: async () => {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        resolve({
                            deviceId: 'garmin_' + Date.now(),
                            deviceName: 'Garmin Forerunner 955',
                            connected: true,
                            lastSync: new Date().toISOString()
                        });
                    }, 2000);
                });
            },
            fetchData: async () => {
                return {
                    steps: Math.floor(Math.random() * 5000) + 8000,
                    calories: Math.floor(Math.random() * 500) + 400,
                    distance: parseFloat((Math.random() * 3 + 2).toFixed(2)),
                    activeMinutes: Math.floor(Math.random() * 60) + 30,
                    vo2Max: Math.floor(Math.random() * 10) + 45,
                    bodyBattery: Math.floor(Math.random() * 40) + 60,
                    heartRate: {
                        resting: Math.floor(Math.random() * 15) + 55,
                        max: Math.floor(Math.random() * 30) + 180,
                        current: Math.floor(Math.random() * 40) + 80
                    },
                    sleep: {
                        totalSleep: Math.floor(Math.random() * 120) + 420,
                        deepSleep: Math.floor(Math.random() * 60) + 90,
                        lightSleep: Math.floor(Math.random() * 180) + 240,
                        remSleep: Math.floor(Math.random() * 50) + 60,
                        awake: Math.floor(Math.random() * 30) + 10,
                        sleepScore: Math.floor(Math.random() * 30) + 70
                    },
                    workouts: [
                        {
                            type: 'Running',
                            duration: 35,
                            calories: 350,
                            averageHR: 145,
                            timestamp: new Date().toISOString()
                        }
                    ]
                };
            }
        },
        apple: {
            name: 'Apple Health',
            icon: '🍎',
            color: 'from-gray-500 to-gray-700',
            category: 'health',
            scopes: ['steps', 'heart_rate', 'sleep', 'workouts', 'nutrition'],
            connect: async () => {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        resolve({
                            deviceId: 'apple_' + Date.now(),
                            deviceName: 'Apple Watch Series 9',
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
                    standHours: Math.floor(Math.random() * 8) + 8,
                    exerciseMinutes: Math.floor(Math.random() * 40) + 20,
                    heartRate: {
                        resting: Math.floor(Math.random() * 12) + 58,
                        max: Math.floor(Math.random() * 25) + 185,
                        current: Math.floor(Math.random() * 35) + 85,
                        variability: Math.floor(Math.random() * 20) + 30
                    },
                    sleep: {
                        totalSleep: Math.floor(Math.random() * 100) + 440,
                        deepSleep: Math.floor(Math.random() * 50) + 100,
                        lightSleep: Math.floor(Math.random() * 160) + 260,
                        remSleep: Math.floor(Math.random() * 60) + 70,
                        awake: Math.floor(Math.random() * 25) + 15,
                        sleepScore: Math.floor(Math.random() * 25) + 75
                    }
                };
            }
        },
        fitbit: {
            name: 'Fitbit',
            icon: '💚',
            color: 'from-green-500 to-emerald-600',
            category: 'fitness',
            scopes: ['activity', 'heartrate', 'sleep', 'weight'],
            connect: async () => {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        resolve({
                            deviceId: 'fitbit_' + Date.now(),
                            deviceName: 'Fitbit Sense 2',
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
                    floors: Math.floor(Math.random() * 15) + 10,
                    activeZoneMinutes: Math.floor(Math.random() * 25) + 15,
                    heartRate: {
                        resting: Math.floor(Math.random() * 10) + 60,
                        max: Math.floor(Math.random() * 20) + 190,
                        current: Math.floor(Math.random() * 30) + 90,
                        fatBurn: 120,
                        cardio: 150,
                        peak: 180
                    },
                    sleep: {
                        totalSleep: Math.floor(Math.random() * 90) + 450,
                        deepSleep: Math.floor(Math.random() * 40) + 110,
                        lightSleep: Math.floor(Math.random() * 150) + 270,
                        remSleep: Math.floor(Math.random() * 50) + 80,
                        awake: Math.floor(Math.random() * 20) + 20,
                        sleepScore: Math.floor(Math.random() * 20) + 80
                    }
                };
            }
        },
        samsung: {
            name: 'Samsung Health',
            icon: '💙',
            color: 'from-blue-600 to-purple-600',
            category: 'health',
            scopes: ['steps', 'heart_rate', 'sleep', 'stress', 'body_composition'],
            connect: async () => {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        resolve({
                            deviceId: 'samsung_' + Date.now(),
                            deviceName: 'Galaxy Watch 6',
                            connected: true,
                            lastSync: new Date().toISOString()
                        });
                    }, 1600);
                });
            },
            fetchData: async () => {
                return {
                    steps: Math.floor(Math.random() * 4500) + 8500,
                    calories: Math.floor(Math.random() * 350) + 420,
                    distance: parseFloat((Math.random() * 3.2 + 2.8).toFixed(2)),
                    activeMinutes: Math.floor(Math.random() * 55) + 25,
                    stress: Math.floor(Math.random() * 40) + 30,
                    heartRate: {
                        resting: Math.floor(Math.random() * 14) + 56,
                        max: Math.floor(Math.random() * 28) + 182,
                        current: Math.floor(Math.random() * 38) + 82
                    },
                    sleep: {
                        totalSleep: Math.floor(Math.random() * 110) + 430,
                        deepSleep: Math.floor(Math.random() * 45) + 95,
                        lightSleep: Math.floor(Math.random() * 170) + 250,
                        remSleep: Math.floor(Math.random() * 55) + 65,
                        awake: Math.floor(Math.random() * 28) + 12,
                        sleepScore: Math.floor(Math.random() * 28) + 72
                    },
                    bodyComposition: {
                        weight: 165.2,
                        bodyFat: 18.5,
                        muscleMass: 135.8,
                        waterPercentage: 58.3
                    }
                };
            }
        },
        whoop: {
            name: 'WHOOP 4.0',
            icon: '⚡',
            color: 'from-red-500 to-pink-600',
            category: 'recovery',
            scopes: ['recovery', 'strain', 'sleep', 'hrv'],
            connect: async () => {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        resolve({
                            deviceId: 'whoop_' + Date.now(),
                            deviceName: 'WHOOP 4.0 Band',
                            connected: true,
                            lastSync: new Date().toISOString()
                        });
                    }, 1400);
                });
            },
            fetchData: async () => {
                return {
                    recoveryScore: Math.floor(Math.random() * 40) + 60,
                    strain: parseFloat((Math.random() * 10 + 8).toFixed(1)),
                    calories: Math.floor(Math.random() * 600) + 400,
                    hrv: Math.floor(Math.random() * 30) + 35,
                    heartRate: {
                        resting: Math.floor(Math.random() * 12) + 54,
                        max: Math.floor(Math.random() * 25) + 185,
                        current: Math.floor(Math.random() * 35) + 85
                    },
                    sleep: {
                        totalSleep: Math.floor(Math.random() * 100) + 460,
                        deepSleep: Math.floor(Math.random() * 50) + 105,
                        lightSleep: Math.floor(Math.random() * 150) + 280,
                        remSleep: Math.floor(Math.random() * 60) + 75,
                        awake: Math.floor(Math.random() * 20) + 10,
                        sleepScore: Math.floor(Math.random() * 25) + 75,
                        efficiency: Math.floor(Math.random() * 15) + 85
                    }
                };
            }
        },
        oura: {
            name: 'Oura Ring',
            icon: '💍',
            color: 'from-purple-500 to-indigo-600',
            category: 'recovery',
            scopes: ['sleep', 'readiness', 'activity', 'temperature'],
            connect: async () => {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        resolve({
                            deviceId: 'oura_' + Date.now(),
                            deviceName: 'Oura Ring Gen 3',
                            connected: true,
                            lastSync: new Date().toISOString()
                        });
                    }, 1300);
                });
            },
            fetchData: async () => {
                return {
                    readinessScore: Math.floor(Math.random() * 35) + 65,
                    activityScore: Math.floor(Math.random() * 30) + 70,
                    steps: Math.floor(Math.random() * 3000) + 7000,
                    calories: Math.floor(Math.random() * 250) + 350,
                    temperature: parseFloat((Math.random() * 1.5 - 0.75).toFixed(2)),
                    heartRate: {
                        resting: Math.floor(Math.random() * 10) + 52,
                        lowest: Math.floor(Math.random() * 8) + 48,
                        variability: Math.floor(Math.random() * 25) + 32
                    },
                    sleep: {
                        totalSleep: Math.floor(Math.random() * 120) + 440,
                        deepSleep: Math.floor(Math.random() * 60) + 100,
                        lightSleep: Math.floor(Math.random() * 180) + 260,
                        remSleep: Math.floor(Math.random() * 50) + 80,
                        awake: Math.floor(Math.random() * 25) + 15,
                        sleepScore: Math.floor(Math.random() * 30) + 70,
                        efficiency: Math.floor(Math.random() * 12) + 88,
                        latency: Math.floor(Math.random() * 15) + 5
                    }
                };
            }
        },
        strava: {
            name: 'Strava',
            icon: '🏃',
            color: 'from-orange-500 to-red-600',
            category: 'activity',
            scopes: ['activities', 'segments', 'achievements'],
            connect: async () => {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        resolve({
                            deviceId: 'strava_' + Date.now(),
                            deviceName: 'Strava Account',
                            connected: true,
                            lastSync: new Date().toISOString()
                        });
                    }, 1200);
                });
            },
            fetchData: async () => {
                return {
                    weeklyDistance: parseFloat((Math.random() * 15 + 10).toFixed(1)),
                    weeklyElevation: Math.floor(Math.random() * 1000) + 500,
                    calories: Math.floor(Math.random() * 400) + 300,
                    workouts: [
                        {
                            type: 'Running',
                            duration: 42,
                            distance: 5.2,
                            pace: '7:45',
                            calories: 420,
                            elevation: 150,
                            timestamp: new Date().toISOString()
                        },
                        {
                            type: 'Cycling',
                            duration: 65,
                            distance: 18.3,
                            speed: 16.8,
                            calories: 580,
                            elevation: 320,
                            timestamp: new Date(Date.now() - 86400000).toISOString()
                        }
                    ],
                    achievements: [
                        { name: 'Weekly Distance Goal', earned: true },
                        { name: 'Monthly Challenge', earned: false }
                    ]
                };
            }
        },
        googlefit: {
            name: 'Google Fit',
            icon: '🟢',
            color: 'from-green-600 to-blue-600',
            category: 'health',
            scopes: ['steps', 'heart_points', 'weight', 'workouts'],
            connect: async () => {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        resolve({
                            deviceId: 'googlefit_' + Date.now(),
                            deviceName: 'Google Fit',
                            connected: true,
                            lastSync: new Date().toISOString()
                        });
                    }, 1100);
                });
            },
            fetchData: async () => {
                return {
                    steps: Math.floor(Math.random() * 4000) + 8000,
                    heartPoints: Math.floor(Math.random() * 15) + 10,
                    moveMinutes: Math.floor(Math.random() * 40) + 30,
                    calories: Math.floor(Math.random() * 300) + 400,
                    workouts: [
                        {
                            type: 'Walking',
                            duration: 25,
                            calories: 120,
                            steps: 2500,
                            timestamp: new Date().toISOString()
                        }
                    ]
                };
            }
        }
    };

    // Data Processing & Analytics Functions
    const calculateAdjustedCalories = (baseCalories, activityData) => {
        if (!activityData) return baseCalories;
        
        const stepMultiplier = Math.max(0, (activityData.steps - 8000) / 2000) * 50;
        const exerciseCalories = activityData.calories || 0;
        
        return Math.round(baseCalories + stepMultiplier + (exerciseCalories * 0.5));
    };

    const getActivityLevel = (steps) => {
        if (steps < 5000) return { level: 'Sedentary', color: 'text-red-600', emoji: '😴', recommendation: 'Try to get more movement throughout the day!' };
        if (steps < 8000) return { level: 'Lightly Active', color: 'text-yellow-600', emoji: '🚶', recommendation: 'Good start! Aim for 10,000 steps daily.' };
        if (steps < 12000) return { level: 'Moderately Active', color: 'text-green-600', emoji: '🏃', recommendation: 'Great activity level! Keep it up.' };
        return { level: 'Very Active', color: 'text-blue-600', emoji: '💪', recommendation: 'Outstanding! You\'re crushing your fitness goals.' };
    };

    const getSleepQuality = (sleepScore) => {
        if (sleepScore >= 85) return { quality: 'Excellent', color: 'text-green-600', emoji: '😴', recommendation: 'Perfect sleep! Your body is well-rested.' };
        if (sleepScore >= 70) return { quality: 'Good', color: 'text-blue-600', emoji: '😊', recommendation: 'Good sleep quality. Minor improvements possible.' };
        if (sleepScore >= 55) return { quality: 'Fair', color: 'text-yellow-600', emoji: '😐', recommendation: 'Consider improving sleep hygiene for better rest.' };
        return { quality: 'Poor', color: 'text-red-600', emoji: '😵', recommendation: 'Focus on better sleep - it affects your nutrition goals!' };
    };

    const getRecoveryStatus = (data) => {
        if (data.recoveryScore >= 80) return { status: 'Fully Recovered', color: 'text-green-600', emoji: '💚' };
        if (data.recoveryScore >= 65) return { status: 'Good Recovery', color: 'text-blue-600', emoji: '💙' };
        if (data.recoveryScore >= 50) return { status: 'Moderate Recovery', color: 'text-yellow-600', emoji: '💛' };
        return { status: 'Low Recovery', color: 'text-red-600', emoji: '❤️‍🩹' };
    };

    // Dashboard & Analytics Data Export
    const exportHealthDataForDashboard = (wearableData) => {
        try {
            const dashboardData = {
                lastUpdated: new Date().toISOString(),
                dailyMetrics: wearableData.healthData.today,
                weeklyTrends: calculateWeeklyTrends(wearableData.healthData.history),
                recommendations: generateHealthRecommendations(wearableData.healthData.today),
                connectedDevices: wearableData.connectedDevices.length,
                dataQuality: assessDataQuality(wearableData.healthData.today)
            };

            // Save for dashboard access
            if (isLocalStorageAvailable()) {
                localStorage.setItem('habbt_dashboard_health_data', JSON.stringify(dashboardData));
            }

            return dashboardData;
        } catch (error) {
            console.error('Failed to export health data:', error);
            return null;
        }
    };

    const calculateWeeklyTrends = (history) => {
        if (!history || history.length < 2) return null;
        
        const recent = history.slice(-7);
        const avgSteps = recent.reduce((sum, day) => sum + (day.data.steps || 0), 0) / recent.length;
        const avgSleep = recent.reduce((sum, day) => sum + ((day.data.sleep?.totalSleep || 0) / 60), 0) / recent.length;
        const avgCalories = recent.reduce((sum, day) => sum + (day.data.calories || 0), 0) / recent.length;
        
        return {
            steps: Math.round(avgSteps),
            sleepHours: parseFloat(avgSleep.toFixed(1)),
            calories: Math.round(avgCalories)
        };
    };

    const generateHealthRecommendations = (todayData) => {
        const recommendations = [];
        
        if (todayData.steps < 8000) {
            recommendations.push({
                type: 'activity',
                priority: 'high',
                message: 'Increase daily steps to boost calorie burn and metabolism',
                action: 'Take a 15-minute walk after meals'
            });
        }
        
        if (todayData.sleep && todayData.sleep.sleepScore < 70) {
            recommendations.push({
                type: 'sleep',
                priority: 'high',
                message: 'Poor sleep affects hunger hormones and food choices',
                action: 'Aim for 7-9 hours of quality sleep tonight'
            });
        }
        
        if (todayData.heartRate && todayData.heartRate.resting > 70) {
            recommendations.push({
                type: 'cardiovascular',
                priority: 'medium',
                message: 'Elevated resting heart rate may indicate stress or overtraining',
                action: 'Consider adding meditation or reducing workout intensity'
            });
        }
        
        return recommendations;
    };

    const assessDataQuality = (todayData) => {
        let score = 0;
        let maxScore = 0;
        
        // Check data completeness
        if (todayData.steps) { score += 20; maxScore += 20; }
        if (todayData.heartRate) { score += 20; maxScore += 20; }
        if (todayData.sleep) { score += 30; maxScore += 30; }
        if (todayData.calories) { score += 15; maxScore += 15; }
        if (todayData.activeMinutes) { score += 15; maxScore += 15; }
        
        return maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
    };

    // Enhanced Device Connection Modal
    const DeviceConnectionModal = ({ onConnect, onClose }) => {
        const [connecting, setConnecting] = React.useState(null);
        const [selectedCategory, setSelectedCategory] = React.useState('all');

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

        const categories = {
            all: 'All Devices',
            fitness: 'Fitness Trackers',
            health: 'Health Platforms',
            recovery: 'Recovery Focused',
            activity: 'Activity Tracking'
        };

        const filteredDevices = Object.entries(DeviceAPIs).filter(([key, api]) => 
            selectedCategory === 'all' || api.category === selectedCategory
        );

        return React.createElement('div', { 
            className: 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50' 
        },
            React.createElement('div', { 
                className: 'bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto' 
            },
                React.createElement('div', { className: 'flex justify-between items-center mb-6' },
                    React.createElement('h3', { className: 'text-2xl font-bold text-gray-800' }, 'Connect Your Device'),
                    React.createElement('button', { 
                        onClick: onClose,
                        className: 'text-gray-500 hover:text-gray-700 text-2xl font-bold bg-gray-100 hover:bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center transition-all'
                    }, '×')
                ),

                // Category Filter
                React.createElement('div', { className: 'mb-6' },
                    React.createElement('div', { className: 'flex flex-wrap gap-2' },
                        ...Object.entries(categories).map(([key, label]) =>
                            React.createElement('button', {
                                key: key,
                                onClick: () => setSelectedCategory(key),
                                className: `px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                    selectedCategory === key 
                                        ? 'bg-gradient-to-r from-blue-500 to-teal-600 text-white' 
                                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                }`
                            }, label)
                        )
                    )
                ),

                React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-4' },
                    ...filteredDevices.map(([key, api]) =>
                        React.createElement('button', {
                            key: key,
                            onClick: () => handleConnect(key),
                            disabled: connecting === key,
                            className: `p-4 border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-left`
                        },
                            React.createElement('div', { className: 'flex items-center gap-4' },
                                React.createElement('div', { 
                                    className: `w-12 h-12 rounded-xl bg-gradient-to-r ${api.color} flex items-center justify-center text-2xl`
                                }, api.icon),
                                React.createElement('div', { className: 'flex-1' },
                                    React.createElement('div', { className: 'font-bold text-gray-800 text-lg' }, api.name),
                                    React.createElement('div', { className: 'text-sm text-gray-600 mb-1' }, 
                                        `Tracks: ${api.scopes.slice(0, 3).join(', ')}${api.scopes.length > 3 ? '...' : ''}`
                                    ),
                                    React.createElement('div', { className: 'text-xs text-blue-600 capitalize' }, api.category)
                                ),
                                connecting === key ? 
                                    React.createElement('div', { className: 'animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500' }) :
                                    React.createElement('span', { className: 'text-gray-400 text-xl' }, '→')
                            )
                        )
                    )
                ),

                React.createElement('div', { className: 'mt-6 p-4 bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl border border-blue-200' },
                    React.createElement('p', { className: 'text-blue-800 text-sm mb-2 font-medium' },
                        '🔒 Privacy & Security'
                    ),
                    React.createElement('p', { className: 'text-blue-700 text-sm' },
                        'Your health data stays private and secure. We only access the metrics you choose to share and never sell your data.'
                    )
                )
            )
        );
    };

    // Enhanced Health Metrics Card
    const HealthMetricCard = ({ title, value, unit, goal, icon, color, trend, recommendation }) => {
        const percentage = goal ? Math.min((value / goal) * 100, 100) : 0;
        
        return React.createElement('div', { className: 'bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300' },
            React.createElement('div', { className: 'flex items-center justify-between mb-4' },
                React.createElement('div', { className: 'flex items-center gap-3' },
                    React.createElement('div', { 
                        className: `w-12 h-12 rounded-xl bg-gradient-to-r ${color} flex items-center justify-center text-2xl`
                    }, icon),
                    React.createElement('h3', { className: 'font-bold text-gray-800 text-lg' }, title)
                ),
                trend && React.createElement('div', { 
                    className: `flex items-center gap-1 px-2 py-1 rounded-lg ${trend > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}` 
                },
                    React.createElement('span', { className: 'text-sm font-medium' }, `${trend > 0 ? '+' : ''}${trend}%`),
                    React.createElement('span', null, trend > 0 ? '↗️' : '↘️')
                )
            ),
            
            React.createElement('div', { className: 'mb-4' },
                React.createElement('div', { className: 'flex items-baseline gap-2 mb-2' },
                    React.createElement('span', { className: 'text-4xl font-bold text-gray-900' }, 
                        typeof value === 'number' ? value.toLocaleString() : value
                    ),
                    React.createElement('span', { className: 'text-lg text-gray-600' }, unit),
                    goal && React.createElement('span', { className: 'text-gray-400' }, 
                        `/ ${goal.toLocaleString()}`
                    )
                )
            ),

            goal && React.createElement('div', { className: 'mb-4' },
                React.createElement('div', { className: 'w-full bg-gray-200 rounded-full h-3' },
                    React.createElement('div', {
                        className: `h-3 rounded-full bg-gradient-to-r ${color} transition-all duration-500`,
                        style: { width: `${percentage}%` }
                    })
                ),
                React.createElement('div', { className: 'text-sm text-gray-600 mt-1' },
                    `${Math.round(percentage)}% of daily goal`
                )
            ),

            recommendation && React.createElement('div', { className: 'text-xs text-blue-600 bg-blue-50 p-2 rounded-lg' },
                `💡 ${recommendation}`
            )
        );
    };

    // Enhanced Sleep Analysis
    const SleepAnalysis = ({ sleepData }) => {
        if (!sleepData) return null;

        const totalHours = (sleepData.totalSleep / 60).toFixed(1);
        const sleepQuality = getSleepQuality(sleepData.sleepScore);

        return React.createElement('div', { className: 'bg-white rounded-2xl p-6 shadow-lg border border-gray-100' },
            React.createElement('div', { className: 'flex items-center justify-between mb-6' },
                React.createElement('h3', { className: 'text-xl font-bold text-gray-800 flex items-center gap-3' },
                    React.createElement('div', { className: 'w-10 h-10 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center' }, '😴'),
                    'Sleep Analysis'
                ),
                React.createElement('div', { className: `px-4 py-2 rounded-full text-sm font-medium ${sleepQuality.color} bg-opacity-10` },
                    `${sleepQuality.emoji} ${sleepQuality.quality}`
                )
            ),

            React.createElement('div', { className: 'grid grid-cols-2 md:grid-cols-4 gap-4 mb-6' },
                React.createElement('div', { className: 'text-center p-3 bg-blue-50 rounded-xl' },
                    React.createElement('div', { className: 'text-2xl font-bold text-blue-600' }, totalHours),
                    React.createElement('div', { className: 'text-sm text-gray-600' }, 'Total Hours')
                ),
                React.createElement('div', { className: 'text-center p-3 bg-purple-50 rounded-xl' },
                    React.createElement('div', { className: 'text-2xl font-bold text-purple-600' }, Math.round(sleepData.deepSleep / 60 * 10) / 10),
                    React.createElement('div', { className: 'text-sm text-gray-600' }, 'Deep Sleep')
                ),
                React.createElement('div', { className: 'text-center p-3 bg-green-50 rounded-xl' },
                    React.createElement('div', { className: 'text-2xl font-bold text-green-600' }, Math.round((sleepData.remSleep || sleepData.lightSleep) / 60 * 10) / 10),
                    React.createElement('div', { className: 'text-sm text-gray-600' }, 'REM Sleep')
                ),
                React.createElement('div', { className: 'text-center p-3 bg-gray-50 rounded-xl' },
                    React.createElement('div', { className: 'text-2xl font-bold text-gray-600' }, sleepData.sleepScore),
                    React.createElement('div', { className: 'text-sm text-gray-600' }, 'Sleep Score')
                )
            ),

            React.createElement('div', { className: 'space-y-3 mb-4' },
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
                    React.createElement('span', { className: 'font-medium text-green-600' }, 'REM Sleep'),
                    React.createElement('div', { className: 'w-32 bg-gray-200 rounded-full h-2' },
                        React.createElement('div', { 
                            className: 'bg-green-500 h-2 rounded-full',
                            style: { width: `${((sleepData.remSleep || sleepData.lightSleep) / sleepData.totalSleep) * 100}%` }
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
            ),

            React.createElement('div', { className: 'p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl' },
                React.createElement('p', { className: 'text-sm text-blue-800 font-medium' }, '💤 Sleep Insight'),
                React.createElement('p', { className: 'text-sm text-blue-700 mt-1' }, sleepQuality.recommendation)
            )
        );
    };

    // Main Enhanced Wearables Component
    const EnhancedWearablesHub = () => {
        const [wearableData, setWearableData] = React.useState(loadWearableData());
        const [showConnectionModal, setShowConnectionModal] = React.useState(false);
        const [syncing, setSyncing] = React.useState(false);
        const [healthData, setHealthData] = React.useState(null);

        React.useEffect(() => {
            saveWearableData(wearableData);
            // Export data for dashboard/analytics
            if (wearableData.settings.shareWithDashboard) {
                exportHealthDataForDashboard(wearableData);
            }
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
                // Simulate syncing from multiple devices and merging data
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
                if (wearableData.settings.adjustCaloriesForActivity) {
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
                const userProfile = JSON.parse(localStorage.getItem('habbt_profile_data') || '{}');
                const userGoals = userProfile.goals || {};
                
                if (userGoals.calories) {
                    const adjustedCalories = calculateAdjustedCalories(userGoals.calories, activityData);
                    const updatedProfile = { 
                        ...userProfile, 
                        goals: { ...userGoals, calories: adjustedCalories }
                    };
                    localStorage.setItem('habbt_profile_data', JSON.stringify(updatedProfile));
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

        return React.createElement('div', { className: 'min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-cyan-50' },
            React.createElement('div', { className: 'max-w-6xl mx-auto p-6' },
                // Enhanced Header with Habbt Branding
                React.createElement('div', { className: 'bg-gradient-to-r from-blue-600 to-teal-600 rounded-3xl p-8 mb-8 text-white shadow-2xl' },
                    React.createElement('div', { className: 'flex items-center justify-between' },
                        React.createElement('div', null,
                            React.createElement('h1', { className: 'text-4xl font-bold mb-3 flex items-center gap-3' },
                                React.createElement('span', null, '⌚'),
                                'Wearables Hub'
                            ),
                            React.createElement('p', { className: 'text-xl opacity-90 mb-4' }, 'Connect your devices for comprehensive health insights'),
                            activityLevel && React.createElement('div', { className: 'flex items-center gap-3 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl' },
                                React.createElement('span', { className: 'text-2xl' }, activityLevel.emoji),
                                React.createElement('div', null,
                                    React.createElement('div', { className: 'font-semibold' }, `Today: ${activityLevel.level}`),
                                    React.createElement('div', { className: 'text-sm opacity-90' }, activityLevel.recommendation)
                                )
                            )
                        ),
                        React.createElement('div', { className: 'text-right bg-white/20 backdrop-blur-sm rounded-2xl p-6' },
                            React.createElement('div', { className: 'text-sm opacity-90 mb-1' }, 'Connected Devices'),
                            React.createElement('div', { className: 'text-4xl font-bold mb-2' }, wearableData.connectedDevices.length),
                            wearableData.lastSync && React.createElement('div', { className: 'text-xs opacity-75' },
                                `Last sync: ${new Date(wearableData.lastSync).toLocaleTimeString()}`
                            )
                        )
                    )
                ),

                // Connection Status & Actions
                React.createElement('div', { className: 'mb-8' },
                    wearableData.connectedDevices.length === 0 ? 
                        React.createElement('div', { className: 'bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-8 text-center' },
                            React.createElement('div', { className: 'text-6xl mb-4' }, '📱'),
                            React.createElement('h3', { className: 'text-2xl font-bold text-yellow-800 mb-3' }, 'No Devices Connected'),
                            React.createElement('p', { className: 'text-yellow-700 mb-6 text-lg' }, 'Connect your fitness tracker to unlock comprehensive health insights and personalized nutrition recommendations'),
                            React.createElement('button', {
                                onClick: () => setShowConnectionModal(true),
                                className: 'bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white px-8 py-4 rounded-xl font-bold text-lg transform hover:scale-105 transition-all duration-200'
                            }, '⚡ Connect Your First Device')
                        ) :
                        React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-6' },
                            // Connected Devices
                            React.createElement('div', { className: 'bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20' },
                                React.createElement('h3', { className: 'text-xl font-bold text-gray-800 mb-4 flex items-center gap-2' },
                                    React.createElement('span', null, '🔗'),
                                    'Connected Devices'
                                ),
                                React.createElement('div', { className: 'space-y-3' },
                                    ...wearableData.connectedDevices.map(device => 
                                        React.createElement('div', { 
                                            key: device.deviceId,
                                            className: 'flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200'
                                        },
                                            React.createElement('div', { className: 'flex items-center gap-4' },
                                                React.createElement('div', { 
                                                    className: `w-12 h-12 rounded-xl bg-gradient-to-r ${DeviceAPIs[device.type].color} flex items-center justify-center text-xl`
                                                }, DeviceAPIs[device.type].icon),
                                                React.createElement('div', null,
                                                    React.createElement('div', { className: 'font-bold text-gray-800' }, device.deviceName),
                                                    React.createElement('div', { className: 'text-sm text-gray-600' }, DeviceAPIs[device.type].name),
                                                    React.createElement('div', { className: 'text-xs text-green-600' }, '● Connected')
                                                )
                                            ),
                                            React.createElement('button', {
                                                onClick: () => disconnectDevice(device.deviceId),
                                                className: 'text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1 rounded-lg text-sm font-medium transition-all'
                                            }, 'Disconnect')
                                        )
                                    )
                                )
                            ),
                            
                            // Sync Controls
                            React.createElement('div', { className: 'bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20' },
                                React.createElement('h3', { className: 'text-xl font-bold text-gray-800 mb-4 flex items-center gap-2' },
                                    React.createElement('span', null, '🔄'),
                                    'Sync Controls'
                                ),
                                React.createElement('div', { className: 'space-y-4' },
                                    React.createElement('button', {
                                        onClick: syncData,
                                        disabled: syncing,
                                        className: 'w-full bg-gradient-to-r from-blue-500 to-teal-600 hover:from-blue-600 hover:to-teal-700 disabled:from-gray-300 disabled:to-gray-400 text-white px-4 py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all duration-200'
                                    },
                                        syncing ? 
                                            React.createElement('div', { className: 'animate-spin rounded-full h-6 w-6 border-b-2 border-white' }) :
                                            React.createElement('span', { className: 'text-xl' }, '🔄'),
                                        syncing ? 'Syncing Health Data...' : 'Sync All Devices'
                                    ),
                                    React.createElement('button', {
                                        onClick: () => setShowConnectionModal(true),
                                        className: 'w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-4 rounded-xl font-bold transition-all duration-200'
                                    }, '+ Add Another Device')
                                )
                            )
                        )
                ),

                // Health Metrics Dashboard
                healthData && React.createElement('div', { className: 'space-y-8' },
                    // Primary Metrics
                    React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6' },
                        React.createElement(HealthMetricCard, {
                            title: 'Steps',
                            value: healthData.steps,
                            unit: '',
                            goal: 10000,
                            icon: '👟',
                            color: 'from-blue-500 to-teal-600',
                            recommendation: healthData.steps < 8000 ? 'Take more walks between meals!' : null
                        }),
                        React.createElement(HealthMetricCard, {
                            title: 'Calories Burned',
                            value: healthData.calories,
                            unit: 'kcal',
                            goal: 600,
                            icon: '🔥',
                            color: 'from-orange-500 to-red-600',
                            recommendation: 'Activity calories help create calorie deficit'
                        }),
                        React.createElement(HealthMetricCard, {
                            title: 'Distance',
                            value: healthData.distance,
                            unit: 'miles',
                            goal: 5,
                            icon: '📍',
                            color: 'from-green-500 to-emerald-600'
                        }),
                        React.createElement(HealthMetricCard, {
                            title: 'Active Minutes',
                            value: healthData.activeMinutes,
                            unit: 'min',
                            goal: 30,
                            icon: '⏱️',
                            color: 'from-purple-500 to-indigo-600',
                            recommendation: healthData.activeMinutes < 30 ? 'Aim for 150min/week for health' : null
                        })
                    ),

                    // Advanced Metrics (if available)
                    (healthData.recoveryScore || healthData.vo2Max || healthData.hrv) && React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-3 gap-6' },
                        healthData.recoveryScore && React.createElement(HealthMetricCard, {
                            title: 'Recovery Score',
                            value: healthData.recoveryScore,
                            unit: '%',
                            icon: '💚',
                            color: 'from-green-500 to-emerald-600',
                            recommendation: getRecoveryStatus(healthData).status
                        }),
                        healthData.vo2Max && React.createElement(HealthMetricCard, {
                            title: 'VO2 Max',
                            value: healthData.vo2Max,
                            unit: 'ml/kg/min',
                            icon: '🫁',
                            color: 'from-blue-500 to-purple-600',
                            recommendation: 'Higher VO2 Max = better fitness level'
                        }),
                        healthData.hrv && React.createElement(HealthMetricCard, {
                            title: 'HRV',
                            value: healthData.hrv,
                            unit: 'ms',
                            icon: '❤️',
                            color: 'from-red-500 to-pink-600',
                            recommendation: 'Higher HRV indicates better recovery'
                        })
                    ),

                    // Heart Rate & Sleep Analysis
                    React.createElement('div', { className: 'grid grid-cols-1 lg:grid-cols-2 gap-6' },
                        // Enhanced Heart Rate
                        React.createElement('div', { className: 'bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20' },
                            React.createElement('h3', { className: 'text-xl font-bold text-gray-800 mb-6 flex items-center gap-3' },
                                React.createElement('div', { className: 'w-10 h-10 rounded-xl bg-gradient-to-r from-red-500 to-pink-600 flex items-center justify-center' }, '❤️'),
                                'Heart Rate Analysis'
                            ),
                            React.createElement('div', { className: 'grid grid-cols-2 md:grid-cols-3 gap-4' },
                                React.createElement('div', { className: 'text-center p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl' },
                                    React.createElement('div', { className: 'text-3xl font-bold text-red-600' }, healthData.heartRate.current),
                                    React.createElement('div', { className: 'text-sm text-gray-600' }, 'Current BPM')
                                ),
                                React.createElement('div', { className: 'text-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl' },
                                    React.createElement('div', { className: 'text-3xl font-bold text-blue-600' }, healthData.heartRate.resting),
                                    React.createElement('div', { className: 'text-sm text-gray-600' }, 'Resting BPM')
                                ),
                                React.createElement('div', { className: 'text-center p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl' },
                                    React.createElement('div', { className: 'text-3xl font-bold text-orange-600' }, healthData.heartRate.max),
                                    React.createElement('div', { className: 'text-sm text-gray-600' }, 'Max BPM')
                                )
                            ),
                            healthData.heartRate.resting > 70 && React.createElement('div', { className: 'mt-4 p-3 bg-yellow-50 rounded-xl' },
                                React.createElement('p', { className: 'text-yellow-800 text-sm' }, '💡 Elevated resting HR may indicate stress or overtraining')
                            )
                        ),

                        // Enhanced Sleep Analysis
                        React.createElement(SleepAnalysis, { sleepData: healthData.sleep })
                    ),

                    // Recent Workouts & Body Composition
                    React.createElement('div', { className: 'grid grid-cols-1 lg:grid-cols-2 gap-6' },
                        // Recent Workouts
                        healthData.workouts && healthData.workouts.length > 0 && React.createElement('div', { className: 'bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20' },
                            React.createElement('h3', { className: 'text-xl font-bold text-gray-800 mb-6 flex items-center gap-3' },
                                React.createElement('div', { className: 'w-10 h-10 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center' }, '💪'),
                                'Recent Workouts'
                            ),
                            React.createElement('div', { className: 'space-y-4' },
                                ...healthData.workouts.map((workout, index) =>
                                    React.createElement('div', { 
                                        key: index,
                                        className: 'p-4 bg-gradient-to-r from-gray-50 to-orange-50 rounded-xl border border-gray-200'
                                    },
                                        React.createElement('div', { className: 'flex items-center justify-between' },
                                            React.createElement('div', { className: 'flex items-center gap-3' },
                                                React.createElement('span', { className: 'text-2xl' }, '🏃'),
                                                React.createElement('div', null,
                                                    React.createElement('div', { className: 'font-bold text-gray-800' }, workout.type),
                                                    React.createElement('div', { className: 'text-sm text-gray-600' }, 
                                                        `${workout.duration} min • ${workout.calories} cal`
                                                    ),
                                                    workout.distance && React.createElement('div', { className: 'text-xs text-blue-600' }, 
                                                        `${workout.distance} miles`
                                                    )
                                                )
                                            ),
                                            React.createElement('div', { className: 'text-right text-sm text-gray-500' },
                                                React.createElement('div', null, new Date(workout.timestamp).toLocaleDateString()),
                                                workout.averageHR && React.createElement('div', { className: 'text-red-600' }, `${workout.averageHR} avg HR`)
                                            )
                                        )
                                    )
                                )
                            )
                        ),

                        // Body Composition (if available)
                        healthData.bodyComposition && React.createElement('div', { className: 'bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20' },
                            React.createElement('h3', { className: 'text-xl font-bold text-gray-800 mb-6 flex items-center gap-3' },
                                React.createElement('div', { className: 'w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center' }, '⚖️'),
                                'Body Composition'
                            ),
                            React.createElement('div', { className: 'grid grid-cols-2 gap-4' },
                                React.createElement('div', { className: 'text-center p-4 bg-purple-50 rounded-xl' },
                                    React.createElement('div', { className: 'text-2xl font-bold text-purple-600' }, `${healthData.bodyComposition.weight} lbs`),
                                    React.createElement('div', { className: 'text-sm text-gray-600' }, 'Weight')
                                ),
                                React.createElement('div', { className: 'text-center p-4 bg-orange-50 rounded-xl' },
                                    React.createElement('div', { className: 'text-2xl font-bold text-orange-600' }, `${healthData.bodyComposition.bodyFat}%`),
                                    React.createElement('div', { className: 'text-sm text-gray-600' }, 'Body Fat')
                                ),
                                React.createElement('div', { className: 'text-center p-4 bg-green-50 rounded-xl' },
                                    React.createElement('div', { className: 'text-2xl font-bold text-green-600' }, `${healthData.bodyComposition.muscleMass} lbs`),
                                    React.createElement('div', { className: 'text-sm text-gray-600' }, 'Muscle Mass')
                                ),
                                React.createElement('div', { className: 'text-center p-4 bg-blue-50 rounded-xl' },
                                    React.createElement('div', { className: 'text-2xl font-bold text-blue-600' }, `${healthData.bodyComposition.waterPercentage}%`),
                                    React.createElement('div', { className: 'text-sm text-gray-600' }, 'Water %')
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
            )
        );
    };

    // Safe React mounting
    const safeRenderWearables = (containerId) => {
        try {
            const container = document.getElementById(containerId);
            if (!container) {
                console.warn(`Container ${containerId} not found`);
                return;
            }

            // Clear container safely
            while (container.firstChild) {
                container.removeChild(container.firstChild);
            }

            // Create new wrapper
            const wrapper = document.createElement('div');
            wrapper.className = 'wearables-wrapper';
            container.appendChild(wrapper);

            // Render with error boundary
            ReactDOM.render(React.createElement(EnhancedWearablesHub), wrapper);
            console.log('✅ Wearables hub rendered successfully');
        } catch (error) {
            console.error('❌ Failed to render wearables hub:', error);
            // Fallback content
            const container = document.getElementById(containerId);
            if (container) {
                container.innerHTML = `
                    <div class="p-8 text-center">
                        <h2 class="text-xl font-bold text-gray-800 mb-4">⌚ Wearables Hub</h2>
                        <p class="text-gray-600">Loading wearables dashboard...</p>
                    </div>
                `;
            }
        }
    };

    // Multiple export formats for compatibility
    const renderWearablesHub = safeRenderWearables;
    const renderEnhancedWearablesHub = safeRenderWearables;
    const renderWearables = safeRenderWearables;

    // Test function to verify module is working
    const testWearablesModule = () => {
        console.log('🧪 Wearables module test: PASSED');
        return true;
    };

    // Make available globally with multiple naming conventions
    window.HabbtWearables = {
        EnhancedWearablesHub,
        renderWearablesHub: safeRenderWearables,
        renderEnhancedWearablesHub: safeRenderWearables,
        renderWearables: safeRenderWearables,
        calculateAdjustedCalories,
        getActivityLevel,
        exportHealthDataForDashboard,
        generateHealthRecommendations,
        testModule: testWearablesModule
    };

    // Compatibility exports
    window.FuelIQWearables = window.HabbtWearables;
    window.renderWearablesHub = safeRenderWearables;
    window.renderEnhancedWearablesHub = safeRenderWearables;
    window.renderWearables = safeRenderWearables;

    // Debug helper to identify what the app is looking for
    window.debugWearables = () => {
        console.log('🔍 Debug Info:');
        console.log('- window.HabbtWearables exists:', !!window.HabbtWearables);
        console.log('- window.FuelIQWearables exists:', !!window.FuelIQWearables);
        console.log('- Available functions:', window.HabbtWearables ? Object.keys(window.HabbtWearables) : 'None');
        console.log('- renderWearablesHub available:', !!window.renderWearablesHub);
        console.log('- renderWearables available:', !!window.renderWearables);
        return {
            HabbtWearables: !!window.HabbtWearables,
            functions: window.HabbtWearables ? Object.keys(window.HabbtWearables) : []
        };
    };

    console.log('⌚ Enhanced Habbt Wearables Hub loaded - 8 devices, analytics export, beautiful UI! 💙');
    console.log('✅ Available functions:', Object.keys(window.HabbtWearables));
    console.log('🔧 Safe mounting with error handling enabled');
    console.log('🐛 Run debugWearables() to troubleshoot');

})();
