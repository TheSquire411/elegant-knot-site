import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SignupRequest {
  email: string;
  password: string;
  fullName: string;
  username: string;
}

interface RateLimitCheck {
  blocked: boolean;
  attempts_remaining: number;
  reset_time?: string;
}

// Helper function to get client IP
function getClientIP(req: Request): string {
  const xff = req.headers.get('x-forwarded-for');
  const realIP = req.headers.get('x-real-ip');
  const cfIP = req.headers.get('cf-connecting-ip');
  
  return cfIP || realIP || (xff && xff.split(',')[0]) || 'unknown';
}

// Helper function to validate input
function validateSignupData(data: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!data.email || typeof data.email !== 'string') {
    errors.push('Email is required');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Invalid email format');
  }
  
  if (!data.password || typeof data.password !== 'string') {
    errors.push('Password is required');
  } else if (data.password.length < 6) {
    errors.push('Password must be at least 6 characters');
  }
  
  if (!data.fullName || typeof data.fullName !== 'string') {
    errors.push('Full name is required');
  } else if (data.fullName.length > 100) {
    errors.push('Full name too long');
  }
  
  if (!data.username || typeof data.username !== 'string') {
    errors.push('Username is required');
  } else if (data.username.length > 50) {
    errors.push('Username too long');
  }
  
  return { valid: errors.length === 0, errors };
}

// Helper function to sanitize input
function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Get request data
    const requestData: SignupRequest = await req.json();
    const clientIP = getClientIP(req);
    
    console.log('Signup attempt from IP:', clientIP, 'Email:', requestData.email);

    // Validate input
    const validation = validateSignupData(requestData);
    if (!validation.valid) {
      console.log('Validation failed:', validation.errors);
      return new Response(
        JSON.stringify({ error: validation.errors.join(', ') }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Sanitize inputs
    const email = sanitizeInput(requestData.email.toLowerCase());
    const fullName = sanitizeInput(requestData.fullName);
    const username = sanitizeInput(requestData.username);

    // Check rate limits
    console.log('Checking rate limits...');

    // Check IP-based rate limit (5 attempts per hour)
    const { data: ipLimit } = await supabase.rpc('check_auth_rate_limit', {
      p_identifier: clientIP,
      p_limit_type: 'ip',
      p_max_attempts: 5,
      p_window_minutes: 60
    }) as { data: RateLimitCheck };

    if (ipLimit?.blocked) {
      console.log('IP blocked:', clientIP);
      return new Response(
        JSON.stringify({ 
          error: 'Too many signup attempts from this IP. Please try again later.',
          blocked_until: ipLimit.reset_time
        }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check email-based rate limit (3 attempts per hour)
    const { data: emailLimit } = await supabase.rpc('check_auth_rate_limit', {
      p_identifier: email,
      p_limit_type: 'email',
      p_max_attempts: 3,
      p_window_minutes: 60
    }) as { data: RateLimitCheck };

    if (emailLimit?.blocked) {
      console.log('Email blocked:', email);
      return new Response(
        JSON.stringify({ 
          error: 'Too many signup attempts with this email. Please try again later.',
          blocked_until: emailLimit.reset_time
        }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check global rate limit (100 signups per minute)
    const { data: globalLimit } = await supabase.rpc('check_auth_rate_limit', {
      p_identifier: 'global',
      p_limit_type: 'global',
      p_max_attempts: 100,
      p_window_minutes: 1
    }) as { data: RateLimitCheck };

    if (globalLimit?.blocked) {
      console.log('Global rate limit exceeded');
      return new Response(
        JSON.stringify({ 
          error: 'Service temporarily unavailable. Please try again in a moment.',
          blocked_until: globalLimit.reset_time
        }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Attempt to create user
    console.log('Creating user with email:', email);
    
    const { data: userData, error: signUpError } = await supabase.auth.admin.createUser({
      email,
      password: requestData.password,
      email_confirm: true, // Auto-confirm email to avoid email verification in development
      user_metadata: {
        full_name: fullName,
        username: username
      }
    });

    if (signUpError) {
      console.error('Signup error:', signUpError);
      
      // Handle specific Supabase errors
      if (signUpError.message.includes('already registered')) {
        return new Response(
          JSON.stringify({ error: 'An account with this email already exists' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: 'Account creation failed. Please try again.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('User created successfully:', userData.user?.id);

    // Success response
    return new Response(
      JSON.stringify({ 
        message: 'Account created successfully',
        user: {
          id: userData.user?.id,
          email: userData.user?.email
        }
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});