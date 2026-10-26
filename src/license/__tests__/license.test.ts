import { describe, it, expect, beforeEach } from 'vitest';
import {
  verifyLicenseToken,
  hasActiveLicense,
  getActiveLicense,
  activateLicense,
  removeLicense,
  LICENSE_STORAGE_KEY
} from '../tokenVerifier';
import { safeStorage } from '../../engine/LocalStorageStore';

function createMockToken(payload: object): string {
  const headerB64 = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64');
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64');
  const signature = 'mock_signature_hash_12345';
  return `${headerB64}.${payloadB64}.${signature}`;
}

describe('Teacher Pass License Token Verifier', () => {
  beforeEach(() => {
    safeStorage.removeItem(LICENSE_STORAGE_KEY);
  });

  it('validates a correct, unexpired license token', () => {
    const validExp = Math.floor(Date.now() / 1000) + 86400 * 30; // 30 days
    const token = createMockToken({
      email: 'teacher@school.edu',
      plan: 'monthly',
      iat: Math.floor(Date.now() / 1000),
      exp: validExp
    });

    const res = verifyLicenseToken(token);
    expect(res.valid).toBe(true);
    expect(res.payload?.email).toBe('teacher@school.edu');
    expect(res.payload?.plan).toBe('monthly');
    expect(res.payload?.exp).toBe(validExp);
  });

  it('rejects an expired license token', () => {
    const pastExp = Math.floor(Date.now() / 1000) - 3600; // 1 hr ago
    const token = createMockToken({
      email: 'teacher@school.edu',
      plan: 'annual',
      iat: pastExp - 86400,
      exp: pastExp
    });

    const res = verifyLicenseToken(token);
    expect(res.valid).toBe(false);
    expect(res.reason).toContain('expired');
  });

  it('rejects malformed token strings', () => {
    expect(verifyLicenseToken('').valid).toBe(false);
    expect(verifyLicenseToken('only.two.parts.excess').valid).toBe(false);
    expect(verifyLicenseToken('not_a_token').valid).toBe(false);
    expect(verifyLicenseToken('header.invalid-base64-!!!.signature').valid).toBe(false);
  });

  it('rejects token missing mandatory fields', () => {
    const token = createMockToken({
      // missing email and exp
      plan: 'monthly'
    });

    const res = verifyLicenseToken(token);
    expect(res.valid).toBe(false);
    expect(res.reason).toContain('Missing required license payload fields');
  });

  it('activates, checks, and removes license from safeStorage', () => {
    expect(hasActiveLicense()).toBe(false);
    expect(getActiveLicense()).toBeNull();

    const validExp = Math.floor(Date.now() / 1000) + 86400 * 365; // 1 year
    const token = createMockToken({
      email: 'parent@home.org',
      plan: 'annual',
      iat: Math.floor(Date.now() / 1000),
      exp: validExp
    });

    const activated = activateLicense(token);
    expect(activated).toBe(true);
    expect(hasActiveLicense()).toBe(true);

    const license = getActiveLicense();
    expect(license).not.toBeNull();
    expect(license?.email).toBe('parent@home.org');
    expect(license?.plan).toBe('annual');

    removeLicense();
    expect(hasActiveLicense()).toBe(false);
    expect(getActiveLicense()).toBeNull();
  });
});
