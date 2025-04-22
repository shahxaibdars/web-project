import type { Bill } from "../types"

// Get bills for a user
export const getBills = async (userId: string): Promise<Bill[]> => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }

  const response = await fetch(`http://localhost:5001/api/bills?userId=${userId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch bills');
  }

  const data = await response.json();
  return data.bills || data;
}

// Add a new bill
export const addBill = async (bill: Omit<Bill, "_id">): Promise<Bill> => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }

  const response = await fetch('http://localhost:5001/api/bills', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      ...bill,
      user: bill.userId,
    }),
  }); 

  if (!response.ok) {
    throw new Error('Failed to add bill');
  }

  const data = await response.json();
  return data.bill;
}

// Update a bill
export const updateBill = async (bill: Bill): Promise<Bill> => {

  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }

  const response = await fetch(`http://localhost:5001/api/bills/${bill._id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(bill),
  });

  if (!response.ok) {
    throw new Error('Failed to update bill');
  }

  const data = await response.json();
  return data.bill;
}

// Delete a bill
export const deleteBill = async (userId: string, billId: string): Promise<void> => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }

  const response = await fetch(`http://localhost:5001/api/bills/${billId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) { 
    throw new Error('Failed to delete bill');
  }
}

// Get upcoming bills
export const getUpcomingBills = async (userId: string, days = 7): Promise<Bill[]> => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }

  const response = await fetch(`http://localhost:5001/api/bills/upcoming?userId=${userId}&days=${days}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch upcoming bills');
  }

  const data = await response.json();
  return data.bills || [];
}