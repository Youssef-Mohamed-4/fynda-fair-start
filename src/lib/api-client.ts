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
    const tableName = type === 'candidate' ? 'waitlist_candidates' : 'waitlist_employers';
    
    let insertData: any = {};
    
    if (type === 'candidate') {
      const candidateData = data as WaitlistCandidateData;
      insertData = {
        name: candidateData.name,
        email: candidateData.email,
        current_state: candidateData.currentState,
        field_of_study: candidateData.fieldOfStudy,
        field_description: candidateData.fieldDescription || null
      };
    } else {
      const employerData = data as WaitlistEmployerData;
      insertData = {
        name: employerData.name,
        email: employerData.email,
        role: employerData.role,
        early_careers_per_year: employerData.earlyCareersPerYear || null
      };
    }

    console.log('🔄 Submitting to table:', tableName, insertData);

    const { data: result, error } = await supabase
      .from(tableName)
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
      .from('admin_users')
      .select('id, email, is_super_admin')
      .eq('user_id', authData.user.id)
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
        isSuperAdmin: adminUser.is_super_admin
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
    const [candidatesResult, employersResult] = await Promise.all([
      supabase.from('waitlist_candidates').select('*').order('created_at', { ascending: false }),
      supabase.from('waitlist_employers').select('*').order('created_at', { ascending: false })
    ]);

    if (candidatesResult.error) throw candidatesResult.error;
    if (employersResult.error) throw employersResult.error;

    return {
      candidates: candidatesResult.data || [],
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
