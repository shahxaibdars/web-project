import type { Bill } from '../types';

// Get bills for a user
export const getBills = async (userId: string): Promise<Bill[]> => {
  try {
    const response = await fetch(`/api/bills?userId=${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch bills');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching bills:', error);
    throw error;
  }
};

// Add a new bill
export const addBill = async (bill: Omit<Bill, 'id'>): Promise<Bill> => {
  try {
    const response = await fetch('/api/bills', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bill),
    });

    if (!response.ok) {
      throw new Error('Failed to add bill');
    }

    return await response.json();
  } catch (error) {
    console.error('Error adding bill:', error);
    throw error;
  }
};

// Update a bill
export const updateBill = async (bill: Bill): Promise<Bill> => {
  try {
    const response = await fetch('/api/bills', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bill),
    });

    if (!response.ok) {
      throw new Error('Failed to update bill');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating bill:', error);
    throw error;
  }
};

// Delete a bill
export const deleteBill = async (userId: string, billId: string): Promise<void> => {
  try {
    const response = await fetch(`/api/bills?userId=${userId}&billId=${billId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete bill');
    }
  } catch (error) {
    console.error('Error deleting bill:', error);
    throw error;
  }
};

// Get upcoming bills
export const getUpcomingBills = async (userId: string, days = 7): Promise<Bill[]> => {
  try {
    const response = await fetch(`/api/bills?userId=${userId}&days=${days}`);
    if (!response.ok) {
      throw new Error('Failed to fetch upcoming bills');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching upcoming bills:', error);
    throw error;
  }
};
