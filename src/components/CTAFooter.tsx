import { Button } from '@/components/ui/button';
import { Linkedin } from 'lucide-react';
import fyndaLogo from '@/assets/fynda-logo.png';

const CTAFooter = () => {
  const scrollToWaitlist = () => {
    const waitlistElement = document.getElementById('waitlist-form');
    if (waitlistElement) {
      waitlistElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer 
      className="relative py-24 bg-primary text-white overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-foreground/20"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-12">
          
          <div className="flex items-center justify-center mb-8">
            <img 
              src={fyndaLogo} 
              alt="Fynda Logo" 
              className="h-12 w-auto mr-3"
            />
            <span className="text-2xl font-bold text-white">Fynda</span>
          </div>
          
          <div className="space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              Be among the first to shape 
              <br />
              <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                the future of hiring
              </span>
            </h2>
            
            <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
              Join our waitlist and get early access to the platform where everyone deserves an interview.
            </p>
          </div>
          
          <div className="flex justify-center mb-12">
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-gray-100"
              onClick={scrollToWaitlist}
            >
              Join Waitlist
            </Button>
          </div>
          
          {/* Footer Links */}
          <div className="border-t border-white/20 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">              
              <div className="flex items-center space-x-4">
                <span className="text-white/60 text-sm">Follow us:</span>
                <div className="flex space-x-3">
                  <a 
                    href="https://www.linkedin.com/company/fynda-ai/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    <Linkedin className="h-5 w-5" />
                  </a>
                </div>
              </div>
              
              <p className="text-white/60 text-sm">
                © 2025 Fynda. All rights reserved.
              </p>
            </div>
          </div>
          
        </div>
      </div>
    </footer>
  );
};

export default CTAFooter;