import type { Budget, BudgetCategory } from "../types"
import { categories } from "./transactionService"

// Get budget for a user
export const getBudget = async (userId: string, month?: number, year?: number): Promise<Budget> => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }

  const response = await fetch(`/api/budgets?userId=${userId}&month=${month}&year=${year}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch budget');
  }

  const data = await response.json();
  return data.budget;
}

// Get budget summary
export const getBudgetSummary = async (
  userId: string,
): Promise<{
  totalBudgeted: number
  totalSpent: number
  remainingBudget: number
  mostOverspentCategory?: string | null
  healthiestCategory?: string | null
}> => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }

  const response = await fetch(`/api/budgets/summary?userId=${userId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch budget summary');
  }

  const data = await response.json();
  return {
    totalBudgeted: data.totalBudgeted || 0,
    totalSpent: data.totalSpent || 0,
    remainingBudget: data.remainingBudget || 0,
    mostOverspentCategory: data.mostOverspentCategory || null,
    healthiestCategory: data.healthiestCategory || null
  };
}
