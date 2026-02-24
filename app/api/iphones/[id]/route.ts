import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import IPhone from '@/models/iPhone';

export const dynamic = 'force-dynamic';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const id = (await params).id;
    const body = await req.json();

    const updatedIPhone = await IPhone.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    
    if (!updatedIPhone) {
      return NextResponse.json({ error: 'iPhone not found' }, { status: 404 });
    }

    return NextResponse.json(updatedIPhone);
  } catch (error) {
    console.error('Error updating iPhone:', error);
    return NextResponse.json({ error: 'Failed to update iPhone' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const id = (await params).id;

    const deletedIPhone = await IPhone.findByIdAndDelete(id);

    if (!deletedIPhone) {
      return NextResponse.json({ error: 'iPhone not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'iPhone deleted successfully' });
  } catch (error) {
    console.error('Error deleting iPhone:', error);
    return NextResponse.json({ error: 'Failed to delete iPhone' }, { status: 500 });
  }
}
