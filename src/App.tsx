import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Pages
import IndexPage from './pages/Index';
import AuthPage from './pages/admin/Auth';
import NotFoundPage from './pages/admin/NotFound';

// Admin components
import ComingSoonToggle from './pages/admin/ComingSoonToggle';
import SiteSettings from './pages/admin/SiteSettings';
import AdminProtected from './components/admin/AdminProtected';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public home page */}
        <Route path="/" element={<IndexPage />} />

        {/* Admin routes */}
        <Route
          path="/admin/*"
          element={
            <AdminProtected>
              <Routes>
                <Route path="auth" element={<AuthPage />} />
                <Route path="coming-soon" element={<ComingSoonToggle />} />
                <Route path="settings" element={<SiteSettings />} />
              </Routes>
            </AdminProtected>
          }
        />

        {/* 404 fallback */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
