import { Button } from "@/components/ui/button";
import fyndaLogo from "@/assets/fynda-logo.png";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img 
              src={fyndaLogo} 
              alt="Fynda logo - geometric symbol representing connection and fairness" 
              className="w-8 h-8 animate-float"
            />
            <span className="text-2xl font-bold text-foreground">Fynda</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              How It Works
            </Button>
            <Button 
              variant="waitlist" 
              size="sm"
              onClick={() => document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Join Waitlist
            </Button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;