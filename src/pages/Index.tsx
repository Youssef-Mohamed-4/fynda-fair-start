import FyndaLanding from "@/components/FyndaLanding";
import ComingSoon from "@/components/ComingSoon";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  // Since we don't have a site_settings table, default to showing the main landing page
  return <FyndaLanding />;
};

export default Index;
