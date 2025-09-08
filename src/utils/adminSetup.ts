/**
 * Admin Setup Utilities
 * 
 * This module provides utilities for setting up admin access
 * and managing admin configurations in development and production.
 */

import { setAdminFlag, logSecurityEvent } from './security';

/**
 * Quick admin setup for development
 * Call this function in browser console to enable admin access
 */
export const enableAdminAccess = (): void => {
  try {
    setAdminFlag(true);
    console.log('🔐 Admin Setup: Admin access enabled via localStorage');
    console.log('🔐 Admin Setup: You can now access /admin route');
    console.log('🔐 Admin Setup: Refresh the page to apply changes');
    
    logSecurityEvent('admin_setup_enabled', {
      method: 'localStorage',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('🔐 Admin Setup: Error enabling admin access:', error);
  }
};

/**
 * Disable admin access
 */
export const disableAdminAccess = (): void => {
  try {
    setAdminFlag(false);
    console.log('🔐 Admin Setup: Admin access disabled');
    console.log('🔐 Admin Setup: Refresh the page to apply changes');
    
    logSecurityEvent('admin_setup_disabled', {
      method: 'localStorage',
      timestamp: new Date().toISOString()
    });
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
  if (import.meta.env.DEV) {
    // Make admin functions available in browser console
    (window as Record<string, unknown>).fyndaAdmin = {
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
3. Database: Add your email to admin_users table in Supabase

After enabling admin access, refresh the page and navigate to /admin
        `);
      }
    };
    
    console.log('🔐 Admin Setup: Development helpers loaded');
    console.log('🔐 Admin Setup: Type "fyndaAdmin.help()" for available commands');
  }
};

// Auto-setup development helpers in development mode
if (import.meta.env.DEV) {
  setupDevelopmentHelpers();
}
