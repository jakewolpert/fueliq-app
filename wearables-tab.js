// wearables-tab.js - FuelIQ Wearables Integration with Demo Support
(function() {
    'use strict';
    
    // Prevent multiple loading
    if (window.FuelIQWearables) {
        return;
    }

    // Demo mode detection
    const isDemoMode = () => {
        return window.TerryDemo && window.TerryDemo.utils && window.TerryDemo.utils.getDemoStatus();
    };

    // Terry's Garmin Forerunner 955 Demo Data
    const TERRY_WEARABLE_DATA = {
        device: {
            name: "Garmin Forerunner 955",
            type: "smartwatch",
            brand: "Garmin",
            model: "Forerunner 955",
            batteryLevel: 74,
            lastSync: "2025-06-13T08:15:00Z",
            firmwareVersion: "20.26",
            connected: true
        },
        todayStats: {
            steps: 8247,
            stepsGoal: 10000,
            activeMinutes: 32,
            activeGoal: 45,
            caloriesBurned: 1847,
            caloriesGoal: 2200,
            distance: 3.2, // miles
            floors: 12,
            heartRate: {
                current: 72,
                resting: 58,
                max: 186,
                zones: {
                    fat_burn: 45, // minutes
                    cardio: 28,
                    peak: 8
                }
            }
        },
        sleepData: {
            totalSleep: 7.8, // hours
            sleepGoal: 8.0,
            deepSleep: 1.4,
            lightSleep: 5.2,
            remSleep: 1.2,
            sleepScore: 83,
            bedtime: "22:45",
            wakeTime: "06:30",
            efficiency: 92
        },
        weeklyStats: {
            totalSteps: 58394,
            totalActiveMinutes: 248,
            totalCalories: 12890,
            averageHeartRate: 68,
            totalDistance: 23.1,
            workouts: 4
        },
        recentWorkouts: [
            {
                date: "2025-06-13",
                type: "Running",
                duration: 28, // minutes
                distance: 3.2,
                calories: 298,
                avgHeartRate: 154,
                maxHeartRate: 172
            },
            {
                date: "2025-06-12",
                type: "Cycling",
                duration: 45,
                distance: 12.8,
                calories: 456,
                avgHeartRate: 142,
                maxHeartRate: 165
            },
            {
                date: "2025-06-11",
                type: "Strength Training",
                duration: 35,
                distance: 0,
                calories: 234,
                avgHeartRate: 118,
                maxHeartRate: 148
            }
        ],
        healthMetrics: {
            vo2Max: 52,
            bodyBattery: 68,
            stress: 22, // lower is better
            respirationRate: 14,
            pulseOx: 98,
            trainingStatus: "Productive",
            trainingLoad: 142
        }
    };

    // Available wearable devices (for personal mode)
    const AVAILABLE_DEVICES = [
        { name: "Apple Watch Series 9", brand: "Apple", type: "smartwatch" },
        { name: "Fitbit Versa 4", brand: "Fitbit", type: "fitness_tracker" },
        { name: "Garmin Forerunner 955", brand: "Garmin", type: "smartwatch" },
        { name: "Samsung Galaxy Watch 6", brand: "Samsung", type: "smartwatch" },
        { name: "WHOOP 4.0", brand: "WHOOP", type: "fitness_tracker" },
        { name: "Oura Ring Gen3", brand: "Oura", type: "smart_ring" },
        { name: "Polar Vantage V3", brand: "Polar", type: "smartwatch" }
    ];

    // Safe storage functions
    const isLocalStorageAvailable = () => {
        try {
            const test = '__localStorage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch(e) {
            return false;
        }
    };

    const safeStorage = {
        getItem: (key) => {
            if (isLocalStorageAvailable()) {
                return localStorage.getItem(key);
            }
            return null;
        },
        setItem: (key, value) => {
            if (isLocalStorageAvailable()) {
                try {
                    localStorage.setItem(key, value);
                } catch(e) {
                    console.warn('Storage quota exceeded');
                }
            }
        }
    };

    // Get wearable data based on mode
    const getWearableData = () => {
        if (isDemoMode()) {
            return TERRY_WEARABLE_DATA;
        }
        
        // Load personal data from storage
        const stored = safeStorage.getItem('user_wearable_data');
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch(e) {
                console.warn('Error loading wearable data:', e);
            }
        }
        
        return null; // No device connected in personal mode
    };

    // Save wearable data (only in personal mode)
    const saveWearableData = (data) => {
        if (!isDemoMode()) {
            safeStorage.setItem('user_wearable_data', JSON.stringify(data));
        }
    };

    // Calculate progress percentage
    const calculateProgress = (current, goal) => {
        return Math.min(100, Math.round((current / goal) * 100));
    };

    // Format time duration
    const formatDuration = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
    };

    // Create progress bar HTML
    const createProgressBar = (current, goal, color = 'blue') => {
        const percentage = calculateProgress(current, goal);
        return `
            <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-${color}-500 h-2 rounded-full transition-all duration-300" style="width: ${percentage}%"></div>
            </div>
        `;
    };

    // Render device connection status
    const renderDeviceStatus = () => {
        const data = getWearableData();
        const statusContainer = document.getElementById('device-status');
        
        if (!statusContainer) return;

        if (data && data.device) {
            const device = data.device;
            const lastSyncTime = new Date(device.lastSync).toLocaleTimeString();
            
            statusContainer.innerHTML = `
                <div class="bg-white p-6 rounded-lg shadow-sm border">
                    ${isDemoMode() ? '<div class="flex items-center justify-between mb-4"><h3 class="text-lg font-semibold text-gray-900">Connected Device</h3><span class="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">🎭 DEMO</span></div>' : '<h3 class="text-lg font-semibold text-gray-900 mb-4">Connected Device</h3>'}
                    <div class="flex items-center space-x-4">
                        <div class="text-4xl">⌚</div>
                        <div class="flex-1">
                            <h4 class="font-medium text-gray-900">${device.name}</h4>
                            <p class="text-sm text-gray-500">${device.brand} • ${device.model}</p>
                            <div class="flex items-center space-x-4 mt-2">
                                <span class="flex items-center text-sm ${device.connected ? 'text-green-600' : 'text-red-600'}">
                                    <div class="w-2 h-2 rounded-full ${device.connected ? 'bg-green-500' : 'bg-red-500'} mr-2"></div>
                                    ${device.connected ? 'Connected' : 'Disconnected'}
                                </span>
                                <span class="text-sm text-gray-500">Battery: ${device.batteryLevel}%</span>
                                <span class="text-sm text-gray-500">Last sync: ${lastSyncTime}</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        } else {
            statusContainer.innerHTML = `
                <div class="bg-white p-6 rounded-lg shadow-sm border">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Connect Your Device</h3>
                    <p class="text-gray-600 mb-4">Connect your wearable device to track your health and fitness data.</p>
                    <button onclick="window.FuelIQWearables.showDeviceSetup()" 
                            class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">
                        Connect Device
                    </button>
                </div>
            `;
        }
    };

    // Render today's stats
    const renderTodayStats = () => {
        const data = getWearableData();
        const statsContainer = document.getElementById('today-stats');
        
        if (!statsContainer || !data || !data.todayStats) return;

        const stats = data.todayStats;
        
        statsContainer.innerHTML = `
            <div class="bg-white p-6 rounded-lg shadow-sm border">
                ${isDemoMode() ? '<div class="flex items-center justify-between mb-4"><h3 class="text-lg font-semibold text-gray-900">Today\'s Activity</h3><span class="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">🎭 DEMO</span></div>' : '<h3 class="text-lg font-semibold text-gray-900 mb-4">Today\'s Activity</h3>'}
                
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div class="text-center">
                        <div class="text-2xl mb-2">👟</div>
                        <div class="text-2xl font-bold text-blue-600">${stats.steps.toLocaleString()}</div>
                        <div class="text-sm text-gray-500">of ${stats.stepsGoal.toLocaleString()} steps</div>
                        ${createProgressBar(stats.steps, stats.stepsGoal, 'blue')}
                    </div>
                    
                    <div class="text-center">
                        <div class="text-2xl mb-2">⚡</div>
                        <div class="text-2xl font-bold text-green-600">${stats.activeMinutes}</div>
                        <div class="text-sm text-gray-500">of ${stats.activeGoal} min active</div>
                        ${createProgressBar(stats.activeMinutes, stats.activeGoal, 'green')}
                    </div>
                    
                    <div class="text-center">
                        <div class="text-2xl mb-2">🔥</div>
                        <div class="text-2xl font-bold text-red-600">${stats.caloriesBurned}</div>
                        <div class="text-sm text-gray-500">of ${stats.caloriesGoal} calories</div>
                        ${createProgressBar(stats.caloriesBurned, stats.caloriesGoal, 'red')}
                    </div>
                    
                    <div class="text-center">
                        <div class="text-2xl mb-2">📍</div>
                        <div class="text-2xl font-bold text-purple-600">${stats.distance}</div>
                        <div class="text-sm text-gray-500">miles traveled</div>
                    </div>
                </div>
                
                <div class="mt-6 pt-4 border-t">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-2">
                            <span class="text-red-500">❤️</span>
                            <span class="font-medium">Heart Rate</span>
                        </div>
                        <div class="text-right">
                            <div class="text-lg font-bold">${stats.heartRate.current} BPM</div>
                            <div class="text-sm text-gray-500">Resting: ${stats.heartRate.resting}</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    };

    // Render sleep data
    const renderSleepData = () => {
        const data = getWearableData();
        const sleepContainer = document.getElementById('sleep-data');
        
        if (!sleepContainer || !data || !data.sleepData) return;

        const sleep = data.sleepData;
        
        sleepContainer.innerHTML = `
            <div class="bg-white p-6 rounded-lg shadow-sm border">
                ${isDemoMode() ? '<div class="flex items-center justify-between mb-4"><h3 class="text-lg font-semibold text-gray-900">Sleep Analysis</h3><span class="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">🎭 DEMO</span></div>' : '<h3 class="text-lg font-semibold text-gray-900 mb-4">Sleep Analysis</h3>'}
                
                <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                    <div class="text-center">
                        <div class="text-3xl font-bold text-blue-600">${sleep.totalSleep}h</div>
                        <div class="text-sm text-gray-500">Total Sleep</div>
                        ${createProgressBar(sleep.totalSleep * 60, sleep.sleepGoal * 60, 'blue')}
                    </div>
                    
                    <div class="text-center">
                        <div class="text-3xl font-bold text-purple-600">${sleep.sleepScore}</div>
                        <div class="text-sm text-gray-500">Sleep Score</div>
                        ${createProgressBar(sleep.sleepScore, 100, 'purple')}
                    </div>
                    
                    <div class="text-center">
                        <div class="text-3xl font-bold text-green-600">${sleep.efficiency}%</div>
                        <div class="text-sm text-gray-500">Efficiency</div>
                        ${createProgressBar(sleep.efficiency, 100, 'green')}
                    </div>
                </div>
                
                <div class="grid grid-cols-3 gap-4 text-center text-sm">
                    <div>
                        <div class="font-medium text-gray-900">${sleep.deepSleep}h</div>
                        <div class="text-gray-500">Deep</div>
                    </div>
                    <div>
                        <div class="font-medium text-gray-900">${sleep.lightSleep}h</div>
                        <div class="text-gray-500">Light</div>
                    </div>
                    <div>
                        <div class="font-medium text-gray-900">${sleep.remSleep}h</div>
                        <div class="text-gray-500">REM</div>
                    </div>
                </div>
                
                <div class="mt-4 pt-4 border-t flex justify-between text-sm text-gray-600">
                    <span>Bedtime: ${sleep.bedtime}</span>
                    <span>Wake: ${sleep.wakeTime}</span>
                </div>
            </div>
        `;
    };

    // Render recent workouts
    const renderRecentWorkouts = () => {
        const data = getWearableData();
        const workoutsContainer = document.getElementById('recent-workouts');
        
        if (!workoutsContainer || !data || !data.recentWorkouts) return;

        workoutsContainer.innerHTML = `
            <div class="bg-white p-6 rounded-lg shadow-sm border">
                ${isDemoMode() ? '<div class="flex items-center justify-between mb-4"><h3 class="text-lg font-semibold text-gray-900">Recent Workouts</h3><span class="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">🎭 DEMO</span></div>' : '<h3 class="text-lg font-semibold text-gray-900 mb-4">Recent Workouts</h3>'}
                
                <div class="space-y-3">
                    ${data.recentWorkouts.map(workout => {
                        const workoutIcon = {
                            'Running': '🏃‍♂️',
                            'Cycling': '🚴‍♂️',
                            'Strength Training': '💪',
                            'Swimming': '🏊‍♂️',
                            'Yoga': '🧘‍♂️'
                        };
                        
                        return `
                            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div class="flex items-center space-x-3">
                                    <div class="text-2xl">${workoutIcon[workout.type] || '🏋️‍♂️'}</div>
                                    <div>
                                        <div class="font-medium text-gray-900">${workout.type}</div>
                                        <div class="text-sm text-gray-500">${new Date(workout.date).toLocaleDateString()}</div>
                                    </div>
                                </div>
                                <div class="text-right">
                                    <div class="text-sm font-medium">${formatDuration(workout.duration)}</div>
                                    <div class="text-sm text-gray-500">${workout.calories} cal</div>
                                    ${workout.distance > 0 ? `<div class="text-sm text-gray-500">${workout.distance} mi</div>` : ''}
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    };

    // Show device setup modal
    const showDeviceSetup = () => {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white p-6 rounded-lg max-w-md w-full mx-4">
                <h3 class="text-lg font-semibold mb-4">Connect Wearable Device</h3>
                <p class="text-gray-600 mb-4">Select your device to begin syncing health and fitness data:</p>
                
                <div class="space-y-2 mb-4">
                    ${AVAILABLE_DEVICES.map(device => `
                        <div class="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer" 
                             onclick="window.FuelIQWearables.connectDevice('${device.name}', '${device.brand}')">
                            <div class="text-2xl mr-3">⌚</div>
                            <div>
                                <div class="font-medium">${device.name}</div>
                                <div class="text-sm text-gray-500">${device.brand}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="flex space-x-3">
                    <button onclick="this.closest('.fixed').remove()" 
                            class="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                        Cancel
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    };

    // Connect device (simulate)
    const connectDevice = (deviceName, brand) => {
        if (isDemoMode()) {
            alert('Demo mode: Device connection simulated');
            return;
        }
        
        // Simulate device connection
        const deviceData = {
            device: {
                name: deviceName,
                type: "smartwatch",
                brand: brand,
                model: deviceName,
                batteryLevel: Math.floor(Math.random() * 30) + 70, // 70-100%
                lastSync: new Date().toISOString(),
                firmwareVersion: "1.0.0",
                connected: true
            },
            todayStats: {
                steps: Math.floor(Math.random() * 5000) + 3000,
                stepsGoal: 10000,
                activeMinutes: Math.floor(Math.random() * 30) + 15,
                activeGoal: 45,
                caloriesBurned: Math.floor(Math.random() * 800) + 1200,
                caloriesGoal: 2000,
                distance: Math.random() * 3 + 1,
                floors: Math.floor(Math.random() * 15) + 5,
                heartRate: {
                    current: Math.floor(Math.random() * 20) + 65,
                    resting: Math.floor(Math.random() * 10) + 55,
                    max: 180,
                    zones: {
                        fat_burn: Math.floor(Math.random() * 30) + 20,
                        cardio: Math.floor(Math.random() * 20) + 10,
                        peak: Math.floor(Math.random() * 10) + 2
                    }
                }
            },
            sleepData: {
                totalSleep: Math.random() * 2 + 6.5,
                sleepGoal: 8.0,
                deepSleep: Math.random() * 0.5 + 1,
                lightSleep: Math.random() * 1 + 4,
                remSleep: Math.random() * 0.5 + 1,
                sleepScore: Math.floor(Math.random() * 20) + 70,
                bedtime: "22:30",
                wakeTime: "06:45",
                efficiency: Math.floor(Math.random() * 10) + 85
            }
        };
        
        saveWearableData(deviceData);
        
        // Close modal and refresh display
        document.querySelector('.fixed')?.remove();
        initWearables();
        
        alert(`${deviceName} connected successfully!`);
    };

    // Initialize wearables module
    const initWearables = () => {
        renderDeviceStatus();
        renderTodayStats();
        renderSleepData();
        renderRecentWorkouts();
    };

    // Public API
    window.FuelIQWearables = {
        init: initWearables,
        showDeviceSetup: showDeviceSetup,
        connectDevice: connectDevice,
        getData: getWearableData,
        isDemoMode: isDemoMode
    };

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initWearables);
    } else {
        initWearables();
    }

    console.log('✅ Enhanced Wearables Module with Demo Integration Loaded');
})();
