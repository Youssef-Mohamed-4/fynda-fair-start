import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';

interface WaitlistSuccessMessageProps {
  onSubmitAnother: () => void;
}

export const WaitlistSuccessMessage = ({ onSubmitAnother }: WaitlistSuccessMessageProps) => {
  return (
    <section id="waitlist-form" className="py-20 bg-gradient-to-br from-primary/5 to-background">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-full">
              <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-4">Thank You!</h2>
          <p className="text-lg text-muted-foreground mb-8">
            You've been added to our employer waitlist. We'll be in touch soon to help you find top early-career talent.
          </p>
          <Button 
            onClick={onSubmitAnother}
            variant="outline"
            className="transition-all duration-200 hover:scale-105"
          >
            Submit Another Entry
          </Button>
        </div>
      </div>
    </section>
  );
};