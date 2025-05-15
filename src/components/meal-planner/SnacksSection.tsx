
import React from 'react';
import { Plus } from 'lucide-react';
import MealItem from './MealItem';
import EmptyMeal from './EmptyMeal';

interface Snack {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface SnacksSectionProps {
  snacks: Snack[];
  onAddSnack: () => void;
}

const SnacksSection: React.FC<SnacksSectionProps> = ({ snacks, onAddSnack }) => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium text-gray-800">Snacks</h3>
        <button
          onClick={onAddSnack}
          className="text-emerald-600 hover:text-emerald-700 text-sm font-medium flex items-center"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Snack
        </button>
      </div>

      {snacks && snacks.length > 0 ? (
        <div className="space-y-3">
          {snacks.map((snack, index) => (
            <MealItem key={index} meal={snack} />
          ))}
        </div>
      ) : (
        <EmptyMeal mealType="snacks" onAddMeal={onAddSnack} />
      )}
    </div>
  );
};

export default SnacksSection;
