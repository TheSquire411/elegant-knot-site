// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://rpcnysgxybcffnprttar.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwY255c2d4eWJjZmZucHJ0dGFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0Mzg0NzEsImV4cCI6MjA2NzAxNDQ3MX0.SRW1RxKoEMnELP_n2HABctZls_niw6a5_D6PsSxvhUM";

// Validate required environment variables
if (!SUPABASE_URL) {
  throw new Error('Missing VITE_SUPABASE_URL environment variable');
}
if (!SUPABASE_PUBLISHABLE_KEY) {
  throw new Error('Missing VITE_SUPABASE_ANON_KEY environment variable');
}

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});