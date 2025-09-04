import { Button } from "@/components/ui/button";

const WhyFyndaSection = () => {
  return (
    <section id="why-fynda" className="py-24 bg-fynda-blue-50/30">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          
          {/* Section header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Why <span className="bg-gradient-hero bg-clip-text text-transparent">Fynda</span>?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Transforming hiring for both candidates and employers
            </p>
          </div>
          
          {/* Split grid */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Candidate side */}
            <div className="space-y-8 p-8 bg-background rounded-3xl shadow-soft hover:shadow-medium transition-all duration-300">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-hero rounded-2xl flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground">For Candidates</h3>
                  <p className="text-fynda-light-blue font-medium">Young Talent</p>
                </div>
              </div>
              
              <blockquote className="text-xl text-foreground font-medium leading-relaxed">
                "Equal chance for everyone, no bias, no endless rejection."
              </blockquote>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-gradient-hero rounded-full flex items-center justify-center mt-0.5">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-muted-foreground">No CV required - everyone gets interviewed</p>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-gradient-hero rounded-full flex items-center justify-center mt-0.5">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-muted-foreground">Fair AI interviews for every applicant</p>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-gradient-hero rounded-full flex items-center justify-center mt-0.5">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-muted-foreground">Focus on skills, not just experience</p>
                </div>
              </div>
            </div>
            
            {/* Employer side */}
            <div className="space-y-8 p-8 bg-fynda-navy text-white rounded-3xl shadow-large hover:shadow-xl transition-all duration-300">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold">For Employers</h3>
                  <p className="text-fynda-light-blue font-medium">Smarter Hiring</p>
                </div>
              </div>
              
              <blockquote className="text-xl font-medium leading-relaxed">
                "Smarter shortlists, less time wasted, better hires."
              </blockquote>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center mt-0.5">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-white/80">AI-powered candidate screening</p>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center mt-0.5">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-white/80">Discover hidden talent early</p>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center mt-0.5">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-white/80">Reduce hiring bias and time-to-hire</p>
                </div>
              </div>
            </div>
            
          </div>
          
          {/* CTA */}
          <div className="text-center mt-16">
            <Button variant="hero" size="xl">
              Join Both Sides of the Revolution
            </Button>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default WhyFyndaSection;