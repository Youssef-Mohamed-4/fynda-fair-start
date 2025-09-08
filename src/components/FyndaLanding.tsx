import { lazy, Suspense } from "react";
import Header from "./Header";
import HeroSection from "./HeroSection";

// Lazy load heavy components
const HowItWorksSection = lazy(() => import("./HowItWorksSection"));
const WhyFyndaSection = lazy(() => import("./WhyFyndaSection"));
const SocialProofSection = lazy(() => import("./SocialProofSection"));
const ComprehensiveWaitlistForm = lazy(() => import("./ComprehensiveWaitlistForm"));
const CTAFooter = lazy(() => import("./CTAFooter"));

const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-20">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
  </div>
);

const FyndaLanding = () => {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <Suspense fallback={<LoadingSpinner />}>
        <HowItWorksSection />
      </Suspense>
      <Suspense fallback={<LoadingSpinner />}>
        <WhyFyndaSection />
      </Suspense>
      <Suspense fallback={<LoadingSpinner />}>
        <SocialProofSection />
      </Suspense>
      <Suspense fallback={<LoadingSpinner />}>
        <ComprehensiveWaitlistForm />
      </Suspense>
      <Suspense fallback={<LoadingSpinner />}>
        <CTAFooter />
      </Suspense>
    </main>
  );
};

export default FyndaLanding;