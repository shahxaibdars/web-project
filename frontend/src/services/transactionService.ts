import type { Transaction } from "../types"

// Categories for transactions
export const categories = [
  'salary',
  'freelance',
  'investment',
  'gift',
  'food',
  'transportation',
  'housing',
  'utilities',
  'entertainment',
  'shopping',
  'healthcare',
  'education',
  'other'
] as const

export type Category = typeof categories[number]

// Category colors for charts
export const categoryColors: Record<string, string> = {
  'salary': "#10B981",
  'freelance': "#3B82F6",
  'investment': "#F59E0B",
  'gift': "#8B5CF6",
  'food': "#EC4899",
  'transportation': "#EF4444",
  'housing': "#06B6D4",
  'utilities': "#F97316",
  'entertainment': "#6366F1",
  'shopping': "#DC2626",
  'healthcare': "#0EA5E9",
  'education': "#D946EF",
  'other': "#64748B"
}

interface SummaryItem {
  _id: string;
  total: number;
  category?: string;
}

// Get all transactions
export const getTransactions = async (
  userId: string,
  page = 1,
  limit = 10,
  filters?: {
    type?: string
    category?: string
    startDate?: string
    endDate?: string
    month?: number
    year?: number
  }
): Promise<{ transactions: Transaction[]; totalPages: number; currentPage: number }> => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }

  let url = `/api/transactions?userId=${userId}&page=${page}&limit=${limit}`;
  if (filters?.type) url += `&type=${filters.type}`;
  if (filters?.category) url += `&category=${filters.category}`;
  if (filters?.startDate) url += `&startDate=${filters.startDate}`;
  if (filters?.endDate) url += `&endDate=${filters.endDate}`;
  if (filters?.month !== undefined) url += `&month=${filters.month}`;
  if (filters?.year !== undefined) url += `&year=${filters.year}`;

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch transactions');
  }

  return response.json();
}

// Get transaction by id
export const getTransaction = async (id: string): Promise<Transaction> => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }

  const response = await fetch(`/api/transactions/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch transaction');
  }

  return response.json();
}

// Add transaction
export const addTransaction = async (transaction: Omit<Transaction, '_id'>): Promise<Transaction> => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }

  const response = await fetch('/api/transactions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(transaction),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to add transaction');
  }

  return response.json();
}

// Update transaction
export const updateTransaction = async (id: string, updates: Partial<Transaction>): Promise<Transaction> => {
  const token = localStorage.getItem('token')
  if (!token) {
    throw new Error('No authentication token found')
  }

  try {
    const response = await fetch(`/api/transactions/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to update transaction')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error updating transaction:', error)
    throw error
  }
}

// Delete transaction
export const deleteTransaction = async (id: string): Promise<void> => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }

  const response = await fetch(`/api/transactions/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete transaction');
  }
}

// Get transaction summary
export const getTransactionSummary = async (
  userId: string,
  startDate?: string,
  endDate?: string
): Promise<{ type: string; total: number; count: number }[]> => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }

  let url = `/api/transactions/summary/overview?userId=${userId}`;
  if (startDate) url += `&startDate=${startDate}`;
  if (endDate) url += `&endDate=${endDate}`;

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch transaction summary');
  }

  return response.json();
}

// Get transaction statistics
export const getTransactionStats = async (
  userId: string,
  month?: number,
  year?: number
): Promise<{
  totalIncome: number
  totalExpense: number
  netSavings: number
  categorySummary: Record<string, number>
}> => {
  const token = localStorage.getItem('token')
  if (!token) {
    throw new Error('No authentication token found')
  }

  let url = `/api/transactions/summary/overview?userId=${userId}`
  if (month !== undefined) url += `&month=${month}`
  if (year !== undefined) url += `&year=${year}`

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch transaction statistics')
  }

  const summary: SummaryItem[] = await response.json()
  
  // Transform the backend response to match the expected format
  const totalIncome = summary.find((s: SummaryItem) => s._id === 'income')?.total || 0
  const totalExpense = summary.find((s: SummaryItem) => s._id === 'expense')?.total || 0
  
  const categorySummary: Record<string, number> = {}
  summary.forEach((s: SummaryItem) => {
    if (s._id === 'expense') {
      categorySummary[s.category || ''] = s.total
    }
  })

  return {
    totalIncome,
    totalExpense,
    netSavings: totalIncome - totalExpense,
    categorySummary,
  }
}
