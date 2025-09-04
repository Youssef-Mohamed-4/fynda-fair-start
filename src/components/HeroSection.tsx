import { Button } from "@/components/ui/button";
import heroIllustration from "@/assets/hero-illustration.png";

const HeroSection = () => {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-subtle opacity-30"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left side - Text content */}
            <div className="text-center lg:text-left space-y-8 animate-fade-in">
              <div className="space-y-6">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight">
                  Fair AI Hiring 
                  <span className="bg-gradient-hero bg-clip-text text-transparent">for Early Careers</span>
                </h1>
                
                <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl leading-relaxed">
                  Everyone deserves an interview. Fynda makes it happen with AI-powered fairness.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button variant="hero" size="xl" className="group">
                  Join the Waitlist
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Button>
                
                <Button variant="subtle" size="xl">
                  How It Works
                </Button>
              </div>
              
              <div className="pt-4">
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-fynda-navy">Every candidate</span> gets a fair chance. 
                  <br className="hidden sm:block" />
                  <span className="font-semibold">No more CV screening barriers.</span>
                </p>
              </div>
            </div>
            
            {/* Right side - Illustration */}
            <div className="flex justify-center lg:justify-end animate-fade-in">
              <div className="relative">
                <img 
                  src={heroIllustration} 
                  alt="Network visualization showing connections between people and opportunities through AI"
                  className="w-full max-w-lg h-auto animate-float"
                />
                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-hero rounded-full opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-fynda-light-blue rounded-full opacity-30 animate-pulse" style={{animationDelay: '1s'}}></div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;