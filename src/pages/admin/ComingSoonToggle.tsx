import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Globe, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const ComingSoonToggle = () => {
  const [isComingSoon, setIsComingSoon] = useState(false);

  const handleToggle = () => {
    setIsComingSoon(!isComingSoon);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Coming Soon Mode</h1>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          This feature requires a site_settings table in your database. The toggle below is for demonstration purposes only.
        </AlertDescription>
      </Alert>

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
                    : 'Website is visible to all visitors'
                  }
                </p>
              </div>
            </div>
            <Switch
              checked={!isComingSoon}
              onCheckedChange={handleToggle}
            />
          </div>

          <Button
            onClick={handleToggle}
            variant={isComingSoon ? "default" : "secondary"}
            size="lg"
            className="w-full"
          >
            {isComingSoon ? 'Make Website Live' : 'Enable Coming Soon Mode'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComingSoonToggle;