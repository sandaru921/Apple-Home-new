import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Slide from '@/models/Slide';
import Offer from '@/models/Offer';
import IPhone from '@/models/iPhone';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();
    
    // Fetch Slides
    const slides = await Slide.find({}).sort({ createdAt: -1 }).lean();
    
    // Fetch valid offers
    const offers = await Offer.find({ endDate: { $gt: new Date() } })
      .populate('iPhoneId')
      .sort({ createdAt: -1 })
      .lean();
    
    const validOffers = offers.filter(offer => offer.iPhoneId != null);

    // Fetch iPhones for New Arrivals (New condition)
    let newArrivals = await IPhone.find({
        $or: [{ condition: 'New' }, { condition: { $exists: false } }]
    }).sort({ createdAt: -1 }).limit(8).lean();

    // Fetch iPhones On Sale
    const onSaleItems = await IPhone.find({
      $expr: { $lt: ["$price", "$basePrice"] }
    }).sort({ createdAt: -1 }).limit(8).lean();
    
    // fallback if no items on sale we'll just get random 8
    const onSale = onSaleItems.length > 0 ? onSaleItems : 
       await IPhone.find({}).sort({ createdAt: -1 }).skip(1).limit(8).lean();

    // Fetch iPhones Top Rated (Excellent condition)
    const topRatedItems = await IPhone.find({ condition: 'Excellent' })
      .sort({ createdAt: -1 }).limit(8).lean();
    
    const topRated = topRatedItems.length > 0 ? topRatedItems :
       await IPhone.find({}).sort({ createdAt: -1 }).skip(2).limit(8).lean();

    return NextResponse.json({
      slides,
      offers: validOffers,
      newArrivals,
      onSale,
      topRated
    });

  } catch (error) {
    console.error('Failed to fetch home data:', error);
    return NextResponse.json({ error: 'Failed to fetch home data' }, { status: 500 });
  }
}
