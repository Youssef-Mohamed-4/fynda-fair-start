import { useState, useEffect } from 'react';
import { WaitlistForm } from './waitlist/WaitlistForm';
import { WaitlistSuccessMessage } from './waitlist/WaitlistSuccessMessage';

const ComprehensiveWaitlistForm = () => {
  const [showSuccess, setShowSuccess] = useState(false);

  // Listen for successful submissions from the form
  useEffect(() => {
    const handleWaitlistSuccess = () => {
      setShowSuccess(true);
    };

    window.addEventListener('waitlist-success', handleWaitlistSuccess);
    return () => window.removeEventListener('waitlist-success', handleWaitlistSuccess);
  }, []);

  const handleReset = () => {
    setShowSuccess(false);
  };

  if (showSuccess) {
    return (
      <section id="waitlist-success" className="py-20 bg-gradient-to-br from-primary/5 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <WaitlistSuccessMessage onSubmitAnother={handleReset} />
          </div>
        </div>
      </section>
    );
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