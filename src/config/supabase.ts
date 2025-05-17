import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Edge Function URLs
export const EDGE_FUNCTION_URLS = {
  createCheckoutSession: `${supabaseUrl}/functions/v1/create-checkout-session`,
  fatsecret: `${supabaseUrl}/functions/v1/fatsecret`,
} as const; 