import React, { useState } from 'react';
import { Calendar, Filter, Plus } from 'lucide-react';
import RecipeCard from '../components/recipes/RecipeCard';
import type { Recipe } from '../types';
import WeekDateSelector from '../components/meal-planner/WeekDateSelector';
import MealSection from '../components/meal-planner/MealSection';
import SnacksSection from '../components/meal-planner/SnacksSection';
import NutritionSummary from '../components/meal-planner/NutritionSummary';
import AddMealForm from '../components/meal-planner/AddMealForm';
import { 
  getDateKey, 
  getWeekDates, 
  mockMealPlan, 
  getEmptyMealPlan,
  DailyMealPlan
} from '../components/meal-planner/mealPlannerUtils';

const MOCK_RECIPES: Recipe[] = [
  {
    id: '1',
    name: 'Quinoa Buddha Bowl',
    description: 'A nutritious bowl packed with protein-rich quinoa, roasted vegetables, and tahini dressing',
    ingredients: [],
    instructions: [],
    prepTime: 15,
    cookTime: 25,
    servings: 2,
    nutrients: {
      calories: 450,
      protein: 15,
      carbs: 65,
      fat: 18,
      micronutrients: {}
    },
    image: '/mock/buddha-bowl.jpg',
    tags: ['Vegetarian', 'High Protein', 'Gluten Free']
  },
  // Add more mock recipes as needed
];

const MealPlanner: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [showAddMealForm, setShowAddMealForm] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState('breakfast');

  const handleRecipeSelect = (recipe: Recipe) => {
    console.log('Selected recipe:', recipe);
    // Implement recipe selection logic
  };

  // Function to get meal plan for current date
  const getCurrentMealPlan = (): DailyMealPlan => {
    const dateKey = getDateKey(selectedDate);
    return mockMealPlan[dateKey as keyof typeof mockMealPlan] || getEmptyMealPlan();
  };

  const weekDates = getWeekDates(selectedDate);
  const currentMealPlan = getCurrentMealPlan();

  // Function to navigate to previous week
  const goToPreviousWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() - 7);
    setSelectedDate(newDate);
  };

  // Function to navigate to next week
  const goToNextWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + 7);
    setSelectedDate(newDate);
  };

  // Handler for showing add meal form
  const handleShowAddMealForm = (mealType: string) => {
    setSelectedMealType(mealType);
    setShowAddMealForm(true);
  };

  // Mock function to add a meal
  const handleAddMeal = (e: React.FormEvent) => {
    e.preventDefault();
    // Would implement actual meal adding logic here
    setShowAddMealForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Meal Planner</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
          <Plus className="w-5 h-5 mr-2" />
          Add Custom Recipe
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium text-gray-900">
                Recommended Recipes
              </h2>
              <button className="flex items-center text-gray-500 hover:text-gray-700">
                <Filter className="w-5 h-5 mr-2" />
                Filter
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {MOCK_RECIPES.map(recipe => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onSelect={handleRecipeSelect}
                />
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Nutrient Goals Progress
            </h2>
            <div className="space-y-4">
              {['Protein', 'Carbs', 'Fats', 'Fiber'].map(nutrient => (
                <div key={nutrient} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">{nutrient}</span>
                    <span className="font-medium">70%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full">
                    <div
                      className="h-2 bg-blue-500 rounded-full"
                      style={{ width: '70%' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium text-gray-900">Meal Schedule</h2>
            <button className="text-blue-600 hover:text-blue-700">
              <Calendar className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            {['Breakfast', 'Lunch', 'Dinner', 'Snacks'].map(mealTime => (
              <div
                key={mealTime}
                className="p-4 border border-dashed border-gray-300 rounded-lg"
              >
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  {mealTime}
                </h3>
                <button className="flex items-center text-blue-600 hover:text-blue-700 text-sm">
                  <Plus className="w-4 h-4 mr-1" />
                  Add Meal
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <WeekDateSelector 
        weekDates={weekDates}
        currentDate={selectedDate}
        setCurrentDate={setSelectedDate}
        goToPreviousWeek={goToPreviousWeek}
        goToNextWeek={goToNextWeek}
      />

      {/* Meal plan for selected date */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 bg-emerald-50 border-b border-emerald-100">
          <h2 className="font-semibold text-lg text-gray-800">
            {selectedDate.toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </h2>
        </div>

        <div className="divide-y divide-gray-100">
          <MealSection
            title="Breakfast"
            meal={currentMealPlan.breakfast}
            onAddMeal={() => handleShowAddMealForm('breakfast')}
            mealType="Breakfast"
          />

          <MealSection
            title="Lunch"
            meal={currentMealPlan.lunch}
            onAddMeal={() => handleShowAddMealForm('lunch')}
            mealType="Lunch"
          />

          <MealSection
            title="Dinner"
            meal={currentMealPlan.dinner}
            onAddMeal={() => handleShowAddMealForm('dinner')}
            mealType="Dinner"
          />

          <SnacksSection
            snacks={currentMealPlan.snacks}
            onAddSnack={() => handleShowAddMealForm('snack')}
          />
        </div>
      </div>

      <NutritionSummary mealPlan={currentMealPlan} />

      {/* Add Meal Modal */}
      {showAddMealForm && (
        <AddMealForm
          selectedMealType={selectedMealType}
          onClose={() => setShowAddMealForm(false)}
          onSubmit={handleAddMeal}
        />
      )}
    </div>
  );
};

export default MealPlanner;
