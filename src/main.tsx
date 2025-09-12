import { createRoot } from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/hooks/useAuth';
import { createQueryClient } from '@/hooks/useQueryClient';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import './index.css';

// Import admin setup utilities for development only
if (import.meta.env.DEV) {
  import('@/utils/adminSetup');
}

const queryClient = createQueryClient();

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);
