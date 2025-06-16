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

  // Get nutrition data for any date
  function getNutritionData(dateKey = getTodayKey()) {
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
    return getNutritionData();
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

    // ADVANCED MACRO PATTERNS
    if (validDays.length >= 3) {
      // Protein timing analysis
      const lowProteinDays = validDays.filter(d => d.nutrition.protein < (goals.protein * 0.8)).length;
      if (lowProteinDays >= 3) {
        insights.push({
          type: 'warning',
          icon: '🥩',
          title: 'Protein: Consistency Issues',
          message: `${lowProteinDays}/${validDays.length} days below 80% protein goal. Consistent daily protein intake is more important than total weekly protein for muscle maintenance.`,
          priority: 'medium'
        });
      }

      // Carb timing for training
      if (profile.goal === 'muscle_gain' || profile.goal === 'recomp') {
        const lowCarbDays = validDays.filter(d => d.nutrition.carbs < (goals.carbs * 0.7)).length;
        if (lowCarbDays >= 3) {
          insights.push({
            type: 'suggestion',
            icon: '🍞',
            title: 'Performance: Carb Intake',
            message: `${lowCarbDays} days with low carbs (<70% goal). Adequate carbs fuel workouts and support recovery, especially important for muscle building goals.`,
            priority: 'medium'
          });
        }
      }

      // Fat intake for hormones
      const lowFatDays = validDays.filter(d => d.nutrition.fat < (goals.fat * 0.6)).length;
      if (lowFatDays >= 3) {
        insights.push({
          type: 'concern',
          icon: '🥑',
          title: 'Hormones: Low Fat Intake',
          message: `${lowFatDays} days with very low fat (<60% goal). Inadequate fat intake can disrupt hormone production, including testosterone and growth hormone.`,
          priority: 'medium'
        });
      }
    }

    // WATER INTAKE ENHANCED ANALYSIS
    const waterLevels = historicalData.map(d => d.journal.water || 0).filter(w => w > 0);
    if (waterLevels.length > 0) {
      const avgWater = waterLevels.reduce((a, b) => a + b, 0) / waterLevels.length;
      const weightLbs = parseFloat(profile.weight) || 150;
      const waterNeed = Math.round(weightLbs * 0.67); // 2/3 of body weight in oz
      
      if (avgWater < waterNeed * 0.7) {
        insights.push({
          type: 'warning',
          icon: '💧',
          title: 'Hydration: Below Optimal',
          message: `Average ${Math.round(avgWater)}oz vs recommended ${waterNeed}oz (based on ${weightLbs}lbs). Dehydration reduces performance, recovery, and can mask as hunger.`,
          priority: 'high'
        });
      }

      // Correlate dehydration with performance
      const lowWaterDays = historicalData.filter(d => (d.journal.water || 0) < waterNeed * 0.6);
      const lowEnergyOnLowWater = lowWaterDays.filter(d => (d.journal.energy || 0) <= 4).length;
      
      if (lowWaterDays.length >= 2 && lowEnergyOnLowWater >= 2) {
        insights.push({
          type: 'insight',
          icon: '🧠',
          title: 'Hydration: Energy Connection',
          message: `${lowEnergyOnLowWater}/${lowWaterDays.length} low-water days also had low energy. Even 2% dehydration can reduce physical and mental performance by 10-15%.`,
          priority: 'medium'
        });
      }
    }

    // ADVANCED MOOD & WELLNESS CORRELATIONS
    const moodEnergyData = historicalData.filter(d => d.journal.mood && d.journal.energy);
    if (moodEnergyData.length >= 3) {
      // Correlate nutrition with mood/energy
      const highNutritionDays = moodEnergyData.filter(d => d.nutrition.protein >= (goals.protein * 0.9) && d.nutrition.calories >= (goals.calories * 0.9));
      const lowNutritionDays = moodEnergyData.filter(d => d.nutrition.protein < (goals.protein * 0.7) || d.nutrition.calories < (goals.calories * 0.7));
      
      if (highNutritionDays.length >= 2 && lowNutritionDays.length >= 2) {
        const highNutritionMood = highNutritionDays.reduce((sum, d) => sum + d.journal.mood, 0) / highNutritionDays.length;
        const lowNutritionMood = lowNutritionDays.reduce((sum, d) => sum + d.journal.mood, 0) / lowNutritionDays.length;
        
        if (highNutritionMood - lowNutritionMood > 1) {
          insights.push({
            type: 'insight',
            icon: '🧠',
            title: 'Nutrition: Mood Connection',
            message: `Mood averages ${highNutritionMood.toFixed(1)}/10 on well-fed days vs ${lowNutritionMood.toFixed(1)}/10 on under-fed days. Consistent nutrition stabilizes mood and energy.`,
            priority: 'medium'
          });
        }
      }
    }

    // CROSS-CORRELATION PATTERNS (Enhanced)
    const journalEntries = historicalData.filter(d => d.journal.notes && d.journal.notes.toLowerCase().includes('headache'));
    if (journalEntries.length >= 2) {
      const headacheDays = journalEntries.map(d => ({
        date: d.date,
        water: d.journal.water || 0,
        sleep: d.journal.sleep || 0,
        stress: d.journal.stress || 0,
        calories: d.nutrition.calories || 0,
        alcohol: d.journal.alcohol || 0
      }));
      
      const factors = [];
      if (headacheDays.filter(d => d.water < 40).length >= 2) factors.push('low water');
      if (headacheDays.filter(d => d.sleep < 7).length >= 2) factors.push('poor sleep');
      if (headacheDays.filter(d => d.stress >= 4).length >= 2) factors.push('high stress');
      if (headacheDays.filter(d => d.calories < goals.calories * 0.7).length >= 2) factors.push('undereating');
      if (headacheDays.filter(d => d.alcohol > 0).length >= 2) factors.push('alcohol consumption');
      
      if (factors.length > 0) {
        insights.push({
          type: 'insight',
          icon: '🧠',
          title: 'Headache Pattern Analysis',
          message: `Headaches mentioned ${journalEntries.length}x recently. Common factors: ${factors.join(', ')}. These often work together - address multiple factors for best results.`,
          priority: 'high'
        });
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

  // Render Today's Summary with Enhanced Macros
  function renderTodaysSummary() {
    const nutrition = getTodayNutrition();
    const journal = loadTodayEntry();
    const { goals, profile } = getUserData();

    return `
      <div class="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20">
        <h3 class="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <span class="mr-3 text-2xl">📊</span>
          Today's Summary
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

  // Render Today's Journal (Enhanced with Activity Tracking)
function renderTodaysJournal() {
  return EnhancedTodaysJournal();
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
        energy: parseInt(document.getElementById('energy-rating').value) || 0,
        alcohol: parseFloat(document.getElementById('alcohol-input').value) || 0
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
    <!-- NEW: Historical Analytics Panel -->
    <div id="historical-analytics-container" class="mb-8">
      <!-- Will be populated by React component -->
    </div>
    
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
// STEP 2: ADD THIS CODE BEFORE THE FINAL console.log LINE IN analytics-tab.js

// Advanced Historical Data Analysis
const AdvancedHistoricalAnalysis = {
    
    // Get comprehensive historical data for any date range
    getHistoricalData: (startDate, endDate) => {
        const data = [];
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
            const dateStr = date.toISOString().split('T')[0];
            
            // Get meals data
            const nutrition = getNutritionData(dateStr);
            
            // Get journal data
            const journalKey = `fueliq_journal_${dateStr}`;
            const journalData = JSON.parse(localStorage.getItem(journalKey) || '{}');
            
            // Get activity data (new)
            const activityKey = `fueliq_activity_${dateStr}`;
            const activityData = JSON.parse(localStorage.getItem(activityKey) || '{}');
            
            data.push({
                date: dateStr,
                dayOfWeek: date.toLocaleDateString('en-US', { weekday: 'long' }),
                nutrition,
                journal: journalData,
                activity: activityData
            });
        }
        
        return data;
    },

    // Enhanced pattern analysis with activity correlation
    generateHistoricalInsights: (days = 30) => {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        
        const historicalData = AdvancedHistoricalAnalysis.getHistoricalData(startDate, endDate);
        const insights = [];
        const { goals } = getUserData();

        // Activity & Nutrition Correlations
        const activityInsights = analyzeActivityNutritionCorrelations(historicalData);
        insights.push(...activityInsights);

        // Weekly patterns
        const weeklyPatterns = analyzeWeeklyPatterns(historicalData);
        insights.push(...weeklyPatterns);

        // Macro consistency
        const macroConsistency = analyzeMacroConsistency(historicalData, goals);
        insights.push(...macroConsistency);

        // Mood correlations
        const moodCorrelations = analyzeMoodNutritionCorrelations(historicalData);
        insights.push(...moodCorrelations);

        // Sleep patterns
        const sleepPatterns = analyzeSleepEatingPatterns(historicalData);
        insights.push(...sleepPatterns);

        // Goal adherence trends
        const goalTrends = analyzeGoalAdherenceTrends(historicalData, goals);
        insights.push(...goalTrends);

        return insights.slice(0, 8); // Limit to top insights
    }
};

// NEW: Activity & Nutrition Correlation Analysis
function analyzeActivityNutritionCorrelations(data) {
    const insights = [];
    const validDays = data.filter(d => d.nutrition.calories > 0 && d.activity.steps);
    
    if (validDays.length < 7) return insights;

    // High activity vs eating patterns
    const highActivityDays = validDays.filter(d => d.activity.steps >= 8000);
    const lowActivityDays = validDays.filter(d => d.activity.steps < 5000);

    if (highActivityDays.length >= 3 && lowActivityDays.length >= 3) {
        const highActivityAvgCals = highActivityDays.reduce((sum, d) => sum + d.nutrition.calories, 0) / highActivityDays.length;
        const lowActivityAvgCals = lowActivityDays.reduce((sum, d) => sum + d.nutrition.calories, 0) / lowActivityDays.length;
        const calorieDifference = highActivityAvgCals - lowActivityAvgCals;

        if (Math.abs(calorieDifference) > 200) {
            insights.push({
                type: 'activity-nutrition',
                icon: '🏃‍♂️',
                title: 'Activity & Appetite Pattern',
                message: `You eat ${Math.abs(Math.round(calorieDifference))} ${calorieDifference > 0 ? 'more' : 'fewer'} calories on high-activity days. ${calorieDifference < 0 ? 'Consider fueling workouts better.' : 'Good job matching intake to activity!'}`,
                priority: 'medium',
                period: `${validDays.length}-day analysis`
            });
        }

        // Protein intake on active days
        const highActivityAvgProtein = highActivityDays.reduce((sum, d) => sum + d.nutrition.protein, 0) / highActivityDays.length;
        const lowActivityAvgProtein = lowActivityDays.reduce((sum, d) => sum + d.nutrition.protein, 0) / lowActivityDays.length;
        const proteinDifference = highActivityAvgProtein - lowActivityAvgProtein;

        if (proteinDifference > 15) {
            insights.push({
                type: 'activity-nutrition',
                icon: '💪',
                title: 'Active Days Protein Boost',
                message: `You consume ${Math.round(proteinDifference)}g more protein on active days. This supports recovery and muscle maintenance!`,
                priority: 'low',
                period: `${validDays.length}-day analysis`
            });
        } else if (proteinDifference < -10) {
            insights.push({
                type: 'activity-nutrition',
                icon: '🥩',
                title: 'Active Days Need More Protein',
                message: `You eat ${Math.abs(Math.round(proteinDifference))}g less protein on active days. Increase protein to support recovery.`,
                priority: 'medium',
                period: `${validDays.length}-day analysis`
            });
        }
    }

    // Sleep quality and steps correlation
    const sleepStepsData = validDays.filter(d => d.journal.sleep);
    if (sleepStepsData.length >= 7) {
        const goodSleepDays = sleepStepsData.filter(d => d.journal.sleep >= 7.5);
        const poorSleepDays = sleepStepsData.filter(d => d.journal.sleep < 6.5);

        if (goodSleepDays.length >= 3 && poorSleepDays.length >= 3) {
            const goodSleepAvgSteps = goodSleepDays.reduce((sum, d) => sum + d.activity.steps, 0) / goodSleepDays.length;
            const poorSleepAvgSteps = poorSleepDays.reduce((sum, d) => sum + d.activity.steps, 0) / poorSleepDays.length;
            const stepsDifference = goodSleepAvgSteps - poorSleepAvgSteps;

            if (stepsDifference > 1500) {
                insights.push({
                    type: 'sleep-activity',
                    icon: '😴',
                    title: 'Sleep & Activity Connection',
                    message: `You average ${Math.round(stepsDifference)} more steps on good sleep days. Quality sleep supports higher activity levels.`,
                    priority: 'medium',
                    period: `${sleepStepsData.length}-day analysis`
                });
            }
        }
    }

    return insights;
}

// Enhanced Weekly Patterns (includes activity)
function analyzeWeeklyPatterns(data) {
    const insights = [];
    const weeklyData = {};
    
    // Group by day of week
    data.forEach(day => {
        if (!weeklyData[day.dayOfWeek]) {
            weeklyData[day.dayOfWeek] = { nutrition: [], activity: [] };
        }
        weeklyData[day.dayOfWeek].nutrition.push(day.nutrition);
        if (day.activity.steps) {
            weeklyData[day.dayOfWeek].activity.push(day.activity);
        }
    });

    // Analyze weekend activity patterns
    const weekends = ['Saturday', 'Sunday'];
    const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    
    const weekendActivity = weekends
        .filter(day => weeklyData[day] && weeklyData[day].activity.length > 0)
        .flatMap(day => weeklyData[day].activity);
    const weekdayActivity = weekdays
        .filter(day => weeklyData[day] && weeklyData[day].activity.length > 0)
        .flatMap(day => weeklyData[day].activity);

    if (weekendActivity.length >= 2 && weekdayActivity.length >= 3) {
        const weekendAvgSteps = weekendActivity.reduce((sum, d) => sum + d.steps, 0) / weekendActivity.length;
        const weekdayAvgSteps = weekdayActivity.reduce((sum, d) => sum + d.steps, 0) / weekdayActivity.length;
        const stepsDifference = weekendAvgSteps - weekdayAvgSteps;

        if (stepsDifference < -3000) {
            insights.push({
                type: 'weekly-activity',
                icon: '📅',
                title: 'Weekend Activity Drop',
                message: `You average ${Math.abs(Math.round(stepsDifference))} fewer steps on weekends. Plan active weekend activities to maintain consistency.`,
                priority: 'medium',
                period: 'Weekly pattern analysis'
            });
        } else if (stepsDifference > 2000) {
            insights.push({
                type: 'weekly-activity',
                icon: '🎯',
                title: 'Active Weekend Pattern',
                message: `Great job! You're ${Math.round(stepsDifference)} steps more active on weekends. This helps offset weekday sedentary time.`,
                priority: 'low',
                period: 'Weekly pattern analysis'
            });
        }
    }

    return insights;
}

// Other analysis functions (macro consistency, mood correlations, etc.)
function analyzeMacroConsistency(data, goals) {
    const insights = [];
    const validDays = data.filter(d => d.nutrition.calories > 0);
    
    if (validDays.length < 7) return insights;

    const proteinValues = validDays.map(d => d.nutrition.protein);
    const proteinCV = calculateCoefficientOfVariation(proteinValues);
    
    if (proteinCV > 0.4) {
        insights.push({
            type: 'consistency',
            icon: '📊',
            title: 'Inconsistent Protein Intake',
            message: `Your protein varies significantly day-to-day (${Math.round(proteinCV * 100)}% variation). Consistent protein supports muscle maintenance.`,
            priority: 'medium',
            period: `${validDays.length}-day analysis`
        });
    }

    return insights;
}

function analyzeMoodNutritionCorrelations(data) {
    const insights = [];
    const validDays = data.filter(d => d.journal.mood && d.nutrition.calories > 0);
    
    if (validDays.length < 10) return insights;

    const highMoodDays = validDays.filter(d => d.journal.mood >= 7);
    const lowMoodDays = validDays.filter(d => d.journal.mood <= 4);

    if (highMoodDays.length >= 3 && lowMoodDays.length >= 3) {
        const highMoodAvgProtein = highMoodDays.reduce((sum, d) => sum + d.nutrition.protein, 0) / highMoodDays.length;
        const lowMoodAvgProtein = lowMoodDays.reduce((sum, d) => sum + d.nutrition.protein, 0) / lowMoodDays.length;
        const proteinDifference = highMoodAvgProtein - lowMoodAvgProtein;
        
        if (proteinDifference > 20) {
            insights.push({
                type: 'mood-correlation',
                icon: '🧠',
                title: 'Mood-Protein Connection',
                message: `You average ${Math.round(proteinDifference)}g more protein on high-mood days. Stable protein may help mood regulation.`,
                priority: 'medium',
                period: `${validDays.length}-day analysis`
            });
        }
    }

    return insights;
}

function analyzeSleepEatingPatterns(data) {
    const insights = [];
    const validDays = data.filter(d => d.journal.sleep && d.nutrition.calories > 0);
    
    if (validDays.length < 10) return insights;

    const goodSleepDays = validDays.filter(d => d.journal.sleep >= 7.5);
    const poorSleepDays = validDays.filter(d => d.journal.sleep < 6.5);

    if (goodSleepDays.length >= 3 && poorSleepDays.length >= 3) {
        // Analyze late eating patterns (using meal count as proxy)
        const lateEatingDays = validDays.filter(d => d.nutrition.mealCount >= 4);
        const poorSleepWithLateEating = poorSleepDays.filter(d => d.nutrition.mealCount >= 4).length;
        
        if (poorSleepWithLateEating / poorSleepDays.length > 0.6) {
            insights.push({
                type: 'sleep-eating',
                icon: '🌙',
                title: 'Late Eating & Sleep Quality',
                message: `${Math.round(poorSleepWithLateEating / poorSleepDays.length * 100)}% of poor sleep days involved frequent meals. Try eating dinner 3+ hours before bed.`,
                priority: 'high',
                period: `${validDays.length}-day analysis`
            });
        }
    }

    return insights;
}

function analyzeGoalAdherenceTrends(data, goals) {
    const insights = [];
    const validDays = data.filter(d => d.nutrition.calories > 0);
    
    if (validDays.length < 14) return insights;

    const midpoint = Math.floor(validDays.length / 2);
    const firstHalf = validDays.slice(0, midpoint);
    const secondHalf = validDays.slice(midpoint);

    const firstHalfProteinAdherence = firstHalf.filter(d => d.nutrition.protein >= goals.protein * 0.9).length / firstHalf.length;
    const secondHalfProteinAdherence = secondHalf.filter(d => d.nutrition.protein >= goals.protein * 0.9).length / secondHalf.length;
    const proteinTrend = secondHalfProteinAdherence - firstHalfProteinAdherence;

    if (proteinTrend > 0.2) {
        insights.push({
            type: 'goal-trend',
            icon: '📈',
            title: 'Improving Protein Consistency',
            message: `Protein goal adherence improved by ${Math.round(proteinTrend * 100)}% recently. You're building better habits!`,
            priority: 'low',
            period: `${validDays.length}-day trend`
        });
    }

    return insights;
}

function calculateCoefficientOfVariation(values) {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);
    return stdDev / mean;
}

// ENHANCED JOURNAL WITH ACTIVITY TRACKING
const EnhancedTodaysJournal = () => {
    const today = loadTodayEntry();
    const wearableConnected = checkWearableConnection();
    
    // Get activity data
    const todayActivity = loadTodayActivity();

    return `
      <div class="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20">
        <h3 class="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <span class="mr-3 text-2xl">📝</span>
          Today's Wellness Journal
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
};

// Activity data loading/saving functions
function loadTodayActivity() {
    const key = `fueliq_activity_${getTodayKey()}`;
    try {
        return JSON.parse(localStorage.getItem(key) || '{}');
    } catch (e) {
        return {};
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
        return true;
    } catch (e) {
        console.error('Failed to save activity data:', e);
        return false;
    }
}

// Enhanced Historical Analytics Panel
const HistoricalAnalyticsPanel = ({ days = 30 }) => {
    const [insights, setInsights] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [selectedPeriod, setSelectedPeriod] = React.useState(30);

    React.useEffect(() => {
        generateInsights();
    }, [selectedPeriod]);

    const generateInsights = async () => {
        setLoading(true);
        try {
            const historicalInsights = AdvancedHistoricalAnalysis.generateHistoricalInsights(selectedPeriod);
            setInsights(historicalInsights);
        } catch (error) {
            console.error('Failed to generate historical insights:', error);
        } finally {
            setLoading(false);
        }
    };

    return React.createElement('div', { className: 'bg-white rounded-xl p-6 shadow-lg border border-gray-100 mb-8' },
        React.createElement('div', { className: 'flex justify-between items-center mb-6' },
            React.createElement('h3', { className: 'text-xl font-bold text-gray-800 flex items-center gap-2' },
                React.createElement('span', { className: 'text-2xl' }, '📊'),
                'Historical Patterns & Trends'
            ),
            React.createElement('select', {
                value: selectedPeriod,
                onChange: (e) => setSelectedPeriod(Number(e.target.value)),
                className: 'px-3 py-2 border border-gray-300 rounded-lg focus:border-purple-500'
            },
                React.createElement('option', { value: 7 }, 'Last 7 days'),
                React.createElement('option', { value: 14 }, 'Last 2 weeks'),
                React.createElement('option', { value: 30 }, 'Last 30 days'),
                React.createElement('option', { value: 90 }, 'Last 3 months')
            )
        ),

        loading ? 
            React.createElement('div', { className: 'text-center py-8' },
                React.createElement('div', { className: 'animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-2' }),
                React.createElement('p', { className: 'text-gray-600' }, 'Analyzing your patterns...')
            ) :
            insights.length === 0 ?
                React.createElement('div', { className: 'text-center py-8 text-gray-500' },
                    React.createElement('div', { className: 'text-4xl mb-2' }, '📈'),
                    React.createElement('p', null, `Not enough data for ${selectedPeriod}-day analysis`),
                    React.createElement('p', { className: 'text-sm' }, 'Log more meals and journal entries to unlock insights!')
                ) :
                React.createElement('div', { className: 'space-y-4' },
                    ...insights.map((insight, index) =>
                        React.createElement('div', {
                            key: index,
                            className: `p-4 rounded-lg border-l-4 ${
                                insight.priority === 'high' ? 'border-red-400 bg-red-50' :
                                insight.priority === 'medium' ? 'border-yellow-400 bg-yellow-50' :
                                'border-green-400 bg-green-50'
                            }`
                        },
                            React.createElement('div', { className: 'flex items-start gap-3' },
                                React.createElement('span', { className: 'text-2xl' }, insight.icon),
                                React.createElement('div', { className: 'flex-1' },
                                    React.createElement('h4', { 
                                        className: `font-semibold mb-1 ${
                                            insight.priority === 'high' ? 'text-red-700' :
                                            insight.priority === 'medium' ? 'text-yellow-700' :
                                            'text-green-700'
                                        }`
                                    }, insight.title),
                                    React.createElement('p', { 
                                        className: `text-sm mb-2 ${
                                            insight.priority === 'high' ? 'text-red-600' :
                                            insight.priority === 'medium' ? 'text-yellow-600' :
                                            'text-green-600'
                                        }`
                                    }, insight.message),
                                    React.createElement('span', { 
                                        className: 'text-xs text-gray-500 bg-white px-2 py-1 rounded-full'
                                    }, insight.period)
                                )
                            )
                        )
                    )
                )
    );
};

// UPDATED ENHANCED FORM HANDLER
function setupEnhancedFormHandler() {
    const form = document.getElementById('enhanced-journal-form');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const wearableConnected = checkWearableConnection();
        
        const formData = {
            notes: document.getElementById('journal-notes').value,
            water: parseInt(document.getElementById('water-input').value) || 0,
            stress: parseInt(document.getElementById('stress-level').value) || 0,
            mood: parseInt(document.getElementById('mood-rating').value) || 0,
            energy: parseInt(document.getElementById('energy-rating').value) || 0,
            alcohol: parseFloat(document.getElementById('alcohol-input').value) || 0
        };

        // Add sleep data
        if (!wearableConnected) {
            formData.sleep = parseFloat(document.getElementById('sleep-input').value) || 0;
        } else {
            formData.sleep = 8.2; // Mock data from wearable
        }

        // Add activity data
        const activityData = {};
        if (!wearableConnected) {
            activityData.steps = parseInt(document.getElementById('steps-input').value) || 0;
            activityData.caloriesBurned = parseInt(document.getElementById('calories-burned-input').value) || 0;
            activityData.exerciseMinutes = parseInt(document.getElementById('exercise-minutes-input').value) || 0;
            activityData.exerciseType = document.getElementById('exercise-type').value;
        } else {
            // Mock data from wearable
            activityData.steps = 8453;
            activityData.caloriesBurned = 2247;
            activityData.exerciseMinutes = 45;
            activityData.exerciseType = 'auto-detected';
        }

        // Save both journal and activity data
        const saveSuccess = saveJournalEntry(formData) && saveActivityData(getTodayKey(), activityData);
        
        if (saveSuccess) {
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
console.log('✅ Enhanced FuelIQ Analytics module loaded with AI insights');
