import FyndaLanding from "@/components/FyndaLanding";
import ComingSoon from "@/components/ComingSoon";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  // Site settings are public and safe to fetch directly from Supabase
  // This is the only direct Supabase access allowed in the frontend
  const { data: settings, isLoading, error } = useQuery({
    queryKey: ['site-settings'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('coming_soon_mode')
          .single();
        if (error) throw error;
        return data;
      } catch (err) {
        console.warn('⚠️ Could not fetch site settings, using defaults:', err);
        // Return default settings if Supabase is not available
        return { coming_soon_mode: false };
      }
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    refetchOnWindowFocus: false, // Don't refetch on window focus
    retry: 1, // Only retry once
  });

  // Show loading only briefly, then show content even if settings fail
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  // If there's an error or coming soon mode is enabled, show coming soon
  if (error || settings?.coming_soon_mode) {
    return <ComingSoon />;
  }

  // Default to showing the main landing page
  return <FyndaLanding />;
};

export default Index;
