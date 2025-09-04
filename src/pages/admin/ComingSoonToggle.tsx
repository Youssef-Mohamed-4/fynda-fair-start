import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Globe, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ComingSoonToggle = () => {
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

  const toggleComingSoon = useMutation({
    mutationFn: async (comingSoonMode: boolean) => {
      const { error } = await supabase
        .from('site_settings')
        .update({ coming_soon_mode: comingSoonMode })
        .eq('id', settings.id);
      if (error) throw error;
    },
    onSuccess: (_, comingSoonMode) => {
      queryClient.invalidateQueries({ queryKey: ['site-settings'] });
      toast({
        title: comingSoonMode ? "Coming Soon mode enabled" : "Website is now live",
        description: comingSoonMode 
          ? "Your website now shows a coming soon page to visitors"
          : "Your website is now visible to all visitors",
      });
    },
  });

  const handleToggle = () => {
    toggleComingSoon.mutate(!settings?.coming_soon_mode);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Coming Soon Mode</h1>
        <div className="animate-pulse">
          <div className="h-48 bg-muted rounded-lg" />
        </div>
      </div>
    );
  }

  const isComingSoon = settings?.coming_soon_mode;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Coming Soon Mode</h1>
        <p className="text-muted-foreground">
          Control website visibility to the public
        </p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="h-5 w-5" />
            <span>Website Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 rounded-lg border">
            <div className="flex items-center space-x-3">
              {isComingSoon ? (
                <EyeOff className="h-8 w-8 text-orange-500" />
              ) : (
                <Eye className="h-8 w-8 text-green-500" />
              )}
              <div>
                <h3 className="font-semibold">
                  {isComingSoon ? 'Coming Soon Mode' : 'Website Live'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {isComingSoon 
                    ? 'Visitors see a coming soon page'
                    : 'Website is publicly accessible'
                  }
                </p>
              </div>
            </div>
            <Switch
              checked={!isComingSoon}
              onCheckedChange={() => handleToggle()}
              disabled={toggleComingSoon.isPending}
            />
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Current Status:</h4>
            <div className={`p-4 rounded-lg border ${
              isComingSoon ? 'border-orange-200 bg-orange-50' : 'border-green-200 bg-green-50'
            }`}>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${
                  isComingSoon ? 'bg-orange-500' : 'bg-green-500'
                }`} />
                <span className={`font-medium ${
                  isComingSoon ? 'text-orange-700' : 'text-green-700'
                }`}>
                  {isComingSoon ? 'Coming Soon Page Active' : 'Website is Live'}
                </span>
              </div>
              <p className={`mt-2 text-sm ${
                isComingSoon ? 'text-orange-600' : 'text-green-600'
              }`}>
                {isComingSoon 
                  ? 'Only you and other admins can see the full website. Visitors see a coming soon message.'
                  : 'Everyone can access your website and see all content including the waitlist form.'
                }
              </p>
            </div>
          </div>

          <div className="pt-4">
            <Button
              onClick={handleToggle}
              disabled={toggleComingSoon.isPending}
              variant={isComingSoon ? "default" : "secondary"}
              size="lg"
              className="w-full"
            >
              {toggleComingSoon.isPending ? (
                'Updating...'
              ) : isComingSoon ? (
                'Make Website Live'
              ) : (
                'Enable Coming Soon Mode'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComingSoonToggle;