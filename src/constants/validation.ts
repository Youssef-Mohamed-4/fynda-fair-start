// Validation constants and error messages
export const VALIDATION_CONSTANTS = {
  DEBOUNCE_DELAY: 300,
  MAX_RETRY_ATTEMPTS: 3,
  RETRY_DELAY_BASE: 1000,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 100,
  EMAIL_MAX_LENGTH: 254,
  HIRES_MAX_VALUE: 10000,
} as const;

export const ERROR_MESSAGES = {
  // Field validation errors
  NAME_TOO_SHORT: 'Name must be at least 2 characters',
  NAME_TOO_LONG: 'Name must be less than 100 characters', 
  NAME_INVALID_CHARS: 'Name can only contain letters, spaces, hyphens, apostrophes, and periods',
  EMAIL_INVALID: 'Please enter a valid email address',
  EMAIL_TOO_LONG: 'Email address is too long',
  INDUSTRY_REQUIRED: 'Please select a valid industry',
  COMPANY_SIZE_REQUIRED: 'Please select a valid company size',
  HIRES_INVALID_NUMBER: 'Must be a valid number',
  HIRES_NEGATIVE: 'Cannot be negative',
  HIRES_TOO_LARGE: 'Please enter a reasonable number',
  
  // Form validation errors
  REQUIRED_FIELDS: 'Please fill in all required fields to continue',
  VALIDATION_ERROR: 'Please fix the errors above and try again.',
  
  // API errors
  EMAIL_EXISTS: 'This email is already registered in our waitlist!',
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  PERMISSION_DENIED: 'Permission denied. Please try again.',
  INVALID_DATA: 'Invalid data provided. Please check your entries.',
  SUBMISSION_FAILED: 'Failed to submit waitlist entry. Please try again.',
  NO_DATA_RETURNED: 'No data returned from submission. Please try again.',
  UNEXPECTED_ERROR: 'An unexpected error occurred. Please try again.',
  
  // Success messages  
  SUBMISSION_SUCCESS: 'You\'ve been added to our waitlist. We\'ll be in touch soon!',
} as const;

export const SUPABASE_ERROR_CODES = {
  UNIQUE_VIOLATION: '23505',
  CHECK_VIOLATION: '23514', 
  PERMISSION_DENIED: '42501',
} as const;