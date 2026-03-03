import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Offer from '@/models/Offer';
import iPhone from '@/models/iPhone';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const iphoneId = searchParams.get('iphoneId');
    
    let query: any = {};
    if (iphoneId) {
      query.iPhoneId = iphoneId;
    }

    const offers = await Offer.find(query)
      .populate('iPhoneId')
      .sort({ createdAt: -1 });

    // Filter out offers where the referenced iPhone might have been deleted
    const validOffers = offers.filter(offer => offer.iPhoneId != null);
    
    return NextResponse.json(validOffers);
  } catch (error: any) {
    console.error('Failed to fetch offers:', error);
    return NextResponse.json({ error: 'Failed to fetch offers' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { iPhoneId, discountPercent, endDate } = body;

    if (!iPhoneId || !discountPercent || !endDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const iphone = await iPhone.findById(iPhoneId);
    if (!iphone) {
      return NextResponse.json({ error: 'Selected product not found' }, { status: 404 });
    }

    const offer = await Offer.create({
      iPhoneId,
      discountPercent: Number(discountPercent),
      endDate: new Date(endDate)
    });

    // Populate for the immediate return response
    await offer.populate('iPhoneId');

    return NextResponse.json(offer, { status: 201 });
  } catch (error: any) {
    console.error('Failed to create offer:', error);
    return NextResponse.json({ error: error.message || 'Failed to create offer' }, { status: 500 });
  }
}
