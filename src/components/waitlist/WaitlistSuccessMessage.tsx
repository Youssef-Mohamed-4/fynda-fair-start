import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Users, Clock, ArrowRight } from 'lucide-react';

interface WaitlistSuccessMessageProps {
  onSubmitAnother?: () => void;
}

export const WaitlistSuccessMessage = ({ onSubmitAnother }: WaitlistSuccessMessageProps) => {
  return (
    <Card className="relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
      
      <CardHeader className="relative text-center pb-6">
        <div className="mx-auto mb-4 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-primary" />
        </div>
        
        <CardTitle className="text-2xl font-bold text-foreground">
          Welcome to the Waitlist!
        </CardTitle>
        
        <CardDescription className="text-base text-muted-foreground max-w-md mx-auto">
          Thank you for your interest in Fynda. You've been successfully added to our employer waitlist.
        </CardDescription>
      </CardHeader>

      <CardContent className="relative space-y-6">
        {/* What happens next */}
        <div className="space-y-4">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            What happens next?
          </h3>
          
          <div className="space-y-3 text-sm text-muted-foreground ml-6">
            <div className="flex items-start gap-2">
              <ArrowRight className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
              <span>We'll keep you updated on our launch progress via email</span>
            </div>
            <div className="flex items-start gap-2">
              <ArrowRight className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
              <span>You'll be among the first to access our platform when we go live</span>
            </div>
            <div className="flex items-start gap-2">
              <ArrowRight className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
              <span>Early access to exclusive features and priority support</span>
            </div>
          </div>
        </div>

        {/* Community message */}
        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-primary" />
            <span className="font-medium text-sm text-foreground">Join the Community</span>
          </div>
          <p className="text-sm text-muted-foreground">
            You're now part of an exclusive group of forward-thinking employers who are ready 
            to revolutionize their early-career hiring process.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            variant="outline" 
            className="flex-1"
          >
            Explore More Features
          </Button>
          
          {onSubmitAnother && (
            <Button 
              onClick={onSubmitAnother}
              variant="outline" 
              className="flex-1"
            >
              Add Another Registration
            </Button>
          )}
        </div>

        {/* Footer note */}
        <div className="text-center pt-4 border-t">
          <p className="text-xs text-muted-foreground">
            Keep an eye on your inbox for updates. We're working hard to bring you something amazing!
          </p>
        </div>
      </CardContent>
    </Card>
  );
};