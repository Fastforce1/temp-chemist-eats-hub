import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronDown, Filter } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { searchRecipes } from '../api/fatsecret';
import RecipeCard from '../components/recipe/RecipeCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { toast } from 'react-toastify';

interface FatSecretRecipe {
  recipe_id: string;
  recipe_name: string;
  recipe_description?: string;
  recipe_image?: string;
  cooking_time_min?: string;
  serving_sizes?: {
    serving_size: string;
    calories: string;
    number_of_units: string;
  }[];
}

interface FatSecretResponse {
  recipes?: {
    recipe: FatSecretRecipe[] | FatSecretRecipe;
    max_results?: string;
    total_results?: string;
    page_number?: string;
  };
}

// Mock recipe type
interface MockRecipe {
  id: string;
  name: string;
  description: string;
  image: string;
  calories: number;
  cookTime: number;
  servings: number;
}

const RecipeSearch = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentQuery, setCurrentQuery] = useState('');
  const [page, setPage] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  // Mock filters for now
  const [filters, setFilters] = useState({
    mealType: '',
    cuisine: '',
    dietaryRestrictions: [] as string[],
    maxCookTime: null as number | null,
    maxCalories: null as number | null,
  });

  const { data, isLoading, error, isError } = useQuery<FatSecretResponse>({
    queryKey: ['recipes', currentQuery, page],
    queryFn: () => searchRecipes(currentQuery, page),
    enabled: !!currentQuery,
    retry: 1,
  });

  // Handle API errors
  React.useEffect(() => {
    if (error) {
      console.error('Recipe search error:', error);
      toast.error('Failed to fetch recipes. Using demo data instead.');
    }
  }, [error]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setPage(0);
      setCurrentQuery(searchQuery.trim());
    }
  };

  const handleFilterToggle = () => {
    setShowFilters(!showFilters);
  };

  // Mock recipe data for display purposes
  const allMockRecipes: MockRecipe[] = [
    {
      id: '1',
      name: 'Green Smoothie Bowl',
      description: 'A nutrient-packed smoothie bowl with fresh fruits and superfoods.',
      image: 'https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg',
      calories: 420,
      cookTime: 15,
      servings: 2,
    },
    {
      id: '2',
      name: 'Fresh Mediterranean Salad',
      description: 'Fresh and vibrant salad with chickpeas, cucumber, tomatoes, and feta cheese.',
      image: 'https://images.pexels.com/photos/1211887/pexels-photo-1211887.jpeg',
      calories: 320,
      cookTime: 20,
      servings: 4,
    },
    {
      id: '3',
      name: 'Colorful Buddha Bowl',
      description: 'Protein-rich quinoa with colorful roasted vegetables and tahini dressing.',
      image: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg',
      calories: 380,
      cookTime: 30,
      servings: 3,
    },
    {
      id: '4',
      name: 'Classic Blueberry Pancakes',
      description: 'Fluffy homemade pancakes topped with fresh blueberries and maple syrup.',
      image: 'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg',
      calories: 450,
      cookTime: 25,
      servings: 2,
    },
    {
      id: '5',
      name: 'Grilled Salmon & Vegetables',
      description: 'Omega-3 rich salmon fillet with grilled asparagus and lemon.',
      image: 'https://images.pexels.com/photos/3655916/pexels-photo-3655916.jpeg',
      calories: 520,
      cookTime: 35,
      servings: 2,
    },
    {
      id: '6',
      name: 'Vegetarian Street Tacos',
      description: 'Mexican-inspired tacos with roasted vegetables, black beans, and fresh toppings.',
      image: 'https://images.pexels.com/photos/2092507/pexels-photo-2092507.jpeg',
      calories: 380,
      cookTime: 40,
      servings: 4,
    },
    // Add more mock recipes to ensure pagination
    {
      id: '7',
      name: 'Spicy Thai Noodle Soup',
      description: 'Aromatic and spicy Thai-style soup with rice noodles and fresh herbs.',
      image: 'https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg',
      calories: 410,
      cookTime: 45,
      servings: 4,
    },
    {
      id: '8',
      name: 'Quinoa Power Bowl',
      description: 'Protein-packed quinoa bowl with roasted chickpeas and avocado.',
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
      calories: 440,
      cookTime: 30,
      servings: 2,
    },
    {
      id: '9',
      name: 'Homemade Pizza Margherita',
      description: 'Classic Italian pizza with fresh mozzarella, tomatoes, and basil.',
      image: 'https://images.pexels.com/photos/825661/pexels-photo-825661.jpeg',
      calories: 550,
      cookTime: 45,
      servings: 4,
    },
    {
      id: '10',
      name: 'Chicken Stir-Fry',
      description: 'Quick and healthy stir-fried chicken with colorful vegetables.',
      image: 'https://images.pexels.com/photos/262897/pexels-photo-262897.jpeg',
      calories: 380,
      cookTime: 25,
      servings: 3,
    },
    {
      id: '11',
      name: 'Vegetarian Lentil Curry',
      description: 'Hearty and spiced Indian-style lentil curry with rice.',
      image: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg',
      calories: 340,
      cookTime: 35,
      servings: 4,
    },
    {
      id: '12',
      name: 'Breakfast Oatmeal Bowl',
      description: 'Creamy oatmeal topped with fresh berries, nuts, and honey.',
      image: 'https://images.pexels.com/photos/1374551/pexels-photo-1374551.jpeg',
      calories: 310,
      cookTime: 15,
      servings: 1,
    },
    {
      id: '13',
      name: 'Grilled Chicken Caesar Salad',
      description: 'Classic Caesar salad with grilled chicken and homemade dressing.',
      image: 'https://images.pexels.com/photos/1059905/pexels-photo-1059905.jpeg',
      calories: 420,
      cookTime: 30,
      servings: 2,
    },
    {
      id: '14',
      name: 'Shrimp Pasta Alfredo',
      description: 'Creamy pasta with garlic shrimp and parmesan cheese.',
      image: 'https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg',
      calories: 580,
      cookTime: 35,
      servings: 3,
    },
    {
      id: '15',
      name: 'Vegetable Sushi Rolls',
      description: 'Fresh vegetable sushi rolls with avocado and cucumber.',
      image: 'https://images.pexels.com/photos/357756/pexels-photo-357756.jpeg',
      calories: 280,
      cookTime: 45,
      servings: 4,
    },
    {
      id: '16',
      name: 'Black Bean Tacos',
      description: 'Vegetarian tacos with spiced black beans and fresh toppings.',
      image: 'https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg',
      calories: 340,
      cookTime: 25,
      servings: 3,
    },
    {
      id: '17',
      name: 'Keto Cauliflower Rice Bowl',
      description: 'Low-carb cauliflower rice with grilled chicken and avocado. Perfect for keto diet.',
      image: 'https://images.pexels.com/photos/1410235/pexels-photo-1410235.jpeg',
      calories: 320,
      cookTime: 25,
      servings: 2,
    },
    {
      id: '18',
      name: 'Meal Prep Chicken Burrito Bowls',
      description: 'Make-ahead burrito bowls with chicken, rice, beans, and fresh vegetables. Perfect for weekly meal prep.',
      image: 'https://images.pexels.com/photos/1640773/pexels-photo-1640773.jpeg',
      calories: 450,
      cookTime: 45,
      servings: 4,
    },
    {
      id: '19',
      name: 'Quick 15-Minute Pad Thai',
      description: 'Fast and easy Thai-style noodles with shrimp, tofu, and peanuts. Ready in just 15 minutes!',
      image: 'https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg',
      calories: 380,
      cookTime: 15,
      servings: 2,
    },
    {
      id: '20',
      name: 'Budget-Friendly Bean Chili',
      description: 'Hearty and affordable vegetarian chili with three types of beans. Great for feeding a crowd on a budget.',
      image: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg',
      calories: 290,
      cookTime: 40,
      servings: 6,
    },
    {
      id: '21',
      name: 'Gluten-Free Banana Pancakes',
      description: 'Light and fluffy gluten-free pancakes made with ripe bananas and almond flour.',
      image: 'https://images.pexels.com/photos/1546890/pexels-photo-1546890.jpeg',
      calories: 280,
      cookTime: 20,
      servings: 2,
    },
    {
      id: '22',
      name: 'Vegan Buddha Bowl',
      description: '100% plant-based bowl with quinoa, roasted vegetables, and tahini dressing.',
      image: 'https://images.pexels.com/photos/1683545/pexels-photo-1683545.jpeg',
      calories: 340,
      cookTime: 35,
      servings: 2,
    },
    {
      id: '23',
      name: 'Classic Beef Stew',
      description: 'Hearty beef stew with tender meat, potatoes, and vegetables in rich gravy.',
      image: 'https://images.pexels.com/photos/539451/pexels-photo-539451.jpeg',
      calories: 520,
      cookTime: 120,
      servings: 6,
    },
    {
      id: '24',
      name: 'Mediterranean Grilled Chicken',
      description: 'Herb-marinated chicken with Greek salad and tzatziki sauce.',
      image: 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg',
      calories: 420,
      cookTime: 40,
      servings: 4,
    },
    {
      id: '25',
      name: 'Seafood Paella',
      description: 'Spanish-style rice dish with mixed seafood, saffron, and vegetables.',
      image: 'https://images.pexels.com/photos/725991/pexels-photo-725991.jpeg',
      calories: 580,
      cookTime: 55,
      servings: 6,
    },
    {
      id: '26',
      name: 'Fresh Spring Rolls',
      description: 'Vietnamese-style spring rolls with shrimp, vegetables, and peanut sauce.',
      image: 'https://images.pexels.com/photos/2092507/pexels-photo-2092507.jpeg',
      calories: 240,
      cookTime: 30,
      servings: 4,
    },
    {
      id: '27',
      name: 'Creamy Tomato Soup',
      description: 'Homemade tomato soup with fresh basil and cream. Perfect with grilled cheese.',
      image: 'https://images.pexels.com/photos/539451/pexels-photo-539451.jpeg',
      calories: 220,
      cookTime: 35,
      servings: 4,
    },
    {
      id: '28',
      name: 'Greek Salad',
      description: 'Traditional Greek salad with feta, olives, and red wine vinaigrette.',
      image: 'https://images.pexels.com/photos/1059905/pexels-photo-1059905.jpeg',
      calories: 280,
      cookTime: 15,
      servings: 4,
    },
    {
      id: '29',
      name: 'Homemade Fettuccine Alfredo',
      description: 'Classic Italian pasta in creamy parmesan sauce.',
      image: 'https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg',
      calories: 560,
      cookTime: 25,
      servings: 4,
    },
    {
      id: '30',
      name: 'Grilled Salmon with Asparagus',
      description: 'Fresh salmon fillet with grilled asparagus and lemon butter sauce.',
      image: 'https://images.pexels.com/photos/725991/pexels-photo-725991.jpeg',
      calories: 440,
      cookTime: 25,
      servings: 2,
    },
    {
      id: '31',
      name: 'Chicken Tikka Masala',
      description: 'Indian-style curry with tender chicken in creamy tomato sauce.',
      image: 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg',
      calories: 490,
      cookTime: 50,
      servings: 4,
    },
    {
      id: '32',
      name: 'Classic Chocolate Cake',
      description: 'Rich and moist chocolate cake with chocolate frosting.',
      image: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg',
      calories: 380,
      cookTime: 45,
      servings: 8,
    },
    {
      id: '33',
      name: 'Tropical Smoothie Bowl',
      description: 'Refreshing smoothie bowl with mango, pineapple, and coconut.',
      image: 'https://images.pexels.com/photos/1332267/pexels-photo-1332267.jpeg',
      calories: 290,
      cookTime: 10,
      servings: 1,
    },
    {
      id: '34',
      name: 'Meal Prep Breakfast Burritos',
      description: 'Make-ahead breakfast burritos with eggs, cheese, and vegetables.',
      image: 'https://images.pexels.com/photos/1640773/pexels-photo-1640773.jpeg',
      calories: 420,
      cookTime: 40,
      servings: 6,
    },
    {
      id: '35',
      name: 'Budget Lentil Curry',
      description: 'Economical and filling curry made with red lentils and aromatic spices.',
      image: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg',
      calories: 310,
      cookTime: 30,
      servings: 4,
    },
    {
      id: '36',
      name: 'Gluten-Free Pizza',
      description: 'Crispy gluten-free pizza crust with your favorite toppings.',
      image: 'https://images.pexels.com/photos/1546890/pexels-photo-1546890.jpeg',
      calories: 340,
      cookTime: 35,
      servings: 4,
    },
    {
      id: '37',
      name: 'Homemade Apple Pie',
      description: 'Classic apple pie with flaky crust and cinnamon-spiced filling. Perfect for any occasion.',
      image: 'https://images.pexels.com/photos/6163263/pexels-photo-6163263.jpeg',
      calories: 320,
      cookTime: 75,
      servings: 8,
    },
    {
      id: '38',
      name: 'Chewy Chocolate Chip Cookies',
      description: 'Soft and chewy cookies loaded with chocolate chips. A timeless dessert favorite.',
      image: 'https://images.pexels.com/photos/230325/pexels-photo-230325.jpeg',
      calories: 180,
      cookTime: 25,
      servings: 24,
    },
    {
      id: '39',
      name: 'Vanilla Bean Ice Cream',
      description: 'Creamy homemade ice cream with real vanilla beans. Perfect alone or with any dessert.',
      image: 'https://images.pexels.com/photos/1352281/pexels-photo-1352281.jpeg',
      calories: 240,
      cookTime: 45,
      servings: 8,
    },
    {
      id: '40',
      name: 'Berry Fruit Crumble',
      description: 'Mixed berry crumble with oat topping. Serve warm with ice cream.',
      image: 'https://images.pexels.com/photos/4040691/pexels-photo-4040691.jpeg',
      calories: 280,
      cookTime: 50,
      servings: 6,
    },
    {
      id: '41',
      name: 'Fresh Mint Mojito',
      description: 'Refreshing non-alcoholic mojito with fresh mint, lime, and sparkling water.',
      image: 'https://images.pexels.com/photos/4021983/pexels-photo-4021983.jpeg',
      calories: 85,
      cookTime: 10,
      servings: 2,
    },
    {
      id: '42',
      name: 'Golden Turmeric Latte',
      description: 'Anti-inflammatory golden milk made with turmeric, ginger, and your choice of milk.',
      image: 'https://images.pexels.com/photos/4051586/pexels-photo-4051586.jpeg',
      calories: 120,
      cookTime: 15,
      servings: 2,
    },
    {
      id: '43',
      name: 'Berry Protein Smoothie',
      description: 'High-protein smoothie with mixed berries, Greek yogurt, and honey.',
      image: 'https://images.pexels.com/photos/434295/pexels-photo-434295.jpeg',
      calories: 245,
      cookTime: 10,
      servings: 1,
    },
    {
      id: '44',
      name: 'Iced Matcha Green Tea Latte',
      description: 'Japanese-inspired iced matcha latte with ceremonial grade green tea.',
      image: 'https://images.pexels.com/photos/5946974/pexels-photo-5946974.jpeg',
      calories: 140,
      cookTime: 12,
      servings: 1,
    },
    {
      id: '45',
      name: 'Tiramisu',
      description: 'Classic Italian dessert with layers of coffee-soaked ladyfingers and mascarpone cream.',
      image: 'https://images.pexels.com/photos/6163235/pexels-photo-6163235.jpeg',
      calories: 420,
      cookTime: 40,
      servings: 8,
    },
    {
      id: '46',
      name: 'Lemon Cheesecake',
      description: 'Creamy cheesecake with fresh lemon zest and graham cracker crust.',
      image: 'https://images.pexels.com/photos/2144112/pexels-photo-2144112.jpeg',
      calories: 380,
      cookTime: 80,
      servings: 12,
    },
    {
      id: '47',
      name: 'Mango Lassi',
      description: 'Indian-inspired yogurt drink with fresh mango and cardamom.',
      image: 'https://images.pexels.com/photos/4790062/pexels-photo-4790062.jpeg',
      calories: 180,
      cookTime: 10,
      servings: 2,
    },
    {
      id: '48',
      name: 'Chocolate Brownie Sundae',
      description: 'Warm fudgy brownie topped with ice cream, chocolate sauce, and whipped cream.',
      image: 'https://images.pexels.com/photos/3026804/pexels-photo-3026804.jpeg',
      calories: 520,
      cookTime: 45,
      servings: 4,
    }
  ];

  const MAX_RESULTS_PER_PAGE = 50;

  // Improved function to get recipes from API response or fallback to mock data
  const getRecipesFromResponse = () => {
    if (!currentQuery) return [];
    
    if (isError || !data?.recipes?.recipe) {
      // Enhanced search for mock data
      const searchTerms = currentQuery.toLowerCase().split(' ');
      const startIndex = page * MAX_RESULTS_PER_PAGE;
      const endIndex = startIndex + MAX_RESULTS_PER_PAGE;
      
      const filteredMockRecipes = allMockRecipes.filter(recipe => {
        const recipeName = recipe.name.toLowerCase();
        const recipeDesc = recipe.description.toLowerCase();
        
        // Check if any search term matches the recipe
        return searchTerms.some(term => {
          // Special handling for dietary restrictions and meal types
          if (term === 'vegetarian' || term === 'vegan') {
            return !recipeDesc.includes('chicken') && 
                   !recipeDesc.includes('beef') && 
                   !recipeDesc.includes('fish') && 
                   !recipeDesc.includes('seafood') &&
                   !recipeDesc.includes('shrimp') &&
                   !recipeDesc.includes('salmon') &&
                   (recipeName.includes(term) || recipeDesc.includes(term));
          }
          
          if (term === 'quick' || term === 'easy') {
            return parseInt(recipe.cookTime.toString()) <= 30;
          }
          
          if (term === 'budget' || term === 'affordable') {
            return recipeDesc.includes('budget') || recipeDesc.includes('economical');
          }

          // Special handling for desserts
          if (term === 'dessert' || term === 'desserts') {
            return recipeName.includes('cake') || 
                   recipeName.includes('cookie') || 
                   recipeName.includes('pie') || 
                   recipeName.includes('ice cream') ||
                   recipeName.includes('brownie') ||
                   recipeName.includes('crumble') ||
                   recipeName.includes('tiramisu') ||
                   recipeName.includes('cheesecake') ||
                   recipeDesc.includes('dessert');
          }

          // Special handling for beverages and smoothie bowls
          if (term === 'drink' || term === 'beverage' || term === 'smoothie') {
            // Check if it's specifically a smoothie bowl
            if (term === 'smoothie' && recipeName.toLowerCase().includes('smoothie bowl')) {
              return true;
            }
            // For regular beverages
            return (recipeName.includes('smoothie') && !recipeName.toLowerCase().includes('bowl')) ||
                   recipeName.includes('latte') ||
                   recipeName.includes('mojito') ||
                   recipeName.includes('lassi') ||
                   recipeDesc.includes('drink') ||
                   recipeDesc.includes('beverage');
          }

          // Special handling for seafood
          if (term === 'seafood' || term === 'fish') {
            return recipeName.includes('seafood') ||
                   recipeName.includes('fish') ||
                   recipeName.includes('shrimp') ||
                   recipeName.includes('salmon') ||
                   recipeName.includes('tuna') ||
                   recipeName.includes('paella') ||
                   recipeDesc.includes('seafood') ||
                   recipeDesc.includes('fish');
          }
          
          // Default search in name and description
          return recipeName.includes(term) || recipeDesc.includes(term);
        });
      });

      console.log('Using mock data:', {
        searchTerms,
        filteredCount: filteredMockRecipes.length,
        pageResults: filteredMockRecipes.slice(startIndex, endIndex)
      });
      
      return filteredMockRecipes.slice(startIndex, endIndex);
    }
    
    // If the API returns a single recipe (not in an array)
    if (!Array.isArray(data.recipes.recipe)) {
      console.log('Single recipe response:', data.recipes.recipe);
      return [data.recipes.recipe];
    }
    
    // Ensure we have an array of recipes
    const recipeArray = Array.isArray(data.recipes.recipe) ? data.recipes.recipe : [];
    console.log('Recipe array:', {
      length: recipeArray.length,
      firstRecipe: recipeArray[0]
    });
    
    return recipeArray;
  };

  const recipes = getRecipesFromResponse();
  const totalResults = data?.recipes?.total_results 
    ? parseInt(data.recipes.total_results) 
    : (isError ? allMockRecipes.length : (recipes?.length || 0));

  // Simple pagination logic
  const handlePreviousPage = () => {
    if (page > 0) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    const hasMore = isError || !data?.recipes?.recipe
      ? (page + 1) * MAX_RESULTS_PER_PAGE < allMockRecipes.length // Check mock data length
      : recipes.length === MAX_RESULTS_PER_PAGE || (totalResults > (page + 1) * MAX_RESULTS_PER_PAGE); // Check API response
    
    if (hasMore) {
      setPage(page + 1);
    }
  };

  // Convert FatSecret recipe to format expected by RecipeCard
  const convertRecipe = (recipe: FatSecretRecipe | MockRecipe) => {
    // For FatSecret API response
    if ('recipe_id' in recipe) {
      console.log('Converting recipe:', recipe);
      // Default image based on recipe name/description content
      let defaultImage = 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg';
      const lowerName = (recipe.recipe_name || '').toLowerCase();
      const lowerDesc = (recipe.recipe_description || '').toLowerCase();
      
      if (lowerName.includes('salad') || lowerDesc.includes('salad')) {
        defaultImage = 'https://images.pexels.com/photos/1211887/pexels-photo-1211887.jpeg';
      } else if (lowerName.includes('smoothie') || lowerDesc.includes('smoothie')) {
        defaultImage = 'https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg';
      } else if (lowerName.includes('salmon') || lowerDesc.includes('salmon')) {
        defaultImage = 'https://images.pexels.com/photos/3655916/pexels-photo-3655916.jpeg';
      } else if (lowerName.includes('pancake') || lowerDesc.includes('pancake')) {
        defaultImage = 'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg';
      } else if (lowerName.includes('taco') || lowerDesc.includes('taco')) {
        defaultImage = 'https://images.pexels.com/photos/2092507/pexels-photo-2092507.jpeg';
      }

      return {
        id: recipe.recipe_id,
        name: recipe.recipe_name,
        description: recipe.recipe_description || '',
        image: recipe.recipe_image || defaultImage,
        calories: recipe.serving_sizes?.[0]?.calories ? parseInt(recipe.serving_sizes[0].calories) : undefined,
        cookTime: recipe.cooking_time_min ? parseInt(recipe.cooking_time_min) : undefined,
        servings: recipe.serving_sizes?.[0]?.number_of_units ? parseInt(recipe.serving_sizes[0].number_of_units) : undefined,
      };
    }
    // For mock data
    return recipe;
  };

  // For debugging
  console.log('Pagination Debug:', {
    currentPage: page,
    totalRecipes: recipes?.length,
    maxResults: MAX_RESULTS_PER_PAGE,
    hasPreviousPage: page > 0,
    hasNextPage: recipes.length === MAX_RESULTS_PER_PAGE,
    recipes: recipes?.length,
    apiResponse: data?.recipes
  });

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl p-6 md:p-8">
        <h1 className="text-3xl font-bold text-white mb-6">Find Nutritious Recipes</h1>
        
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for recipes..."
              className="w-full pl-10 pr-4 py-3 rounded-lg focus:ring-2 focus:ring-emerald-300 border-none"
            />
          </div>
          <button
            type="submit"
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-medium px-6 py-3 rounded-lg transition-colors duration-200"
          >
            Search
          </button>
          <button
            type="button"
            onClick={handleFilterToggle}
            className="bg-white text-emerald-700 hover:bg-gray-100 font-medium px-6 py-3 rounded-lg flex items-center justify-center transition-colors duration-200"
          >
            <Filter className="h-5 w-5 mr-2" />
            Filters
            <ChevronDown className={`h-5 w-5 ml-1 transition-transform duration-200 ${showFilters ? 'transform rotate-180' : ''}`} />
          </button>
        </form>

        {showFilters && (
          <div className="mt-4 p-4 bg-white rounded-lg shadow-md animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Meal Type</label>
                <select
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-300 focus:ring focus:ring-emerald-200 focus:ring-opacity-50"
                  value={filters.mealType}
                  onChange={(e) => setFilters({...filters, mealType: e.target.value})}
                >
                  <option value="">Any</option>
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="snack">Snack</option>
                  <option value="dessert">Dessert</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cuisine</label>
                <select
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-300 focus:ring focus:ring-emerald-200 focus:ring-opacity-50"
                  value={filters.cuisine}
                  onChange={(e) => setFilters({...filters, cuisine: e.target.value})}
                >
                  <option value="">Any</option>
                  <option value="italian">Italian</option>
                  <option value="mexican">Mexican</option>
                  <option value="asian">Asian</option>
                  <option value="mediterranean">Mediterranean</option>
                  <option value="american">American</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {currentQuery && (
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">
              Results for "{currentQuery}"
            </h2>
            <div className="text-sm text-gray-500">
              {isLoading ? 'Searching...' : recipes?.length > 0 
                ? `${totalResults ? `${totalResults} total recipes, showing ` : ''}${recipes.length} recipes${page > 0 ? ` (page ${page + 1})` : ''}`
                : 'No recipes found'}
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="large" />
          </div>
        ) : recipes && recipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => {
              const convertedRecipe = convertRecipe(recipe);
              return (
                <RecipeCard
                  key={convertedRecipe.id}
                  recipe={convertedRecipe}
                  onClick={() => navigate(`/recipe/${convertedRecipe.id}`)}
                />
              );
            })}
          </div>
        ) : currentQuery ? (
          <div className="text-center py-12">
            <p className="text-gray-500">
              {isError 
                ? "Couldn't fetch recipes from the API. Showing available recipes instead." 
                : "No recipes found. Try different search terms."}
            </p>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">Search for recipes to get started.</p>
            
            {/* Popular Searches Section */}
            <div className="bg-gray-50 p-6 rounded-lg max-w-2xl mx-auto mb-8">
              <h3 className="font-medium text-gray-700 mb-3">Popular searches:</h3>
              <div className="flex flex-wrap gap-2 justify-center">
                {['healthy breakfast', 'quick dinner', 'vegetarian', 'low carb', 'high protein', 'gluten free'].map((term) => (
                  <button
                    key={term}
                    className="bg-white border border-gray-200 rounded-full px-4 py-2 text-sm hover:bg-emerald-50 hover:border-emerald-200 transition-colors"
                    onClick={() => {
                      setSearchQuery(term);
                      setCurrentQuery(term);
                      setPage(0);
                    }}
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>

            {/* Get Recipes Section */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-lg max-w-6xl mx-auto">
              <h3 className="font-semibold text-gray-800 text-xl mb-6">Browse All Recipe Categories</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[
                  {
                    title: 'Quick & Easy',
                    description: 'Ready in 30 minutes or less',
                    image: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg',
                    search: 'quick easy'
                  },
                  {
                    title: 'Healthy Meals',
                    description: 'Nutritious and balanced recipes',
                    image: 'https://images.pexels.com/photos/1211887/pexels-photo-1211887.jpeg',
                    search: 'healthy'
                  },
                  {
                    title: 'Breakfast & Brunch',
                    description: 'Start your day right',
                    image: 'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg',
                    search: 'breakfast brunch'
                  },
                  {
                    title: 'Vegetarian',
                    description: 'Plant-based favorites',
                    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
                    search: 'vegetarian'
                  },
                  {
                    title: 'Main Dishes',
                    description: 'Delicious entrées and dinner ideas',
                    image: 'https://images.pexels.com/photos/3655916/pexels-photo-3655916.jpeg',
                    search: 'main dish dinner'
                  },
                  {
                    title: 'Appetizers',
                    description: 'Starters and snacks',
                    image: 'https://images.pexels.com/photos/2092507/pexels-photo-2092507.jpeg',
                    search: 'appetizer starter'
                  },
                  {
                    title: 'Soups & Stews',
                    description: 'Comforting bowls of goodness',
                    image: 'https://images.pexels.com/photos/539451/pexels-photo-539451.jpeg',
                    search: 'soup stew'
                  },
                  {
                    title: 'Salads',
                    description: 'Fresh and crisp combinations',
                    image: 'https://images.pexels.com/photos/1059905/pexels-photo-1059905.jpeg',
                    search: 'salad'
                  },
                  {
                    title: 'Pasta & Noodles',
                    description: 'From Italian to Asian noodles',
                    image: 'https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg',
                    search: 'pasta noodles'
                  },
                  {
                    title: 'Seafood',
                    description: 'Fish and shellfish dishes',
                    image: 'https://images.pexels.com/photos/725991/pexels-photo-725991.jpeg',
                    search: 'seafood fish'
                  },
                  {
                    title: 'Chicken & Poultry',
                    description: 'Versatile chicken recipes',
                    image: 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg',
                    search: 'chicken poultry'
                  },
                  {
                    title: 'Meat & Beef',
                    description: 'Hearty meat-based dishes',
                    image: 'https://images.pexels.com/photos/675951/pexels-photo-675951.jpeg',
                    search: 'meat beef'
                  },
                  {
                    title: 'Vegan',
                    description: '100% plant-based recipes',
                    image: 'https://images.pexels.com/photos/1683545/pexels-photo-1683545.jpeg',
                    search: 'vegan'
                  },
                  {
                    title: 'Desserts',
                    description: 'Sweet treats and baked goods',
                    image: 'https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg',
                    search: 'dessert'
                  },
                  {
                    title: 'Beverages',
                    description: 'Drinks and smoothies',
                    image: 'https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg',
                    search: 'drink beverage smoothie'
                  },
                  {
                    title: 'International Cuisine',
                    description: 'Dishes from around the world',
                    image: 'https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg',
                    search: 'international world cuisine'
                  },
                  {
                    title: 'Budget Meals',
                    description: 'Affordable and delicious',
                    image: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg',
                    search: 'budget affordable'
                  },
                  {
                    title: 'Gluten-Free',
                    description: 'Celiac-friendly options',
                    image: 'https://images.pexels.com/photos/1546890/pexels-photo-1546890.jpeg',
                    search: 'gluten free'
                  },
                  {
                    title: 'Low-Carb',
                    description: 'Keto and low-carb friendly',
                    image: 'https://images.pexels.com/photos/1410235/pexels-photo-1410235.jpeg',
                    search: 'low carb keto'
                  },
                  {
                    title: 'Meal Prep',
                    description: 'Make-ahead and batch cooking',
                    image: 'https://images.pexels.com/photos/1640773/pexels-photo-1640773.jpeg',
                    search: 'meal prep batch'
                  }
                ].map((category) => (
                  <button
                    key={category.title}
                    onClick={() => {
                      setSearchQuery(category.search);
                      setCurrentQuery(category.search);
                      setPage(0);
                    }}
                    className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all duration-200 transform hover:-translate-y-1"
                  >
                    <div className="relative h-48">
                      <img
                        src={category.image}
                        alt={category.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                      <h4 className="absolute bottom-3 left-3 text-white font-medium text-lg">
                        {category.title}
                      </h4>
                    </div>
                    <p className="p-3 text-sm text-gray-600 text-left h-16 flex items-center">
                      {category.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {recipes?.length > 0 && (
          <div className="flex justify-center mt-8">
            <nav className="flex items-center space-x-2">
              <button
                onClick={handlePreviousPage}
                disabled={page === 0}
                className={`px-3 py-1 rounded-md ${
                  page === 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                }`}
              >
                Previous
              </button>
              <span className="px-3 py-1 bg-emerald-500 text-white rounded-md">
                {page + 1}
              </span>
              <button
                onClick={handleNextPage}
                disabled={!recipes.length || (recipes.length < MAX_RESULTS_PER_PAGE && !isError && totalResults <= (page + 1) * MAX_RESULTS_PER_PAGE)}
                className={`px-3 py-1 rounded-md ${
                  !recipes.length || (recipes.length < MAX_RESULTS_PER_PAGE && !isError && totalResults <= (page + 1) * MAX_RESULTS_PER_PAGE)
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                }`}
              >
                Next
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeSearch;
