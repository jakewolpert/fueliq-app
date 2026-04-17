// Habbt Data Service
// Replaces localStorage with Google Sheets backend
// Save this as: habbt-data-service.js

(function() {
  if (window.HabbtDataService) return;

  const API_URL = 'https://script.google.com/macros/s/AKfycbxj8trJV9lvSwtcsl85Zb1XGJy4sqOWdwWbaUBwz-IngH89mh_XRbr2rQNWsb0PHeoZTw/exec';

  // ─── LOCAL CACHE ──────────────────────────────────────────────────────────
  // We keep a local cache so the app feels instant.
  // On load we pull from Sheets, then write-through on every save.
  const cache = {
    profile: null,
    dailyLog: {},
    meals: {},
    journal: {},
    workouts: {}
  };

  // Track last synced values to prevent duplicate Sheet writes on re-renders
  const lastSynced = {
    profile: null,
    meals: {},
    journal: {},
    weight: null
  };

  // ─── CORE HTTP HELPERS ────────────────────────────────────────────────────
  async function get(action, params = {}) {
    const url = new URL(API_URL);
    url.searchParams.set('action', action);
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

    try {
      const res = await fetch(url.toString());
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      return data;
    } catch (err) {
      console.error(`[HabbtDataService] GET ${action} failed:`, err);
      throw err;
    }
  }

  async function post(action, payload) {
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify({ action, payload }),
        headers: { 'Content-Type': 'text/plain' } // Apps Script requires text/plain for CORS
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      return data;
    } catch (err) {
      console.error(`[HabbtDataService] POST ${action} failed:`, err);
      throw err;
    }
  }

  // ─── PROFILE ──────────────────────────────────────────────────────────────
  async function getProfile() {
    if (cache.profile) return cache.profile;

    try {
      const data = await get('getProfile');
      cache.profile = data;

      // Only sync to localStorage if Sheet has actual data (don't overwrite with empty)
      if (!data || Object.keys(data).length === 0) return data;

      // Reconstruct the EXACT nested structure profile-tab.js expects
      const nested = {
        personal: {
          name: data.name || '',
          birthday: data.birthday || '',
          height: data.height || '',
          gender: data.gender || 'male'
        },
        current: {
          weight: data.current_weight || '',
          activityLevel: data.activity_level || 'moderate',
          lastWeightEntry: null
        },
        goals: {
          primaryGoal: data.goal_type || 'fat_loss',
          targetWeight: data.target_weight || '',
          targetDate: data.target_date || '',
          calories: data.calories_goal || 2000,
          protein: data.protein_goal || 150,
          carbs: data.carbs_goal || 250,
          fat: data.fat_goal || 67,
          water: data.water_goal || 64
        },
        dietary: {
          restrictions: data.dietary_restrictions ? data.dietary_restrictions.split(',').filter(Boolean) : [],
          allergies: data.allergies ? data.allergies.split(',').filter(Boolean) : [],
          healthConcerns: []
        },
        preferences: {
          foodsILove: data.foods_love ? data.foods_love.split(',').filter(Boolean) : [],
          foodsIAvoid: data.foods_avoid ? data.foods_avoid.split(',').filter(Boolean) : [],
          cuisines: data.cuisines ? data.cuisines.split(',').filter(Boolean) : [],
          antiBloutPreference: false
        },
        weightHistory: [],
        planGenerated: false,
        planGeneratedDate: null
      };

      // Only write to localStorage if current localStorage is empty or missing current
      const existing = localStorage.getItem('habbt_profile_data');
      const existingParsed = existing ? JSON.parse(existing) : null;
      if (!existingParsed || !existingParsed.current || !existingParsed.current.weight) {
        _originalSetItem('habbt_profile_data', JSON.stringify(nested));
      }

      return data;
    } catch (err) {
      // Fall back to localStorage if Sheet is unreachable
      console.warn('[HabbtDataService] Falling back to localStorage for profile');
      const local = localStorage.getItem('habbt_profile_data');
      return local ? JSON.parse(local) : {};
    }
  }

  async function saveProfile(profileData) {
    cache.profile = { ...cache.profile, ...profileData };

    // Write through to Sheet only — never touch localStorage here
    // localStorage is managed by profile-tab.js directly
    try {
      await post('saveProfile', profileData);
      console.log('[HabbtDataService] Profile saved to Sheet');
    } catch (err) {
      console.warn('[HabbtDataService] Profile saved locally only — Sheet unavailable');
    }

    return cache.profile;
  }

  // ─── DAILY LOG ────────────────────────────────────────────────────────────
  async function getDailyLog(date) {
    const d = date || today();
    if (cache.dailyLog[d]) return cache.dailyLog[d];

    try {
      const data = await get('getDailyLog', { date: d });
      cache.dailyLog[d] = data;
      return data;
    } catch (err) {
      console.warn('[HabbtDataService] Could not fetch daily log');
      return { date: d, empty: true };
    }
  }

  async function saveDailyLog(payload) {
    const d = payload.date || today();
    cache.dailyLog[d] = { ...cache.dailyLog[d], ...payload };

    try {
      await post('saveDailyLog', { ...payload, date: d });
    } catch (err) {
      console.warn('[HabbtDataService] Daily log saved locally only');
    }
  }

  // ─── MEALS ────────────────────────────────────────────────────────────────
  async function getMeals(date) {
    const d = date || today();
    if (cache.meals[d]) return cache.meals[d];

    try {
      const data = await get('getMeals', { date: d });
      cache.meals[d] = data;

      // Sync to localStorage format the existing meals tab expects
      const localKey = `habbt_meals_${d}`;
      localStorage.setItem(localKey, JSON.stringify(data.meals || {}));

      return data;
    } catch (err) {
      // Fall back to localStorage
      const local = localStorage.getItem(`habbt_meals_${d}`);
      return {
        date: d,
        meals: local ? JSON.parse(local) : { breakfast: [], lunch: [], dinner: [], snacks: [] }
      };
    }
  }

  async function saveMeal(mealData) {
    const d = mealData.date || today();

    // Update local cache immediately
    if (!cache.meals[d]) {
      cache.meals[d] = { meals: { breakfast: [], lunch: [], dinner: [], snacks: [] } };
    }
    const type = mealData.meal_type || 'snacks';
    if (!cache.meals[d].meals[type]) cache.meals[d].meals[type] = [];
    cache.meals[d].meals[type].push(mealData);

    // Sync to localStorage so existing UI works
    const localKey = `habbt_meals_${d}`;
    localStorage.setItem(localKey, JSON.stringify(cache.meals[d].meals));

    // Write through to Sheet
    try {
      await post('saveMeal', { ...mealData, date: d });
    } catch (err) {
      console.warn('[HabbtDataService] Meal saved locally only');
    }
  }

  async function deleteMeal(mealData) {
    const d = mealData.date || today();

    // Update local cache
    if (cache.meals[d] && cache.meals[d].meals) {
      const type = mealData.meal_type || 'snacks';
      cache.meals[d].meals[type] = (cache.meals[d].meals[type] || [])
        .filter(m => m.food_name !== mealData.food_name);
      localStorage.setItem(`habbt_meals_${d}`, JSON.stringify(cache.meals[d].meals));
    }

    try {
      await post('deleteMeal', { ...mealData, date: d });
    } catch (err) {
      console.warn('[HabbtDataService] Delete saved locally only');
    }
  }

  // ─── JOURNAL ──────────────────────────────────────────────────────────────
  async function getJournal(date) {
    const d = date || today();
    if (cache.journal[d]) return cache.journal[d];

    try {
      const data = await get('getJournal', { date: d });
      cache.journal[d] = data;
      localStorage.setItem(`habbt_journal_${d}`, JSON.stringify(data.entries || []));
      return data;
    } catch (err) {
      const local = localStorage.getItem(`habbt_journal_${d}`);
      return { date: d, entries: local ? JSON.parse(local) : [] };
    }
  }

  async function saveJournal(entryData) {
    const d = entryData.date || today();

    if (!cache.journal[d]) cache.journal[d] = { entries: [] };
    cache.journal[d].entries.push(entryData);
    localStorage.setItem(`habbt_journal_${d}`, JSON.stringify(cache.journal[d].entries));

    try {
      await post('saveJournal', { ...entryData, date: d });
    } catch (err) {
      console.warn('[HabbtDataService] Journal saved locally only');
    }
  }

  // ─── WORKOUTS ─────────────────────────────────────────────────────────────
  async function getWorkouts(date) {
    const d = date || today();
    if (cache.workouts[d]) return cache.workouts[d];

    try {
      const data = await get('getWorkouts', { date: d });
      cache.workouts[d] = data;
      return data;
    } catch (err) {
      return { date: d, workouts: [] };
    }
  }

  async function saveWorkout(workoutData) {
    const d = workoutData.date || today();

    if (!cache.workouts[d]) cache.workouts[d] = { workouts: [] };
    cache.workouts[d].workouts.push(workoutData);

    try {
      await post('saveWorkout', { ...workoutData, date: d });
    } catch (err) {
      console.warn('[HabbtDataService] Workout saved locally only');
    }
  }

  // ─── HISTORY (for AI queries) ─────────────────────────────────────────────
  async function getHistory(days = 30) {
    try {
      return await get('getHistory', { days });
    } catch (err) {
      console.warn('[HabbtDataService] Could not fetch history');
      return { days, history: [] };
    }
  }


  // ─── LOCALSTORAGE INTERCEPTOR ─────────────────────────────────────────────
  // Watches for writes to key localStorage keys and mirrors them to the Sheet
  // This means we never need to modify profile-tab.js or other tab files
  const _originalSetItem = localStorage.setItem.bind(localStorage);
  
  localStorage.setItem = function(key, value) {
    // Always do the normal localStorage write first
    _originalSetItem(key, value);
    
    // Mirror profile saves to Sheet
    if (key === 'habbt_profile_data') {
      try {
        const parsed = JSON.parse(value);
        if (!parsed || !parsed.personal || !parsed.personal.name) return;
        
        // Only sync if data actually changed
        if (lastSynced.profile === value) return;
        lastSynced.profile = value;
        
        // Flatten the nested profile structure into Sheet-friendly key/value pairs
        const flat = {
          name:                 parsed.personal?.name || '',
          age:                  parsed.personal?.age || '',
          gender:               parsed.personal?.gender || '',
          height:               parsed.personal?.height || '',
          current_weight:       parsed.current?.weight || '',
          activity_level:       parsed.current?.activityLevel || '',
          goal_type:            parsed.goals?.primaryGoal || '',
          calories_goal:        parsed.goals?.calories || '',
          protein_goal:         parsed.goals?.protein || '',
          carbs_goal:           parsed.goals?.carbs || '',
          fat_goal:             parsed.goals?.fat || '',
          water_goal:           parsed.goals?.water || '',
          dietary_restrictions: (parsed.dietary?.restrictions || []).join(','),
          allergies:            (parsed.dietary?.allergies || []).join(','),
          foods_love:           (parsed.preferences?.foodsILove || []).join(','),
          foods_avoid:          (parsed.preferences?.foodsIAvoid || []).join(','),
          cuisines:             (parsed.preferences?.cuisines || []).join(',')
        };
        
        // Fire and forget — don't block the UI
        post('saveProfile', flat)
          .then(() => console.log('[HabbtDataService] Profile mirrored to Sheet ✅'))
          .catch(err => console.warn('[HabbtDataService] Sheet sync failed (data safe in localStorage):', err));
          
        cache.profile = flat;
      } catch(e) {
        // Never crash the app over a sync failure
      }
    }
    
    // Mirror daily meal totals to Sheet (handles both habbt_ and fueliq_ key prefixes)
    if (key.startsWith('habbt_meals_') || key.startsWith('fueliq_meals_')) {
      try {
        const date = key.replace('habbt_meals_', '').replace('fueliq_meals_', '');
        
        // Only sync if data actually changed
        if (lastSynced.meals[date] === value) return;
        lastSynced.meals[date] = value;

        const meals = JSON.parse(value);
        const allFoods = [
          ...(meals.breakfast || []),
          ...(meals.lunch || []),
          ...(meals.dinner || []),
          ...(meals.snacks || [])
        ];
        const totals = allFoods.reduce((acc, item) => {
          const mult = (item.servingSize || 100) / 100;
          return {
            calories: acc.calories + ((item.calories || 0) * mult),
            protein:  acc.protein  + ((item.protein  || 0) * mult),
            carbs:    acc.carbs    + ((item.carbs    || 0) * mult),
            fat:      acc.fat      + ((item.fat      || 0) * mult)
          };
        }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
        
        post('saveDailyLog', {
          date,
          calories_consumed: Math.round(totals.calories),
          protein: Math.round(totals.protein),
          carbs:   Math.round(totals.carbs),
          fat:     Math.round(totals.fat)
        }).catch(() => {});
      } catch(e) {}
    }

    // Mirror journal entries to Sheet (handles both habbt_ and fueliq_ key prefixes)
    if (key.startsWith('habbt_journal_') || key.startsWith('fueliq_journal_')) {
      try {
        const date = key.replace('habbt_journal_', '').replace('fueliq_journal_', '');
        
        // Only sync if data actually changed
        if (lastSynced.journal[date] === value) return;
        lastSynced.journal[date] = value;

        const entries = JSON.parse(value);
        if (Array.isArray(entries) && entries.length > 0) {
          const latest = entries[entries.length - 1];
          post('saveJournal', { ...latest, date }).catch(() => {});
        }
      } catch(e) {}
    }
  };

  // ─── INIT ─────────────────────────────────────────────────────────────────
  // On load: pull profile from Sheet, hydrate localStorage so existing tabs work
  async function init() {
    console.log('[HabbtDataService] Initializing — pulling from Google Sheets...');
    try {
      await getProfile();
      await getMeals(today());
      console.log('[HabbtDataService] Ready ✅');
      window.dispatchEvent(new CustomEvent('habbt-data-ready'));
    } catch (err) {
      console.warn('[HabbtDataService] Init failed, running in offline mode');
      window.dispatchEvent(new CustomEvent('habbt-data-ready'));
    }
  }

  // ─── UTILITY ──────────────────────────────────────────────────────────────
  function today() {
    return new Date().toISOString().split('T')[0];
  }

  // ─── PUBLIC API ───────────────────────────────────────────────────────────
  window.HabbtDataService = {
    // Profile
    getProfile,
    saveProfile,

    // Daily
    getDailyLog,
    saveDailyLog,

    // Meals
    getMeals,
    saveMeal,
    deleteMeal,

    // Journal
    getJournal,
    saveJournal,

    // Workouts
    getWorkouts,
    saveWorkout,

    // History
    getHistory,

    // Utils
    today,
    init
  };

  // Auto-init when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
