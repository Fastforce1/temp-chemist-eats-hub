
import React from 'react';
import { Clock, Users, Flame } from 'lucide-react';
import { Recipe } from '../../types/recipe';

interface RecipeMetaProps {
  recipe: Recipe;
}

const RecipeMeta: React.FC<RecipeMetaProps> = ({ recipe }) => {
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap gap-6">
          <div className="flex items-center">
            <Clock className="w-5 h-5 text-emerald-500 mr-2" />
            <div>
              <p className="text-sm text-gray-500">Total Time</p>
              <p className="font-medium">{recipe.totalTime} min</p>
            </div>
          </div>
          <div className="flex items-center">
            <Users className="w-5 h-5 text-emerald-500 mr-2" />
            <div>
              <p className="text-sm text-gray-500">Servings</p>
              <p className="font-medium">{recipe.servings}</p>
            </div>
          </div>
          <div className="flex items-center">
            <Flame className="w-5 h-5 text-emerald-500 mr-2" />
            <div>
              <p className="text-sm text-gray-500">Calories</p>
              <p className="font-medium">{recipe.nutrition.calories} kcal</p>
            </div>
          </div>
        </div>
      </div>
      
      {recipe.tags && (
        <div className="flex flex-wrap gap-2 mb-6">
          {recipe.tags.map((tag: string, index: number) => (
            <span
              key={index}
              className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium"
            >
              {tag}
            </span>
          ))}
          <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
            {recipe.difficulty}
          </span>
        </div>
      )}
    </>
  );
};

export default RecipeMeta;
