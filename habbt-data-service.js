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

      localStorage.setItem('habbt_profile_data', JSON.stringify({
        personal: {
          name: data.name || '',
          age: data.age || '',
          gender: data.gender || 'male',
          height: data.height || '',
        },
        current_weight: data.current_weight || '',
        goals: {
          calories: data.calories_goal || 2000,
          protein: data.protein_goal || 150,
          carbs: data.carbs_goal || 250,
          fat: data.fat_goal || 67,
          water: data.water_goal || 64
        },
        dietary: {
          restrictions: data.dietary_restrictions ? data.dietary_restrictions.split(',') : [],
          allergies: data.allergies ? data.allergies.split(',') : [],
          foods_love: data.foods_love ? data.foods_love.split(',') : [],
          foods_avoid: data.foods_avoid ? data.foods_avoid.split(',') : []
        },
        activity_level: data.activity_level || 'moderate',
        goal_type: data.goal_type || 'fat_loss'
      }));

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

    // Sync to localStorage immediately so UI updates instantly
    const existing = JSON.parse(localStorage.getItem('habbt_profile_data') || '{}');
    localStorage.setItem('habbt_profile_data', JSON.stringify({
      ...existing,
      ...profileData
    }));

    // Write through to Sheet
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
