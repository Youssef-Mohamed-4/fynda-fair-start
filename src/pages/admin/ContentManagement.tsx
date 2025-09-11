import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const ContentManagement = () => {
  const [previewMode, setPreviewMode] = useState(false);
  const [formData, setFormData] = useState({
    site_title: 'Fynda AI',
    site_description: 'AI-powered talent matching platform',
    logo_url: '',
    primary_color: '213 85% 15%',
    secondary_color: '213 100% 96%',
    accent_color: '213 85% 60%'
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

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

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          This feature requires a site_settings table in your database. Changes made here are temporary and for demonstration purposes only.
        </AlertDescription>
      </Alert>

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
                  value={formData.site_title}
                  onChange={(e) => handleInputChange('site_title', e.target.value)}
                  placeholder="Enter site title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="site_description">Site Description</Label>
                <Textarea
                  value={formData.site_description}
                  onChange={(e) => handleInputChange('site_description', e.target.value)}
                  placeholder="Enter site description"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="logo_url">Logo URL</Label>
                <Input
                  value={formData.logo_url}
                  onChange={(e) => handleInputChange('logo_url', e.target.value)}
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
                  value={formData.primary_color}
                  onChange={(e) => handleInputChange('primary_color', e.target.value)}
                  placeholder="213 85% 15%"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="secondary_color">Secondary Color (HSL)</Label>
                <Input
                  value={formData.secondary_color}
                  onChange={(e) => handleInputChange('secondary_color', e.target.value)}
                  placeholder="213 100% 96%"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="accent_color">Accent Color (HSL)</Label>
                <Input
                  value={formData.accent_color}
                  onChange={(e) => handleInputChange('accent_color', e.target.value)}
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
              <h1 className="text-2xl font-bold mb-2">{formData.site_title}</h1>
              <p className="text-muted-foreground mb-4">{formData.site_description}</p>
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