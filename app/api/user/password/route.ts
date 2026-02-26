import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ message: 'New password must be at least 6 characters long' }, { status: 400 });
    }

    await connectDB();

    // The user's ID is stored in the session by NextAuth
    const userId = (session.user as any).id;
    const userRow = await User.findById(userId);

    if (!userRow) {
      return NextResponse.json({ message: 'User not found in database' }, { status: 404 });
    }

    // Verify current password
    const passwordsMatch = await bcrypt.compare(currentPassword, userRow.password);
    if (!passwordsMatch) {
      return NextResponse.json({ message: 'Current password is incorrect' }, { status: 400 });
    }

    // Hash and update the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    userRow.password = hashedNewPassword;
    await userRow.save();

    return NextResponse.json({ message: 'Password updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Password Update Error:', error);
    return NextResponse.json({ message: 'An internal error occurred' }, { status: 500 });
  }
}
