import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Transaction } from '@/models/Transaction';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'UserId is required' }, { status: 400 });
    }

    await connectDB();
    const transactions = await Transaction.find({ userId }).sort({ date: -1 });
    
    // Transform MongoDB documents to match frontend interface
    const transformedTransactions = transactions.map(transaction => ({
      id: transaction._id.toString(),
      userId: transaction.userId,
      amount: transaction.amount,
      category: transaction.category,
      date: transaction.date,
      description: transaction.description,
      type: transaction.type
    }));
    
    return NextResponse.json(transformedTransactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, amount, description, type, category, date } = body;

    if (!userId || !amount || !description || !type || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectDB();
    const transaction = new Transaction({
      userId,
      amount,
      description,
      type,
      category,
      date: date || new Date(),
    });
    
    await transaction.save();
    
    // Transform the saved transaction to match frontend interface
    const transformedTransaction = {
      id: transaction._id.toString(),
      userId: transaction.userId,
      amount: transaction.amount,
      category: transaction.category,
      date: transaction.date,
      description: transaction.description,
      type: transaction.type
    };
    
    return NextResponse.json(transformedTransaction, { status: 201 });
  } catch (error) {
    console.error('Error creating transaction:', error);
    return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const transactionId = searchParams.get('transactionId');

    if (!userId || !transactionId) {
      return NextResponse.json({ error: 'UserId and transactionId are required' }, { status: 400 });
    }

    await connectDB();
    await Transaction.findOneAndDelete({ _id: transactionId, userId });
    
    return NextResponse.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    return NextResponse.json({ error: 'Failed to delete transaction' }, { status: 500 });
  }
} 