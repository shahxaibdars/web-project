import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { Savings } from '@/models/Savings';
import connectDB from '@/lib/mongodb';

export async function PUT(request: Request) {
  try {
    const token = request.headers.get('cookie')?.split('; ')
      .find(row => row.startsWith('token='))
      ?.split('=')[1];

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string; role: string };
    
    await connectDB();

    const { userId, goalId, amount } = await request.json();

    if (!userId || userId !== decoded.userId || !goalId || amount === undefined) {
      return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
    }

    const savings = await Savings.findOneAndUpdate(
      { _id: goalId, userId },
      { $inc: { currentAmount: amount } },
      { new: true }
    );

    if (!savings) {
      return NextResponse.json({ error: 'Savings goal not found' }, { status: 404 });
    }

    return NextResponse.json(savings);
  } catch (error) {
    console.error('Error updating savings amount:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 