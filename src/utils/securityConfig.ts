/**
 * Security Configuration
 * 
 * This module provides secure configuration management and removes
 * development bypasses in production environments.
 */

interface SecurityConfig {
  isDevelopment: boolean;
  isProduction: boolean;
  adminMode: boolean;
  strictSecurity: boolean;
  debugSecurity: boolean;
  allowLocalStorageAdmin: boolean;
}

/**
 * Get security configuration for current environment
 * In production, development bypasses are disabled
 */
export const getSecurityConfig = (): SecurityConfig => {
  const isDevelopment = import.meta.env.DEV;
  const isProduction = import.meta.env.PROD;
  
  return {
    isDevelopment,
    isProduction,
    adminMode: isDevelopment && import.meta.env.VITE_ADMIN_MODE === 'true',
    strictSecurity: import.meta.env.VITE_STRICT_SECURITY === 'true' || isProduction,
    debugSecurity: isDevelopment && import.meta.env.VITE_DEBUG_SECURITY === 'true',
    // Only allow localStorage admin in development
    allowLocalStorageAdmin: isDevelopment
  };
};

/**
 * Check if admin access is allowed through fallback methods
 * This is only available in development mode
 */
export const hasAdminAccess = (): boolean => {
  const config = getSecurityConfig();
  
  // In production, only database authentication is allowed
  if (config.isProduction) {
    return false;
  }
  
  // In development, check localStorage and environment variables
  if (config.allowLocalStorageAdmin) {
    const localStorageAdmin = localStorage.getItem('fynda-admin') === 'true';
    return localStorageAdmin || config.adminMode;
  }
  
  return false;
};

/**
 * Set admin flag (only works in development)
 */
export const setAdminFlag = (isAdmin: boolean): boolean => {
  const config = getSecurityConfig();
  
  if (!config.allowLocalStorageAdmin) {
    console.warn('Admin flags are disabled in production for security');
    return false;
  }
  
  try {
    if (isAdmin) {
      localStorage.setItem('fynda-admin', 'true');
    } else {
      localStorage.removeItem('fynda-admin');
    }
    return true;
  } catch (error) {
    console.error('Error setting admin flag:', error);
    return false;
  }
};

/**
 * Clear all admin access flags
 */
export const clearAdminAccess = (): void => {
  try {
    localStorage.removeItem('fynda-admin');
    localStorage.removeItem('admin_token');
  } catch (error) {
    console.error('Error clearing admin access:', error);
  }
};