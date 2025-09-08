import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

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
    // Simplified auth state management for initial loading
    // Check for admin flag in localStorage first
    const checkAdminStatus = () => {
      const adminFlag = localStorage.getItem('fynda-admin');
      const isAdminUser = adminFlag === 'true' || import.meta.env.VITE_ADMIN_MODE === 'true';
      setIsAdmin(isAdminUser);
      
      if (import.meta.env.DEV) {
        console.log('🔐 Admin status check:', { adminFlag, isAdminUser });
      }
    };

    // Set initial state
    setUser(null);
    setSession(null);
    checkAdminStatus();
    setLoading(false);

    // Set up auth state listener (but don't block initial render)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (import.meta.env.DEV) {
          console.log('🔐 Auth state change:', event, 'Session:', !!session);
        }
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          // For now, just check localStorage for admin status
          checkAdminStatus();
        } else {
          setIsAdmin(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
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
