import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { verifyDownloadToken } from '@/utils/tokens';

export async function GET(req: NextRequest) {
  try {
    const orderId = req.nextUrl.searchParams.get('orderId');
    const token = req.nextUrl.searchParams.get('token');

    if (!orderId || !token) {
      return NextResponse.json(
        { error: 'Missing orderId or verification token.' },
        { status: 400 }
      );
    }

    const isValid = verifyDownloadToken(orderId, token);
    if (!isValid) {
      return NextResponse.json(
        {
          error:
            'Access denied: Invalid or expired download token. Please verify your purchase or contact support at solution00000@outlook.com.',
        },
        { status: 403 }
      );
    }

    const filePath = path.join(process.cwd(), 'src', 'private_assets', 'Personal_Growth_System.xlsx');

    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: 'File asset temporarily unavailable. Support has been notified.' },
        { status: 404 }
      );
    }

    const fileBuffer = fs.readFileSync(filePath);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type':
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="Personal_Growth_System.xlsx"',
        'Content-Length': fileBuffer.length.toString(),
        'Cache-Control': 'private, no-cache, no-store, must-revalidate',
        'X-Robots-Tag': 'noindex, nofollow, noarchive',
      },
    });
  } catch (error: any) {
    if (error?.digest) throw error;
    console.error('File download API error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while preparing your download.' },
      { status: 500 }
    );
  }
}
