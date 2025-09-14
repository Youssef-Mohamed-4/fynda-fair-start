import React, { lazy, Suspense } from 'react';
import { WaitlistProvider, useWaitlistContext } from '@/context/WaitlistContext';

// Lazy load the waitlist components for better performance
const WaitlistForm = lazy(() => import('./waitlist/WaitlistForm').then(module => ({ default: module.WaitlistForm })));
const WaitlistSuccessMessage = lazy(() => import('./waitlist/WaitlistSuccessMessage').then(module => ({ default: module.WaitlistSuccessMessage })));

// Loading fallback component
const WaitlistFormSkeleton = () => (
  <div className="animate-pulse space-y-6">
    <div className="h-64 bg-muted rounded-lg" />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="h-20 bg-muted rounded" />
      <div className="h-20 bg-muted rounded" />
    </div>
    <div className="h-12 bg-muted rounded" />
  </div>
);

const ComprehensiveWaitlistFormContent = () => {
  const { showSuccess, resetWaitlist } = useWaitlistContext();

  const handleReset = () => {
    resetWaitlist();
  };

  if (showSuccess) {
    return (
      <section id="waitlist-success" className="py-20 bg-gradient-to-br from-primary/5 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Suspense fallback={<WaitlistFormSkeleton />}>
              <WaitlistSuccessMessage onSubmitAnother={handleReset} />
            </Suspense>
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
          <Suspense fallback={<WaitlistFormSkeleton />}>
            <WaitlistForm />
          </Suspense>
        </div>
      </div>
    </section>
  );
};

const ComprehensiveWaitlistForm = () => {
  return (
    <WaitlistProvider>
      <ComprehensiveWaitlistFormContent />
    </WaitlistProvider>
  );
};

export default ComprehensiveWaitlistForm;