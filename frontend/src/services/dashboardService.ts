import type { DashboardStats } from "../types"
import { getTransactionStats } from "./transactionService"
import { getBudgetSummary } from "./budgetService"
import { getUpcomingBills } from "./billService"
import { getPendingLoansCount } from "./loanService"

// Get dashboard statistics
export const getDashboardStats = async (userId: string): Promise<DashboardStats> => {
  return new Promise(async (resolve) => {
    // Get transaction stats
    const transactionStats = await getTransactionStats(userId)

    // Get budget summary
    const budgetSummary = await getBudgetSummary(userId)

    // Get upcoming bills
    const upcomingBills = await getUpcomingBills(userId)

    // Get pending loans count
    const pendingLoans = await getPendingLoansCount(userId)

    // Calculate savings rate
    const savingsRate =
      transactionStats.totalIncome > 0
        ? ((transactionStats.totalIncome - transactionStats.totalExpense) / transactionStats.totalIncome) * 100
        : 0

    resolve({
      totalIncome: transactionStats.totalIncome,
      totalExpense: transactionStats.totalExpense,
      savingsRate,
      upcomingBills: upcomingBills.length,
      pendingLoans,
    })
  })
}
