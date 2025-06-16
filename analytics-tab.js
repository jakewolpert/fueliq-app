// Enhanced Analytics Tab for FuelIQ - analytics-tab.js
window.FuelIQAnalytics = (function() {
  let currentContainer = null;
  let wearableConnected = false; // This would be set by the wearables module

  // Check if wearables are connected (mock detection for now)
  function checkWearableConnection() {
    // In real app, this would check actual device connections
    const mockConnected = localStorage.getItem('fueliq_wearable_connected') === 'true';
    return mockConnected;
  }

  // Activity types for manual entry
  const activityTypes = [
    'Rest Day',
    'Walking',
    'Running',
    'Cycling',
    'Weight Training',
    'Yoga',
    'Swimming',
    'HIIT',
    'Sports',
    'Other'
  ];

  // Mood and energy options
  const moodOptions = [
    { value: 1, label: '😢 Very Poor', emoji: '😢' },
    { value: 2, label: '😔 Poor', emoji: '😔' },
    { value: 3, label: '😐 Below Average', emoji: '😐' },
    { value: 4, label: '🙂 Average', emoji: '🙂' },
    { value: 5, label: '😊 Good', emoji: '😊' },
    { value: 6, label: '😃 Very Good', emoji: '😃' },
    { value: 7, label: '😄 Great', emoji: '😄' },
    { value: 8, label: '🤩 Excellent', emoji: '🤩' },
    { value: 9, label: '🥳 Amazing', emoji: '🥳' },
    { value: 10, label: '🚀 Incredible', emoji: '🚀' }
  ];

  const energyOptions = [
    { value: 1, label: '🔋 Exhausted', emoji: '🔋' },
    { value: 2, label: '😴 Very Low', emoji: '😴' },
    { value: 3, label: '🥱 Low', emoji: '🥱' },
    { value: 4, label: '😐 Below Average', emoji: '😐' },
    { value: 5, label: '🙂 Average', emoji: '🙂' },
    { value: 6, label: '😊 Good', emoji: '😊' },
    { value: 7, label: '⚡ High', emoji: '⚡' },
    { value: 8, label: '🔥 Very High', emoji: '🔥' },
    { value: 9, label: '💪 Energized', emoji: '💪' },
    { value: 10, label: '🚀 Peak Energy', emoji: '🚀' }
  ];

  const stressOptions = [
    { value: 1, label: '😌 Very Low', emoji: '😌' },
    { value: 2, label: '🙂 Low', emoji: '🙂' },
    { value: 3, label: '😐 Mild', emoji: '😐' },
    { value: 4, label: '😕 Moderate', emoji: '😕' },
    { value: 5, label: '😰 High', emoji: '😰' },
    { value: 6, label: '😫 Very High', emoji: '😫' }
  ];

  // Get today's date key
  function getTodayKey() {
    return new Date().toISOString().split('T')[0];
  }

  // Load today's journal entry
  function loadTodayEntry() {
    const key = `fueliq_journal_${getTodayKey()}`;
    try {
      return JSON.parse(localStorage.getItem(key) || '{}');
    } catch (e) {
      return {};
    }
  }

  // Save journal entry
  function saveJournalEntry(data) {
    const key = `fueliq_journal_${getTodayKey()}`;
    try {
      localStorage.setItem(key, JSON.stringify({
        ...data,
        timestamp: new Date().toISOString(),
        date: getTodayKey()
      }));
      
      // Refresh insights after saving
      setTimeout(() => {
        renderAIInsights();
      }, 500);
      
      return true;
    } catch (e) {
      console.error('Failed to save journal entry:', e);
      return false;
    }
  }

  // Get nutrition data for today
  function getTodayNutrition() {
    const key = `fueliq_meals_${getTodayKey()}`;
    try {
      const data = JSON.parse(localStorage.getItem(key) || '{}');
      const allFoods = [...(data.breakfast||[]), ...(data.lunch||[]), ...(data.dinner||[]), ...(data.snacks||[])];
      return allFoods.reduce((acc, item) => {
        const mult = (item.servingSize || 100) / 100;
        return {
          calories: acc.calories + ((item.calories || 0) * mult),
          protein: acc.protein + ((item.protein || 0) * mult),
          carbs: acc.carbs + ((item.carbs || 0) * mult),
          fat: acc.fat + ((item.fat || 0) * mult),
          fiber: acc.fiber + ((item.fiber || 0) * mult),
          mealCount: allFoods.length
        };
      }, { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, mealCount: 0 });
    } catch (e) {
      return { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, mealCount: 0 };
    }
  }

  // Get historical journal data for insights
  function getHistoricalData(days = 7) {
    const data = [];
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split('T')[0];
      
      const journalKey = `fueliq_journal_${dateKey}`;
      const mealsKey = `fueliq_meals_${dateKey}`;
      
      try {
        const journal = JSON.parse(localStorage.getItem(journalKey) || '{}');
        const meals = JSON.parse(localStorage.getItem(mealsKey) || '{}');
        
        data.push({
          date: dateKey,
          journal,
          meals
        });
      } catch (e) {
        data.push({ date: dateKey, journal: {}, meals: {} });
      }
    }
    return data;
  }

  // AI Insights Analysis
  function generateAIInsights() {
    const historicalData = getHistoricalData(7);
    const todayNutrition = getTodayNutrition();
    const todayJournal = loadTodayEntry();
    
    const insights = [];
    
    // Analyze water intake patterns
    const waterLevels = historicalData.map(d => d.journal.water || 0).filter(w => w > 0);
    if (waterLevels.length > 0) {
      const avgWater = waterLevels.reduce((a, b) => a + b, 0) / waterLevels.length;
      if (avgWater < 40) {
        insights.push({
          type: 'warning',
          icon: '💧',
          title: 'Low Water Intake Pattern',
          message: `Your average water intake is ${Math.round(avgWater)}oz/day. Low hydration can cause headaches, fatigue, and poor concentration. Try setting hourly reminders to drink water.`,
          priority: 'high'
        });
      }
    }

    // Analyze mood and energy correlation
    const moodEnergyData = historicalData.filter(d => d.journal.mood && d.journal.energy);
    if (moodEnergyData.length >= 3) {
      const lowEnergyDays = moodEnergyData.filter(d => d.journal.energy <= 4).length;
      const lowMoodDays = moodEnergyData.filter(d => d.journal.mood <= 4).length;
      
      if (lowEnergyDays >= 3) {
        insights.push({
          type: 'concern',
          icon: '🔋',
          title: 'Energy Level Concerns',
          message: `You've had low energy ${lowEnergyDays} out of ${moodEnergyData.length} days. Consider increasing protein intake, ensuring adequate sleep, and spacing meals more evenly throughout the day.`,
          priority: 'medium'
        });
      }
      
      if (lowMoodDays >= 3) {
        insights.push({
          type: 'concern',
          icon: '😔',
          title: 'Mood Pattern Notice',
          message: `Your mood has been lower than usual. Regular exercise, social connection, and consistent meal timing can help stabilize mood. Consider speaking with a healthcare provider if this continues.`,
          priority: 'medium'
        });
      }
    }

    // Analyze meal timing and frequency
    if (todayNutrition.mealCount > 0) {
      if (todayNutrition.mealCount <= 2) {
        insights.push({
          type: 'suggestion',
          icon: '🍽️',
          title: 'Meal Frequency Recommendation',
          message: `You've only logged ${todayNutrition.mealCount} meal(s) today. Spacing meals too far apart can cause energy crashes, headaches, and overeating. Try eating every 3-4 hours.`,
          priority: 'medium'
        });
      }
      
      if (todayNutrition.calories < 1200) {
        insights.push({
          type: 'warning',
          icon: '⚠️',
          title: 'Very Low Calorie Intake',
          message: `Today's intake is only ${Math.round(todayNutrition.calories)} calories. This may be too low for most people and can cause fatigue, headaches, and metabolic slowdown.`,
          priority: 'high'
        });
      }
    }

    // Analyze stress patterns
    const stressLevels = historicalData.map(d => d.journal.stress || 0).filter(s => s > 0);
    if (stressLevels.length > 0) {
      const avgStress = stressLevels.reduce((a, b) => a + b, 0) / stressLevels.length;
      if (avgStress >= 4) {
        insights.push({
          type: 'concern',
          icon: '😰',
          title: 'Elevated Stress Levels',
          message: `Your stress has been consistently high (avg ${avgStress.toFixed(1)}/6). High stress can affect digestion, sleep, and food choices. Consider stress management techniques like meditation or exercise.`,
          priority: 'high'
        });
      }
    }

    // Analyze sleep patterns
    const sleepData = historicalData.map(d => d.journal.sleep || 0).filter(s => s > 0);
    if (sleepData.length > 0) {
      const avgSleep = sleepData.reduce((a, b) => a + b, 0) / sleepData.length;
      if (avgSleep < 7) {
        insights.push({
          type: 'warning',
          icon: '😴',
          title: 'Insufficient Sleep Pattern',
          message: `You're averaging ${avgSleep.toFixed(1)} hours of sleep. Poor sleep can increase hunger hormones, reduce willpower around food, and lower energy levels.`,
          priority: 'high'
        });
      }
    }

    // Cross-correlate patterns (headaches example)
    const journalEntries = historicalData.filter(d => d.journal.notes && d.journal.notes.toLowerCase().includes('headache'));
    if (journalEntries.length >= 2) {
      const headacheDays = journalEntries.map(d => ({
        date: d.date,
        water: d.journal.water || 0,
        sleep: d.journal.sleep || 0,
        stress: d.journal.stress || 0
      }));
      
      const lowWaterHeadaches = headacheDays.filter(d => d.water < 40).length;
      const lowSleepHeadaches = headacheDays.filter(d => d.sleep < 7).length;
      
      if (lowWaterHeadaches >= 2 || lowSleepHeadaches >= 2) {
        insights.push({
          type: 'insight',
          icon: '🧠',
          title: 'Headache Pattern Analysis',
          message: `You've mentioned headaches ${journalEntries.length} times recently. ${lowWaterHeadaches >= 2 ? 'Low water intake' : ''} ${lowWaterHeadaches >= 2 && lowSleepHeadaches >= 2 ? 'and' : ''} ${lowSleepHeadaches >= 2 ? 'insufficient sleep' : ''} appear to be contributing factors.`,
          priority: 'high'
        });
      }
    }

    // Positive insights
    if (todayJournal.mood >= 7 && todayJournal.energy >= 7) {
      insights.push({
        type: 'positive',
        icon: '🌟',
        title: 'Great Day!',
        message: `Your mood and energy are both high today! Keep up whatever you're doing - this is a great pattern to maintain.`,
        priority: 'low'
      });
    }

    // Sort by priority
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return insights.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
  }

  // Render AI Insights
  function renderAIInsights() {
    const container = document.getElementById('ai-insights-container');
    if (!container) return;

    const insights = generateAIInsights();
    
    if (insights.length === 0) {
      container.innerHTML = `
        <div class="text-center py-8">
          <div class="text-4xl mb-4">🤖</div>
          <h3 class="text-lg font-bold text-gray-700 mb-2">AI Analysis</h3>
          <p class="text-gray-600">Log more data to get personalized insights and recommendations!</p>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="space-y-4">
        <div class="text-center mb-6">
          <h3 class="text-xl font-bold text-gray-800 flex items-center justify-center">
            <span class="mr-2 text-2xl">🤖</span>
            AI Health Insights
          </h3>
          <p class="text-sm text-gray-600 mt-2">Personalized analysis based on your recent data</p>
        </div>
        
        ${insights.map(insight => `
          <div class="p-4 rounded-2xl border-2 ${
            insight.type === 'warning' ? 'border-red-200 bg-red-50' :
            insight.type === 'concern' ? 'border-yellow-200 bg-yellow-50' :
            insight.type === 'positive' ? 'border-green-200 bg-green-50' :
            'border-blue-200 bg-blue-50'
          }">
            <div class="flex items-start space-x-3">
              <div class="text-2xl">${insight.icon}</div>
              <div class="flex-1">
                <h4 class="font-bold text-gray-800 mb-2">${insight.title}</h4>
                <p class="text-sm text-gray-700 leading-relaxed">${insight.message}</p>
              </div>
              <div class="text-xs px-2 py-1 rounded-full ${
                insight.priority === 'high' ? 'bg-red-100 text-red-700' :
                insight.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                'bg-blue-100 text-blue-700'
              }">
                ${insight.priority}
              </div>
            </div>
          </div>
        `).join('')}
        
        <div class="text-center mt-6 p-4 bg-gray-50 rounded-xl">
          <p class="text-xs text-gray-600">
            💡 These insights are generated from your logged data patterns. For medical concerns, consult a healthcare professional.
          </p>
        </div>
      </div>
    `;
  }

  // Render Today's Summary
  function renderTodaysSummary() {
    const nutrition = getTodayNutrition();
    const journal = loadTodayEntry();
    const userGoals = JSON.parse(localStorage.getItem('fueliq_user_goals') || '{}');

    return `
      <div class="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20">
        <h3 class="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <span class="mr-3 text-2xl">📊</span>
          Today's Summary
        </h3>
        
        <div class="space-y-4">
          <div class="flex justify-between items-center p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl">
            <span class="flex items-center text-gray-700 font-medium">
              <span class="mr-2 text-lg">🍽️</span>
              Calories
            </span>
            <span class="font-bold text-orange-600 text-lg">${Math.round(nutrition.calories || 0)}</span>
          </div>
          
          <div class="flex justify-between items-center p-3 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl">
            <span class="flex items-center text-gray-700 font-medium">
              <span class="mr-2 text-lg">💧</span>
              Water
            </span>
            <span class="font-bold text-cyan-600 text-lg">${journal.water || 0} oz</span>
          </div>
          
          <div class="flex justify-between items-center p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
            <span class="flex items-center text-gray-700 font-medium">
              <span class="mr-2 text-lg">😴</span>
              Sleep
            </span>
            <span class="font-bold text-purple-600 text-lg">${journal.sleep || 0}h</span>
          </div>
          
          <div class="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
            <span class="flex items-center text-gray-700 font-medium">
              <span class="mr-2 text-lg">😊</span>
              Mood
            </span>
            <span class="font-bold text-green-600 text-lg">${journal.mood || 0}/10</span>
          </div>
          
          <div class="flex justify-between items-center p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl">
            <span class="flex items-center text-gray-700 font-medium">
              <span class="mr-2 text-lg">⚡</span>
              Energy
            </span>
            <span class="font-bold text-yellow-600 text-lg">${journal.energy || 0}/10</span>
          </div>
        </div>
      </div>
    `;
  }

  // Render Today's Journal
  function renderTodaysJournal() {
    const today = loadTodayEntry();
    wearableConnected = checkWearableConnection();

    return `
      <div class="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20">
        <h3 class="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <span class="mr-3 text-2xl">📝</span>
          Today's Journal
        </h3>
        
        ${wearableConnected ? `
          <div class="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl">
            <div class="flex items-center text-green-700">
              <span class="mr-2 text-lg">⌚</span>
              <span class="font-medium">Wearable Connected - Some data auto-synced</span>
            </div>
          </div>
        ` : ''}
        
        <form id="journal-form" class="space-y-6">
          <!-- Journal Notes -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-3">How are you feeling today?</label>
            <textarea
              id="journal-notes"
              rows="4"
              class="w-full px-4 py-3 bg-white/70 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all duration-200 resize-none"
              placeholder="Describe your mood, energy, challenges, wins..."
            >${today.notes || ''}</textarea>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Sleep (auto if wearable, manual otherwise) -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-3">
                😴 Sleep ${wearableConnected ? '(Auto-synced)' : '(Hours)'}
              </label>
              ${wearableConnected ? `
                <div class="px-4 py-3 bg-green-50 border-2 border-green-200 rounded-xl">
                  <span class="font-bold text-green-700">${today.sleep || 8.2}h from device</span>
                </div>
              ` : `
                <input
                  type="number"
                  id="sleep-input"
                  step="0.5"
                  min="0"
                  max="24"
                  value="${today.sleep || ''}"
                  class="w-full px-4 py-3 bg-white/70 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-200"
                  placeholder="8.0"
                />
              `}
            </div>

            <!-- Water (always manual) -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-3">💧 Water (oz)</label>
              <input
                type="number"
                id="water-input"
                min="0"
                max="200"
                value="${today.water || ''}"
                class="w-full px-4 py-3 bg-white/70 border-2 border-gray-200 rounded-xl focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20 transition-all duration-200"
                placeholder="64"
              />
            </div>

            <!-- Activity Type (only if no wearable) -->
            ${!wearableConnected ? `
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-3">🏃‍♂️ Activity Type</label>
                <select
                  id="activity-type"
                  class="w-full px-4 py-3 bg-white/70 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all duration-200"
                >
                  <option value="">Select activity...</option>
                  ${activityTypes.map(type => `
                    <option value="${type}" ${today.activityType === type ? 'selected' : ''}>${type}</option>
                  `).join('')}
                </select>
              </div>

              <!-- Strain (only if no wearable) -->
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-3">💪 Strain Level (1-10)</label>
                <input
                  type="number"
                  id="strain-input"
                  min="1"
                  max="10"
                  value="${today.strain || ''}"
                  class="w-full px-4 py-3 bg-white/70 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-500/20 transition-all duration-200"
                  placeholder="5"
                />
              </div>
            ` : ''}

            <!-- Stress Level -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-3">Stress Level</label>
              <select
                id="stress-level"
                class="w-full px-4 py-3 bg-white/70 border-2 border-gray-200 rounded-xl focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/20 transition-all duration-200"
              >
                <option value="">Select stress level...</option>
                ${stressOptions.map(option => `
                  <option value="${option.value}" ${today.stress === option.value ? 'selected' : ''}>
                    ${option.label}
                  </option>
                `).join('')}
              </select>
            </div>

            <!-- Mood -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-3">😊 Mood (1-10)</label>
              <select
                id="mood-rating"
                class="w-full px-4 py-3 bg-white/70 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all duration-200"
              >
                <option value="">Select mood...</option>
                ${moodOptions.map(option => `
                  <option value="${option.value}" ${today.mood === option.value ? 'selected' : ''}>
                    ${option.label}
                  </option>
                `).join('')}
              </select>
            </div>

            <!-- Energy -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-3">⚡ Energy (1-10)</label>
              <select
                id="energy-rating"
                class="w-full px-4 py-3 bg-white/70 border-2 border-gray-200 rounded-xl focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/20 transition-all duration-200"
              >
                <option value="">Select energy level...</option>
                ${energyOptions.map(option => `
                  <option value="${option.value}" ${today.energy === option.value ? 'selected' : ''}>
                    ${option.label}
                  </option>
                `).join('')}
              </select>
            </div>
          </div>

          <!-- Save Button -->
          <button
            type="submit"
            class="w-full px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl hover:from-green-600 hover:to-emerald-700 font-bold text-lg shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center"
          >
            <span class="mr-2 text-xl">📝</span>
            Save Journal Entry
          </button>
        </form>
      </div>
    `;
  }

  // Setup form handler
  function setupFormHandler() {
    const form = document.getElementById('journal-form');
    if (!form) return;

    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const formData = {
        notes: document.getElementById('journal-notes').value,
        water: parseInt(document.getElementById('water-input').value) || 0,
        stress: parseInt(document.getElementById('stress-level').value) || 0,
        mood: parseInt(document.getElementById('mood-rating').value) || 0,
        energy: parseInt(document.getElementById('energy-rating').value) || 0
      };

      // Add sleep data
      if (!wearableConnected) {
        formData.sleep = parseFloat(document.getElementById('sleep-input').value) || 0;
        formData.activityType = document.getElementById('activity-type').value;
        formData.strain = parseInt(document.getElementById('strain-input').value) || 0;
      } else {
        // In real app, this would come from the wearable
        formData.sleep = 8.2; // Mock data
      }

      if (saveJournalEntry(formData)) {
        // Show success message
        const button = form.querySelector('button[type="submit"]');
        const originalText = button.innerHTML;
        button.innerHTML = '<span class="mr-2 text-xl">✅</span>Saved Successfully!';
        button.className = button.className.replace('from-green-500 to-emerald-600', 'from-emerald-500 to-green-600');
        
        setTimeout(() => {
          button.innerHTML = originalText;
          button.className = button.className.replace('from-emerald-500 to-green-600', 'from-green-500 to-emerald-600');
        }, 2000);
      }
    });
  }

  // Main render function
  function renderAnalyticsTab(containerId) {
    currentContainer = containerId;
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="max-w-7xl mx-auto p-6">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <!-- Today's Journal -->
          <div id="journal-container">
            ${renderTodaysJournal()}
          </div>
          
          <!-- Today's Summary -->
          <div id="summary-container">
            ${renderTodaysSummary()}
          </div>
        </div>
        
        <!-- AI Insights -->
        <div class="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20">
          <div id="ai-insights-container">
            <!-- AI insights will be rendered here -->
          </div>
        </div>
      </div>
    `;

    // Setup event handlers
    setupFormHandler();
    
    // Render AI insights
    setTimeout(() => {
      renderAIInsights();
    }, 100);
  }

  // Cleanup function
  function cleanup() {
    if (currentContainer) {
      const container = document.getElementById(currentContainer);
      if (container) {
        container.innerHTML = '';
      }
    }
    currentContainer = null;
  }

  // Public API
  return {
    renderAnalyticsTab,
    cleanup
  };
})();

console.log('✅ Enhanced FuelIQ Analytics module loaded with AI insights');
