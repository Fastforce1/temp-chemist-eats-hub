// @deno-types="npm:@types/stripe@12.1.0"
import Stripe from "npm:stripe@12.1.0";
import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.0";

// Type declarations for Deno
declare global {
  interface Deno {
    env: {
      get(key: string): string | undefined;
    };
  }
}

console.log("🚀 Function deployed and ready!");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// Validate required environment variables
const requiredEnvVars = [
  "STRIPE_SECRET_KEY",
  "SUPABASE_URL",
  "SUPABASE_ANON_KEY",
  "FRONTEND_URL"
] as const;

for (const envVar of requiredEnvVars) {
  if (!Deno.env.get(envVar)) {
    console.error(`❌ Missing required environment variable: ${envVar}`);
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

// Helper function to get typed environment variables
const getEnvVar = (key: typeof requiredEnvVars[number]): string => {
  const value = Deno.env.get(key);
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

// Helper function to send error responses
const errorResponse = (message: string, status: number = 400) => {
  return new Response(
    JSON.stringify({ 
      error: message,
      status,
      timestamp: new Date().toISOString()
    }),
    {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    }
  );
};

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
  // Log incoming request details
  console.log(`📥 ${req.method} request to ${new URL(req.url).pathname}`);

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Reject non-POST requests
  if (req.method !== "POST") {
    console.warn(`⚠️ Rejected ${req.method} request`);
    return errorResponse(
      `Method ${req.method} not allowed. This endpoint only accepts POST requests.`,
      405
    );
  }

  // Validate Content-Type
  const contentType = req.headers.get("content-type");
  if (!contentType?.includes("application/json")) {
    console.warn("⚠️ Invalid Content-Type:", contentType);
    return errorResponse(
      "Invalid Content-Type. Expected application/json",
      415
    );
  }

  try {
    // Initialize Stripe
    const stripe = new Stripe(getEnvVar("STRIPE_SECRET_KEY"), {
      apiVersion: "2022-11-15",
    });

    // Get user info if authenticated
    let userId = 'guest';
    const authHeader = req.headers.get('Authorization');
    if (authHeader) {
      try {
        const supabase = createClient(
          getEnvVar("SUPABASE_URL"),
          getEnvVar("SUPABASE_ANON_KEY"),
          {
            global: { headers: { Authorization: authHeader } },
          }
        );
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          userId = user.id;
          console.log("✅ Authenticated user:", userId);
        }
      } catch (error) {
        console.warn("⚠️ Error getting user info:", error);
        // Continue as guest if auth fails
      }
    } else {
      console.log("👥 Processing as guest checkout");
    }

    // Parse and validate request body
    let body;
    try {
      body = await req.json();
    } catch (error) {
      console.error("❌ Invalid JSON:", error);
      return errorResponse("Invalid JSON payload", 400);
    }

    console.log("🛒 Cart body:", body);

    const cartItems = body.items;
    if (!cartItems || !Array.isArray(cartItems)) {
      console.error("❌ Invalid cart structure:", cartItems);
      return errorResponse("Invalid cart structure. Expected array of items.");
    }

    if (cartItems.length === 0) {
      console.error("❌ Empty cart");
      return errorResponse("Cart is empty");
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
      success_url: `${getEnvVar("FRONTEND_URL")}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${getEnvVar("FRONTEND_URL")}/cart`,
      metadata: {
        user_id: userId
      }
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

    return errorResponse(
      error?.message || "Internal Server Error",
      error?.status || 500
    );
  }
};

serve(handler);
