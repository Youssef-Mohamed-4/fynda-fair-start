import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Settings } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import fyndaLogo from "@/assets/fynda-logo.png";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAdmin } = useAuth();

  const scrollToWaitlist = () => {
    const waitlistElement = document.getElementById('waitlist-form');
    if (waitlistElement) {
      waitlistElement.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img 
              src={fyndaLogo} 
              alt="Fynda logo - geometric symbol representing connection and fairness" 
              className="w-8 h-8 animate-float"
            />
            <span className="text-2xl font-bold text-foreground">Fynda</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#how-it-works" className="text-foreground/80 hover:text-foreground transition-colors">
              How it Works
            </a>
            <a href="#why-fynda" className="text-foreground/80 hover:text-foreground transition-colors">
              Why Fynda
            </a>
            {user && (
              <>
                <Link to="/auth" className="text-foreground/80 hover:text-foreground transition-colors">
                  Account
                </Link>
                {isAdmin && (
                  <Link 
                    to="/admin" 
                    className="flex items-center space-x-1 text-foreground/80 hover:text-foreground transition-colors"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Admin</span>
                  </Link>
                )}
              </>
            )}
            {!user && (
              <Link to="/auth" className="text-foreground/80 hover:text-foreground transition-colors">
                Login
              </Link>
            )}
            <Button 
              onClick={scrollToWaitlist}
              className="bg-gradient-primary text-primary-foreground hover:opacity-90 transition-opacity"
            >
              Join Waitlist
            </Button>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border/40">
            <nav className="flex flex-col space-y-4">
              <a 
                href="#how-it-works" 
                className="text-foreground/80 hover:text-foreground transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                How it Works
              </a>
              <a 
                href="#why-fynda" 
                className="text-foreground/80 hover:text-foreground transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Why Fynda
              </a>
              {user && (
                <>
                  <Link 
                    to="/auth" 
                    className="text-foreground/80 hover:text-foreground transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Account
                  </Link>
                  {isAdmin && (
                    <Link 
                      to="/admin" 
                      className="flex items-center space-x-1 text-foreground/80 hover:text-foreground transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Settings className="h-4 w-4" />
                      <span>Admin Panel</span>
                    </Link>
                  )}
                </>
              )}
              {!user && (
                <Link 
                  to="/auth" 
                  className="text-foreground/80 hover:text-foreground transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
              )}
              <Button 
                onClick={scrollToWaitlist}
                className="bg-gradient-primary text-primary-foreground hover:opacity-90 transition-opacity w-fit"
              >
                Join Waitlist
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;