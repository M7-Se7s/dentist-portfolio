import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary using a Promise wrapper
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'clinical_cases' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      
      uploadStream.end(buffer);
    });

    return NextResponse.json({ 
      success: true, 
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id 
    });

  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
  }
}
