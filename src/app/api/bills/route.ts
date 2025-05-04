import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Bill } from '@/models/Bill';

interface BillQuery {
  userId: string;
  dueDate?: {
    $gte: Date;
    $lte: Date;
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const days = searchParams.get('days');

    if (!userId) {
      return NextResponse.json({ error: 'UserId is required' }, { status: 400 });
    }

    await connectDB();
    let query: BillQuery = { userId };

    if (days) {
      const currentDate = new Date();
      const futureDate = new Date();
      futureDate.setDate(currentDate.getDate() + parseInt(days));
      
      query = {
        ...query,
        dueDate: {
          $gte: currentDate,
          $lte: futureDate
        }
      };
    }

    const bills = await Bill.find(query).sort({ dueDate: 1 });
    
    // Format the response to ensure dates are properly converted
    const formattedBills = bills.map(bill => ({
      id: bill._id.toString(),
      userId: bill.userId,
      name: bill.name,
      dueDate: new Date(bill.dueDate),
      amount: bill.amount,
      isRecurring: bill.isRecurring
    }));

    return NextResponse.json(formattedBills);
  } catch (error) {
    console.error('Error fetching bills:', error);
    return NextResponse.json({ error: 'Failed to fetch bills' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, name, dueDate, amount, isRecurring } = body;

    if (!userId || !name || !dueDate || !amount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectDB();
    const bill = new Bill({
      userId,
      name,
      dueDate: new Date(dueDate),
      amount,
      isRecurring: isRecurring ?? true,
    });
    
    await bill.save();
    
    // Format the response to ensure dates are properly converted
    return NextResponse.json({
      id: bill._id.toString(),
      userId: bill.userId,
      name: bill.name,
      dueDate: new Date(bill.dueDate),
      amount: bill.amount,
      isRecurring: bill.isRecurring
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating bill:', error);
    return NextResponse.json({ error: 'Failed to create bill' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, userId, name, dueDate, amount, isRecurring } = body;

    if (!id || !userId || !name || !dueDate || !amount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectDB();
    const updatedBill = await Bill.findOneAndUpdate(
      { _id: id, userId },
      { 
        name, 
        dueDate: new Date(dueDate), 
        amount, 
        isRecurring: isRecurring ?? true 
      },
      { new: true }
    );

    if (!updatedBill) {
      return NextResponse.json({ error: 'Bill not found' }, { status: 404 });
    }

    // Format the response to ensure dates are properly converted
    return NextResponse.json({
      id: updatedBill._id.toString(),
      userId: updatedBill.userId,
      name: updatedBill.name,
      dueDate: new Date(updatedBill.dueDate),
      amount: updatedBill.amount,
      isRecurring: updatedBill.isRecurring
    });
  } catch (error) {
    console.error('Error updating bill:', error);
    return NextResponse.json({ error: 'Failed to update bill' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const billId = searchParams.get('billId');

    if (!userId || !billId) {
      return NextResponse.json({ error: 'UserId and billId are required' }, { status: 400 });
    }

    await connectDB();
    await Bill.findOneAndDelete({ _id: billId, userId });
    
    return NextResponse.json({ message: 'Bill deleted successfully' });
  } catch (error) {
    console.error('Error deleting bill:', error);
    return NextResponse.json({ error: 'Failed to delete bill' }, { status: 500 });
  }
} 