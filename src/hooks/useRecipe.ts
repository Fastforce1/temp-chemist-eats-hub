import { useQuery } from '@tanstack/react-query';
import { getRecipeById } from '../api/fatsecret';
import { ApiRecipeResponse, Recipe } from '../types/recipe';
import { toast } from 'react-toastify';

// Mock recipes for fallback or demo purposes
const mockRecipes: Record<string, Recipe> = {
  '1': {
    id: '1',
    name: 'Green Smoothie Bowl',
    description: 'A nutrient-packed smoothie bowl with fresh fruits and superfoods.',
    image: 'https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg',
    prepTime: 5,
    cookTime: 10,
    totalTime: 15,
    servings: 2,
    calories: 420,
    protein: 15,
    carbs: 65,
    fat: 12,
    ingredients: [
      '2 frozen bananas',
      '1 cup mixed berries',
      '1 cup spinach',
      '1 cup almond milk',
      '1 tbsp chia seeds',
      '1 tbsp honey',
      'Toppings: granola, fresh fruits, coconut flakes'
    ],
    directions: [
      'Blend frozen bananas, berries, spinach, and almond milk until smooth.',
      'Pour into a bowl.',
      'Top with granola, fresh fruits, chia seeds, and coconut flakes.',
      'Drizzle with honey and serve immediately.'
    ],
    nutrition: {
      calories: 420,
      fat: 12,
      saturatedFat: 2,
      cholesterol: 0,
      sodium: 120,
      carbs: 65,
      fiber: 12,
      sugar: 35,
      protein: 15
    },
    tags: ['Breakfast', 'Vegetarian', 'Healthy'],
    difficulty: 'Easy'
  },
  '2': {
    id: '2',
    name: 'Fresh Mediterranean Salad',
    description: 'Fresh and vibrant salad with chickpeas, cucumber, tomatoes, and feta cheese.',
    image: 'https://images.pexels.com/photos/1211887/pexels-photo-1211887.jpeg',
    prepTime: 15,
    cookTime: 5,
    totalTime: 20,
    servings: 4,
    calories: 320,
    protein: 12,
    carbs: 28,
    fat: 18,
    ingredients: [
      '2 cups cherry tomatoes, halved',
      '1 large cucumber, diced',
      '1 can chickpeas, drained and rinsed',
      '1/2 red onion, thinly sliced',
      '1 cup feta cheese, crumbled',
      '1/2 cup Kalamata olives',
      '1/4 cup fresh parsley, chopped',
      '3 tbsp olive oil',
      '2 tbsp lemon juice',
      'Salt and pepper to taste'
    ],
    directions: [
      'Combine tomatoes, cucumber, chickpeas, and red onion in a large bowl.',
      'Add olives and feta cheese.',
      'In a small bowl, whisk together olive oil, lemon juice, salt, and pepper.',
      'Pour dressing over salad and toss gently.',
      'Sprinkle with fresh parsley and serve.'
    ],
    nutrition: {
      calories: 320,
      fat: 18,
      saturatedFat: 6,
      cholesterol: 25,
      sodium: 580,
      carbs: 28,
      fiber: 8,
      sugar: 6,
      protein: 12
    },
    tags: ['Vegetarian', 'Mediterranean', 'Gluten-Free'],
    difficulty: 'Easy'
  },
  '3': {
    id: '3',
    name: 'Colorful Buddha Bowl',
    description: 'Protein-rich quinoa with colorful roasted vegetables and tahini dressing.',
    image: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg',
    prepTime: 15,
    cookTime: 25,
    totalTime: 40,
    servings: 3,
    calories: 380,
    protein: 14,
    carbs: 48,
    fat: 16,
    ingredients: [
      '1 cup quinoa',
      '2 cups vegetable broth',
      '1 sweet potato, cubed',
      '2 cups broccoli florets',
      '1 red bell pepper, sliced',
      '1 can chickpeas, drained and rinsed',
      '2 tbsp olive oil',
      '1 avocado, sliced',
      '2 tbsp tahini',
      '1 tbsp lemon juice',
      '1 tbsp maple syrup',
      'Salt and pepper to taste'
    ],
    directions: [
      'Cook quinoa in vegetable broth according to package instructions.',
      'Preheat oven to 400°F (200°C).',
      'Toss sweet potato, broccoli, and bell pepper with olive oil, salt, and pepper.',
      'Roast vegetables for 20-25 minutes.',
      'Whisk together tahini, lemon juice, maple syrup, and water to make dressing.',
      'Assemble bowls with quinoa, roasted vegetables, chickpeas, and avocado.',
      'Drizzle with tahini dressing and serve.'
    ],
    nutrition: {
      calories: 380,
      fat: 16,
      saturatedFat: 2,
      cholesterol: 0,
      sodium: 320,
      carbs: 48,
      fiber: 12,
      sugar: 8,
      protein: 14
    },
    tags: ['Vegan', 'Gluten-Free', 'Healthy'],
    difficulty: 'Medium'
  },
  '4': {
    id: '4',
    name: 'Classic Blueberry Pancakes',
    description: 'Fluffy homemade pancakes topped with fresh blueberries and maple syrup.',
    image: 'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg',
    prepTime: 10,
    cookTime: 15,
    totalTime: 25,
    servings: 2,
    calories: 450,
    protein: 12,
    carbs: 68,
    fat: 14,
    ingredients: [
      '1 1/2 cups all-purpose flour',
      '3 1/2 tsp baking powder',
      '1/4 tsp salt',
      '1 tbsp sugar',
      '1 1/4 cups milk',
      '1 egg',
      '3 tbsp melted butter',
      '1 cup fresh blueberries',
      'Maple syrup for serving'
    ],
    directions: [
      'In a large bowl, whisk together flour, baking powder, salt, and sugar.',
      'In another bowl, whisk milk, egg, and melted butter.',
      'Pour wet ingredients into dry ingredients and mix until just combined.',
      'Heat a non-stick pan or griddle over medium heat.',
      'Pour 1/4 cup batter for each pancake.',
      'Sprinkle blueberries onto each pancake.',
      'Cook until bubbles form, then flip and cook other side.',
      'Serve with maple syrup.'
    ],
    nutrition: {
      calories: 450,
      fat: 14,
      saturatedFat: 8,
      cholesterol: 85,
      sodium: 380,
      carbs: 68,
      fiber: 3,
      sugar: 24,
      protein: 12
    },
    tags: ['Breakfast', 'Vegetarian', 'Kid-Friendly'],
    difficulty: 'Easy'
  },
  '5': {
    id: '5',
    name: 'Grilled Salmon & Vegetables',
    description: 'Omega-3 rich salmon fillet with grilled asparagus and lemon.',
    image: 'https://images.pexels.com/photos/3655916/pexels-photo-3655916.jpeg',
    prepTime: 10,
    cookTime: 25,
    totalTime: 35,
    servings: 2,
    calories: 520,
    protein: 46,
    carbs: 12,
    fat: 32,
    ingredients: [
      '2 salmon fillets (6 oz each)',
      '1 bunch asparagus',
      '2 tbsp olive oil',
      '2 cloves garlic, minced',
      '1 lemon',
      '2 tbsp fresh dill',
      'Salt and pepper to taste'
    ],
    directions: [
      'Preheat grill to medium-high heat.',
      'Season salmon with olive oil, garlic, salt, and pepper.',
      'Toss asparagus with olive oil, salt, and pepper.',
      'Grill salmon for 4-5 minutes per side.',
      'Grill asparagus for 5-7 minutes.',
      'Squeeze lemon juice over salmon and vegetables.',
      'Garnish with fresh dill and serve.'
    ],
    nutrition: {
      calories: 520,
      fat: 32,
      saturatedFat: 6,
      cholesterol: 124,
      sodium: 420,
      carbs: 12,
      fiber: 4,
      sugar: 3,
      protein: 46
    },
    tags: ['High Protein', 'Low Carb', 'Gluten-Free'],
    difficulty: 'Medium'
  },
  '6': {
    id: '6',
    name: 'Vegetarian Street Tacos',
    description: 'Mexican-inspired tacos with roasted vegetables, black beans, and fresh toppings.',
    image: 'https://images.pexels.com/photos/2092507/pexels-photo-2092507.jpeg',
    prepTime: 15,
    cookTime: 25,
    totalTime: 40,
    servings: 4,
    calories: 380,
    protein: 14,
    carbs: 52,
    fat: 16,
    ingredients: [
      '8 corn tortillas',
      '2 cups black beans, drained and rinsed',
      '2 bell peppers, sliced',
      '1 red onion, sliced',
      '2 tbsp olive oil',
      '2 tsp chili powder',
      '1 tsp cumin',
      '1 avocado, sliced',
      'Fresh cilantro',
      'Lime wedges',
      'Hot sauce (optional)'
    ],
    directions: [
      'Preheat oven to 425°F (220°C).',
      'Toss peppers and onions with oil, chili powder, and cumin.',
      'Roast vegetables for 20-25 minutes.',
      'Warm black beans in a pan.',
      'Heat tortillas briefly on each side.',
      'Assemble tacos with beans, roasted vegetables, and avocado.',
      'Garnish with cilantro and serve with lime wedges.'
    ],
    nutrition: {
      calories: 380,
      fat: 16,
      saturatedFat: 2,
      cholesterol: 0,
      sodium: 480,
      carbs: 52,
      fiber: 12,
      sugar: 6,
      protein: 14
    },
    tags: ['Vegetarian', 'Mexican', 'Dairy-Free'],
    difficulty: 'Easy'
  },
  '25': {
    id: '25',
    name: 'Seafood Paella',
    description: 'Spanish-style rice dish with mixed seafood, saffron, and vegetables.',
    image: 'https://images.pexels.com/photos/725991/pexels-photo-725991.jpeg',
    prepTime: 20,
    cookTime: 35,
    totalTime: 55,
    servings: 6,
    calories: 580,
    protein: 32,
    carbs: 65,
    fat: 18,
    ingredients: [
      '2 cups Bomba or Calasparra rice',
      '4 cups seafood stock',
      '1/2 pound large shrimp, peeled and deveined',
      '1/2 pound mussels, cleaned',
      '1/2 pound calamari rings',
      '1 onion, finely chopped',
      '4 garlic cloves, minced',
      '2 tomatoes, diced',
      '1 red bell pepper, sliced',
      '1 cup frozen peas',
      '2 tablespoons olive oil',
      '1 teaspoon smoked paprika',
      '1/2 teaspoon saffron threads',
      'Salt and pepper to taste',
      'Lemon wedges for serving'
    ],
    directions: [
      'Heat olive oil in a large paella pan over medium heat.',
      'Sauté onion and garlic until softened.',
      'Add rice and stir to coat with oil.',
      'Add paprika, saffron, and tomatoes. Cook for 2 minutes.',
      'Pour in seafood stock and bring to a simmer.',
      'Add bell peppers and peas. Cook for 10 minutes.',
      'Add seafood on top. Cook until rice is done and seafood is cooked through.',
      'Let rest for 5-10 minutes before serving.',
      'Garnish with lemon wedges and serve hot.'
    ],
    nutrition: {
      calories: 580,
      fat: 18,
      saturatedFat: 3,
      cholesterol: 185,
      sodium: 890,
      carbs: 65,
      fiber: 4,
      sugar: 5,
      protein: 32
    },
    tags: ['Seafood', 'Spanish', 'Main Course'],
    difficulty: 'Medium'
  },
  '7': {
    id: '7',
    name: 'Spicy Thai Noodle Soup',
    description: 'Aromatic and spicy Thai-style soup with rice noodles and fresh herbs.',
    image: 'https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg',
    prepTime: 15,
    cookTime: 30,
    totalTime: 45,
    servings: 4,
    calories: 410,
    protein: 18,
    carbs: 58,
    fat: 14,
    ingredients: [
      '8 oz rice noodles',
      '6 cups chicken or vegetable broth',
      '2 tablespoons Thai red curry paste',
      '1 can coconut milk',
      '2 tablespoons fish sauce',
      '1 tablespoon lime juice',
      '1 red bell pepper, sliced',
      '2 cups mushrooms, sliced',
      '2 cups baby spinach',
      'Fresh basil and cilantro',
      'Lime wedges for serving'
    ],
    directions: [
      'Cook rice noodles according to package instructions.',
      'In a large pot, combine broth and curry paste.',
      'Add coconut milk and bring to simmer.',
      'Add vegetables and cook until tender.',
      'Stir in fish sauce and lime juice.',
      'Add cooked noodles and spinach.',
      'Garnish with herbs and serve with lime wedges.'
    ],
    nutrition: {
      calories: 410,
      fat: 14,
      saturatedFat: 8,
      cholesterol: 0,
      sodium: 680,
      carbs: 58,
      fiber: 4,
      sugar: 3,
      protein: 18
    },
    tags: ['Thai', 'Soup', 'Spicy'],
    difficulty: 'Medium'
  },
  '8': {
    id: '8',
    name: 'Quinoa Power Bowl',
    description: 'Protein-packed quinoa bowl with roasted chickpeas and avocado.',
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
    prepTime: 10,
    cookTime: 20,
    totalTime: 30,
    servings: 2,
    calories: 440,
    protein: 16,
    carbs: 54,
    fat: 22,
    ingredients: [
      '1 cup quinoa',
      '1 can chickpeas',
      '1 sweet potato, cubed',
      '2 cups kale, chopped',
      '1 avocado',
      '2 tbsp olive oil',
      '1 lemon',
      'Salt and pepper to taste'
    ],
    directions: [
      'Cook quinoa according to package instructions.',
      'Roast chickpeas and sweet potato with olive oil.',
      'Massage kale with lemon juice and olive oil.',
      'Assemble bowls with quinoa, roasted vegetables, and kale.',
      'Top with avocado slices and season to taste.'
    ],
    nutrition: {
      calories: 440,
      fat: 22,
      saturatedFat: 3,
      cholesterol: 0,
      sodium: 390,
      carbs: 54,
      fiber: 12,
      sugar: 6,
      protein: 16
    },
    tags: ['Vegetarian', 'High Protein', 'Healthy'],
    difficulty: 'Easy'
  },
  '33': {
    id: '33',
    name: 'Tropical Smoothie Bowl',
    description: 'Refreshing smoothie bowl with mango, pineapple, and coconut.',
    image: 'https://images.pexels.com/photos/1332267/pexels-photo-1332267.jpeg',
    prepTime: 5,
    cookTime: 5,
    totalTime: 10,
    servings: 1,
    calories: 290,
    protein: 8,
    carbs: 52,
    fat: 9,
    ingredients: [
      '1 frozen mango',
      '1 cup frozen pineapple',
      '1 banana',
      '1/2 cup coconut milk',
      '1 tbsp honey',
      'Toppings: coconut flakes, granola, fresh fruit'
    ],
    directions: [
      'Blend frozen fruits with coconut milk until smooth.',
      'Pour into a bowl.',
      'Top with coconut flakes, granola, and fresh fruit.',
      'Drizzle with honey if desired.'
    ],
    nutrition: {
      calories: 290,
      fat: 9,
      saturatedFat: 6,
      cholesterol: 0,
      sodium: 45,
      carbs: 52,
      fiber: 6,
      sugar: 38,
      protein: 8
    },
    tags: ['Breakfast', 'Vegetarian', 'Dairy-Free'],
    difficulty: 'Easy'
  },
  '43': {
    id: '43',
    name: 'Berry Protein Smoothie',
    description: 'High-protein smoothie with mixed berries, Greek yogurt, and honey.',
    image: 'https://images.pexels.com/photos/434295/pexels-photo-434295.jpeg',
    prepTime: 5,
    cookTime: 5,
    totalTime: 10,
    servings: 1,
    calories: 245,
    protein: 24,
    carbs: 38,
    fat: 4,
    ingredients: [
      '1 cup mixed berries',
      '1 cup Greek yogurt',
      '1 scoop vanilla protein powder',
      '1 tbsp honey',
      '1/2 cup almond milk',
      'Ice cubes'
    ],
    directions: [
      'Combine all ingredients in a blender.',
      'Blend until smooth and creamy.',
      'Add more almond milk if needed for desired consistency.',
      'Serve immediately.'
    ],
    nutrition: {
      calories: 245,
      fat: 4,
      saturatedFat: 1,
      cholesterol: 10,
      sodium: 95,
      carbs: 38,
      fiber: 6,
      sugar: 28,
      protein: 24
    },
    tags: ['Breakfast', 'High Protein', 'Gluten-Free'],
    difficulty: 'Easy'
  }
};

/**
 * Parse FatSecret API response into our Recipe format
 */
const parseFatSecretRecipe = (apiData: any): Recipe | null => {
  try {
    if (!apiData?.recipe) return null;
    
    const fsRecipe = apiData.recipe;
    
    // Extract basic recipe information
    const recipe: Recipe = {
      id: fsRecipe.recipe_id || '',
      name: fsRecipe.recipe_name || 'Unknown Recipe',
      description: fsRecipe.recipe_description || '',
      image: fsRecipe.recipe_image || 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg',
      totalTime: fsRecipe.cooking_time_min ? parseInt(fsRecipe.cooking_time_min) : 30,
      prepTime: 10,
      cookTime: fsRecipe.cooking_time_min ? parseInt(fsRecipe.cooking_time_min) : 20,
      servings: fsRecipe.serving_sizes?.[0]?.number_of_units ? parseInt(fsRecipe.serving_sizes[0].number_of_units) : 4,
      ingredients: fsRecipe.directions?.direction?.split('\r\n')
        .filter((line: string) => line.trim() !== '')
        .slice(0, -1) || [],
      directions: [fsRecipe.directions?.direction?.split('\r\n').pop() || 'No directions available'],
      tags: ['FatSecret Recipe'],
      difficulty: 'Medium',
      nutrition: {
        calories: fsRecipe.serving_sizes?.[0]?.calories ? parseInt(fsRecipe.serving_sizes[0].calories) : 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        saturatedFat: 0,
        cholesterol: 0,
        sodium: 0,
        fiber: 0,
        sugar: 0
      }
    };
    
    // Extract nutrition information if available
    if (fsRecipe.serving_sizes?.[0]) {
      const serving = fsRecipe.serving_sizes[0];
      
      // Update nutrition based on available data
      if (serving.calories) recipe.calories = parseInt(serving.calories);
      if (serving.protein) recipe.protein = parseInt(serving.protein);
      if (serving.carbohydrate) recipe.carbs = parseInt(serving.carbohydrate);
      if (serving.fat) recipe.fat = parseInt(serving.fat);
      
      // Set additional nutrition details
      recipe.nutrition = {
        calories: parseInt(serving.calories) || 0,
        fat: parseInt(serving.fat) || 0,
        carbs: parseInt(serving.carbohydrate) || 0,
        protein: parseInt(serving.protein) || 0,
        saturatedFat: parseInt(serving.saturated_fat) || 0,
        cholesterol: parseInt(serving.cholesterol) || 0,
        sodium: parseInt(serving.sodium) || 0,
        fiber: parseInt(serving.fiber) || 0,
        sugar: parseInt(serving.sugar) || 0
      };
    }
    
    return recipe;
  } catch (error) {
    console.error('Error parsing FatSecret recipe:', error);
    return null;
  }
};

/**
 * Custom hook for fetching recipe data
 */
export const useRecipe = (id: string | undefined) => {
  return useQuery<ApiRecipeResponse | null, Error>({
    queryKey: ['recipe', id],
    queryFn: async () => {
      if (!id) return null;
      
      const apiData = await getRecipeById(id);
      
      // Try to parse the API response
      const parsedRecipe = parseFatSecretRecipe(apiData);
      
      // If successfully parsed, return it structured as expected
      if (parsedRecipe) {
        return { recipe: parsedRecipe };
      }
      
      // Otherwise return the raw data
      return apiData;
    },
    enabled: !!id,
    retry: 1,
    meta: {
      onError: (error: Error) => {
        console.error('Failed to fetch recipe:', error);
        toast.info('Using demo recipe data', { autoClose: 3000 });
      }
    }
  });
};

/**
 * Get a mock recipe by ID (used as fallback)
 */
export const getMockRecipe = (id: string | undefined): Recipe | undefined => {
  if (!id) return undefined;
  
  // Return the requested mock recipe if it exists
  return mockRecipes[id];
};
