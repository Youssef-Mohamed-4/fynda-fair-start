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

  // Fetch content data
  const { data: contentData, isLoading } = useQuery({
    queryKey: ['content-data'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_content')
        .select('*')
        .single();
      
      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
        throw error;
      }
      
      // Return default content if no data exists
      return data || {
        hero_title: "Fair AI Hiring for Early Careers",
        hero_subtitle: "Everyone deserves an interview. Fynda makes it happen with AI-powered fairness.",
        hero_cta_primary: "Join the Waitlist",
        hero_cta_secondary: "How It Works",
        how_it_works_title: "How It Works",
        how_it_works_subtitle: "Our simple process ensures every candidate gets a fair chance",
        why_fynda_title: "Why Choose Fynda?",
        why_fynda_subtitle: "We're building the future of fair hiring",
        social_proof_title: "Trusted by Leading Companies",
        social_proof_subtitle: "Join thousands of companies already using Fynda",
        cta_footer_title: "Ready to Transform Your Hiring?",
        cta_footer_subtitle: "Join the waitlist and be among the first to experience fair AI hiring",
        cta_footer_button: "Get Early Access",
        meta_title: "Fynda - Fair AI Hiring for Early Careers",
        meta_description: "Everyone deserves an interview. Fynda makes it happen with AI-powered fairness. Connect young talent with opportunity through fair hiring.",
        meta_keywords: "AI hiring, early careers, fair recruitment, no CV, AI interviews, young talent, job opportunities, equal opportunity"
      };
    },
  });

  // Update content mutation
  const updateContent = useMutation({
    mutationFn: async (newContent: Record<string, unknown>) => {
      if (contentData?.id) {
        // Update existing content
        const { error } = await supabase
          .from('site_content')
          .update(newContent)
          .eq('id', contentData.id);
        if (error) throw error;
      } else {
        // Insert new content
        const { error } = await supabase
          .from('site_content')
          .insert([newContent]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content-data'] });
      queryClient.invalidateQueries({ queryKey: ['site-settings'] }); // Also refresh site settings
      toast({
        title: "Content updated!",
        description: "Your content changes have been saved successfully.",
      });
    },
  });

  const handleSave = (section: string, data: Record<string, string>) => {
    updateContent.mutate({ ...contentData, ...data });
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

      <Tabs defaultValue="hero" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="hero">Hero Section</TabsTrigger>
          <TabsTrigger value="how-it-works">How It Works</TabsTrigger>
          <TabsTrigger value="why-fynda">Why Fynda</TabsTrigger>
          <TabsTrigger value="seo">SEO & Meta</TabsTrigger>
        </TabsList>

        <TabsContent value="hero">
          <Card>
            <CardHeader>
              <CardTitle>Hero Section Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hero_title">Main Title</Label>
                  <Input
                    id="hero_title"
                    value={contentData?.hero_title || ''}
                    onChange={(e) => {
                      const newData = { ...contentData, hero_title: e.target.value };
                      handleSave('hero', newData);
                    }}
                    placeholder="Fair AI Hiring for Early Careers"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hero_subtitle">Subtitle</Label>
                  <Textarea
                    id="hero_subtitle"
                    value={contentData?.hero_subtitle || ''}
                    onChange={(e) => {
                      const newData = { ...contentData, hero_subtitle: e.target.value };
                      handleSave('hero', newData);
                    }}
                    placeholder="Everyone deserves an interview..."
                    rows={3}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hero_cta_primary">Primary CTA Button</Label>
                  <Input
                    id="hero_cta_primary"
                    value={contentData?.hero_cta_primary || ''}
                    onChange={(e) => {
                      const newData = { ...contentData, hero_cta_primary: e.target.value };
                      handleSave('hero', newData);
                    }}
                    placeholder="Join the Waitlist"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hero_cta_secondary">Secondary CTA Button</Label>
                  <Input
                    id="hero_cta_secondary"
                    value={contentData?.hero_cta_secondary || ''}
                    onChange={(e) => {
                      const newData = { ...contentData, hero_cta_secondary: e.target.value };
                      handleSave('hero', newData);
                    }}
                    placeholder="How It Works"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="how-it-works">
          <Card>
            <CardHeader>
              <CardTitle>How It Works Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="how_it_works_title">Section Title</Label>
                <Input
                  id="how_it_works_title"
                  value={contentData?.how_it_works_title || ''}
                  onChange={(e) => {
                    const newData = { ...contentData, how_it_works_title: e.target.value };
                    handleSave('how-it-works', newData);
                  }}
                  placeholder="How It Works"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="how_it_works_subtitle">Section Subtitle</Label>
                <Textarea
                  id="how_it_works_subtitle"
                  value={contentData?.how_it_works_subtitle || ''}
                  onChange={(e) => {
                    const newData = { ...contentData, how_it_works_subtitle: e.target.value };
                    handleSave('how-it-works', newData);
                  }}
                  placeholder="Our simple process ensures every candidate gets a fair chance"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="why-fynda">
          <Card>
            <CardHeader>
              <CardTitle>Why Fynda Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="why_fynda_title">Section Title</Label>
                <Input
                  id="why_fynda_title"
                  value={contentData?.why_fynda_title || ''}
                  onChange={(e) => {
                    const newData = { ...contentData, why_fynda_title: e.target.value };
                    handleSave('why-fynda', newData);
                  }}
                  placeholder="Why Choose Fynda?"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="why_fynda_subtitle">Section Subtitle</Label>
                <Textarea
                  id="why_fynda_subtitle"
                  value={contentData?.why_fynda_subtitle || ''}
                  onChange={(e) => {
                    const newData = { ...contentData, why_fynda_subtitle: e.target.value };
                    handleSave('why-fynda', newData);
                  }}
                  placeholder="We're building the future of fair hiring"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo">
          <Card>
            <CardHeader>
              <CardTitle>SEO & Meta Tags</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="meta_title">Page Title</Label>
                <Input
                  id="meta_title"
                  value={contentData?.meta_title || ''}
                  onChange={(e) => {
                    const newData = { ...contentData, meta_title: e.target.value };
                    handleSave('seo', newData);
                  }}
                  placeholder="Fynda - Fair AI Hiring for Early Careers"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="meta_description">Meta Description</Label>
                <Textarea
                  id="meta_description"
                  value={contentData?.meta_description || ''}
                  onChange={(e) => {
                    const newData = { ...contentData, meta_description: e.target.value };
                    handleSave('seo', newData);
                  }}
                  placeholder="Everyone deserves an interview. Fynda makes it happen with AI-powered fairness..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="meta_keywords">Meta Keywords</Label>
                <Input
                  id="meta_keywords"
                  value={contentData?.meta_keywords || ''}
                  onChange={(e) => {
                    const newData = { ...contentData, meta_keywords: e.target.value };
                    handleSave('seo', newData);
                  }}
                  placeholder="AI hiring, early careers, fair recruitment..."
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
              <h1 className="text-2xl font-bold mb-2">{contentData?.hero_title}</h1>
              <p className="text-muted-foreground mb-4">{contentData?.hero_subtitle}</p>
              <div className="flex gap-2">
                <Button>{contentData?.hero_cta_primary}</Button>
                <Button variant="outline">{contentData?.hero_cta_secondary}</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ContentManagement;
