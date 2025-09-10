// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Security Components
import SecurityHeaders from './components/security/SecurityHeaders';

// Pages
import Home from './pages/Index';
import Auth from './pages/Auth';
import AdminNotFound from './pages/NotFound';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import SiteSettings from './pages/admin/SiteSettings';
import ComingSoonToggle from './pages/admin/ComingSoonToggle';
import WaitlistManagement from './pages/admin/WaitlistManagement';
import ContentManagement from './pages/admin/ContentManagement';
import AnalyticsDashboard from './pages/admin/AnalyticsDashboard';
import UserManagement from './pages/admin/UserManagement';
import TestPage from './components/TestPage';

// Admin Protection Component
import AdminProtected from './components/admin/AdminProtected';

function App() {
  return (
    <>
      <SecurityHeaders />
      <BrowserRouter>
        <Routes>
          {/* Public Pages */}
          <Route path="/" element={<Home />} />
          <Route path="/test" element={<TestPage />} />
          
          {/* Auth Routes */}
          <Route path="/login" element={<Auth />} />
          <Route path="/auth" element={<Auth />} />

          {/* Protected Admin Pages */}
          <Route path="/admin" element={
            <AdminProtected>
              <AdminLayout />
            </AdminProtected>
          }>
            <Route index element={<Dashboard />} />
            <Route path="analytics" element={<AnalyticsDashboard />} />
            <Route path="waitlist" element={<WaitlistManagement />} />
            <Route path="content" element={<ContentManagement />} />
            <Route path="settings" element={<SiteSettings />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="coming-soon" element={<ComingSoonToggle />} />
            <Route path="*" element={<AdminNotFound />} />
          </Route>

          {/* Catch-all fallback */}
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
