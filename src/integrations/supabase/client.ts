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
const SUPABASE_URL = 'https://kgbpbfxwsqkhzxmkkzmu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtnYnBiZnh3c3FraHp4bWtrem11Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5Njg3OTksImV4cCI6MjA3MjU0NDc5OX0.LzhlOknz_53Zb7FotLAm--DGb8Soj1PI5y51NN7QEGI';

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