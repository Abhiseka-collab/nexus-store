import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, customerName, customerEmail, downloadToken, total, currency = 'USD' } = body || {};

    if (!customerEmail || !orderId || !downloadToken) {
      return NextResponse.json(
        { error: 'Missing required order email parameters.' },
        { status: 400 }
      );
    }

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      (process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : 'https://nexus-store-woad.vercel.app');

    const downloadUrl = `${siteUrl}/api/download?orderId=${encodeURIComponent(orderId)}&token=${encodeURIComponent(downloadToken)}`;
    const formattedPrice = currency === 'INR' ? `₹${total || 10}` : `$${total || 1}`;

    const emailSubject = `Your NEXUS Download & Receipt: 16-in-1 Personal Growth System (Order #${orderId})`;
    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #09090b; color: #f4f4f5; margin: 0; padding: 24px; }
    .card { max-width: 580px; margin: 0 auto; background-color: #18181b; border: 1px solid #27272a; border-radius: 20px; overflow: hidden; padding: 32px; }
    .brand { font-size: 20px; font-weight: 800; color: #ffffff; letter-spacing: 1px; display: inline-block; margin-bottom: 24px; }
    .title { font-size: 24px; font-weight: 800; color: #ffffff; margin-bottom: 8px; }
    .desc { font-size: 14px; color: #a1a1aa; line-height: 1.6; margin-bottom: 24px; }
    .btn { display: inline-block; background-color: #4f46e5; color: #ffffff; font-weight: 700; font-size: 14px; text-decoration: none; padding: 14px 28px; border-radius: 12px; margin-bottom: 24px; }
    .details { background-color: #27272a; border-radius: 12px; padding: 16px; font-size: 13px; color: #d4d4d8; margin-bottom: 24px; }
    .row { display: flex; justify-content: space-between; margin-bottom: 8px; }
    .footer { font-size: 11px; color: #71717a; border-t: 1px solid #27272a; padding-top: 16px; margin-top: 24px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="brand">⚡ NEXUS DIGITAL</div>
    <div class="title">Your Files Are Ready!</div>
    <div class="desc">
      Hi ${customerName || 'Valued Creator'},<br><br>
      Thank you for ordering the <strong>16-in-1 Personal Growth System (.xlsx)</strong>! Your files have been unlocked and your license is permanently active.
    </div>

    <center>
      <a href="${downloadUrl}" class="btn">📥 Download Master Spreadsheet (.xlsx)</a>
    </center>

    <div class="details">
      <div class="row"><strong>Order ID:</strong> <span>${orderId}</span></div>
      <div class="row"><strong>Amount Paid:</strong> <span>${formattedPrice}</span></div>
      <div class="row"><strong>License:</strong> <span>Commercial Single-Seat Lifetime License</span></div>
      <div class="row"><strong>Format:</strong> <span>Microsoft Excel (.xlsx) & Google Sheets Ready</span></div>
    </div>

    <div class="desc" style="font-size: 12px;">
      <strong>Quickstart Tip:</strong> Open the file directly in Microsoft Excel, or upload it to Google Drive and open with Google Sheets. Both platforms preserve all formulas, streak counters, and automated charts.
    </div>

    <div class="footer">
      If you ever need file assistance, download link re-generation, or have questions, simply reply to this email or reach us at <a href="mailto:solution00000@outlook.com" style="color: #818cf8;">solution00000@outlook.com</a>.<br><br>
      © 2026 NEXUS Store. All rights reserved.
    </div>
  </div>
</body>
</html>
    `;

    // 1. If RESEND_API_KEY is configured in Vercel environment variables:
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey) {
      try {
        const resendRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: process.env.EMAIL_FROM || 'NEXUS Store <orders@nexus-store.vercel.app>',
            to: [customerEmail],
            subject: emailSubject,
            html: emailHtml,
          }),
        });

        if (resendRes.ok) {
          const resendData = await resendRes.json();
          return NextResponse.json({ success: true, provider: 'resend', id: resendData.id });
        }
      } catch (err) {
        console.error('Resend delivery error:', err);
      }
    }

    // 2. Simulated log for local development & when API key is pending
    console.log(`[Order Email Ready] Sent to: ${customerEmail} | Order: ${orderId} | Link: ${downloadUrl}`);

    return NextResponse.json({
      success: true,
      delivered: false,
      simulated: true,
      message:
        'Email payload validated. Add RESEND_API_KEY to Vercel environment variables for real-world automated inbox delivery.',
    });
  } catch (error: any) {
    console.error('Order email route error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to dispatch order email.' },
      { status: 500 }
    );
  }
}
