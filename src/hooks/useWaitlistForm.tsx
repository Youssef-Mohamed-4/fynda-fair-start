import { useState, useCallback, useMemo } from 'react';
import { submitWaitlistEntry } from '@/lib/api-client';
import { employerWaitlistSchema, type EmployerFormData, type EmployerWaitlistData } from '@/schemas/waitlist';
import { logger } from '@/utils/logger';
import { toast } from '@/hooks/use-toast';

export type FormState = 'idle' | 'loading' | 'success' | 'error';

export interface UseWaitlistFormReturn {
  // State
  formData: EmployerFormData;
  state: FormState;
  errors: Partial<EmployerFormData>;
  
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
  const [errors, setErrors] = useState<Partial<EmployerFormData>>({});

  // Validate individual field
  const validateField = useCallback((field: keyof EmployerFormData, value: string) => {
    try {
      switch (field) {
        case 'name':
          employerWaitlistSchema.shape.name.parse(value);
          break;
        case 'email':
          employerWaitlistSchema.shape.email.parse(value);
          break;
        case 'industry':
          employerWaitlistSchema.shape.industry.parse(value);
          break;
        case 'company_size':
          employerWaitlistSchema.shape.company_size.parse(value);
          break;
        case 'early_career_hires_per_year':
          if (value) {
            const numValue = parseInt(value);
            employerWaitlistSchema.shape.early_career_hires_per_year.parse(numValue);
          }
          break;
      }
      return null;
    } catch (error: any) {
      return error.errors?.[0]?.message || 'Invalid input';
    }
  }, []);

  // Update field with debounced validation
  const updateField = useCallback((field: keyof EmployerFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
    
    // Validate after user stops typing (debounced via setTimeout)
    const timeoutId = setTimeout(() => {
      const error = validateField(field, value);
      if (error) {
        setErrors(prev => ({ ...prev, [field]: error }));
      }
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [errors, validateField]);

  // Validate entire form
  const validateForm = useCallback((): { isValid: boolean; validatedData?: EmployerWaitlistData } => {
    try {
      // Prepare data for validation
      const dataToValidate = {
        ...formData,
        early_career_hires_per_year: formData.early_career_hires_per_year 
          ? parseInt(formData.early_career_hires_per_year) 
          : undefined
      };

      const validatedData = employerWaitlistSchema.parse(dataToValidate);
      setErrors({});
      return { isValid: true, validatedData };
    } catch (error: any) {
      const fieldErrors: Partial<EmployerFormData> = {};
      
      error.errors?.forEach((err: any) => {
        const field = err.path[0] as keyof EmployerFormData;
        fieldErrors[field] = err.message;
      });
      
      setErrors(fieldErrors);
      return { isValid: false };
    }
  }, [formData]);

  // Submit form
  const submitForm = useCallback(async () => {
    if (state === 'loading') return;

    setState('loading');
    
    try {
      const validation = validateForm();
      
      if (!validation.isValid || !validation.validatedData) {
        setState('error');
        toast({
          title: 'Validation Error',
          description: 'Please fix the errors above and try again.',
          variant: 'destructive'
        });
        return;
      }

      logger.info('Submitting waitlist form', { email: validation.validatedData.email });
      
      await submitWaitlistEntry('employer', validation.validatedData);
      
      setState('success');
      logger.info('Waitlist submission successful');
      
      toast({
        title: 'Success!',
        description: 'You\'ve been added to our waitlist. We\'ll be in touch soon!',
      });
      
    } catch (error) {
      setState('error');
      logger.error('Waitlist submission failed', { error });
      
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      
      toast({
        title: 'Submission Failed',
        description: errorMessage,
        variant: 'destructive'
      });
    }
  }, [formData, state, validateForm]);

  // Reset form
  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setErrors({});
    setState('idle');
  }, []);

  // Computed values
  const isValid = useMemo(() => {
    const hasRequiredFields = formData.name && formData.email && formData.industry && formData.company_size;
    const hasNoErrors = Object.keys(errors).length === 0;
    return Boolean(hasRequiredFields && hasNoErrors);
  }, [formData, errors]);

  const isSubmitting = state === 'loading';

  return {
    formData,
    state,
    errors,
    updateField,
    submitForm,
    resetForm,
    isValid,
    isSubmitting
  };
};