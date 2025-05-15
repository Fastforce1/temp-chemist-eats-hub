
import React from 'react';
import { Flame, Beef, Droplet, Scale } from 'lucide-react';
import { Nutrition } from '../../types/recipe';

interface NutritionFactsProps {
  nutrition: Nutrition;
}

const NutritionFacts: React.FC<NutritionFactsProps> = ({ nutrition }) => {
  return (
    <div className="bg-gray-50 rounded-lg p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4">Nutrition Facts</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="flex flex-col items-center p-3 bg-white rounded-lg shadow-sm">
          <Flame className="w-6 h-6 text-orange-500 mb-1" />
          <span className="text-sm text-gray-500">Calories</span>
          <span className="font-semibold">{nutrition.calories} kcal</span>
        </div>
        <div className="flex flex-col items-center p-3 bg-white rounded-lg shadow-sm">
          <Beef className="w-6 h-6 text-red-500 mb-1" />
          <span className="text-sm text-gray-500">Protein</span>
          <span className="font-semibold">{nutrition.protein}g</span>
        </div>
        <div className="flex flex-col items-center p-3 bg-white rounded-lg shadow-sm">
          <Droplet className="w-6 h-6 text-yellow-500 mb-1" />
          <span className="text-sm text-gray-500">Fat</span>
          <span className="font-semibold">{nutrition.fat}g</span>
        </div>
        <div className="flex flex-col items-center p-3 bg-white rounded-lg shadow-sm">
          <Scale className="w-6 h-6 text-blue-500 mb-1" />
          <span className="text-sm text-gray-500">Carbs</span>
          <span className="font-semibold">{nutrition.carbs}g</span>
        </div>
      </div>
    </div>
  );
};

export default NutritionFacts;
