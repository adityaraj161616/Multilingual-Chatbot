/**
 * Logging utility with environment-aware behavior
 * Disables debug logs in production
 */

const IS_DEV = process.env.NODE_ENV === "development"
const IS_DEBUG = process.env.DEBUG === "true" || IS_DEV

export const logger = {
  debug: (message: string, ...args: any[]) => {
    if (IS_DEBUG) {
      console.log(`[DEBUG] ${message}`, ...args)
    }
  },

  info: (message: string, ...args: any[]) => {
    console.log(`[INFO] ${message}`, ...args)
  },

  warn: (message: string, ...args: any[]) => {
    console.warn(`[WARN] ${message}`, ...args)
  },

  error: (message: string, error?: any) => {
    console.error(`[ERROR] ${message}`, error)
  },
}
