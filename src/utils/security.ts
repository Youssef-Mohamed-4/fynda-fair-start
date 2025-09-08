/**
 * Security Utilities - Enhanced Security Functions
 * 
 * This module provides security utilities for:
 * - Admin access management
 * - Input sanitization
 * - Rate limiting
 * - Security logging
 * - Environment configuration
 */

// Admin access configuration
export const ADMIN_CONFIG = {
  // localStorage key for admin flag
  ADMIN_FLAG_KEY: 'fynda-admin',
  
  // Environment variable for admin mode
  ADMIN_ENV_KEY: 'VITE_ADMIN_MODE',
  
  // Rate limiting configuration
  RATE_LIMIT: {
    WAITLIST_SUBMISSION: 60000, // 1 minute between waitlist submissions
    LOGIN_ATTEMPTS: 5, // Max login attempts
    LOGIN_BLOCK_DURATION: 15 * 60 * 1000, // 15 minutes block
  },
  
  // Input validation limits
  INPUT_LIMITS: {
    MAX_NAME_LENGTH: 100,
    MIN_NAME_LENGTH: 2,
    MAX_EMAIL_LENGTH: 254,
    MAX_DESCRIPTION_LENGTH: 500,
  }
} as const;

/**
 * Check if user has admin access through any method
 * @returns boolean indicating admin access
 */
export const hasAdminAccess = (): boolean => {
  try {
    // Check localStorage admin flag
    const localStorageAdmin = localStorage.getItem(ADMIN_CONFIG.ADMIN_FLAG_KEY) === 'true';
    
    // Check environment variable
    const envAdmin = import.meta.env[ADMIN_CONFIG.ADMIN_ENV_KEY] === 'true';
    
    // Log admin access check for security monitoring
    console.log('🔐 Security: Admin access check', {
      localStorage: localStorageAdmin,
      environment: envAdmin,
      timestamp: new Date().toISOString()
    });
    
    return localStorageAdmin || envAdmin;
  } catch (error) {
    console.error('🔐 Security: Error checking admin access:', error);
    return false;
  }
};

/**
 * Set admin flag in localStorage
 * @param isAdmin - Whether to set admin access
 */
export const setAdminFlag = (isAdmin: boolean): void => {
  try {
    if (isAdmin) {
      localStorage.setItem(ADMIN_CONFIG.ADMIN_FLAG_KEY, 'true');
      console.log('🔐 Security: Admin flag set in localStorage');
    } else {
      localStorage.removeItem(ADMIN_CONFIG.ADMIN_FLAG_KEY);
      console.log('🔐 Security: Admin flag removed from localStorage');
    }
  } catch (error) {
    console.error('🔐 Security: Error setting admin flag:', error);
  }
};

/**
 * Enhanced input sanitization
 * @param input - Input string to sanitize
 * @returns Sanitized string
 */
export const sanitizeInput = (input: string): string => {
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
    .substring(0, ADMIN_CONFIG.INPUT_LIMITS.MAX_DESCRIPTION_LENGTH);
};

/**
 * Enhanced email validation with security checks
 * @param email - Email to validate
 * @returns boolean indicating valid email
 */
export const validateEmail = (email: string): boolean => {
  if (typeof email !== 'string') return false;
  
  // Basic email regex
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  // Additional security checks
  const sanitizedEmail = email.trim().toLowerCase();
  
  // Check for suspicious patterns
  if (sanitizedEmail.includes('..') || 
      sanitizedEmail.startsWith('.') || 
      sanitizedEmail.endsWith('.') ||
      sanitizedEmail.length > ADMIN_CONFIG.INPUT_LIMITS.MAX_EMAIL_LENGTH) {
    return false;
  }
  
  return emailRegex.test(sanitizedEmail);
};

/**
 * Rate limiting helper
 * @param key - Unique key for rate limiting
 * @param limit - Time limit in milliseconds
 * @returns boolean indicating if request is allowed
 */
export const checkRateLimit = (key: string, limit: number): boolean => {
  try {
    const now = Date.now();
    const lastRequest = localStorage.getItem(`rate-limit-${key}`);
    
    if (lastRequest) {
      const timeDiff = now - parseInt(lastRequest);
      
      if (timeDiff < limit) {
        console.log(`🔐 Security: Rate limit exceeded for ${key}`);
        return false;
      }
    }
    
    localStorage.setItem(`rate-limit-${key}`, now.toString());
    return true;
  } catch (error) {
    console.error('🔐 Security: Error checking rate limit:', error);
    return false;
  }
};

/**
 * Security logging utility
 * @param event - Security event to log
 * @param details - Additional details
 */
export const logSecurityEvent = (event: string, details?: Record<string, unknown>): void => {
  const logEntry = {
    event,
    details,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href
  };
  
  console.log('🔐 Security Event:', logEntry);
  
  // In production, you might want to send this to a security monitoring service
  // Example: sendToSecurityService(logEntry);
};

/**
 * Validate name input
 * @param name - Name to validate
 * @returns Validation result
 */
export const validateName = (name: string): { isValid: boolean; error?: string } => {
  const sanitized = sanitizeInput(name);
  
  if (!sanitized) {
    return { isValid: false, error: 'Name is required' };
  }
  
  if (sanitized.length < ADMIN_CONFIG.INPUT_LIMITS.MIN_NAME_LENGTH) {
    return { isValid: false, error: `Name must be at least ${ADMIN_CONFIG.INPUT_LIMITS.MIN_NAME_LENGTH} characters` };
  }
  
  if (sanitized.length > ADMIN_CONFIG.INPUT_LIMITS.MAX_NAME_LENGTH) {
    return { isValid: false, error: `Name must be less than ${ADMIN_CONFIG.INPUT_LIMITS.MAX_NAME_LENGTH} characters` };
  }
  
  return { isValid: true };
};

/**
 * Get security configuration for current environment
 * @returns Security configuration object
 */
export const getSecurityConfig = () => {
  return {
    isDevelopment: import.meta.env.DEV,
    isProduction: import.meta.env.PROD,
    strictSecurity: import.meta.env.VITE_STRICT_SECURITY === 'true',
    debugSecurity: import.meta.env.VITE_DEBUG_SECURITY === 'true',
    adminMode: import.meta.env[ADMIN_CONFIG.ADMIN_ENV_KEY] === 'true'
  };
};
