export interface Env {
  ENVIRONMENT?: string;
  STRIPE_SECRET_KEY?: string;
  STRIPE_WEBHOOK_SECRET?: string;
  STRIPE_MONTHLY_PRICE_ID: string;
  STRIPE_ANNUAL_PRICE_ID: string;
  SIGNING_SECRET?: string;
  FRONTEND_ORIGIN: string;
  LICENSES?: {
    get: (key: string) => Promise<string | null>;
    put: (key: string, value: string, options?: { expirationTtl?: number }) => Promise<void>;
  };
}

export interface LicenseTokenPayload {
  email: string;
  plan: 'monthly' | 'annual';
  iat: number;
  exp: number;
}

const DEFAULT_SIGNING_SECRET = 'grid_fluency_worker_secure_signing_key_2026';

/**
 * Creates a base64url HMAC-SHA256 signature using Web Crypto API.
 */
export async function signPayload(payloadJson: string, secret: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signatureBuffer = await crypto.subtle.sign('HMAC', key, enc.encode(payloadJson));
  const bytes = Array.from(new Uint8Array(signatureBuffer));
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * Generates a signed token for an email and subscription plan.
 */
export async function generateLicenseToken(
  email: string,
  plan: 'monthly' | 'annual',
  secret: string = DEFAULT_SIGNING_SECRET
): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const durationSec = plan === 'annual' ? 365 * 86400 : 30 * 86400;
  const payload: LicenseTokenPayload = {
    email,
    plan,
    iat: now,
    exp: now + durationSec
  };

  const headerB64 = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payloadJson = JSON.stringify(payload);
  const payloadB64 = btoa(payloadJson);
  const signature = await signPayload(payloadJson, secret);

  return `${headerB64}.${payloadB64}.${signature}`;
}

export function getCorsHeaders(origin: string = '*'): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, stripe-signature',
    'Access-Control-Max-Age': '86400'
  };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const origin = env.FRONTEND_ORIGIN || '*';
    const corsHeaders = getCorsHeaders(origin);

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    // 1. Create Checkout Session
    if (url.pathname === '/api/create-checkout-session' && request.method === 'POST') {
      try {
        let body: { plan?: string } = {};
        try {
          body = await request.json();
        } catch {
          // Default
        }

        const plan = body.plan === 'annual' ? 'annual' : 'monthly';
        const priceId = plan === 'annual' ? env.STRIPE_ANNUAL_PRICE_ID : env.STRIPE_MONTHLY_PRICE_ID;

        // If Stripe secret key is present, construct real Stripe API session
        if (env.STRIPE_SECRET_KEY) {
          const params = new URLSearchParams();
          params.append('payment_method_types[]', 'card');
          params.append('mode', 'subscription');
          params.append('line_items[0][price]', priceId);
          params.append('line_items[0][quantity]', '1');
          params.append('success_url', `${origin}/pass/success?session_id={CHECKOUT_SESSION_ID}&plan=${plan}`);
          params.append('cancel_url', `${origin}/pass/cancel`);

          const stripeRes = await fetch('https://api.stripe.com/v1/checkout/sessions', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`,
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: params.toString()
          });

          if (stripeRes.ok) {
            const session = await stripeRes.json() as { url: string };
            return new Response(JSON.stringify({ url: session.url }), {
              headers: { 'Content-Type': 'application/json', ...corsHeaders }
            });
          }
        }

        // Demo / offline fallback mode (only when explicitly in development environment)
        if (env.ENVIRONMENT === 'development') {
          return new Response(
            JSON.stringify({
              url: `${origin}/pass/success?demo=true&plan=${plan}`
            }),
            { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
          );
        }

        return new Response(
          JSON.stringify({ error: 'Payment provider unavailable' }),
          { status: 503, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        );
      } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message || 'Internal Server Error' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }
    }

    // 2. Stripe Webhook Handler
    if (url.pathname === '/api/stripe-webhook' && request.method === 'POST') {
      try {
        const payload = await request.text();
        const event = JSON.parse(payload);

        if (event.type === 'checkout.session.completed') {
          const session = event.data?.object || {};
          const customerEmail = session.customer_details?.email || session.customer_email || 'teacher@school.org';
          const plan: 'monthly' | 'annual' = session.amount_total > 1500 ? 'annual' : 'monthly';

          const secret = env.SIGNING_SECRET || DEFAULT_SIGNING_SECRET;
          const token = await generateLicenseToken(customerEmail, plan, secret);

          // Save to KV if bound
          if (env.LICENSES) {
            const ttl = plan === 'annual' ? 366 * 86400 : 31 * 86400;
            await env.LICENSES.put(`license:${customerEmail}`, token, { expirationTtl: ttl });
          }

          return new Response(JSON.stringify({ received: true, token }), {
            status: 200,
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
          });
        }

        return new Response(JSON.stringify({ received: true, ignored: true }), {
          status: 200,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }
    }

    // 3. License Verification Endpoint
    if (url.pathname === '/api/verify-license' && request.method === 'GET') {
      const token = url.searchParams.get('token');
      if (!token) {
        return new Response(JSON.stringify({ valid: false, reason: 'Missing token' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      const parts = token.split('.');
      if (parts.length !== 3) {
        return new Response(JSON.stringify({ valid: false, reason: 'Malformed token' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      try {
        const payloadJson = atob(parts[1]);
        const payload: LicenseTokenPayload = JSON.parse(payloadJson);
        const secret = env.SIGNING_SECRET || DEFAULT_SIGNING_SECRET;
        const expectedSig = await signPayload(payloadJson, secret);

        const nowSec = Math.floor(Date.now() / 1000);
        const valid = expectedSig === parts[2] && payload.exp > nowSec;

        return new Response(
          JSON.stringify({
            valid,
            expired: payload.exp <= nowSec,
            payload: valid ? payload : undefined
          }),
          { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        );
      } catch {
        return new Response(JSON.stringify({ valid: false, reason: 'Parse error' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }
    }

    return new Response('Not Found', { status: 404, headers: corsHeaders });
  }
};
