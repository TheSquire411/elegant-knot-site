/**
 * Generate a UUID-like string that's compatible with all environments
 * Uses a combination of timestamp and random values for uniqueness
 */
export function generateId(): string {
  // Use crypto.randomUUID if available (modern browsers and Node.js)
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    try {
      return crypto.randomUUID();
    } catch {
      // Fallback if crypto.randomUUID fails
    }
  }
  
  // Fallback UUID generation
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Generate a shorter, build-safe ID for cases where full UUID isn't needed
 */
export function generateShortId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}