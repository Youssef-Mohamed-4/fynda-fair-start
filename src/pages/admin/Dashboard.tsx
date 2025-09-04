import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Users, Briefcase, Database, Globe } from 'lucide-react';

const Dashboard = () => {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['waitlist-analytics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('waitlist_analytics')
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

  const candidateData = analytics?.find(row => row.type === 'candidates');
  const employerData = analytics?.find(row => row.type === 'employers');

  const stats = [
    {
      title: 'Total Candidates',
      value: candidateData?.total_count || 0,
      icon: Users,
      description: 'Registered candidates',
    },
    {
      title: 'Total Employers',
      value: employerData?.total_count || 0,
      icon: Briefcase,
      description: 'Registered employers',
    },
    {
      title: 'Database Tables',
      value: 4,
      icon: Database,
      description: 'Active tables',
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
      
      {candidateData && (
        <Card>
          <CardHeader>
            <CardTitle>Candidate Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{candidateData.final_year_count}</div>
                <p className="text-sm text-muted-foreground">Final Year</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{candidateData.fresh_graduate_count}</div>
                <p className="text-sm text-muted-foreground">Fresh Graduates</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{candidateData.early_career_count}</div>
                <p className="text-sm text-muted-foreground">Early Career</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{candidateData.student_count}</div>
                <p className="text-sm text-muted-foreground">Students</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;