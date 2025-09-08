/**
 * Secure Waitlist API Endpoint
 * 
 * This server-side API handles waitlist submissions securely:
 * - Validates and sanitizes all inputs
 * - Uses Supabase service key (server-side only)
 * - Prevents XSS and injection attacks
 * - Rate limiting and spam protection
 * - No sensitive data exposed to frontend
 */

import { createClient } from '@supabase/supabase-js';

// Server-side Supabase client with service key (NEVER expose this to frontend)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Service key, not anon key

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing required Supabase environment variables');
}

// Create server-side Supabase client with service key
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

/**
 * Input sanitization and validation
 */
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';
  
  return input
    .trim()
    // Remove potentially dangerous characters
    .replace(/[<>'"&]/g, '')
    // Remove script tags and javascript: protocols
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    // Remove data: URLs that could contain scripts
    .replace(/data:text\/html/gi, '')
    // Remove SQL injection patterns
    .replace(/(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/gi, '')
    // Limit length to prevent buffer overflow attacks
    .substring(0, 500);
};

const validateEmail = (email) => {
  if (typeof email !== 'string') return false;
  
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  const sanitizedEmail = email.trim().toLowerCase();
  
  // Check for suspicious patterns
  if (sanitizedEmail.includes('..') || 
      sanitizedEmail.startsWith('.') || 
      sanitizedEmail.endsWith('.') ||
      sanitizedEmail.length > 254) {
    return false;
  }
  
  return emailRegex.test(sanitizedEmail);
};

const validateName = (name) => {
  const sanitized = sanitizeInput(name);
  
  if (!sanitized) {
    return { isValid: false, error: 'Name is required' };
  }
  
  if (sanitized.length < 2) {
    return { isValid: false, error: 'Name must be at least 2 characters' };
  }
  
  if (sanitized.length > 100) {
    return { isValid: false, error: 'Name must be less than 100 characters' };
  }
  
  return { isValid: true, sanitized };
};

/**
 * Rate limiting using simple in-memory store
 * In production, use Redis or database for rate limiting
 */
const rateLimitStore = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 5; // Max 5 requests per minute per IP

const checkRateLimit = (ip) => {
  const now = Date.now();
  const key = `rate_limit_${ip}`;
  
  if (!rateLimitStore.has(key)) {
    rateLimitStore.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }
  
  const data = rateLimitStore.get(key);
  
  if (now > data.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }
  
  if (data.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }
  
  data.count++;
  return true;
};

/**
 * CORS headers for security
 */
const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || 'https://fynda.com',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
};

/**
 * Main API handler
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
    if (!checkRateLimit(clientIP)) {
      console.log(`Rate limit exceeded for IP: ${clientIP}`);
      res.status(429).json({ 
        error: 'Too many requests. Please try again later.',
        retryAfter: 60 
      });
      return;
    }

    const { type, data } = req.body;

    // Validate request structure
    if (!type || !data) {
      res.status(400).json({ error: 'Invalid request format' });
      return;
    }

    // Validate type
    if (!['candidate', 'employer'].includes(type)) {
      res.status(400).json({ error: 'Invalid waitlist type' });
      return;
    }

    // Sanitize and validate inputs
    const sanitizedData = {};
    
    // Common fields
    const nameValidation = validateName(data.name);
    if (!nameValidation.isValid) {
      res.status(400).json({ error: nameValidation.error });
      return;
    }
    sanitizedData.name = nameValidation.sanitized;

    if (!validateEmail(data.email)) {
      res.status(400).json({ error: 'Invalid email address' });
      return;
    }
    sanitizedData.email = data.email.trim().toLowerCase();

    // Type-specific validation
    if (type === 'candidate') {
      const validStates = ['final_year', 'fresh_graduate', 'early_career', 'student'];
      if (!validStates.includes(data.currentState)) {
        res.status(400).json({ error: 'Invalid current state' });
        return;
      }
      sanitizedData.current_state = data.currentState;
      sanitizedData.field_of_study = sanitizeInput(data.fieldOfStudy);
      
      if (data.fieldDescription) {
        sanitizedData.field_description = sanitizeInput(data.fieldDescription);
      }
    } else if (type === 'employer') {
      sanitizedData.role = sanitizeInput(data.role);
      if (data.roleOther) {
        sanitizedData.role_other = sanitizeInput(data.roleOther);
      }
      if (data.earlyCareersPerYear) {
        const num = parseInt(data.earlyCareersPerYear);
        if (isNaN(num) || num < 0) {
          res.status(400).json({ error: 'Invalid number for early careers per year' });
          return;
        }
        sanitizedData.early_careers_per_year = num;
      }
    }

    // Insert into database using service key
    const tableName = type === 'candidate' ? 'waitlist_candidates' : 'waitlist_employers';
    
    const { data: result, error } = await supabase
      .from(tableName)
      .insert([sanitizedData])
      .select();

    if (error) {
      console.error('Database error:', error);
      
      if (error.code === '23505') { // Unique constraint violation
        res.status(409).json({ 
          error: `This email is already registered in our ${type} waitlist!` 
        });
        return;
      }
      
      res.status(500).json({ error: 'Failed to save waitlist entry' });
      return;
    }

    // Log successful submission (without sensitive data)
    console.log(`Waitlist submission successful: ${type} from IP: ${clientIP}`);

    // Return success response
    res.status(201).json({ 
      success: true, 
      message: `Successfully added to ${type} waitlist`,
      id: result[0]?.id 
    });

  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
