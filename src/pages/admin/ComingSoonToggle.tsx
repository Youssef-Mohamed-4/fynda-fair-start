import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Globe, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ComingSoonToggle = () => {
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

  const toggleComingSoon = useMutation({
    mutationFn: async (comingSoonMode: boolean) => {
      if (!settings) return;
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

  if (isLoading || !settings) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Coming Soon Mode</h1>
        <div className="animate-pulse">
          <div className="h-48 bg-muted rounded-lg" />
        </div>
      </div>
    );
  }

  const isComingSoon = settings.coming_soon_mode ?? false;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Coming Soon Mode</h1>
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
              </div>
            </div>
            <Switch
              checked={!isComingSoon}
              onCheckedChange={handleToggle}
              disabled={toggleComingSoon.isPending}
            />
          </div>

          <Button
            onClick={handleToggle}
            disabled={toggleComingSoon.isPending}
            variant={isComingSoon ? "default" : "secondary"}
            size="lg"
            className="w-full"
          >
            {toggleComingSoon.isPending ? 'Updating...' : isComingSoon ? 'Make Website Live' : 'Enable Coming Soon Mode'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComingSoonToggle;
