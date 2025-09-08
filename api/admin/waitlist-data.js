/**
 * Secure Admin API - Waitlist Data
 * 
 * This server-side API provides secure access to waitlist data for admin dashboard:
 * - Server-side authentication using environment variables
 * - Uses Supabase service key (never exposed to frontend)
 * - Rate limiting and access logging
 * - No sensitive data exposed to frontend
 */

import { createClient } from '@supabase/supabase-js';

// Server-side Supabase client with service key
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing required Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

/**
 * Admin authentication using environment variables
 */
const authenticateAdmin = (req) => {
  const adminToken = req.headers.authorization?.replace('Bearer ', '');
  const expectedToken = process.env.ADMIN_API_TOKEN;
  
  if (!expectedToken) {
    console.error('ADMIN_API_TOKEN not configured');
    return false;
  }
  
  return adminToken === expectedToken;
};

/**
 * Rate limiting for admin endpoints
 */
const adminRateLimitStore = new Map();
const ADMIN_RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const ADMIN_RATE_LIMIT_MAX_REQUESTS = 30; // Max 30 requests per minute

const checkAdminRateLimit = (ip) => {
  const now = Date.now();
  const key = `admin_rate_limit_${ip}`;
  
  if (!adminRateLimitStore.has(key)) {
    adminRateLimitStore.set(key, { count: 1, resetTime: now + ADMIN_RATE_LIMIT_WINDOW });
    return true;
  }
  
  const data = adminRateLimitStore.get(key);
  
  if (now > data.resetTime) {
    adminRateLimitStore.set(key, { count: 1, resetTime: now + ADMIN_RATE_LIMIT_WINDOW });
    return true;
  }
  
  if (data.count >= ADMIN_RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }
  
  data.count++;
  return true;
};

/**
 * CORS headers for admin API
 */
const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || 'https://fynda.com',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
};

/**
 * Main admin API handler
 */
export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.status(200).json({ message: 'CORS preflight' });
    return;
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    // Get client IP for rate limiting
    const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';
    
    // Check rate limit
    if (!checkAdminRateLimit(clientIP)) {
      console.log(`Admin rate limit exceeded for IP: ${clientIP}`);
      res.status(429).json({ 
        error: 'Too many requests. Please try again later.',
        retryAfter: 60 
      });
      return;
    }

    // Authenticate admin
    if (!authenticateAdmin(req)) {
      console.log(`Unauthorized admin access attempt from IP: ${clientIP}`);
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Get analytics data using service key
    const { data: analytics, error: analyticsError } = await supabase
      .from('waitlist_analytics_secure')
      .select('*');

    if (analyticsError) {
      console.error('Analytics query error:', analyticsError);
      res.status(500).json({ error: 'Failed to fetch analytics data' });
      return;
    }

    // Get site settings
    const { data: siteSettings, error: settingsError } = await supabase
      .from('site_settings')
      .select('*')
      .single();

    if (settingsError) {
      console.error('Settings query error:', settingsError);
      res.status(500).json({ error: 'Failed to fetch site settings' });
      return;
    }

    // Get recent waitlist entries (last 50 for each type)
    const { data: recentCandidates, error: candidatesError } = await supabase
      .from('waitlist_candidates')
      .select('id, name, email, current_state, field_of_study, created_at')
      .order('created_at', { ascending: false })
      .limit(50);

    const { data: recentEmployers, error: employersError } = await supabase
      .from('waitlist_employers')
      .select('id, name, email, role, early_careers_per_year, created_at')
      .order('created_at', { ascending: false })
      .limit(50);

    if (candidatesError || employersError) {
      console.error('Recent entries query error:', candidatesError || employersError);
      res.status(500).json({ error: 'Failed to fetch recent entries' });
      return;
    }

    // Log successful admin access
    console.log(`Admin data access successful from IP: ${clientIP}`);

    // Return sanitized data (no sensitive information)
    res.status(200).json({
      success: true,
      data: {
        analytics: analytics?.[0] || {
          total_candidates: 0,
          total_employers: 0,
          new_candidates_last_30d: 0,
          new_employers_last_30d: 0
        },
        siteSettings: siteSettings || {
          coming_soon_mode: false
        },
        recentEntries: {
          candidates: recentCandidates || [],
          employers: recentEmployers || []
        }
      }
    });

  } catch (error) {
    console.error('Admin API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
