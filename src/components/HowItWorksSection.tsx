import fyndaLogo from "@/assets/fynda-logo.png";

const HowItWorksSection = () => {
  const steps = [
    {
      number: "01",
      title: "AI Interview for All",
      description: "Every candidate gets the same fair chance with our AI interviewer. No shortcuts, no bias.",
      icon: "interview"
    },
    {
      number: "02", 
      title: "Fair Scoring & Ranking",
      description: "Skills and potential matter more than experience. Our AI evaluates what really counts.",
      icon: "scoring"
    },
    {
      number: "03",
      title: "Top Matches Shared", 
      description: "Employers receive a curated shortlist of candidates who truly fit their needs.",
      icon: "matches"
    }
  ];

  return (
    <section id="how-it-works" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            How It <span className="bg-gradient-hero bg-clip-text text-transparent">Works</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Three simple steps to fair hiring for everyone
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div 
              key={step.number}
              className="text-center space-y-6 p-8 rounded-2xl hover:shadow-soft transition-all duration-300 group"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Step number and icon */}
              <div className="relative">
                <div className="w-20 h-20 mx-auto bg-gradient-subtle rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <img 
                    src={fyndaLogo} 
                    alt={`Step ${step.number} icon`}
                    className="w-10 h-10 opacity-80"
                  />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-hero rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {step.number.slice(-1)}
                </div>
              </div>
              
              {/* Content */}
              <div className="space-y-4">
                <h3 className="text-2xl font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
              
              {/* Connection line (except for last item) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                  <div className="w-8 h-0.5 bg-gradient-to-r from-fynda-blue-100 to-transparent"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;