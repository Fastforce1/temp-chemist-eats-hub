import { EDGE_FUNCTION_URLS } from '../config/supabase';

// Use the configured Edge Function URL
const API_URL = EDGE_FUNCTION_URLS.fatsecret;

/**
 * Make a request to the FatSecret API via Edge Function
 */
const makeApiRequest = async (method: string, params: Record<string, string> = {}) => {
  try {
    const searchParams = new URLSearchParams({
      method,
      ...params,
    });
    
    const url = `${API_URL}?${searchParams.toString()}`;
    console.log('Making request to:', {
      url,
      method,
      params,
    });
    
    // Use direct fetch to prevent potential auth issues
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ method, params })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    if (!data) {
      throw new Error('Empty response received from API');
    }
    
    return data;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`Error making API request (${method}):`, {
      error,
      message: errorMessage,
      stack: error instanceof Error ? error.stack : 'No stack trace',
      params,
    });
    throw error;
  }
};

/**
 * Search for recipes
 */
export const searchRecipes = async (query: string, pageNumber: number = 0, maxResults: number = 50) => {
  // FatSecret API uses 1-based page numbers
  const apiPageNumber = Math.max(1, pageNumber + 1);
  
  const response = await makeApiRequest('recipes.search', {
    search_expression: query,
    page_number: apiPageNumber.toString(),
    max_results: maxResults.toString(),
    search_type: 'Recipe',
    recipe_categories: 'All',  // Include all recipe categories
    include_links: 'true',     // Get additional recipe links
    flag_default_serving: 'true', // Get default serving sizes
    format: 'json'
  });

  // Debug log
  console.log('FatSecret API Response:', {
    query,
    requestedPage: pageNumber,
    apiPageNumber,
    maxResults,
    responsePageNumber: response?.recipes?.page_number,
    totalResults: response?.recipes?.total_results,
    actualResults: Array.isArray(response?.recipes?.recipe) 
      ? response.recipes.recipe.length 
      : (response?.recipes?.recipe ? 1 : 0)
  });

  return response;
};

/**
 * Get recipe details
 */
export const getRecipeById = async (recipeId: string) => {
  return makeApiRequest('recipe.get', {
    recipe_id: recipeId
  });
};

/**
 * Search for foods
 */
export const searchFoods = async (query: string, pageNumber: number = 0, maxResults: number = 20) => {
  return makeApiRequest('foods.search', {
    search_expression: query,
    page_number: pageNumber.toString(),
    max_results: maxResults.toString()
  });
};

/**
 * Get food details
 */
export const getFoodById = async (foodId: string) => {
  return makeApiRequest('food.get', {
    food_id: foodId
  });
};

export default {
  searchRecipes,
  getRecipeById,
  searchFoods,
  getFoodById
};
