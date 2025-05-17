import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@12.1.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
      apiVersion: "2022-11-15",
    });

    // List all products
    const products = await stripe.products.list({ limit: 100, active: true });
    
    // Get prices for each product
    const prices = await stripe.prices.list({ 
      limit: 100,
      active: true,
      expand: ['data.product']
    });

    // Format the response
    const formattedData = products.data.map(product => ({
      id: product.id,
      name: product.name,
      prices: prices.data
        .filter(price => price.product === product.id)
        .map(price => ({
          id: price.id,
          unit_amount: price.unit_amount,
          currency: price.currency
        }))
    }));

    return new Response(JSON.stringify(formattedData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
}); 