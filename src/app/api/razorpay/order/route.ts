import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(req: Request) {
  try {
    const { amount, currency = 'USD', receipt } = await req.json();

    const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // Check if live/test credentials exist
    if (!keyId || !keySecret) {
      // Sandbox fallback response if keys haven't been pasted yet
      return NextResponse.json({
        mock: true,
        orderId: `order_mock_${Date.now()}`,
        amount: Math.round(Number(amount) * 100),
        currency,
        message: 'Razorpay keys not yet configured in .env.local. Operating in test mode.',
      });
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const options = {
      amount: Math.round(Number(amount) * 100), // amount in lowest currency unit (paise / cents)
      currency: currency.toUpperCase(),
      receipt: receipt || `rcpt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    return NextResponse.json(order);
  } catch (error: any) {
    console.error('Razorpay order creation error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to create Razorpay order' },
      { status: 500 }
    );
  }
}
