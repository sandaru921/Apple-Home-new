import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Slide from '@/models/Slide';

export const dynamic = 'force-dynamic';

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const id = (await params).id;

    const deletedSlide = await Slide.findByIdAndDelete(id);

    if (!deletedSlide) {
      return NextResponse.json({ error: 'Slide not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Slide deleted successfully' });
  } catch (error) {
    console.error('Error deleting slide:', error);
    return NextResponse.json({ error: 'Failed to delete slide' }, { status: 500 });
  }
}
