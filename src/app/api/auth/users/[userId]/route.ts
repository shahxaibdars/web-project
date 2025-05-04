import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { User } from '@/models/User';
import { Bill } from '@/models/Bill';
import { Loan } from '@/models/Loan';
import { Transaction } from '@/models/Transaction';
import { Savings } from '@/models/Savings';

export async function DELETE(
  request: Request,
  context: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await context.params;

    await connectDB();

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (user.role === 'admin') {
      return NextResponse.json(
        { error: 'Cannot delete admin user' },
        { status: 403 }
      );
    }

    await Promise.all([
      Bill.deleteMany({ userId }),
      Loan.deleteMany({ userId }),
      Transaction.deleteMany({ userId }),
      Savings.deleteMany({ userId })
    ]);

    await User.findByIdAndDelete(userId);

    return NextResponse.json(
      { message: 'User and all associated data deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}