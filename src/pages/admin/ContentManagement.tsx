import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Save, Eye, Edit, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const ContentManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [previewMode, setPreviewMode] = useState(false);

  // Fetch content data from site_settings
  const { data: content, isLoading } = useQuery({
    queryKey: ['site_settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .single();

      if (error) {
        console.error('Error fetching site settings:', error);
        throw error;
      }
      return data;
    },
  });

  const updateContent = useMutation({
    mutationFn: async (updates: Record<string, string>) => {
      const { error } = await supabase
        .from('site_settings')
        .update(updates)
        .eq('id', content?.id || '');

      if (error) {
        console.error('Error updating site settings:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site_settings'] });
      toast({
        title: "Settings updated successfully",
        description: "The website settings have been updated.",
      });
    },
    onError: (error) => {
      console.error('Settings update error:', error);
      toast({
        variant: "destructive",
        title: "Error updating settings",
        description: "There was an error updating the website settings.",
      });
    },
  });

  const handleSave = (section: string, data: Record<string, string>) => {
    updateContent.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Content Management</h1>
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
          <h1 className="text-3xl font-bold">Content Management</h1>
          <p className="text-muted-foreground">Manage your website content and messaging</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={previewMode ? "default" : "outline"}
            onClick={() => setPreviewMode(!previewMode)}
          >
            <Eye className="h-4 w-4 mr-2" />
            {previewMode ? 'Edit Mode' : 'Preview Mode'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="site" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="site">Site Settings</TabsTrigger>
          <TabsTrigger value="colors">Colors & Theme</TabsTrigger>
        </TabsList>

        <TabsContent value="site">
          <Card>
            <CardHeader>
              <CardTitle>Site Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="site_title">Site Title</Label>
                <Input
                  value={content?.site_title || ''}
                  onChange={(e) => {
                    handleSave('site', { site_title: e.target.value });
                  }}
                  placeholder="Enter site title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="site_description">Site Description</Label>
                <Textarea
                  value={content?.site_description || ''}
                  onChange={(e) => {
                    handleSave('site', { site_description: e.target.value });
                  }}
                  placeholder="Enter site description"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="logo_url">Logo URL</Label>
                <Input
                  value={content?.logo_url || ''}
                  onChange={(e) => {
                    handleSave('site', { logo_url: e.target.value });
                  }}
                  placeholder="Enter logo URL"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="colors">
          <Card>
            <CardHeader>
              <CardTitle>Color Scheme</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="primary_color">Primary Color (HSL)</Label>
                <Input
                  value={content?.primary_color || ''}
                  onChange={(e) => {
                    handleSave('colors', { primary_color: e.target.value });
                  }}
                  placeholder="213 85% 15%"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="secondary_color">Secondary Color (HSL)</Label>
                <Input
                  value={content?.secondary_color || ''}
                  onChange={(e) => {
                    handleSave('colors', { secondary_color: e.target.value });
                  }}
                  placeholder="213 100% 96%"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="accent_color">Accent Color (HSL)</Label>
                <Input
                  value={content?.accent_color || ''}
                  onChange={(e) => {
                    handleSave('colors', { accent_color: e.target.value });
                  }}
                  placeholder="213 85% 60%"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Preview Section */}
      {previewMode && (
        <Card>
          <CardHeader>
            <CardTitle>Live Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg p-4 bg-muted/20">
              <h1 className="text-2xl font-bold mb-2">{content?.site_title}</h1>
              <p className="text-muted-foreground mb-4">{content?.site_description}</p>
              <div className="flex gap-2">
                <Button>Primary Button</Button>
                <Button variant="outline">Secondary Button</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ContentManagement;