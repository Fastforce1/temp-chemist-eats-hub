import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@12.1.0";
import { config } from "https://deno.land/x/dotenv@v3.2.0/mod.ts";

// Load environment variables
const env = config();

// Configuration
const ALLOW_GUEST_CHECKOUT = true; // Flag to control guest checkout functionality

// Validate required environment variables
const requiredEnvVars = [
  "STRIPE_SECRET_KEY",
  "FRONTEND_URL",
  ...(ALLOW_GUEST_CHECKOUT ? [] : ["SUPABASE_URL", "SUPABASE_ANON_KEY"]) // Only require Supabase env vars if guest checkout is disabled
] as const;

for (const envVar of requiredEnvVars) {
  if (!Deno.env.get(envVar)) {
    console.error(`❌ Missing required environment variable: ${envVar}`);
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

// Helper function to get environment variables with fallback
const getEnvVar = (key: string, fallback?: string): string => {
  const value = Deno.env.get(key);
  if (!value && !fallback) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value || fallback || "";
};

// Set FRONTEND_URL with fallback for development
const FRONTEND_URL = getEnvVar("FRONTEND_URL", "http://localhost:4174");

// Map our supplement IDs to Stripe Price IDs
const PRICE_ID_MAP: Record<string, string> = {
  '1': 'price_1RPEhmJXqLZs0wDX3RsfTtID',      // Creatine Capsules
  '2': 'price_1RPGJrJXqLZs0wDXVxv7rwor',      // Bovine Collagen Capsules
  '3': 'price_1RPGKpJXqLZs0wDXvOkPKZtE',      // Magnesium 3-in-1
  '4': 'price_1RPGLfJXqLZs0wDXUGjTqXY0',      // Vitamin C Orange Flavour
  '5': 'price_1RPGMiJXqLZs0wDXL9EXWXRg',      // Vitamin D3 4000iu + K2
  '6': 'price_1RPGNlJXqLZs0wDX5FdyK90r',      // Lions Mane + Black Pepper Extract
  '7': 'price_1RPGOHJXqLZs0wDXj86txcsB',      // Biotin Growth
  '8': 'price_1RPGOzJXqLZs0wDXxgs4Fwlb'       // Beauty Glow Bovine Collagen Peptides Protein Powder
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

console.log("🚀 Function deployed and ready!");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  // Log incoming request details
  console.log(`📥 ${req.method} request to ${new URL(req.url).pathname}`);

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    console.log("📥 Incoming request to create checkout session");

    // Initialize Stripe
    const stripe = new Stripe(getEnvVar("STRIPE_SECRET_KEY"), {
      apiVersion: "2022-11-15",
    });

    let userId: string;
    let customerId: string | undefined;

    // Handle authentication if available
    if (req.headers.get("Authorization")) {
      const supabaseClient = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_ANON_KEY")!,
        {
          global: { headers: { Authorization: req.headers.get("Authorization")! } },
        }
      );

      console.log("🔐 Getting authenticated user...");
      const { data: userData, error: userError } = await supabaseClient.auth.getUser();
      if (userError) {
        console.error("❌ Auth error:", userError.message);
        return errorResponse("Authentication failed", 401);
      }

      const user = userData.user;
      if (!user || !user.email) {
        return errorResponse("Invalid user data", 401);
      }

      userId = user.id;

      // Create Stripe customer directly without profile table
      console.log("🙋 Creating new Stripe customer...");
      try {
        const customer = await stripe.customers.create({ email: user.email });
        customerId = customer.id;
      } catch (error) {
        console.error("❌ Error creating Stripe customer:", error);
        // Continue without customer ID
      }
    } else if (ALLOW_GUEST_CHECKOUT) {
      // Generate temporary guest ID
      userId = crypto.randomUUID();
      console.log("👥 Processing as guest:", userId);
    } else {
      return errorResponse("Authentication required", 401);
    }

    console.log("📦 Reading request body...");
    const body = await req.json();
    console.log("🛒 Cart body:", body);

    const cartItems = body.items;
    if (!cartItems || !Array.isArray(cartItems)) {
      return errorResponse("Invalid cart structure. Expected array of items.");
    }

    if (cartItems.length === 0) {
      return errorResponse("Cart is empty");
    }

    const lineItems = cartItems.map((item: any) => {
      const stripePriceId = PRICE_ID_MAP[item.supplement.id];
      if (!stripePriceId) {
        throw new Error(`No Stripe price found for supplement ID: ${item.supplement.id}`);
      }

      return {
        price: stripePriceId,
        quantity: item.quantity,
      };
    });

    console.log("💳 Creating Stripe checkout session...");
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: lineItems,
      success_url: `${FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${FRONTEND_URL}/cart`,
      customer: customerId,
      metadata: {
        user_id: userId
      }
    });

    console.log("✅ Session created:", session.id);

    return new Response(JSON.stringify({ 
      id: session.id,
      url: session.url 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("🔥 Error during checkout session creation:", {
      message: error?.message,
      stack: error?.stack,
    });

    return errorResponse(error?.message || "Internal Server Error", 500);
  }
});
