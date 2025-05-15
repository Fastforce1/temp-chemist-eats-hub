
import React from 'react';
import { Share2, Heart, Bookmark, Printer } from 'lucide-react';
import { Recipe } from '../../types/recipe';

interface RecipeHeaderProps {
  recipe: Recipe;
  isLiked: boolean;
  isSaved: boolean;
  onLike: () => void;
  onSave: () => void;
  onPrint: () => void;
  onShare: () => void;
}

const RecipeHeader: React.FC<RecipeHeaderProps> = ({
  recipe,
  isLiked,
  isSaved,
  onLike,
  onSave,
  onPrint,
  onShare
}) => {
  return (
    <div className="relative">
      <img
        src={recipe.image}
        alt={recipe.name}
        className="w-full h-80 object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
      <div className="absolute bottom-0 left-0 p-6">
        <h1 className="text-3xl font-bold text-white mb-2">{recipe.name}</h1>
        <p className="text-white/90 text-lg max-w-2xl">{recipe.description}</p>
      </div>
      <div className="absolute top-4 right-4 flex gap-2">
        <button
          onClick={onSave}
          className={`p-2 rounded-lg ${
            isSaved ? 'bg-emerald-500 text-white' : 'bg-white/80 text-gray-700 hover:bg-white'
          } transition-colors`}
          title="Save Recipe"
        >
          <Bookmark className="w-5 h-5" />
        </button>
        <button
          onClick={onLike}
          className={`p-2 rounded-lg ${
            isLiked ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-700 hover:bg-white'
          } transition-colors`}
          title="Like Recipe"
        >
          <Heart className="w-5 h-5" />
        </button>
        <button
          onClick={onShare}
          className="p-2 rounded-lg bg-white/80 text-gray-700 hover:bg-white transition-colors"
          title="Share Recipe"
        >
          <Share2 className="w-5 h-5" />
        </button>
        <button
          onClick={onPrint}
          className="p-2 rounded-lg bg-white/80 text-gray-700 hover:bg-white transition-colors"
          title="Print Recipe"
        >
          <Printer className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default RecipeHeader;
