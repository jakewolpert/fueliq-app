// Habbt Evening Journal Tab - journal-tab.js
window.HabbtJournal = (function() {
  let currentContainer = null;

  // Journal data management
  function saveJournalEntry(date, data) {
    try {
      localStorage.setItem(`habbt_journal_${date}`, JSON.stringify(data));
      return true;
    } catch (e) {
      console.error('Failed to save journal entry:', e);
      return false;
    }
  }

  function getJournalEntry(date) {
    try {
      const data = localStorage.getItem(`habbt_journal_${date}`);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  }

  function getJournalHistory(days = 7) {
    const history = [];
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split('T')[0];
      const entry = getJournalEntry(dateKey);
      if (entry) {
        history.push({ date: dateKey, ...entry });
      }
    }
    return history.reverse();
  }

  // Main render function
  function renderJournalTab(containerId) {
    currentContainer = containerId;
    const container = document.getElementById(containerId);
    if (!container) return;

    const today = new Date().toISOString().split('T')[0];
    const todayEntry = getJournalEntry(today) || {};
    const recentEntries = getJournalHistory(7);

    container.innerHTML = `
      <div class="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-cyan-50">
        <div class="max-w-6xl mx-auto p-6">
          
          <!-- Header -->
          <div class="bg-gradient-to-r from-blue-600 to-teal-600 rounded-3xl shadow-2xl p-8 mb-8 text-white">
            <div class="text-center">
              <div class="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                <span class="text-4xl">📝</span>
              </div>
              <h1 class="text-4xl font-bold mb-3" style="font-family: Georgia, Times, serif">
                Evening Journal
              </h1>
              <p class="text-xl opacity-90 mb-2">
                Track your daily wellness for powerful insights
              </p>
              <div class="text-sm opacity-80">
                📊 Your patterns help create personalized nutrition recommendations
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            <!-- Main Journal Form -->
            <div class="lg:col-span-2">
              <div class="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20">
                
                <!-- Date Selector -->
                <div class="flex items-center justify-between mb-6">
                  <h2 class="text-2xl font-bold text-gray-800">Today's Reflection</h2>
                  <div class="flex items-center space-x-2">
                    <input type="date" 
                           id="journal-date-picker" 
                           value="${today}"
                           max="${today}"
                           class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500">
                    <button onclick="loadJournalDate()" 
                            class="px-3 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors">
                      📅 Load
                    </button>
                  </div>
                </div>

                <!-- Journal Form -->
                <div class="space-y-6" id="journal-form">
                  
                  <!-- Overall Energy -->
                  <div>
                    <label class="block text-sm font-bold text-gray-700 mb-3">How was your energy today?</label>
                    <div class="flex justify-center space-x-2" id="energy-rating">
                      ${[1,2,3,4,5].map(i => `
                        <button onclick="setRating('energy', ${i})" 
                                class="w-12 h-12 rounded-full border-2 transition-all energy-btn text-sm font-bold ${
                                  (todayEntry.energy || 0) >= i ? 
                                  'bg-blue-500 border-blue-500 text-white' : 
                                  'bg-white border-gray-300 hover:border-blue-400 text-gray-600'
                                }">
                          ${i}
                        </button>
                      `).join('')}
                    </div>
                    <div class="text-center text-xs text-gray-500 mt-2">1 = Drained • 5 = Energized</div>
                  </div>

                  <!-- Overall Mood -->
                  <div>
                    <label class="block text-sm font-bold text-gray-700 mb-3">How was your mood today?</label>
                    <div class="flex justify-center space-x-2" id="mood-rating">
                      ${[1,2,3,4,5].map(i => `
                        <button onclick="setRating('mood', ${i})" 
                                class="w-12 h-12 rounded-full border-2 transition-all mood-btn text-sm font-bold ${
                                  (todayEntry.mood || 0) >= i ? 
                                  'bg-green-500 border-green-500 text-white' : 
                                  'bg-white border-gray-300 hover:border-green-400 text-gray-600'
                                }">
                          ${i}
                        </button>
                      `).join('')}
                    </div>
                    <div class="text-center text-xs text-gray-500 mt-2">1 = Poor • 5 = Great</div>
                  </div>

                  <!-- Meal Satisfaction -->
                  <div>
                    <label class="block text-sm font-bold text-gray-700 mb-3">How satisfied were you with your meals?</label>
                    <div class="flex justify-center space-x-2" id="satisfaction-rating">
                      ${[1,2,3,4,5].map(i => `
                        <button onclick="setRating('mealSatisfaction', ${i})" 
                                class="w-12 h-12 rounded-full border-2 transition-all satisfaction-btn text-sm font-bold ${
                                  (todayEntry.mealSatisfaction || 0) >= i ? 
                                  'bg-orange-500 border-orange-500 text-white' : 
                                  'bg-white border-gray-300 hover:border-orange-400 text-gray-600'
                                }">
                          ${i}
                        </button>
                      `).join('')}
                    </div>
                    <div class="text-center text-xs text-gray-500 mt-2">1 = Unsatisfied • 5 = Perfect</div>
                  </div>

                  <!-- Water Intake -->
                  <div>
                    <label class="block text-sm font-bold text-gray-700 mb-3">Water Intake (Cups)</label>
                    <div class="flex justify-center">
                      <input type="number" 
                             id="water-input"
                             value="${todayEntry.waterCups || ''}"
                             placeholder="8"
                             min="0" max="20"
                             class="w-24 h-12 text-center text-lg font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none">
                    </div>
                    <div class="text-center text-xs text-gray-500 mt-2">Total cups of water today</div>
                  </div>

                  <!-- Symptoms -->
                  <div>
                    <label class="block text-sm font-bold text-gray-700 mb-3">Any symptoms today? (Check all that apply)</label>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                      ${[
                        { id: 'headache', label: 'Headache', icon: '🤕' },
                        { id: 'fatigue', label: 'Fatigue', icon: '😴' },
                        { id: 'bloating', label: 'Bloating', icon: '🤰' },
                        { id: 'stomach_pain', label: 'Stomach Pain', icon: '😣' },
                        { id: 'nausea', label: 'Nausea', icon: '🤢' },
                        { id: 'brain_fog', label: 'Brain Fog', icon: '🌫️' },
                        { id: 'irritability', label: 'Irritability', icon: '😤' },
                        { id: 'food_cravings', label: 'Food Cravings', icon: '🍪' }
                      ].map(symptom => `
                        <label class="flex items-center space-x-2 cursor-pointer p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                          <input type="checkbox" 
                                 class="symptom-checkbox"
                                 data-symptom="${symptom.id}"
                                 ${(todayEntry.symptoms || []).includes(symptom.id) ? 'checked' : ''}
                                 onchange="updateSymptoms()">
                          <span class="text-lg">${symptom.icon}</span>
                          <span class="text-sm">${symptom.label}</span>
                        </label>
                      `).join('')}
                    </div>
                  </div>

                  <!-- Notes -->
                  <div>
                    <label class="block text-sm font-bold text-gray-700 mb-3">Daily Notes</label>
                    <textarea id="notes-input" 
                              placeholder="How did your meals make you feel? Any observations about energy, mood, or symptoms? What went well today?"
                              class="w-full h-24 p-4 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none resize-none">${todayEntry.notes || ''}</textarea>
                    <div class="text-xs text-gray-500 mt-1">These notes help us find patterns between your nutrition and how you feel</div>
                  </div>

                  <!-- Save Button -->
                  <div class="text-center pt-4">
                    <button onclick="saveCurrentEntry()" 
                            class="bg-gradient-to-r from-blue-600 to-teal-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-teal-700 transition-all shadow-lg">
                      💾 Save Today's Journal
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Sidebar -->
            <div class="space-y-6">
              
              <!-- Quick Stats -->
              <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20">
                <h3 class="text-lg font-bold text-gray-800 mb-4 flex items-center">
                  <span class="mr-2 text-2xl">📊</span>
                  This Week
                </h3>
                <div class="space-y-3">
                  <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-600">Days Logged</span>
                    <span class="font-bold text-blue-600">${recentEntries.length}/7</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-600">Avg Energy</span>
                    <span class="font-bold text-green-600">
                      ${recentEntries.length > 0 ? 
                        (recentEntries.reduce((acc, entry) => acc + (entry.energy || 0), 0) / recentEntries.length).toFixed(1) : 
                        '—'
                      }/5
                    </span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-600">Avg Mood</span>
                    <span class="font-bold text-orange-600">
                      ${recentEntries.length > 0 ? 
                        (recentEntries.reduce((acc, entry) => acc + (entry.mood || 0), 0) / recentEntries.length).toFixed(1) : 
                        '—'
                      }/5
                    </span>
                  </div>
                </div>
              </div>

              <!-- Recent Entries -->
              <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20">
                <h3 class="text-lg font-bold text-gray-800 mb-4 flex items-center">
                  <span class="mr-2 text-2xl">📅</span>
                  Recent Days
                </h3>
                <div class="space-y-3">
                  ${recentEntries.length === 0 ? 
                    '<div class="text-sm text-gray-500 text-center py-4">No entries yet.<br>Start logging to see patterns!</div>' :
                    recentEntries.slice(0, 5).map(entry => `
                      <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div class="text-sm font-medium text-gray-800">
                            ${new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </div>
                          <div class="text-xs text-gray-600">
                            Energy: ${entry.energy || '—'} • Mood: ${entry.mood || '—'}
                          </div>
                        </div>
                        <button onclick="loadSpecificDate('${entry.date}')" 
                                class="text-blue-500 hover:text-blue-700 text-xs">
                          Edit
                        </button>
                      </div>
                    `).join('')
                  }
                </div>
              </div>

              <!-- Insights Preview -->
              <div class="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl shadow-lg p-6 border border-purple-200">
                <h3 class="text-lg font-bold text-purple-800 mb-3 flex items-center">
                  <span class="mr-2 text-2xl">🧠</span>
                  Coming Soon
                </h3>
                <p class="text-sm text-purple-700 mb-3">
                  Smart insights will appear here once you have a few days of data:
                </p>
                <ul class="text-xs text-purple-600 space-y-1">
                  <li>• Sleep-nutrition correlations</li>
                  <li>• Meal timing patterns</li>
                  <li>• Symptom triggers</li>
                  <li>• Energy optimization tips</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Initialize current entry
    window.currentJournalEntry = todayEntry;
    window.currentJournalDate = today;
  }

  // Global functions for interactions
  window.setRating = function(type, value) {
    window.currentJournalEntry[type] = value;
    
    // Update UI
    document.querySelectorAll(`.${type}-btn`).forEach((btn, index) => {
      const isActive = index < value;
      const colorClass = type === 'energy' ? 'bg-blue-500 border-blue-500' :
                         type === 'mood' ? 'bg-green-500 border-green-500' :
                         'bg-orange-500 border-orange-500';
      
      if (isActive) {
        btn.className = btn.className.replace(/bg-white border-gray-300 text-gray-600/, `${colorClass} text-white`);
      } else {
        btn.className = btn.className.replace(new RegExp(`${colorClass} text-white`), 'bg-white border-gray-300 text-gray-600');
      }
    });
  };

  window.updateSymptoms = function() {
    const checkedSymptoms = Array.from(document.querySelectorAll('.symptom-checkbox:checked'))
      .map(cb => cb.dataset.symptom);
    window.currentJournalEntry.symptoms = checkedSymptoms;
  };

  window.loadJournalDate = function() {
    const dateInput = document.getElementById('journal-date-picker');
    const selectedDate = dateInput.value;
    loadSpecificDate(selectedDate);
  };

  window.loadSpecificDate = function(date) {
    window.currentJournalDate = date;
    const entry = getJournalEntry(date) || {};
    window.currentJournalEntry = entry;
    
    // Re-render the form with the selected date's data
    renderJournalTab(currentContainer);
  };

  window.saveCurrentEntry = function() {
    const waterInput = document.getElementById('water-input');
    const notesInput = document.getElementById('notes-input');
    
    if (waterInput && waterInput.value) {
      window.currentJournalEntry.waterCups = parseInt(waterInput.value);
    }
    if (notesInput && notesInput.value) {
      window.currentJournalEntry.notes = notesInput.value;
    }
    
    const success = saveJournalEntry(window.currentJournalDate, window.currentJournalEntry);
    
    if (success) {
      const isToday = window.currentJournalDate === new Date().toISOString().split('T')[0];
      alert(`✅ Journal entry saved for ${isToday ? 'today' : new Date(window.currentJournalDate).toLocaleDateString()}!`);
      
      // Refresh to show updated stats
      setTimeout(() => {
        renderJournalTab(currentContainer);
      }, 500);
    } else {
      alert('❌ Failed to save journal entry. Please try again.');
    }
  };

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
    renderJournalTab,
    saveJournalEntry,
    getJournalEntry,
    getJournalHistory,
    cleanup
  };
})();

// Compatibility exports
window.FuelIQJournal = window.HabbtJournal;
window.renderJournalTab = window.HabbtJournal.renderJournalTab;

console.log('📝 Habbt Evening Journal loaded - Track daily wellness for powerful insights!');
