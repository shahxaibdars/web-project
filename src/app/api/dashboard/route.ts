import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { Transaction } from '@/models/Transaction';
import connectDB from '@/lib/mongodb';

export async function GET(request: Request) {
  try {
    const token = request.headers.get('cookie')?.split('; ')
      .find(row => row.startsWith('token='))
      ?.split('=')[1];

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET!));
    const { userId, role } = payload as { userId: string; role: string };

    await connectDB();

    // Get transaction stats
    const transactions = await Transaction.find({ userId });
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    return NextResponse.json({
      totalIncome,
      totalExpenses,
      balance: totalIncome - totalExpenses,
      role
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 