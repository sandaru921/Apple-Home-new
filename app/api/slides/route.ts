import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Slide from '@/models/Slide';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();
    const slides = await Slide.find({}).sort({ createdAt: -1 });
    return NextResponse.json(slides);
  } catch (error) {
    console.error('Failed to fetch slides:', error);
    return NextResponse.json({ error: 'Failed to fetch slides' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    
    if (!body.imageUrl) {
      return NextResponse.json({ error: 'imageUrl is required' }, { status: 400 });
    }

    const newSlide = await Slide.create(body);
    return NextResponse.json(newSlide, { status: 201 });
  } catch (error) {
    console.error('Create slide error:', error);
    return NextResponse.json({ error: 'Failed to create slide' }, { status: 500 });
  }
}
