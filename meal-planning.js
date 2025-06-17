// Enhanced Habbt Meal Planning - Comprehensive Database & Pantry-First Workflow
(function() {
    'use strict';

    // Massive comprehensive meal database with tons of options
    const COMPREHENSIVE_MEAL_DATABASE = {
        breakfast: [
            // High Protein Options
            {
                id: 'breakfast_protein_oatmeal',
                name: 'Protein Power Oatmeal Bowl',
                description: 'Creamy oats with protein powder, banana, and almond butter',
                calories: 450, protein: 30, carbs: 55, fat: 12, fiber: 8,
                prepTime: '5 min', cookTime: '3 min', difficulty: 'Easy',
                image: '🥣', color: 'from-amber-400 to-orange-500',
                tags: ['high-protein', 'quick', 'muscle-building'],
                dietaryInfo: ['vegetarian', 'gluten-free-option'],
                pantryFriendly: true,
                ingredients: [
                    { name: 'rolled oats', pantryItem: true }, { name: 'protein powder', pantryItem: true },
                    { name: 'banana', pantryItem: false }, { name: 'almond butter', pantryItem: true }
                ]
            },
            {
                id: 'breakfast_greek_scramble',
                name: 'Mediterranean Egg Scramble',
                description: 'Fluffy eggs with spinach, feta, tomatoes, and herbs',
                calories: 380, protein: 28, carbs: 8, fat: 26, fiber: 4,
                prepTime: '5 min', cookTime: '6 min', difficulty: 'Easy',
                image: '🍳', color: 'from-green-400 to-blue-500',
                tags: ['high-protein', 'low-carb', 'keto-friendly'],
                dietaryInfo: ['vegetarian', 'keto', 'low-carb'],
                pantryFriendly: true,
                ingredients: [
                    { name: 'eggs', pantryItem: true }, { name: 'spinach', pantryItem: false },
                    { name: 'feta cheese', pantryItem: false }, { name: 'olive oil', pantryItem: true }
                ]
            },
            {
                id: 'breakfast_berry_parfait',
                name: 'Antioxidant Berry Parfait',
                description: 'Greek yogurt layered with berries and granola',
                calories: 320, protein: 25, carbs: 35, fat: 8, fiber: 6,
                prepTime: '3 min', cookTime: '0 min', difficulty: 'Easy',
                image: '🫐', color: 'from-purple-400 to-pink-500',
                tags: ['high-protein', 'no-cook', 'antioxidants', 'probiotic'],
                dietaryInfo: ['vegetarian', 'gluten-free-option'],
                pantryFriendly: false,
                ingredients: [
                    { name: 'greek yogurt', pantryItem: false }, { name: 'mixed berries', pantryItem: false },
                    { name: 'granola', pantryItem: true }, { name: 'honey', pantryItem: true }
                ]
            },
            
            // Vegan Options
            {
                id: 'breakfast_chia_pudding',
                name: 'Tropical Chia Pudding',
                description: 'Overnight chia seeds with coconut milk and mango',
                calories: 340, protein: 12, carbs: 25, fat: 22, fiber: 12,
                prepTime: '5 min', cookTime: '0 min', difficulty: 'Easy',
                image: '🥭', color: 'from-yellow-400 to-orange-500',
                tags: ['vegan', 'make-ahead', 'omega-3', 'fiber-rich'],
                dietaryInfo: ['vegan', 'gluten-free', 'dairy-free'],
                pantryFriendly: true,
                ingredients: [
                    { name: 'chia seeds', pantryItem: true }, { name: 'coconut milk', pantryItem: true },
                    { name: 'mango', pantryItem: false }, { name: 'maple syrup', pantryItem: true }
                ]
            },
            {
                id: 'breakfast_avocado_toast',
                name: 'Ultimate Avocado Toast',
                description: 'Sourdough with mashed avocado, tomato, and hemp seeds',
                calories: 420, protein: 15, carbs: 35, fat: 28, fiber: 14,
                prepTime: '5 min', cookTime: '2 min', difficulty: 'Easy',
                image: '🥑', color: 'from-green-300 to-teal-400',
                tags: ['vegan', 'healthy-fats', 'instagram-worthy'],
                dietaryInfo: ['vegan', 'dairy-free'],
                pantryFriendly: false,
                ingredients: [
                    { name: 'sourdough bread', pantryItem: true }, { name: 'avocado', pantryItem: false },
                    { name: 'tomato', pantryItem: false }, { name: 'hemp seeds', pantryItem: true }
                ]
            },
            {
                id: 'breakfast_smoothie_bowl',
                name: 'Green Goddess Smoothie Bowl',
                description: 'Spinach, banana, and mango smoothie with crunchy toppings',
                calories: 380, protein: 18, carbs: 45, fat: 16, fiber: 10,
                prepTime: '8 min', cookTime: '0 min', difficulty: 'Easy',
                image: '🥬', color: 'from-green-400 to-emerald-500',
                tags: ['vegan', 'nutrient-dense', 'antioxidants'],
                dietaryInfo: ['vegan', 'gluten-free', 'dairy-free'],
                pantryFriendly: false,
                ingredients: [
                    { name: 'spinach', pantryItem: false }, { name: 'banana', pantryItem: false },
                    { name: 'mango', pantryItem: false }, { name: 'plant protein powder', pantryItem: true }
                ]
            },

            // Gluten-Free Options
            {
                id: 'breakfast_quinoa_bowl',
                name: 'Cinnamon Quinoa Breakfast Bowl',
                description: 'Fluffy quinoa with almond milk, cinnamon, and fresh fruit',
                calories: 360, protein: 14, carbs: 55, fat: 10, fiber: 8,
                prepTime: '5 min', cookTime: '15 min', difficulty: 'Easy',
                image: '🍚', color: 'from-orange-300 to-red-400',
                tags: ['gluten-free', 'complete-protein', 'warming'],
                dietaryInfo: ['vegetarian', 'gluten-free', 'dairy-free-option'],
                pantryFriendly: true,
                ingredients: [
                    { name: 'quinoa', pantryItem: true }, { name: 'almond milk', pantryItem: true },
                    { name: 'cinnamon', pantryItem: true }, { name: 'fresh fruit', pantryItem: false }
                ]
            },
            {
                id: 'breakfast_sweet_potato_hash',
                name: 'Sweet Potato Breakfast Hash',
                description: 'Roasted sweet potatoes with peppers, onions, and fried egg',
                calories: 440, protein: 16, carbs: 45, fat: 22, fiber: 8,
                prepTime: '10 min', cookTime: '20 min', difficulty: 'Medium',
                image: '🍠', color: 'from-orange-400 to-yellow-500',
                tags: ['gluten-free', 'whole-foods', 'satisfying'],
                dietaryInfo: ['vegetarian', 'gluten-free', 'paleo-friendly'],
                pantryFriendly: false,
                ingredients: [
                    { name: 'sweet potato', pantryItem: false }, { name: 'bell pepper', pantryItem: false },
                    { name: 'onion', pantryItem: false }, { name: 'eggs', pantryItem: true }
                ]
            },

            // Quick Options
            {
                id: 'breakfast_protein_muffin',
                name: '2-Minute Protein Muffin',
                description: 'Microwave muffin with protein powder and berries',
                calories: 280, protein: 22, carbs: 20, fat: 12, fiber: 5,
                prepTime: '2 min', cookTime: '2 min', difficulty: 'Easy',
                image: '🧁', color: 'from-pink-400 to-purple-500',
                tags: ['quick', 'high-protein', 'portion-controlled'],
                dietaryInfo: ['vegetarian', 'gluten-free-option'],
                pantryFriendly: true,
                ingredients: [
                    { name: 'protein powder', pantryItem: true }, { name: 'oat flour', pantryItem: true },
                    { name: 'egg', pantryItem: true }, { name: 'berries', pantryItem: false }
                ]
            },
            {
                id: 'breakfast_overnight_oats',
                name: 'Chocolate Peanut Butter Overnight Oats',
                description: 'Make-ahead oats with cocoa, PB, and banana',
                calories: 420, protein: 18, carbs: 50, fat: 16, fiber: 9,
                prepTime: '5 min', cookTime: '0 min', difficulty: 'Easy',
                image: '🥜', color: 'from-brown-400 to-amber-500',
                tags: ['make-ahead', 'no-cook', 'satisfying'],
                dietaryInfo: ['vegetarian', 'vegan-option'],
                pantryFriendly: true,
                ingredients: [
                    { name: 'rolled oats', pantryItem: true }, { name: 'peanut butter', pantryItem: true },
                    { name: 'cocoa powder', pantryItem: true }, { name: 'banana', pantryItem: false }
                ]
            }
        ],
        
        lunch: [
            // High Protein Bowls
            {
                id: 'lunch_power_bowl',
                name: 'Mediterranean Power Bowl',
                description: 'Quinoa, grilled chicken, vegetables, and tahini dressing',
                calories: 520, protein: 42, carbs: 35, fat: 24, fiber: 8,
                prepTime: '10 min', cookTime: '15 min', difficulty: 'Medium',
                image: '🥗', color: 'from-blue-400 to-cyan-500',
                tags: ['high-protein', 'mediterranean', 'balanced'],
                dietaryInfo: ['gluten-free', 'dairy-free-option'],
                pantryFriendly: true,
                ingredients: [
                    { name: 'chicken breast', pantryItem: false }, { name: 'quinoa', pantryItem: true },
                    { name: 'cucumber', pantryItem: false }, { name: 'tahini', pantryItem: true }
                ]
            },
            {
                id: 'lunch_salmon_salad',
                name: 'Asian Glazed Salmon Salad',
                description: 'Pan-seared salmon over greens with sesame ginger dressing',
                calories: 480, protein: 35, carbs: 20, fat: 28, fiber: 7,
                prepTime: '8 min', cookTime: '12 min', difficulty: 'Medium',
                image: '🍣', color: 'from-orange-400 to-red-500',
                tags: ['high-protein', 'omega-3', 'restaurant-quality'],
                dietaryInfo: ['gluten-free-option', 'dairy-free', 'keto-friendly'],
                pantryFriendly: false,
                ingredients: [
                    { name: 'salmon fillet', pantryItem: false }, { name: 'mixed greens', pantryItem: false },
                    { name: 'sesame oil', pantryItem: true }, { name: 'ginger', pantryItem: true }
                ]
            },
            {
                id: 'lunch_turkey_wrap',
                name: 'California Turkey Wrap',
                description: 'Lean turkey with avocado and sprouts in whole wheat wrap',
                calories: 450, protein: 35, carbs: 30, fat: 20, fiber: 8,
                prepTime: '5 min', cookTime: '0 min', difficulty: 'Easy',
                image: '🌯', color: 'from-green-400 to-lime-500',
                tags: ['quick', 'portable', 'lean-protein'],
                dietaryInfo: ['dairy-free-option'],
                pantryFriendly: false,
                ingredients: [
                    { name: 'turkey breast', pantryItem: false }, { name: 'tortilla', pantryItem: true },
                    { name: 'avocado', pantryItem: false }, { name: 'sprouts', pantryItem: false }
                ]
            },

            // Vegetarian Options
            {
                id: 'lunch_buddha_bowl',
                name: 'Rainbow Buddha Bowl',
                description: 'Colorful vegetables, chickpeas, and tahini over quinoa',
                calories: 490, protein: 18, carbs: 65, fat: 18, fiber: 15,
                prepTime: '15 min', cookTime: '25 min', difficulty: 'Medium',
                image: '🌈', color: 'from-purple-400 to-pink-500',
                tags: ['vegetarian', 'nutrient-dense', 'colorful'],
                dietaryInfo: ['vegetarian', 'vegan', 'gluten-free'],
                pantryFriendly: true,
                ingredients: [
                    { name: 'chickpeas', pantryItem: true }, { name: 'quinoa', pantryItem: true },
                    { name: 'sweet potato', pantryItem: false }, { name: 'kale', pantryItem: false }
                ]
            },
            {
                id: 'lunch_lentil_soup',
                name: 'Hearty Lentil Vegetable Soup',
                description: 'Protein-rich lentils with vegetables in savory broth',
                calories: 380, protein: 20, carbs: 55, fat: 8, fiber: 18,
                prepTime: '10 min', cookTime: '30 min', difficulty: 'Easy',
                image: '🍲', color: 'from-orange-500 to-red-600',
                tags: ['vegetarian', 'comfort-food', 'meal-prep'],
                dietaryInfo: ['vegetarian', 'vegan', 'gluten-free'],
                pantryFriendly: true,
                ingredients: [
                    { name: 'green lentils', pantryItem: true }, { name: 'carrots', pantryItem: false },
                    { name: 'celery', pantryItem: false }, { name: 'vegetable broth', pantryItem: true }
                ]
            },
            {
                id: 'lunch_caprese_sandwich',
                name: 'Gourmet Caprese Sandwich',
                description: 'Fresh mozzarella, tomato, basil, and balsamic on artisan bread',
                calories: 420, protein: 22, carbs: 35, fat: 22, fiber: 5,
                prepTime: '5 min', cookTime: '0 min', difficulty: 'Easy',
                image: '🥪', color: 'from-red-400 to-green-500',
                tags: ['vegetarian', 'fresh', 'italian-inspired'],
                dietaryInfo: ['vegetarian'],
                pantryFriendly: false,
                ingredients: [
                    { name: 'fresh mozzarella', pantryItem: false }, { name: 'tomato', pantryItem: false },
                    { name: 'fresh basil', pantryItem: true }, { name: 'ciabatta bread', pantryItem: false }
                ]
            },

            // Low-Carb Options
            {
                id: 'lunch_zucchini_boats',
                name: 'Stuffed Zucchini Boats',
                description: 'Zucchini filled with ground turkey, vegetables, and cheese',
                calories: 350, protein: 28, carbs: 12, fat: 22, fiber: 4,
                prepTime: '15 min', cookTime: '25 min', difficulty: 'Medium',
                image: '🥒', color: 'from-green-400 to-yellow-500',
                tags: ['low-carb', 'keto-friendly', 'creative'],
                dietaryInfo: ['keto', 'low-carb', 'gluten-free'],
                pantryFriendly: false,
                ingredients: [
                    { name: 'zucchini', pantryItem: false }, { name: 'ground turkey', pantryItem: false },
                    { name: 'cheese', pantryItem: false }, { name: 'herbs', pantryItem: true }
                ]
            },
            {
                id: 'lunch_cauliflower_rice_bowl',
                name: 'Asian Cauliflower Rice Bowl',
                description: 'Cauliflower rice stir-fry with vegetables and protein',
                calories: 320, protein: 25, carbs: 15, fat: 18, fiber: 8,
                prepTime: '10 min', cookTime: '12 min', difficulty: 'Easy',
                image: '🥦', color: 'from-white to-green-400',
                tags: ['low-carb', 'quick', 'vegetable-forward'],
                dietaryInfo: ['keto', 'low-carb', 'gluten-free', 'paleo'],
                pantryFriendly: false,
                ingredients: [
                    { name: 'cauliflower rice', pantryItem: false }, { name: 'protein of choice', pantryItem: false },
                    { name: 'mixed vegetables', pantryItem: false }, { name: 'coconut oil', pantryItem: true }
                ]
            },

            // International Flavors
            {
                id: 'lunch_burrito_bowl',
                name: 'Mexican Burrito Bowl',
                description: 'Cilantro lime rice with black beans, chicken, and salsa',
                calories: 550, protein: 35, carbs: 55, fat: 20, fiber: 12,
                prepTime: '10 min', cookTime: '20 min', difficulty: 'Easy',
                image: '🌶️', color: 'from-red-500 to-yellow-500',
                tags: ['mexican', 'customizable', 'satisfying'],
                dietaryInfo: ['gluten-free', 'dairy-free-option'],
                pantryFriendly: true,
                ingredients: [
                    { name: 'brown rice', pantryItem: true }, { name: 'black beans', pantryItem: true },
                    { name: 'chicken breast', pantryItem: false }, { name: 'salsa', pantryItem: true }
                ]
            },
            {
                id: 'lunch_thai_curry',
                name: 'Thai Green Curry Bowl',
                description: 'Coconut curry with vegetables and jasmine rice',
                calories: 480, protein: 20, carbs: 60, fat: 18, fiber: 8,
                prepTime: '15 min', cookTime: '20 min', difficulty: 'Medium',
                image: '🍜', color: 'from-green-500 to-lime-400',
                tags: ['thai', 'aromatic', 'comfort-food'],
                dietaryInfo: ['gluten-free', 'dairy-free', 'vegan-option'],
                pantryFriendly: true,
                ingredients: [
                    { name: 'green curry paste', pantryItem: true }, { name: 'coconut milk', pantryItem: true },
                    { name: 'jasmine rice', pantryItem: true }, { name: 'mixed vegetables', pantryItem: false }
                ]
            }
        ],

        dinner: [
            // Protein-Centric Dinners
            {
                id: 'dinner_herb_salmon',
                name: 'Herb-Crusted Salmon with Roasted Vegetables',
                description: 'Flaky salmon with herb crust over rainbow roasted vegetables',
                calories: 620, protein: 45, carbs: 35, fat: 32, fiber: 10,
                prepTime: '15 min', cookTime: '25 min', difficulty: 'Medium',
                image: '🐟', color: 'from-teal-400 to-blue-500',
                tags: ['omega-3', 'heart-healthy', 'restaurant-quality'],
                dietaryInfo: ['gluten-free-option', 'dairy-free', 'paleo'],
                pantryFriendly: false,
                ingredients: [
                    { name: 'salmon fillet', pantryItem: false }, { name: 'sweet potato', pantryItem: false },
                    { name: 'broccoli', pantryItem: false }, { name: 'olive oil', pantryItem: true }
                ]
            },
            {
                id: 'dinner_chicken_thighs',
                name: 'Mediterranean Chicken Thighs',
                description: 'Juicy chicken thighs with olives, tomatoes, and herbs',
                calories: 580, protein: 48, carbs: 20, fat: 35, fiber: 6,
                prepTime: '10 min', cookTime: '35 min', difficulty: 'Easy',
                image: '🍗', color: 'from-yellow-500 to-orange-600',
                tags: ['one-pan', 'juicy', 'mediterranean'],
                dietaryInfo: ['gluten-free', 'dairy-free', 'keto-friendly'],
                pantryFriendly: false,
                ingredients: [
                    { name: 'chicken thighs', pantryItem: false }, { name: 'cherry tomatoes', pantryItem: false },
                    { name: 'olives', pantryItem: true }, { name: 'herbs', pantryItem: true }
                ]
            },
            {
                id: 'dinner_beef_stir_fry',
                name: 'Ginger Beef Stir-Fry',
                description: 'Tender beef strips with crisp vegetables in ginger sauce',
                calories: 550, protein: 42, carbs: 30, fat: 28, fiber: 5,
                prepTime: '15 min', cookTime: '10 min', difficulty: 'Medium',
                image: '🥩', color: 'from-red-600 to-orange-500',
                tags: ['quick', 'asian-inspired', 'high-protein'],
                dietaryInfo: ['gluten-free-option', 'dairy-free'],
                pantryFriendly: true,
                ingredients: [
                    { name: 'beef strips', pantryItem: false }, { name: 'ginger', pantryItem: true },
                    { name: 'soy sauce', pantryItem: true }, { name: 'mixed vegetables', pantryItem: false }
                ]
            },

            // Vegetarian Dinners
            {
                id: 'dinner_stuffed_peppers',
                name: 'Quinoa Stuffed Bell Peppers',
                description: 'Colorful peppers stuffed with quinoa, vegetables, and cheese',
                calories: 480, protein: 20, carbs: 65, fat: 16, fiber: 12,
                prepTime: '20 min', cookTime: '35 min', difficulty: 'Medium',
                image: '🫑', color: 'from-red-500 to-yellow-500',
                tags: ['vegetarian', 'colorful', 'complete-meal'],
                dietaryInfo: ['vegetarian', 'gluten-free'],
                pantryFriendly: true,
                ingredients: [
                    { name: 'bell peppers', pantryItem: false }, { name: 'quinoa', pantryItem: true },
                    { name: 'black beans', pantryItem: true }, { name: 'cheese', pantryItem: false }
                ]
            },
            {
                id: 'dinner_eggplant_parm',
                name: 'Baked Eggplant Parmesan',
                description: 'Crispy baked eggplant with marinara and melted cheese',
                calories: 520, protein: 25, carbs: 45, fat: 28, fiber: 14,
                prepTime: '25 min', cookTime: '40 min', difficulty: 'Medium',
                image: '🍆', color: 'from-purple-600 to-red-500',
                tags: ['vegetarian', 'comfort-food', 'italian'],
                dietaryInfo: ['vegetarian', 'gluten-free-option'],
                pantryFriendly: true,
                ingredients: [
                    { name: 'eggplant', pantryItem: false }, { name: 'marinara sauce', pantryItem: true },
                    { name: 'mozzarella cheese', pantryItem: false }, { name: 'parmesan cheese', pantryItem: false }
                ]
            },
            {
                id: 'dinner_veggie_curry',
                name: 'Coconut Vegetable Curry',
                description: 'Creamy coconut curry with seasonal vegetables over rice',
                calories: 450, protein: 15, carbs: 70, fat: 18, fiber: 12,
                prepTime: '15 min', cookTime: '25 min', difficulty: 'Easy',
                image: '🍛', color: 'from-orange-400 to-yellow-500',
                tags: ['vegan', 'aromatic', 'comfort-food'],
                dietaryInfo: ['vegan', 'gluten-free', 'dairy-free'],
                pantryFriendly: true,
                ingredients: [
                    { name: 'coconut milk', pantryItem: true }, { name: 'curry powder', pantryItem: true },
                    { name: 'mixed vegetables', pantryItem: false }, { name: 'basmati rice', pantryItem: true }
                ]
            },

            // Pasta & Grains
            {
                id: 'dinner_pasta_primavera',
                name: 'Garden Pasta Primavera',
                description: 'Whole wheat pasta with seasonal vegetables in light herb sauce',
                calories: 520, protein: 18, carbs: 75, fat: 18, fiber: 12,
                prepTime: '15 min', cookTime: '20 min', difficulty: 'Easy',
                image: '🍝', color: 'from-green-400 to-yellow-500',
                tags: ['vegetarian', 'seasonal', 'satisfying'],
                dietaryInfo: ['vegetarian', 'vegan-option'],
                pantryFriendly: true,
                ingredients: [
                    { name: 'whole wheat pasta', pantryItem: true }, { name: 'seasonal vegetables', pantryItem: false },
                    { name: 'olive oil', pantryItem: true }, { name: 'herbs', pantryItem: true }
                ]
            },
            {
                id: 'dinner_risotto',
                name: 'Mushroom and Herb Risotto',
                description: 'Creamy arborio rice with wild mushrooms and fresh herbs',
                calories: 480, protein: 14, carbs: 65, fat: 18, fiber: 4,
                prepTime: '10 min', cookTime: '30 min', difficulty: 'Medium',
                image: '🍄', color: 'from-brown-400 to-yellow-600',
                tags: ['vegetarian', 'creamy', 'elegant'],
                dietaryInfo: ['vegetarian', 'gluten-free'],
                pantryFriendly: true,
                ingredients: [
                    { name: 'arborio rice', pantryItem: true }, { name: 'mushrooms', pantryItem: false },
                    { name: 'vegetable broth', pantryItem: true }, { name: 'parmesan cheese', pantryItem: false }
                ]
            },

            // International Flavors
            {
                id: 'dinner_fish_tacos',
                name: 'Baja Fish Tacos',
                description: 'Grilled fish with cabbage slaw and lime crema in corn tortillas',
                calories: 420, protein: 35, carbs: 35, fat: 18, fiber: 8,
                prepTime: '15 min', cookTime: '12 min', difficulty: 'Medium',
                image: '🌮', color: 'from-lime-400 to-green-500',
                tags: ['mexican', 'fresh', 'light'],
                dietaryInfo: ['gluten-free', 'dairy-free-option'],
                pantryFriendly: false,
                ingredients: [
                    { name: 'white fish', pantryItem: false }, { name: 'corn tortillas', pantryItem: true },
                    { name: 'cabbage', pantryItem: false }, { name: 'lime', pantryItem: false }
                ]
            },
            {
                id: 'dinner_moroccan_tagine',
                name: 'Moroccan Vegetable Tagine',
                description: 'Aromatic stew with chickpeas, vegetables, and warm spices',
                calories: 420, protein: 16, carbs: 65, fat: 12, fiber: 15,
                prepTime: '20 min', cookTime: '45 min', difficulty: 'Medium',
                image: '🏺', color: 'from-orange-600 to-red-600',
                tags: ['moroccan', 'aromatic', 'exotic'],
                dietaryInfo: ['vegan', 'gluten-free', 'dairy-free'],
                pantryFriendly: true,
                ingredients: [
                    { name: 'chickpeas', pantryItem: true }, { name: 'moroccan spices', pantryItem: true },
                    { name: 'root vegetables', pantryItem: false }, { name: 'dried fruit', pantryItem: true }
                ]
            }
        ],

        snacks: [
            // Protein Snacks
            {
                id: 'snack_protein_balls',
                name: 'Chocolate Protein Energy Balls',
                description: 'No-bake balls with protein powder and dark chocolate',
                calories: 120, protein: 8, carbs: 12, fat: 6, fiber: 3,
                prepTime: '10 min', cookTime: '0 min', difficulty: 'Easy',
                image: '⚽', color: 'from-brown-500 to-amber-600',
                tags: ['no-cook', 'portable', 'protein-packed'],
                dietaryInfo: ['vegetarian', 'gluten-free-option'],
                pantryFriendly: true,
                ingredients: [
                    { name: 'protein powder', pantryItem: true }, { name: 'oats', pantryItem: true },
                    { name: 'almond butter', pantryItem: true }, { name: 'dark chocolate chips', pantryItem: true }
                ]
            },
            {
                id: 'snack_greek_yogurt',
                name: 'Berry Greek Yogurt Parfait',
                description: 'Protein-rich yogurt with fresh berries and nuts',
                calories: 150, protein: 15, carbs: 18, fat: 4, fiber: 4,
                prepTime: '3 min', cookTime: '0 min', difficulty: 'Easy',
                image: '🫐', color: 'from-purple-400 to-blue-500',
                tags: ['high-protein', 'probiotic', 'antioxidants'],
                dietaryInfo: ['vegetarian', 'gluten-free'],
                pantryFriendly: false,
                ingredients: [
                    { name: 'greek yogurt', pantryItem: false }, { name: 'mixed berries', pantryItem: false },
                    { name: 'almonds', pantryItem: true }, { name: 'honey', pantryItem: true }
                ]
            },
            {
                id: 'snack_hummus_veggies',
                name: 'Rainbow Veggie Hummus Plate',
                description: 'Creamy hummus with colorful fresh vegetables',
                calories: 140, protein: 6, carbs: 18, fat: 6, fiber: 6,
                prepTime: '5 min', cookTime: '0 min', difficulty: 'Easy',
                image: '🌈', color: 'from-green-400 to-orange-400',
                tags: ['plant-based', 'fiber-rich', 'colorful'],
                dietaryInfo: ['vegan', 'gluten-free', 'dairy-free'],
                pantryFriendly: false,
                ingredients: [
                    { name: 'hummus', pantryItem: true }, { name: 'carrots', pantryItem: false },
                    { name: 'cucumber', pantryItem: false }, { name: 'bell pepper', pantryItem: false }
                ]
            },

            // Fruit Snacks
            {
                id: 'snack_apple_almond',
                name: 'Apple Slices with Almond Butter',
                description: 'Crisp apple with creamy almond butter and cinnamon',
                calories: 180, protein: 6, carbs: 20, fat: 9, fiber: 5,
                prepTime: '2 min', cookTime: '0 min', difficulty: 'Easy',
                image: '🍎', color: 'from-red-400 to-green-400',
                tags: ['natural', 'satisfying', 'quick'],
                dietaryInfo: ['vegan', 'gluten-free', 'dairy-free'],
                pantryFriendly: false,
                ingredients: [
                    { name: 'apple', pantryItem: false }, { name: 'almond butter', pantryItem: true },
                    { name: 'cinnamon', pantryItem: true }
                ]
            },
            {
                id: 'snack_banana_pb',
                name: 'Banana with Peanut Butter',
                description: 'Sweet banana slices with natural peanut butter',
                calories: 190, protein: 8, carbs: 24, fat: 8, fiber: 4,
                prepTime: '2 min', cookTime: '0 min', difficulty: 'Easy',
                image: '🍌', color: 'from-yellow-400 to-brown-500',
                tags: ['classic', 'energy-boosting', 'kid-friendly'],
                dietaryInfo: ['vegan', 'gluten-free', 'dairy-free'],
                pantryFriendly: false,
                ingredients: [
                    { name: 'banana', pantryItem: false }, { name: 'peanut butter', pantryItem: true }
                ]
            },
            {
                id: 'snack_smoothie',
                name: 'Green Power Smoothie',
                description: 'Spinach, banana, and protein powder smoothie',
                calories: 160, protein: 12, carbs: 22, fat: 3, fiber: 5,
                prepTime: '5 min', cookTime: '0 min', difficulty: 'Easy',
                image: '🥤', color: 'from-green-500 to-lime-400',
                tags: ['nutrient-dense', 'energizing', 'post-workout'],
                dietaryInfo: ['vegetarian', 'gluten-free'],
                pantryFriendly: false,
                ingredients: [
                    { name: 'spinach', pantryItem: false }, { name: 'banana', pantryItem: false },
                    { name: 'protein powder', pantryItem: true }, { name: 'almond milk', pantryItem: true }
                ]
            },

            // Nuts & Seeds
            {
                id: 'snack_trail_mix',
                name: 'Antioxidant Trail Mix',
                description: 'Mixed nuts, seeds, and dried berries',
                calories: 170, protein: 6, carbs: 12, fat: 12, fiber: 3,
                prepTime: '2 min', cookTime: '0 min', difficulty: 'Easy',
                image: '🥜', color: 'from-brown-400 to-purple-500',
                tags: ['portable', 'shelf-stable', 'energy'],
                dietaryInfo: ['vegan', 'gluten-free', 'dairy-free'],
                pantryFriendly: true,
                ingredients: [
                    { name: 'mixed nuts', pantryItem: true }, { name: 'pumpkin seeds', pantryItem: true },
                    { name: 'dried berries', pantryItem: true }
                ]
            },
            {
                id: 'snack_chia_pudding',
                name: 'Vanilla Chia Pudding',
                description: 'Creamy chia seeds with vanilla and berries',
                calories: 140, protein: 5, carbs: 16, fat: 7, fiber: 8,
                prepTime: '5 min', cookTime: '0 min', difficulty: 'Easy',
                image: '🌱', color: 'from-white to-purple-400',
                tags: ['omega-3', 'fiber-rich', 'make-ahead'],
                dietaryInfo: ['vegan', 'gluten-free', 'dairy-free'],
                pantryFriendly: true,
                ingredients: [
                    { name: 'chia seeds', pantryItem: true }, { name: 'almond milk', pantryItem: true },
                    { name: 'vanilla', pantryItem: true }, { name: 'berries', pantryItem: false }
                ]
            }
        ]
    };

    // User preferences and pantry integration
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
                dietaryRestrictions: profile.dietaryRestrictions || [],
                activityLevel: profile.activityLevel || 'moderate',
                mealsPerDay: profile.mealsPerDay || 3,
                name: profile.name || 'there'
            };
        } catch (e) {
            return {
                goal: 'maintenance',
                calorieTarget: 2000,
                proteinTarget: 150,
                carbTarget: 250,
                fatTarget: 67,
                dietaryRestrictions: [],
                activityLevel: 'moderate',
                mealsPerDay: 3,
                name: 'there'
            };
        }
    };

    const loadPlanningPantryData = () => {
        try {
            const pantryData = localStorage.getItem('habbt_pantry') || localStorage.getItem('fueliq_pantry');
            return pantryData ? JSON.parse(pantryData) : { items: [] };
        } catch (e) {
            return { items: [] };
        }
    };

    // Enhanced meal planning with pantry-first workflow
    const generateWeeklyMealPlan = (preferences, pantryItems) => {
        const { goal, calorieTarget, proteinTarget, dietaryRestrictions } = preferences;
        const availableIngredients = pantryItems.map(item => item.name.toLowerCase());
        
        console.log('🥘 Generating meal plan with preferences:', preferences);
        console.log('🏪 Available pantry items:', availableIngredients.length);
        
        const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        const weeklyPlan = {};
        
        const calorieDistribution = {
            muscle_gain: { breakfast: 0.25, lunch: 0.35, dinner: 0.35, snacks: 0.05 },
            fat_loss: { breakfast: 0.30, lunch: 0.35, dinner: 0.30, snacks: 0.05 },
            maintenance: { breakfast: 0.25, lunch: 0.35, dinner: 0.35, snacks: 0.05 }
        };

        const distribution = calorieDistribution[goal] || calorieDistribution.maintenance;
        
        weekDays.forEach((day, dayIndex) => {
            weeklyPlan[day] = { breakfast: [], lunch: [], dinner: [], snacks: [] };

            Object.keys(COMPREHENSIVE_MEAL_DATABASE).forEach(mealType => {
                const targetCalories = calorieTarget * distribution[mealType];
                console.log(`📊 ${mealType} target calories: ${Math.round(targetCalories)}`);
                
                // Step 1: Filter by dietary restrictions FIRST
                let availableMeals = COMPREHENSIVE_MEAL_DATABASE[mealType].filter(meal => {
                    // Check dietary restrictions
                    for (const restriction of dietaryRestrictions) {
                        if (restriction === 'vegetarian' && !meal.dietaryInfo.includes('vegetarian') && !meal.dietaryInfo.includes('vegan')) {
                            return false;
                        }
                        if (restriction === 'vegan' && !meal.dietaryInfo.includes('vegan')) {
                            return false;
                        }
                        if (restriction === 'gluten-free' && !meal.dietaryInfo.includes('gluten-free') && !meal.dietaryInfo.includes('gluten-free-option')) {
                            return false;
                        }
                        if (restriction === 'dairy-free' && !meal.dietaryInfo.includes('dairy-free') && !meal.dietaryInfo.includes('vegan')) {
                            return false;
                        }
                        if (restriction === 'keto' && !meal.dietaryInfo.includes('keto') && !meal.dietaryInfo.includes('keto-friendly') && !meal.dietaryInfo.includes('low-carb')) {
                            return false;
                        }
                    }
                    return true;
                });

                console.log(`🔍 After dietary filtering: ${availableMeals.length} ${mealType} options`);

                // Step 2: Prioritize pantry-friendly meals
                const pantryFriendlyMeals = availableMeals.filter(meal => 
                    meal.pantryFriendly && meal.ingredients.some(ingredient => 
                        ingredient.pantryItem && availableIngredients.includes(ingredient.name.toLowerCase())
                    )
                );

                const mealsWithSomeIngredients = availableMeals.filter(meal => 
                    meal.ingredients.some(ingredient => 
                        ingredient.pantryItem && availableIngredients.includes(ingredient.name.toLowerCase())
                    )
                );

                // Step 3: Apply calorie filtering (very lenient - 40% to 160% of target)
                const calorieFilteredMeals = (pantryFriendlyMeals.length > 0 ? pantryFriendlyMeals : 
                                              mealsWithSomeIngredients.length > 0 ? mealsWithSomeIngredients : 
                                              availableMeals).filter(meal => 
                    meal.calories >= targetCalories * 0.4 && meal.calories <= targetCalories * 1.6
                );

                // Step 4: Final selection
                let selectedMeals = calorieFilteredMeals.length > 0 ? calorieFilteredMeals : availableMeals;
                
                if (selectedMeals.length === 0) {
                    console.warn(`⚠️ No meals available for ${mealType} - using all meals`);
                    selectedMeals = COMPREHENSIVE_MEAL_DATABASE[mealType];
                }

                console.log(`✅ Final selection: ${selectedMeals.length} ${mealType} options`);

                if (selectedMeals.length > 0) {
                    const mealIndex = (dayIndex * 3 + mealType.length) % selectedMeals.length;
                    weeklyPlan[day][mealType] = [selectedMeals[mealIndex]];
                }
            });
        });

        return weeklyPlan;
    };

    // Calculate missing ingredients for delivery integration
    const calculateWeeklyMissingIngredients = (weeklyPlan, pantryItems) => {
        const pantryItemNames = pantryItems.map(item => item.name.toLowerCase());
        const missingIngredients = {};

        Object.entries(weeklyPlan).forEach(([day, dayPlan]) => {
            Object.values(dayPlan).flat().forEach(meal => {
                meal.ingredients.forEach(ingredient => {
                    if (!pantryItemNames.includes(ingredient.name.toLowerCase()) && !ingredient.pantryItem) {
                        if (!missingIngredients[ingredient.name]) {
                            missingIngredients[ingredient.name] = {
                                name: ingredient.name,
                                usedIn: [],
                                deliveryReady: true // Flag for delivery integration
                            };
                        }
                        missingIngredients[ingredient.name].usedIn.push({
                            day,
                            meal: meal.name
                        });
                    }
                });
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

    // Enhanced Meal Card Component
    const MealCard = ({ meal, day, mealType, onViewRecipe, onSwapMeal, onAddToGrocery }) => {
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
                // Pantry indicator
                meal.pantryFriendly && React.createElement('div', { className: 'absolute top-2 left-2 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold' },
                    '🏪'
                )
            ),

            React.createElement('div', { className: 'p-4' },
                React.createElement('h4', { className: 'font-bold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors' }, 
                    meal.name
                ),
                React.createElement('p', { className: 'text-sm text-gray-600 mb-3 line-clamp-2' }, 
                    meal.description
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

                React.createElement('div', { className: 'flex gap-2' },
                    React.createElement('button', {
                        onClick: () => onViewRecipe(meal),
                        className: 'flex-1 px-3 py-2 bg-gradient-to-r from-blue-500 to-teal-600 hover:from-blue-600 hover:to-teal-700 text-white text-sm rounded-lg font-semibold transition-all duration-200 transform hover:scale-105'
                    }, '👨‍🍳 Recipe'),
                    React.createElement('button', {
                        onClick: () => onSwapMeal(day, mealType, meal),
                        className: 'px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-lg font-semibold transition-all duration-200'
                    }, '🔄'),
                    React.createElement('button', {
                        onClick: () => onAddToGrocery(meal),
                        className: 'px-3 py-2 bg-green-100 hover:bg-green-200 text-green-700 text-sm rounded-lg font-semibold transition-all duration-200'
                    }, '🛒')
                )
            )
        );
    };

    // Enhanced Recipe Modal with pantry indicators
    const RecipeDetailModal = ({ meal, isOpen, onClose, pantryItems }) => {
        if (!isOpen || !meal) return null;

        const pantryItemNames = pantryItems.map(item => item.name.toLowerCase());

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
                                React.createElement('div', { className: 'flex space-x-4 mt-3 text-sm' },
                                    React.createElement('span', { className: 'bg-white/20 px-2 py-1 rounded' }, `⏱️ ${meal.prepTime}`),
                                    React.createElement('span', { className: 'bg-white/20 px-2 py-1 rounded' }, `🔥 ${meal.cookTime}`),
                                    React.createElement('span', { className: 'bg-white/20 px-2 py-1 rounded' }, `📊 ${meal.difficulty}`),
                                    meal.pantryFriendly && React.createElement('span', { className: 'bg-green-500/20 px-2 py-1 rounded' }, '🏪 Pantry Friendly')
                                )
                            )
                        )
                    ),

                    React.createElement('div', { className: 'p-6' },
                        React.createElement('div', { className: 'grid grid-cols-4 gap-4 mb-6' },
                            React.createElement('div', { className: 'text-center p-4 bg-blue-50 rounded-xl border border-blue-200' },
                                React.createElement('div', { className: 'text-3xl font-bold text-blue-600' }, meal.calories),
                                React.createElement('div', { className: 'text-sm text-gray-600' }, 'Calories')
                            ),
                            React.createElement('div', { className: 'text-center p-4 bg-red-50 rounded-xl border border-red-200' },
                                React.createElement('div', { className: 'text-3xl font-bold text-red-600' }, `${meal.protein}g`),
                                React.createElement('div', { className: 'text-sm text-gray-600' }, 'Protein')
                            ),
                            React.createElement('div', { className: 'text-center p-4 bg-yellow-50 rounded-xl border border-yellow-200' },
                                React.createElement('div', { className: 'text-3xl font-bold text-yellow-600' }, `${meal.carbs}g`),
                                React.createElement('div', { className: 'text-sm text-gray-600' }, 'Carbs')
                            ),
                            React.createElement('div', { className: 'text-center p-4 bg-purple-50 rounded-xl border border-purple-200' },
                                React.createElement('div', { className: 'text-3xl font-bold text-purple-600' }, `${meal.fat}g`),
                                React.createElement('div', { className: 'text-sm text-gray-600' }, 'Fat')
                            )
                        ),

                        React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-6' },
                            React.createElement('div', null,
                                React.createElement('h3', { className: 'text-xl font-bold text-gray-800 mb-4 flex items-center' },
                                    React.createElement('span', { className: 'mr-2 text-2xl' }, '🛒'),
                                    'Ingredients'
                                ),
                                React.createElement('div', { className: 'space-y-2' },
                                    meal.ingredients.map((ingredient, index) => {
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
                                                ingredient.name
                                            ),
                                            React.createElement('span', { className: 'text-sm text-gray-600' }, ingredient.amount || 'as needed')
                                        );
                                    })
                                )
                            ),

                            React.createElement('div', null,
                                React.createElement('h3', { className: 'text-xl font-bold text-gray-800 mb-4 flex items-center' },
                                    React.createElement('span', { className: 'mr-2 text-2xl' }, '👨‍🍳'),
                                    'Instructions'
                                ),
                                React.createElement('ol', { className: 'space-y-3' },
                                    meal.instructions ? meal.instructions.map((instruction, index) => 
                                        React.createElement('li', { 
                                            key: index,
                                            className: 'flex gap-3'
                                        },
                                            React.createElement('span', { 
                                                className: 'flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-teal-600 text-white rounded-full flex items-center justify-center text-sm font-bold'
                                            }, index + 1),
                                            React.createElement('span', { className: 'text-gray-700 leading-relaxed' }, instruction)
                                        )
                                    ) : React.createElement('p', { className: 'text-gray-600' }, 'Detailed instructions available in full recipe database.')
                                )
                            )
                        )
                    )
                )
            )
        );
    };

    // Main Component with Enhanced Workflow
    const WeeklyMealPlanningApp = () => {
        const [currentWeekStart, setCurrentWeekStart] = React.useState(getWeekStartDate());
        const [weeklyPlan, setWeeklyPlan] = React.useState(loadWeeklyPlan(currentWeekStart));
        const [pantryItems, setPantryItems] = React.useState([]);
        const [userPreferences, setUserPreferences] = React.useState(getUserPreferences());
        const [selectedMeal, setSelectedMeal] = React.useState(null);
        const [modalOpen, setModalOpen] = React.useState(false);
        const [missingIngredients, setMissingIngredients] = React.useState([]);
        const [isGenerating, setIsGenerating] = React.useState(false);

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
            const currentIndex = availableMeals.findIndex(meal => meal.id === currentMeal.id);
            const nextIndex = (currentIndex + 1) % availableMeals.length;
            
            setWeeklyPlan(prev => ({
                ...prev,
                [day]: {
                    ...prev[day],
                    [mealType]: [availableMeals[nextIndex]]
                }
            }));
        };

        const addToGroceryList = (meal) => {
            const missingForMeal = meal.ingredients.filter(ingredient => 
                !pantryItems.some(item => item.name.toLowerCase() === ingredient.name.toLowerCase()) && 
                !ingredient.pantryItem
            );
            
            if (missingForMeal.length > 0) {
                // Integration with delivery tab
                const deliveryMessage = `Ready to order ${missingForMeal.length} ingredients for ${meal.name}! \n\nWould you like to:\n1. Add to grocery delivery cart\n2. View in delivery tab\n3. Save for later`;
                alert(deliveryMessage);
                // Here you would integrate with the actual delivery system
            } else {
                alert('All ingredients are already in your pantry! 🎉');
            }
        };

        const navigateWeek = (direction) => {
            const newDate = new Date(currentWeekStart);
            newDate.setDate(newDate.getDate() + (direction * 7));
            setCurrentWeekStart(getWeekStartDate(newDate));
        };

        const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        const weekHasMeals = Object.keys(weeklyPlan).length > 0;

        const weeklyTotals = weekHasMeals ? weekDays.reduce((totals, day) => {
            if (weeklyPlan[day]) {
                const dayMeals = Object.values(weeklyPlan[day]).flat();
                return {
                    calories: totals.calories + dayMeals.reduce((sum, meal) => sum + meal.calories, 0),
                    protein: totals.protein + dayMeals.reduce((sum, meal) => sum + meal.protein, 0)
                };
            }
            return totals;
        }, { calories: 0, protein: 0 }) : { calories: 0, protein: 0 };

        const pantryUtilization = pantryItems.length > 0 ? 
            (pantryItems.filter(item => 
                Object.values(weeklyPlan).flat().some(dayPlan => 
                    Object.values(dayPlan).flat().some(meal => 
                        meal.ingredients && meal.ingredients.some(ingredient => 
                            ingredient.name.toLowerCase() === item.name.toLowerCase()
                        )
                    )
                )
            ).length / pantryItems.length * 100) : 0;

        return React.createElement('div', { className: 'min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-cyan-50' },
            React.createElement('div', { className: 'max-w-7xl mx-auto p-6' },
                React.createElement('div', { className: 'bg-gradient-to-r from-blue-600 to-teal-600 rounded-3xl shadow-2xl p-8 mb-8 text-white' },
                    React.createElement('div', { className: 'text-center' },
                        React.createElement('h1', { className: 'text-4xl font-bold mb-4' }, 
                            `🍽️ Your Personal Meal Plan, ${userPreferences.name}!`
                        ),
                        React.createElement('div', { className: 'bg-white/20 backdrop-blur-sm rounded-2xl p-4 mb-6' },
                            React.createElement('p', { className: 'text-lg mb-3' }, 
                                '✨ Smart meal planning with pantry-first approach:'
                            ),
                            React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-4 text-sm' },
                                React.createElement('div', { className: 'space-y-2' },
                                    React.createElement('div', { className: 'bg-white/10 px-3 py-2 rounded-lg' },
                                        `🎯 Goal: ${userPreferences.goal.replace('_', ' ')}`
                                    ),
                                    React.createElement('div', { className: 'bg-white/10 px-3 py-2 rounded-lg' },
                                        `🔥 ${userPreferences.calorieTarget} calories/day`
                                    ),
                                    userPreferences.dietaryRestrictions.length > 0 && React.createElement('div', { className: 'bg-white/10 px-3 py-2 rounded-lg' },
                                        `🌱 ${userPreferences.dietaryRestrictions.join(', ')}`
                                    )
                                ),
                                React.createElement('div', { className: 'space-y-2' },
                                    React.createElement('div', { className: 'bg-white/10 px-3 py-2 rounded-lg' },
                                        `🏪 ${pantryItems.length} pantry items available`
                                    ),
                                    pantryItems.length > 0 && React.createElement('div', { className: 'bg-white/10 px-3 py-2 rounded-lg' },
                                        `📊 ${Math.round(pantryUtilization)}% pantry utilization`
                                    ),
                                    React.createElement('div', { className: 'bg-white/10 px-3 py-2 rounded-lg' },
                                        `🛒 Seamless delivery integration`
                                    )
                                )
                            )
                        ),
                        
                        React.createElement('button', {
                            onClick: generateWeeklyPlan,
                            disabled: isGenerating,
                            className: `px-8 py-4 bg-white/20 hover:bg-white/30 disabled:bg-white/10 rounded-2xl font-bold text-lg transition-all duration-200 backdrop-blur-sm ${isGenerating ? 'cursor-not-allowed' : 'transform hover:scale-105'}`
                        }, 
                            isGenerating ? '🤖 Creating Your Optimal Plan...' : 
                            pantryItems.length > 0 ? '✨ Generate Pantry-Smart Plan' : 
                            '✨ Generate Meal Plan + Shopping List'
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
                        React.createElement('h3', { className: 'text-lg font-bold text-gray-800 mb-4' }, '📊 Weekly Nutrition'),
                        React.createElement('div', { className: 'space-y-2' },
                            React.createElement('div', { className: 'flex justify-between' },
                                React.createElement('span', null, 'Avg Calories:'),
                                React.createElement('span', { className: 'font-bold text-blue-600' }, 
                                    `${Math.round(weeklyTotals.calories / 7)}/day`
                                )
                            ),
                            React.createElement('div', { className: 'flex justify-between' },
                                React.createElement('span', null, 'Avg Protein:'),
                                React.createElement('span', { className: 'font-bold text-red-600' }, 
                                    `${Math.round(weeklyTotals.protein / 7)}g/day`
                                )
                            )
                        )
                    ),
                    React.createElement('div', { className: 'bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20' },
                        React.createElement('h3', { className: 'text-lg font-bold text-gray-800 mb-4' }, '🏪 Pantry Smart'),
                        React.createElement('div', null,
                            React.createElement('div', { className: 'text-2xl font-bold text-green-600' }, 
                                pantryItems.length > 0 ? `${Math.round(pantryUtilization)}%` : '0%'
                            ),
                            React.createElement('div', { className: 'text-sm text-gray-600' }, 'pantry utilization'),
                            React.createElement('div', { className: 'text-xs text-gray-500 mt-1' }, 
                                pantryItems.length > 0 ? 'Using your ingredients!' : 'Add pantry items for better suggestions'
                            )
                        )
                    ),
                    React.createElement('div', { className: 'bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20' },
                        React.createElement('h3', { className: 'text-lg font-bold text-gray-800 mb-4' }, '🛒 Delivery Ready'),
                        React.createElement('div', null,
                            React.createElement('div', { className: 'text-2xl font-bold text-orange-600' }, missingIngredients.length),
                            React.createElement('div', { className: 'text-sm text-gray-600' }, 'items to order'),
                            missingIngredients.length > 0 ? React.createElement('button', {
                                onClick: () => {
                                    const deliveryItems = missingIngredients.map(item => item.name).join(', ');
                                    alert(`🚚 Delivery Integration Ready!\n\nItems to order: ${deliveryItems}\n\nClick "🛒" on any meal card to start ordering!`);
                                },
                                className: 'mt-2 text-sm px-3 py-1 bg-orange-500 hover:bg-orange-600 text-white rounded-lg'
                            }, 'Order All') : React.createElement('div', { className: 'text-xs text-green-600 mt-1' }, 'All set! 🎉')
                        )
                    ),
                    React.createElement('div', { className: 'bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20' },
                        React.createElement('h3', { className: 'text-lg font-bold text-gray-800 mb-4' }, '🏆 Meal Variety'),
                        React.createElement('div', null,
                            React.createElement('div', { className: 'text-2xl font-bold text-purple-600' }, 
                                weekHasMeals ? Object.values(weeklyPlan).reduce((count, day) => 
                                    count + Object.values(day).flat().length, 0
                                ) : 0
                            ),
                            React.createElement('div', { className: 'text-sm text-gray-600' }, 'unique meals planned'),
                            React.createElement('div', { className: 'text-xs text-gray-500 mt-1' }, 
                                'From 40+ recipe database 🌟'
                            )
                        )
                    )
                ),

                !weekHasMeals ? 
                    React.createElement('div', { className: 'text-center py-16' },
                        React.createElement('div', { className: 'text-6xl mb-6' }, '🍽️'),
                        React.createElement('h3', { className: 'text-2xl font-bold text-gray-800 mb-4' }, 
                            pantryItems.length > 0 ? 
                            'Ready to create meals from your pantry?' :
                            'Ready to plan your perfect week?'
                        ),
                        React.createElement('p', { className: 'text-gray-600 mb-6 max-w-2xl mx-auto' }, 
                            pantryItems.length > 0 ? 
                            `We found ${pantryItems.length} items in your pantry! We'll prioritize meals using what you already have, then suggest ingredients you can order seamlessly.` :
                            'Add items to your pantry for personalized suggestions, or generate a plan and we\'ll create a shopping list for easy delivery!'
                        ),
                        React.createElement('button', {
                            onClick: generateWeeklyPlan,
                            className: 'px-8 py-4 bg-gradient-to-r from-blue-500 to-teal-600 hover:from-blue-600 hover:to-teal-700 text-white rounded-2xl font-bold text-lg transform hover:scale-105 transition-all duration-200'
                        }, pantryItems.length > 0 ? '✨ Generate Pantry-Smart Plan' : '✨ Generate Plan + Shopping List')
                    ) :
                    React.createElement('div', { className: 'space-y-8' },
                        weekDays.map(day => 
                            React.createElement('div', { 
                                key: day,
                                className: 'bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden'
                            },
                                React.createElement('div', { className: 'bg-gradient-to-r from-gray-700 to-gray-800 text-white p-4' },
                                    React.createElement('h3', { className: 'text-xl font-bold' }, day),
                                    weeklyPlan[day] ? React.createElement('div', { className: 'text-sm opacity-75' },
                                        `${Object.values(weeklyPlan[day]).flat().reduce((cal, meal) => cal + meal.calories, 0)} calories • `,
                                        `${Math.round(Object.values(weeklyPlan[day]).flat().reduce((pro, meal) => pro + meal.protein, 0))}g protein`
                                    ) : null
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
                                                            onAddToGrocery: addToGroceryList
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

                missingIngredients.length > 0 ? React.createElement('div', { className: 'mt-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20' },
                    React.createElement('div', { className: 'flex justify-between items-center mb-4' },
                        React.createElement('h3', { className: 'text-xl font-bold text-gray-800 flex items-center' },
                            React.createElement('span', { className: 'mr-2 text-2xl' }, '🛒'),
                            'Seamless Delivery Integration'
                        ),
                        React.createElement('button', {
                            onClick: () => alert('🚚 Opening delivery tab with your ingredient list...'),
                            className: 'px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg font-semibold'
                        }, 'Order All via Delivery Tab →')
                    ),
                    React.createElement('p', { className: 'text-gray-600 mb-4' },
                        `We found ${missingIngredients.length} ingredients you need that aren't in your pantry. Click any "🛒" button or order everything at once!`
                    ),
                    React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' },
                        missingIngredients.slice(0, 9).map((ingredient, index) => 
                            React.createElement('div', { 
                                key: index,
                                className: 'p-4 bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-xl'
                            },
                                React.createElement('div', { className: 'flex justify-between items-start mb-2' },
                                    React.createElement('h4', { className: 'font-medium text-gray-800' }, ingredient.name),
                                    React.createElement('span', { className: 'text-xs text-orange-600 bg-orange-200 px-2 py-1 rounded' }, 
                                        `${ingredient.usedIn.length} meals`
                                    )
                                ),
                                React.createElement('div', { className: 'text-sm text-gray-600 mb-2' },
                                    ingredient.usedIn.slice(0, 2).map(usage => `${usage.day}: ${usage.meal}`).join(', '),
                                    ingredient.usedIn.length > 2 ? ` +${ingredient.usedIn.length - 2} more` : ''
                                ),
                                React.createElement('button', {
                                    onClick: () => alert(`🛒 Adding "${ingredient.name}" to delivery cart...`),
                                    className: 'w-full text-xs px-2 py-1 bg-green-500 hover:bg-green-600 text-white rounded'
                                }, 'Add to Cart')
                            )
                        )
                    ),
                    missingIngredients.length > 9 && React.createElement('div', { className: 'text-center mt-4' },
                        React.createElement('p', { className: 'text-gray-600' }, 
                            `And ${missingIngredients.length - 9} more ingredients available for delivery...`
                        )
                    )
                ) : null,

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
            ReactDOM.render(React.createElement(WeeklyMealPlanningApp), container);
        }
    }

    // Export functions
    window.HabbtMealPlanning = {
        WeeklyMealPlanningApp,
        renderMealPlanning
    };

    window.FuelIQMealPlanning = window.HabbtMealPlanning;
    window.renderMealPlanning = renderMealPlanning;

    console.log('✅ Habbt Comprehensive Meal Planning loaded - 40+ recipes with pantry-first workflow and delivery integration');

})();
