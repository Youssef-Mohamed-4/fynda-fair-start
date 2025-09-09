import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  Briefcase, 
  Calendar, 
  Download,
  Eye,
  Mail,
  Globe
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const AnalyticsDashboard = () => {
  // Fetch analytics data
  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ['analytics-data'],
    queryFn: async () => {
      // Get waitlist data
      const [candidatesResult, employersResult] = await Promise.all([
        supabase.from('waitlist_candidates').select('*').order('created_at', { ascending: false }),
        supabase.from('waitlist_employers').select('*').order('created_at', { ascending: false })
      ]);

      if (candidatesResult.error) throw candidatesResult.error;
      if (employersResult.error) throw employersResult.error;

      const candidates = candidatesResult.data || [];
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
        
        const candidateCount = candidates.filter(c => 
          c.created_at.startsWith(dateStr)
        ).length;
        
        const employerCount = employers.filter(e => 
          e.created_at.startsWith(dateStr)
        ).length;

        dailySignups.push({
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          candidates: candidateCount,
          employers: employerCount,
          total: candidateCount + employerCount
        });
      }

      // Field of study distribution
      const fieldDistribution = candidates.reduce((acc, candidate) => {
        const field = candidate.field_of_study || 'Other';
        acc[field] = (acc[field] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const fieldData = Object.entries(fieldDistribution).map(([field, count]) => ({
        name: field,
        value: count
      }));

      // Role distribution for employers
      const roleDistribution = employers.reduce((acc, employer) => {
        const role = employer.role || 'Other';
        acc[role] = (acc[role] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const roleData = Object.entries(roleDistribution).map(([role, count]) => ({
        name: role,
        value: count
      }));

      // State distribution
      const stateDistribution = candidates.reduce((acc, candidate) => {
        const state = candidate.current_state || 'Unknown';
        acc[state] = (acc[state] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const stateData = Object.entries(stateDistribution).map(([state, count]) => ({
        name: state,
        value: count
      }));

      return {
        totalCandidates: candidates.length,
        totalEmployers: employers.length,
        totalSignups: candidates.length + employers.length,
        newCandidatesLast30Days: candidates.filter(c => new Date(c.created_at) >= last30Days).length,
        newEmployersLast30Days: employers.filter(e => new Date(e.created_at) >= last30Days).length,
        newCandidatesLast7Days: candidates.filter(c => new Date(c.created_at) >= last7Days).length,
        newEmployersLast7Days: employers.filter(e => new Date(e.created_at) >= last7Days).length,
        dailySignups,
        fieldData,
        roleData,
        stateData,
        recentCandidates: candidates.slice(0, 10),
        recentEmployers: employers.slice(0, 10)
      };
    },
  });

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

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
              +{(analyticsData?.newCandidatesLast30Days || 0) + (analyticsData?.newEmployersLast30Days || 0)} this month
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
              +{analyticsData?.newCandidatesLast7Days || 0} this week
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
                Math.round((((analyticsData?.newCandidatesLast30Days || 0) + (analyticsData?.newEmployersLast30Days || 0)) / (analyticsData?.totalSignups || 1)) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">Monthly growth</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="candidates">Candidates</TabsTrigger>
          <TabsTrigger value="employers">Employers</TabsTrigger>
          <TabsTrigger value="recent">Recent Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
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
                    <Line type="monotone" dataKey="candidates" stroke="#8884d8" name="Candidates" />
                    <Line type="monotone" dataKey="employers" stroke="#82ca9d" name="Employers" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Field of Study Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analyticsData?.fieldData || []}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {(analyticsData?.fieldData || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="candidates">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Field of Study Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analyticsData?.fieldData || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Current State Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analyticsData?.stateData || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="employers">
          <Card>
            <CardHeader>
              <CardTitle>Role Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analyticsData?.roleData || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#ffc658" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recent">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Candidates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {(analyticsData?.recentCandidates || []).map((candidate) => (
                    <div key={candidate.id} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <p className="font-medium">{candidate.name}</p>
                        <p className="text-sm text-muted-foreground">{candidate.email}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{candidate.field_of_study}</Badge>
                        <Button size="sm" variant="outline">
                          <Mail className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

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
                        <Badge variant="secondary">{employer.role}</Badge>
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard;
