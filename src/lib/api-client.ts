/**
 * Secure API Client
 * 
 * This client handles all communication with the secure server-side APIs:
 * - Waitlist submissions via secure API
 * - Admin authentication via secure API
 * - Admin data fetching via secure API
 * - No direct Supabase access from frontend
 * - Input validation and error handling
 */

// API Configuration
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api.fynda.com' 
  : 'http://localhost:3000/api';

/**
 * Secure waitlist submission
 */
export const submitWaitlistEntry = async (type: 'candidate' | 'employer', data: any) => {
  try {
    const response = await fetch(`${API_BASE_URL}/waitlist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type, data }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to submit waitlist entry');
    }

    return result;
  } catch (error) {
    console.error('Waitlist submission error:', error);
    throw error;
  }
};

/**
 * Admin authentication
 */
export const authenticateAdmin = async (email: string, password: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Authentication failed');
    }

    // Store admin token securely
    if (result.token) {
      localStorage.setItem('admin_token', result.token);
    }

    return result;
  } catch (error) {
    console.error('Admin authentication error:', error);
    throw error;
  }
};

/**
 * Get admin data (waitlist analytics, settings, etc.)
 */
export const getAdminData = async () => {
  try {
    const token = localStorage.getItem('admin_token');
    
    if (!token) {
      throw new Error('No admin token found');
    }

    const response = await fetch(`${API_BASE_URL}/admin/waitlist-data`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        // Token expired or invalid, clear it
        localStorage.removeItem('admin_token');
        throw new Error('Authentication expired. Please log in again.');
      }
      throw new Error(result.error || 'Failed to fetch admin data');
    }

    return result.data;
  } catch (error) {
    console.error('Admin data fetch error:', error);
    throw error;
  }
};

/**
 * Check if admin is authenticated
 */
export const isAdminAuthenticated = (): boolean => {
  const token = localStorage.getItem('admin_token');
  
  if (!token) {
    return false;
  }

  try {
    // Basic JWT validation (check if token exists and is not expired)
    const payload = JSON.parse(atob(token.split('.')[1]));
    const now = Math.floor(Date.now() / 1000);
    
    return payload.exp > now;
  } catch (error) {
    // Invalid token, remove it
    localStorage.removeItem('admin_token');
    return false;
  }
};

/**
 * Logout admin
 */
export const logoutAdmin = () => {
  localStorage.removeItem('admin_token');
  localStorage.removeItem('fynda-admin'); // Remove fallback admin flag
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
    
    if (!token) {
      return false;
    }

    // Try to fetch admin data to validate token
    await getAdminData();
    return true;
  } catch (error) {
    return false;
  }
};
