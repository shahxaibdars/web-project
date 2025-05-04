import type { LoanApplication } from "../types"

// Get loan applications for a user
export const getLoanApplications = async (userId: string): Promise<LoanApplication[]> => {
  try {
    const url = userId === 'all' ? '/api/loans' : `/api/loans?userId=${userId}`;
    const response = await fetch(url, {
      credentials: 'include'
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
};

// Apply for a new loan
export const applyForLoan = async (
  userId: string, 
  amount: number,
  purpose: string
): Promise<LoanApplication> => {
  try {
    const response = await fetch('/api/loans', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        userId,
        amount,
        purpose,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to apply for loan');
    }

    return await response.json();
  } catch (error) {
    console.error('Error applying for loan:', error);
    throw error;
  }
};

// Get pending loans count
export const getPendingLoansCount = async (userId: string): Promise<number> => {
  try {
    const response = await fetch(`/api/loans/pending?userId=${userId}`, {
      credentials: 'include'
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch pending loans count');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching pending loans count:', error);
    throw error;
  }
};

// Delete a loan application
export const deleteLoanApplication = async (loanId: string): Promise<void> => {
  try {
    const response = await fetch(`/api/loans?id=${encodeURIComponent(loanId)}`, {
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
