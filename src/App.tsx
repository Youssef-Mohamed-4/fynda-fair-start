// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

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
import AdminProtected from './components/admin/AdminProtected';


function App() {
  return (
    <>
      <SecurityHeaders />
      <BrowserRouter>
        <Routes>
          {/* Public Pages */}
          <Route path="/" element={<Home />} />

          {/* Auth Page */}
          <Route path="/admin/auth" element={<Auth />} />

          {/* Protected Admin Pages */}
          <Route path="/admin" element={
            <AdminProtected>
              <AdminLayout />
            </AdminProtected>
          }>
            <Route index element={<Dashboard />} />
            <Route path="settings" element={<SiteSettings />} />
            <Route path="coming-soon" element={<ComingSoonToggle />} />
            <Route path="*" element={<AdminNotFound />} />
          </Route>

          {/* Catch-all fallback */}
          <Route path="*" element={<div>Page Not Found</div>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
