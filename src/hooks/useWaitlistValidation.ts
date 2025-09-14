import { useState, useCallback, useMemo } from 'react';
import { 
  employerWaitlistSchema, 
  type EmployerFormData, 
  type EmployerWaitlistData,
  type ValidationResult 
} from '@/schemas/waitlist';
import { ERROR_MESSAGES } from '@/constants/validation';

export const useWaitlistValidation = (formData: EmployerFormData) => {
  const [errors, setErrors] = useState<Partial<Record<keyof EmployerFormData, string>>>({});

  // Validate individual field
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
            if (isNaN(numValue)) throw new Error(ERROR_MESSAGES.HIRES_INVALID_NUMBER);
            employerWaitlistSchema.shape.early_career_hires_per_year.parse(numValue);
          }
          break;
      }
      return null;
    } catch (error: any) {
      return error.errors?.[0]?.message || error.message || 'Invalid input';
    }
  }, []);

  // Set field error
  const setFieldError = useCallback((field: keyof EmployerFormData, error: string | null) => {
    setErrors(prev => {
      if (error) {
        return { ...prev, [field]: error };
      } else {
        const { [field]: _, ...rest } = prev;
        return rest;
      }
    });
  }, []);

  // Clear field error
  const clearFieldError = useCallback((field: keyof EmployerFormData) => {
    setErrors(prev => {
      const { [field]: _, ...rest } = prev;
      return rest;
    });
  }, []);

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

  // Computed validation state
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

  return {
    errors,
    validateField,
    setFieldError,
    clearFieldError,
    validateForm,
    isValid,
  };
};