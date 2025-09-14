import { z } from 'zod';

// Base validation schemas with security measures
export const nameSchema = z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .max(100, 'Name must be less than 100 characters')
  .regex(/^[a-zA-Z\s\-'\.]+$/, 'Name can only contain letters, spaces, hyphens, apostrophes, and periods')
  .trim()
  .transform(val => val.replace(/\s+/g, ' ')); // Normalize whitespace

export const emailSchema = z
  .string()
  .email('Please enter a valid email address')
  .max(254, 'Email address is too long')
  .toLowerCase()
  .trim();

// Industry options - validated enum for security
export const industryOptions = [
  'Technology',
  'Healthcare', 
  'Finance',
  'Education',
  'Manufacturing',
  'Retail',
  'Consulting',
  'Media',
  'Non-profit',
  'Government',
  'Other'
] as const;

export const industrySchema = z.enum(industryOptions, {
  errorMap: () => ({ message: 'Please select a valid industry' })
});

// Company size options - validated enum for security
export const companySizeOptions = [
  '1-10',
  '11-50',
  '51-200', 
  '201-500',
  '501-1000',
  '1000+'
] as const;

export const companySizeSchema = z.enum(companySizeOptions, {
  errorMap: () => ({ message: 'Please select a valid company size' })
});

// Main waitlist schema with comprehensive validation
export const employerWaitlistSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  industry: industrySchema,
  company_size: companySizeSchema,
  early_career_hires_per_year: z
    .number()
    .int('Must be a whole number')
    .min(0, 'Cannot be negative')
    .max(10000, 'Please enter a reasonable number')
    .optional()
});

// Inferred types for type safety
export type EmployerWaitlistData = z.infer<typeof employerWaitlistSchema>;

// Form data type (string inputs before validation)
export type EmployerFormData = {
  name: string;
  email: string;
  industry: string;
  company_size: string;
  early_career_hires_per_year: string;
};

// Validation result type
export type ValidationResult = {
  isValid: boolean;
  data?: EmployerWaitlistData;
  errors?: Partial<Record<keyof EmployerFormData, string>>;
};