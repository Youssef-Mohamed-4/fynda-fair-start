import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const useSecurityMonitoring = () => {
  const { user, session } = useAuth();

  useEffect(() => {
    if (!user || !session) return;

    const trackSession = async () => {
      try {
        // Track user session for security monitoring
        await supabase.from('user_sessions').upsert({
          user_id: user.id,
          session_id: session.access_token.substring(0, 20), // Truncated for security
          ip_address: 'client', // Would need server-side for real IP
          user_agent: navigator.userAgent.substring(0, 200),
          last_activity: new Date().toISOString(),
          is_active: true
        });
      } catch (error) {
        console.error('Session tracking error:', error);
      }
    };

    // Track session on mount
    trackSession();

    // Track activity every 5 minutes
    const interval = setInterval(trackSession, 5 * 60 * 1000);

    return () => {
      clearInterval(interval);
      // Mark session as inactive on unmount
      if (session) {
        supabase.from('user_sessions')
          .update({ is_active: false })
          .eq('session_id', session.access_token.substring(0, 20))
          .then();
      }
    };
  }, [user, session]);

  return null;
};