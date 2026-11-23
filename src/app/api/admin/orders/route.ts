import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { verifyAdminRequest } from '@/utils/serverAuth';
import { PRODUCTS } from '@/data/products';
import { generateDownloadToken } from '@/utils/tokens';
import { Order } from '@/types/product';

export async function GET(req: NextRequest) {
  try {
    // 1. Enforce strict server-side admin authentication
    const isAuthed = verifyAdminRequest(req);
    if (!isAuthed) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Admin authentication required.' },
        { status: 401 }
      );
    }

    const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return NextResponse.json({
        success: true,
        configured: false,
        count: 0,
        orders: [],
        message: 'Razorpay API credentials not configured in environment variables.',
      });
    }

    // 2. Fetch live payments from Razorpay
    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const paymentsResponse: any = await razorpay.payments.all({
      count: 50,
    });

    const items = paymentsResponse?.items || [];
    const defaultProduct = PRODUCTS[0];

    // Filter captured (successful) payments
    const captured = items.filter((p: any) => p && p.status === 'captured');

    const orders: Order[] = captured.map((p: any) => {
      const orderId = p.order_id || p.id;
      const amountMajor = Math.round((Number(p.amount) / 100) * 100) / 100;
      const currency = p.currency === 'INR' ? 'INR' : 'USD';
      const createdDate = new Date(p.created_at * 1000);

      const customerName =
        p.notes?.customerName ||
        p.notes?.name ||
        (p.contact ? `User (${p.contact})` : 'Verified Buyer');
      const customerEmail = p.email || 'customer@nexus-store.com';

      return {
        id: orderId,
        customerName,
        customerEmail,
        items: [
          {
            product: defaultProduct,
            quantity: 1,
          },
        ],
        subtotal: amountMajor,
        discount: 0,
        total: amountMajor,
        currency,
        promoCode: p.notes?.promoCode || undefined,
        createdAt: createdDate.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        timestamp: createdDate.getTime(),
        downloadToken: generateDownloadToken(orderId),
      };
    });

    return NextResponse.json({
      success: true,
      configured: true,
      count: orders.length,
      orders,
    });
  } catch (error: any) {
    if (error?.digest === 'NEXT_PRERENDER_INTERRUPTED') {
      throw error;
    }
    console.error('Error fetching real orders from Razorpay:', error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Failed to fetch orders from Razorpay gateway.',
      },
      { status: 500 }
    );
  }
}
