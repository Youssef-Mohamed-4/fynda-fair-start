import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { AuthContextType } from '@/types/auth';
import { logAuth, logSecurity } from '@/utils/logger';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    logAuth('Setting up auth state...');
    
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        logAuth('Auth state change', { event, hasSession: !!session });
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          // Check if user is admin by querying admins table
          try {
            const { data: adminUser } = await supabase
              .from('admins')
              .select('id, email, role')
              .eq('email', session.user.email!)
              .single();

            const isAdminUser = !!adminUser;
            setIsAdmin(isAdminUser);
            
            if (isAdminUser) {
              localStorage.setItem('fynda-admin', 'true');
              logSecurity('admin_status_granted', { email: session.user.email });
            } else {
              localStorage.removeItem('fynda-admin');
              logSecurity('admin_status_denied', { email: session.user.email });
            }
          } catch (error) {
            logAuth('User is not an admin');
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
      logAuth('Initial session check', { hasSession: !!session });
      if (!session) {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      logAuth('SignIn attempt started');
      logSecurity('login_attempt', { email });
      
      // Use Supabase auth directly
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        logAuth('SignIn error', { error: error.message });
        logSecurity('login_failed', { email, error: error.message });
        return { error };
      }
      
      logAuth('SignIn successful');
      logSecurity('login_success', { email });
      return { error: null };
    } catch (error: any) {
      logAuth('SignIn error', { error: error.message });
      logSecurity('login_error', { email, error: error.message });
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
