import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, Search, Trash2, Mail, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const WaitlistManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch waitlist data from the actual employers_waitlist table
  const { data: waitlistData, isLoading } = useQuery({
    queryKey: ['waitlist-data'],
    queryFn: async () => {
      const employersResult = await supabase
        .from('employers_waitlist')
        .select('*')
        .order('created_at', { ascending: false });

      if (employersResult.error) throw employersResult.error;

      return {
        candidates: [], // No candidates table available
        employers: employersResult.data || [],
      };
    },
  });

  // Delete entry mutation
  const deleteEntry = useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const { error } = await supabase
        .from('employers_waitlist')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['waitlist-data'] });
      toast({
        title: "Entry deleted",
        description: "The waitlist entry has been removed successfully.",
      });
    },
  });

  // Export data
  const exportData = () => {
    if (!waitlistData) return;

    const csv = [
      ['Type', 'Name', 'Email', 'Industry', 'Company Size', 'Early Career Hires/Year', 'Created At'],
      ...waitlistData.employers.map((entry: any) => [
        'employer',
        entry.name,
        entry.email,
        entry.industry,
        entry.company_size,
        entry.early_career_hires_per_year || 'N/A',
        new Date(entry.created_at).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `waitlist-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Filter data based on search
  const filteredEmployers = waitlistData?.employers.filter(employer =>
    employer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employer.industry?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Waitlist Management</h1>
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-muted rounded-lg" />
          <div className="h-64 bg-muted rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Waitlist Management</h1>
          <p className="text-muted-foreground">Manage employer waitlist entries</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={exportData} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Currently only employer waitlist entries are available. Candidate functionality requires additional database tables.
        </AlertDescription>
      </Alert>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Candidates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Coming soon</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{waitlistData?.employers.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Entries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{waitlistData?.employers.length || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or industry..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Employers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Employer Entries ({filteredEmployers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Industry</TableHead>
                <TableHead>Company Size</TableHead>
                <TableHead>Early Career Hires/Year</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployers.map((employer) => (
                <TableRow key={employer.id}>
                  <TableCell className="font-medium">{employer.name}</TableCell>
                  <TableCell>{employer.email}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{employer.industry}</Badge>
                  </TableCell>
                  <TableCell>{employer.company_size}</TableCell>
                  <TableCell>{employer.early_career_hires_per_year || 'N/A'}</TableCell>
                  <TableCell>
                    {employer.created_at ? new Date(employer.created_at).toLocaleDateString() : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`mailto:${employer.email}`)}
                      >
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteEntry.mutate({ id: employer.id })}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default WaitlistManagement;