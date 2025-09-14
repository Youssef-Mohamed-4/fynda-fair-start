import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface WaitlistData {
  name: string;
  email: string;
  industry: string;
  company_size: string;
  early_career_hires_per_year?: number;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Only allow POST requests
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse request body
    const data: WaitlistData = await req.json();
    console.log('📥 Received waitlist submission:', { 
      email: data.email, 
      industry: data.industry,
      company_size: data.company_size 
    });

    // Validate required fields
    if (!data.name || !data.email || !data.industry || !data.company_size) {
      console.error('❌ Missing required fields:', data);
      return new Response(
        JSON.stringify({ error: 'Missing required fields: name, email, industry, and company_size are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client with service role key
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Insert data into employers_waitlist table
    const { data: result, error } = await supabase
      .from('employers_waitlist')
      .insert({
        name: data.name.trim(),
        email: data.email.toLowerCase().trim(),
        industry: data.industry,
        company_size: data.company_size,
        early_career_hires_per_year: data.early_career_hires_per_year || null
      })
      .select();

    if (error) {
      console.error('❌ Supabase insertion error:', error);
      
      // Handle duplicate email error
      if (error.code === '23505') {
        return new Response(
          JSON.stringify({ error: 'This email is already registered for the waitlist' }),
          { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ error: 'Failed to submit waitlist entry' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('✅ Waitlist entry submitted successfully:', result?.[0]?.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: result?.[0],
        message: 'Successfully joined the waitlist!' 
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});