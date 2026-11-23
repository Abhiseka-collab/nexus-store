import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { signSession, verifySession, SERVER_ADMIN_PASSWORD } from '@/utils/serverAuth';

// In-memory brute-force rate limiter: IP -> { attempts, lockoutUntil }
const rateLimitMap = new Map<string, { attempts: number; lockoutUntil: number }>();

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return '127.0.0.1';
}

// Check session
export async function GET(req: NextRequest) {
  const session = req.cookies.get('nexus_admin_session')?.value;
  const isAuthenticated = session ? verifySession(session) : false;
  return NextResponse.json({ authenticated: isAuthenticated });
}

// Login
export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const now = Date.now();

    // Check rate limiting
    const rateData = rateLimitMap.get(ip) || { attempts: 0, lockoutUntil: 0 };
    if (now < rateData.lockoutUntil) {
      const waitSec = Math.ceil((rateData.lockoutUntil - now) / 1000);
      return NextResponse.json(
        {
          success: false,
          error: `Too many failed login attempts. IP temporarily locked for ${waitSec}s.`,
        },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { password } = body || {};

    if (!password || typeof password !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Password is required.' },
        { status: 400 }
      );
    }

    // Constant time comparison
    const inputBuf = Buffer.from(password.trim(), 'utf8');
    const secretBuf = Buffer.from(SERVER_ADMIN_PASSWORD.trim(), 'utf8');

    let isMatch = false;
    if (inputBuf.length === secretBuf.length) {
      isMatch = crypto.timingSafeEqual(inputBuf, secretBuf);
    }

    if (!isMatch) {
      const newAttempts = rateData.attempts + 1;
      if (newAttempts >= 5) {
        // 15-minute IP lockout after 5 consecutive failed attempts
        rateLimitMap.set(ip, {
          attempts: 0,
          lockoutUntil: now + 15 * 60 * 1000,
        });
        return NextResponse.json(
          {
            success: false,
            error: 'Security Alert: Maximum failed attempts exceeded. Access locked for 15 minutes.',
          },
          { status: 429 }
        );
      } else {
        rateLimitMap.set(ip, {
          attempts: newAttempts,
          lockoutUntil: 0,
        });
        return NextResponse.json(
          {
            success: false,
            error: `Incorrect password. (${5 - newAttempts} attempts remaining)`,
          },
          { status: 401 }
        );
      }
    }

    // Success: reset rate limit and create signed 24h HTTP-only cookie
    rateLimitMap.delete(ip);
    const sessionToken = signSession(24 * 60 * 60 * 1000);

    const res = NextResponse.json({ success: true });
    res.cookies.set('nexus_admin_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 24 * 60 * 60,
    });

    return res;
  } catch (error: any) {
    console.error('Admin auth error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal authentication error.' },
      { status: 500 }
    );
  }
}

// Logout
export async function DELETE() {
  const res = NextResponse.json({ success: true, message: 'Logged out successfully.' });
  res.cookies.set('nexus_admin_session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
  return res;
}
