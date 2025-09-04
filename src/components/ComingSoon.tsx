import { Card, CardContent } from '@/components/ui/card';

const ComingSoon = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero p-4">
      <Card className="w-full max-w-2xl bg-background/95 backdrop-blur-sm border-border/50">
        <CardContent className="p-12 text-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Fynda
              </h1>
              <p className="text-2xl font-medium text-muted-foreground">
                Coming Soon
              </p>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-3xl font-semibold">
                Something Amazing is on the Way
              </h2>
              <p className="text-lg text-muted-foreground max-w-md mx-auto">
                We're working hard to bring you an incredible experience. 
                Stay tuned for updates!
              </p>
            </div>
            
            <div className="pt-8">
              <div className="w-24 h-1 bg-gradient-primary rounded-full mx-auto animate-pulse" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComingSoon;