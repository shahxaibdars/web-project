import type { LoanApplication } from "../types"


// Get loan applications for a user
export const getLoanApplications = async (userId: string): Promise<LoanApplication[]> => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }

  try {
    const response = await fetch(`/api/loan-applications`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Loan applications fetch error:', errorData);
      throw new Error(errorData.message || 'Failed to fetch loan applications');
    }

    const data = await response.json();
    console.log('Loan applications response:', data);
    return data;
  } catch (error) {
    console.error('Error in getLoanApplications:', error);
    throw error;
  }
}
// Apply for a new loan
export const applyForLoan = async (userId: string, amount: number, purpose: string): Promise<LoanApplication> => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }

  const tax = amount * 0.05; // 5% tax

  const response = await fetch(`/api/loan-applications`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user: userId, amount, tax, purpose }),
  });

  if (!response.ok) {
    throw new Error('Failed to apply for loan');
  }

  const data = await response.json();
  return data.loan;
}

// Get pending loans count
export const getPendingLoansCount = async (userId: string): Promise<number> => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }

  const response = await fetch(`/api/loans/pending/${userId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch pending loans count');
  }

  const data = await response.json();
  return data.pendingLoansCount;
}

// Delete loan application
export const deleteLoan = async (loanId: string): Promise<void> => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }

  const response = await fetch(`/api/loan-applications/${loanId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete loan application');
  }
}

// Update loan application
export const updateLoan = async (loanId: string, updates: { amount?: number; purpose?: string }): Promise<LoanApplication> => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }

  const response = await fetch(`/api/loan-applications/${loanId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    throw new Error('Failed to update loan application');
  }

  const data = await response.json();
  return data.loan;
}
