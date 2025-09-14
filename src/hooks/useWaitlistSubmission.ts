import { useCallback } from 'react';
import { WaitlistApiService } from '@/services/waitlist-api';
import { RetryService } from '@/services/retry-service';
import { logger } from '@/utils/logger';
import { toast } from '@/hooks/use-toast';
import { ERROR_MESSAGES } from '@/constants/validation';
import { useWaitlistContext } from '@/context/WaitlistContext';
import { EmployerWaitlistData, ValidationResult } from '@/schemas/waitlist';

export const useWaitlistSubmission = () => {
  const { state, setState, setShowSuccess } = useWaitlistContext();

  const submitForm = useCallback(async (validation: ValidationResult) => {
    if (state === 'loading') return;

    setState('loading');
    
    try {
      if (!validation.isValid) {
        setState('idle');
        toast({
          title: 'Validation Error',
          description: ERROR_MESSAGES.VALIDATION_ERROR,
          variant: 'destructive'
        });
        return { success: false, errors: validation.errors };
      }

      console.log('🌐 Submitting waitlist data:', validation);
      logger.info('Submitting waitlist form', { 
        email: validation.data?.email,
        industry: validation.data?.industry 
      });
      
      // Submit with enhanced retry logic
      const result = await RetryService.withRetry(
        () => WaitlistApiService.submitEmployerEntry(validation.data!),
        {
          shouldRetry: (error) => {
            // Don't retry validation errors or duplicate email errors
            if (error.error === ERROR_MESSAGES.EMAIL_EXISTS || 
                error.error === ERROR_MESSAGES.INVALID_DATA) {
              return false;
            }
            // Retry network connection failures
            if (error.error?.includes('Failed to fetch') || 
                error.error?.includes('NetworkError') ||
                error.error?.includes('Connection failed')) {
              console.log('🔄 Retrying network request...');
              return true;
            }
            return true;
          }
        }
      );
      
      if (result.success) {
        setState('success');
        setShowSuccess(true);
        console.log('🎉 Waitlist submission successful!');
        logger.info('Waitlist submission successful');
        
        toast({
          title: 'Welcome to the waitlist! 🎉',
          description: "We'll be in touch soon with updates.",
        });
        
        return { success: true, data: result.data };
      } else {
        setState('idle');
        console.error('❌ API returned error:', result.error);
        toast({
          title: 'Submission Failed',
          description: result.error || ERROR_MESSAGES.UNEXPECTED_ERROR,
          variant: 'destructive'
        });
        
        return { success: false, error: result.error };
      }
      
    } catch (error) {
      setState('idle');
      logger.error('Waitlist submission failed', { error });
      
      let errorMessage: string = ERROR_MESSAGES.UNEXPECTED_ERROR;
      let errorTitle: string = 'Submission Failed';
      
      if (error instanceof Error) {
        console.error('❌ Waitlist submission failed:', {
          error: error.message,
          stack: error.stack,
          type: typeof error
        });
        
        if (error.message.includes('email is already registered')) {
          errorMessage = ERROR_MESSAGES.EMAIL_EXISTS;
        } else if (error.message.includes('Failed to fetch')) {
          errorMessage = 'Unable to connect to our servers. Please check your internet connection and try again.';
          errorTitle = 'Connection Error';
        } else if (error.message.includes('NetworkError')) {
          errorMessage = 'Network error occurred. Please try again in a moment.';
          errorTitle = 'Network Error';
        } else if (error.message.includes('Connection failed')) {
          errorMessage = 'Connection to database failed. Our team has been notified.';
          errorTitle = 'Connection Error';
        }
      }
      
      toast({
        title: errorTitle,
        description: errorMessage,
        variant: 'destructive'
      });
      
      return { success: false, error: errorMessage };
    }
  }, [state, setState, setShowSuccess]);

  const isSubmitting = state === 'loading';

  return {
    submitForm,
    isSubmitting,
    state,
  };
};