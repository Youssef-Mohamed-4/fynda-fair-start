import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  Briefcase, 
  Download,
  Mail
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const AnalyticsDashboard = () => {
  // Fetch analytics data
  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ['analytics-data'],
    queryFn: async () => {
      // Get waitlist data from employers_waitlist table
      const employersResult = await supabase
        .from('employers_waitlist')
        .select('*')
        .order('created_at', { ascending: false });

      if (employersResult.error) throw employersResult.error;

      const employers = employersResult.data || [];

      // Calculate analytics
      const now = new Date();
      const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      // Daily signups for the last 30 days
      const dailySignups = [];
      for (let i = 29; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const dateStr = date.toISOString().split('T')[0];
        
        const employerCount = employers.filter(e => 
          e.created_at && e.created_at.startsWith(dateStr)
        ).length;

        dailySignups.push({
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          employers: employerCount,
          total: employerCount
        });
      }

      // Industry distribution for employers
      const industryDistribution = employers.reduce((acc, employer) => {
        const industry = employer.industry || 'Other';
        acc[industry] = (acc[industry] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const industryData = Object.entries(industryDistribution).map(([industry, count]) => ({
        name: industry,
        value: count
      }));

      // Company size distribution
      const sizeDistribution = employers.reduce((acc, employer) => {
        const size = employer.company_size || 'Not specified';
        acc[size] = (acc[size] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const sizeData = Object.entries(sizeDistribution).map(([size, count]) => ({
        name: size,
        value: count
      }));

      return {
        totalCandidates: 0, // No candidates table
        totalEmployers: employers.length,
        totalSignups: employers.length,
        newEmployersLast30Days: employers.filter(e => 
          e.created_at && new Date(e.created_at) >= last30Days
        ).length,
        newEmployersLast7Days: employers.filter(e => 
          e.created_at && new Date(e.created_at) >= last7Days
        ).length,
        dailySignups,
        industryData,
        sizeData,
        recentEmployers: employers.slice(0, 10)
      };
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <div className="animate-pulse space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded-lg" />
            ))}
          </div>
          <div className="h-64 bg-muted rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Track your platform's growth and user engagement</p>
        </div>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Signups</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData?.totalSignups || 0}</div>
            <p className="text-xs text-muted-foreground">
              +{analyticsData?.newEmployersLast30Days || 0} this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Candidates</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData?.totalCandidates || 0}</div>
            <p className="text-xs text-muted-foreground">
              Coming soon
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Employers</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData?.totalEmployers || 0}</div>
            <p className="text-xs text-muted-foreground">
              +{analyticsData?.newEmployersLast7Days || 0} this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(analyticsData?.totalSignups || 0) > 0 ? 
                Math.round(((analyticsData?.newEmployersLast30Days || 0) / (analyticsData?.totalSignups || 1)) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">Monthly growth</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Daily Signups (Last 30 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analyticsData?.dailySignups || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="employers" stroke="#82ca9d" name="Employers" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Industry Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData?.industryData || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Employers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {(analyticsData?.recentEmployers || []).map((employer) => (
              <div key={employer.id} className="flex items-center justify-between p-2 border rounded">
                <div>
                  <p className="font-medium">{employer.name}</p>
                  <p className="text-sm text-muted-foreground">{employer.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{employer.industry}</Badge>
                  <Button size="sm" variant="outline">
                    <Mail className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;