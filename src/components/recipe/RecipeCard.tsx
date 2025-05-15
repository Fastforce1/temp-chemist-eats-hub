
import React from 'react';
import { Clock, Users, Bookmark } from 'lucide-react';

interface RecipeCardProps {
  recipe: {
    id: string;
    name: string;
    description?: string;
    image: string;
    calories?: number;
    cookTime?: number;
    servings?: number;
    // FatSecret API specific fields
    recipe_id?: string;
    recipe_name?: string;
    recipe_description?: string;
    recipe_image?: string;
    cooking_time_min?: string;
    serving_sizes?: {
      serving_size: string;
      calories: string;
      number_of_units: string;
    }[];
  };
  onClick: () => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onClick }) => {
  // Ensure we consistently use the same field, prioritizing recipe_name/recipe_description from API
  // or falling back to name/description from mock data
  const displayName = recipe.recipe_name || recipe.name || 'Recipe Name';
  const displayDescription = recipe.recipe_description || recipe.description || '';
  const displayImage = recipe.recipe_image || recipe.image || 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg';
  
  // Parse numeric values properly
  const cookTime = recipe.cookTime || (recipe.cooking_time_min ? parseInt(recipe.cooking_time_min) : undefined);
  const calories = recipe.calories || (recipe.serving_sizes?.[0]?.calories ? parseInt(recipe.serving_sizes[0].calories) : undefined);
  const servings = recipe.servings || (recipe.serving_sizes?.[0]?.number_of_units ? parseInt(recipe.serving_sizes[0].number_of_units) : undefined);
  
  const [isSaved, setIsSaved] = React.useState(false);

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSaved(!isSaved);
    // Would implement actual saving logic here
  };

  return (
    <div 
      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer group"
      onClick={onClick}
    >
      <div className="relative">
        <img 
          src={displayImage} 
          alt={displayName}
          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 right-3">
          <button 
            onClick={handleSave}
            className={`p-2 rounded-full ${isSaved ? 'bg-emerald-500 text-white' : 'bg-white/80 text-gray-700 hover:bg-white'} transition-colors duration-200`}
          >
            <Bookmark className={`h-5 w-5 ${isSaved ? 'fill-white' : ''}`} />
          </button>
        </div>
        {calories && (
          <div className="absolute bottom-3 left-3 bg-black/70 text-white text-sm font-medium px-2 py-1 rounded-lg">
            {calories} cal
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1 text-gray-900 line-clamp-1">{displayName}</h3>
        
        {displayDescription && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{displayDescription}</p>
        )}
        
        <div className="flex items-center text-gray-500 text-sm mt-2">
          {cookTime && (
            <div className="flex items-center mr-4">
              <Clock className="w-4 h-4 mr-1" />
              <span>{cookTime} min</span>
            </div>
          )}
          
          {servings && (
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              <span>{servings} {parseInt(String(servings)) === 1 ? 'serving' : 'servings'}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
