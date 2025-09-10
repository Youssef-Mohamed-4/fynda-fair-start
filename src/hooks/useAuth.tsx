import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { authenticateAdmin } from '@/lib/api-client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🔐 useAuth: Setting up auth state...');
    
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔐 Auth state change:', event, 'Session:', !!session);
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          // Check if user is admin by querying admin_users table
          try {
            const { data: adminUser } = await supabase
              .from('admin_users')
              .select('id, email, is_super_admin')
              .eq('user_id', session.user.id)
              .single();

            const isAdminUser = !!adminUser;
            setIsAdmin(isAdminUser);
            
            if (isAdminUser) {
              localStorage.setItem('fynda-admin', 'true');
            } else {
              localStorage.removeItem('fynda-admin');
            }
            
            console.log('🔐 Admin status updated:', isAdminUser);
          } catch (error) {
            console.log('🔐 User is not an admin');
            setIsAdmin(false);
            localStorage.removeItem('fynda-admin');
          }
        } else {
          setIsAdmin(false);
          localStorage.removeItem('fynda-admin');
        }
        
        setLoading(false);
      }
    );

    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('🔐 Initial session check:', !!session);
      if (!session) {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('🔐 useAuth signIn called');
      const result = await authenticateAdmin(email, password);
      return { error: null };
    } catch (error: any) {
      console.error('🔐 useAuth signIn error:', error);
      return { error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setIsAdmin(false);
  };

  const value = {
    user,
    session,
    isAdmin,
    loading,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
