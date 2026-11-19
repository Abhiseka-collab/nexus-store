import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // In test/mock mode without keys
    if (!keySecret) {
      return NextResponse.json({
        verified: true,
        mock: true,
        message: 'Signature accepted in sandbox mode.',
      });
    }

    const hmac = crypto.createHmac('sha256', keySecret);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generatedSignature = hmac.digest('hex');

    if (generatedSignature === razorpay_signature) {
      return NextResponse.json({ verified: true });
    } else {
      return NextResponse.json(
        { verified: false, error: 'Invalid Razorpay signature' },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('Signature verification error:', error);
    return NextResponse.json(
      { verified: false, error: 'Verification failed' },
      { status: 500 }
    );
  }
}
