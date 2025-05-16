import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@12.1.0";
import { config } from "https://deno.land/x/dotenv@v3.2.0/mod.ts";

// Load environment variables
const env = config();

// Set default FRONTEND_URL if not provided
const FRONTEND_URL = Deno.env.get("FRONTEND_URL") || "http://localhost:8080";

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
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const stripe = Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, { apiVersion: "2022-11-15" });

    console.log("📦 Reading request body...");
    const body = await req.json();
    console.log("🛒 Cart body:", body);

    const cartItems = body.items;
    if (!cartItems || !Array.isArray(cartItems)) {
      throw new Error("Invalid cart items");
    }

    console.log("🔍 Checking for existing Stripe customer...");
    const { data: customerData, error: customerError } = await supabaseClient
      .from("profile")
      .select("stripe_customer_id")
      .eq("id", user.id)
      .single();

    if (customerError) throw new Error("DB error: " + customerError.message);

    let customerId = customerData?.stripe_customer_id;

    if (!customerId) {
      console.log("🙋 Creating new Stripe customer...");
      const customer = await stripe.customers.create({ email: user.email });
      customerId = customer.id;

      const { error: updateError } = await supabaseClient
        .from("profile")
        .update({ stripe_customer_id: customerId })
        .eq("id", user.id);

      if (updateError) {
        console.error("❌ Failed to update customer ID in Supabase:", updateError.message);
        throw new Error("Could not save Stripe customer ID.");
      }
    }

    const lineItems = cartItems.map((item: any) => ({
      price_data: {
        currency: "gbp",
        product_data: {
          name: item.supplement.name,
          images: item.supplement.image ? [item.supplement.image] : undefined,
          description: item.supplement.description || undefined,
        },
        unit_amount: Math.round(item.supplement.price * 100),
      },
      quantity: item.quantity,
    }));

    console.log("💳 Creating Stripe checkout session...");
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: lineItems,
      success_url: `${FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${FRONTEND_URL}/cart`,
      customer: customerId,
      metadata: {
        user_id: user.id
      }
    });

    console.log("✅ Session created:", session.id);

    return new Response(JSON.stringify({ id: session.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("🔥 Error during checkout session creation:", {
      message: error?.message,
      stack: error?.stack,
    });

    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
