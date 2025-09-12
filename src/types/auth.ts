/**
 * Authentication and Admin Types
 */

import { User as SupabaseUser, Session } from '@supabase/supabase-js';

export interface AuthContextType {
  user: SupabaseUser | null;
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

export interface AdminUser {
  id: string;
  email: string;
  role: 'admin' | 'superadmin';
  created_at: string;
}

export interface WaitlistEmployerData {
  name: string;
  email: string;
  industry: string;
  company_size: string;
  early_career_hires_per_year?: number;
}

export interface AdminData {
  employers: Array<{
    id: string;
    name: string;
    email: string;
    industry: string;
    company_size: string;
    early_career_hires_per_year?: number | null;
    created_at: string;
  }>;
}