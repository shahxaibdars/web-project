"use client"

import { useState, useEffect } from "react"
import type { Budget, BudgetCategory, Transaction } from "@/types"
import { formatCurrency, calculatePercentage } from "@/lib/utils"
import { getBudget } from "@/services/budgetService"
import { getCurrentUser } from "@/services/authService"
import { Progress } from "@/components/ui/progress"

export function BudgetCategories() {
  const [budget, setBudget] = useState<Budget | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchBudget = async () => {
    const user = getCurrentUser()
    if (!user) return

    try {
      const currentDate = new Date()
      const data = await getBudget(user._id, currentDate.getMonth(), currentDate.getFullYear())
      setBudget(data)
    } catch (error) {
      console.error("Error fetching budget:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchBudget()
  }, [])

  if (isLoading) {
    return (
      <div className="glass-card rounded-xl p-6 h-[300px] flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading budget categories...</div>
      </div>
    )
  }

  if (!budget?.categories?.length) {
    return (
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-lg font-medium mb-4">Budget Categories</h3>
        <p className="text-muted-foreground">No budget categories set for this month.</p>
      </div>
    )
  }

  return (
    <div className="glass-card rounded-xl p-6">
      <h3 className="text-lg font-medium mb-4">Budget Categories</h3>
      <div className="space-y-4">
        {budget.categories.map((category) => {
          const percentage = calculatePercentage(category.spent, category.limit)
          const progressColor = percentage >= 100 ? "bg-destructive" : percentage >= 80 ? "bg-amber-500" : "bg-emerald"

          return (
            <div key={category.category} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-medium capitalize">{category.category}</h4>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {formatCurrency(category.spent)} / {formatCurrency(category.limit)}
                  </span>
                </div>
              </div>
              <Progress
                value={percentage}
                className="h-2"
                indicatorClassName={progressColor}
              />
              <div className="flex justify-between items-center text-xs">
                <span className={percentage >= 100 ? "text-destructive" : percentage >= 80 ? "text-amber-500" : "text-emerald"}>
                  {percentage.toFixed(0)}%
                </span>
                <span className="text-muted-foreground">
                  {category.spent > category.limit
                    ? `${formatCurrency(category.spent - category.limit)} over budget`
                    : `${formatCurrency(category.limit - category.spent)} remaining`}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
} 