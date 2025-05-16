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

// Helper function to get typed environment variables
const getEnvVar = (key: typeof requiredEnvVars[number]): string => {
  const value = Deno.env.get(key);
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

// Set default FRONTEND_URL if not provided
const FRONTEND_URL = getEnvVar("FRONTEND_URL");

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

      try {
        // Get or create Stripe customer
        console.log("🔍 Checking for existing Stripe customer...");
        const { data: customerData, error: customerError } = await supabaseClient
          .from("profile")
          .select("stripe_customer_id")
          .eq("id", userId)
          .single();

        if (customerError && customerError.code !== "PGRST116") { // Ignore not found error
          console.error("❌ DB error:", customerError.message);
          // Continue without customer ID if there's a DB error
        } else {
          customerId = customerData?.stripe_customer_id;
        }

        if (!customerId && user.email) {
          console.log("🙋 Creating new Stripe customer...");
          const customer = await stripe.customers.create({ email: user.email });
          customerId = customer.id;

          try {
            const { error: updateError } = await supabaseClient
              .from("profile")
              .update({ stripe_customer_id: customerId })
              .eq("id", userId);

            if (updateError) {
              console.error("❌ Failed to update customer ID in Supabase:", updateError.message);
              // Continue without saving customer ID if there's a DB error
            }
          } catch (error) {
            console.error("❌ Error updating profile:", error);
            // Continue without saving customer ID
          }
        }
      } catch (error) {
        console.error("❌ Error handling customer:", error);
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
