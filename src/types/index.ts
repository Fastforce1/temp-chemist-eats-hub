export interface User {
  id: string;
  email: string;
  profile: UserProfile;
  preferences: UserPreferences;
  goals: UserGoals;
  metrics: BodyMetrics;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender?: string;
  allergies: string[];
  dietaryRestrictions: string[];
}

export interface UserPreferences {
  dietType: 'omnivore' | 'vegetarian' | 'vegan' | 'keto' | 'paleo';
  cuisinePreferences: string[];
  mealPrepTime: 'quick' | 'medium' | 'lengthy';
  supplementPreferences: string[];
}

export interface UserGoals {
  primary: 'weight_loss' | 'muscle_gain' | 'energy' | 'gut_health' | 'general_wellness';
  targetWeight?: number;
  weeklyWorkouts?: number;
  supplementGoals: string[];
}

export interface BodyMetrics {
  weight: number;
  height: number;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'very_active' | 'extra_active';
  bodyFatPercentage?: number;
  bloodWork?: BloodWorkMetrics;
}

export interface BloodWorkMetrics {
  vitaminD?: number;
  vitaminB12?: number;
  iron?: number;
  // Add more blood work metrics as needed
}

export interface NutrientData {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  micronutrients: Record<string, number>;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  ingredients: Ingredient[];
  instructions: string[];
  prepTime: number;
  cookTime: number;
  servings: number;
  nutrients: NutrientData;
  image?: string;
  tags: string[];
}

export interface Ingredient {
  id: string;
  name: string;
  amount: number;
  unit: string;
  nutrients: NutrientData;
}

export interface Supplement {
  id: string;
  name: string;
  brand: string;
  description: string;
  benefits: string[];
  dosage: string;
  price: number;
  image?: string;
  nutrients: NutrientData;
}

export interface DailyLog {
  date: string;
  meals: {
    breakfast: Recipe[];
    lunch: Recipe[];
    dinner: Recipe[];
    snacks: Recipe[];
  };
  supplements: {
    supplementId: string;
    taken: boolean;
    timesTaken: string[];
  }[];
  totalNutrients: NutrientData;
  waterIntake: number;
}

export interface ShoppingList {
  id: string;
  userId: string;
  items: ShoppingItem[];
  createdAt: string;
  updatedAt: string;
}

export interface ShoppingItem {
  id: string;
  name: string;
  amount: number;
  unit: string;
  category: string;
  purchased: boolean;
  productLink?: string;
}

export interface WellnessScore {
  overall: number;
  nutrition: number;
  supplementation: number;
  consistency: number;
  progress: number;
} 