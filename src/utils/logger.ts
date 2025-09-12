/**
 * Secure Logging Utility
 * 
 * This module provides secure logging that automatically filters sensitive data
 * and only logs in development mode unless explicitly configured otherwise.
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  data?: any;
  timestamp: string;
  context?: string;
}

// Sensitive data patterns to filter out
const SENSITIVE_PATTERNS = [
  /password/i,
  /token/i,
  /jwt/i,
  /secret/i,
  /key/i,
  /auth/i,
  /session/i
];

/**
 * Check if data contains sensitive information
 */
const containsSensitiveData = (data: any): boolean => {
  if (typeof data === 'string') {
    return SENSITIVE_PATTERNS.some(pattern => pattern.test(data));
  }
  
  if (typeof data === 'object' && data !== null) {
    return Object.keys(data).some(key => 
      SENSITIVE_PATTERNS.some(pattern => pattern.test(key))
    );
  }
  
  return false;
};

/**
 * Sanitize data by removing sensitive information
 */
const sanitizeData = (data: any): any => {
  if (typeof data === 'string') {
    return containsSensitiveData(data) ? '[REDACTED]' : data;
  }
  
  if (Array.isArray(data)) {
    return data.map(sanitizeData);
  }
  
  if (typeof data === 'object' && data !== null) {
    const sanitized: any = {};
    Object.entries(data).forEach(([key, value]) => {
      if (SENSITIVE_PATTERNS.some(pattern => pattern.test(key))) {
        sanitized[key] = '[REDACTED]';
      } else {
        sanitized[key] = sanitizeData(value);
      }
    });
    return sanitized;
  }
  
  return data;
};

/**
 * Secure logger that filters sensitive data
 */
class SecureLogger {
  private isDevelopment = import.meta.env.DEV;
  private isDebugEnabled = import.meta.env.VITE_DEBUG_LOGS === 'true';

  private log(level: LogLevel, message: string, data?: any, context?: string) {
    // Only log in development or if debug is explicitly enabled
    if (!this.isDevelopment && !this.isDebugEnabled) {
      return;
    }

    const logEntry: LogEntry = {
      level,
      message,
      data: data ? sanitizeData(data) : undefined,
      timestamp: new Date().toISOString(),
      context
    };

    const logMessage = context ? `[${context}] ${message}` : message;
    
    switch (level) {
      case 'debug':
        console.debug(logMessage, logEntry.data);
        break;
      case 'info':
        console.info(logMessage, logEntry.data);
        break;
      case 'warn':
        console.warn(logMessage, logEntry.data);
        break;
      case 'error':
        console.error(logMessage, logEntry.data);
        break;
    }
  }

  debug(message: string, data?: any, context?: string) {
    this.log('debug', message, data, context);
  }

  info(message: string, data?: any, context?: string) {
    this.log('info', message, data, context);
  }

  warn(message: string, data?: any, context?: string) {
    this.log('warn', message, data, context);
  }

  error(message: string, data?: any, context?: string) {
    this.log('error', message, data, context);
  }

  // Security event logging (always enabled for security monitoring)
  security(event: string, details?: Record<string, unknown>) {
    const logEntry = {
      event,
      details: details ? sanitizeData(details) : undefined,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };
    
    // Security events should always be logged
    console.info(`🔐 Security Event: ${event}`, logEntry);
  }
}

export const logger = new SecureLogger();

// Convenience exports
export const logAuth = (message: string, data?: any) => 
  logger.info(message, data, 'AUTH');

export const logAdmin = (message: string, data?: any) => 
  logger.info(message, data, 'ADMIN');

export const logSecurity = (event: string, details?: Record<string, unknown>) => 
  logger.security(event, details);