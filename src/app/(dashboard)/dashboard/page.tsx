"use client"

import { useState, useEffect } from "react"
import { ArrowUpRight, ArrowDownRight, Receipt } from "lucide-react"
import type { DashboardStats } from "@/types"
import { formatCurrency } from "@/lib/utils"
import { getDashboardStats } from "@/services/dashboardService"
import { getCurrentUser } from "@/services/authService"
import { StatCard } from "@/components/dashboard/stat-card"
import { RecentTransactions } from "@/components/dashboard/recent-transactions"
import { UpcomingBills } from "@/components/dashboard/upcoming-bills"
import { SavingsProgress } from "@/components/dashboard/savings-progress"
import { ExpenseBreakdown } from "@/components/dashboard/expense-breakdown"
import { useRefresh } from "@/contexts/refresh-context"

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { refreshTrigger } = useRefresh()

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const user = await getCurrentUser()
        if (user) {
          const data = await getDashboardStats(user.id)
          setStats(data)
        }
      } catch (error) {
        console.error("Error fetching dashboard stats:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [refreshTrigger])

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats && (
            <>
              <StatCard
                title="Total Income"
                value={formatCurrency(stats.totalIncome)}
                description="Current month"
                icon={ArrowUpRight}
              />
              <StatCard
                title="Total Expenses"
                value={formatCurrency(stats.totalExpenses)}
                description="Current month"
                icon={ArrowDownRight}
              />
              <StatCard
                title="Balance"
                value={formatCurrency(stats.balance)}
                description="Current month"
                icon={Receipt}
              />
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentTransactions refreshTrigger={refreshTrigger} />
        <UpcomingBills refreshTrigger={refreshTrigger} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ExpenseBreakdown refreshTrigger={refreshTrigger} />
        <SavingsProgress refreshTrigger={refreshTrigger} />
      </div>
    </div>
  )
}
