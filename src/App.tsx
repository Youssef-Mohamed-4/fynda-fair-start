import { BrowserRouter, Route, Routes } from 'react-router-dom';
import IndexPage from '@/pages/Index';
import AuthPage from '@/pages/admin/Auth';
import NotFoundPage from '@/pages/NotFound';
import ComingSoonToggle from '@/components/ComingSoon';
import SiteSettings from '@/components/SiteSettings';
import AdminLayout from '@/components/admin/AdminLayout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public home page */}
        <Route path="/" element={<IndexPage />} />

        {/* Admin routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="auth" element={<AuthPage />} />
          <Route path="coming-soon" element={<ComingSoonToggle />} />
          <Route path="settings" element={<SiteSettings />} />
        </Route>

        {/* Catch all 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
