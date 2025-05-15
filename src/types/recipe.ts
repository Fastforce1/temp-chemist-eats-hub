
export interface Nutrition {
  calories: number;
  fat: number;
  saturatedFat: number;
  cholesterol: number;
  sodium: number;
  carbs: number;
  fiber: number;
  sugar: number;
  protein: number;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  image: string;
  prepTime?: number;
  cookTime?: number;
  totalTime: number;
  servings: number;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  ingredients: string[];
  directions: string[];
  nutrition: Nutrition;
  tags: string[];
  difficulty: string;
}

// Define the API response type structure
export interface ApiRecipeResponse {
  recipe?: Recipe;
}
