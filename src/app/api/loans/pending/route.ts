import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { Loan } from '@/models/Loan';
import connectDB from '@/lib/mongodb';

export async function GET(request: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const pendingCount = await Loan.countDocuments({ userId, status: 'pending' });
    return NextResponse.json(pendingCount);
  } catch (error) {
    console.error('Error fetching pending loans count:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 