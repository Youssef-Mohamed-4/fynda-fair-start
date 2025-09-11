import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Users, Briefcase, Database, Globe } from 'lucide-react';
import { getAdminData } from '@/lib/api-client';

const Dashboard = () => {
  // Fetch admin data via secure API endpoint
  const { data: adminData, isLoading, error } = useQuery({
    queryKey: ['admin-data'],
    queryFn: async () => {
      return await getAdminData();
    },
    retry: 1, // Only retry once for auth errors
    refetchOnWindowFocus: false,
  });

  // Handle authentication errors
  if (error && error.message.includes('Authentication expired')) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-destructive mb-4">Authentication Expired</h2>
          <p className="text-muted-foreground mb-4">
            Your admin session has expired. Please log in again.
          </p>
          <button 
            onClick={() => window.location.href = '/login'}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: 'Total Employers',
      value: adminData?.employers?.length || 0,
      icon: Briefcase,
      description: 'Registered employers',
    },
    {
      title: 'New Employers (30d)',
      value: adminData?.employers?.filter((e: any) => {
        const created = new Date(e.created_at);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return created >= thirtyDaysAgo;
      }).length || 0,
      icon: Users,
      description: 'Last 30 days',
    },
    {
      title: 'Total Signups',
      value: adminData?.employers?.length || 0,
      icon: Database,
      description: 'All time',
    },
    {
      title: 'Active Today',
      value: 0,
      icon: Globe,
      description: 'Today\'s activity',
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