
import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@12.1.0";

console.log("🚀 Function deployed and ready!");

serve(async (req) => {
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

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      {
        global: { headers: { Authorization: req.headers.get("Authorization")! } },
      }
    );

    console.log("🔐 Getting authenticated user...");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser();
    console.log("👤 User data:", userData);
    if (userError) throw new Error("Auth error: " + userError.message);

    const user = userData.user;
    if (!user || !user.email) {
      // Allow guest checkout if user is not fully authenticated but a session exists
      // For a true guest checkout without any auth, you'd handle this differently
      // or require some minimal guest identifier if not relying on Stripe's email collection.
      console.log("User not fully authenticated, proceeding as guest or with existing Stripe customer based on email if available later.");
      // If you want to block unauthenticated users entirely:
      // return new Response(JSON.stringify({ error: "Unauthorized" }), {
      //   status: 401,
      //   headers: { ...corsHeaders, "Content-Type": "application/json" },
      // });
    }

    const stripe = Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, { apiVersion: "2022-11-15" });

    console.log("📦 Reading request body...");
    const body = await req.json();
    console.log("🛒 Cart body:", body);

    const cartItems = body.items;
    if (!cartItems || !Array.isArray(cartItems)) {
      throw new Error("Invalid cart items");
    }

    let customerId;
    if (user && user.email) { // Only try to find/create customer if user is authenticated with email
      console.log("🔍 Checking for existing Stripe customer for authenticated user...");
      const { data: customerData, error: customerError } = await supabaseClient
        .from("profile") // Assuming 'profile' table stores stripe_customer_id
        .select("stripe_customer_id")
        .eq("id", user.id)
        .single();

      if (customerError && customerError.code !== 'PGRST116') { // PGRST116: Row not found, which is fine
        console.error("DB error fetching customer:", customerError);
        // Decide if this is a fatal error or if we can proceed without a linked customer
      }
      
      customerId = customerData?.stripe_customer_id;

      if (!customerId) {
        console.log("🙋 Creating new Stripe customer for authenticated user...");
        const customer = await stripe.customers.create({ email: user.email });
        customerId = customer.id;

        const { error: updateError } = await supabaseClient
          .from("profile")
          .update({ stripe_customer_id: customerId })
          .eq("id", user.id);

        if (updateError) {
          console.error("❌ Failed to update customer ID in Supabase:", updateError.message);
          // Potentially non-fatal, Stripe customer is created.
        }
      }
    } else {
      console.log("Proceeding without specific Stripe customer (guest or anonymous user).");
    }


    const lineItems = cartItems.map((item: any) => {
      if (!item.supplement || typeof item.supplement.price !== 'number' || typeof item.quantity !== 'number') {
        console.error("Invalid item structure:", item);
        throw new Error("One or more cart items have invalid structure or missing price/quantity.");
      }
      return {
        price_data: {
          currency: "gbp", // Changed to GBP
          product_data: {
            name: item.supplement.name || "Supplement", // Use supplement properties
            images: item.supplement.image ? [item.supplement.image] : [],
            // description: item.supplement.description, // description is not sent from frontend
          },
          unit_amount: Math.round(item.supplement.price * 100), // Ensure integer, use supplement properties
        },
        quantity: item.quantity,
      };
    });

    console.log("💳 Creating Stripe checkout session...");
    const sessionCreateParams: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ["card"],
      mode: "payment",
      line_items: lineItems,
      success_url: `${Deno.env.get("FRONTEND_URL")}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${Deno.env.get("FRONTEND_URL")}/cart`,
    };
    
    if (customerId) {
      sessionCreateParams.customer = customerId;
    } else if (user && user.email) { // If no customerId but user email exists, Stripe can use it
        sessionCreateParams.customer_email = user.email;
    } else {
      // For truly anonymous guests, Stripe will collect email on its page if configured
      sessionCreateParams.customer_creation = 'if_required'; 
    }


    const session = await stripe.checkout.sessions.create(sessionCreateParams);

    console.log("✅ Session created:", session.id, "URL:", session.url);

    return new Response(JSON.stringify({ url: session.url }), { // Stripe expects 'id' for redirectToCheckout, but we redirect manually
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("🔥 Error during checkout session creation:", {
      message: error?.message,
      stack: error?.stack,
    });

    return new Response(JSON.stringify({ error: error.message || "Internal Server Error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

