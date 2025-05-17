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

    let userId: string = crypto.randomUUID(); // Initialize with a guest ID by default
    let customerId: string | undefined;

    // Handle authentication if available
    const authHeader = req.headers.get("Authorization");
    if (authHeader) {
      try {
        console.log("🔐 Processing authenticated checkout");
        const supabaseClient = createClient(
          Deno.env.get("SUPABASE_URL")!,
          Deno.env.get("SUPABASE_ANON_KEY")!,
          {
            global: { headers: { Authorization: authHeader } },
          }
        );

        console.log("🔐 Getting authenticated user...");
        const { data: userData, error: userError } = await supabaseClient.auth.getUser();
        if (userError) {
          console.error("❌ Auth error:", userError.message);
          // Don't return error, fall back to guest checkout
          console.log("⚠️ Falling back to guest checkout");
        } else if (userData?.user) {
          userId = userData.user.id; // Override the guest ID with the authenticated user's ID
          if (userData.user.email) {
            // Create Stripe customer
            console.log("🙋 Creating new Stripe customer...");
            try {
              const customer = await stripe.customers.create({ email: userData.user.email });
              customerId = customer.id;
              console.log("✅ Created Stripe customer:", customer.id);
            } catch (error) {
              console.error("❌ Error creating Stripe customer:", error);
              // Continue without customer ID
            }
          }
        }
      } catch (error) {
        console.error("❌ Error processing authentication:", error);
        // Continue as guest with the default guest ID
        console.log("⚠️ Continuing as guest due to auth error");
      }
    } else {
      console.log("👥 Processing as guest:", userId);
    }

    console.log("📦 Reading request body...");
    const body = await req.json();
    console.log("🛒 Cart body:", JSON.stringify(body, null, 2));

    const cartItems = body.items;
    if (!cartItems || !Array.isArray(cartItems)) {
      console.error("❌ Invalid cart structure:", cartItems);
      return errorResponse("Invalid cart structure. Expected array of items.");
    }

    if (cartItems.length === 0) {
      return errorResponse("Cart is empty");
    }

    console.log("🔍 Validating cart items:", JSON.stringify(cartItems, null, 2));
    
    // Validate each item has required properties
    for (const item of cartItems) {
      console.log("📝 Checking item:", JSON.stringify(item, null, 2));
      
      if (!item || typeof item !== 'object') {
        console.error("❌ Invalid item format:", item);
        return errorResponse("Invalid item format in cart");
      }

      if (!item.priceId || typeof item.priceId !== 'string') {
        console.error("❌ Missing or invalid priceId:", item);
        return errorResponse(`Missing or invalid Stripe price ID for item: ${JSON.stringify(item)}`);
      }

      if (!item.quantity || typeof item.quantity !== 'number' || item.quantity <= 0) {
        console.error("❌ Invalid quantity:", item);
        return errorResponse(`Invalid quantity for item with price ID: ${item.priceId}`);
      }
    }

    // Map validated items to Stripe format with additional error handling
    const lineItems = cartItems.map((item, index) => {
      try {
        console.log(`🔄 Processing item ${index}:`, JSON.stringify(item, null, 2));
        
        if (!item.priceId) {
          throw new Error(`Missing price ID for item at index ${index}`);
        }

        const lineItem = {
          price: item.priceId,
          quantity: item.quantity,
        };

        console.log(`✅ Created line item ${index}:`, JSON.stringify(lineItem, null, 2));
        return lineItem;
      } catch (error) {
        console.error(`❌ Error processing item ${index}:`, error);
        throw error;
      }
    });

    console.log("💳 Creating Stripe checkout session with items:", JSON.stringify(lineItems, null, 2));
    
    // Prepare session data
    const sessionData: any = {
      payment_method_types: ["card"],
      mode: "payment",
      line_items: lineItems,
      success_url: `${FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${FRONTEND_URL}/cart`,
      metadata: {
        user_id: userId,
        is_guest: !customerId
      }
    };

    // Only add customer if we have a valid customer ID
    if (customerId) {
      sessionData.customer = customerId;
    }

    console.log("📝 Creating session with data:", JSON.stringify(sessionData, null, 2));
    const session = await stripe.checkout.sessions.create(sessionData);

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
