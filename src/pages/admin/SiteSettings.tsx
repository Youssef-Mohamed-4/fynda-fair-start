import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Upload, Save, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

const SiteSettings = () => {
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const { toast } = useToast();
  
  const [settings, setSettings] = useState({
    site_title: 'Fynda AI',
    site_description: 'AI-powered talent matching platform',
    primary_color: '213 85% 15%',
    secondary_color: '213 100% 96%',
    accent_color: '213 85% 60%'
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

    setSettings(updatedSettings);
    
    toast({
      title: "Settings saved (demo)",
      description: "Settings would be saved to database with proper setup.",
    });
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Site Settings</h1>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          This feature requires a site_settings table in your database. Changes made here are temporary and for demonstration purposes only.
        </AlertDescription>
      </Alert>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="site_title">Site Title</Label>
              <Input id="site_title" name="site_title" defaultValue={settings.site_title} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="site_description">Site Description</Label>
              <Textarea id="site_description" name="site_description" defaultValue={settings.site_description} />
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
            <div className="space-y-2">
              <Label htmlFor="primary_color">Primary Color (HSL)</Label>
              <Input name="primary_color" defaultValue={settings.primary_color} placeholder="213 85% 15%" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="secondary_color">Secondary Color (HSL)</Label>
              <Input name="secondary_color" defaultValue={settings.secondary_color} placeholder="213 100% 96%" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="accent_color">Accent Color (HSL)</Label>
              <Input name="accent_color" defaultValue={settings.accent_color} placeholder="213 85% 60%" />
            </div>
          </CardContent>
        </Card>

        <Button type="submit">
          <Save className="mr-2 h-4 w-4" />
          Save Settings (Demo)
        </Button>
      </form>
    </div>
  );
};

export default SiteSettings;