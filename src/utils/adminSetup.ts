/**
 * Admin Setup Utilities
 * 
 * This module provides utilities for setting up admin access
 * and managing admin configurations in development and production.
 */

import { setAdminFlag, getSecurityConfig } from '@/utils/securityConfig';
import { logSecurity } from '@/utils/logger';

/**
 * Quick admin setup for development
 * Only works in development mode for security
 */
export const enableAdminAccess = (): void => {
  const config = getSecurityConfig();
  
  if (!config.isDevelopment) {
    console.warn('🔐 Admin Setup: Admin utilities are disabled in production for security');
    return;
  }

  try {
    const success = setAdminFlag(true);
    if (success) {
      console.log('🔐 Admin Setup: Admin access enabled via localStorage');
      console.log('🔐 Admin Setup: You can now access /admin route');
      console.log('🔐 Admin Setup: Refresh the page to apply changes');
      
      logSecurity('admin_setup_enabled', {
        method: 'localStorage',
        timestamp: new Date().toISOString()
      });
    } else {
      console.warn('🔐 Admin Setup: Could not enable admin access');
    }
  } catch (error) {
    console.error('🔐 Admin Setup: Error enabling admin access:', error);
  }
};

/**
 * Disable admin access
 */
export const disableAdminAccess = (): void => {
  const config = getSecurityConfig();
  
  if (!config.isDevelopment) {
    console.warn('🔐 Admin Setup: Admin utilities are disabled in production for security');
    return;
  }

  try {
    const success = setAdminFlag(false);
    if (success) {
      console.log('🔐 Admin Setup: Admin access disabled');
      console.log('🔐 Admin Setup: Refresh the page to apply changes');
      
      logSecurity('admin_setup_disabled', {
        method: 'localStorage',
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('🔐 Admin Setup: Error disabling admin access:', error);
  }
};

/**
 * Check current admin status
 */
export const checkAdminStatus = (): void => {
  try {
    const adminFlag = localStorage.getItem('fynda-admin');
    const envAdmin = import.meta.env.VITE_ADMIN_MODE === 'true';
    
    console.log('🔐 Admin Setup: Current admin status:', {
      localStorage: adminFlag === 'true',
      environment: envAdmin,
      timestamp: new Date().toISOString()
    });
    
    if (adminFlag === 'true' || envAdmin) {
      console.log('✅ Admin access is currently ENABLED');
    } else {
      console.log('❌ Admin access is currently DISABLED');
    }
  } catch (error) {
    console.error('🔐 Admin Setup: Error checking admin status:', error);
  }
};

/**
 * Development helper - Make admin functions available globally
 * Only available in development mode
 */
export const setupDevelopmentHelpers = (): void => {
  const config = getSecurityConfig();
  
  if (!config.isDevelopment) {
    return; // Silently exit in production
  }

  // Make admin functions available in browser console
  (window as any).fyndaAdmin = {
    enable: enableAdminAccess,
    disable: disableAdminAccess,
    status: checkAdminStatus,
    help: () => {
      console.log(`
🔐 Fynda Admin Console Help:

Available commands:
- fyndaAdmin.enable()  - Enable admin access via localStorage
- fyndaAdmin.disable() - Disable admin access
- fyndaAdmin.status()  - Check current admin status
- fyndaAdmin.help()    - Show this help message

Admin access methods:
1. localStorage: fyndaAdmin.enable()
2. Environment: Set VITE_ADMIN_MODE=true in .env.local
3. Database: Add your email to admins table in Supabase

After enabling admin access, refresh the page and navigate to /admin
      `);
    }
  };
  
  console.log('🔐 Admin Setup: Development helpers loaded');
  console.log('🔐 Admin Setup: Type "fyndaAdmin.help()" for available commands');
};

// Auto-setup development helpers in development mode
const config = getSecurityConfig();
if (config.isDevelopment) {
  setupDevelopmentHelpers();
}
