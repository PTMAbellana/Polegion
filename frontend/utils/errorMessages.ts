/**
 * Error Message Sanitizer
 * Converts technical error messages into user-friendly messages
 */

/**
 * Sanitizes error messages to be user-friendly
 * Removes technical jargon like RLS errors, database errors, etc.
 */
export const sanitizeErrorMessage = (error: any): string => {
  // Get the error message string
  let message = ''
  
  if (typeof error === 'string') {
    message = error
  } else if (error?.message) {
    message = error.message
  } else if (error?.error) {
    message = error.error
  } else if (error?.data?.message) {
    message = error.data.message
  } else {
    message = 'An unexpected error occurred'
  }

  // Convert to lowercase for pattern matching
  const lowerMessage = message.toLowerCase()

  // Row Level Security (RLS) errors
  if (lowerMessage.includes('row level security') || 
      lowerMessage.includes('rls') || 
      lowerMessage.includes('policy')) {
    return 'You do not have permission to perform this action'
  }

  // Permission/Authorization errors
  if (lowerMessage.includes('permission denied') || 
      lowerMessage.includes('unauthorized') || 
      lowerMessage.includes('forbidden') ||
      lowerMessage.includes('access denied')) {
    return 'You do not have permission to access this resource'
  }

  // Database/Query errors
  if (lowerMessage.includes('duplicate key') || 
      lowerMessage.includes('unique constraint')) {
    return 'This item already exists'
  }

  if (lowerMessage.includes('foreign key') || 
      lowerMessage.includes('violates')) {
    return 'Unable to complete action due to related data'
  }

  if (lowerMessage.includes('syntax error') || 
      lowerMessage.includes('query') ||
      lowerMessage.includes('relation') ||
      lowerMessage.includes('column')) {
    return 'A technical error occurred. Please try again'
  }

  // Network errors
  if (lowerMessage.includes('network') || 
      lowerMessage.includes('fetch failed') ||
      lowerMessage.includes('timeout') ||
      lowerMessage.includes('econnrefused')) {
    return 'Network error. Please check your connection and try again'
  }

  // Authentication errors
  if (lowerMessage.includes('jwt') || 
      lowerMessage.includes('token') ||
      lowerMessage.includes('expired')) {
    return 'Your session has expired. Please log in again'
  }

  if (lowerMessage.includes('invalid credentials') || 
      lowerMessage.includes('authentication failed') ||
      lowerMessage.includes('login failed')) {
    return 'Invalid username or password'
  }

  // File upload errors
  if (lowerMessage.includes('file too large') || 
      lowerMessage.includes('size limit')) {
    return 'File is too large. Please upload a smaller file'
  }

  if (lowerMessage.includes('invalid file type') || 
      lowerMessage.includes('unsupported format')) {
    return 'Invalid file type. Please upload a supported file format'
  }

  // Validation errors
  if (lowerMessage.includes('validation') || 
      lowerMessage.includes('invalid input')) {
    return 'Please check your input and try again'
  }

  // Server errors (500)
  if (lowerMessage.includes('internal server error') || 
      lowerMessage.includes('500')) {
    return 'Something went wrong on our end. Please try again later'
  }

  // Not found errors (404)
  if (lowerMessage.includes('not found') || 
      lowerMessage.includes('404')) {
    return 'The requested item was not found'
  }

  // If message is already user-friendly (short and clear), return it
  if (message.length < 100 && !message.includes('Error:') && !message.includes('Exception')) {
    return message
  }

  // Default fallback
  return 'An error occurred. Please try again'
}

/**
 * Sanitizes success messages
 */
export const sanitizeSuccessMessage = (message: string): string => {
  if (!message) return 'Operation completed successfully'
  return message
}
