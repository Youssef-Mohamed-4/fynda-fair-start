import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/hooks/useAuth';

import Home from '@/pages/Home';
import Auth from '@/pages/admin/Auth';
import AdminLayout from '@/pages/admin/AdminLayout';
import ComingSoonToggle from '@/pages/admin/ComingSoonToggle';
import SiteSettings from '@/pages/admin/SiteSettings';
import Dashboard from '@/pages/Index';

const queryClient = new QueryClient();

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin/auth" element={<Auth />} />

            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="coming-soon" element={<ComingSoonToggle />} />
              <Route path="settings" element={<SiteSettings />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;
