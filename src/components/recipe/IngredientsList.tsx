
import React from 'react';

interface IngredientsListProps {
  ingredients: string[];
}

const IngredientsList: React.FC<IngredientsListProps> = ({ ingredients }) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Ingredients</h2>
      <ul className="space-y-2">
        {ingredients.map((ingredient: string, index: number) => (
          <li key={index} className="flex items-start">
            <span className="inline-block bg-emerald-200 rounded-full w-2 h-2 mt-2 mr-2"></span>
            {ingredient}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default IngredientsList;
