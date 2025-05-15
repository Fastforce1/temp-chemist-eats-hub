import React from 'react';
import { Clock, Users, ChevronRight } from 'lucide-react';
import type { Recipe } from '../../types';

interface RecipeCardProps {
  recipe: Recipe;
  showNutrients?: boolean;
  onSelect?: (recipe: Recipe) => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  showNutrients = true,
  onSelect
}) => {
  const {
    name,
    description,
    prepTime,
    cookTime,
    servings,
    nutrients,
    image
  } = recipe;

  const totalTime = prepTime + cookTime;

  return (
    <div 
      className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onSelect?.(recipe)}
    >
      <div className="relative h-48">
        <img
          src={image || '/placeholder-recipe.jpg'}
          alt={name}
          className="w-full h-full object-cover"
        />
        {showNutrients && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
            <div className="flex justify-between text-white text-sm">
              <span>{nutrients.calories} kcal</span>
              <span>{nutrients.protein}g protein</span>
              <span>{nutrients.carbs}g carbs</span>
              <span>{nutrients.fat}g fat</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-gray-900">{name}</h3>
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
              {description}
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
        </div>

        <div className="flex items-center mt-4 text-sm text-gray-500 space-x-4">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            <span>{totalTime} min</span>
          </div>
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-1" />
            <span>{servings} servings</span>
          </div>
        </div>

        {recipe.tags && recipe.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {recipe.tags.map(tag => (
              <span
                key={tag}
                className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeCard; 