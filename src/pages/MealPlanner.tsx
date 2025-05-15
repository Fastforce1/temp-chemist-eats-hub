
import { useState } from 'react';
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

const MealPlanner = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showAddMealForm, setShowAddMealForm] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState('breakfast');

  // Function to get meal plan for current date
  const getCurrentMealPlan = (): DailyMealPlan => {
    const dateKey = getDateKey(currentDate);
    return mockMealPlan[dateKey as keyof typeof mockMealPlan] || getEmptyMealPlan();
  };

  const weekDates = getWeekDates(currentDate);
  const currentMealPlan = getCurrentMealPlan();

  // Function to navigate to previous week
  const goToPreviousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  // Function to navigate to next week
  const goToNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 7);
    setCurrentDate(newDate);
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
    <div className="space-y-8">
      <WeekDateSelector 
        weekDates={weekDates}
        currentDate={currentDate}
        setCurrentDate={setCurrentDate}
        goToPreviousWeek={goToPreviousWeek}
        goToNextWeek={goToNextWeek}
      />

      {/* Meal plan for selected date */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 bg-emerald-50 border-b border-emerald-100">
          <h2 className="font-semibold text-lg text-gray-800">
            {currentDate.toLocaleDateString('en-US', {
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
