import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Users, Briefcase, Database, Globe } from 'lucide-react';

const Dashboard = () => {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['waitlist-analytics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('waitlist_analytics_secure')
        .select('*');
      if (error) throw error;
      return data;
    },
  });

  const { data: siteSettings } = useQuery({
    queryKey: ['site-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .single();
      if (error) throw error;
      return data;
    },
  });

  const stats = [
    {
      title: 'Total Candidates',
      value: analytics?.[0]?.total_candidates || 0,
      icon: Users,
      description: 'Registered candidates',
    },
    {
      title: 'Total Employers',
      value: analytics?.[0]?.total_employers || 0,
      icon: Briefcase,
      description: 'Registered employers',
    },
    {
      title: 'New Candidates (30d)',
      value: analytics?.[0]?.new_candidates_last_30d || 0,
      icon: Users,
      description: 'Last 30 days',
    },
    {
      title: 'Site Status',
      value: siteSettings?.coming_soon_mode ? 'Coming Soon' : 'Live',
      icon: Globe,
      description: 'Current mode',
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="animate-pulse space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your Fynda platform
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;