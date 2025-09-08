import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, Search, Filter, Trash2, Mail, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const WaitlistManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'candidates' | 'employers'>('all');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch waitlist data
  const { data: waitlistData, isLoading } = useQuery({
    queryKey: ['waitlist-data'],
    queryFn: async () => {
      const [candidatesResult, employersResult] = await Promise.all([
        supabase.from('waitlist_candidates').select('*').order('created_at', { ascending: false }),
        supabase.from('waitlist_employers').select('*').order('created_at', { ascending: false })
      ]);

      if (candidatesResult.error) throw candidatesResult.error;
      if (employersResult.error) throw employersResult.error;

      return {
        candidates: candidatesResult.data || [],
        employers: employersResult.data || [],
      };
    },
  });

  // Delete entry mutation
  const deleteEntry = useMutation({
    mutationFn: async ({ type, id }: { type: 'candidate' | 'employer'; id: string }) => {
      const table = type === 'candidate' ? 'waitlist_candidates' : 'waitlist_employers';
      const { error } = await supabase.from(table).delete().eq('id', id);
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
  const exportData = (type: 'candidates' | 'employers' | 'all') => {
    if (!waitlistData) return;

    let dataToExport = [];
    if (type === 'candidates' || type === 'all') {
      dataToExport = [...dataToExport, ...waitlistData.candidates.map(c => ({ ...c, type: 'candidate' }))];
    }
    if (type === 'employers' || type === 'all') {
      dataToExport = [...dataToExport, ...waitlistData.employers.map(e => ({ ...e, type: 'employer' }))];
    }

    const csv = [
      ['Type', 'Name', 'Email', 'Field/Role', 'State', 'Created At'],
      ...dataToExport.map(entry => [
        entry.type,
        entry.name,
        entry.email,
        entry.field_of_study || entry.role,
        entry.current_state || 'N/A',
        new Date(entry.created_at).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `waitlist-export-${type}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Filter data based on search and type
  const filteredCandidates = waitlistData?.candidates.filter(candidate =>
    (filterType === 'all' || filterType === 'candidates') &&
    (candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
     candidate.field_of_study?.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];

  const filteredEmployers = waitlistData?.employers.filter(employer =>
    (filterType === 'all' || filterType === 'employers') &&
    (employer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     employer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
     employer.role?.toLowerCase().includes(searchTerm.toLowerCase()))
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
          <p className="text-muted-foreground">Manage candidate and employer waitlist entries</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => exportData('candidates')} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Candidates
          </Button>
          <Button onClick={() => exportData('employers')} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Employers
          </Button>
          <Button onClick={() => exportData('all')} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export All
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Candidates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{waitlistData?.candidates.length || 0}</div>
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
            <div className="text-2xl font-bold">
              {(waitlistData?.candidates.length || 0) + (waitlistData?.employers.length || 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or field..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterType === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterType('all')}
              >
                All
              </Button>
              <Button
                variant={filterType === 'candidates' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterType('candidates')}
              >
                Candidates
              </Button>
              <Button
                variant={filterType === 'employers' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterType('employers')}
              >
                Employers
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Tables */}
      <Tabs defaultValue="candidates" className="space-y-4">
        <TabsList>
          <TabsTrigger value="candidates">
            Candidates ({filteredCandidates.length})
          </TabsTrigger>
          <TabsTrigger value="employers">
            Employers ({filteredEmployers.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="candidates">
          <Card>
            <CardHeader>
              <CardTitle>Candidate Entries</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Field of Study</TableHead>
                    <TableHead>Current State</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCandidates.map((candidate) => (
                    <TableRow key={candidate.id}>
                      <TableCell className="font-medium">{candidate.name}</TableCell>
                      <TableCell>{candidate.email}</TableCell>
                      <TableCell>{candidate.field_of_study}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{candidate.current_state}</Badge>
                      </TableCell>
                      <TableCell>{new Date(candidate.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(`mailto:${candidate.email}`)}
                          >
                            <Mail className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteEntry.mutate({ type: 'candidate', id: candidate.id })}
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
        </TabsContent>

        <TabsContent value="employers">
          <Card>
            <CardHeader>
              <CardTitle>Employer Entries</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Early Careers/Year</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployers.map((employer) => (
                    <TableRow key={employer.id}>
                      <TableCell className="font-medium">{employer.name}</TableCell>
                      <TableCell>{employer.email}</TableCell>
                      <TableCell>{employer.role}</TableCell>
                      <TableCell>{employer.early_careers_per_year || 'N/A'}</TableCell>
                      <TableCell>{new Date(employer.created_at).toLocaleDateString()}</TableCell>
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
                            onClick={() => deleteEntry.mutate({ type: 'employer', id: employer.id })}
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WaitlistManagement;
