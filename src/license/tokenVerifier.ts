import { safeStorage } from '../engine/LocalStorageStore';

export interface LicensePayload {
  email: string;
  plan: 'monthly' | 'annual';
  iat: number;
  exp: number;
}

export interface LicenseVerificationResult {
  valid: boolean;
  reason?: string;
  payload?: LicensePayload;
}

export const LICENSE_STORAGE_KEY = 'gf_license_token';

/**
 * Decodes a base64url encoded string safely across browser and Node.
 */
function decodeBase64(str: string): string {
  try {
    if (typeof atob === 'function') {
      return atob(str.replace(/-/g, '+').replace(/_/g, '/'));
    }
    if (typeof Buffer !== 'undefined') {
      return Buffer.from(str, 'base64').toString('utf-8');
    }
  } catch {
    return '';
  }
  return '';
}

/**
 * Simple client-side license verification.
 * Format: header.payload.signature
 */
export function verifyLicenseToken(token: string): LicenseVerificationResult {
  if (!token || typeof token !== 'string') {
    return { valid: false, reason: 'Missing or invalid token string' };
  }

  const parts = token.trim().split('.');
  if (parts.length !== 3) {
    return { valid: false, reason: 'Invalid token structure. Expected 3 segments.' };
  }

  const [headerB64, payloadB64, signature] = parts;
  if (!headerB64 || !payloadB64 || !signature) {
    return { valid: false, reason: 'Malformed token segments' };
  }

  const payloadJson = decodeBase64(payloadB64);
  if (!payloadJson) {
    return { valid: false, reason: 'Failed to decode license payload' };
  }

  let payload: LicensePayload;
  try {
    payload = JSON.parse(payloadJson);
  } catch {
    return { valid: false, reason: 'Payload is not valid JSON' };
  }

  if (!payload.email || !payload.exp || !payload.plan) {
    return { valid: false, reason: 'Missing required license payload fields' };
  }

  const nowSec = Math.floor(Date.now() / 1000);
  if (payload.exp < nowSec) {
    return { valid: false, reason: 'License has expired', payload };
  }

  return {
    valid: true,
    payload
  };
}

/**
 * Checks if current user has an active, unexpired Teacher Pass in safeStorage.
 */
export function hasActiveLicense(): boolean {
  const token = safeStorage.getItem(LICENSE_STORAGE_KEY);
  if (!token) return false;
  const result = verifyLicenseToken(token);
  return result.valid;
}

/**
 * Retrieves the active license payload if valid.
 */
export function getActiveLicense(): LicensePayload | null {
  const token = safeStorage.getItem(LICENSE_STORAGE_KEY);
  if (!token) return null;
  const result = verifyLicenseToken(token);
  return result.valid ? result.payload || null : null;
}

/**
 * Activates and persists a license token into storage.
 */
export function activateLicense(token: string): boolean {
  const result = verifyLicenseToken(token);
  if (!result.valid) return false;
  safeStorage.setItem(LICENSE_STORAGE_KEY, token);
  return true;
}

/**
 * Removes active license token.
 */
export function removeLicense(): void {
  safeStorage.removeItem(LICENSE_STORAGE_KEY);
}
