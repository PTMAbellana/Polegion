/**
 * Number formatting utilities to prevent NaN display
 */

/**
 * Safely formats a number, returns 0 if NaN/undefined/null
 */
export const safeNumber = (value: any, defaultValue: number = 0): number => {
  const num = Number(value)
  return isNaN(num) || !isFinite(num) ? defaultValue : num
}

/**
 * Safely rounds a number, returns default if NaN
 */
export const safeRound = (value: any, defaultValue: number = 0): number => {
  const num = Number(value)
  return isNaN(num) || !isFinite(num) ? defaultValue : Math.round(num)
}

/**
 * Safely calculates average, returns 0 if array is empty or calculation fails
 */
export const safeAverage = (values: number[], defaultValue: number = 0): number => {
  if (!Array.isArray(values) || values.length === 0) return defaultValue
  
  const sum = values.reduce((acc, val) => acc + safeNumber(val, 0), 0)
  const result = sum / values.length
  
  return isNaN(result) || !isFinite(result) ? defaultValue : Math.round(result)
}

/**
 * Safely gets max value, returns default if array is empty or calculation fails
 */
export const safeMax = (values: number[], defaultValue: number = 0): number => {
  if (!Array.isArray(values) || values.length === 0) return defaultValue
  
  const result = Math.max(...values.map(v => safeNumber(v, 0)))
  
  return isNaN(result) || !isFinite(result) ? defaultValue : result
}

/**
 * Safely formats a percentage, returns "N/A" if invalid
 */
export const safePercentage = (value: any): string => {
  const num = Number(value)
  if (isNaN(num) || !isFinite(num) || value === null || value === undefined) {
    return 'N/A'
  }
  return `${Math.round(num)}%`
}

/**
 * Safely formats XP display
 */
export const safeXP = (value: any): number => {
  return safeNumber(value, 0)
}
