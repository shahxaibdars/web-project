import type { LoanApplication } from "../types"

// Dummy data for loan applications
const dummyApplications: LoanApplication[] = [
  {
    _id: "1",
    userId: "user1",
    userName: "John Doe",
    amount: 5000,
    purpose: "Home Renovation",
    status: "pending",
    tax: 250, // 5% of 5000
    createdAt: new Date("2024-04-18"),
  },
  {
    _id: "2",
    userId: "user2",
    userName: "Jane Smith",
    amount: 10000,
    purpose: "Business Expansion",
    status: "pending",
    tax: 500, // 5% of 10000
    createdAt: new Date("2024-04-17"),
  },
]

// Get all loan applications
export const getLoanApplications = async (): Promise<LoanApplication[]> => {
  try {
    const response = await fetch('/api/loans', {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch loan applications');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching loan applications:', error);
    throw error;
  }
}

// Get a specific loan application
export const getLoanApplication = async (id: string): Promise<LoanApplication | null> => {
  try {
    const response = await fetch(`/api/loans?id=${encodeURIComponent(id)}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch loan application');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching loan application:', error);
    throw error;
  }
}

// Update loan application status
export const updateLoanStatus = async (
  id: string,
  status: "approved" | "rejected"
): Promise<void> => {
  try {
    const response = await fetch(`/api/loans/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update loan status');
    }
  } catch (error) {
    console.error('Error updating loan status:', error);
    throw error;
  }
}

// Calculate tax for a loan
export const calculateTax = async (amount: number): Promise<{
  principal: number
  taxRate: number
  taxAmount: number
  netAmount: number
}> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const taxRate = 0.05 // 5% tax rate
      const taxAmount = amount * taxRate
      const netAmount = amount - taxAmount

      resolve({
        principal: amount,
        taxRate,
        taxAmount,
        netAmount,
      })
    }, 500)
  })
}

export const deleteLoanApplication = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`/api/loans?id=${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete loan application');
    }
  } catch (error) {
    console.error('Error deleting loan application:', error);
    throw error;
  }
}; 