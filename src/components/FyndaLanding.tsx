import Header from "./Header";
import HeroSection from "./HeroSection";
import HowItWorksSection from "./HowItWorksSection";
import WhyFyndaSection from "./WhyFyndaSection";
import SocialProofSection from "./SocialProofSection";
import ComprehensiveWaitlistForm from "./ComprehensiveWaitlistForm";
import CTAFooter from "./CTAFooter";

const FyndaLanding = () => {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <HowItWorksSection />
      <WhyFyndaSection />
      <SocialProofSection />
      <ComprehensiveWaitlistForm />
      <CTAFooter />
    </main>
  );
};

export default FyndaLanding;