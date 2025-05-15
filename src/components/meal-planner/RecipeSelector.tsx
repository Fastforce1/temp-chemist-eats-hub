import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import type { Recipe } from '../../types';

interface RecipeSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (recipe: Recipe) => void;
}

const MOCK_RECIPES: Recipe[] = [
  {
    id: '1',
    name: 'Quinoa Buddha Bowl',
    description: 'A nutritious bowl packed with protein-rich quinoa, roasted vegetables, and tahini dressing',
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
    prepTime: 15,
    cookTime: 25,
    servings: 2,
    calories: 450,
    protein: 15,
    carbs: 65,
    fat: 18,
    ingredients: ['quinoa', 'sweet potato', 'chickpeas', 'kale', 'tahini'],
    instructions: ['Cook quinoa', 'Roast vegetables', 'Make dressing', 'Assemble bowl'],
    tags: ['Vegetarian', 'High Protein', 'Gluten Free']
  },
  // Add more mock recipes
];

const RecipeSelector: React.FC<RecipeSelectorProps> = ({ isOpen, onClose, onSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  if (!isOpen) return null;

  const filteredRecipes = MOCK_RECIPES.filter(recipe => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTags = selectedTags.length === 0 ||
      selectedTags.every(tag => recipe.tags.includes(tag));

    return matchesSearch && matchesTags;
  });

  const allTags = Array.from(
    new Set(MOCK_RECIPES.flatMap(recipe => recipe.tags))
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <div className="absolute right-0 top-0 h-full w-full max-w-2xl">
        <div className="flex h-full flex-col bg-white shadow-xl">
          <div className="flex items-center justify-between px-4 py-6 sm:px-6">
            <h2 className="text-lg font-medium text-gray-900">
              Select Recipe
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
            <div className="space-y-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search recipes..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Filter by Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {allTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => setSelectedTags(prev =>
                        prev.includes(tag)
                          ? prev.filter(t => t !== tag)
                          : [...prev, tag]
                      )}
                      className={`px-3 py-1 rounded-full text-sm ${
                        selectedTags.includes(tag)
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {filteredRecipes.map(recipe => (
                  <button
                    key={recipe.id}
                    onClick={() => onSelect(recipe)}
                    className="flex items-center p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <img
                      src={recipe.image}
                      alt={recipe.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="ml-4 text-left">
                      <h3 className="font-medium text-gray-900">{recipe.name}</h3>
                      <p className="text-sm text-gray-500 line-clamp-2">{recipe.description}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {recipe.tags.map(tag => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeSelector; 