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

  const { data: settings, isLoading } = useQuery({
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
    mutationFn: async (newSettings: any) => {
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
      site_title: formData.get('site_title'),
      site_description: formData.get('site_description'),
      primary_color: formData.get('primary_color'),
      secondary_color: formData.get('secondary_color'),
      accent_color: formData.get('accent_color'),
    };

    updateSettings.mutate(updatedSettings);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      // In a real app, you'd upload this to Supabase Storage
      toast({
        title: "Logo selected",
        description: "Logo upload functionality would be implemented with Supabase Storage",
      });
    }
  };

  if (isLoading) {
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
        <p className="text-muted-foreground">
          Manage your website's basic settings and branding
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="site_title">Site Title</Label>
              <Input
                id="site_title"
                name="site_title"
                defaultValue={settings?.site_title}
                placeholder="Fynda"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="site_description">Site Description</Label>
              <Textarea
                id="site_description"
                name="site_description"
                defaultValue={settings?.site_description}
                placeholder="Connect ambitious early careers with progressive employers"
              />
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
              <input
                id="logo-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleLogoUpload}
              />
              {logoFile && (
                <span className="text-sm text-muted-foreground">
                  {logoFile.name}
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Upload a logo for your site (PNG, JPG, SVG supported)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Color Scheme (HSL Values)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="primary_color">Primary Color</Label>
                <Input
                  id="primary_color"
                  name="primary_color"
                  defaultValue={settings?.primary_color}
                  placeholder="213 85% 15%"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="secondary_color">Secondary Color</Label>
                <Input
                  id="secondary_color"
                  name="secondary_color"
                  defaultValue={settings?.secondary_color}
                  placeholder="213 100% 96%"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="accent_color">Accent Color</Label>
                <Input
                  id="accent_color"
                  name="accent_color"
                  defaultValue={settings?.accent_color}
                  placeholder="213 85% 60%"
                />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Enter HSL color values without the "hsl()" wrapper. Example: "213 85% 15%"
            </p>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={updateSettings.isPending}>
            <Save className="mr-2 h-4 w-4" />
            {updateSettings.isPending ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SiteSettings;