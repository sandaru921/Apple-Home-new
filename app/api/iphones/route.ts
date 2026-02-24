import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import IPhone from '@/models/iPhone';

export const dynamic = 'force-dynamic';

// GET all iPhones
export async function GET() {
  try {
    await connectDB();
    const iphones = await IPhone.find({}).sort({ createdAt: -1 });
    return NextResponse.json(iphones);
  } catch (error) {
    console.error('Failed to fetch iPhones:', error);
    return NextResponse.json({ error: 'Failed to fetch iPhones' }, { status: 500 });
  }
}

// POST new iPhone
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    
    // Validate required fields
    const requiredFields = ['model', 'price', 'description', 'imageUrl'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
    }

    const newIPhone = await IPhone.create(body);
    return NextResponse.json(newIPhone, { status: 201 });
  } catch (error) {
    console.error('Create iPhone error:', error);
    return NextResponse.json({ error: 'Failed to create iPhone' }, { status: 500 });
  }
}
