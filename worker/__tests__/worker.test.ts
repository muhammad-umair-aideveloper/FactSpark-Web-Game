import { describe, it, expect } from 'vitest';
import worker, { generateLicenseToken, signPayload, type Env } from '../src/index';

describe('Cloudflare Worker License & Webhook Endpoints', () => {
  const mockKV = new Map<string, string>();
  const mockEnv: Env = {
    ENVIRONMENT: 'test',
    STRIPE_MONTHLY_PRICE_ID: 'price_test_monthly',
    STRIPE_ANNUAL_PRICE_ID: 'price_test_annual',
    SIGNING_SECRET: 'test_signing_secret_999',
    FRONTEND_ORIGIN: 'https://gridfluency.com',
    LICENSES: {
      get: async (key: string) => mockKV.get(key) ?? null,
      put: async (key: string, value: string) => {
        mockKV.set(key, value);
      }
    }
  };

  it('generates a valid, signed license token with correct expiration', async () => {
    const token = await generateLicenseToken('teacher@school.edu', 'monthly', mockEnv.SIGNING_SECRET);
    expect(token).toBeDefined();
    const parts = token.split('.');
    expect(parts.length).toBe(3);

    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
    expect(payload.email).toBe('teacher@school.edu');
    expect(payload.plan).toBe('monthly');
    expect(payload.exp).toBeGreaterThan(Math.floor(Date.now() / 1000));
  });

  it('handles Stripe checkout.session.completed webhook and saves to KV', async () => {
    const webhookPayload = {
      type: 'checkout.session.completed',
      data: {
        object: {
          customer_details: { email: 'mrs.smith@elementary.edu' },
          amount_total: 2900 // Annual plan
        }
      }
    };

    const req = new Request('https://worker.gridfluency.com/api/stripe-webhook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(webhookPayload)
    });

    const res = await worker.fetch(req, mockEnv);
    expect(res.status).toBe(200);

    const json = await res.json() as { received: boolean; token: string };
    expect(json.received).toBe(true);
    expect(json.token).toBeDefined();

    // Verify stored in mock KV
    const stored = await mockEnv.LICENSES!.get('license:mrs.smith@elementary.edu');
    expect(stored).toBe(json.token);
  });

  it('verifies a signed token and rejects a tampered signature', async () => {
    const validToken = await generateLicenseToken('parent@home.org', 'monthly', mockEnv.SIGNING_SECRET);

    // 1. Verify valid token
    const reqValid = new Request(`https://worker.gridfluency.com/api/verify-license?token=${validToken}`, {
      method: 'GET'
    });
    const resValid = await worker.fetch(reqValid, mockEnv);
    const jsonValid = await resValid.json() as { valid: boolean; payload?: any };
    expect(jsonValid.valid).toBe(true);
    expect(jsonValid.payload?.email).toBe('parent@home.org');

    // 2. Tampered signature token
    const parts = validToken.split('.');
    const forgedToken = `${parts[0]}.${parts[1]}.forged_invalid_signature`;
    const reqForged = new Request(`https://worker.gridfluency.com/api/verify-license?token=${forgedToken}`, {
      method: 'GET'
    });
    const resForged = await worker.fetch(reqForged, mockEnv);
    const jsonForged = await resForged.json() as { valid: boolean };
    expect(jsonForged.valid).toBe(false);
  });

  it('handles create-checkout-session in demo/offline fallback mode', async () => {
    const req = new Request('https://worker.gridfluency.com/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan: 'annual' })
    });

    const res = await worker.fetch(req, mockEnv);
    expect(res.status).toBe(200);

    const json = await res.json() as { url: string };
    expect(json.url).toContain('/pass/success');
    expect(json.url).toContain('plan=annual');
  });
});
