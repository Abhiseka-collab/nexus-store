import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { PRODUCTS, PROMO_CODES } from '@/data/products';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { productId, currency = 'INR', promoCode, receipt } = body || {};

    // Validate currency
    const safeCurrency =
      typeof currency === 'string' && /^[A-Za-z]{3}$/.test(currency)
        ? currency.toUpperCase()
        : 'INR';

    // Server-side authoritative price resolution to prevent client-side price tampering
    const product = PRODUCTS.find((p) => p.id === productId) || PRODUCTS[0];
    const basePrice =
      safeCurrency === 'INR'
        ? product.priceInr ?? 10
        : product.price ?? 1;

    // Server-side promo code validation
    let discount = 0;
    if (typeof promoCode === 'string') {
      const cleanPromo = promoCode.trim().toUpperCase();
      if (PROMO_CODES[cleanPromo]) {
        discount = PROMO_CODES[cleanPromo];
      }
    }

    const calculatedPrice = Math.max(
      safeCurrency === 'INR' ? 1 : 0.5,
      Math.round(basePrice * (1 - discount) * 100) / 100
    );

    // Calculate amount in lowest unit (paise / cents)
    const amountInSmallestUnit = Math.round(calculatedPrice * 100);

    const rawKeyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '';
    const rawKeySecret = process.env.RAZORPAY_KEY_SECRET || '';

    const keyId = rawKeyId.trim().replace(/^["']|["']$/g, '');
    const keySecret = rawKeySecret.trim().replace(/^["']|["']$/g, '');

    // In production, missing credentials must fail closed
    if (!keyId || !keySecret) {
      if (process.env.NODE_ENV === 'production') {
        return NextResponse.json(
          {
            error:
              'Payment gateway configuration missing. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in environment variables.',
          },
          { status: 500 }
        );
      }
      // Sandbox fallback response for local development without keys
      return NextResponse.json({
        mock: true,
        id: `order_mock_${Date.now()}`,
        amount: amountInSmallestUnit,
        currency: safeCurrency,
        message: 'Razorpay keys not yet configured. Operating in local sandbox fallback mode.',
      });
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const options = {
      amount: amountInSmallestUnit,
      currency: safeCurrency,
      receipt: typeof receipt === 'string' ? receipt.slice(0, 40) : `rcpt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    return NextResponse.json({
      ...order,
      keyId,
    });
  } catch (error: any) {
    console.error('Razorpay order creation error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to create Razorpay order' },
      { status: 500 }
    );
  }
}
