// Enhanced Analytics Tab for FuelIQ - analytics-tab.js
window.FuelIQAnalytics = (function() {
  let currentContainer = null;
  let wearableConnected = false; // This would be set by the wearables module

  // Date Navigation State
  let currentAnalyticsDate = new Date().toISOString().split('T')[0]; // Today by default

  // Enhanced Date-Aware Functions
  function getCurrentAnalyticsDateKey() {
      return currentAnalyticsDate;
  }

  function formatDateForDisplay(dateStr) {
      const date = new Date(dateStr + 'T00:00:00');
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      
      if (dateStr === today) {
          return `Today - ${date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}`;
      } else if (dateStr === yesterdayStr) {
          return `Yesterday - ${date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}`;
      } else {
          return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });
      }
  }

  function navigateDate(direction) {
      const currentDate = new Date(currentAnalyticsDate + 'T00:00:00');
      currentDate.setDate(currentDate.getDate() + direction);
      currentAnalyticsDate = currentDate.toISOString().split('T')[0];
      
      // Re-render the analytics tab
      renderAnalyticsTab('analytics-container');
  }

  function setSpecificDate(dateStr) {
      currentAnalyticsDate = dateStr;
      renderAnalyticsTab('analytics-container');
  }

  function hasDataForDate(dateStr) {
      const journalKey = `fueliq_journal_${dateStr}`;
      const mealsKey = `fueliq_meals_${dateStr}`;
      const activityKey = `fueliq_activity_${dateStr}`;
      
      const hasJournal = localStorage.getItem(journalKey) && JSON.parse(localStorage.getItem(journalKey) || '{}').notes;
      const hasMeals = localStorage.getItem(mealsKey);
      const hasActivity = localStorage.getItem(activityKey);
      
      return hasJournal || hasMeals || hasActivity;
  }

  function renderDateNavigation() {
      const today = new Date().toISOString().split('T')[0];
      const isToday = currentAnalyticsDate === today;
      const canGoForward = currentAnalyticsDate < today;
      
      return `
          <div class="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-4 mb-6 border border-white/30">
              <div class="flex items-center justify-between">
                  <button 
                      onclick="window.FuelIQAnalytics.navigateDate(-1)"
                      class="flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                  >
                      <span class="text-lg mr-2">←</span>
                      Previous Day
                  </button>
                  
                  <div class="flex items-center space-x-4">
                      <div class="text-center">
                          <div class="text-lg font-bold text-gray-800">
                              ${formatDateForDisplay(currentAnalyticsDate)}
                          </div>
                          <input 
                              type="date" 
                              id="date-picker"
                              value="${currentAnalyticsDate}"
                              max="${today}"
                              onchange="window.FuelIQAnalytics.setSpecificDate(this.value)"
                              class="mt-2 px-3 py-1 border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:outline-none"
                          />
                      </div>
                      
                      ${!isToday ? `
                          <button 
                              onclick="window.FuelIQAnalytics.setSpecificDate('${today}')"
                              class="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm transition-all duration-200"
                          >
                              📅 Today
                          </button>
                      ` : ''}
                  </div>
                  
                  <button 
                      onclick="window.FuelIQAnalytics.navigateDate(1)"
                      ${!canGoForward ? 'disabled' : ''}
                      class="flex items-center px-4 py-2 ${canGoForward ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-300 cursor-not-allowed'} text-white rounded-xl transition-all duration-200 shadow-md ${canGoForward ? 'hover:shadow-lg transform hover:scale-105' : ''}"
                  >
                      Next Day
                      <span class="text-lg ml-2">→</span>
                  </button>
              </div>
              
              <div class="mt-3 text-center">
                  <span class="text-xs px-3 py-1 rounded-full ${hasDataForDate(currentAnalyticsDate) ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}">
                      ${hasDataForDate(currentAnalyticsDate) ? '✅ Has logged data' : '📝 No data logged'}
                  </span>
              </div>
          </div>
      `;
  }

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

  // Load today's journal entry
  function loadTodayEntry() {
    const key = `fueliq_journal_${getCurrentAnalyticsDateKey()}`;
    try {
        return JSON.parse(localStorage.getItem(key) || '{}');
    } catch (e) {
        return {};
    }
  }

  // Enhanced save functions with better error handling
  function saveJournalEntry(data) {
    const key = `fueliq_journal_${getCurrentAnalyticsDateKey()}`;
    try {
        localStorage.setItem(key, JSON.stringify({
            ...data,
            timestamp: new Date().toISOString(),
            date: getCurrentAnalyticsDateKey()
        }));
        
        console.log('✅ Journal entry saved successfully');
        
        // Refresh insights after saving
        setTimeout(() => {
            renderAIInsights();
        }, 500);
        
        return true;
    } catch (e) {
        console.error('❌ Failed to save journal entry:', e);
        alert('Failed to save journal entry. Please try again.');
        return false;
    }
  }

  function saveActivityData(date, activity) {
    const key = `fueliq_activity_${date}`;
    try {
        localStorage.setItem(key, JSON.stringify({
            ...activity,
            timestamp: new Date().toISOString(),
            date: date
        }));
        
        console.log('✅ Activity data saved successfully');
        return true;
    } catch (e) {
        console.error('❌ Failed to save activity data:', e);
        return false;
    }
  }

  // Get nutrition data for any date
  function getNutritionData(dateKey = getCurrentAnalyticsDateKey()) {
    const key = `fueliq_meals_${dateKey}`;
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
          sodium: acc.sodium + ((item.sodium || 0) * mult),
          sugar: acc.sugar + ((item.sugar || 0) * mult),
          mealCount: allFoods.length
        };
      }, { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sodium: 0, sugar: 0, mealCount: 0 });
    } catch (e) {
      return { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sodium: 0, sugar: 0, mealCount: 0 };
    }
  }

  // Get today's nutrition (wrapper for backwards compatibility)
  function getTodayNutrition() {
    return getNutritionData(getCurrentAnalyticsDateKey());
  }

  // Get user goals and profile
  function getUserData() {
    try {
      const goals = JSON.parse(localStorage.getItem('fueliq_user_goals') || '{}');
      const profile = JSON.parse(localStorage.getItem('fueliq_user_profile') || '{}');
      return { goals, profile };
    } catch (e) {
      return { goals: {}, profile: {} };
    }
  }

  // Get historical journal data for insights
  function getHistoricalData(days = 7) {
    const data = [];
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split('T')[0];
      
      try {
        const journal = JSON.parse(localStorage.getItem(`fueliq_journal_${dateKey}`) || '{}');
        const nutrition = getNutritionData(dateKey);
        
        data.push({
          date: dateKey,
          journal,
          nutrition
        });
      } catch (e) {
        data.push({ date: dateKey, journal: {}, nutrition: { calories: 0, protein: 0, carbs: 0, fat: 0 } });
      }
    }
    return data;
  }

  // Enhanced AI Insights Analysis with Goals & Macros
  function generateAIInsights() {
    const historicalData = getHistoricalData(7);
    const todayNutrition = getTodayNutrition();
    const todayJournal = loadTodayEntry();
    const { goals, profile } = getUserData();
    
    const insights = [];
    
    // Calculate averages for the week
    const validDays = historicalData.filter(d => d.nutrition.calories > 0);
    const avgNutrition = validDays.length > 0 ? {
      calories: validDays.reduce((sum, d) => sum + d.nutrition.calories, 0) / validDays.length,
      protein: validDays.reduce((sum, d) => sum + d.nutrition.protein, 0) / validDays.length,
      carbs: validDays.reduce((sum, d) => sum + d.nutrition.carbs, 0) / validDays.length,
      fat: validDays.reduce((sum, d) => sum + d.nutrition.fat, 0) / validDays.length,
    } : { calories: 0, protein: 0, carbs: 0, fat: 0 };

    // GOAL-SPECIFIC MACRO ANALYSIS
    if (profile.goal && goals.protein) {
      const proteinDeficit = goals.protein - avgNutrition.protein;
      const sleepData = historicalData.map(d => d.journal.sleep || 0).filter(s => s > 0);
      const stressData = historicalData.map(d => d.journal.stress || 0).filter(s => s > 0);
      const avgSleep = sleepData.length > 0 ? sleepData.reduce((a, b) => a + b, 0) / sleepData.length : 0;
      const avgStress = stressData.length > 0 ? stressData.reduce((a, b) => a + b, 0) / stressData.length : 0;

      // MUSCLE GAIN ANALYSIS
      if (profile.goal === 'muscle_gain') {
        if (proteinDeficit > 20) {
          insights.push({
            type: 'warning',
            icon: '💪',
            title: 'Muscle Gain: Protein Deficit',
            message: `You're averaging ${Math.round(avgNutrition.protein)}g protein vs your ${goals.protein}g goal. This ${Math.round(proteinDeficit)}g deficit significantly limits muscle protein synthesis. Try adding protein to each meal.`,
            priority: 'high'
          });
        }

        if (avgSleep < 7 && proteinDeficit > 10) {
          insights.push({
            type: 'concern',
            icon: '😴',
            title: 'Muscle Gain: Recovery Compromised',
            message: `Poor sleep (${avgSleep.toFixed(1)}h avg) + low protein (${Math.round(proteinDeficit)}g under goal) = severely limited muscle growth. Muscle repair happens during sleep and requires adequate protein.`,
            priority: 'high'
          });
        }

        if (avgStress >= 4) {
          insights.push({
            type: 'concern',
            icon: '😰',
            title: 'Muscle Gain: Stress Impact',
            message: `High stress levels (${avgStress.toFixed(1)}/6) increase cortisol, which breaks down muscle tissue and reduces protein synthesis. Consider stress management for better gains.`,
            priority: 'medium'
          });
        }
      }

      // FAT LOSS ANALYSIS
      if (profile.goal === 'fat_loss') {
        if (avgNutrition.calories > goals.calories + 200) {
          insights.push({
            type: 'warning',
            icon: '📉',
            title: 'Fat Loss: Calorie Surplus',
            message: `You're averaging ${Math.round(avgNutrition.calories)} calories vs your ${goals.calories} goal. This ${Math.round(avgNutrition.calories - goals.calories)} calorie surplus will prevent fat loss.`,
            priority: 'high'
          });
        }

        if (proteinDeficit > 15) {
          insights.push({
            type: 'concern',
            icon: '🥩',
            title: 'Fat Loss: Muscle Preservation Risk',
            message: `Low protein (${Math.round(proteinDeficit)}g under goal) during fat loss can lead to muscle loss. Higher protein preserves muscle mass and increases metabolism.`,
            priority: 'high'
          });
        }

        if (avgSleep < 7) {
          insights.push({
            type: 'warning',
            icon: '😴',
            title: 'Fat Loss: Sleep & Hormones',
            message: `Poor sleep (${avgSleep.toFixed(1)}h avg) disrupts leptin and ghrelin, making you hungrier and reducing fat burning hormones. Sleep is crucial for fat loss.`,
            priority: 'high'
          });
        }
      }

      // BODY RECOMPOSITION ANALYSIS
      if (profile.goal === 'recomp') {
        if (proteinDeficit > 10 || avgSleep < 7.5) {
          insights.push({
            type: 'concern',
            icon: '⚖️',
            title: 'Body Recomp: Precision Required',
            message: `Recomposition needs precise nutrition and recovery. ${proteinDeficit > 10 ? `Protein deficit: ${Math.round(proteinDeficit)}g. ` : ''}${avgSleep < 7.5 ? `Sleep: ${avgSleep.toFixed(1)}h (need 7.5+). ` : ''}Both are critical for simultaneous fat loss and muscle gain.`,
            priority: 'high'
          });
        }
      }
    }

    // ALCOHOL CONSUMPTION ANALYSIS
    const alcoholDays = historicalData.filter(d => d.journal.alcohol && d.journal.alcohol > 0);
    if (alcoholDays.length > 0) {
      const avgAlcohol = alcoholDays.reduce((sum, d) => sum + (d.journal.alcohol || 0), 0) / alcoholDays.length;
      const alcoholFrequency = alcoholDays.length;
      
      if (alcoholFrequency >= 4) {
        insights.push({
          type: 'warning',
          icon: '🍷',
          title: 'Alcohol: Frequent Consumption',
          message: `You've had alcohol ${alcoholFrequency} out of 7 days (avg ${avgAlcohol.toFixed(1)} drinks). Frequent alcohol consumption impairs protein synthesis, sleep quality, and fat metabolism.`,
          priority: 'high'
        });
      }

      if (profile.goal === 'muscle_gain' && alcoholFrequency >= 3) {
        insights.push({
          type: 'concern',
          icon: '💪',
          title: 'Muscle Gain: Alcohol Interference',
          message: `Alcohol ${alcoholFrequency}x/week significantly reduces muscle protein synthesis by up to 37%. Consider limiting to 1-2x/week for optimal muscle growth.`,
          priority: 'high'
        });
      }

      if (profile.goal === 'fat_loss' && avgAlcohol >= 2) {
        insights.push({
          type: 'concern',
          icon: '📉',
          title: 'Fat Loss: Alcohol Calories',
          message: `Averaging ${avgAlcohol.toFixed(1)} drinks/day adds ~${Math.round(avgAlcohol * 150)} "empty" calories. Alcohol also stops fat burning for hours after consumption.`,
          priority: 'medium'
        });
      }

      // Cross-correlate alcohol with sleep
      const alcoholNightsSleep = alcoholDays.map(d => d.journal.sleep || 0).filter(s => s > 0);
      const noAlcoholSleep = historicalData.filter(d => !d.journal.alcohol || d.journal.alcohol === 0)
        .map(d => d.journal.sleep || 0).filter(s => s > 0);
      
      if (alcoholNightsSleep.length >= 2 && noAlcoholSleep.length >= 2) {
        const alcoholSleepAvg = alcoholNightsSleep.reduce((a, b) => a + b, 0) / alcoholNightsSleep.length;
        const soberSleepAvg = noAlcoholSleep.reduce((a, b) => a + b, 0) / noAlcoholSleep.length;
        
        if (soberSleepAvg - alcoholSleepAvg > 0.5) {
          insights.push({
            type: 'insight',
            icon: '🧠',
            title: 'Alcohol: Sleep Quality Impact',
            message: `Sleep quality: ${alcoholSleepAvg.toFixed(1)}h on alcohol nights vs ${soberSleepAvg.toFixed(1)}h sober nights. Alcohol disrupts REM sleep even if you fall asleep faster.`,
            priority: 'medium'
          });
        }
      }
    }

    // POSITIVE REINFORCEMENT
    if (todayJournal.mood >= 7 && todayJournal.energy >= 7 && todayNutrition.protein >= goals.protein * 0.9) {
      insights.push({
        type: 'positive',
        icon: '🌟',
        title: 'Optimal Day Pattern!',
        message: `High mood (${todayJournal.mood}/10), energy (${todayJournal.energy}/10), and nutrition (${Math.round(todayNutrition.protein)}g protein). This is the pattern to replicate!`,
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

  // Activity data loading function
  function loadTodayActivity() {
    const key = `fueliq_activity_${getCurrentAnalyticsDateKey()}`;
    try {
        return JSON.parse(localStorage.getItem(key) || '{}');
    } catch (e) {
        return {};
    }
  }

  // Render Today's Summary with Enhanced Macros
  function renderTodaysSummary() {
    const nutrition = getNutritionData(currentAnalyticsDate);
    const journal = loadTodayEntry();
    const { goals, profile } = getUserData();

    return `
      <div class="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20">
        <h3 class="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <span class="mr-3 text-2xl">📊</span>
          Summary
        </h3>
        
        <div class="space-y-4">
          <!-- Goal Display -->
          ${profile.goal ? `
            <div class="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
              <span class="flex items-center text-blue-700 font-medium text-sm">
                <span class="mr-2 text-lg">🎯</span>
                Goal: ${profile.goal.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </span>
            </div>
          ` : ''}
          
          <!-- Calories -->
          <div class="flex justify-between items-center p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl">
            <span class="flex items-center text-gray-700 font-medium">
              <span class="mr-2 text-lg">🍽️</span>
              Calories
            </span>
            <div class="text-right">
              <span class="font-bold text-orange-600 text-lg">${Math.round(nutrition.calories || 0)}</span>
              ${goals.calories ? `<div class="text-xs text-gray-600">Goal: ${goals.calories}</div>` : ''}
            </div>
          </div>
          
          <!-- Protein -->
          <div class="flex justify-between items-center p-3 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl">
            <span class="flex items-center text-gray-700 font-medium">
              <span class="mr-2 text-lg">🥩</span>
              Protein
            </span>
            <div class="text-right">
              <span class="font-bold text-red-600 text-lg">${Math.round(nutrition.protein || 0)}g</span>
              ${goals.protein ? `<div class="text-xs text-gray-600">Goal: ${goals.protein}g</div>` : ''}
            </div>
          </div>
          
          <!-- Carbs -->
          <div class="flex justify-between items-center p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl">
            <span class="flex items-center text-gray-700 font-medium">
              <span class="mr-2 text-lg">🍞</span>
              Carbs
            </span>
            <div class="text-right">
              <span class="font-bold text-yellow-600 text-lg">${Math.round(nutrition.carbs || 0)}g</span>
              ${goals.carbs ? `<div class="text-xs text-gray-600">Goal: ${goals.carbs}g</div>` : ''}
            </div>
          </div>
          
          <!-- Fat -->
          <div class="flex justify-between items-center p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl">
            <span class="flex items-center text-gray-700 font-medium">
              <span class="mr-2 text-lg">🥑</span>
              Fat
            </span>
            <div class="text-right">
              <span class="font-bold text-purple-600 text-lg">${Math.round(nutrition.fat || 0)}g</span>
              ${goals.fat ? `<div class="text-xs text-gray-600">Goal: ${goals.fat}g</div>` : ''}
            </div>
          </div>
          
          <!-- Water -->
          <div class="flex justify-between items-center p-3 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl">
            <span class="flex items-center text-gray-700 font-medium">
              <span class="mr-2 text-lg">💧</span>
              Water
            </span>
            <span class="font-bold text-cyan-600 text-lg">${journal.water || 0} oz</span>
          </div>
          
          <!-- Sleep -->
          <div class="flex justify-between items-center p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
            <span class="flex items-center text-gray-700 font-medium">
              <span class="mr-2 text-lg">😴</span>
              Sleep
            </span>
            <span class="font-bold text-purple-600 text-lg">${journal.sleep || 0}h</span>
          </div>
          
          <!-- Mood -->
          <div class="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
            <span class="flex items-center text-gray-700 font-medium">
              <span class="mr-2 text-lg">😊</span>
              Mood
            </span>
            <span class="font-bold text-green-600 text-lg">${journal.mood || 0}/10</span>
          </div>
          
          <!-- Energy -->
          <div class="flex justify-between items-center p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl">
            <span class="flex items-center text-gray-700 font-medium">
              <span class="mr-2 text-lg">⚡</span>
              Energy
            </span>
            <span class="font-bold text-yellow-600 text-lg">${journal.energy || 0}/10</span>
          </div>
          
          <!-- Alcohol (if logged) -->
          ${journal.alcohol ? `
            <div class="flex justify-between items-center p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
              <span class="flex items-center text-gray-700 font-medium">
                <span class="mr-2 text-lg">🍷</span>
                Alcohol
              </span>
              <span class="font-bold text-amber-600 text-lg">${journal.alcohol} drink${journal.alcohol > 1 ? 's' : ''}</span>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  // Enhanced Today's Journal
  function renderTodaysJournal() {
    const today = loadTodayEntry();
    const wearableConnected = checkWearableConnection();
    const todayActivity = loadTodayActivity();

    return `
      <div class="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20">
        <h3 class="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <span class="mr-3 text-2xl">📝</span>
          Wellness Journal
        </h3>
        
        ${wearableConnected ? `
          <div class="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl">
            <div class="flex items-center text-green-700">
              <span class="mr-2 text-lg">⌚</span>
              <span class="font-medium">Wearable Connected - Activity auto-synced</span>
            </div>
          </div>
        ` : ''}
        
        <form id="enhanced-journal-form" class="space-y-6">
          <!-- Journal Notes -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-3">How are you feeling today?</label>
            <textarea
              id="journal-notes"
              rows="4"
              class="w-full px-4 py-3 bg-white/70 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all duration-200 resize-none"
              placeholder="Describe your mood, energy, challenges, wins, workouts, sleep quality..."
            >${today.notes || ''}</textarea>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Sleep -->
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

            <!-- Water -->
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

            <!-- Steps -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-3">
                👟 Steps ${wearableConnected ? '(Auto-synced)' : ''}
              </label>
              ${wearableConnected ? `
                <div class="px-4 py-3 bg-green-50 border-2 border-green-200 rounded-xl">
                  <span class="font-bold text-green-700">${todayActivity.steps || 8453} from device</span>
                </div>
              ` : `
                <input
                  type="number"
                  id="steps-input"
                  min="0"
                  max="50000"
                  value="${todayActivity.steps || ''}"
                  class="w-full px-4 py-3 bg-white/70 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all duration-200"
                  placeholder="8000"
                />
              `}
            </div>

            <!-- Calories Burned -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-3">
                🔥 Calories Burned ${wearableConnected ? '(Auto-synced)' : ''}
              </label>
              ${wearableConnected ? `
                <div class="px-4 py-3 bg-green-50 border-2 border-green-200 rounded-xl">
                  <span class="font-bold text-green-700">${todayActivity.caloriesBurned || 2247} from device</span>
                </div>
              ` : `
                <input
                  type="number"
                  id="calories-burned-input"
                  min="0"
                  max="8000"
                  value="${todayActivity.caloriesBurned || ''}"
                  class="w-full px-4 py-3 bg-white/70 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-500/20 transition-all duration-200"
                  placeholder="2000"
                />
              `}
            </div>

            <!-- Exercise Minutes (if no wearable) -->
            ${!wearableConnected ? `
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-3">🏃‍♂️ Exercise Minutes</label>
                <input
                  type="number"
                  id="exercise-minutes-input"
                  min="0"
                  max="480"
                  value="${todayActivity.exerciseMinutes || ''}"
                  class="w-full px-4 py-3 bg-white/70 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all duration-200"
                  placeholder="30"
                />
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-3">💪 Exercise Type</label>
                <select
                  id="exercise-type"
                  class="w-full px-4 py-3 bg-white/70 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all duration-200"
                >
                  <option value="">Select exercise...</option>
                  <option value="cardio" ${todayActivity.exerciseType === 'cardio' ? 'selected' : ''}>Cardio</option>
                  <option value="strength" ${todayActivity.exerciseType === 'strength' ? 'selected' : ''}>Strength Training</option>
                  <option value="yoga" ${todayActivity.exerciseType === 'yoga' ? 'selected' : ''}>Yoga/Stretching</option>
                  <option value="sports" ${todayActivity.exerciseType === 'sports' ? 'selected' : ''}>Sports</option>
                  <option value="walking" ${todayActivity.exerciseType === 'walking' ? 'selected' : ''}>Walking/Hiking</option>
                  <option value="other" ${todayActivity.exerciseType === 'other' ? 'selected' : ''}>Other</option>
                </select>
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

            <!-- Alcohol -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-3">🍷 Alcohol (drinks)</label>
              <input
                type="number"
                id="alcohol-input"
                min="0"
                max="20"
                step="0.5"
                value="${today.alcohol || ''}"
                class="w-full px-4 py-3 bg-white/70 border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20 transition-all duration-200"
                placeholder="0"
              />
              <p class="text-xs text-gray-500 mt-1">1 drink = 12oz beer, 5oz wine, or 1.5oz spirits</p>
            </div>
          </div>

          <!-- Save Button -->
          <button
            type="submit"
            class="w-full px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl hover:from-green-600 hover:to-emerald-700 font-bold text-lg shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center"
          >
            <span class="mr-2 text-xl">📝</span>
            Save Wellness Entry
          </button>
        </form>
      </div>
    `;
  }

  // Enhanced form handler with proper timing and error handling
  function setupEnhancedFormHandler() {
    console.log('🔧 Setting up enhanced form handler...');
    
    const form = document.getElementById('enhanced-journal-form');
    if (!form) {
        console.warn('❌ Enhanced journal form not found');
        return;
    }
    
    console.log('✅ Found enhanced journal form');

    // Remove any existing event listeners
    const newForm = form.cloneNode(true);
    form.parentNode.replaceChild(newForm, form);

    newForm.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('📝 Form submitted');
        
        try {
            const wearableConnected = checkWearableConnection();
            
            const formData = {
                notes: document.getElementById('journal-notes').value || '',
                water: parseInt(document.getElementById('water-input').value) || 0,
                stress: parseInt(document.getElementById('stress-level').value) || 0,
                mood: parseInt(document.getElementById('mood-rating').value) || 0,
                energy: parseInt(document.getElementById('energy-rating').value) || 0,
                alcohol: parseFloat(document.getElementById('alcohol-input').value) || 0
            };

            console.log('📊 Form data collected:', formData);

            // Add sleep data
            if (!wearableConnected) {
                const sleepInput = document.getElementById('sleep-input');
                formData.sleep = sleepInput ? (parseFloat(sleepInput.value) || 0) : 0;
            } else {
                formData.sleep = 8.2; // Mock data from wearable
            }

            // Add activity data
            const activityData = {};
            if (!wearableConnected) {
                const stepsInput = document.getElementById('steps-input');
                const caloriesInput = document.getElementById('calories-burned-input');
                const exerciseMinutesInput = document.getElementById('exercise-minutes-input');
                const exerciseTypeInput = document.getElementById('exercise-type');
                
                activityData.steps = stepsInput ? (parseInt(stepsInput.value) || 0) : 0;
                activityData.caloriesBurned = caloriesInput ? (parseInt(caloriesInput.value) || 0) : 0;
                activityData.exerciseMinutes = exerciseMinutesInput ? (parseInt(exerciseMinutesInput.value) || 0) : 0;
                activityData.exerciseType = exerciseTypeInput ? exerciseTypeInput.value : '';
            } else {
                // Mock data from wearable
                activityData.steps = 8453;
                activityData.caloriesBurned = 2247;
                activityData.exerciseMinutes = 45;
                activityData.exerciseType = 'auto-detected';
            }

            console.log('🏃 Activity data collected:', activityData);

            // Save both journal and activity data
            const journalSaved = saveJournalEntry(formData);
            const activitySaved = saveActivityData(getCurrentAnalyticsDateKey(), activityData);
            
            if (journalSaved && activitySaved) {
                // Show success message
                const button = newForm.querySelector('button[type="submit"]');
                const originalText = button.innerHTML;
                button.innerHTML = '<span class="mr-2 text-xl">✅</span>Saved Successfully!';
                button.className = button.className.replace('from-green-500 to-emerald-600', 'from-emerald-500 to-green-600');
                
                setTimeout(() => {
                    button.innerHTML = originalText;
                    button.className = button.className.replace('from-emerald-500 to-green-600', 'from-green-500 to-emerald-600');
                    
                    // Re-render to show updated data
                    console.log('🔄 Re-rendering analytics tab...');
                    renderAnalyticsTab('analytics-container');
                }, 2000);
            } else {
                alert('Failed to save some data. Please try again.');
            }
            
        } catch (error) {
            console.error('❌ Error in form submission:', error);
            alert('An error occurred while saving. Please try again.');
        }
    });
    
    console.log('✅ Enhanced form handler setup complete');
  }

  // Main render function
  function renderAnalyticsTab(containerId) {
    currentContainer = containerId;
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="max-w-7xl mx-auto p-6">
        ${renderDateNavigation()}
        
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

    // Setup event handlers with proper timing
    setTimeout(() => {
      setupEnhancedFormHandler();
    }, 100);

    // Render AI insights with delay
    setTimeout(() => {
      renderAIInsights();
    }, 300);
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

  // Public API - expose navigation functions globally
  window.FuelIQAnalytics = {
    renderAnalyticsTab,
    cleanup,
    getCurrentAnalyticsDateKey,
    navigateDate,
    setSpecificDate
  };

  // Public API
  return {
    renderAnalyticsTab,
    cleanup,
    getCurrentAnalyticsDateKey,
    navigateDate,
    setSpecificDate
  };
})();

console.log('✅ Enhanced FuelIQ Analytics module loaded with AI insights');
