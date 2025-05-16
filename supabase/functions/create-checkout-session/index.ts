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

// Configuration
const ALLOW_GUEST_CHECKOUT = true; // Flag to control guest checkout functionality

// Environment variable configuration
interface EnvVarConfig {
  required: boolean;
  description: string;
  validate?: (value: string) => true | string;
}

const ENV_CONFIG: Record<string, EnvVarConfig> = {
  STRIPE_SECRET_KEY: {
    required: true,
    description: "Stripe secret key for payment processing"
  },
  FRONTEND_URL: {
    required: true,
    description: "Frontend URL for success/cancel redirects",
    validate: (value: string) => {
      try {
        new URL(value);
        return true;
      } catch {
        return "Must be a valid URL";
      }
    }
  },
  SUPABASE_URL: {
    required: false, // Only required if not in guest-only mode
    description: "Supabase project URL"
  },
  SUPABASE_ANON_KEY: {
    required: false, // Only required if not in guest-only mode
    description: "Supabase anonymous key"
  }
} as const;

type EnvVar = keyof typeof ENV_CONFIG;

// Helper function to validate environment variables
const validateEnv = () => {
  const errors: string[] = [];
  const warnings: string[] = [];

  for (const [key, config] of Object.entries(ENV_CONFIG)) {
    const value = Deno.env.get(key);

    if (!value && config.required) {
      errors.push(`Missing required environment variable: ${key} (${config.description})`);
      continue;
    }

    if (!value && !config.required) {
      warnings.push(`Optional environment variable not set: ${key} (${config.description})`);
      continue;
    }

    if (value && config.validate) {
      const validationResult = config.validate(value);
      if (validationResult !== true) {
        errors.push(`Invalid ${key}: ${validationResult}`);
      }
    }
  }

  // Log warnings but don't fail
  if (warnings.length > 0) {
    console.warn("⚠️ Environment warnings:", warnings);
  }

  // Fail fast if any required variables are missing or invalid
  if (errors.length > 0) {
    console.error("❌ Environment validation failed:");
    errors.forEach(error => console.error(`  - ${error}`));
    throw new Error("Invalid environment configuration");
  }

  console.log("✅ Environment validation passed");
};

// Helper function to get typed environment variables
const getEnvVar = (key: EnvVar): string => {
  const value = Deno.env.get(key);
  if (!value) {
    throw new Error(`Missing environment variable: ${key} (${ENV_CONFIG[key].description})`);
  }
  return value;
};

// Validate environment on startup
validateEnv();

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
    // Initialize Stripe with validated key
    const stripe = new Stripe(getEnvVar("STRIPE_SECRET_KEY"), {
      apiVersion: "2022-11-15",
    });

    // Parse and validate request body
    let body;
    try {
      body = await req.json();
    } catch (error) {
      console.error("❌ Invalid JSON:", error);
      return errorResponse("Invalid JSON payload", 400);
    }

    console.log("🛒 Cart body:", body);

    // Handle user identification
    let userId: string;
    const authHeader = req.headers.get('Authorization');

    if (authHeader?.startsWith('Bearer ')) {
      try {
        const supabase = createClient(
          getEnvVar("SUPABASE_URL"),
          getEnvVar("SUPABASE_ANON_KEY"),
          {
            global: { headers: { Authorization: authHeader } },
          }
        );
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.id) {
          userId = user.id;
          console.log("✅ Authenticated user:", userId);
        } else {
          // Invalid auth token, but we'll still allow checkout as guest
          userId = crypto.randomUUID();
          console.warn("⚠️ Invalid auth token, proceeding as guest:", userId);
        }
      } catch (error) {
        // Auth failed, but we'll still allow checkout as guest
        userId = crypto.randomUUID();
        console.warn("⚠️ Auth error, proceeding as guest:", userId, error);
      }
    } else {
      // No auth token, generate a temporary guest ID
      userId = crypto.randomUUID();
      console.log("👥 Processing as guest:", userId);
    }

    // Validate cart structure and contents
    if (!body?.items || !Array.isArray(body.items)) {
      console.error("❌ Invalid cart structure:", body);
      return errorResponse("Invalid cart structure. Expected 'items' array in request body.");
    }

    const cartItems = body.items;
    
    if (cartItems.length === 0) {
      console.error("❌ Empty cart");
      return errorResponse("Cart is empty. Please add items before checkout.");
    }

    // Validate each cart item
    const invalidItems = cartItems.filter(
      (item: any) => 
        !item?.supplement?.id ||
        !item?.supplement?.name ||
        typeof item?.supplement?.price !== 'number' ||
        typeof item?.quantity !== 'number' ||
        item.quantity < 1
    );

    if (invalidItems.length > 0) {
      console.error("❌ Invalid items found:", invalidItems);
      return errorResponse(
        "Invalid items in cart. Each item must have a valid supplement (id, name, price) and quantity.",
        400
      );
    }

    // Check for valid product mappings
    const invalidMappings = cartItems.filter(
      (item: any) => !PRODUCT_ID_MAP[item.supplement.id]
    );

    if (invalidMappings.length > 0) {
      console.error("❌ Products not found in Stripe:", 
        invalidMappings.map((item: any) => ({
          id: item.supplement.id,
          name: item.supplement.name
        }))
      );
      return errorResponse(
        `Some products are not available for purchase: ${
          invalidMappings.map((item: any) => item.supplement.name).join(", ")
        }`,
        400
      );
    }

    // Create line items with price validation
    try {
      const lineItems = cartItems.map((item: any) => {
        const stripeProductId = PRODUCT_ID_MAP[item.supplement.id];
        const unitAmount = Math.round(item.supplement.price * 100); // Convert to pence

        if (unitAmount <= 0) {
          throw new Error(`Invalid price for product ${item.supplement.name}: £${item.supplement.price}`);
        }

        return {
          price_data: {
            currency: "gbp",
            product: stripeProductId,
            unit_amount: unitAmount,
          },
          quantity: item.quantity,
        };
      });

      console.log("💳 Creating Stripe checkout session with items:", 
        lineItems.map(item => ({
          product: item.price_data.product,
          amount: `£${(item.price_data.unit_amount / 100).toFixed(2)}`,
          quantity: item.quantity
        }))
      );

      console.log("💳 Creating Stripe checkout session...");
      const frontendUrl = getEnvVar("FRONTEND_URL");
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: lineItems,
        success_url: `${frontendUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${frontendUrl}/cart`,
        metadata: {
          user_id: userId
        }
      });

      console.log("✅ Session created:", session.id);

      return new Response(JSON.stringify({ url: session.url }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("🔥 Error during line item creation:", {
        message: error?.message,
        stack: error?.stack,
      });

      return errorResponse(
        error?.message || "Internal Server Error",
        error?.status || 500
      );
    }
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
