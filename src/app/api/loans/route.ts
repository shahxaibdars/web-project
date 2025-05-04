import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { Loan } from '@/models/Loan';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function GET(request: Request) {
  try {
    const token = request.headers.get('cookie')?.split('; ')
      .find(row => row.startsWith('token='))
      ?.split('=')[1];

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
    const { userId: tokenUserId, role } = payload as { userId: string; role: string };

    await connectDB();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    // If user is a loan distributor, return all loans
    if (role === 'loan_distributor') {
      const loans = await Loan.find().sort({ createdAt: -1 });
      return NextResponse.json(loans, { 
        headers: {
          'Content-Type': 'application/json',
        }
      });
    }

    // For regular users, only return their own loans
    if (!userId || userId !== tokenUserId) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }

    const loans = await Loan.find({ userId }).sort({ createdAt: -1 });
    return NextResponse.json(loans, { 
      headers: {
        'Content-Type': 'application/json',
      }
    });
  } catch (error) {
    console.error('Error fetching loans:', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        }
      });
    }
    return NextResponse.json({ error: 'Internal server error' }, { 
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      }
    });
  }
}

export async function POST(request: Request) {
  try {
    const token = request.headers.get('cookie')?.split('; ')
      .find(row => row.startsWith('token='))
      ?.split('=')[1];

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
    const { userId, name: userName } = payload as { userId: string; name: string };

    await connectDB();

    const { amount, purpose } = await request.json();

    if (!amount || !purpose) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (userId !== userId) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }

    // Validate amount
    if (amount <= 0) {
      return NextResponse.json({ error: 'Loan amount must be greater than 0' }, { status: 400 });
    }

    const tax = amount * 0.05; // 5% tax

    const loan = await Loan.create({
      userId,
      userName: userName || 'Anonymous User',
      amount,
      purpose,
      status: 'pending',
      tax,
      creditScore: 0,
      financialHistory: {
        monthlyIncome: 0,
        monthlyExpenses: 0,
        savings: 0,
        existingLoans: 0,
        paymentHistory: 'good'
      },
      createdAt: new Date(),
    });

    await loan.save();
    return NextResponse.json(loan);
  } catch (error) {
    console.error('Error creating loan:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const token = request.headers.get('cookie')?.split('; ')
      .find(row => row.startsWith('token='))
      ?.split('=')[1];

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
    const { userId } = payload as { userId: string };

    const { searchParams } = new URL(request.url);
    const loanId = searchParams.get('id');

    if (!loanId || loanId === 'undefined') {
      return NextResponse.json({ error: 'Loan ID is required' }, { status: 400 });
    }

    await connectDB();

    // Validate if the loanId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(loanId)) {
      return NextResponse.json({ error: 'Invalid loan ID format' }, { status: 400 });
    }

    const loan = await Loan.findById(loanId);

    if (!loan) {
      return NextResponse.json({ error: 'Loan not found' }, { status: 404 });
    }

    if (loan.userId !== userId) {
      return NextResponse.json({ error: 'Unauthorized to delete this loan' }, { status: 403 });
    }

    if (loan.status !== 'pending') {
      return NextResponse.json({ error: 'Only pending loans can be deleted' }, { status: 400 });
    }

    await Loan.findByIdAndDelete(loanId);
    return NextResponse.json({ message: 'Loan deleted successfully' });
  } catch (error) {
    console.error('Error deleting loan:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 