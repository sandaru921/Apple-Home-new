// app/api/test-db/route.ts
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';

export async function GET() {
  try {
    await connectDB();
    return NextResponse.json(
      {
        success: true,
        message: 'Connected to MongoDB Atlas! (App Router)',
        database: 'iphone-shop',
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: 'Connection failed',
        error: error.message,
      },
      { status: 500 }
    );
  }
}