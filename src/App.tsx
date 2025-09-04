import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { useSecurityMonitoring } from "@/hooks/useSecurityMonitoring";
import SecurityHeaders from "@/components/security/SecurityHeaders";
import CSRFProtection from "@/components/security/CSRFProtection";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminProtected from "./components/admin/AdminProtected";
import Dashboard from "./pages/admin/Dashboard";
import SiteSettings from "./pages/admin/SiteSettings";
import ComingSoonToggle from "./pages/admin/ComingSoonToggle";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  useSecurityMonitoring();
  
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/admin" element={
        <AdminProtected>
          <AdminLayout />
        </AdminProtected>
      }>
        <Route index element={<Dashboard />} />
        <Route path="settings" element={<SiteSettings />} />
        <Route path="coming-soon" element={<ComingSoonToggle />} />
      </Route>
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CSRFProtection>
        <SecurityHeaders />
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </TooltipProvider>
      </CSRFProtection>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
