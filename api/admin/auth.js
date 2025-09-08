/**
 * Secure Admin Authentication API
 * 
 * This server-side API handles admin authentication securely:
 * - Server-side credential validation
 * - JWT token generation for admin sessions
 * - Rate limiting and brute force protection
 * - No admin credentials exposed to frontend
 */

import jwt from 'jsonwebtoken';
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
 * Admin credentials validation (server-side only)
 */
const validateAdminCredentials = async (email, password) => {
  // In production, use proper admin credentials from environment variables
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  
  if (!adminEmail || !adminPassword) {
    console.error('Admin credentials not configured');
    return false;
  }
  
  // Basic credential validation
  if (email !== adminEmail || password !== adminPassword) {
    return false;
  }
  
  // Additional check: verify admin exists in database
  try {
    const { data: adminUser, error } = await supabase
      .from('admin_users')
      .select('id, email, is_super_admin')
      .eq('email', email)
      .single();
    
    if (error || !adminUser) {
      console.log(`Admin user not found in database: ${email}`);
      return false;
    }
    
    return { ...adminUser, isValid: true };
  } catch (error) {
    console.error('Database error during admin validation:', error);
    return false;
  }
};

/**
 * Generate JWT token for admin session
 */
const generateAdminToken = (adminData) => {
  const jwtSecret = process.env.JWT_SECRET;
  
  if (!jwtSecret) {
    throw new Error('JWT_SECRET not configured');
  }
  
  const payload = {
    adminId: adminData.id,
    email: adminData.email,
    isSuperAdmin: adminData.is_super_admin,
    type: 'admin',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
  };
  
  return jwt.sign(payload, jwtSecret);
};

/**
 * Rate limiting for authentication attempts
 */
const authRateLimitStore = new Map();
const AUTH_RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const AUTH_RATE_LIMIT_MAX_ATTEMPTS = 5; // Max 5 attempts per 15 minutes per IP

const checkAuthRateLimit = (ip) => {
  const now = Date.now();
  const key = `auth_rate_limit_${ip}`;
  
  if (!authRateLimitStore.has(key)) {
    authRateLimitStore.set(key, { count: 1, resetTime: now + AUTH_RATE_LIMIT_WINDOW });
    return true;
  }
  
  const data = authRateLimitStore.get(key);
  
  if (now > data.resetTime) {
    authRateLimitStore.set(key, { count: 1, resetTime: now + AUTH_RATE_LIMIT_WINDOW });
    return true;
  }
  
  if (data.count >= AUTH_RATE_LIMIT_MAX_ATTEMPTS) {
    return false;
  }
  
  data.count++;
  return true;
};

/**
 * CORS headers
 */
const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || 'https://fynda.com',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
};

/**
 * Main authentication handler
 */
export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.status(200).json({ message: 'CORS preflight' });
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    // Get client IP for rate limiting
    const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';
    
    // Check rate limit
    if (!checkAuthRateLimit(clientIP)) {
      console.log(`Auth rate limit exceeded for IP: ${clientIP}`);
      res.status(429).json({ 
        error: 'Too many authentication attempts. Please try again later.',
        retryAfter: 900 // 15 minutes
      });
      return;
    }

    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    // Validate admin credentials
    const adminData = await validateAdminCredentials(email, password);
    
    if (!adminData || !adminData.isValid) {
      console.log(`Failed admin login attempt from IP: ${clientIP}, email: ${email}`);
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    // Generate admin token
    const token = generateAdminToken(adminData);

    // Log successful authentication
    console.log(`Successful admin login from IP: ${clientIP}, email: ${email}`);

    // Return success with token
    res.status(200).json({
      success: true,
      message: 'Authentication successful',
      token,
      admin: {
        id: adminData.id,
        email: adminData.email,
        isSuperAdmin: adminData.is_super_admin
      }
    });

  } catch (error) {
    console.error('Admin auth API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
