import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectDB } from '@/lib/db';
import Cart from '@/models/Cart';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const userId = (session.user as any).id;
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = await Cart.create({ userId, items: [] });
    }

    return NextResponse.json(cart);
  } catch (error) {
    console.error('Fetch Cart Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { items } = await req.json();
    if (!Array.isArray(items)) {
      return NextResponse.json({ message: 'Invalid items format' }, { status: 400 });
    }

    await connectDB();
    const userId = (session.user as any).id;
    
    // We do a full replacement/sync of the cart items from client to server
    let cart = await Cart.findOne({ userId });

    if (cart) {
      cart.items = items;
      await cart.save();
    } else {
      cart = await Cart.create({ userId, items });
    }

    return NextResponse.json(cart);
  } catch (error) {
    console.error('Update Cart Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
