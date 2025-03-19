/**
 * Server-side logging utility
 */

// Whether to enable debugging on the server
const DEBUG_MODE = process.env.NODE_ENV === 'development'

/**
 * Log a message to the console, but only in development mode
 */
export function serverLog(message: string, data?: unknown) {
  if (!DEBUG_MODE) return

  const timestamp = new Date().toISOString()
  if (data) {
    console.log(`[${timestamp}] 🔵 ${message}`, data)
  } else {
    console.log(`[${timestamp}] 🔵 ${message}`)
  }
}

/**
 * Log an error to the console, always shown
 */
export function serverError(message: string, error?: unknown) {
  const timestamp = new Date().toISOString()
  if (error) {
    console.error(`[${timestamp}] 🔴 ${message}`, error)
  } else {
    console.error(`[${timestamp}] 🔴 ${message}`)
  }
}

/**
 * Log a warning to the console
 */
export function serverWarn(message: string, data?: unknown) {
  const timestamp = new Date().toISOString()
  if (data) {
    console.warn(`[${timestamp}] 🟠 ${message}`, data)
  } else {
    console.warn(`[${timestamp}] 🟠 ${message}`)
  }
}
