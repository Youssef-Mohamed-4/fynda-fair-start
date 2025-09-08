import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface AdminProtectedProps {
  children: React.ReactNode;
}

const AdminProtected = ({ children }: AdminProtectedProps) => {
  const { user, isAdmin, loading } = useAuth();

  // Debug logging for authentication flow
  console.log('🔐 AdminProtected: loading:', loading, 'user:', !!user, 'isAdmin:', isAdmin);

  if (loading) {
    console.log('🔐 AdminProtected: Still loading auth state...');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user) {
    console.log('🔐 AdminProtected: No user found, redirecting to /login');
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    console.log('🔐 AdminProtected: User found but not admin, showing access denied');
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-4">
            You don't have admin privileges to access this area.
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            className="text-primary hover:underline"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  console.log('🔐 AdminProtected: User is authenticated and admin, rendering children');
  return <>{children}</>;
};

export default AdminProtected;