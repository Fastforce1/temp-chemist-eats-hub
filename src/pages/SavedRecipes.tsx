import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Folder, Grid, List, Search, Filter, ChevronDown } from 'lucide-react';
import RecipeCard from '../components/recipe/RecipeCard';

const SavedRecipes = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [activeCollection, setActiveCollection] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data for collections
  const collections = [
    { id: 'favorites', name: 'Favorites', count: 12 },
    { id: 'breakfast', name: 'Breakfast Ideas', count: 8 },
    { id: 'lunch', name: 'Quick Lunches', count: 5 },
    { id: 'dinner', name: 'Healthy Dinners', count: 7 },
    { id: 'desserts', name: 'Desserts', count: 3 },
  ];

  // Mock data for saved recipes
  const savedRecipes = [
    {
      id: '1',
      name: 'Green Smoothie Bowl',
      description: 'A nutrient-packed smoothie bowl with fresh fruits and superfoods.',
      image: 'https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg',
      calories: 420,
      cookTime: 15,
      servings: 2,
      collections: ['favorites', 'breakfast'],
    },
    {
      id: '2',
      name: 'Fresh Mediterranean Salad',
      description: 'Fresh and vibrant salad with chickpeas, cucumber, tomatoes, and feta cheese.',
      image: 'https://images.pexels.com/photos/1211887/pexels-photo-1211887.jpeg',
      calories: 320,
      cookTime: 20,
      servings: 4,
      collections: ['favorites', 'lunch'],
    },
    {
      id: '3',
      name: 'Colorful Buddha Bowl',
      description: 'Protein-rich quinoa with colorful roasted vegetables and tahini dressing.',
      image: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg',
      calories: 380,
      cookTime: 30,
      servings: 3,
      collections: ['dinner'],
    },
    {
      id: '4',
      name: 'Classic Blueberry Pancakes',
      description: 'Fluffy homemade pancakes topped with fresh blueberries and maple syrup.',
      image: 'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg',
      calories: 450,
      cookTime: 25,
      servings: 2,
      collections: ['favorites', 'breakfast'],
    },
    {
      id: '5',
      name: 'Grilled Salmon & Vegetables',
      description: 'Omega-3 rich salmon fillet with grilled asparagus and lemon.',
      image: 'https://images.pexels.com/photos/3655916/pexels-photo-3655916.jpeg',
      calories: 520,
      cookTime: 35,
      servings: 2,
      collections: ['favorites', 'dinner'],
    },
    {
      id: '6',
      name: 'Vegetarian Street Tacos',
      description: 'Mexican-inspired tacos with roasted vegetables, black beans, and fresh toppings.',
      image: 'https://images.pexels.com/photos/2092507/pexels-photo-2092507.jpeg',
      calories: 380,
      cookTime: 40,
      servings: 4,
      collections: ['lunch', 'dinner'],
    },
  ];

  // Filter recipes based on active collection and search query
  const filteredRecipes = savedRecipes.filter((recipe) => {
    const matchesCollection = !activeCollection || recipe.collections.includes(activeCollection);
    const matchesSearch = !searchQuery || 
      recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      recipe.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCollection && matchesSearch;
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is already handled via the filteredRecipes
  };

  const handleCollectionClick = (collectionId: string) => {
    if (activeCollection === collectionId) {
      setActiveCollection(null); // Deselect if already selected
    } else {
      setActiveCollection(collectionId);
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Saved Recipes</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Collections sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">Collections</h2>
              <button className="text-emerald-600 hover:text-emerald-700">
                <Plus className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-1">
              <button
                onClick={() => setActiveCollection(null)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg ${
                  activeCollection === null
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <div className="flex items-center">
                  <Folder className="h-5 w-5 mr-2" />
                  <span>All Recipes</span>
                </div>
                <span className="text-sm text-gray-500">{savedRecipes.length}</span>
              </button>

              {collections.map((collection) => (
                <button
                  key={collection.id}
                  onClick={() => handleCollectionClick(collection.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg ${
                    activeCollection === collection.id
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <div className="flex items-center">
                    <Folder className="h-5 w-5 mr-2" />
                    <span>{collection.name}</span>
                  </div>
                  <span className="text-sm text-gray-500">{collection.count}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Recipe grid */}
        <div className="lg:col-span-3">
          {/* Search and filter */}
          <div className="mb-6">
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search saved recipes..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Filter className="h-5 w-5 mr-1" />
                Filters
                <ChevronDown
                  className={`h-4 w-4 ml-1 transition-transform ${
                    showFilters ? 'transform rotate-180' : ''
                  }`}
                />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-2 border rounded-lg ${
                  viewMode === 'grid'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                    : 'border-gray-300 text-gray-500 hover:bg-gray-50'
                }`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-2 border rounded-lg ${
                  viewMode === 'list'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                    : 'border-gray-300 text-gray-500 hover:bg-gray-50'
                }`}
              >
                <List className="h-5 w-5" />
              </button>
            </form>

            {/* Filters panel */}
            {showFilters && (
              <div className="mt-3 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Meal Type
                    </label>
                    <select className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500">
                      <option value="">Any</option>
                      <option value="breakfast">Breakfast</option>
                      <option value="lunch">Lunch</option>
                      <option value="dinner">Dinner</option>
                      <option value="snack">Snack</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Cook Time
                    </label>
                    <select className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500">
                      <option value="">Any</option>
                      <option value="15">15 minutes</option>
                      <option value="30">30 minutes</option>
                      <option value="45">45 minutes</option>
                      <option value="60">60 minutes</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Diet Type
                    </label>
                    <select className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500">
                      <option value="">Any</option>
                      <option value="vegetarian">Vegetarian</option>
                      <option value="vegan">Vegan</option>
                      <option value="gluten-free">Gluten-Free</option>
                      <option value="keto">Keto</option>
                      <option value="paleo">Paleo</option>
                    </select>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <button className="text-sm font-medium text-gray-500 hover:text-gray-700 mr-4">
                    Reset
                  </button>
                  <button className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 text-sm font-medium">
                    Apply Filters
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Collection title */}
          {activeCollection && (
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                {collections.find((c) => c.id === activeCollection)?.name}
              </h2>
              <p className="text-gray-500">
                {filteredRecipes.length} recipes in this collection
              </p>
            </div>
          )}

          {/* Recipe display */}
          {filteredRecipes.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <img
                src="https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg"
                alt="Empty collection"
                className="w-32 h-32 mx-auto rounded-full object-cover mb-4 opacity-50"
              />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No recipes found</h3>
              <p className="text-gray-500 mb-6">
                {activeCollection
                  ? "You haven't added any recipes to this collection yet."
                  : searchQuery
                  ? "No recipes match your search criteria."
                  : "You haven't saved any recipes yet."}
              </p>
              <button
                onClick={() => navigate('/search')}
                className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
              >
                Find Recipes
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onClick={() => navigate(`/recipe/${recipe.id}`)}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {filteredRecipes.map((recipe, index) => (
                <div
                  key={recipe.id}
                  className={`flex p-4 hover:bg-gray-50 cursor-pointer ${
                    index !== filteredRecipes.length - 1 ? 'border-b border-gray-200' : ''
                  }`}
                  onClick={() => navigate(`/recipe/${recipe.id}`)}
                >
                  <img
                    src={recipe.image}
                    alt={recipe.name}
                    className="w-20 h-20 object-cover rounded-md mr-4"
                  />
                  <div className="flex-grow">
                    <h3 className="font-medium text-gray-900">{recipe.name}</h3>
                    <p className="text-gray-500 text-sm line-clamp-1">{recipe.description}</p>
                    <div className="flex items-center mt-2 text-gray-500 text-xs">
                      <span className="mr-3">{recipe.calories} cal</span>
                      <span className="mr-3">{recipe.cookTime} min</span>
                      <span>{recipe.servings} servings</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SavedRecipes;