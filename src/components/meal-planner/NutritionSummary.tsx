
import React from 'react';

interface MealPlan {
  breakfast: {
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  } | null;
  lunch: {
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  } | null;
  dinner: {
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  } | null;
  snacks: {
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  }[];
}

interface NutritionSummaryProps {
  mealPlan: MealPlan;
}

const NutritionSummary: React.FC<NutritionSummaryProps> = ({ mealPlan }) => {
  // Calculate total calories
  const totalCalories = 
    (mealPlan.breakfast?.calories || 0) +
    (mealPlan.lunch?.calories || 0) +
    (mealPlan.dinner?.calories || 0) +
    (mealPlan.snacks?.reduce((sum, snack) => sum + snack.calories, 0) || 0);

  // Calculate total protein
  const totalProtein =
    (mealPlan.breakfast?.protein || 0) +
    (mealPlan.lunch?.protein || 0) +
    (mealPlan.dinner?.protein || 0) +
    (mealPlan.snacks?.reduce((sum, snack) => sum + snack.protein, 0) || 0);

  // Calculate total carbs
  const totalCarbs =
    (mealPlan.breakfast?.carbs || 0) +
    (mealPlan.lunch?.carbs || 0) +
    (mealPlan.dinner?.carbs || 0) +
    (mealPlan.snacks?.reduce((sum, snack) => sum + snack.carbs, 0) || 0);

  // Calculate total fat
  const totalFat =
    (mealPlan.breakfast?.fat || 0) +
    (mealPlan.lunch?.fat || 0) +
    (mealPlan.dinner?.fat || 0) +
    (mealPlan.snacks?.reduce((sum, snack) => sum + snack.fat, 0) || 0);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="font-semibold text-lg text-gray-800 mb-4">Nutrition Summary</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <p className="text-sm text-gray-500 mb-1">Calories</p>
          <p className="text-xl font-semibold">
            {totalCalories} <span className="text-sm text-gray-500">kcal</span>
          </p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <p className="text-sm text-gray-500 mb-1">Protein</p>
          <p className="text-xl font-semibold">
            {totalProtein} <span className="text-sm text-gray-500">g</span>
          </p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <p className="text-sm text-gray-500 mb-1">Carbs</p>
          <p className="text-xl font-semibold">
            {totalCarbs} <span className="text-sm text-gray-500">g</span>
          </p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <p className="text-sm text-gray-500 mb-1">Fat</p>
          <p className="text-xl font-semibold">
            {totalFat} <span className="text-sm text-gray-500">g</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NutritionSummary;
