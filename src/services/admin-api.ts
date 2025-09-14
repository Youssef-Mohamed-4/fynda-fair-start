import { supabase } from '@/integrations/supabase/client';
import { AdminData } from '@/types/auth';
import { logAuth, logSecurity, logger } from '@/utils/logger';
import { WaitlistApiService } from './waitlist-api';

export const authenticateAdmin = async (email: string, password: string) => {
  try {
    logAuth('Admin authentication attempt');
    logSecurity('admin_login_attempt', { email });
    
    // First authenticate with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) {
      logAuth('Admin auth error', { error: authError.message });
      logSecurity('admin_login_failed', { email, error: authError.message });
      throw new Error(authError.message);
    }

    if (!authData.user) {
      throw new Error('Authentication failed - no user returned');
    }

    logAuth('Auth successful, checking admin status...');

    // Check if user is admin
    const { data: adminUser, error: adminError } = await supabase
      .from('admins')
      .select('id, email, role')
      .eq('email', authData.user.email!)
      .single();

    if (adminError || !adminUser) {
      logAuth('Admin check failed');
      logSecurity('admin_access_denied', { email });
      await supabase.auth.signOut(); // Clean up auth session
      throw new Error('Admin user not found. Please contact your administrator.');
    }

    logAuth('Admin user authenticated successfully');
    logSecurity('admin_login_success', { email, role: adminUser.role });
    localStorage.setItem('fynda-admin', 'true');

    return {
      success: true,
      user: authData.user,
      admin: {
        id: adminUser.id,
        email: adminUser.email,
        isSuperAdmin: adminUser.role === 'superadmin'
      }
    };
  } catch (error) {
    logAuth('Admin authentication error', { error });
    throw error;
  }
};

/**
 * Get admin data from Supabase
 */
export const getAdminData = async (): Promise<AdminData> => {
  try {
    logger.info('Fetching admin data');

    const employers = await WaitlistApiService.fetchEmployerEntries();

    logger.info('Admin data fetched successfully');
    return {
      employers: employers || []
    };
  } catch (error) {
    logger.error('Admin data fetch error', { error });
    throw error;
  }
};

/**
 * Check if admin is authenticated
 */
export const isAdminAuthenticated = (): boolean => {
  const token = localStorage.getItem('admin_token');
  const adminFlag = localStorage.getItem('fynda-admin');
  
  if (adminFlag === 'true') {
    return true;
  }
  
  if (!token) {
    return false;
  }

  try {
    const payload = JSON.parse(atob(token));
    const now = Math.floor(Date.now() / 1000);
    
    return payload.exp > now;
  } catch (error) {
    localStorage.removeItem('admin_token');
    return false;
  }
};

/**
 * Logout admin
 */
export const logoutAdmin = () => {
  localStorage.removeItem('admin_token');
  localStorage.removeItem('fynda-admin');
};

/**
 * Get admin token
 */
export const getAdminToken = (): string | null => {
  return localStorage.getItem('admin_token');
};

/**
 * Validate admin token
 */
export const validateAdminToken = async (): Promise<boolean> => {
  try {
    const token = getAdminToken();
    const adminFlag = localStorage.getItem('fynda-admin');
    
    if (adminFlag === 'true') {
      return true;
    }
    
    if (!token) {
      return false;
    }

    const payload = JSON.parse(atob(token));
    const now = Math.floor(Date.now() / 1000);
    
    return payload.exp > now;
  } catch (error) {
    return false;
  }
};