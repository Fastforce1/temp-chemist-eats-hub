
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0"; // Ensure this is a recent, compatible version
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

// Initialize Stripe
const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2023-10-16", // Use a fixed API version
  httpClient: Stripe.createFetchHttpClient(), // Recommended for Deno
});

async function createOrRetrieveCustomer(supabaseAdmin: SupabaseClient, userEmail: string, userId: string) {
  // Check if a Stripe customer record exists for this user by email
  const { data: customers, error: listError } = await stripe.customers.list({ email: userEmail, limit: 1 });
  if (listError) {
    console.error("Stripe customer list error:", listError);
    throw listError;
  }

  if (customers.data.length > 0) {
    return customers.data[0].id;
  }

  // Create a new Stripe customer
  const customer = await stripe.customers.create({
    email: userEmail,
    metadata: { supabase_user_id: userId },
  });
  return customer.id;
}


serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceRoleKey) {
      console.error("Missing Supabase environment variables");
      return new Response(JSON.stringify({ error: "Server configuration error." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!Deno.env.get("STRIPE_SECRET_KEY")) {
      console.error("Missing STRIPE_SECRET_KEY environment variable");
      return new Response(JSON.stringify({ error: "Stripe configuration error." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
        global: { headers: { Authorization: req.headers.get('Authorization')! } }
    });
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, { auth: { persistSession: false }});

    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !user.email) {
      console.warn("User not authenticated or email not available");
      return new Response(JSON.stringify({ error: "User not authenticated." }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const cartItems = (await req.json()).items as CartItem[];
    if (!cartItems || cartItems.length === 0) {
      return new Response(JSON.stringify({ error: "Cart is empty." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    
    const customerId = await createOrRetrieveCustomer(supabaseAdmin, user.email, user.id);

    const line_items = cartItems.map(item => ({
      price_data: {
        currency: "gbp",
        product_data: {
          name: item.supplement.name,
          // Attempt to use absolute URL for images if possible, or ensure Stripe can access relative paths
          images: item.supplement.image ? [`${req.headers.get("origin")}${item.supplement.image}`] : undefined,
        },
        unit_amount: Math.round(item.supplement.price * 100), // Price in pence
      },
      quantity: item.quantity,
    }));

    const totalAmount = line_items.reduce((sum, item) => sum + item.price_data.unit_amount * item.quantity, 0);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer: customerId,
      line_items,
      success_url: `${req.headers.get("origin")}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/payment-cancel`,
      metadata: {
        user_id: user.id,
      }
    });

    if (!session.id) {
        console.error("Stripe session creation failed, no session ID returned.");
        throw new Error("Could not create Stripe session.");
    }

    // Store pending order in Supabase
    const { error: orderError } = await supabaseAdmin.from("orders").insert({
      user_id: user.id,
      stripe_session_id: session.id,
      amount_total: totalAmount,
      currency: "gbp",
      payment_status: "pending",
      customer_email: user.email,
      line_items: cartItems.map(item => ({ 
        id: item.supplement.id, 
        name: item.supplement.name, 
        quantity: item.quantity, 
        price: item.supplement.price 
      })), // Store simplified item data
    });

    if (orderError) {
      console.error("Error inserting pending order:", orderError);
      // Potentially log this without failing the checkout session creation for the user
      // Or decide if this is a critical failure. For now, we'll log and proceed.
    }

    return new Response(JSON.stringify({ sessionId: session.id, url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("Error in create-checkout-session:", error);
    return new Response(JSON.stringify({ error: error.message || "Internal server error." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
