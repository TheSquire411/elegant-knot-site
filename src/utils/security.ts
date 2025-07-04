// Security utilities for input validation and sanitization
import DOMPurify from 'dompurify';

/**
 * Comprehensive sanitization using DOMPurify
 */
export function sanitizeInput(input: string): string {
  if (!input) return '';
  
  // Use DOMPurify for comprehensive XSS protection
  return DOMPurify.sanitize(input, { 
    ALLOWED_TAGS: [], // Strip all HTML tags
    ALLOWED_ATTR: [] // Strip all attributes
  }).trim();
}

/**
 * Sanitize HTML content while allowing safe tags
 */
export function sanitizeHtml(html: string): string {
  if (!html) return '';

  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: []
  });
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
 * Validates URLs to ensure they're safe and properly formatted
 */
export function validateUrl(url: string): { isValid: boolean; error?: string } {
  if (!url) {
    return { isValid: false, error: 'URL is required' };
  }

  try {
    const urlObj = new URL(url);
    
    // Only allow HTTP and HTTPS protocols
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return { isValid: false, error: 'Only HTTP and HTTPS URLs are allowed' };
    }

    // Block localhost and private IPs in production
    const hostname = urlObj.hostname.toLowerCase();
    if (hostname === 'localhost' || 
        hostname.startsWith('127.') || 
        hostname.startsWith('192.168.') ||
        hostname.startsWith('10.') ||
        hostname.match(/^172\.(1[6-9]|2[0-9]|3[0-1])\./)) {
      return { isValid: false, error: 'Private network URLs are not allowed' };
    }

    return { isValid: true };
  } catch {
    return { isValid: false, error: 'Invalid URL format' };
  }
}

/**
 * Get Content Security Policy headers based on environment
 */
export function getCSPHeaders(isDevelopment: boolean = import.meta.env?.DEV ?? false) {
  const scriptSrc = isDevelopment 
    ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'" // Only allow unsafe directives in development
    : "script-src 'self'";
  
  const styleSrc = isDevelopment
    ? "style-src 'self' 'unsafe-inline'"
    : "style-src 'self'";

  return {
    'Content-Security-Policy': [
      "default-src 'self'",
      scriptSrc,
      styleSrc,
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "connect-src 'self' https://rpcnysgxybcffnprttar.supabase.co wss://rpcnysgxybcffnprttar.supabase.co https://api.deepseek.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "object-src 'none'",
      ...(isDevelopment ? [] : ["upgrade-insecure-requests"]) // Only enforce HTTPS upgrade in production
    ].join('; '),
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin'
  };
}

/**
 * Enhanced Content Security Policy headers (legacy export for backwards compatibility)
 * @deprecated Use getCSPHeaders() instead for environment-aware headers
 */
export const CSP_HEADERS = getCSPHeaders();