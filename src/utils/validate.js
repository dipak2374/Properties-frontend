/**
 * Shared form validation utilities for PropertyHub.
 * Each function returns a string error message, or '' if valid.
 */

/** Validates an email address format. */
export const validateEmail = (value) => {
  if (!value || !value.trim()) return 'Email address is required.';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value.trim())) return 'Please enter a valid email address.';
  return '';
};

/**
 * Validates a login password (simple — just non-empty and min 6 chars).
 * For registration use validateStrongPassword instead.
 */
export const validatePassword = (value) => {
  if (!value) return 'Password is required.';
  if (value.length < 8) return 'Password must be at least 8 characters.';
  return '';
};

/**
 * Validates a registration password for strength.
 * Requires: ≥ 8 chars, 1 uppercase letter, 1 number.
 */
export const validateStrongPassword = (value) => {
  if (!value) return 'Password is required.';
  if (value.length < 8) return 'Password must be at least 8 characters.';
  if (!/[A-Z]/.test(value)) return 'Password must contain at least one uppercase letter.';
  if (!/[0-9]/.test(value)) return 'Password must contain at least one number.';
  return '';
};

/**
 * Returns a strength score 0–4 and label for a password.
 * Used to render a visual password strength bar.
 */
export const getPasswordStrength = (value) => {
  if (!value) return { score: 0, label: '', color: '' };
  let score = 0;
  if (value.length >= 8) score += 1;
  if (value.length >= 12) score += 1;
  if (/[A-Z]/.test(value)) score += 1;
  if (/[0-9]/.test(value)) score += 1;
  if (/[^A-Za-z0-9]/.test(value)) score += 1;

  const levels = [
    { label: 'Very weak', color: '#ef4444' },
    { label: 'Weak', color: '#f97316' },
    { label: 'Fair', color: '#eab308' },
    { label: 'Good', color: '#22c55e' },
    { label: 'Strong', color: '#16a34a' },
  ];

  return { score, ...levels[Math.min(score, levels.length - 1)] };
};

/** Validates that passwords match. */
export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) return 'Please confirm your password.';
  if (password !== confirmPassword) return 'Passwords do not match.';
  return '';
};

/** Validates a full name (min 2 chars, no numbers). */
export const validateName = (value) => {
  if (!value || !value.trim()) return 'Full name is required.';
  if (value.trim().length < 2) return 'Name must be at least 2 characters.';
  if (/\d/.test(value)) return 'Name must not contain numbers.';
  return '';
};

/** Validates a phone number (international or local formats). */
export const validatePhone = (value) => {
  if (!value || !value.trim()) return 'Phone number is required.';
  if (!/^\d+$/.test(value.trim())) return 'Phone number must contain digits only.';
  if (value.trim().length !== 10) return 'Phone number must be exactly 10 digits.';
  return '';
};

/** Validates a message body with optional min/max character lengths. */
export const validateMessage = (value, { min = 10, max = 1000 } = {}) => {
  if (!value || !value.trim()) return 'Message is required.';
  if (value.trim().length < min) return `Message must be at least ${min} characters.`;
  if (value.trim().length > max) return `Message must be at most ${max} characters.`;
  return '';
};

/** Validates that a date is today or in the future. */
export const validateFutureDate = (value) => {
  if (!value) return 'Please select a date.';
  const selected = new Date(value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (selected < today) return 'Please select today or a future date.';
  return '';
};

/**
 * Runs a map of field validators and returns a map of field → error string.
 * @param {Record<string, () => string>} validators — object of field name → validator fn
 * @returns {Record<string, string>} errors object
 */
export const runValidators = (validators) => {
  const errors = {};
  let hasError = false;

  for (const [field, fn] of Object.entries(validators)) {
    const error = fn();
    errors[field] = error;
    if (error) hasError = true;
  }

  return { errors, hasError };
};
