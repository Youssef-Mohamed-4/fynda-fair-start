import { useCallback } from 'react';
import { useWaitlistFormData } from './useWaitlistFormData';
import { useWaitlistValidation } from './useWaitlistValidation';
import { useFormTimeouts } from './useFormTimeouts';
import { useWaitlistSubmission } from './useWaitlistSubmission';
import { EmployerFormData } from '@/schemas/waitlist';

export interface UseWaitlistFormReturn {
  // State
  formData: EmployerFormData;
  errors: Partial<Record<keyof EmployerFormData, string>>;
  
  // Actions
  updateField: (field: keyof EmployerFormData, value: string) => void;
  submitForm: () => Promise<void>;
  resetForm: () => void;
  
  // Computed
  isValid: boolean;
  isSubmitting: boolean;
  state: 'idle' | 'loading' | 'success' | 'error';
}

export const useWaitlistForm = (): UseWaitlistFormReturn => {
  const { formData, updateField: updateFormField, resetForm: resetFormData } = useWaitlistFormData();
  const { errors, validateField, setFieldError, clearFieldError, validateForm, isValid } = useWaitlistValidation(formData);
  const { setFieldTimeout, clearFieldTimeout, clearAllTimeouts } = useFormTimeouts();
  const { submitForm: submitToApi, isSubmitting, state } = useWaitlistSubmission();

  // Enhanced update field with debounced validation
  const updateField = useCallback((field: keyof EmployerFormData, value: string) => {
    // Update form data immediately for responsive UI
    updateFormField(field, value);
    
    // Clear existing error when user starts typing
    clearFieldError(field);
    
    // Clear existing timeout for this field
    clearFieldTimeout(field);
    
    // Set up debounced validation only for non-empty values
    if (value.trim()) {
      setFieldTimeout(field, () => {
        const error = validateField(field, value);
        if (error) {
          setFieldError(field, error);
        }
      });
    }
  }, [updateFormField, clearFieldError, clearFieldTimeout, setFieldTimeout, validateField, setFieldError]);

  // Submit form with validation
  const submitForm = useCallback(async () => {
    console.log('🚀 Submit form called', { isSubmitting });
    
    if (isSubmitting) {
      console.log('❌ Already submitting, aborting');
      return;
    }

    try {
      // Clear any existing timeouts
      clearAllTimeouts();
      
      // Validate form
      const validation = validateForm();
      console.log('📝 Form validation result:', validation);
      
      if (!validation.isValid && validation.errors) {
        console.log('❌ Form validation failed:', validation.errors);
        // Set all validation errors
        Object.entries(validation.errors).forEach(([field, error]) => {
          setFieldError(field as keyof EmployerFormData, error);
        });
      }
      
      // Submit to API regardless of client validation (let server validate)
      console.log('🌐 Submitting to API...');
      await submitToApi(validation);
      
    } catch (error) {
      console.error('❌ Form submission error:', error);
    }
  }, [isSubmitting, clearAllTimeouts, validateForm, setFieldError, submitToApi]);

  // Reset form to initial state
  const resetForm = useCallback(() => {
    clearAllTimeouts();
    resetFormData();
    // Note: errors are automatically cleared when formData resets due to validation hook dependency
  }, [clearAllTimeouts, resetFormData]);

  return {
    formData,
    errors,
    updateField,
    submitForm,
    resetForm,
    isValid,
    isSubmitting,
    state,
  };
};