import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Order from '@/models/Order';

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const { customerDetails, items, totalAmount } = body;

    if (!customerDetails || !items || !totalAmount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newOrder = await Order.create({
      customerDetails,
      items,
      totalAmount,
    });

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    console.error('Checkout API error:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
