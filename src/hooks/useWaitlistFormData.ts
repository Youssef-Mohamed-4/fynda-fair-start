import { useState, useCallback, useEffect } from 'react';
import { EmployerFormData } from '@/schemas/waitlist';

const initialFormData: EmployerFormData = {
  name: '',
  email: '',
  industry: '',
  company_size: '',
  early_career_hires_per_year: ''
};

const STORAGE_KEY = 'fynda-waitlist-form-data';

export const useWaitlistFormData = () => {
  const [formData, setFormData] = useState<EmployerFormData>(() => {
    // Try to restore form data from localStorage
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...initialFormData, ...JSON.parse(saved) };
      }
    } catch (error) {
      console.warn('Failed to restore form data from localStorage:', error);
    }
    return initialFormData;
  });

  // Persist form data to localStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    } catch (error) {
      console.warn('Failed to save form data to localStorage:', error);
    }
  }, [formData]);

  const updateField = useCallback((field: keyof EmployerFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.warn('Failed to clear form data from localStorage:', error);
    }
  }, []);

  return {
    formData,
    updateField,
    resetForm,
  };
};