import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CartItem {
  supplement: {
    id: string;
    name: string;
    price: number;
    image?: string;
  };
  quantity: number;
}

// Validate Stripe secret key
const validateStripeKey = (key: string | undefined): boolean => {
  if (!key) return false;
  // Basic validation: Check if it starts with 'sk_test_' or 'sk_live_' and has the correct length
  return /^sk_(test|live)_[A-Za-z0-9]{24,}$/.test(key);
};

serve(async (req: Request) => {
  console.log("Request received:", {
    method: req.method,
    url: req.url,
    headers: Object.fromEntries(req.headers.entries()),
  });

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Environment variables validation
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");

    console.log("Environment variables check:", {
      hasSupabaseUrl: !!supabaseUrl,
      hasSupabaseAnonKey: !!supabaseAnonKey,
      hasSupabaseServiceRoleKey: !!supabaseServiceRoleKey,
      hasStripeSecretKey: !!stripeSecretKey,
    });

    if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceRoleKey) {
      console.error("Missing Supabase environment variables");
      return new Response(JSON.stringify({ error: "Server configuration error." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!stripeSecretKey || !validateStripeKey(stripeSecretKey)) {
      console.error("Invalid or missing STRIPE_SECRET_KEY");
      return new Response(JSON.stringify({ error: "Invalid Stripe configuration." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Initialize Stripe with validation
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    });

    // Validate Stripe connection
    try {
      await stripe.paymentMethods.list({ limit: 1 });
    } catch (error) {
      console.error("Stripe connection test failed:", error);
      return new Response(JSON.stringify({ error: "Failed to connect to Stripe." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    
    // Initialize Supabase clients
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { 
        headers: { 
          Authorization: req.headers.get('Authorization')!,
          // Log the actual Authorization header for debugging
          'x-client-info': req.headers.get('x-client-info') || '',
        }
      }
    });
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

    // Get user data and log authentication status
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    console.log("Authentication status:", {
      isAuthenticated: !!user,
      userId: user?.id,
      authError: authError?.message,
    });

    // Parse and validate request body
    const requestBody = await req.json();
    console.log("Request body:", requestBody);

    const cartItems = requestBody.items as CartItem[];
    console.log("Cart items:", cartItems);

    // Validate cart items
    if (!Array.isArray(cartItems) || cartItems.some(i => !i.supplement || !i.quantity)) {
      console.error("Invalid cart structure:", cartItems);
      return new Response(JSON.stringify({ error: "Invalid cart item structure." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (cartItems.length === 0) {
      console.error("Empty cart");
      return new Response(JSON.stringify({ error: "Cart is empty." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Create or retrieve customer
    const createOrRetrieveCustomer = async (userEmail?: string, userId?: string): Promise<string> => {
      try {
        if (userEmail) {
          const customers = await stripe.customers.list({
            email: userEmail,
            limit: 1,
          });
          
          if (customers.data.length > 0) {
            console.log("Found existing customer:", customers.data[0].id);
            return customers.data[0].id;
          }

          const customer = await stripe.customers.create({
            email: userEmail,
            metadata: {
              supabase_uid: userId,
            },
          });
          console.log("Created new customer:", customer.id);
          return customer.id;
        }

        // Handle guest checkout
        const customer = await stripe.customers.create({
          metadata: {
            is_guest: 'true',
          },
        });
        console.log("Created guest customer:", customer.id);
        return customer.id;
      } catch (err) {
        console.error("Error creating/retrieving Stripe customer:", err);
        throw err;
      }
    };

    let customerId: string;
    try {
      customerId = await createOrRetrieveCustomer(user?.email, user?.id);
    } catch (error) {
      console.error("🔥 Unhandled error:", {
        message: error?.message,
        stack: error?.stack,
        error
      });

      return new Response(JSON.stringify({
        error: error?.message || "Internal server error."
      }), {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      });
    }

    // Prepare line items
    const line_items = cartItems.map(item => {
      console.log("Processing item:", item);
      return {
        price_data: {
          currency: "gbp",
          product_data: {
            name: item.supplement.name,
            images: item.supplement.image ? [`${new URL(req.url).origin}${item.supplement.image}`] : undefined,
          },
          unit_amount: Math.round(item.supplement.price * 100), // Convert to pence
        },
        quantity: item.quantity,
      };
    });

    console.log("Prepared line items:", line_items);

    // Calculate total amount
    const totalAmount = line_items.reduce((sum, item) => 
      sum + (item.price_data.unit_amount * item.quantity), 0);

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer: customerId,
      line_items,
      success_url: `${new URL(req.url).origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${new URL(req.url).origin}/payment-cancel`,
      metadata: {
        user_id: user?.id || 'guest',
      }
    });

    console.log("Created checkout session:", {
      sessionId: session.id,
      totalAmount,
      itemCount: cartItems.length,
    });

    if (!session.id) {
      console.error("Stripe session creation failed - no session ID");
      throw new Error("Could not create Stripe session.");
    }

    // Store order in Supabase
    const { error: orderError } = await supabaseAdmin.from("orders").insert({
      user_id: user?.id || 'guest',
      stripe_session_id: session.id,
      amount_total: totalAmount,
      currency: "gbp",
      payment_status: "pending",
      customer_email: user?.email,
      line_items: cartItems.map(item => ({ 
        id: item.supplement.id, 
        name: item.supplement.name, 
        quantity: item.quantity, 
        price: item.supplement.price 
      })),
    });

    if (orderError) {
      console.error("Error storing order in Supabase:", orderError);
    }

    return new Response(JSON.stringify({ url: session.url }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("🔥 Unhandled error:", {
      message: error?.message,
      stack: error?.stack,
      error
    });

    return new Response(JSON.stringify({
      error: error?.message || "Internal server error."
    }), {
      status: 500,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      }
    });
  }
});
