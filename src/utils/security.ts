// Security utilities for input validation and sanitization

/**
 * Sanitizes string input to prevent XSS attacks
 */
export function sanitizeInput(input: string): string {
  if (!input) return '';
  
  return input
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocols
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .trim();
}

/**
 * Validates input length with configurable limits
 */
export function validateInputLength(
  input: string, 
  maxLength: number = 255, 
  minLength: number = 0
): { isValid: boolean; error?: string } {
  if (!input && minLength > 0) {
    return { isValid: false, error: 'Input is required' };
  }
  
  if (input.length < minLength) {
    return { isValid: false, error: `Input must be at least ${minLength} characters` };
  }
  
  if (input.length > maxLength) {
    return { isValid: false, error: `Input must not exceed ${maxLength} characters` };
  }
  
  return { isValid: true };
}

/**
 * Validates email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Checks if user has specific role safely
 */
export function hasRole(profile: any, role: string): boolean {
  return profile?.role === role;
}

/**
 * Rate limiting helper (client-side tracking)
 */
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(
  key: string, 
  maxRequests: number = 10, 
  windowMs: number = 60000
): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(key);
  
  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (record.count >= maxRequests) {
    return false;
  }
  
  record.count++;
  return true;
}

/**
 * Content Security Policy helpers
 */
export const CSP_HEADERS = {
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Needed for Vite dev
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self' https://rpcnysgxybcffnprttar.supabase.co wss://rpcnysgxybcffnprttar.supabase.co",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "object-src 'none'"
  ].join('; ')
};