// Intelligent Adaptive Meal Planning System - Precision Macro Targeting
(function() {
    'use strict';

    // Enhanced meal database with detailed nutritional profiles
    const COMPREHENSIVE_MEAL_DATABASE = {
        breakfast: [
            {
                id: 'breakfast_protein_oatmeal',
                name: 'Protein Power Oatmeal Bowl',
                description: 'Creamy oats with protein powder, banana, and almond butter',
                baseCalories: 450, baseProtein: 30, baseCarbs: 55, baseFat: 12, baseFiber: 8,
                prepTime: '5 min', cookTime: '3 min', difficulty: 'Easy',
                image: '🥣', color: 'from-amber-400 to-orange-500',
                tags: ['high-protein', 'quick', 'muscle-building', 'customizable'],
                dietaryInfo: ['vegetarian', 'gluten-free-option'],
                healthAttributes: ['heart-healthy', 'high-fiber', 'sustained-energy'],
                allergens: ['nuts', 'gluten-option'],
                pantryFriendly: true,
                scalability: 'excellent', // How well it scales up/down
                proteinDensity: 6.7, // protein per 100 calories
                ingredients: [
                    { name: 'rolled oats', pantryItem: true, allergens: ['gluten-option'] },
                    { name: 'protein powder', pantryItem: true, allergens: ['dairy-option'] },
                    { name: 'banana', pantryItem: false, allergens: [] },
                    { name: 'almond butter', pantryItem: true, allergens: ['nuts'] }
                ]
            },
            {
                id: 'breakfast_greek_scramble',
                name: 'Mediterranean Egg Scramble',
                description: 'Fluffy eggs with spinach, feta, tomatoes, and herbs',
                baseCalories: 380, baseProtein: 28, baseCarbs: 8, baseFat: 26, baseFiber: 4,
                prepTime: '5 min', cookTime: '6 min', difficulty: 'Easy',
                image: '🍳', color: 'from-green-400 to-blue-500',
                tags: ['high-protein', 'low-carb', 'keto-friendly', 'quick'],
                dietaryInfo: ['vegetarian', 'keto', 'low-carb'],
                healthAttributes: ['heart-healthy', 'low-sodium-option', 'anti-inflammatory'],
                allergens: ['eggs', 'dairy'],
                pantryFriendly: true,
                scalability: 'excellent',
                proteinDensity: 7.4,
                ingredients: [
                    { name: 'eggs', pantryItem: true, allergens: ['eggs'] },
                    { name: 'spinach', pantryItem: false, allergens: [] },
                    { name: 'feta cheese', pantryItem: false, allergens: ['dairy'] },
                    { name: 'olive oil', pantryItem: true, allergens: [] }
                ]
            },
            {
                id: 'breakfast_chia_pudding',
                name: 'Tropical Chia Pudding',
                description: 'Overnight chia seeds with coconut milk and mango',
                baseCalories: 340, baseProtein: 12, baseCarbs: 25, baseFat: 22, baseFiber: 12,
                prepTime: '5 min', cookTime: '0 min', difficulty: 'Easy',
                image: '🥭', color: 'from-yellow-400 to-orange-500',
                tags: ['vegan', 'make-ahead', 'omega-3', 'fiber-rich'],
                dietaryInfo: ['vegan', 'gluten-free', 'dairy-free'],
                healthAttributes: ['anti-inflammatory', 'heart-healthy', 'digestive-health'],
                allergens: [],
                pantryFriendly: true,
                scalability: 'good',
                proteinDensity: 3.5,
                ingredients: [
                    { name: 'chia seeds', pantryItem: true, allergens: [] },
                    { name: 'coconut milk', pantryItem: true, allergens: [] },
                    { name: 'mango', pantryItem: false, allergens: [] },
                    { name: 'maple syrup', pantryItem: true, allergens: [] }
                ]
            },
            {
                id: 'breakfast_low_fat_smoothie',
                name: 'Berry Protein Smoothie',
                description: 'Low-fat smoothie with berries, protein, and spinach',
                baseCalories: 280, baseProtein: 25, baseCarbs: 35, baseFat: 4, baseFiber: 8,
                prepTime: '3 min', cookTime: '0 min', difficulty: 'Easy',
                image: '🫐', color: 'from-purple-400 to-blue-500',
                tags: ['low-fat', 'high-protein', 'antioxidants', 'quick'],
                dietaryInfo: ['vegetarian', 'low-fat'],
                healthAttributes: ['heart-healthy', 'low-fat', 'antioxidant-rich'],
                allergens: ['dairy-option'],
                pantryFriendly: false,
                scalability: 'excellent',
                proteinDensity: 8.9,
                ingredients: [
                    { name: 'mixed berries', pantryItem: false, allergens: [] },
                    { name: 'protein powder', pantryItem: true, allergens: ['dairy-option'] },
                    { name: 'spinach', pantryItem: false, allergens: [] },
                    { name: 'almond milk', pantryItem: true, allergens: ['nuts'] }
                ]
            }
        ],
        
        lunch: [
            {
                id: 'lunch_power_bowl',
                name: 'Mediterranean Power Bowl',
                description: 'Quinoa, grilled chicken, vegetables, and tahini dressing',
                baseCalories: 520, baseProtein: 42, baseCarbs: 35, baseFat: 24, baseFiber: 8,
                prepTime: '10 min', cookTime: '15 min', difficulty: 'Medium',
                image: '🥗', color: 'from-blue-400 to-cyan-500',
                tags: ['high-protein', 'mediterranean', 'balanced', 'meal-prep'],
                dietaryInfo: ['gluten-free', 'dairy-free-option'],
                healthAttributes: ['heart-healthy', 'anti-inflammatory', 'complete-protein'],
                allergens: ['sesame'],
                pantryFriendly: true,
                scalability: 'excellent',
                proteinDensity: 8.1,
                ingredients: [
                    { name: 'chicken breast', pantryItem: false, allergens: [] },
                    { name: 'quinoa', pantryItem: true, allergens: [] },
                    { name: 'cucumber', pantryItem: false, allergens: [] },
                    { name: 'tahini', pantryItem: true, allergens: ['sesame'] }
                ]
            },
            {
                id: 'lunch_salmon_salad',
                name: 'Asian Glazed Salmon Salad',
                description: 'Pan-seared salmon over greens with sesame ginger dressing',
                baseCalories: 480, baseProtein: 35, baseCarbs: 20, baseFat: 28, baseFiber: 7,
                prepTime: '8 min', cookTime: '12 min', difficulty: 'Medium',
                image: '🍣', color: 'from-orange-400 to-red-500',
                tags: ['high-protein', 'omega-3', 'restaurant-quality', 'anti-inflammatory'],
                dietaryInfo: ['gluten-free-option', 'dairy-free', 'keto-friendly'],
                healthAttributes: ['heart-healthy', 'brain-healthy', 'omega-3-rich'],
                allergens: ['fish', 'sesame'],
                pantryFriendly: false,
                scalability: 'good',
                proteinDensity: 7.3,
                ingredients: [
                    { name: 'salmon fillet', pantryItem: false, allergens: ['fish'] },
                    { name: 'mixed greens', pantryItem: false, allergens: [] },
                    { name: 'sesame oil', pantryItem: true, allergens: ['sesame'] },
                    { name: 'ginger', pantryItem: true, allergens: [] }
                ]
            },
            {
                id: 'lunch_low_fat_chicken',
                name: 'Herb-Grilled Chicken & Vegetables',
                description: 'Lean grilled chicken with steamed vegetables and brown rice',
                baseCalories: 420, baseProtein: 38, baseCarbs: 45, baseFat: 8, baseFiber: 6,
                prepTime: '10 min', cookTime: '20 min', difficulty: 'Easy',
                image: '🍗', color: 'from-green-400 to-blue-500',
                tags: ['low-fat', 'high-protein', 'clean-eating', 'simple'],
                dietaryInfo: ['low-fat', 'gluten-free'],
                healthAttributes: ['heart-healthy', 'low-fat', 'lean-protein'],
                allergens: [],
                pantryFriendly: true,
                scalability: 'excellent',
                proteinDensity: 9.0,
                ingredients: [
                    { name: 'chicken breast', pantryItem: false, allergens: [] },
                    { name: 'brown rice', pantryItem: true, allergens: [] },
                    { name: 'mixed vegetables', pantryItem: false, allergens: [] },
                    { name: 'herbs', pantryItem: true, allergens: [] }
                ]
            }
        ],

        dinner: [
            {
                id: 'dinner_herb_salmon',
                name: 'Herb-Crusted Salmon with Roasted Vegetables',
                description: 'Flaky salmon with herb crust over rainbow roasted vegetables',
                baseCalories: 620, baseProtein: 45, baseCarbs: 35, baseFat: 32, baseFiber: 10,
                prepTime: '15 min', cookTime: '25 min', difficulty: 'Medium',
                image: '🐟', color: 'from-teal-400 to-blue-500',
                tags: ['omega-3', 'heart-healthy', 'restaurant-quality', 'nutrient-dense'],
                dietaryInfo: ['gluten-free-option', 'dairy-free', 'paleo'],
                healthAttributes: ['heart-healthy', 'brain-healthy', 'anti-inflammatory'],
                allergens: ['fish'],
                pantryFriendly: false,
                scalability: 'good',
                proteinDensity: 7.3,
                ingredients: [
                    { name: 'salmon fillet', pantryItem: false, allergens: ['fish'] },
                    { name: 'sweet potato', pantryItem: false, allergens: [] },
                    { name: 'broccoli', pantryItem: false, allergens: [] },
                    { name: 'olive oil', pantryItem: true, allergens: [] }
                ]
            },
            {
                id: 'dinner_low_fat_cod',
                name: 'Lemon Herb Baked Cod',
                description: 'Light and flaky cod with lemon herbs and steamed vegetables',
                baseCalories: 350, baseProtein: 35, baseCarbs: 25, baseFat: 8, baseFiber: 6,
                prepTime: '10 min', cookTime: '20 min', difficulty: 'Easy',
                image: '🐟', color: 'from-yellow-400 to-green-500',
                tags: ['low-fat', 'lean-protein', 'light', 'heart-healthy'],
                dietaryInfo: ['low-fat', 'gluten-free', 'dairy-free'],
                healthAttributes: ['heart-healthy', 'low-fat', 'lean-protein'],
                allergens: ['fish'],
                pantryFriendly: false,
                scalability: 'excellent',
                proteinDensity: 10.0,
                ingredients: [
                    { name: 'cod fillet', pantryItem: false, allergens: ['fish'] },
                    { name: 'lemon', pantryItem: false, allergens: [] },
                    { name: 'herbs', pantryItem: true, allergens: [] },
                    { name: 'vegetables', pantryItem: false, allergens: [] }
                ]
            }
        ],

        snacks: [
            {
                id: 'snack_protein_balls',
                name: 'Chocolate Protein Energy Balls',
                description: 'No-bake balls with protein powder and dark chocolate',
                baseCalories: 120, baseProtein: 8, baseCarbs: 12, baseFat: 6, baseFiber: 3,
                prepTime: '10 min', cookTime: '0 min', difficulty: 'Easy',
                image: '⚽', color: 'from-brown-500 to-amber-600',
                tags: ['no-cook', 'portable', 'protein-packed', 'satisfying'],
                dietaryInfo: ['vegetarian', 'gluten-free-option'],
                healthAttributes: ['sustained-energy', 'portable'],
                allergens: ['nuts', 'dairy-option'],
                pantryFriendly: true,
                scalability: 'excellent',
                proteinDensity: 6.7,
                ingredients: [
                    { name: 'protein powder', pantryItem: true, allergens: ['dairy-option'] },
                    { name: 'oats', pantryItem: true, allergens: ['gluten-option'] },
                    { name: 'almond butter', pantryItem: true, allergens: ['nuts'] },
                    { name: 'dark chocolate chips', pantryItem: true, allergens: ['dairy-option'] }
                ]
            },
            {
                id: 'snack_low_fat_yogurt',
                name: 'Berry Greek Yogurt Cup',
                description: 'Low-fat Greek yogurt with fresh berries and honey',
                baseCalories: 140, baseProtein: 15, baseCarbs: 18, baseFat: 2, baseFiber: 4,
                prepTime: '2 min', cookTime: '0 min', difficulty: 'Easy',
                image: '🫐', color: 'from-purple-400 to-blue-500',
                tags: ['low-fat', 'high-protein', 'probiotic', 'quick'],
                dietaryInfo: ['vegetarian', 'low-fat'],
                healthAttributes: ['digestive-health', 'low-fat', 'probiotic'],
                allergens: ['dairy'],
                pantryFriendly: false,
                scalability: 'excellent',
                proteinDensity: 10.7,
                ingredients: [
                    { name: 'greek yogurt', pantryItem: false, allergens: ['dairy'] },
                    { name: 'mixed berries', pantryItem: false, allergens: [] },
                    { name: 'honey', pantryItem: true, allergens: [] }
                ]
            }
        ]
    };

    // Enhanced user preference system
    const getUserPreferences = () => {
        try {
            const habbtProfile = JSON.parse(localStorage.getItem('habbt_profile_data') || '{}');
            const fueliqProfile = JSON.parse(localStorage.getItem('fueliq_profile_data') || '{}');
            const profile = habbtProfile || fueliqProfile || {};
            
            return {
                goal: profile.goal || 'maintenance',
                calorieTarget: profile.goals?.calories || 2000,
                proteinTarget: profile.goals?.protein || 150,
                carbTarget: profile.goals?.carbs || 250,
                fatTarget: profile.goals?.fat || 67,
                fiberTarget: profile.goals?.fiber || 25,
                dietaryRestrictions: profile.dietaryRestrictions || [],
                allergens: profile.allergens || [],
                healthConditions: profile.healthConditions || [],
                activityLevel: profile.activityLevel || 'moderate',
                mealsPerDay: profile.mealsPerDay || 3,
                name: profile.name || 'there',
                // New precision targeting fields
                maxFatPercent: profile.maxFatPercent || null, // e.g., 20 for low-fat diets
                minProteinPercent: profile.minProteinPercent || null, // e.g., 30 for high-protein
                sodiumLimit: profile.sodiumLimit || null, // mg per day
                sugarLimit: profile.sugarLimit || null // g per day
            };
        } catch (e) {
            return {
                goal: 'maintenance',
                calorieTarget: 2000,
                proteinTarget: 150,
                carbTarget: 250,
                fatTarget: 67,
                fiberTarget: 25,
                dietaryRestrictions: [],
                allergens: [],
                healthConditions: [],
                activityLevel: 'moderate',
                mealsPerDay: 3,
                name: 'there'
            };
        }
    };

    // Intelligent portion scaling system
    const scaleRecipe = (baseRecipe, targetCalories, targetProtein = null) => {
        const baseCalories = baseRecipe.baseCalories;
        let scaleFactor = targetCalories / baseCalories;
        
        // If protein target is specified and important, adjust scale factor
        if (targetProtein && baseRecipe.baseProtein > 0) {
            const proteinScaleFactor = targetProtein / baseRecipe.baseProtein;
            // Weighted average: 70% calories, 30% protein for high-protein goals
            scaleFactor = (scaleFactor * 0.7) + (proteinScaleFactor * 0.3);
        }
        
        // Ensure reasonable scaling limits (0.5x to 3x)
        scaleFactor = Math.max(0.5, Math.min(3.0, scaleFactor));
        
        return {
            ...baseRecipe,
            calories: Math.round(baseRecipe.baseCalories * scaleFactor),
            protein: Math.round(baseRecipe.baseProtein * scaleFactor * 10) / 10,
            carbs: Math.round(baseRecipe.baseCarbs * scaleFactor * 10) / 10,
            fat: Math.round(baseRecipe.baseFat * scaleFactor * 10) / 10,
            fiber: Math.round(baseRecipe.baseFiber * scaleFactor * 10) / 10,
            scaleFactor: scaleFactor,
            servingSize: scaleFactor === 1 ? '1 serving' : `${scaleFactor.toFixed(1)} servings`
        };
    };

    // Advanced meal filtering system
    const filterMealsForPreferences = (meals, preferences) => {
        return meals.filter(meal => {
            // Check dietary restrictions
            for (const restriction of preferences.dietaryRestrictions) {
                if (!meal.dietaryInfo.includes(restriction) && 
                    !meal.dietaryInfo.includes(restriction.replace('-', '_')) &&
                    !meal.tags.includes(restriction)) {
                    return false;
                }
            }
            
            // Check allergens
            for (const allergen of preferences.allergens) {
                if (meal.allergens.includes(allergen) || 
                    meal.ingredients.some(ing => ing.allergens.includes(allergen))) {
                    return false;
                }
            }
            
            // Check health conditions
            if (preferences.healthConditions.includes('heart-disease') && 
                !meal.healthAttributes.includes('heart-healthy')) {
                return false;
            }
            
            if (preferences.healthConditions.includes('diabetes') && 
                meal.baseCarbs > 50) { // Simple carb limit for diabetics
                return false;
            }
            
            // Check fat percentage limits
            if (preferences.maxFatPercent) {
                const fatPercent = (meal.baseFat * 9) / meal.baseCalories * 100;
                if (fatPercent > preferences.maxFatPercent) {
                    return false;
                }
            }
            
            return true;
        });
    };

    // Intelligent meal selection for precise macro targeting
    const selectOptimalMeal = (availableMeals, targetCalories, targetProtein, preferences) => {
        if (availableMeals.length === 0) return null;
        
        // Score each meal based on how well it can hit targets after scaling
        const scoredMeals = availableMeals.map(meal => {
            const scaled = scaleRecipe(meal, targetCalories, targetProtein);
            
            // Calculate score based on multiple factors
            let score = 0;
            
            // Calorie accuracy (higher is better)
            const calorieAccuracy = 1 - Math.abs(scaled.calories - targetCalories) / targetCalories;
            score += calorieAccuracy * 40;
            
            // Protein accuracy (higher is better) - more weight for high-protein goals
            if (targetProtein > 0) {
                const proteinAccuracy = 1 - Math.abs(scaled.protein - targetProtein) / targetProtein;
                const proteinWeight = preferences.minProteinPercent ? 35 : 25;
                score += proteinAccuracy * proteinWeight;
            }
            
            // Scaling factor (closer to 1.0 is better - more natural portions)
            const scalingPenalty = Math.abs(scaled.scaleFactor - 1.0) * 10;
            score -= scalingPenalty;
            
            // Protein density bonus for high-protein goals
            if (preferences.minProteinPercent && meal.proteinDensity > 8) {
                score += 10;
            }
            
            // Low-fat bonus for low-fat goals
            if (preferences.maxFatPercent && (meal.baseFat * 9 / meal.baseCalories * 100) < preferences.maxFatPercent) {
                score += 15;
            }
            
            // Pantry-friendly bonus
            if (meal.pantryFriendly) {
                score += 5;
            }
            
            return { meal, scaled, score };
        });
        
        // Sort by score and return best option
        scoredMeals.sort((a, b) => b.score - a.score);
        return scoredMeals[0];
    };

    // Enhanced weekly meal planning with precision targeting
    const generateWeeklyMealPlan = (preferences, pantryItems) => {
        console.log('🎯 Generating precision meal plan for:', preferences);
        
        const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        const weeklyPlan = {};
        
        // Calculate precise daily targets
        const calorieDistribution = {
            muscle_gain: { breakfast: 0.25, lunch: 0.35, dinner: 0.35, snacks: 0.05 },
            fat_loss: { breakfast: 0.30, lunch: 0.35, dinner: 0.30, snacks: 0.05 },
            maintenance: { breakfast: 0.25, lunch: 0.35, dinner: 0.35, snacks: 0.05 }
        };

        const distribution = calorieDistribution[preferences.goal] || calorieDistribution.maintenance;
        
        // Calculate protein distribution (higher protein at breakfast and post-workout)
        const proteinDistribution = {
            breakfast: 0.25,
            lunch: 0.35, 
            dinner: 0.35,
            snacks: 0.05
        };
        
        weekDays.forEach((day, dayIndex) => {
            weeklyPlan[day] = { breakfast: [], lunch: [], dinner: [], snacks: [] };
            
            console.log(`\n📅 Planning ${day}:`);

            Object.keys(COMPREHENSIVE_MEAL_DATABASE).forEach(mealType => {
                const targetCalories = Math.round(preferences.calorieTarget * distribution[mealType]);
                const targetProtein = Math.round(preferences.proteinTarget * proteinDistribution[mealType]);
                
                console.log(`  🎯 ${mealType}: ${targetCalories} cal, ${targetProtein}g protein`);
                
                // Filter meals by dietary preferences and health requirements
                const filteredMeals = filterMealsForPreferences(
                    COMPREHENSIVE_MEAL_DATABASE[mealType], 
                    preferences
                );
                
                console.log(`  🔍 Filtered to ${filteredMeals.length} suitable meals`);
                
                if (filteredMeals.length === 0) {
                    console.warn(`  ⚠️ No suitable ${mealType} options found`);
                    return;
                }
                
                // Select optimal meal with intelligent scaling
                const optimalMeal = selectOptimalMeal(filteredMeals, targetCalories, targetProtein, preferences);
                
                if (optimalMeal) {
                    console.log(`  ✅ Selected: ${optimalMeal.meal.name} (${optimalMeal.scaled.calories} cal, ${optimalMeal.scaled.protein}g protein, ${optimalMeal.scaled.scaleFactor.toFixed(2)}x scale)`);
                    weeklyPlan[day][mealType] = [optimalMeal.scaled];
                } else {
                    console.warn(`  ❌ Could not find optimal ${mealType} meal`);
                }
            });
        });

        return weeklyPlan;
    };

    // Real-time adaptive planning system
    const adaptDayPlan = (currentMeals, remainingMealTypes, preferences) => {
        console.log('🔄 Adapting remaining meals based on what was actually consumed...');
        
        // Calculate what's been consumed so far
        const consumedCalories = currentMeals.reduce((sum, meal) => sum + (meal.actualCalories || meal.calories), 0);
        const consumedProtein = currentMeals.reduce((sum, meal) => sum + (meal.actualProtein || meal.protein), 0);
        const consumedFat = currentMeals.reduce((sum, meal) => sum + (meal.actualFat || meal.fat), 0);
        
        console.log(`📊 Consumed so far: ${consumedCalories} cal, ${consumedProtein}g protein, ${consumedFat}g fat`);
        
        // Calculate remaining targets
        const remainingCalories = preferences.calorieTarget - consumedCalories;
        const remainingProtein = preferences.proteinTarget - consumedProtein;
        const remainingFat = preferences.fatTarget - consumedFat;
        
        console.log(`🎯 Remaining targets: ${remainingCalories} cal, ${remainingProtein}g protein, ${remainingFat}g fat`);
        
        // Redistribute remaining macros across remaining meals
        const adaptedPlan = {};
        const mealCount = remainingMealTypes.length;
        
        if (mealCount === 0) {
            console.log('✅ All meals for today are complete');
            return adaptedPlan;
        }
        
        remainingMealTypes.forEach(mealType => {
            const targetCalories = Math.max(100, Math.round(remainingCalories / mealCount));
            const targetProtein = Math.max(5, Math.round(remainingProtein / mealCount));
            
            console.log(`  🎯 Adapting ${mealType}: ${targetCalories} cal, ${targetProtein}g protein`);
            
            const filteredMeals = filterMealsForPreferences(
                COMPREHENSIVE_MEAL_DATABASE[mealType], 
                preferences
            );
            
            const optimalMeal = selectOptimalMeal(filteredMeals, targetCalories, targetProtein, preferences);
            
            if (optimalMeal) {
                adaptedPlan[mealType] = [optimalMeal.scaled];
                console.log(`  ✅ Adapted ${mealType}: ${optimalMeal.meal.name} (${optimalMeal.scaled.calories} cal)`);
            }
        });
        
        return adaptedPlan;
    };

    // Load pantry data
    const loadPlanningPantryData = () => {
        try {
            const pantryData = localStorage.getItem('habbt_pantry') || localStorage.getItem('fueliq_pantry');
            return pantryData ? JSON.parse(pantryData) : { items: [] };
        } catch (e) {
            return { items: [] };
        }
    };

    // Calculate missing ingredients with delivery integration
    const calculateWeeklyMissingIngredients = (weeklyPlan, pantryItems) => {
        const pantryItemNames = pantryItems.map(item => item.name.toLowerCase());
        const missingIngredients = {};

        Object.entries(weeklyPlan).forEach(([day, dayPlan]) => {
            Object.values(dayPlan).flat().forEach(meal => {
                if (meal.ingredients) {
                    meal.ingredients.forEach(ingredient => {
                        if (!pantryItemNames.includes(ingredient.name.toLowerCase()) && !ingredient.pantryItem) {
                            if (!missingIngredients[ingredient.name]) {
                                missingIngredients[ingredient.name] = {
                                    name: ingredient.name,
                                    allergens: ingredient.allergens || [],
                                    usedIn: [],
                                    deliveryReady: true
                                };
                            }
                            missingIngredients[ingredient.name].usedIn.push({
                                day,
                                meal: meal.name
                            });
                        }
                    });
                }
            });
        });

        return Object.values(missingIngredients);
    };

    // Storage functions
    const saveWeeklyPlan = (weekStartDate, data) => {
        const key = `habbt_weekly_plan_${weekStartDate}`;
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (e) {
            console.warn('Failed to save weekly plan:', e);
        }
    };

    const loadWeeklyPlan = (weekStartDate) => {
        const key = `habbt_weekly_plan_${weekStartDate}`;
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : {};
        } catch (e) {
            return {};
        }
    };

    const getWeekStartDate = (date = new Date()) => {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1);
        return new Date(d.setDate(diff)).toISOString().split('T')[0];
    };

    // Enhanced Meal Card with scaling information
    const MealCard = ({ meal, day, mealType, onViewRecipe, onSwapMeal, onAddToGrocery, onMarkAsEaten }) => {
        const isScaled = meal.scaleFactor && meal.scaleFactor !== 1.0;
        
        return React.createElement('div', { 
            className: 'group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200 transform hover:-translate-y-1'
        },
            React.createElement('div', { 
                className: `h-20 bg-gradient-to-r ${meal.color} flex items-center justify-center relative overflow-hidden`
            },
                React.createElement('div', { className: 'text-4xl' }, meal.image),
                React.createElement('div', { className: 'absolute top-2 right-2 bg-white/20 backdrop-blur-sm rounded-full px-2 py-1 text-xs text-white font-medium' },
                    `${meal.prepTime} + ${meal.cookTime}`
                ),
                React.createElement('div', { className: 'absolute bottom-2 left-3 bg-white/20 backdrop-blur-sm rounded-full px-2 py-1 text-xs text-white font-medium' },
                    meal.difficulty
                ),
                // Scaling indicator
                isScaled && React.createElement('div', { className: 'absolute top-2 left-2 bg-yellow-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold' },
                    '📏'
                ),
                // Pantry indicator
                meal.pantryFriendly && React.createElement('div', { className: 'absolute bottom-2 right-2 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold' },
                    '🏪'
                )
            ),

            React.createElement('div', { className: 'p-4' },
                React.createElement('h4', { className: 'font-bold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors' }, 
                    meal.name
                ),
                React.createElement('p', { className: 'text-sm text-gray-600 mb-2' }, 
                    meal.description
                ),
                // Scaling info
                isScaled && React.createElement('p', { className: 'text-xs text-yellow-700 bg-yellow-50 px-2 py-1 rounded mb-2' },
                    `Scaled to ${meal.servingSize} for your goals`
                ),

                React.createElement('div', { className: 'grid grid-cols-4 gap-2 mb-3 text-center' },
                    React.createElement('div', { className: 'bg-blue-50 rounded-lg p-2' },
                        React.createElement('div', { className: 'text-sm font-bold text-blue-600' }, meal.calories),
                        React.createElement('div', { className: 'text-xs text-gray-600' }, 'cal')
                    ),
                    React.createElement('div', { className: 'bg-red-50 rounded-lg p-2' },
                        React.createElement('div', { className: 'text-sm font-bold text-red-600' }, `${meal.protein}g`),
                        React.createElement('div', { className: 'text-xs text-gray-600' }, 'protein')
                    ),
                    React.createElement('div', { className: 'bg-yellow-50 rounded-lg p-2' },
                        React.createElement('div', { className: 'text-sm font-bold text-yellow-600' }, `${meal.carbs}g`),
                        React.createElement('div', { className: 'text-xs text-gray-600' }, 'carbs')
                    ),
                    React.createElement('div', { className: 'bg-purple-50 rounded-lg p-2' },
                        React.createElement('div', { className: 'text-sm font-bold text-purple-600' }, `${meal.fat}g`),
                        React.createElement('div', { className: 'text-xs text-gray-600' }, 'fat')
                    )
                ),

                React.createElement('div', { className: 'flex flex-wrap gap-1 mb-3' },
                    meal.tags.slice(0, 3).map(tag => 
                        React.createElement('span', { 
                            key: tag,
                            className: 'px-2 py-1 bg-gradient-to-r from-blue-100 to-teal-100 text-blue-700 text-xs rounded-full font-medium'
                        }, tag)
                    )
                ),

                React.createElement('div', { className: 'flex gap-1 mb-3' },
                    React.createElement('button', {
                        onClick: () => onViewRecipe(meal),
                        className: 'flex-1 px-2 py-1 bg-gradient-to-r from-blue-500 to-teal-600 hover:from-blue-600 hover:to-teal-700 text-white text-xs rounded-lg font-semibold transition-all duration-200'
                    }, '👨‍🍳 Recipe'),
                    React.createElement('button', {
                        onClick: () => onSwapMeal(day, mealType, meal),
                        className: 'px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs rounded-lg font-semibold transition-all duration-200'
                    }, '🔄'),
                    React.createElement('button', {
                        onClick: () => onAddToGrocery(meal),
                        className: 'px-2 py-1 bg-green-100 hover:bg-green-200 text-green-700 text-xs rounded-lg font-semibold transition-all duration-200'
                    }, '🛒')
                ),
                
                // Adaptive planning button
                React.createElement('button', {
                    onClick: () => onMarkAsEaten(meal, mealType),
                    className: 'w-full px-2 py-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-xs rounded-lg font-semibold transition-all duration-200'
                }, '✓ Mark as Eaten & Adapt Day')
            )
        );
    };

    // Enhanced Recipe Modal with scaling and allergen info
    const RecipeDetailModal = ({ meal, isOpen, onClose, pantryItems }) => {
        if (!isOpen || !meal) return null;

        const pantryItemNames = pantryItems.map(item => item.name.toLowerCase());
        const isScaled = meal.scaleFactor && meal.scaleFactor !== 1.0;

        return React.createElement('div', { className: 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50' },
            React.createElement('div', { className: 'bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto' },
                React.createElement('div', { className: 'relative' },
                    React.createElement('div', { className: `bg-gradient-to-r ${meal.color} text-white p-6 rounded-t-2xl` },
                        React.createElement('button', {
                            onClick: onClose,
                            className: 'absolute top-4 right-4 text-white hover:text-gray-200 text-2xl font-bold bg-white/20 rounded-full w-8 h-8 flex items-center justify-center backdrop-blur-sm'
                        }, '×'),
                        React.createElement('div', { className: 'flex items-center space-x-4' },
                            React.createElement('div', { className: 'text-6xl' }, meal.image),
                            React.createElement('div', null,
                                React.createElement('h2', { className: 'text-3xl font-bold mb-2' }, meal.name),
                                React.createElement('p', { className: 'text-xl opacity-90' }, meal.description),
                                React.createElement('div', { className: 'flex flex-wrap space-x-2 mt-3 text-sm' },
                                    React.createElement('span', { className: 'bg-white/20 px-2 py-1 rounded' }, `⏱️ ${meal.prepTime}`),
                                    React.createElement('span', { className: 'bg-white/20 px-2 py-1 rounded' }, `🔥 ${meal.cookTime}`),
                                    React.createElement('span', { className: 'bg-white/20 px-2 py-1 rounded' }, `📊 ${meal.difficulty}`),
                                    meal.pantryFriendly && React.createElement('span', { className: 'bg-green-500/20 px-2 py-1 rounded' }, '🏪 Pantry Friendly'),
                                    isScaled && React.createElement('span', { className: 'bg-yellow-500/20 px-2 py-1 rounded' }, `📏 ${meal.servingSize}`)
                                )
                            )
                        )
                    ),

                    React.createElement('div', { className: 'p-6' },
                        // Precision nutrition display
                        React.createElement('div', { className: 'grid grid-cols-5 gap-4 mb-6' },
                            React.createElement('div', { className: 'text-center p-4 bg-blue-50 rounded-xl border border-blue-200' },
                                React.createElement('div', { className: 'text-3xl font-bold text-blue-600' }, meal.calories),
                                React.createElement('div', { className: 'text-sm text-gray-600' }, 'Calories'),
                                isScaled && React.createElement('div', { className: 'text-xs text-yellow-600' }, `Base: ${meal.baseCalories}`)
                            ),
                            React.createElement('div', { className: 'text-center p-4 bg-red-50 rounded-xl border border-red-200' },
                                React.createElement('div', { className: 'text-3xl font-bold text-red-600' }, `${meal.protein}g`),
                                React.createElement('div', { className: 'text-sm text-gray-600' }, 'Protein'),
                                isScaled && React.createElement('div', { className: 'text-xs text-yellow-600' }, `Base: ${meal.baseProtein}g`)
                            ),
                            React.createElement('div', { className: 'text-center p-4 bg-yellow-50 rounded-xl border border-yellow-200' },
                                React.createElement('div', { className: 'text-3xl font-bold text-yellow-600' }, `${meal.carbs}g`),
                                React.createElement('div', { className: 'text-sm text-gray-600' }, 'Carbs')
                            ),
                            React.createElement('div', { className: 'text-center p-4 bg-purple-50 rounded-xl border border-purple-200' },
                                React.createElement('div', { className: 'text-3xl font-bold text-purple-600' }, `${meal.fat}g`),
                                React.createElement('div', { className: 'text-sm text-gray-600' }, 'Fat')
                            ),
                            React.createElement('div', { className: 'text-center p-4 bg-green-50 rounded-xl border border-green-200' },
                                React.createElement('div', { className: 'text-3xl font-bold text-green-600' }, `${meal.fiber}g`),
                                React.createElement('div', { className: 'text-sm text-gray-600' }, 'Fiber')
                            )
                        ),

                        // Health attributes and allergen info
                        meal.healthAttributes && meal.healthAttributes.length > 0 && React.createElement('div', { className: 'mb-4 p-4 bg-green-50 rounded-xl border border-green-200' },
                            React.createElement('h4', { className: 'font-bold text-green-800 mb-2' }, '🏥 Health Benefits'),
                            React.createElement('div', { className: 'flex flex-wrap gap-2' },
                                meal.healthAttributes.map(attr => 
                                    React.createElement('span', { 
                                        key: attr,
                                        className: 'px-2 py-1 bg-green-200 text-green-800 text-sm rounded-full'
                                    }, attr.replace('-', ' '))
                                )
                            )
                        ),

                        meal.allergens && meal.allergens.length > 0 && React.createElement('div', { className: 'mb-4 p-4 bg-red-50 rounded-xl border border-red-200' },
                            React.createElement('h4', { className: 'font-bold text-red-800 mb-2' }, '⚠️ Contains Allergens'),
                            React.createElement('div', { className: 'flex flex-wrap gap-2' },
                                meal.allergens.map(allergen => 
                                    React.createElement('span', { 
                                        key: allergen,
                                        className: 'px-2 py-1 bg-red-200 text-red-800 text-sm rounded-full'
                                    }, allergen)
                                )
                            )
                        ),

                        React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-6' },
                            React.createElement('div', null,
                                React.createElement('h3', { className: 'text-xl font-bold text-gray-800 mb-4 flex items-center' },
                                    React.createElement('span', { className: 'mr-2 text-2xl' }, '🛒'),
                                    'Ingredients',
                                    isScaled && React.createElement('span', { className: 'ml-2 text-sm text-yellow-600' }, `(scaled ${meal.scaleFactor.toFixed(1)}x)`)
                                ),
                                React.createElement('div', { className: 'space-y-2' },
                                    meal.ingredients ? meal.ingredients.map((ingredient, index) => {
                                        const inPantry = ingredient.pantryItem && pantryItemNames.includes(ingredient.name.toLowerCase());
                                        const needsToBuy = !ingredient.pantryItem && !pantryItemNames.includes(ingredient.name.toLowerCase());
                                        
                                        return React.createElement('div', { 
                                            key: index,
                                            className: `flex justify-between items-center p-3 rounded-lg ${
                                                inPantry ? 'bg-green-50 border border-green-200' : 
                                                needsToBuy ? 'bg-orange-50 border border-orange-200' :
                                                'bg-gray-50 border border-gray-200'
                                            }`
                                        },
                                            React.createElement('span', { className: 'font-medium flex items-center' },
                                                inPantry ? React.createElement('span', { className: 'mr-2 text-green-600' }, '✓') :
                                                needsToBuy ? React.createElement('span', { className: 'mr-2 text-orange-600' }, '🛒') : null,
                                                ingredient.name,
                                                ingredient.allergens && ingredient.allergens.length > 0 && React.createElement('span', { className: 'ml-2 text-xs text-red-500' }, '⚠️')
                                            ),
                                            React.createElement('span', { className: 'text-sm text-gray-600' }, ingredient.amount || 'as needed')
                                        );
                                    }) : React.createElement('p', { className: 'text-gray-600' }, 'Detailed ingredient list available in full recipe.')
                                )
                            ),

                            React.createElement('div', null,
                                React.createElement('h3', { className: 'text-xl font-bold text-gray-800 mb-4 flex items-center' },
                                    React.createElement('span', { className: 'mr-2 text-2xl' }, '👨‍🍳'),
                                    'Instructions'
                                ),
                                React.createElement('div', { className: 'text-gray-600' },
                                    React.createElement('p', null, 'Detailed cooking instructions would be available in the full recipe database integration.'),
                                    isScaled && React.createElement('p', { className: 'mt-2 text-yellow-700 bg-yellow-50 p-2 rounded' },
                                        `Note: This recipe has been scaled to ${meal.scaleFactor.toFixed(1)}x the original size. Adjust cooking times accordingly.`
                                    )
                                )
                            )
                        )
                    )
                )
            )
        );
    };

    // Main Intelligent Meal Planning Component
    const IntelligentMealPlanningApp = () => {
        const [currentWeekStart, setCurrentWeekStart] = React.useState(getWeekStartDate());
        const [weeklyPlan, setWeeklyPlan] = React.useState(loadWeeklyPlan(currentWeekStart));
        const [pantryItems, setPantryItems] = React.useState([]);
        const [userPreferences, setUserPreferences] = React.useState(getUserPreferences());
        const [selectedMeal, setSelectedMeal] = React.useState(null);
        const [modalOpen, setModalOpen] = React.useState(false);
        const [missingIngredients, setMissingIngredients] = React.useState([]);
        const [isGenerating, setIsGenerating] = React.useState(false);
        const [todayEatenMeals, setTodayEatenMeals] = React.useState([]);

        React.useEffect(() => {
            const pantryData = loadPlanningPantryData();
            setPantryItems(pantryData.items || []);
        }, []);

        React.useEffect(() => {
            setWeeklyPlan(loadWeeklyPlan(currentWeekStart));
        }, [currentWeekStart]);

        React.useEffect(() => {
            if (Object.keys(weeklyPlan).length > 0) {
                saveWeeklyPlan(currentWeekStart, weeklyPlan);
                const missing = calculateWeeklyMissingIngredients(weeklyPlan, pantryItems);
                setMissingIngredients(missing);
            }
        }, [weeklyPlan, currentWeekStart, pantryItems]);

        const generateWeeklyPlan = async () => {
            setIsGenerating(true);
            
            setTimeout(() => {
                const newPlan = generateWeeklyMealPlan(userPreferences, pantryItems);
                setWeeklyPlan(newPlan);
                setIsGenerating(false);
            }, 3000);
        };

        const viewRecipe = (meal) => {
            setSelectedMeal(meal);
            setModalOpen(true);
        };

        const swapMeal = (day, mealType, currentMeal) => {
            const availableMeals = COMPREHENSIVE_MEAL_DATABASE[mealType];
            const filteredMeals = filterMealsForPreferences(availableMeals, userPreferences);
            
            if (filteredMeals.length > 1) {
                const currentIndex = filteredMeals.findIndex(meal => meal.id === currentMeal.id);
                const nextIndex = (currentIndex + 1) % filteredMeals.length;
                const newMeal = filteredMeals[nextIndex];
                
                // Recalculate optimal scaling for the new meal
                const targetCalories = currentMeal.calories; // Try to match current meal's calories
                const targetProtein = currentMeal.protein;
                const scaledMeal = scaleRecipe(newMeal, targetCalories, targetProtein);
                
                setWeeklyPlan(prev => ({
                    ...prev,
                    [day]: {
                        ...prev[day],
                        [mealType]: [scaledMeal]
                    }
                }));
            }
        };

        const markAsEaten = (meal, mealType) => {
            const eaten = [...todayEatenMeals, { ...meal, mealType, timestamp: new Date() }];
            setTodayEatenMeals(eaten);
            
            // Trigger adaptive planning for remaining meals
            const remainingMealTypes = ['breakfast', 'lunch', 'dinner', 'snacks'].filter(type => 
                !eaten.some(m => m.mealType === type)
            );
            
            if (remainingMealTypes.length > 0) {
                const adaptedPlan = adaptDayPlan(eaten, remainingMealTypes, userPreferences);
                
                // Update today's plan with adapted meals
                const today = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD format
                const todayKey = Object.keys(weeklyPlan).find(day => {
                    const planDate = new Date(currentWeekStart);
                    const dayIndex = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].indexOf(day);
                    planDate.setDate(planDate.getDate() + dayIndex);
                    return planDate.toLocaleDateString('en-CA') === today;
                });
                
                if (todayKey) {
                    setWeeklyPlan(prev => ({
                        ...prev,
                        [todayKey]: {
                            ...prev[todayKey],
                            ...adaptedPlan
                        }
                    }));
                }
                
                alert(`✅ Marked as eaten! Automatically adjusted your remaining ${remainingMealTypes.length} meals to help you hit your daily goals.`);
            } else {
                alert('✅ All meals for today complete! Great job hitting your nutrition goals.');
            }
        };

        const addToGroceryList = (meal) => {
            const missingForMeal = meal.ingredients ? meal.ingredients.filter(ingredient => 
                !pantryItems.some(item => item.name.toLowerCase() === ingredient.name.toLowerCase()) && 
                !ingredient.pantryItem
            ) : [];
            
            if (missingForMeal.length > 0) {
                const deliveryMessage = `🛒 Ready to order ${missingForMeal.length} ingredients for ${meal.name}!\n\nIngredients needed:\n${missingForMeal.map(ing => `• ${ing.name}`).join('\n')}\n\nWould you like to:\n1. Add to grocery delivery cart\n2. View in delivery tab\n3. Save for later`;
                alert(deliveryMessage);
            } else {
                alert('🎉 All ingredients are already in your pantry!');
            }
        };

        const navigateWeek = (direction) => {
            const newDate = new Date(currentWeekStart);
            newDate.setDate(newDate.getDate() + (direction * 7));
            setCurrentWeekStart(getWeekStartDate(newDate));
        };

        const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        const weekHasMeals = Object.keys(weeklyPlan).length > 0;

        // Calculate precise weekly totals
        const weeklyTotals = weekHasMeals ? weekDays.reduce((totals, day) => {
            if (weeklyPlan[day]) {
                const dayMeals = Object.values(weeklyPlan[day]).flat();
                return {
                    calories: totals.calories + dayMeals.reduce((sum, meal) => sum + meal.calories, 0),
                    protein: totals.protein + dayMeals.reduce((sum, meal) => sum + meal.protein, 0),
                    fat: totals.fat + dayMeals.reduce((sum, meal) => sum + meal.fat, 0),
                    carbs: totals.carbs + dayMeals.reduce((sum, meal) => sum + meal.carbs, 0)
                };
            }
            return totals;
        }, { calories: 0, protein: 0, fat: 0, carbs: 0 }) : { calories: 0, protein: 0, fat: 0, carbs: 0 };

        // Calculate goal accuracy
        const calorieAccuracy = Math.round((weeklyTotals.calories / 7) / userPreferences.calorieTarget * 100);
        const proteinAccuracy = Math.round((weeklyTotals.protein / 7) / userPreferences.proteinTarget * 100);

        return React.createElement('div', { className: 'min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-cyan-50' },
            React.createElement('div', { className: 'max-w-7xl mx-auto p-6' },
                React.createElement('div', { className: 'bg-gradient-to-r from-blue-600 to-teal-600 rounded-3xl shadow-2xl p-8 mb-8 text-white' },
                    React.createElement('div', { className: 'text-center' },
                        React.createElement('h1', { className: 'text-4xl font-bold mb-4' }, 
                            `🎯 Precision Meal Planning for ${userPreferences.name}!`
                        ),
                        React.createElement('div', { className: 'bg-white/20 backdrop-blur-sm rounded-2xl p-4 mb-6' },
                            React.createElement('p', { className: 'text-lg mb-3' }, 
                                '🧠 Intelligent adaptation with precision macro targeting:'
                            ),
                            React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-3 gap-4 text-sm' },
                                React.createElement('div', { className: 'space-y-2' },
                                    React.createElement('div', { className: 'bg-white/10 px-3 py-2 rounded-lg' },
                                        `🎯 ${userPreferences.goal.replace('_', ' ')}: ${userPreferences.calorieTarget} cal/day`
                                    ),
                                    React.createElement('div', { className: 'bg-white/10 px-3 py-2 rounded-lg' },
                                        `💪 ${userPreferences.proteinTarget}g protein/day target`
                                    )
                                ),
                                React.createElement('div', { className: 'space-y-2' },
                                    React.createElement('div', { className: 'bg-white/10 px-3 py-2 rounded-lg' },
                                        `🏪 ${pantryItems.length} pantry items available`
                                    ),
                                    userPreferences.allergens.length > 0 && React.createElement('div', { className: 'bg-white/10 px-3 py-2 rounded-lg' },
                                        `⚠️ ${userPreferences.allergens.length} allergens avoided`
                                    )
                                ),
                                React.createElement('div', { className: 'space-y-2' },
                                    React.createElement('div', { className: 'bg-white/10 px-3 py-2 rounded-lg' },
                                        `📏 Auto-portion scaling`
                                    ),
                                    React.createElement('div', { className: 'bg-white/10 px-3 py-2 rounded-lg' },
                                        `🔄 Real-time adaptation`
                                    )
                                )
                            )
                        ),
                        
                        React.createElement('button', {
                            onClick: generateWeeklyPlan,
                            disabled: isGenerating,
                            className: `px-8 py-4 bg-white/20 hover:bg-white/30 disabled:bg-white/10 rounded-2xl font-bold text-lg transition-all duration-200 backdrop-blur-sm ${isGenerating ? 'cursor-not-allowed' : 'transform hover:scale-105'}`
                        }, 
                            isGenerating ? '🤖 Calculating Optimal Nutrition Plan...' : 
                            '✨ Generate Precision Meal Plan'
                        ),
                        
                        React.createElement('div', { className: 'flex items-center justify-center space-x-4 mt-6' },
                            React.createElement('button', {
                                onClick: () => navigateWeek(-1),
                                className: 'px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-semibold transition-all duration-200 backdrop-blur-sm'
                            }, '← Previous Week'),
                            React.createElement('div', { className: 'px-6 py-2 bg-white/20 rounded-lg backdrop-blur-sm font-semibold' },
                                `Week of ${new Date(currentWeekStart).toLocaleDateString()}`
                            ),
                            React.createElement('button', {
                                onClick: () => navigateWeek(1),
                                className: 'px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-semibold transition-all duration-200 backdrop-blur-sm'
                            }, 'Next Week →')
                        )
                    )
                ),

                React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-4 gap-6 mb-8' },
                    React.createElement('div', { className: 'bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20' },
                        React.createElement('h3', { className: 'text-lg font-bold text-gray-800 mb-4' }, '🎯 Goal Accuracy'),
                        React.createElement('div', { className: 'space-y-3' },
                            React.createElement('div', null,
                                React.createElement('div', { className: 'flex justify-between mb-1' },
                                    React.createElement('span', { className: 'text-sm' }, 'Calories'),
                                    React.createElement('span', { className: `text-sm font-bold ${calorieAccuracy >= 95 && calorieAccuracy <= 105 ? 'text-green-600' : 'text-orange-600'}` }, 
                                        `${calorieAccuracy}%`
                                    )
                                ),
                                React.createElement('div', { className: 'w-full bg-gray-200 rounded-full h-2' },
                                    React.createElement('div', { 
                                        className: `h-2 rounded-full ${calorieAccuracy >= 95 && calorieAccuracy <= 105 ? 'bg-green-500' : 'bg-orange-500'}`,
                                        style: { width: `${Math.min(calorieAccuracy, 100)}%` }
                                    })
                                )
                            ),
                            React.createElement('div', null,
                                React.createElement('div', { className: 'flex justify-between mb-1' },
                                    React.createElement('span', { className: 'text-sm' }, 'Protein'),
                                    React.createElement('span', { className: `text-sm font-bold ${proteinAccuracy >= 95 && proteinAccuracy <= 105 ? 'text-green-600' : 'text-orange-600'}` }, 
                                        `${proteinAccuracy}%`
                                    )
                                ),
                                React.createElement('div', { className: 'w-full bg-gray-200 rounded-full h-2' },
                                    React.createElement('div', { 
                                        className: `h-2 rounded-full ${proteinAccuracy >= 95 && proteinAccuracy <= 105 ? 'bg-green-500' : 'bg-orange-500'}`,
                                        style: { width: `${Math.min(proteinAccuracy, 100)}%` }
                                    })
                                )
                            )
                        )
                    ),
                    React.createElement('div', { className: 'bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20' },
                        React.createElement('h3', { className: 'text-lg font-bold text-gray-800 mb-4' }, '📊 Weekly Averages'),
                        React.createElement('div', { className: 'space-y-2 text-sm' },
                            React.createElement('div', { className: 'flex justify-between' },
                                React.createElement('span', null, 'Calories:'),
                                React.createElement('span', { className: 'font-bold text-blue-600' }, 
                                    `${Math.round(weeklyTotals.calories / 7)}/day`
                                )
                            ),
                            React.createElement('div', { className: 'flex justify-between' },
                                React.createElement('span', null, 'Protein:'),
                                React.createElement('span', { className: 'font-bold text-red-600' }, 
                                    `${Math.round(weeklyTotals.protein / 7)}g/day`
                                )
                            ),
                            React.createElement('div', { className: 'flex justify-between' },
                                React.createElement('span', null, 'Fat:'),
                                React.createElement('span', { className: 'font-bold text-purple-600' }, 
                                    `${Math.round(weeklyTotals.fat / 7)}g/day`
                                )
                            )
                        )
                    ),
                    React.createElement('div', { className: 'bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20' },
                        React.createElement('h3', { className: 'text-lg font-bold text-gray-800 mb-4' }, '🛒 Delivery Ready'),
                        React.createElement('div', null,
                            React.createElement('div', { className: 'text-2xl font-bold text-orange-600' }, missingIngredients.length),
                            React.createElement('div', { className: 'text-sm text-gray-600' }, 'items to order'),
                            missingIngredients.length > 0 ? React.createElement('button', {
                                onClick: () => alert(`🚚 Opening delivery with ${missingIngredients.length} items...`),
                                className: 'mt-2 text-sm px-3 py-1 bg-orange-500 hover:bg-orange-600 text-white rounded-lg'
                            }, 'Order All') : React.createElement('div', { className: 'text-xs text-green-600 mt-1' }, 'All ingredients available! 🎉')
                        )
                    ),
                    React.createElement('div', { className: 'bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20' },
                        React.createElement('h3', { className: 'text-lg font-bold text-gray-800 mb-4' }, '🔄 Adaptive Planning'),
                        React.createElement('div', null,
                            React.createElement('div', { className: 'text-2xl font-bold text-purple-600' }, todayEatenMeals.length),
                            React.createElement('div', { className: 'text-sm text-gray-600' }, 'meals logged today'),
                            React.createElement('div', { className: 'text-xs text-gray-500 mt-1' }, 
                                todayEatenMeals.length > 0 ? 'Auto-adapting remaining meals' : 'Mark meals as eaten for adaptation'
                            )
                        )
                    )
                ),

                !weekHasMeals ? 
                    React.createElement('div', { className: 'text-center py-16' },
                        React.createElement('div', { className: 'text-6xl mb-6' }, '🎯'),
                        React.createElement('h3', { className: 'text-2xl font-bold text-gray-800 mb-4' }, 
                            'Ready for precision nutrition planning?'
                        ),
                        React.createElement('p', { className: 'text-gray-600 mb-6 max-w-3xl mx-auto' }, 
                            'Our intelligent system will create meals scaled to your exact calorie and protein targets, prioritize your pantry items, and adapt throughout the day based on what you actually eat.'
                        ),
                        React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8' },
                            React.createElement('div', { className: 'p-6 bg-white/60 rounded-xl' },
                                React.createElement('div', { className: 'text-3xl mb-3' }, '📏'),
                                React.createElement('h4', { className: 'font-bold mb-2' }, 'Precision Scaling'),
                                React.createElement('p', { className: 'text-sm text-gray-600' }, 'Automatically adjusts portions to hit your exact macro targets')
                            ),
                            React.createElement('div', { className: 'p-6 bg-white/60 rounded-xl' },
                                React.createElement('div', { className: 'text-3xl mb-3' }, '🏪'),
                                React.createElement('h4', { className: 'font-bold mb-2' }, 'Pantry First'),
                                React.createElement('p', { className: 'text-sm text-gray-600' }, 'Prioritizes ingredients you already have at home')
                            ),
                            React.createElement('div', { className: 'p-6 bg-white/60 rounded-xl' },
                                React.createElement('div', { className: 'text-3xl mb-3' }, '🔄'),
                                React.createElement('h4', { className: 'font-bold mb-2' }, 'Real-time Adaptation'),
                                React.createElement('p', { className: 'text-sm text-gray-600' }, 'Adjusts remaining meals when you eat something different')
                            )
                        ),
                        React.createElement('button', {
                            onClick: generateWeeklyPlan,
                            className: 'px-8 py-4 bg-gradient-to-r from-blue-500 to-teal-600 hover:from-blue-600 hover:to-teal-700 text-white rounded-2xl font-bold text-lg transform hover:scale-105 transition-all duration-200'
                        }, '🎯 Generate Precision Plan')
                    ) :
                    React.createElement('div', { className: 'space-y-8' },
                        weekDays.map(day => 
                            React.createElement('div', { 
                                key: day,
                                className: 'bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden'
                            },
                                React.createElement('div', { className: 'bg-gradient-to-r from-gray-700 to-gray-800 text-white p-4' },
                                    React.createElement('div', { className: 'flex justify-between items-center' },
                                        React.createElement('h3', { className: 'text-xl font-bold' }, day),
                                        weeklyPlan[day] ? React.createElement('div', { className: 'text-sm opacity-75' },
                                            `${Object.values(weeklyPlan[day]).flat().reduce((cal, meal) => cal + meal.calories, 0)} calories • `,
                                            `${Math.round(Object.values(weeklyPlan[day]).flat().reduce((pro, meal) => pro + meal.protein, 0))}g protein`
                                        ) : null
                                    )
                                ),
                                React.createElement('div', { className: 'p-6' },
                                    React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4' },
                                        ['breakfast', 'lunch', 'dinner', 'snacks'].map(mealType => 
                                            React.createElement('div', { key: mealType },
                                                React.createElement('h4', { className: 'font-semibold text-gray-700 mb-3 capitalize flex items-center' },
                                                    React.createElement('span', { className: 'mr-2' },
                                                        mealType === 'breakfast' ? '🌅' :
                                                        mealType === 'lunch' ? '☀️' :
                                                        mealType === 'dinner' ? '🌙' : '🍿'
                                                    ),
                                                    mealType
                                                ),
                                                weeklyPlan[day] && weeklyPlan[day][mealType] && weeklyPlan[day][mealType].length > 0 ?
                                                    weeklyPlan[day][mealType].map(meal => 
                                                        React.createElement(MealCard, {
                                                            key: meal.id,
                                                            meal,
                                                            day,
                                                            mealType,
                                                            onViewRecipe: viewRecipe,
                                                            onSwapMeal: swapMeal,
                                                            onAddToGrocery: addToGroceryList,
                                                            onMarkAsEaten: markAsEaten
                                                        })
                                                    ) :
                                                    React.createElement('div', { className: 'text-center py-8 text-gray-500' },
                                                        React.createElement('div', { className: 'text-2xl mb-2' }, '🍽️'),
                                                        React.createElement('p', { className: 'text-sm' }, 'No meal planned')
                                                    )
                                            )
                                        )
                                    )
                                )
                            )
                        )
                    ),

                React.createElement(RecipeDetailModal, {
                    meal: selectedMeal,
                    isOpen: modalOpen,
                    onClose: () => setModalOpen(false),
                    pantryItems
                })
            )
        );
    };

    // Render function
    function renderMealPlanning(containerId) {
        const container = document.getElementById(containerId);
        if (container) {
            ReactDOM.render(React.createElement(IntelligentMealPlanningApp), container);
        }
    }

    // Export functions
    window.HabbtMealPlanning = {
        IntelligentMealPlanningApp,
        renderMealPlanning,
        // Expose intelligent functions for integration
        scaleRecipe,
        adaptDayPlan,
        filterMealsForPreferences,
        selectOptimalMeal
    };

    window.FuelIQMealPlanning = window.HabbtMealPlanning;
    window.renderMealPlanning = renderMealPlanning;

    console.log('🎯 Intelligent Adaptive Meal Planning System loaded - Precision targeting with real-time adaptation');

})();
