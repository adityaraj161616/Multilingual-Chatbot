/**
 * Environment Variable Validation
 * Ensures all required environment variables are present
 */

export interface EnvValidationResult {
  isValid: boolean
  missing: string[]
  warnings: string[]
}

const REQUIRED_ENV_VARS = ["MONGODB_URI", "JWT_SECRET"] as const

const OPTIONAL_ENV_VARS = ["GEMINI_API_KEY"] as const

export function validateEnv(): EnvValidationResult {
  const missing: string[] = []
  const warnings: string[] = []

  // Check required variables
  for (const envVar of REQUIRED_ENV_VARS) {
    if (!process.env[envVar]) {
      missing.push(envVar)
    }
  }

  // Check optional but recommended variables
  for (const envVar of OPTIONAL_ENV_VARS) {
    if (!process.env[envVar]) {
      warnings.push(`${envVar} is not set. Some features may not work correctly.`)
    }
  }

  return {
    isValid: missing.length === 0,
    missing,
    warnings,
  }
}

export function getRequiredEnv(key: string): string {
  const value = process.env[key]
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
  return value
}

export function getOptionalEnv(key: string, defaultValue = ""): string {
  return process.env[key] || defaultValue
}
