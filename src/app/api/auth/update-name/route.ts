import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { User } from '@/models/User';
import connectDB from '@/lib/mongodb';

export async function POST(request: Request) {
  try {
    const token = request.headers.get('cookie')?.split('; ')
      .find(row => row.startsWith('token='))
      ?.split('=')[1];

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET!));
    const { userId } = payload as { userId: string };

    await connectDB();

    const { name, currentPassword } = await request.json();

    if (!name || !currentPassword) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Find user and verify current password
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Verify current password
    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid current password' }, { status: 400 });
    }

    // Update user's name
    user.name = name;
    await user.save();

    return NextResponse.json({ message: 'Name updated successfully' });
  } catch (error) {
    console.error('Error updating name:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 