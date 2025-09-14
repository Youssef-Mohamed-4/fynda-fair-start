import { supabase } from '@/integrations/supabase/client';
import { employerWaitlistSchema, type EmployerWaitlistData } from '@/schemas/waitlist';
import { logger } from '@/utils/logger';
import { ERROR_MESSAGES, SUPABASE_ERROR_CODES } from '@/constants/validation';

export interface WaitlistSubmissionResult {
  success: boolean;
  data?: any;
  error?: string;
}

export class WaitlistApiService {
  /**
   * Submit employer waitlist entry with comprehensive error handling
   */
  static async submitEmployerEntry(data: EmployerWaitlistData): Promise<WaitlistSubmissionResult> {
    try {
      // Double validation with Zod schema for security
      const validatedData = employerWaitlistSchema.parse(data);
      
      logger.info('Submitting to employers waitlist', { 
        email: validatedData.email,
        industry: validatedData.industry,
        company_size: validatedData.company_size
      });

      // Use Supabase Edge Function for CSP-safe submission
      console.log('🔌 Submitting via Edge Function...');
      const { data: result, error } = await supabase.functions.invoke('join-waitlist', {
        body: validatedData
      });

      if (error) {
        console.error('❌ Edge Function error:', error);
        logger.error('Edge Function waitlist submission error', { 
          message: error.message,
          details: error 
        });
        
        return { success: false, error: error.message || ERROR_MESSAGES.SUBMISSION_FAILED };
      }

      if (!result?.success) {
        return { success: false, error: result?.error || ERROR_MESSAGES.SUBMISSION_FAILED };
      }

      logger.info('Waitlist entry submitted successfully via Edge Function', { 
        success: result.success,
        message: result.message
      });
      
      return { success: true, data: result.data };
    } catch (error) {
      // Enhanced error logging with context
      if (error instanceof Error) {
        if (!error.message.includes('email is already registered')) {
          logger.error('Waitlist submission error', { 
            error: error.message,
            stack: error.stack,
            data: { ...data, email: '[REDACTED]' } // Don't log sensitive email in errors
          });
        }
      } else {
        logger.error('Unknown waitlist submission error', { error });
      }
      
      return { success: false, error: ERROR_MESSAGES.UNEXPECTED_ERROR };
    }
  }

  /**
   * Fetch all employer waitlist entries (admin function)
   */
  static async fetchEmployerEntries() {
    try {
      const { data, error } = await supabase
        .from('employers_waitlist')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        logger.error('Failed to fetch employer entries', { error });
        throw error;
      }

      return data || [];
    } catch (error) {
      logger.error('Employer entries fetch error', { error });
      throw error;
    }
  }

  /**
   * Delete employer waitlist entry (admin function)
   */
  static async deleteEmployerEntry(id: string) {
    try {
      const { error } = await supabase
        .from('employers_waitlist')
        .delete()
        .eq('id', id);

      if (error) {
        logger.error('Failed to delete employer entry', { error, id });
        throw error;
      }

      logger.info('Employer entry deleted successfully', { id });
    } catch (error) {
      logger.error('Employer entry deletion error', { error, id });
      throw error;
    }
  }

  /**
   * Map database error codes to user-friendly messages
   */
  private static mapDatabaseError(errorCode?: string): string {
    switch (errorCode) {
      case SUPABASE_ERROR_CODES.UNIQUE_VIOLATION:
        return ERROR_MESSAGES.EMAIL_EXISTS;
      case SUPABASE_ERROR_CODES.CHECK_VIOLATION:
        return ERROR_MESSAGES.INVALID_DATA;
      case SUPABASE_ERROR_CODES.PERMISSION_DENIED:
        return ERROR_MESSAGES.PERMISSION_DENIED;
      default:
        return ERROR_MESSAGES.SUBMISSION_FAILED;
    }
  }
}