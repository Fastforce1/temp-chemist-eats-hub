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

const corsHeaders = {
  "Access-Control-Allow-Origin": FRONTEND_URL,
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Credentials": "true"
};

// Helper function to send error responses with CORS headers
const errorResponse = (message: string, status: number = 400) => {
  console.error(`❌ Error: ${message}`);
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

serve(async (req) => {
  // Log incoming request details
  console.log(`📥 ${req.method} request to ${new URL(req.url).pathname}`);

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return errorResponse("Method not allowed", 405);
  }

  try {
    console.log("📥 Incoming request to create checkout session");

    // Initialize Stripe
    const stripe = new Stripe(getEnvVar("STRIPE_SECRET_KEY"), {
      apiVersion: "2022-11-15",
    });

    // Handle authentication if available
    const authHeader = req.headers.get("Authorization");
    let userId: string = crypto.randomUUID(); // Initialize with a guest ID by default
    let customerId: string | undefined;
    let isGuest = true;

    if (authHeader) {
      try {
        console.log("🔐 Processing authenticated checkout");
        // Validate Authorization header format
        if (!authHeader.startsWith('Bearer ')) {
          console.log("❌ Invalid Authorization header format, proceeding as guest");
          isGuest = true;
        } else {
          // Extract and validate the token
          const token = authHeader.split(' ')[1];
          console.log("🔑 Validating token format...");

          try {
            // Basic JWT structure validation
            const [header, payload, signature] = token.split('.');
            if (!header || !payload || !signature) {
              throw new Error('Invalid JWT format');
            }

            // Decode and check payload
            const decodedPayload = JSON.parse(atob(payload));
            console.log("📜 Token payload:", {
              sub: decodedPayload.sub,
              role: decodedPayload.role,
              exp: decodedPayload.exp,
              aud: decodedPayload.aud
            });

            if (!decodedPayload.sub) {
              throw new Error('Missing sub claim');
            }

            // Initialize Supabase client with validated token
            const supabaseClient = createClient(
              Deno.env.get("SUPABASE_URL")!,
              Deno.env.get("SUPABASE_ANON_KEY")!,
              {
                global: { 
                  headers: { Authorization: authHeader }
                },
                auth: {
                  persistSession: false
                }
              }
            );

            console.log("🔐 Getting authenticated user...");
            const { data: { user: authUser }, error: userError } = await supabaseClient.auth.getUser();
            
            if (userError) {
              console.error("❌ Auth error:", userError.message);
              throw new Error(userError.message);
            }

            if (!authUser?.id) {
              console.error("❌ No user ID in auth response");
              throw new Error('Invalid user authentication');
            }

            // Successfully authenticated
            userId = authUser.id;
            isGuest = false;
            console.log("✅ Authentication successful:", { userId });
            
            if (authUser.email) {
              try {
                // Check if customer already exists
                const existingCustomers = await stripe.customers.list({
                  email: authUser.email,
                  limit: 1
                });

                if (existingCustomers.data.length > 0) {
                  customerId = existingCustomers.data[0].id;
                  console.log("✅ Found existing Stripe customer:", customerId);
                } else {
                  // Create new customer
                  console.log("🙋 Creating new Stripe customer...");
                  const customer = await stripe.customers.create({ 
                    email: authUser.email,
                    metadata: {
                      supabase_uid: authUser.id
                    }
                  });
                  customerId = customer.id;
                  console.log("✅ Created new Stripe customer:", customer.id);
                }
              } catch (error) {
                console.error("❌ Error handling Stripe customer:", error);
                // Continue without customer ID
              }
            }
          } catch (tokenError) {
            console.error("❌ Token validation error:", tokenError.message);
            console.log("⚠️ Invalid token, proceeding with guest checkout");
            isGuest = true;
          }
        }
      } catch (error) {
        console.error("❌ Error processing authentication:", error);
        console.log("⚠️ Auth error, proceeding with guest checkout");
        isGuest = true;
      }
    } else {
      console.log("👥 No auth header, processing as guest:", userId);
    }

    console.log("🔍 Checkout mode:", isGuest ? "Guest" : "Authenticated", {
      userId,
      hasCustomerId: !!customerId,
      isGuest
    });

    console.log("📦 Reading request body...");
    const body = await req.json();
    console.log("🛒 Raw request body:", JSON.stringify(body, null, 2));

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
    const lineItems = cartItems.map((item) => ({
      price: item.priceId,
      quantity: item.quantity,
    }));

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
        is_guest: isGuest
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

    return new Response(
      JSON.stringify({ 
        error: error?.message || "Internal Server Error",
        status: 500,
        timestamp: new Date().toISOString()
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
