import crypto from 'crypto';

const SIGNING_SECRET =
  process.env.RAZORPAY_KEY_SECRET ||
  process.env.ADMIN_SECRET ||
  'nexus_secure_token_secret_key_prod_2026';

/**
 * Generate a cryptographically signed, time-limited download token for an order.
 * Format: `<timestamp>.<signature>`
 */
export function generateDownloadToken(orderId: string): string {
  const timestamp = Date.now().toString();
  const hmac = crypto.createHmac('sha256', SIGNING_SECRET);
  hmac.update(`${orderId}:${timestamp}`);
  const signature = hmac.digest('hex');
  return `${timestamp}.${signature}`;
}

/**
 * Verifies a download token against an orderId.
 * Checks HMAC signature and 24-hour expiration window.
 */
export function verifyDownloadToken(orderId: string, token: string, maxAgeMs = 24 * 60 * 60 * 1000): boolean {
  if (!orderId || !token || typeof token !== 'string') return false;

  const parts = token.split('.');
  if (parts.length !== 2) return false;

  const [timestampStr, signature] = parts;
  const timestamp = parseInt(timestampStr, 10);

  if (isNaN(timestamp) || timestamp <= 0) return false;

  // Check expiration (24 hours)
  if (Date.now() - timestamp > maxAgeMs) {
    return false;
  }

  // Future timestamp spoofing check (allow up to 5 minutes clock drift)
  if (timestamp - Date.now() > 5 * 60 * 1000) {
    return false;
  }

  const hmac = crypto.createHmac('sha256', SIGNING_SECRET);
  hmac.update(`${orderId}:${timestampStr}`);
  const expectedSignature = hmac.digest('hex');

  const sigA = Buffer.from(signature, 'hex');
  const sigB = Buffer.from(expectedSignature, 'hex');

  if (sigA.length !== sigB.length) return false;

  return crypto.timingSafeEqual(sigA, sigB);
}
