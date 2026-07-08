import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(request) {
  try {
    // 1. Authenticate Request via Firebase REST API
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized: Missing or invalid token' }, { status: 401 });
    }
    const idToken = authHeader.split('Bearer ')[1];
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

    const verifyRes = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken })
    });

    if (!verifyRes.ok) {
      return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
    }

    const verifyData = await verifyRes.json();
    const user = verifyData.users?.[0];
    if (!user || user.email !== 'dr-mohammed-shabaan@dr.com') {
      return NextResponse.json({ error: 'Forbidden: Insufficient privileges' }, { status: 403 });
    }

    // 2. Fetch Usage
    const usage = await cloudinary.api.usage();
    return NextResponse.json({
      storage: usage.storage,
      bandwidth: usage.bandwidth,
      credits: usage.credits
    });

  } catch (error) {
    console.error('Cloudinary usage error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch usage', 
      details: error?.message || error?.toString() || 'Unknown error'
    }, { status: 500 });
  }
}
