import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { logger } from '@/utils/logger';

interface AdminProtectedProps {
  children: React.ReactNode;
}

const AdminProtected = ({ children }: AdminProtectedProps) => {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user) {
    logger.info('Admin access denied - no user', undefined, 'ADMIN');
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    logger.info('Admin access denied - not admin', undefined, 'ADMIN');
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

  return <>{children}</>;
};

export default AdminProtected;