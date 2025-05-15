
import { useState } from 'react';
import { toast } from 'react-toastify';
import { Recipe } from '../types/recipe';

/**
 * Custom hook for handling recipe interactions like liking, saving, sharing, printing and rating
 */
export const useRecipeInteractions = (recipe: Recipe) => {
  const [isSaved, setIsSaved] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [userRating, setUserRating] = useState<number | null>(null);

  // Handle save action
  const handleSave = () => {
    setIsSaved(!isSaved);
    toast.success(isSaved ? 'Recipe removed from saved items' : 'Recipe saved to your collection', {
      position: "bottom-right",
      autoClose: 2000,
    });
  };

  // Handle like action
  const handleLike = () => {
    setIsLiked(!isLiked);
    toast.success(isLiked ? 'Removed from favorites' : 'Added to favorites', {
      position: "bottom-right", 
      autoClose: 2000,
    });
  };

  // Handle print action
  const handlePrint = () => {
    window.print();
  };

  // Handle share action
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: recipe.name,
        text: recipe.description,
        url: window.location.href
      }).catch((error) => console.log('Error sharing', error));
    } else {
      toast.info('Share feature is not supported on this browser', {
        position: "bottom-right"
      });
    }
  };

  // Handle rating action
  const handleRating = (rating: number) => {
    setUserRating(rating);
    toast.success(`You rated this recipe ${rating} stars!`, {
      position: "bottom-right",
      autoClose: 2000,
    });
  };

  return {
    isSaved,
    isLiked,
    userRating,
    handleSave,
    handleLike,
    handlePrint,
    handleShare,
    handleRating
  };
};

export default useRecipeInteractions;
