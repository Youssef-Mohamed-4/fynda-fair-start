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

      logger.info('Submitting waitlist form', { 
        email: validation.data?.email,
        industry: validation.data?.industry 
      });
      
      // Submit with retry logic
      const result = await RetryService.withRetry(
        () => WaitlistApiService.submitEmployerEntry(validation.data!),
        {
          shouldRetry: (error) => {
            // Don't retry validation errors or duplicate email errors
            if (error.error === ERROR_MESSAGES.EMAIL_EXISTS || 
                error.error === ERROR_MESSAGES.INVALID_DATA) {
              return false;
            }
            return true;
          }
        }
      );
      
      if (result.success) {
        setState('success');
        setShowSuccess(true);
        logger.info('Waitlist submission successful');
        
        toast({
          title: 'Success!',
          description: ERROR_MESSAGES.SUBMISSION_SUCCESS,
        });
        
        return { success: true, data: result.data };
      } else {
        setState('idle');
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
      
      if (error instanceof Error) {
        if (error.message.includes('email is already registered')) {
          errorMessage = ERROR_MESSAGES.EMAIL_EXISTS;
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          errorMessage = ERROR_MESSAGES.NETWORK_ERROR;
        }
      }
      
      toast({
        title: 'Submission Failed',
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