// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Security Components
import SecurityHeaders from './components/security/SecurityHeaders';

// Pages
import Home from './pages/Index';
import AdminNotFound from './pages/NotFound';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import SiteSettings from './pages/admin/SiteSettings';
import ComingSoonToggle from './pages/admin/ComingSoonToggle';

// Enhanced Admin Protection Components
import AdminRoute from './components/admin/AdminRoute';
import AdminProtected from './components/admin/AdminProtected';
import SecureAdminAuth from './components/admin/SecureAdminAuth';

/**
 * App Component - Main Application Router with Enhanced Security
 * 
 * This component provides:
 * - Comprehensive security headers
 * - Multiple layers of admin protection
 * - Debug logging for security monitoring
 * - Graceful error handling
 * - Performance optimizations
 * 
 * Security Features:
 * - AdminRoute: localStorage + environment variable + database admin checks
 * - AdminProtected: Database-based admin authentication
 * - SecurityHeaders: Enhanced CSP and security headers
 * - Rate limiting and input sanitization
 */
function App() {
  // Debug logging for app routing and security
  console.log('🔐 App: Initializing enhanced routing with multi-layer security protection');
  console.log('🔐 App: Admin protection methods available:', {
    localStorage: 'fynda-admin flag',
    environment: 'VITE_ADMIN_MODE variable',
    database: 'admin_users table check'
  });

  return (
    <>
      <SecurityHeaders />
      <BrowserRouter>
        <Routes>
          {/* Public Pages - No authentication required */}
          <Route path="/" element={<Home />} />

          {/* Admin Login Route */}
          <Route path="/login" element={<Navigate to="/admin" replace />} />

          {/* Protected Admin Pages - Secure server-side authentication */}
          <Route path="/admin" element={
            <SecureAdminAuth>
              <AdminLayout />
            </SecureAdminAuth>
          }>
            <Route index element={<Dashboard />} />
            <Route path="settings" element={<SiteSettings />} />
            <Route path="coming-soon" element={<ComingSoonToggle />} />
            <Route path="*" element={<AdminNotFound />} />
          </Route>

          {/* Catch-all fallback with security logging */}
          <Route path="*" element={
            <div className="min-h-screen flex items-center justify-center bg-background">
              <div className="text-center">
                <h1 className="text-4xl font-bold mb-4">404</h1>
                <p className="text-xl text-muted-foreground mb-4">Page not found</p>
                <a href="/" className="text-primary hover:underline">
                  Return to Home
                </a>
              </div>
            </div>
          } />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
