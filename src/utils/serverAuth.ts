import { NextRequest } from 'next/server';
import crypto from 'crypto';

export const AUTH_SECRET =
  process.env.ADMIN_AUTH_SECRET ||
  process.env.RAZORPAY_KEY_SECRET ||
  'nexus_admin_secure_auth_secret_2026';

export const SERVER_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin';

export function signSession(expiryMs: number): string {
  const expiry = (Date.now() + expiryMs).toString();
  const hmac = crypto.createHmac('sha256', AUTH_SECRET);
  hmac.update(expiry);
  const sig = hmac.digest('hex');
  return `${expiry}.${sig}`;
}

export function verifySession(sessionCookie?: string | null): boolean {
  if (!sessionCookie) return false;
  const parts = sessionCookie.split('.');
  if (parts.length !== 2) return false;
  const [expiryStr, sig] = parts;
  const expiry = parseInt(expiryStr, 10);
  if (isNaN(expiry) || Date.now() > expiry) return false;

  const hmac = crypto.createHmac('sha256', AUTH_SECRET);
  hmac.update(expiryStr);
  const expectedSig = hmac.digest('hex');

  const bufA = Buffer.from(sig, 'hex');
  const bufB = Buffer.from(expectedSig, 'hex');
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export function verifyAdminRequest(req: NextRequest): boolean {
  const session = req.cookies.get('nexus_admin_session')?.value;
  return verifySession(session);
}
