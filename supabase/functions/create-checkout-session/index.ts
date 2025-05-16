import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@12.1.0";

console.log("🚀 Function deployed and ready!");

// Map our supplement IDs to Stripe Product IDs
const PRODUCT_ID_MAP: Record<string, string> = {
  '1': 'prod_creatine',      // 65 Creatine Capsules
  '2': 'prod_collagen',      // 90 Bovine Collagen Capsules
  '3': 'prod_magnesium',     // 90 Magnesium 3-in-1
  '4': 'prod_vitaminc',      // 65 Vitamin C Orange Flavour
  '5': 'prod_vitamind',      // 125 Vitamin D3 4000iu + K2
  '6': 'prod_lionsmane',     // 65 Lions Mane + Black Pepper Extract
  '7': 'prod_biotin',        // 125 Biotin Growth
  '8': 'prod_collagenpowder' // Beauty Glow Bovine Collagen Peptides Protein Powder
};

export const handler = async (req: Request): Promise<Response> => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    console.log("📥 Incoming request to create checkout session");

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
      apiVersion: "2022-11-15",
    });

    console.log("📦 Reading request body...");
    const body = await req.json();
    console.log("🛒 Cart body:", body);

    const cartItems = body.items;
    if (!cartItems || !Array.isArray(cartItems)) {
      throw new Error("Invalid cart items");
    }

    const lineItems = cartItems.map((item: any) => {
      const stripeProductId = PRODUCT_ID_MAP[item.supplement.id];
      if (!stripeProductId) {
        throw new Error(`No Stripe product found for supplement ID: ${item.supplement.id}`);
      }

      return {
        price_data: {
          currency: "gbp",
          product: stripeProductId,
          unit_amount: Math.round(item.supplement.price * 100), // Convert to pence
        },
        quantity: item.quantity,
      };
    });

    console.log("💳 Creating Stripe checkout session...");
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: lineItems,
      success_url: `${Deno.env.get("FRONTEND_URL")}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${Deno.env.get("FRONTEND_URL")}/cart`,
    });

    console.log("✅ Session created:", session.id);

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("🔥 Error during checkout session creation:", {
      message: error?.message,
      stack: error?.stack,
    });

    return new Response(JSON.stringify({ error: error?.message || "Internal Server Error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
};

serve(handler);
