import { NextRequest, NextResponse } from 'next/server';

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return '127.0.0.1';
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const now = Date.now();

    // IP Rate Limiting (max 3 subscribe attempts per 10 minutes)
    const limit = rateLimitMap.get(ip) || { count: 0, resetAt: now + 10 * 60 * 1000 };
    if (now > limit.resetAt) {
      limit.count = 0;
      limit.resetAt = now + 10 * 60 * 1000;
    }

    if (limit.count >= 3) {
      return NextResponse.json(
        { error: 'Too many subscription requests from this network. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { email, hp_company } = body || {};

    // Honeypot check: bots auto-fill hidden input fields
    if (hp_company) {
      // Silently discard bot submission
      return NextResponse.json({ success: true, message: 'Subscribed successfully.' });
    }

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Valid email is required.' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail) || cleanEmail.length > 120) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    // Increment rate limit counter
    limit.count += 1;
    rateLimitMap.set(ip, limit);

    return NextResponse.json({
      success: true,
      message: 'You are subscribed! Free prompt templates & drop updates will land in your inbox.',
    });
  } catch (error: any) {
    console.error('Newsletter API error:', error);
    return NextResponse.json({ error: 'Subscription service temporarily unavailable.' }, { status: 500 });
  }
}
