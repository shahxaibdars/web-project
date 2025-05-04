import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { Loan } from '@/models/Loan';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = request.headers.get('cookie')?.split('; ')
      .find(row => row.startsWith('token='))
      ?.split('=')[1];

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
    const { role } = payload as { role: string };

    // Only loan distributors can update loan status
    if (role !== 'loan_distributor') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await connectDB();

    const { id } = await params;
    const { status } = await request.json();

    // Validate loan ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid loan ID' }, { status: 400 });
    }

    // Validate status
    if (!['approved', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const loan = await Loan.findById(id);
    if (!loan) {
      return NextResponse.json({ error: 'Loan not found' }, { status: 404 });
    }

    // Update loan status
    loan.status = status;
    await loan.save();

    return NextResponse.json(loan);
  } catch (error) {
    console.error('Error updating loan:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 