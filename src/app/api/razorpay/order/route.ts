import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount, currency = 'INR', receipt } = body || {};

    // Validate amount: must be a positive finite number greater than zero
    const numAmount = Number(amount);
    if (!numAmount || isNaN(numAmount) || !isFinite(numAmount) || numAmount <= 0) {
      return NextResponse.json(
        { error: 'Invalid order amount: must be a positive number greater than zero.' },
        { status: 400 }
      );
    }

    // Safety ceiling ($50,000 / ₹5,000,000 max single order)
    if (numAmount > 50000) {
      return NextResponse.json(
        { error: 'Order amount exceeds transaction limit.' },
        { status: 400 }
      );
    }

    // Validate and sanitize currency code (3 uppercase alpha characters)
    const safeCurrency = typeof currency === 'string' && /^[A-Za-z]{3}$/.test(currency)
      ? currency.toUpperCase()
      : 'INR';

    const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // In production, missing credentials must fail closed
    if (!keyId || !keySecret) {
      if (process.env.NODE_ENV === 'production') {
        return NextResponse.json(
          { error: 'Payment gateway configuration missing. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in environment variables.' },
          { status: 500 }
        );
      }
      // Sandbox fallback response for local development without keys
      return NextResponse.json({
        mock: true,
        orderId: `order_mock_${Date.now()}`,
        amount: Math.round(numAmount * 100),
        currency: safeCurrency,
        message: 'Razorpay keys not yet configured. Operating in local sandbox fallback mode.',
      });
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const options = {
      amount: Math.round(numAmount * 100), // amount in lowest currency unit (paise / cents)
      currency: safeCurrency,
      receipt: typeof receipt === 'string' ? receipt.slice(0, 40) : `rcpt_${Date.now()}`,
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
