import type { DashboardStats } from "@/types"
import { getTransactionStats } from "./transactionService"
import { getBudgetSummary } from "./budgetService"
import { getUpcomingBills } from "./billService"
import { getPendingLoansCount } from "./loanService"
import { getSavingsGoals } from "./savingsService"

// Get dashboard statistics
export const getDashboardStats = async (userId: string): Promise<DashboardStats> => {
  try {
    // Get current month's stats
    const currentDate = new Date()
    const currentStats = await getTransactionStats(userId, currentDate.getMonth(), currentDate.getFullYear())
    
    // Get last month's stats
    const lastMonth = new Date()
    lastMonth.setMonth(lastMonth.getMonth() - 1)
    const lastMonthStats = await getTransactionStats(userId, lastMonth.getMonth(), lastMonth.getFullYear())

    // Calculate percentage changes
    const incomeChange = lastMonthStats.totalIncome > 0 
      ? ((currentStats.totalIncome - lastMonthStats.totalIncome) / lastMonthStats.totalIncome) * 100 
      : 0

    const expenseChange = lastMonthStats.totalExpense > 0 
      ? ((currentStats.totalExpense - lastMonthStats.totalExpense) / lastMonthStats.totalExpense) * 100 
      : 0

    // Get upcoming bills
    const upcomingBills = await getUpcomingBills(userId, 7)

    // Get savings progress
    const savingsGoals = await getSavingsGoals()
    const totalSaved = savingsGoals.reduce((sum, goal) => sum + goal.currentAmount, 0)
    const totalTarget = savingsGoals.reduce((sum, goal) => sum + goal.targetAmount, 0)
    const savingsProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0

    return {
      totalIncome: currentStats.totalIncome,
      totalExpense: currentStats.totalExpense,
      incomeChange,
      expenseChange,
      savingsProgress,
      upcomingBills: upcomingBills.length
    }
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    throw error
  }
}
