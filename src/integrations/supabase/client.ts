/**
 * Secure Supabase Client Configuration
 * 
 * This client is configured to use environment variables for security:
 * - No hardcoded keys or URLs
 * - Uses public anon key only (safe for frontend)
 * - Service key is never exposed to frontend
 * - All sensitive operations go through secure API endpoints
 */

import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Get Supabase configuration from environment variables
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate required environment variables
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    'Missing required Supabase environment variables. Please check your .env file:\n' +
    '- VITE_SUPABASE_URL\n' +
    '- VITE_SUPABASE_ANON_KEY'
  );
}

// Create Supabase client with public anon key (safe for frontend)
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});

// Export configuration for debugging (development only)
if (import.meta.env.DEV) {
  console.log('🔐 Supabase client initialized with environment variables');
  console.log('🔐 URL:', SUPABASE_URL);
  console.log('🔐 Key type: anon (public)');
}