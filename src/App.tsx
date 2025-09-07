// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Security Components
import SecurityHeaders from './components/security/SecurityHeaders';

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
    </>
  );
}

export default App;
