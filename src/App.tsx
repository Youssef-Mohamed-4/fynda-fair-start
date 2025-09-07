// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Security Components
import SecurityHeaders from './components/security/SecurityHeaders';
import CSRFProtection from './components/security/CSRFProtection';

// Pages
import Home from './pages/Index';
import Auth from './pages/Auth';
import AdminNotFound from './pages/NotFound';
import SiteSettings from './pages/admin/SiteSettings';
import ComingSoonToggle from './pages/admin/ComingSoonToggle';


function App() {
  return (
    <>
      <SecurityHeaders />
      <CSRFProtection>
        <BrowserRouter>
          <Routes>
            {/* Public Pages */}
            <Route path="/" element={<Home />} />

            {/* Admin Pages */}
            <Route path="/admin/auth" element={<Auth />} />
            <Route path="/admin/settings" element={<SiteSettings />} />
            <Route path="/admin/coming-soon" element={<ComingSoonToggle />} />
            <Route path="/admin/*" element={<AdminNotFound />} />

            {/* Catch-all fallback */}
            <Route path="*" element={<div>Page Not Found</div>} />
          </Routes>
        </BrowserRouter>
      </CSRFProtection>
    </>
  );
}

export default App;
