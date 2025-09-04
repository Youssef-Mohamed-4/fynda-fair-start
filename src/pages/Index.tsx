import FyndaLanding from "@/components/FyndaLanding";
import ComingSoon from "@/components/ComingSoon";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  const { data: settings, isLoading } = useQuery({
    queryKey: ['site-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('coming_soon_mode')
        .single();
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (settings?.coming_soon_mode) {
    return <ComingSoon />;
  }

  return <FyndaLanding />;
};

export default Index;
