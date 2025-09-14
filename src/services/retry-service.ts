import { VALIDATION_CONSTANTS } from '@/constants/validation';
import { logger } from '@/utils/logger';

export interface RetryConfig {
  maxAttempts?: number;
  baseDelay?: number;
  shouldRetry?: (error: any) => boolean;
}

export class RetryService {
  /**
   * Execute a function with exponential backoff retry logic
   */
  static async withRetry<T>(
    fn: () => Promise<T>,
    config: RetryConfig = {}
  ): Promise<T> {
    const {
      maxAttempts = VALIDATION_CONSTANTS.MAX_RETRY_ATTEMPTS,
      baseDelay = VALIDATION_CONSTANTS.RETRY_DELAY_BASE,
      shouldRetry = (error) => this.isRetryableError(error)
    } = config;

    let lastError: any;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;
        
        // Don't retry on the last attempt or if error is not retryable
        if (attempt === maxAttempts || !shouldRetry(error)) {
          break;
        }

        const delay = baseDelay * Math.pow(2, attempt - 1);
        logger.warn(`Attempt ${attempt} failed, retrying in ${delay}ms`, { error });
        
        await this.delay(delay);
      }
    }

    logger.error('All retry attempts failed', { lastError, maxAttempts });
    throw lastError;
  }

  /**
   * Determine if an error is retryable
   */
  private static isRetryableError(error: any): boolean {
    // Network errors are retryable
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      return true;
    }

    // Timeout errors are retryable
    if (error.name === 'AbortError' || error.message?.includes('timeout')) {
      return true;
    }

    // Server errors (5xx) are retryable
    if (error.status >= 500 && error.status < 600) {
      return true;
    }

    // Don't retry client errors (4xx) or validation errors
    return false;
  }

  /**
   * Promise-based delay utility
   */
  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}