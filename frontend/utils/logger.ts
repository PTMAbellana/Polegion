/**
 * Production-safe logging utility
 * 
 * Use this instead of console.log to ensure logs don't appear in production.
 * Error logs are always shown since they're critical for debugging issues.
 * 
 * @example
 * import { logger } from '@/utils/logger';
 * 
 * logger.log('Debug info'); // Only in development
 * logger.error('Critical error'); // Always shown
 * logger.warn('Warning message'); // Only in development
 */

const isDevelopment = process.env.NODE_ENV === 'development';

export const logger = {
  /**
   * Log general information (development only)
   */
  log: (...args: any[]) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },

  /**
   * Log errors (always shown - critical for production debugging)
   */
  error: (...args: any[]) => {
    console.error(...args);
  },

  /**
   * Log warnings (development only)
   */
  warn: (...args: any[]) => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },

  /**
   * Log debug information (development only)
   */
  debug: (...args: any[]) => {
    if (isDevelopment) {
      console.debug(...args);
    }
  },

  /**
   * Log informational messages (development only)
   */
  info: (...args: any[]) => {
    if (isDevelopment) {
      console.info(...args);
    }
  },
};

// Default export for convenience
export default logger;
