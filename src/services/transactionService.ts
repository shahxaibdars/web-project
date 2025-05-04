import { Transaction } from '@/models/Transaction';
import connectDB from '@/lib/mongodb';
import type { Transaction as TransactionType } from '../types';

// Categories for transactions
export const categories = [
  "Housing",
  "Transportation",
  "Food",
  "Utilities",
  "Insurance",
  "Healthcare",
  "Savings",
  "Personal",
  "Entertainment",
  "Debt",
  "Education",
  "Gifts",
  "Income",
  "Investments",
  "Other",
]

// Category colors for charts
export const categoryColors: Record<string, string> = {
  Housing: "#10B981",
  Transportation: "#3B82F6",
  Food: "#F59E0B",
  Utilities: "#8B5CF6",
  Insurance: "#EC4899",
  Healthcare: "#EF4444",
  Savings: "#06B6D4",
  Personal: "#F97316",
  Entertainment: "#6366F1",
  Debt: "#DC2626",
  Education: "#0EA5E9",
  Gifts: "#D946EF",
  Income: "#22C55E",
  Investments: "#14B8A6",
  Other: "#64748B",
}

// Generate dummy transactions
const generateDummyTransactions = (userId: string): TransactionType[] => {
  const transactions: TransactionType[] = []
  const currentDate = new Date()

  // Generate transactions for the last 3 months
  for (let i = 0; i < 50; i++) {
    const date = new Date(currentDate)
    date.setDate(date.getDate() - Math.floor(Math.random() * 90)) // Random date in the last 90 days

    const type = Math.random() > 0.3 ? "expense" : "income"
    const category = type === "income" ? "Income" : categories[Math.floor(Math.random() * (categories.length - 1))]

    const amount = type === "income" ? Math.floor(Math.random() * 3000) + 1000 : Math.floor(Math.random() * 500) + 10

    transactions.push({
      id: `trans-${i}`,
      userId,
      amount,
      category,
      date,
      description: `${type === "income" ? "Received" : "Paid for"} ${category.toLowerCase()}`,
      type,
    })
  }

  return transactions.sort((a, b) => b.date.getTime() - a.date.getTime())
}

// Dummy transactions store
const dummyTransactions: Record<string, TransactionType[]> = {}

// Get transactions for a user
export const getTransactions = async (userId: string): Promise<TransactionType[]> => {
  try {
    const response = await fetch(`/api/transactions?userId=${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch transactions');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
};

// Add a new transaction
export const addTransaction = async (transaction: Omit<TransactionType, 'id'>): Promise<TransactionType> => {
  try {
    const response = await fetch('/api/transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transaction),
    });

    if (!response.ok) {
      throw new Error('Failed to add transaction');
    }

    return await response.json();
  } catch (error) {
    console.error('Error adding transaction:', error);
    throw error;
  }
};

// Delete a transaction
export const deleteTransaction = async (userId: string, transactionId: string): Promise<void> => {
  try {
    const response = await fetch(`/api/transactions?userId=${userId}&transactionId=${transactionId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete transaction');
    }
  } catch (error) {
    console.error('Error deleting transaction:', error);
    throw error;
  }
};

// Get transaction statistics
export const getTransactionStats = async (
  userId: string,
): Promise<{
  totalIncome: number;
  totalExpense: number;
  netSavings: number;
  categorySummary: Record<string, number>;
}> => {
  try {
    const transactions = await getTransactions(userId);

    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const categorySummary: Record<string, number> = {};

    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        if (!categorySummary[t.category]) {
          categorySummary[t.category] = 0;
        }
        categorySummary[t.category] += t.amount;
      });

    return {
      totalIncome,
      totalExpense,
      netSavings: totalIncome - totalExpense,
      categorySummary,
    };
  } catch (error) {
    console.error('Error fetching transaction stats:', error);
    throw error;
  }
};
