/**
 * Secure Admin Authentication Component
 * 
 * This component handles admin authentication securely:
 * - Uses secure API endpoint for authentication
 * - No admin credentials stored in frontend
 * - JWT token management
 * - Rate limiting and security logging
 * - Environment-based admin access
 */

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { authenticateAdmin, isAdminAuthenticated, logoutAdmin } from '@/lib/api-client';
import { useToast } from '@/hooks/use-toast';
import { logSecurity, logger } from '@/utils/logger';
import { getSecurityConfig } from '@/utils/securityConfig';

interface SecureAdminAuthProps {
  children: React.ReactNode;
}

const SecureAdminAuth = ({ children }: SecureAdminAuthProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  
  const { toast } = useToast();

  // Check if admin is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authenticated = isAdminAuthenticated();
        setIsAuthenticated(authenticated);
        
        if (authenticated) {
          logger.info('Admin already authenticated', undefined, 'ADMIN');
          logSecurity('admin_auth_check', { status: 'authenticated' });
        } else {
          logger.info('Admin not authenticated', undefined, 'ADMIN');
          logSecurity('admin_auth_check', { status: 'not_authenticated' });
        }
      } catch (error) {
        logger.error('Auth check error', { error }, 'ADMIN');
        setIsAuthenticated(false);
      } finally {
        setCheckingAuth(false);
      }
    };

    checkAuth();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    logger.info('Admin login attempt started', undefined, 'ADMIN');
    logSecurity('admin_login_attempt', { email });

    try {
      const result = await authenticateAdmin(email, password);
      
      logger.info('Admin login successful', undefined, 'ADMIN');
      logSecurity('admin_login_success', { email });
      
      setIsAuthenticated(true);
      toast({
        title: "Welcome back!",
        description: "You have been successfully logged in.",
      });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Authentication failed';
      logger.error('Admin login error', { error: errorMessage }, 'ADMIN');
      logSecurity('admin_login_failed', { email, error: errorMessage });
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logger.info('Admin logout initiated', undefined, 'ADMIN');
    logSecurity('admin_logout', {});
    
    logoutAdmin();
    setIsAuthenticated(false);
    setEmail('');
    setPassword('');
    
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  // Show loading while checking authentication
  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // If authenticated, render protected content
  if (isAuthenticated) {
    return (
      <div>
        {/* Admin header with logout */}
        <div className="bg-background border-b px-6 py-3 flex justify-between items-center">
          <h1 className="text-lg font-semibold">Admin Panel</h1>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleLogout}
            className="text-destructive hover:text-destructive"
          >
            Logout
          </Button>
        </div>
        {children}
      </div>
    );
  }

  // Show login form
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-subtle p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
          <CardDescription>
            Enter your credentials to access the admin panel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@fynda.com"
                required
                disabled={loading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                disabled={loading}
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
          
          {getSecurityConfig().isDevelopment && (
            <div className="mt-6 p-4 bg-muted rounded-md">
              <p className="text-sm text-muted-foreground">
                <strong>Development Access:</strong> You can also enable admin access via:
                <br />• localStorage: <code>localStorage.setItem('fynda-admin', 'true')</code>
                <br />• Environment: Set <code>VITE_ADMIN_MODE=true</code>
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SecureAdminAuth;
