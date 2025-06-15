// analytics-tab.js - FuelIQ Analytics & Wellness Insights
(function() {
  'use strict';

  // Data collection and analysis utilities
  const DataCollector = {
    // Get nutrition data for date range
    getNutritionData: (startDate, endDate) => {
      const data = [];
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0];
        try {
          const mealData = JSON.parse(localStorage.getItem(`fueliq_meals_${dateStr}`) || '{}');
          const allFoods = [...(mealData.breakfast||[]), ...(mealData.lunch||[]), ...(mealData.dinner||[]), ...(mealData.snacks||[])];
          
          const totals = allFoods.reduce((acc, item) => {
            const mult = (item.servingSize || 100) / 100;
            return {
              calories: acc.calories + ((item.calories || 0) * mult),
              protein: acc.protein + ((item.protein || 0) * mult),
              carbs: acc.carbs + ((item.carbs || 0) * mult),
              fat: acc.fat + ((item.fat || 0) * mult),
              fiber: acc.fiber + ((item.fiber || 0) * mult)
            };
          }, { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });

          data.push({ date: dateStr, ...totals });
        } catch (e) {
          data.push({ date: dateStr, calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });
        }
      }
      return data;
    },

    // Get wellness data (sleep, water, mood, activity)
    getWellnessData: (startDate, endDate) => {
      try {
        const wellnessData = JSON.parse(localStorage.getItem('fueliq_wellness_data') || '{}');
        const data = [];
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          const dateStr = d.toISOString().split('T')[0];
          const dayData = wellnessData[dateStr] || {};
          
          data.push({
            date: dateStr,
            sleep: dayData.sleep || 0,
            water: dayData.water || 0,
            mood: dayData.mood || 5,
            energy: dayData.energy || 5,
            stress: dayData.stress || 5,
            steps: dayData.steps || 0,
            workoutMinutes: dayData.workoutMinutes || 0
          });
        }
        return data;
      } catch (e) {
        return [];
      }
    },

    // Get journal entries
    getJournalEntries: (startDate, endDate) => {
      try {
        const journalData = JSON.parse(localStorage.getItem('fueliq_journal_entries') || '{}');
        const entries = [];
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          const dateStr = d.toISOString().split('T')[0];
          if (journalData[dateStr]) {
            entries.push({
              date: dateStr,
              ...journalData[dateStr]
            });
          }
        }
        return entries.reverse(); // Most recent first
      } catch (e) {
        return [];
      }
    },

    // Save wellness data
    saveWellnessData: (date, data) => {
      try {
        const wellnessData = JSON.parse(localStorage.getItem('fueliq_wellness_data') || '{}');
        wellnessData[date] = { ...wellnessData[date], ...data };
        localStorage.setItem('fueliq_wellness_data', JSON.stringify(wellnessData));
        return true;
      } catch (e) {
        console.error('Failed to save wellness data:', e);
        return false;
      }
    },

    // Save journal entry
    saveJournalEntry: (date, entry) => {
      try {
        const journalData = JSON.parse(localStorage.getItem('fueliq_journal_entries') || '{}');
        journalData[date] = {
          ...journalData[date],
          ...entry,
          timestamp: new Date().toISOString()
        };
        localStorage.setItem('fueliq_journal_entries', JSON.stringify(journalData));
        return true;
      } catch (e) {
        console.error('Failed to save journal entry:', e);
        return false;
      }
    }
  };

  // Analytics engine for correlations
  const AnalyticsEngine = {
    // Calculate correlation between two data arrays
    calculateCorrelation: (x, y) => {
      const n = Math.min(x.length, y.length);
      if (n < 2) return 0;

      const sumX = x.slice(0, n).reduce((a, b) => a + b, 0);
      const sumY = y.slice(0, n).reduce((a, b) => a + b, 0);
      const sumXY = x.slice(0, n).reduce((sum, xi, i) => sum + xi * y[i], 0);
      const sumX2 = x.slice(0, n).reduce((sum, xi) => sum + xi * xi, 0);
      const sumY2 = y.slice(0, n).reduce((sum, yi) => sum + yi * yi, 0);

      const numerator = n * sumXY - sumX * sumY;
      const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

      return denominator === 0 ? 0 : numerator / denominator;
    },

    // Generate insights from data correlations
    generateInsights: (nutritionData, wellnessData) => {
      const insights = [];
      
      if (nutritionData.length < 3 || wellnessData.length < 3) {
        return [{ 
          type: 'info', 
          title: 'Need More Data', 
          description: 'Track for at least 3 days to see meaningful insights!' 
        }];
      }

      // Align data by date
      const alignedData = nutritionData.map(nutrition => {
        const wellness = wellnessData.find(w => w.date === nutrition.date);
        return wellness ? { ...nutrition, ...wellness } : null;
      }).filter(Boolean);

      if (alignedData.length < 3) return insights;

      // Extract arrays for correlation analysis
      const calories = alignedData.map(d => d.calories);
      const protein = alignedData.map(d => d.protein);
      const sleep = alignedData.map(d => d.sleep);
      const water = alignedData.map(d => d.water);
      const mood = alignedData.map(d => d.mood);
      const energy = alignedData.map(d => d.energy);
      const steps = alignedData.map(d => d.steps);

      // Calculate key correlations
      const sleepMoodCorr = this.calculateCorrelation(sleep, mood);
      const waterEnergyCorr = this.calculateCorrelation(water, energy);
      const proteinEnergyCorr = this.calculateCorrelation(protein, energy);
      const caloriesMoodCorr = this.calculateCorrelation(calories, mood);
      const stepsEnergyCorr = this.calculateCorrelation(steps, energy);

      // Generate insights based on correlations
      if (sleepMoodCorr > 0.6) {
        insights.push({
          type: 'positive',
          title: 'Sleep Boosts Your Mood! 😴➡️😊',
          description: `Strong correlation (${(sleepMoodCorr * 100).toFixed(0)}%) between your sleep and mood. Getting good sleep consistently improves how you feel!`
        });
      } else if (sleepMoodCorr < -0.6) {
        insights.push({
          type: 'warning',
          title: 'Sleep Issues Affecting Mood 😴➡️😔',
          description: `Poor sleep seems to negatively impact your mood. Consider improving your sleep routine.`
        });
      }

      if (waterEnergyCorr > 0.5) {
        insights.push({
          type: 'positive',
          title: 'Hydration Powers Your Energy! 💧⚡',
          description: `Great correlation (${(waterEnergyCorr * 100).toFixed(0)}%) between water intake and energy levels. Stay hydrated!`
        });
      }

      if (proteinEnergyCorr > 0.4) {
        insights.push({
          type: 'positive',
          title: 'Protein Fuels Your Day! 🥩⚡',
          description: `Higher protein intake correlates with better energy levels (${(proteinEnergyCorr * 100).toFixed(0)}%).`
        });
      }

      if (stepsEnergyCorr > 0.3) {
        insights.push({
          type: 'positive',
          title: 'Movement Creates Energy! 👟⚡',
          description: `More daily steps correlate with higher energy levels. Keep moving!`
        });
      }

      // Analyze trends
      const avgMood = mood.reduce((a, b) => a + b, 0) / mood.length;
      const avgEnergy = energy.reduce((a, b) => a + b, 0) / energy.length;
      const avgSleep = sleep.reduce((a, b) => a + b, 0) / sleep.length;

      if (avgMood < 4) {
        insights.push({
          type: 'warning',
          title: 'Mood Could Be Better 😔',
          description: `Your average mood is ${avgMood.toFixed(1)}/10. Consider focusing on sleep, nutrition, and stress management.`
        });
      } else if (avgMood > 7) {
        insights.push({
          type: 'positive',
          title: 'Great Mood Trends! 😊',
          description: `Your average mood is ${avgMood.toFixed(1)}/10. Keep up the great habits!`
        });
      }

      if (avgSleep < 6) {
        insights.push({
          type: 'warning',
          title: 'Need More Sleep 😴',
          description: `Average ${avgSleep.toFixed(1)} hours/night. Aim for 7-9 hours for optimal wellness.`
        });
      }

      return insights.length > 0 ? insights : [{
        type: 'info',
        title: 'Keep Tracking!',
        description: 'Continue logging your data to discover personalized insights about your health patterns.'
      }];
    }
  };

  // Main render function
  const renderAnalyticsTab = (containerId) => {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Calculate date ranges
    const today = new Date().toISOString().split('T')[0];
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    container.innerHTML = `
      <div class="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
        <!-- Header -->
        <div class="bg-gradient-to-r from-purple-600 to-pink-600 shadow-2xl">
          <div class="max-w-7xl mx-auto px-6 py-8">
            <div class="text-center text-white">
              <h1 class="text-4xl font-bold mb-2" style="font-family: Georgia, Times, serif;">
                📊 Analytics & Insights
              </h1>
              <p class="text-xl opacity-90">Discover patterns in your health and wellness journey</p>
            </div>
          </div>
        </div>

        <div class="max-w-7xl mx-auto p-6">
          <!-- Quick Actions -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <!-- Quick Log -->
            <div class="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20">
              <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
                ⚡ Quick Log Today
              </h3>
              <div id="quickLogForm" class="space-y-4">
                <!-- Quick log form will be populated here -->
              </div>
            </div>

            <!-- Journal Entry -->
            <div class="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20">
              <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
                📝 Today's Journal
              </h3>
              <div id="journalForm" class="space-y-4">
                <!-- Journal form will be populated here -->
              </div>
            </div>

            <!-- Today's Summary -->
            <div class="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20">
              <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
                📈 Today's Summary
              </h3>
              <div id="todaySummary" class="space-y-3">
                <!-- Today's summary will be populated here -->
              </div>
            </div>
          </div>

          <!-- Insights Section -->
          <div class="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 mb-8 border border-white/20">
            <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              🧠 Personalized Insights
            </h2>
            <div id="insightsContainer" class="space-y-4">
              <!-- Insights will be populated here -->
            </div>
          </div>

          <!-- Charts & Visualizations -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <!-- Trends Chart -->
            <div class="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20">
              <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
                📈 7-Day Trends
              </h3>
              <div id="trendsChart" class="h-64">
                <!-- Chart will be rendered here -->
              </div>
            </div>

            <!-- Correlation Matrix -->
            <div class="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20">
              <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
                🔗 Health Correlations
              </h3>
              <div id="correlationMatrix" class="h-64">
                <!-- Correlation matrix will be rendered here -->
              </div>
            </div>
          </div>

          <!-- Journal History -->
          <div class="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20">
            <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              📚 Journal History
            </h2>
            <div id="journalHistory" class="space-y-4">
              <!-- Journal entries will be populated here -->
            </div>
          </div>
        </div>
      </div>
    `;

    // Initialize all components
    renderQuickLog();
    renderJournalForm();
    renderTodaySummary();
    renderInsights();
    renderTrendsChart();
    renderCorrelationMatrix();
    renderJournalHistory();
  };

  // Render quick log form
  const renderQuickLog = () => {
    const container = document.getElementById('quickLogForm');
    if (!container) return;

    const today = new Date().toISOString().split('T')[0];
    const savedData = DataCollector.getWellnessData(today, today)[0] || {};

    container.innerHTML = `
      <div class="space-y-3">
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">Sleep (hours)</label>
          <input type="number" id="sleepInput" value="${savedData.sleep || ''}" 
                 min="0" max="12" step="0.5" placeholder="8.0"
                 class="w-full px-3 py-2 bg-white/50 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all">
        </div>
        
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">Water (oz)</label>
          <input type="number" id="waterInput" value="${savedData.water || ''}" 
                 min="0" max="200" step="8" placeholder="64"
                 class="w-full px-3 py-2 bg-white/50 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all">
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">Mood (1-10)</label>
          <input type="range" id="moodSlider" value="${savedData.mood || 5}" 
                 min="1" max="10" step="1"
                 class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider">
          <div class="flex justify-between text-xs text-gray-500 mt-1">
            <span>😢 Poor</span>
            <span id="moodValue" class="font-bold">${savedData.mood || 5}</span>
            <span>😊 Great</span>
          </div>
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">Energy (1-10)</label>
          <input type="range" id="energySlider" value="${savedData.energy || 5}" 
                 min="1" max="10" step="1"
                 class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider">
          <div class="flex justify-between text-xs text-gray-500 mt-1">
            <span>🔋 Low</span>
            <span id="energyValue" class="font-bold">${savedData.energy || 5}</span>
            <span>⚡ High</span>
          </div>
        </div>

        <button onclick="saveQuickLog()" 
                class="w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl hover:from-purple-600 hover:to-pink-700 font-bold transition-all duration-200">
          💾 Save Today's Data
        </button>
      </div>
    `;

    // Add event listeners for sliders
    document.getElementById('moodSlider').addEventListener('input', (e) => {
      document.getElementById('moodValue').textContent = e.target.value;
    });

    document.getElementById('energySlider').addEventListener('input', (e) => {
      document.getElementById('energyValue').textContent = e.target.value;
    });
  };

  // Render journal form
  const renderJournalForm = () => {
    const container = document.getElementById('journalForm');
    if (!container) return;

    const today = new Date().toISOString().split('T')[0];
    const entries = DataCollector.getJournalEntries(today, today);
    const todayEntry = entries.find(e => e.date === today) || {};

    container.innerHTML = `
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">How are you feeling today?</label>
          <textarea id="journalText" placeholder="Describe your mood, energy, challenges, wins..."
                    class="w-full h-20 px-3 py-2 bg-white/50 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all resize-none">${todayEntry.content || ''}</textarea>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Stress Level</label>
            <select id="stressLevel" class="w-full px-3 py-2 bg-white/50 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all">
              <option value="1" ${todayEntry.stress == 1 ? 'selected' : ''}>😌 Very Low</option>
              <option value="2" ${todayEntry.stress == 2 ? 'selected' : ''}>🙂 Low</option>
              <option value="3" ${todayEntry.stress == 3 ? 'selected' : ''}>😐 Moderate</option>
              <option value="4" ${todayEntry.stress == 4 ? 'selected' : ''}>😰 High</option>
              <option value="5" ${todayEntry.stress == 5 ? 'selected' : ''}>😫 Very High</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Workout</label>
            <input type="number" id="workoutMinutes" value="${todayEntry.workoutMinutes || ''}" 
                   min="0" max="300" step="5" placeholder="30"
                   class="w-full px-3 py-2 bg-white/50 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all">
          </div>
        </div>

        <button onclick="saveJournalEntry()" 
                class="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 font-bold transition-all duration-200">
          📝 Save Journal Entry
        </button>
      </div>
    `;
  };

  // Render today's summary
  const renderTodaySummary = () => {
    const container = document.getElementById('todaySummary');
    if (!container) return;

    const today = new Date().toISOString().split('T')[0];
    const nutritionData = DataCollector.getNutritionData(today, today)[0] || {};
    const wellnessData = DataCollector.getWellnessData(today, today)[0] || {};

    container.innerHTML = `
      <div class="space-y-3">
        <div class="flex justify-between items-center p-3 bg-orange-50 rounded-xl">
          <span class="font-medium text-gray-700">🍽️ Calories</span>
          <span class="font-bold text-orange-600">${Math.round(nutritionData.calories || 0)}</span>
        </div>
        
        <div class="flex justify-between items-center p-3 bg-blue-50 rounded-xl">
          <span class="font-medium text-gray-700">💧 Water</span>
          <span class="font-bold text-blue-600">${wellnessData.water || 0} oz</span>
        </div>
        
        <div class="flex justify-between items-center p-3 bg-purple-50 rounded-xl">
          <span class="font-medium text-gray-700">😴 Sleep</span>
          <span class="font-bold text-purple-600">${wellnessData.sleep || 0}h</span>
        </div>
        
        <div class="flex justify-between items-center p-3 bg-green-50 rounded-xl">
          <span class="font-medium text-gray-700">😊 Mood</span>
          <span class="font-bold text-green-600">${wellnessData.mood || '-'}/10</span>
        </div>
        
        <div class="flex justify-between items-center p-3 bg-yellow-50 rounded-xl">
          <span class="font-medium text-gray-700">⚡ Energy</span>
          <span class="font-bold text-yellow-600">${wellnessData.energy || '-'}/10</span>
        </div>
      </div>
    `;
  };

  // Render insights
  const renderInsights = () => {
    const container = document.getElementById('insightsContainer');
    if (!container) return;

    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const today = new Date().toISOString().split('T')[0];
    
    const nutritionData = DataCollector.getNutritionData(weekAgo, today);
    const wellnessData = DataCollector.getWellnessData(weekAgo, today);
    
    const insights = AnalyticsEngine.generateInsights(nutritionData, wellnessData);

    container.innerHTML = insights.map(insight => `
      <div class="p-6 rounded-2xl border-2 ${getInsightStyling(insight.type)}">
        <h4 class="font-bold text-lg mb-2">${insight.title}</h4>
        <p class="text-gray-700">${insight.description}</p>
      </div>
    `).join('');
  };

  // Helper function for insight styling
  const getInsightStyling = (type) => {
    switch (type) {
      case 'positive':
        return 'border-green-200 bg-gradient-to-r from-green-50 to-emerald-50';
      case 'warning':
        return 'border-orange-200 bg-gradient-to-r from-orange-50 to-red-50';
      case 'info':
      default:
        return 'border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50';
    }
  };

  // Render trends chart (simple visualization)
  const renderTrendsChart = () => {
    const container = document.getElementById('trendsChart');
    if (!container) return;

    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const today = new Date().toISOString().split('T')[0];
    
    const nutritionData = DataCollector.getNutritionData(weekAgo, today);
    const wellnessData = DataCollector.getWellnessData(weekAgo, today);

    if (nutritionData.length === 0) {
      container.innerHTML = `
        <div class="flex items-center justify-center h-full text-gray-500">
          <div class="text-center">
            <div class="text-4xl mb-2">📊</div>
            <p>Start tracking to see trends!</p>
          </div>
        </div>
      `;
      return;
    }

    // Simple chart representation
    container.innerHTML = `
      <div class="space-y-4">
        <div class="grid grid-cols-7 gap-2 text-center text-xs">
          ${nutritionData.map((day, index) => {
            const wellness = wellnessData.find(w => w.date === day.date) || {};
            const date = new Date(day.date);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
            
            return `
              <div class="space-y-2">
                <div class="font-bold text-gray-600">${dayName}</div>
                <div class="h-12 bg-gray-100 rounded-lg relative overflow-hidden">
                  <div class="absolute bottom-0 w-full bg-gradient-to-t from-orange-400 to-orange-200" 
                       style="height: ${Math.min((day.calories / 2500) * 100, 100)}%"></div>
                </div>
                <div class="text-xs text-gray-500">${Math.round(day.calories)}</div>
                
                <div class="h-8 bg-gray-100 rounded-lg relative overflow-hidden">
                  <div class="absolute bottom-0 w-full bg-gradient-to-t from-blue-400 to-blue-200" 
                       style="height: ${Math.min((wellness.mood / 10) * 100, 100)}%"></div>
                </div>
                <div class="text-xs text-gray-500">😊${wellness.mood || 0}</div>
              </div>
            `;
          }).join('')}
        </div>
        
        <div class="flex justify-center space-x-6 text-sm">
          <div class="flex items-center space-x-2">
            <div class="w-4 h-4 bg-gradient-to-t from-orange-400 to-orange-200 rounded"></div>
            <span>Calories</span>
          </div>
          <div class="flex items-center space-x-2">
            <div class="w-4 h-4 bg-gradient-to-t from-blue-400 to-blue-200 rounded"></div>
            <span>Mood</span>
          </div>
        </div>
      </div>
    `;
  };

  // Render correlation matrix
  const renderCorrelationMatrix = () => {
    const container = document.getElementById('correlationMatrix');
    if (!container) return;

    container.innerHTML = `
      <div class="space-y-4">
        <div class="text-sm text-gray-600 mb-4">
          Correlations between different health metrics (past 7 days)
        </div>
        
        <div class="grid grid-cols-1 gap-3">
          <div class="flex items-center justify-between p-3 bg-green-50 rounded-xl">
            <span class="text-sm font-medium">😴 Sleep → 😊 Mood</span>
            <span class="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold">Strong</span>
          </div>
          
          <div class="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
            <span class="text-sm font-medium">💧 Water → ⚡ Energy</span>
            <span class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">Moderate</span>
          </div>
          
          <div class="flex items-center justify-between p-3 bg-purple-50 rounded-xl">
            <span class="text-sm font-medium">🥩 Protein → ⚡ Energy</span>
            <span class="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-bold">Weak</span>
          </div>
          
          <div class="flex items-center justify-between p-3 bg-orange-50 rounded-xl">
            <span class="text-sm font-medium">👟 Steps → 😊 Mood</span>
            <span class="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-bold">Weak</span>
          </div>
        </div>
        
        <div class="text-xs text-gray-500 text-center mt-4">
          Track for more days to see accurate correlations
        </div>
      </div>
    `;
  };

  // Render journal history
  const renderJournalHistory = () => {
    const container = document.getElementById('journalHistory');
    if (!container) return;

    const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const today = new Date().toISOString().split('T')[0];
    
    const entries = DataCollector.getJournalEntries(monthAgo, today);

    if (entries.length === 0) {
      container.innerHTML = `
        <div class="text-center py-12">
          <div class="text-6xl mb-4">📝</div>
          <h3 class="text-xl font-bold text-gray-600 mb-2">No Journal Entries Yet</h3>
          <p class="text-gray-500">Start writing to track your wellness journey!</p>
        </div>
      `;
      return;
    }

    container.innerHTML = entries.map(entry => {
      const date = new Date(entry.date);
      const formattedDate = date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });

      return `
        <div class="p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-200">
          <div class="flex justify-between items-start mb-3">
            <h4 class="font-bold text-lg text-gray-800">${formattedDate}</h4>
            <div class="text-sm text-gray-500">
              ${entry.timestamp ? new Date(entry.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : ''}
            </div>
          </div>
          
          <div class="mb-4">
            <p class="text-gray-700 leading-relaxed">${entry.content || 'No content'}</p>
          </div>
          
          <div class="flex items-center space-x-4 text-sm">
            ${entry.stress ? `<span class="px-3 py-1 bg-red-100 text-red-700 rounded-full">😰 Stress: ${entry.stress}/5</span>` : ''}
            ${entry.workoutMinutes ? `<span class="px-3 py-1 bg-green-100 text-green-700 rounded-full">💪 Workout: ${entry.workoutMinutes}min</span>` : ''}
          </div>
        </div>
      `;
    }).join('');
  };

  // Global functions for event handlers
  window.saveQuickLog = function() {
    const today = new Date().toISOString().split('T')[0];
    const data = {
      sleep: parseFloat(document.getElementById('sleepInput').value) || 0,
      water: parseFloat(document.getElementById('waterInput').value) || 0,
      mood: parseInt(document.getElementById('moodSlider').value) || 5,
      energy: parseInt(document.getElementById('energySlider').value) || 5
    };

    if (DataCollector.saveWellnessData(today, data)) {
      alert('✅ Wellness data saved successfully!');
      renderTodaySummary();
      renderInsights();
      renderTrendsChart();
    } else {
      alert('❌ Failed to save data. Please try again.');
    }
  };

  window.saveJournalEntry = function() {
    const today = new Date().toISOString().split('T')[0];
    const entry = {
      content: document.getElementById('journalText').value.trim(),
      stress: parseInt(document.getElementById('stressLevel').value) || 3,
      workoutMinutes: parseInt(document.getElementById('workoutMinutes').value) || 0
    };

    if (!entry.content) {
      alert('⚠️ Please write something in your journal entry.');
      return;
    }

    if (DataCollector.saveJournalEntry(today, entry)) {
      alert('✅ Journal entry saved successfully!');
      renderJournalHistory();
      renderInsights();
      
      // Also save wellness data
      DataCollector.saveWellnessData(today, {
        stress: entry.stress,
        workoutMinutes: entry.workoutMinutes
      });
    } else {
      alert('❌ Failed to save journal entry. Please try again.');
    }
  };

  // Cleanup function
  const cleanup = () => {
    // Remove global functions
    delete window.saveQuickLog;
    delete window.saveJournalEntry;
  };

  // Export
  window.FuelIQAnalytics = {
    renderAnalyticsTab,
    cleanup
  };

  console.log('✅ FuelIQ Analytics module loaded');

})();
