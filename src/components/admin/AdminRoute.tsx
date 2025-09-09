import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import { hasAdminAccess, logSecurityEvent, getSecurityConfig } from '@/utils/security';

interface AdminRouteProps {
  children: React.ReactNode;
}

/**
 * AdminRoute Component - Enhanced Admin Protection
 * 
 * This component provides multiple layers of admin protection:
 * 1. Database-based admin check (primary)
 * 2. localStorage flag fallback (fynda-admin = true)
 * 3. Environment variable check (VITE_ADMIN_MODE = true)
 * 4. Debug logging for security monitoring
 * 
 * Security Features:
 * - Prevents unauthorized access to admin routes
 * - Provides fallback authentication methods
 * - Logs all access attempts for security auditing
 * - Graceful error handling and user feedback
 */
const AdminRoute = ({ children }: AdminRouteProps) => {
  const { user, isAdmin, loading } = useAuth();
  const [localStorageAdmin, setLocalStorageAdmin] = useState(false);
  const [envAdmin, setEnvAdmin] = useState(false);

  // Check admin access using security utilities
  useEffect(() => {
    const checkAdminAccess = () => {
      try {
        const securityConfig = getSecurityConfig();
        const localAdminAccess = hasAdminAccess();
        
        setLocalStorageAdmin(localAdminAccess);
        setEnvAdmin(securityConfig.adminMode);
        
        // Log security event
        logSecurityEvent('admin_access_check', {
          hasLocalAccess: localAdminAccess,
          hasEnvAccess: securityConfig.adminMode,
          isDevelopment: securityConfig.isDevelopment
        });
        
        if (localAdminAccess || securityConfig.adminMode) {
          console.log('🔐 AdminRoute: Admin access detected via fallback methods');
        }
      } catch (error) {
        console.error('🔐 AdminRoute: Error checking admin access:', error);
        setLocalStorageAdmin(false);
        setEnvAdmin(false);
      }
    };

    checkAdminAccess();
  }, []);

  // Debug logging for security monitoring
  useEffect(() => {
    console.log('🔐 AdminRoute: Access attempt -', {
      user: !!user,
      isAdmin,
      localStorageAdmin,
      envAdmin,
      loading,
      timestamp: new Date().toISOString()
    });
  }, [user, isAdmin, localStorageAdmin, envAdmin, loading]);

  // Show loading spinner while checking authentication
  if (loading) {
    console.log('🔐 AdminRoute: Still loading authentication state...');
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  // Check if user has admin access through any method
  const hasUserAdminAccess = isAdmin || localStorageAdmin || envAdmin;

  // If no user is authenticated, redirect to login
  if (!user) {
    console.log('🔐 AdminRoute: No authenticated user, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // If user is authenticated but not admin, show access denied
  if (!hasUserAdminAccess) {
    console.log('🔐 AdminRoute: User authenticated but not admin, showing access denied');
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="text-center max-w-md">
          <div className="mb-6">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Access Denied</h1>
            <p className="text-muted-foreground mb-6">
              You don't have admin privileges to access this area. 
              Only authorized administrators can view this content.
            </p>
          </div>
          
          <div className="space-y-3">
            <button 
              onClick={() => window.location.href = '/'}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md transition-colors"
            >
              Return to Home
            </button>
            
            <button 
              onClick={() => {
                // Clear any admin flags and redirect to login
                localStorage.removeItem('fynda-admin');
                window.location.href = '/login';
              }}
              className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 px-4 py-2 rounded-md transition-colors"
            >
              Try Different Account
            </button>
          </div>
          
          <div className="mt-6 p-4 bg-muted rounded-md">
            <p className="text-sm text-muted-foreground">
              <strong>Need admin access?</strong> Contact your system administrator or check if you have the correct permissions.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // User has admin access, render the protected content
  console.log('🔐 AdminRoute: Admin access granted, rendering protected content');
  return <>{children}</>;
};

export default AdminRoute;