import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@12.1.0";
import { config } from "https://deno.land/x/dotenv@v3.2.0/mod.ts";
import * as jose from "https://deno.land/x/jose@v4.9.1/index.ts";

// Load environment variables
const env = config();

// Configuration
const ALLOW_GUEST_CHECKOUT = true; // Flag to control guest checkout functionality

// Validate required environment variables
const requiredEnvVars = [
  "STRIPE_SECRET_KEY",
  "FRONTEND_URL",
  "SUPABASE_JWT_SECRET",
  ...(ALLOW_GUEST_CHECKOUT ? [] : ["SUPABASE_URL", "SUPABASE_ANON_KEY"]) 
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

const FRONTEND_URL = getEnvVar("FRONTEND_URL", "http://localhost:4174");
const JWT_SECRET = getEnvVar("SUPABASE_JWT_SECRET");

const corsHeaders = {
  "Access-Control-Allow-Origin": FRONTEND_URL,
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Credentials": "true"
};

// Helper function to verify JWT token
async function verifyToken(token: string) {
  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jose.jwtVerify(token, secret);
    return payload;
  } catch (error) {
    console.error("❌ JWT verification error:", error);
    return null;
  }
}

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
          // Extract and verify the token
          const token = authHeader.split(' ')[1];
          const payload = await verifyToken(token);

          if (!payload) {
            console.log("❌ Invalid token, proceeding as guest");
            isGuest = true;
          } else {
            console.log("✅ Token verified:", {
              sub: payload.sub,
              role: payload.role,
              email: payload.email
            });

            // Use the verified user ID
            userId = payload.sub as string;
            isGuest = false;

            // Create or retrieve Stripe customer
            if (payload.email) {
              try {
                const existingCustomers = await stripe.customers.list({
                  email: payload.email as string,
                  limit: 1
                });

                if (existingCustomers.data.length > 0) {
                  customerId = existingCustomers.data[0].id;
                  console.log("✅ Found existing Stripe customer:", customerId);
                } else {
                  console.log("🙋 Creating new Stripe customer...");
                  const customer = await stripe.customers.create({ 
                    email: payload.email as string,
                    metadata: {
                      supabase_uid: userId
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
