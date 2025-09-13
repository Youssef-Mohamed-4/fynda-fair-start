import { WaitlistForm } from './waitlist/WaitlistForm';
import { WaitlistSuccessMessage } from './waitlist/WaitlistSuccessMessage';
import { useWaitlistForm } from '@/hooks/useWaitlistForm';

const ComprehensiveWaitlistForm = () => {
  const { state, resetForm } = useWaitlistForm();

  if (state === 'success') {
    return <WaitlistSuccessMessage onSubmitAnother={resetForm} />;
  }

  return (
    <section id="waitlist-form" className="py-20 bg-gradient-to-br from-primary/5 to-background">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Join the Waitlist</h2>
            <p className="text-xl text-muted-foreground">
              Be the first to experience the future of early-career talent discovery
            </p>
          </div>
          <WaitlistForm />
        </div>
      </div>
    </section>
  );
};

export default ComprehensiveWaitlistForm;