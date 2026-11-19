import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body || {};

    // Validate required fields are non-empty strings
    if (
      !razorpay_order_id || typeof razorpay_order_id !== 'string' ||
      !razorpay_payment_id || typeof razorpay_payment_id !== 'string' ||
      !razorpay_signature || typeof razorpay_signature !== 'string'
    ) {
      return NextResponse.json(
        { verified: false, error: 'Missing or invalid Razorpay payment parameters.' },
        { status: 400 }
      );
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // Fail closed in production if secret is missing
    if (!keySecret) {
      if (process.env.NODE_ENV === 'production') {
        return NextResponse.json(
          { verified: false, error: 'Server configuration error: Gateway secret missing.' },
          { status: 500 }
        );
      }
      return NextResponse.json({
        verified: true,
        mock: true,
        message: 'Signature accepted in development fallback mode.',
      });
    }

    const hmac = crypto.createHmac('sha256', keySecret);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generatedSignature = hmac.digest('hex');

    // Constant-time comparison to prevent timing attacks
    const sigA = Buffer.from(generatedSignature, 'utf8');
    const sigB = Buffer.from(razorpay_signature, 'utf8');

    if (sigA.length === sigB.length && crypto.timingSafeEqual(sigA, sigB)) {
      return NextResponse.json({ verified: true });
    } else {
      return NextResponse.json(
        { verified: false, error: 'Invalid Razorpay signature. Verification failed.' },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('Razorpay signature verification error:', error);
    return NextResponse.json(
      { verified: false, error: error?.message || 'Verification failed.' },
      { status: 500 }
    );
  }
}
