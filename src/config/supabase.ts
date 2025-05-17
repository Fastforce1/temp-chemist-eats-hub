import { createClient } from '@supabase/supabase-js';

// Get environment variables or use fallback values for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://btrqtckxwvqkotnpyhgo.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ0cnF0Y2t4d3Zxa290bnB5aGdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1OTI1OTMsImV4cCI6MjA2MjE2ODU5M30.0NHV92_M7tfnJvcwo7Hk_bdwUWLVgH_8MhVWrUqGF-4';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Edge Function URLs
export const EDGE_FUNCTION_URLS = {
  createCheckoutSession: `${supabaseUrl}/functions/v1/create-checkout-session`,
  fatsecret: `${supabaseUrl}/functions/v1/fatsecret`,
} as const; 