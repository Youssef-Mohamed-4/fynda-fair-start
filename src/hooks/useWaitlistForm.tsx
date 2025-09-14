import { useState, useCallback, useMemo, useRef } from 'react';
import { submitWaitlistEntry } from '@/lib/api-client';
import { 
  employerWaitlistSchema, 
  type EmployerFormData, 
  type EmployerWaitlistData,
  type ValidationResult 
} from '@/schemas/waitlist';
import { logger } from '@/utils/logger';
import { toast } from '@/hooks/use-toast';

export type FormState = 'idle' | 'loading' | 'success' | 'error';

export interface UseWaitlistFormReturn {
  // State
  formData: EmployerFormData;
  state: FormState;
  errors: Partial<Record<keyof EmployerFormData, string>>;
  
  // Actions
  updateField: (field: keyof EmployerFormData, value: string) => void;
  submitForm: () => Promise<void>;
  resetForm: () => void;
  
  // Computed
  isValid: boolean;
  isSubmitting: boolean;
}

const initialFormData: EmployerFormData = {
  name: '',
  email: '',
  industry: '',
  company_size: '',
  early_career_hires_per_year: ''
};

export const useWaitlistForm = (): UseWaitlistFormReturn => {
  const [formData, setFormData] = useState<EmployerFormData>(initialFormData);
  const [state, setState] = useState<FormState>('idle');
  const [errors, setErrors] = useState<Partial<Record<keyof EmployerFormData, string>>>({});
  
  // Use ref to store timeout IDs for cleanup
  const timeoutRefs = useRef<Record<string, NodeJS.Timeout>>({});

  // Validate individual field with proper error handling
  const validateField = useCallback((field: keyof EmployerFormData, value: string): string | null => {
    try {
      switch (field) {
        case 'name':
          employerWaitlistSchema.shape.name.parse(value);
          break;
        case 'email':
          employerWaitlistSchema.shape.email.parse(value);
          break;
        case 'industry':
          if (value) employerWaitlistSchema.shape.industry.parse(value);
          break;
        case 'company_size':
          if (value) employerWaitlistSchema.shape.company_size.parse(value);
          break;
        case 'early_career_hires_per_year':
          if (value.trim()) {
            const numValue = parseInt(value, 10);
            if (isNaN(numValue)) throw new Error('Must be a valid number');
            employerWaitlistSchema.shape.early_career_hires_per_year.parse(numValue);
          }
          break;
      }
      return null;
    } catch (error: any) {
      const message = error.errors?.[0]?.message || error.message || 'Invalid input';
      return message;
    }
  }, []);

  // Update field with debounced validation and proper cleanup
  const updateField = useCallback((field: keyof EmployerFormData, value: string) => {
    // Update form data immediately for responsive UI
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear existing error when user starts typing
    setErrors(prev => {
      if (prev[field]) {
        const { [field]: _, ...rest } = prev;
        return rest;
      }
      return prev;
    });
    
    // Clear existing timeout for this field
    if (timeoutRefs.current[field]) {
      clearTimeout(timeoutRefs.current[field]);
    }
    
    // Set up debounced validation
    timeoutRefs.current[field] = setTimeout(() => {
      const error = validateField(field, value);
      if (error) {
        setErrors(prev => ({ ...prev, [field]: error }));
      }
      delete timeoutRefs.current[field];
    }, 300);
  }, [validateField]);

  // Validate entire form for submission
  const validateForm = useCallback((): ValidationResult => {
    try {
      // Prepare data for validation with proper type conversion
      const earlyCareerValue = formData.early_career_hires_per_year?.toString().trim();
      const dataToValidate = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        industry: formData.industry,
        company_size: formData.company_size,
        early_career_hires_per_year: earlyCareerValue && earlyCareerValue !== '' 
          ? parseInt(earlyCareerValue, 10) 
          : undefined
      };

      // Validate with Zod schema
      const validatedData = employerWaitlistSchema.parse(dataToValidate);
      
      return { isValid: true, data: validatedData };
    } catch (error: any) {
      const fieldErrors: Partial<Record<keyof EmployerFormData, string>> = {};
      
      if (error.errors) {
        error.errors.forEach((err: any) => {
          const field = err.path[0] as keyof EmployerFormData;
          if (field) {
            fieldErrors[field] = err.message;
          }
        });
      }
      
      return { isValid: false, errors: fieldErrors };
    }
  }, [formData]);

  // Submit form with comprehensive error handling
  const submitForm = useCallback(async () => {
    if (state === 'loading') return;

    setState('loading');
    
    try {
      // Clear any existing timeouts
      Object.values(timeoutRefs.current).forEach(clearTimeout);
      timeoutRefs.current = {};
      
      // Validate form
      const validation = validateForm();
      
      if (!validation.isValid) {
        setState('idle');
        if (validation.errors) {
          setErrors(validation.errors);
        }
        toast({
          title: 'Validation Error',
          description: 'Please fix the errors above and try again.',
          variant: 'destructive'
        });
        return;
      }

      logger.info('Submitting waitlist form', { 
        email: validation.data?.email,
        industry: validation.data?.industry 
      });
      
      // Submit to Supabase
      const result = await submitWaitlistEntry('employer', validation.data!);
      
      if (result.success) {
        setState('success');
        logger.info('Waitlist submission successful');
        
        toast({
          title: 'Success!',
          description: 'You\'ve been added to our waitlist. We\'ll be in touch soon!',
        });
      }
      
    } catch (error) {
      setState('idle');
      logger.error('Waitlist submission failed', { error });
      
      let errorMessage = 'An unexpected error occurred. Please try again.';
      
      if (error instanceof Error) {
        if (error.message.includes('email is already registered')) {
          errorMessage = 'This email is already registered in our waitlist!';
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          errorMessage = 'Network error. Please check your connection and try again.';
        }
      }
      
      toast({
        title: 'Submission Failed',
        description: errorMessage,
        variant: 'destructive'
      });
    }
  }, [state, validateForm]);

  // Reset form to initial state
  const resetForm = useCallback(() => {
    // Clear timeouts
    Object.values(timeoutRefs.current).forEach(clearTimeout);
    timeoutRefs.current = {};
    
    // Reset state
    setFormData(initialFormData);
    setErrors({});
    setState('idle');
  }, []);

  // Computed values with proper validation
  const isValid = useMemo(() => {
    const hasRequiredFields = Boolean(
      formData.name.trim() && 
      formData.email.trim() && 
      formData.industry && 
      formData.company_size
    );
    const hasNoErrors = Object.keys(errors).length === 0;
    return hasRequiredFields && hasNoErrors;
  }, [formData, errors]);

  const isSubmitting = state === 'loading';

  // Cleanup timeouts on unmount
  const cleanup = useCallback(() => {
    Object.values(timeoutRefs.current).forEach(clearTimeout);
    timeoutRefs.current = {};
  }, []);

  return {
    formData,
    state,
    errors,
    updateField,
    submitForm,
    resetForm,
    isValid,
    isSubmitting,
    cleanup
  } as UseWaitlistFormReturn & { cleanup: () => void };
};