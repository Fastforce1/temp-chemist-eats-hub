
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { Recipe } from '../types/recipe';

// Import the extracted components
import RecipeHeader from '../components/recipe/RecipeHeader';
import RecipeMeta from '../components/recipe/RecipeMeta';
import NutritionFacts from '../components/recipe/NutritionFacts';
import IngredientsList from '../components/recipe/IngredientsList';
import DirectionSteps from '../components/recipe/DirectionSteps';
import RatingSystem from '../components/recipe/RatingSystem';

// Import our custom hooks
import { useRecipe, getMockRecipe } from '../hooks/useRecipe';
import { useRecipeInteractions } from '../hooks/useRecipeInteractions';

const RecipeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Use our custom hook for fetching recipe data
  const { data, isLoading } = useRecipe(id);
  
  // Get recipe data from API or fall back to mock data
  const recipe: Recipe = data?.recipe || getMockRecipe(id) as Recipe;

  // Use our custom hook for recipe interactions
  const { 
    isSaved, 
    isLiked, 
    userRating,
    handleSave, 
    handleLike, 
    handlePrint, 
    handleShare,
    handleRating 
  } = useRecipeInteractions(recipe);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  // We'll always render content, either from the API or our mock data
  return (
    <div className="max-w-4xl mx-auto">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ChevronLeft className="w-5 h-5 mr-1" />
        Back to results
      </button>

      {/* Recipe content */}
      <div className="bg-white rounded-xl overflow-hidden shadow-lg mb-8">
        <RecipeHeader 
          recipe={recipe}
          isLiked={isLiked}
          isSaved={isSaved}
          onLike={handleLike}
          onSave={handleSave}
          onPrint={handlePrint}
          onShare={handleShare}
        />

        <div className="p-6">
          <RecipeMeta recipe={recipe} />
          <NutritionFacts nutrition={recipe.nutrition} />
          <RatingSystem userRating={userRating} onRating={handleRating} />
          <IngredientsList ingredients={recipe.ingredients} />
          <DirectionSteps directions={recipe.directions} />
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;
