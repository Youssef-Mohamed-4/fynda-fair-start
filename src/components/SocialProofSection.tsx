const SocialProofSection = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          
          {/* Main stat */}
          <div className="mb-12">
            <div className="inline-flex items-center space-x-6 p-8 bg-fynda-blue-50 rounded-3xl border border-fynda-blue-100">
              <div className="text-center">
                <div className="text-6xl md:text-7xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                  70%
                </div>
                <p className="text-lg text-muted-foreground mt-2">
                  of young people face rejection
                  <br />
                  <span className="font-semibold text-fynda-navy">without an interview</span>
                </p>
              </div>
              
              <div className="hidden md:block w-px h-20 bg-fynda-blue-100"></div>
              
              <div className="text-center">
                <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                  Fynda changes that.
                </h3>
                <p className="text-muted-foreground">
                  Every candidate gets a fair chance
                  <br />
                  to showcase their potential
                </p>
              </div>
            </div>
          </div>
          
          {/* Supporting stats */}
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-3xl font-bold text-fynda-navy mb-2">100%</div>
              <p className="text-muted-foreground">Interview Rate</p>
              <p className="text-sm text-muted-foreground mt-1">Every applicant gets heard</p>
            </div>
            
            <div className="text-center p-6">
              <div className="text-3xl font-bold text-fynda-navy mb-2">0</div>
              <p className="text-muted-foreground">CVs Required</p>
              <p className="text-sm text-muted-foreground mt-1">Skills over paperwork</p>
            </div>
            
            <div className="text-center p-6">
              <div className="text-3xl font-bold text-fynda-navy mb-2">AI</div>
              <p className="text-muted-foreground">Fair Screening</p>
              <p className="text-sm text-muted-foreground mt-1">Unbiased evaluation</p>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default SocialProofSection;