
import React from 'react';
import { Plus } from 'lucide-react';
import MealItem from './MealItem';
import EmptyMeal from './EmptyMeal';

interface Meal {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface MealSectionProps {
  title: string;
  meal: Meal | null;
  onAddMeal: () => void;
  mealType: string;
}

const MealSection: React.FC<MealSectionProps> = ({ title, meal, onAddMeal, mealType }) => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium text-gray-800">{title}</h3>
        <button
          onClick={onAddMeal}
          className="text-emerald-600 hover:text-emerald-700 text-sm font-medium flex items-center"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add {title}
        </button>
      </div>

      {meal ? (
        <MealItem meal={meal} />
      ) : (
        <EmptyMeal mealType={mealType.toLowerCase()} onAddMeal={onAddMeal} />
      )}
    </div>
  );
};

export default MealSection;
