import React, { useState } from 'react';
import { format, addDays, startOfWeek } from 'date-fns';
import { Calendar, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import type { MealType, MealPlan, PlannedMeal } from '../types/meal';
import type { Recipe } from '../types';
import RecipeSelector from '../components/meal-planner/RecipeSelector';

const MEAL_TYPES: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack'];

const MealPlanner: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isRecipeSelectorOpen, setIsRecipeSelectorOpen] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState<MealType | null>(null);
  const [mealPlan, setMealPlan] = useState<MealPlan>({
    id: '1',
    userId: '1',
    date: format(selectedDate, 'yyyy-MM-dd'),
    meals: {
      breakfast: [],
      lunch: [],
      dinner: [],
      snack: []
    },
    totalNutrients: {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0
    }
  });

  const weekDays = Array.from({ length: 7 }, (_, i) => 
    addDays(startOfWeek(selectedDate), i)
  );

  const handleAddMeal = (mealType: MealType) => {
    setSelectedMealType(mealType);
    setIsRecipeSelectorOpen(true);
  };

  const handleRecipeSelect = (recipe: Recipe) => {
    if (!selectedMealType) return;

    const newMeal: PlannedMeal = {
      id: Date.now().toString(),
      recipe,
      servings: 1
    };

    setMealPlan(prev => {
      const updatedMeals = {
        ...prev.meals,
        [selectedMealType]: [...prev.meals[selectedMealType], newMeal]
      };

      // Calculate new total nutrients
      const totalNutrients = {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0
      };

      Object.values(updatedMeals).flat().forEach(meal => {
        totalNutrients.calories += meal.recipe.calories * meal.servings;
        totalNutrients.protein += (meal.recipe.protein || 0) * meal.servings;
        totalNutrients.carbs += (meal.recipe.carbs || 0) * meal.servings;
        totalNutrients.fat += (meal.recipe.fat || 0) * meal.servings;
      });

      return {
        ...prev,
        meals: updatedMeals,
        totalNutrients
      };
    });

    setIsRecipeSelectorOpen(false);
    setSelectedMealType(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Meal Planner</h1>
        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-600 hover:text-gray-900">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-gray-600" />
            <span className="font-medium">{format(selectedDate, 'MMMM d, yyyy')}</span>
          </div>
          <button className="p-2 text-gray-600 hover:text-gray-900">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-4">
        {weekDays.map((day) => (
          <button
            key={day.toISOString()}
            onClick={() => setSelectedDate(day)}
            className={`p-4 rounded-lg text-center ${
              format(day, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
                ? 'bg-blue-50 text-blue-700'
                : 'bg-white hover:bg-gray-50'
            }`}
          >
            <div className="text-sm font-medium">{format(day, 'EEE')}</div>
            <div className="mt-1 text-lg">{format(day, 'd')}</div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          {MEAL_TYPES.map((type) => (
            <div key={type} className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium capitalize">{type}</h2>
                <button
                  onClick={() => handleAddMeal(type)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              
              {mealPlan.meals[type].length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No meals planned. Click + to add a meal.
                </div>
              ) : (
                <div className="space-y-4">
                  {mealPlan.meals[type].map((meal) => (
                    <div
                      key={meal.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <h3 className="font-medium">{meal.recipe.name}</h3>
                        <p className="text-sm text-gray-500">
                          {meal.servings} serving{meal.servings > 1 ? 's' : ''} •{' '}
                          {meal.recipe.calories} kcal
                        </p>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600">
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-medium mb-4">Daily Nutrition</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">Calories</p>
                  <p className="text-2xl font-semibold">{mealPlan.totalNutrients.calories}</p>
                </div>
                <div className="h-2 w-32 bg-gray-200 rounded-full">
                  <div
                    className="h-2 bg-blue-600 rounded-full"
                    style={{ width: `${(mealPlan.totalNutrients.calories / 2000) * 100}%` }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium">Protein</p>
                  <p className="text-lg">{mealPlan.totalNutrients.protein}g</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Carbs</p>
                  <p className="text-lg">{mealPlan.totalNutrients.carbs}g</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Fat</p>
                  <p className="text-lg">{mealPlan.totalNutrients.fat}g</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-medium mb-4">Suggested Recipes</h2>
            <div className="space-y-4">
              {/* Add suggested recipes here */}
              <div className="text-center py-8 text-gray-500">
                Recipe suggestions coming soon...
              </div>
            </div>
          </div>
        </div>
      </div>

      <RecipeSelector
        isOpen={isRecipeSelectorOpen}
        onClose={() => {
          setIsRecipeSelectorOpen(false);
          setSelectedMealType(null);
        }}
        onSelect={handleRecipeSelect}
      />
    </div>
  );
};

export default MealPlanner;
