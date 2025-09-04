import { Button } from "@/components/ui/button";
import patternBackground from "@/assets/pattern-background.png";
import fyndaLogo from "@/assets/fynda-logo.png";

const CTAFooter = () => {
  return (
    <footer 
      className="relative py-24 bg-fynda-navy text-white overflow-hidden"
      style={{ 
        backgroundImage: `url(${patternBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundBlendMode: 'overlay'
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-fynda-navy/90"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          
          {/* Logo and brand */}
          <div className="flex justify-center items-center space-x-4 mb-8">
            <img 
              src={fyndaLogo} 
              alt="Fynda logo"
              className="w-12 h-12 opacity-80 animate-float"
            />
            <span className="text-3xl font-bold">Fynda</span>
          </div>
          
          {/* Main CTA */}
          <div className="space-y-8">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Be among the first to shape 
              <br />
              <span className="bg-gradient-to-r from-white to-fynda-light-blue bg-clip-text text-transparent">
                the future of hiring
              </span>
            </h2>
            
            <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
              Join our waitlist and get early access to the platform that's changing how young talent connects with opportunity.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                variant="hero" 
                size="xl"
                className="bg-white text-fynda-navy hover:bg-white/90"
              >
                Join Waitlist
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Button>
              
              <Button variant="ghost" size="lg" className="text-white border-white/20 hover:bg-white/10">
                Learn More
              </Button>
            </div>
          </div>
          
          {/* Footer info */}
          <div className="pt-16 border-t border-white/10 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex items-center space-x-6 text-white/60">
                <span>© 2024 Fynda</span>
                <a href="#" className="hover:text-white transition-colors">Privacy</a>
                <a href="#" className="hover:text-white transition-colors">Terms</a>
                <a href="#" className="hover:text-white transition-colors">Contact</a>
              </div>
              
              <div className="flex items-center space-x-4">
                <a href="#" className="text-white/60 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="text-white/60 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </a>
                <a href="#" className="text-white/60 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            <p className="text-sm text-white/40 max-w-2xl mx-auto leading-relaxed">
              Fynda is revolutionizing early career hiring with AI-powered interviews and fair shortlisting. 
              Connect talent with opportunity, eliminate bias, and build the future workforce.
            </p>
          </div>
          
        </div>
      </div>
    </footer>
  );
};

export default CTAFooter;