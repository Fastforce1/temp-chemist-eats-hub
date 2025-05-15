
import React from 'react';
import { Calendar, Plus } from 'lucide-react';

interface EmptyMealProps {
  mealType: string;
  onAddMeal: () => void;
}

const EmptyMeal: React.FC<EmptyMealProps> = ({ mealType, onAddMeal }) => {
  return (
    <div className="text-center py-8 bg-gray-50 rounded-lg">
      <Calendar className="w-12 h-12 mx-auto text-gray-300" />
      <p className="mt-2 text-gray-500">No {mealType} planned</p>
      <button
        onClick={onAddMeal}
        className="mt-3 text-emerald-600 hover:text-emerald-700 font-medium text-sm inline-flex items-center"
      >
        <Plus className="w-4 h-4 mr-1" />
        Add meal
      </button>
    </div>
  );
};

export default EmptyMeal;
