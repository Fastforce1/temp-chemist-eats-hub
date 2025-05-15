export type RecipeCategory = {
  id: string;
  name: string;
  description: string;
  image: string;
};

export type RecipeCategoryId = 
  | 'breakfast'
  | 'lunch'
  | 'dinner'
  | 'desserts'
  | 'snacks'
  | 'beverages'
  | 'appetizers'
  | 'soups'
  | 'salads'
  | 'main_courses'
  | 'side_dishes'
  | 'vegetarian'
  | 'vegan'
  | 'gluten_free'
  | 'healthy';

export const recipeCategories: Record<RecipeCategoryId, RecipeCategory> = {
  breakfast: {
    id: 'breakfast',
    name: 'Breakfast',
    description: 'Start your day right with these delicious breakfast recipes',
    image: 'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg'
  },
  lunch: {
    id: 'lunch',
    name: 'Lunch',
    description: 'Quick and satisfying lunch recipes for any day',
    image: 'https://images.pexels.com/photos/1211887/pexels-photo-1211887.jpeg'
  },
  dinner: {
    id: 'dinner',
    name: 'Dinner',
    description: 'Delicious dinner recipes for the whole family',
    image: 'https://images.pexels.com/photos/3655916/pexels-photo-3655916.jpeg'
  },
  desserts: {
    id: 'desserts',
    name: 'Desserts',
    description: 'Sweet treats and desserts for any occasion',
    image: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg'
  },
  snacks: {
    id: 'snacks',
    name: 'Snacks',
    description: 'Tasty snacks and small bites',
    image: 'https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg'
  },
  beverages: {
    id: 'beverages',
    name: 'Beverages',
    description: 'Refreshing drinks and smoothies',
    image: 'https://images.pexels.com/photos/434295/pexels-photo-434295.jpeg'
  },
  appetizers: {
    id: 'appetizers',
    name: 'Appetizers',
    description: 'Start your meal with these delicious appetizers',
    image: 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg'
  },
  soups: {
    id: 'soups',
    name: 'Soups',
    description: 'Warming soups and broths',
    image: 'https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg'
  },
  salads: {
    id: 'salads',
    name: 'Salads',
    description: 'Fresh and healthy salad recipes',
    image: 'https://images.pexels.com/photos/1211887/pexels-photo-1211887.jpeg'
  },
  main_courses: {
    id: 'main_courses',
    name: 'Main Courses',
    description: 'Hearty main dishes for any occasion',
    image: 'https://images.pexels.com/photos/725991/pexels-photo-725991.jpeg'
  },
  side_dishes: {
    id: 'side_dishes',
    name: 'Side Dishes',
    description: 'Perfect accompaniments to your main course',
    image: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg'
  },
  vegetarian: {
    id: 'vegetarian',
    name: 'Vegetarian',
    description: 'Delicious meat-free recipes',
    image: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg'
  },
  vegan: {
    id: 'vegan',
    name: 'Vegan',
    description: 'Plant-based recipes for everyone',
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg'
  },
  gluten_free: {
    id: 'gluten_free',
    name: 'Gluten Free',
    description: 'Delicious gluten-free recipes',
    image: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg'
  },
  healthy: {
    id: 'healthy',
    name: 'Healthy',
    description: 'Nutritious and healthy recipes',
    image: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg'
  }
}; 