import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Upload, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SiteSettings = () => {
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery<any>({
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

  const updateSettings = useMutation({
    mutationFn: async (newSettings: Record<string, unknown>) => {
      if (!settings) return;
      const { error } = await supabase
        .from('site_settings')
        .update(newSettings)
        .eq('id', settings.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site-settings'] });
      toast({
        title: "Settings updated!",
        description: "Your site settings have been saved successfully.",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const updatedSettings = {
      site_title: formData.get('site_title')?.toString() ?? '',
      site_description: formData.get('site_description')?.toString() ?? '',
      primary_color: formData.get('primary_color')?.toString() ?? '',
      secondary_color: formData.get('secondary_color')?.toString() ?? '',
      accent_color: formData.get('accent_color')?.toString() ?? '',
    };

    updateSettings.mutate(updatedSettings);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setLogoFile(file);
    if (file) {
      toast({
        title: "Logo selected",
        description: "Logo upload functionality would be implemented with Supabase Storage",
      });
    }
  };

  if (isLoading || !settings) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Site Settings</h1>
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-muted rounded-lg" />
          <div className="h-64 bg-muted rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Site Settings</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="site_title">Site Title</Label>
              <Input id="site_title" name="site_title" defaultValue={settings.site_title ?? ''} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="site_description">Site Description</Label>
              <Textarea id="site_description" name="site_description" defaultValue={settings.site_description ?? ''} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Logo Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <Button type="button" variant="outline" asChild>
                <label htmlFor="logo-upload" className="cursor-pointer">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Logo
                </label>
              </Button>
              <input id="logo-upload" type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
              {logoFile && <span className="text-sm text-muted-foreground">{logoFile.name}</span>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Color Scheme</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input name="primary_color" defaultValue={settings.primary_color ?? ''} />
            <Input name="secondary_color" defaultValue={settings.secondary_color ?? ''} />
            <Input name="accent_color" defaultValue={settings.accent_color ?? ''} />
          </CardContent>
        </Card>

        <Button type="submit" disabled={updateSettings.isPending}>
          <Save className="mr-2 h-4 w-4" />
          {updateSettings.isPending ? 'Saving...' : 'Save Settings'}
        </Button>
      </form>
    </div>
  );
};

export default SiteSettings;
