/**
 * Validation utility functions for WhenAvailable forms
 */

/**
 * Validate email address format
 */
export function isValidEmail(email: string): boolean {
  if (!email || email.trim().length === 0) {
    return false;
  }

  // RFC 5322 compliant email regex (simplified)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Validate name (optional, but if provided must be reasonable)
 */
export function isValidName(name: string): boolean {
  if (!name || name.trim().length === 0) {
    return true; // Name is optional
  }

  // Name should be 1-100 characters
  const trimmed = name.trim();
  return trimmed.length >= 1 && trimmed.length <= 100;
}

/**
 * Validate meeting purpose (optional, but if provided must be reasonable)
 */
export function isValidPurpose(purpose: string): boolean {
  if (!purpose || purpose.trim().length === 0) {
    return true; // Purpose is optional
  }

  // Purpose should be 1-200 characters
  const trimmed = purpose.trim();
  return trimmed.length >= 1 && trimmed.length <= 200;
}

/**
 * Get validation error message for email
 */
export function getEmailError(email: string): string | null {
  if (!email || email.trim().length === 0) {
    return 'Email is required';
  }

  if (!isValidEmail(email)) {
    return 'Please enter a valid email address';
  }

  return null;
}

/**
 * Get validation error message for name
 */
export function getNameError(name: string): string | null {
  if (!name || name.trim().length === 0) {
    return null; // Name is optional
  }

  if (name.trim().length > 100) {
    return 'Name must be 100 characters or less';
  }

  return null;
}

/**
 * Get validation error message for purpose
 */
export function getPurposeError(purpose: string): string | null {
  if (!purpose || purpose.trim().length === 0) {
    return null; // Purpose is optional
  }

  if (purpose.trim().length > 200) {
    return 'Purpose must be 200 characters or less';
  }

  return null;
}
