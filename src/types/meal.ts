import { Recipe } from './index';

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface MealPlan {
  id: string;
  userId: string;
  date: string;
  meals: {
    [key in MealType]: PlannedMeal[];
  };
  totalNutrients: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

export interface PlannedMeal {
  id: string;
  recipe: Recipe;
  servings: number;
  time?: string;
  notes?: string;
}

export interface MealPlannerState {
  selectedDate: string;
  mealPlans: Record<string, MealPlan>;
  selectedMealType: MealType | null;
}

export interface DragItem {
  type: string;
  id: string;
  mealType: MealType;
  recipe: Recipe;
} 