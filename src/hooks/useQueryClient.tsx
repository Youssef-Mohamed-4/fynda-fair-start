/**
 * React Query Configuration
 * 
 * Optimized React Query setup with proper error handling,
 * retry logic, and caching strategies.
 */

import { QueryClient } from '@tanstack/react-query';
import { logger } from '@/utils/logger';

// Create optimized query client
export const createQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Stale time - how long data is considered fresh (5 minutes)
        staleTime: 5 * 60 * 1000,
        
        // Cache time - how long inactive data stays in cache (10 minutes)
        gcTime: 10 * 60 * 1000,
        
        // Retry configuration
        retry: (failureCount, error: any) => {
          // Don't retry on 4xx errors (client errors)
          if (error?.status >= 400 && error?.status < 500) {
            return false;
          }
          
          // Retry up to 3 times for other errors
          return failureCount < 3;
        },
        
        // Retry delay with exponential backoff
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        
        // Don't refetch on window focus by default
        refetchOnWindowFocus: false,
        
        // Refetch on reconnect
        refetchOnReconnect: true,
        
        // Error handling
        throwOnError: (error: any) => {
          logger.error('Query error', { error }, 'QUERY');
          return false; // Don't throw by default, handle in components
        }
      },
      mutations: {
        // Retry mutations once
        retry: 1,
        
        // Mutation error handling
        throwOnError: (error: any) => {
          logger.error('Mutation error', { error }, 'MUTATION');
          return true; // Throw mutation errors so components can handle them
        }
      }
    }
  });
};