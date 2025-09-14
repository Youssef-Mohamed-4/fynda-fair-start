import { useRef, useCallback, useEffect } from 'react';
import { VALIDATION_CONSTANTS } from '@/constants/validation';

export const useFormTimeouts = () => {
  const timeoutRefs = useRef<Record<string, NodeJS.Timeout>>({});

  // Set debounced timeout for a specific field
  const setFieldTimeout = useCallback((
    field: string, 
    callback: () => void, 
    delay: number = VALIDATION_CONSTANTS.DEBOUNCE_DELAY
  ) => {
    // Clear existing timeout for this field
    if (timeoutRefs.current[field]) {
      clearTimeout(timeoutRefs.current[field]);
    }
    
    // Set up new timeout
    timeoutRefs.current[field] = setTimeout(() => {
      callback();
      delete timeoutRefs.current[field];
    }, delay);
  }, []);

  // Clear timeout for specific field
  const clearFieldTimeout = useCallback((field: string) => {
    if (timeoutRefs.current[field]) {
      clearTimeout(timeoutRefs.current[field]);
      delete timeoutRefs.current[field];
    }
  }, []);

  // Clear all timeouts
  const clearAllTimeouts = useCallback(() => {
    Object.values(timeoutRefs.current).forEach(clearTimeout);
    timeoutRefs.current = {};
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearAllTimeouts();
    };
  }, [clearAllTimeouts]);

  return {
    setFieldTimeout,
    clearFieldTimeout,
    clearAllTimeouts,
  };
};