import { supabase } from '@/integrations/supabase/client';

interface WaitlistCandidateData {
  name: string;
  email: string;
  currentState: string;
  fieldOfStudy: string;
  fieldDescription?: string;
}

interface WaitlistEmployerData {
  name: string;
  email: string;
  role: string;
  roleOther?: string;
  earlyCareersPerYear?: number;
}

export const submitWaitlistEntry = async (
  type: 'candidate' | 'employer', 
  data: WaitlistCandidateData | WaitlistEmployerData
) => {
  try {
    // Only support employer type since we only have employers_waitlist table
    if (type === 'candidate') {
      throw new Error('Candidate registration is not available yet');
    }
    
    const employerData = data as WaitlistEmployerData;
    const insertData = {
      name: employerData.name,
      email: employerData.email,
      industry: employerData.role || 'Other', // Map role to industry for now
      company_size: 'Not specified', // Default value
      early_career_hires_per_year: employerData.earlyCareersPerYear?.toString() || null
    };

    console.log('🔄 Submitting to employers_waitlist:', insertData);

    const { data: result, error } = await supabase
      .from('employers_waitlist')
      .insert(insertData)
      .select();

    if (error) {
      console.error('❌ Supabase error:', error);
      if (error.code === '23505') {
        throw new Error(`This email is already registered in our ${type} waitlist!`);
      }
      throw new Error(error.message || 'Failed to submit waitlist entry');
    }

    console.log('✅ Waitlist entry submitted successfully:', result);
    return { success: true, data: result };
  } catch (error) {
    console.error('❌ Waitlist submission error:', error);
    throw error;
  }
};

export const authenticateAdmin = async (email: string, password: string) => {
  try {
    console.log('🔐 Attempting admin login for:', email);
    
    // First authenticate with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      console.error('🔐 Supabase auth error:', authError);
      throw new Error(authError.message);
    }

    if (!authData.user) {
      throw new Error('Authentication failed - no user returned');
    }

    console.log('🔐 Auth successful, checking admin status...');

    // Check if user is admin
    const { data: adminUser, error: adminError } = await supabase
      .from('admins')
      .select('id, email, role')
      .eq('email', authData.user.email!)
      .single();

    if (adminError || !adminUser) {
      console.error('🔐 Admin check error:', adminError);
      await supabase.auth.signOut(); // Clean up auth session
      throw new Error('Admin user not found. Please contact your administrator.');
    }

    console.log('🔐 Admin user found:', adminUser);
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
    console.error('🔐 Admin authentication error:', error);
    throw error;
  }
};

/**
 * Get admin data from Supabase
 */
export const getAdminData = async () => {
  try {
    const employersResult = await supabase
      .from('employers_waitlist')
      .select('*')
      .order('created_at', { ascending: false });

    if (employersResult.error) throw employersResult.error;

    return {
      candidates: [], // No candidates table available
      employers: employersResult.data || []
    };
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
