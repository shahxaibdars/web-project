import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { Savings } from '@/models/Savings';
import connectDB from '@/lib/mongodb';

export async function GET(request: Request) {
  try {
    const token = request.headers.get('cookie')?.split('; ')
      .find(row => row.startsWith('token='))
      ?.split('=')[1];

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string; role: string };
    
    await connectDB();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId || userId !== decoded.userId) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }

    const savings = await Savings.find({ userId });
    const formattedSavings = savings.map(saving => ({
      id: saving._id.toString(),
      userId: saving.userId,
      name: saving.name,
      targetAmount: saving.targetAmount,
      currentAmount: saving.currentAmount
    }));
    
    return NextResponse.json(formattedSavings);
  } catch (error) {
    console.error('Error fetching savings goals:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
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

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string; role: string };
    
    await connectDB();

    const { userId, name, targetAmount } = await request.json();

    if (!userId || userId !== decoded.userId || !name || !targetAmount) {
      return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
    }

    const savings = new Savings({
      userId,
      name,
      targetAmount,
      currentAmount: 0,
    });

    await savings.save();
    
    return NextResponse.json({
      id: savings._id.toString(),
      userId: savings.userId,
      name: savings.name,
      targetAmount: savings.targetAmount,
      currentAmount: savings.currentAmount
    });
  } catch (error) {
    console.error('Error creating savings goal:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

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

    const { id, userId, ...updateData } = await request.json();

    if (!id || !userId || userId !== decoded.userId) {
      return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
    }

    const savings = await Savings.findOneAndUpdate(
      { _id: id, userId },
      updateData,
      { new: true }
    );

    if (!savings) {
      return NextResponse.json({ error: 'Savings goal not found' }, { status: 404 });
    }

    return NextResponse.json({
      id: savings._id.toString(),
      userId: savings.userId,
      name: savings.name,
      targetAmount: savings.targetAmount,
      currentAmount: savings.currentAmount
    });
  } catch (error) {
    console.error('Error updating savings goal:', error);
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

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string; role: string };
    
    await connectDB();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const goalId = searchParams.get('goalId');

    if (!userId || userId !== decoded.userId || !goalId) {
      return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
    }

    const savings = await Savings.findOneAndDelete({ _id: goalId, userId });

    if (!savings) {
      return NextResponse.json({ error: 'Savings goal not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      message: 'Savings goal deleted successfully',
      id: savings._id.toString()
    });
  } catch (error) {
    console.error('Error deleting savings goal:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 