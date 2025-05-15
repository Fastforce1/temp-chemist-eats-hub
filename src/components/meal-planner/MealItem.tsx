
import React from 'react';
import { Edit, Trash2 } from 'lucide-react';

interface Meal {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface MealItemProps {
  meal: Meal;
  onEdit?: () => void;
  onDelete?: () => void;
}

const MealItem: React.FC<MealItemProps> = ({ meal, onEdit, onDelete }) => {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex justify-between">
        <div>
          <h4 className="font-medium">{meal.name}</h4>
          <div className="flex mt-2 space-x-4 text-sm text-gray-500">
            <span>{meal.calories} cal</span>
            <span>{meal.protein}g protein</span>
            <span>{meal.carbs}g carbs</span>
            <span>{meal.fat}g fat</span>
          </div>
        </div>
        <div className="flex space-x-2">
          {onEdit && (
            <button 
              onClick={onEdit}
              className="p-1 text-gray-400 hover:text-gray-600"
            >
              <Edit className="w-4 h-4" />
            </button>
          )}
          {onDelete && (
            <button 
              onClick={onDelete}
              className="p-1 text-gray-400 hover:text-red-500"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MealItem;
