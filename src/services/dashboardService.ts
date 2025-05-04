import type { DashboardStats } from "../types"
import { getTransactionStats } from "./transactionService"
import { getUpcomingBills } from "./billService"
import { getPendingLoansCount } from "./loanService"

// Get dashboard statistics
export const getDashboardStats = async (userId: string): Promise<DashboardStats> => {
  try {
    const response = await fetch(`/api/dashboard?userId=${userId}`, {
      credentials: 'include'
    });
    if (!response.ok) {
      throw new Error('Failed to fetch dashboard stats');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};
