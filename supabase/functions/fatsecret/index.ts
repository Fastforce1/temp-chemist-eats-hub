
// Import the correct base64 encoding function for Deno
function base64encode(str: string): string {
  return btoa(str);
}

// FatSecret API credentials - using values provided by the user
const CLIENT_ID = Deno.env.get("FATSECRET_CLIENT_ID") || "046b67a30c0a44dc8f8c4652428eeff7";
const CLIENT_SECRET = Deno.env.get("FATSECRET_CLIENT_SECRET") || "2fcd30eddcf4478db13dfe83eb5e8fb7";

// FatSecret API endpoints
const TOKEN_URL = "https://oauth.fatsecret.com/connect/token";
const API_URL = "https://platform.fatsecret.com/rest/server.api";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, apikey",
};

let accessToken: string | null = null;
let tokenExpiry: number | null = null;

/**
 * Get an OAuth access token
 */
const getAccessToken = async () => {
  try {
    const now = Date.now();
    if (accessToken && tokenExpiry && now < tokenExpiry) {
      return accessToken;
    }

    if (!CLIENT_ID || !CLIENT_SECRET) {
      console.error("Missing credentials:", {
        hasClientId: !!CLIENT_ID,
        hasClientSecret: !!CLIENT_SECRET
      });
      throw new Error("FatSecret API credentials are not configured");
    }

    const basicAuth = base64encode(`${CLIENT_ID}:${CLIENT_SECRET}`);
    
    console.log('Requesting new access token...'); // Debug log
    
    const response = await fetch(TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Basic ${basicAuth}`,
        "User-Agent": "Supabase Edge Function",
      },
      body: "grant_type=client_credentials&scope=basic",
    }).catch(error => {
      console.error('Token request network error:', {
        error,
        message: error.message,
        url: TOKEN_URL,
        credentials: 'Using provided CLIENT_ID and CLIENT_SECRET',
      });
      throw new Error(`Failed to connect to FatSecret auth endpoint: ${error.message}`);
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Token request failed:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
        url: TOKEN_URL,
      });
      throw new Error(`Authentication failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    if (!data.access_token) {
      console.error('Invalid token response:', data);
      throw new Error('Invalid token response from FatSecret API');
    }
    
    accessToken = data.access_token;
    tokenExpiry = now + (data.expires_in - 60) * 1000;
    
    console.log('Successfully obtained new access token'); // Debug log
    
    return accessToken;
  } catch (error) {
    console.error("Error getting access token:", {
      error,
      message: error.message,
      stack: error.stack,
    });
    throw error;
  }
};

/**
 * Make a request to the FatSecret API
 */
const makeApiRequest = async (method: string, params: Record<string, string> = {}) => {
  try {
    const token = await getAccessToken();
    
    const searchParams = new URLSearchParams({
      method,
      format: "json",
      ...params,
    });
    
    const url = `${API_URL}?${searchParams.toString()}`;
    console.log('Making request to FatSecret API:', {
      url,
      method,
      params,
      hasToken: !!token,
    });
    
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json",
        "User-Agent": "Supabase Edge Function",
      },
    }).catch(error => {
      console.error('API request network error:', {
        error,
        message: error.message,
        url,
        method,
        params,
      });
      throw new Error(`Network error connecting to FatSecret API: ${error.message}`);
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API request failed:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
        url,
        method,
        params,
      });
      throw new Error(`FatSecret API request failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    if (!data) {
      throw new Error('Empty response from FatSecret API');
    }
    
    return data;
  } catch (error) {
    console.error("Error in makeApiRequest:", {
      error,
      message: error.message,
      stack: error.stack,
      method,
      params,
    });
    throw error;
  }
};

// Handle requests with appropriate CORS headers
Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { 
      status: 204,
      headers: corsHeaders 
    });
  }

  try {
    // Parse the request body for POST requests
    let method, params;
    
    if (req.method === "POST") {
      const body = await req.json();
      method = body.method;
      params = body.params || {};
    } else {
      // For GET requests, parse from URL
      const url = new URL(req.url);
      method = url.searchParams.get("method");
      params = {};
      
      // Extract other parameters
      for (const [key, value] of url.searchParams.entries()) {
        if (key !== "method") {
          params[key] = value;
        }
      }
    }
    
    // Validate required method parameter
    if (!method) {
      return new Response(
        JSON.stringify({ error: "Method parameter is required" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }

    console.log('Processing request:', { 
      method, 
      params,
      hasClientId: !!CLIENT_ID,
      hasClientSecret: !!CLIENT_SECRET,
      requestMethod: req.method,
    });

    const data = await makeApiRequest(method, params);
    
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error) {
    console.error("Edge function error:", {
      error,
      message: error.message,
      stack: error.stack,
    });
    
    // Send a more detailed error response
    return new Response(
      JSON.stringify({ 
        error: error.message,
        type: error.constructor.name,
        details: error.stack,
        timestamp: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  }
});
