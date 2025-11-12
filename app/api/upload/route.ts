// app/api/upload/route.ts
import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { connectDB } from '@/lib/db';
import iPhone from '@/models/iPhone';
import Slide from '@/models/Slide';
import Offer from '@/models/Offer';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  await connectDB();
  const formData = await request.formData();
  const type = formData.get('type') as string;

  try {
    if (type === 'slide') {
      const file = formData.get('image') as File;
      const buffer = Buffer.from(await file.arrayBuffer());
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: 'iphone-shop/slides' },
          (err, res) => err ? reject(err) : resolve(res)
        ).end(buffer);
      });
      const slide = new Slide({ imageUrl: (result as any).secure_url });
      await slide.save();
      return NextResponse.json({ success: true });
    }

    if (type === 'offer') {
      const iPhoneId = formData.get('iPhoneId');
      const discount = Number(formData.get('discount'));
      const endDate = formData.get('endDate');

      const iphone = await iPhone.findOne({ model: iPhoneId });
      if (!iphone) return NextResponse.json({ error: 'iPhone not found' }, { status: 404 });

      const offer = new Offer({
        iPhoneId: iphone._id,
        discountPercent: discount,
        endDate,
      });
      await offer.save();
      return NextResponse.json({ success: true });
    }

    // Existing iPhone upload logic...
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}