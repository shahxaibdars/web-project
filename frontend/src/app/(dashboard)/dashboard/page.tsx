"use client"

import { useState, useEffect } from "react"
import { ArrowUpRight, ArrowDownRight, Percent, Receipt } from "lucide-react"
import type { DashboardStats } from "@/types"
import { formatCurrency, formatPercentage } from "@/lib/utils"
import { getDashboardStats } from "@/services/dashboardService"
import { getCurrentUser } from "@/services/authService"
import { StatCard } from "@/components/dashboard/stat-card"
import { RecentTransactions } from "@/components/dashboard/recent-transactions"
import { UpcomingBills } from "@/components/dashboard/upcoming-bills"
import { SavingsProgress } from "@/components/dashboard/savings-progress"
import { ExpenseBreakdown } from "@/components/dashboard/expense-breakdown"

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      const user = getCurrentUser()
      if (user) {
        try {
          const data = await getDashboardStats(user.id)
          setStats(data)
        } catch (error) {
          console.error("Error fetching dashboard stats:", error)
        } finally {
          setIsLoading(false)
        }
      }
    }

    fetchStats()
  }, [])

  if (isLoading) {
    return (
      <div className="h-[400px] flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats && (
            <>
              <StatCard
                title="Total Income"
                value={formatCurrency(stats.totalIncome)}
                description="Current month"
                icon={ArrowUpRight}
                trend={{ value: 12, isPositive: true }}
              />
              <StatCard
                title="Total Expenses"
                value={formatCurrency(stats.totalExpense)}
                description="Current month"
                icon={ArrowDownRight}
                trend={{ value: 8, isPositive: false }}
              />
              <StatCard
                title="Savings Rate"
                value={formatPercentage(stats.savingsRate)}
                description="Of total income"
                icon={Percent}
                trend={{ value: 5, isPositive: true }}
              />
              <StatCard
                title="Upcoming Bills"
                value={stats.upcomingBills}
                description="Due in the next 7 days"
                icon={Receipt}
              />
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentTransactions />
        <UpcomingBills />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ExpenseBreakdown />
        <SavingsProgress />
      </div>
    </div>
  )
}
