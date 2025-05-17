import { supabase } from './supabaseClient';

export interface StripeProduct {
  id: string;
  name: string;
  prices: {
    id: string;
    unit_amount: number;
    currency: string;
  }[];
}

export const fetchStripeProducts = async (): Promise<StripeProduct[]> => {
  try {
    const { data, error } = await supabase.functions.invoke('list-stripe-products');
    
    if (error) {
      console.error('Error fetching Stripe products:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error fetching Stripe products:', error);
    throw error;
  }
};

export const createCheckoutSession = async (items: { priceId: string; quantity: number }[]) => {
  try {
    const { data, error } = await supabase.functions.invoke('create-checkout-session', {
      body: { items }
    });

    if (error) {
      console.error('Error creating checkout session:', error);
      throw error;
    }

    // Redirect to Stripe Checkout
    if (data?.url) {
      window.location.href = data.url;
    } else {
      throw new Error('No checkout URL received');
    }
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
}; 