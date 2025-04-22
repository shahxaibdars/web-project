"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { Budget, BudgetCategory } from "@/types"
import { formatCurrency, getMonthName, calculatePercentage } from "@/lib/utils"
import { getBudget } from "@/services/budgetService"
import { getCurrentUser } from "@/services/authService"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { BudgetForm } from "./budget-form"

export function BudgetOverview() {
  const [budget, setBudget] = useState<Budget | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())

  const fetchBudget = async () => {
    setIsLoading(true)
    const user = getCurrentUser()
    if (user) {
      try {
        const data = await getBudget(user._id, currentMonth, currentYear)
        setBudget(data)
      } catch (error) {
        console.error("Error fetching budget:", error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  useEffect(() => {
    fetchBudget()
  }, [currentMonth, currentYear])

  const handlePreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  const getBudgetStatus = (category: BudgetCategory) => {
    const percentage = calculatePercentage(category.spent, category.limit)

    if (percentage >= 100) {
      return "text-destructive"
    } else if (percentage >= 80) {
      return "text-amber-500"
    } else {
      return "text-emerald"
    }
  }

  const getProgressColor = (category: BudgetCategory) => {
    const percentage = calculatePercentage(category.spent, category.limit)

    if (percentage >= 100) {
      return "bg-destructive"
    } else if (percentage >= 80) {
      return "bg-amber-500"
    } else {
      return "bg-emerald"
    }
  }

  if (isLoading) {
    return (
      <div className="glass-card rounded-xl p-6 h-[400px] flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading budget data...</div>
      </div>
    )
  }

  return (
    <div className="glass-card rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Budget Overview</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handlePreviousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium min-w-[120px] text-center">
            {getMonthName(currentMonth)} {currentYear}
          </span>
          <Button variant="outline" size="icon" onClick={handleNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {budget && budget.categories.length > 0 ? (
          budget.categories.map((category) => (
            <div key={category.category} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-medium">{category.category}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-medium ${getBudgetStatus(category)}`}>
                    {formatCurrency(category.spent)} / {formatCurrency(category.limit)}
                  </span>
                  <BudgetForm
                    month={currentMonth}
                    year={currentYear}
                    existingCategory={category}
                    onSuccess={fetchBudget}
                    hasTransactions={budget.categories.some(cat => cat.spent > 0)}
                  />
                </div>
              </div>
              <Progress
                value={calculatePercentage(category.spent, category.limit)}
                className="h-2"
                indicatorClassName={getProgressColor(category)}
              />
              <div className="flex justify-between items-center text-xs">
                <span className={getBudgetStatus(category)}>
                  {calculatePercentage(category.spent, category.limit).toFixed(0)}%
                </span>
                <span className="text-muted-foreground">
                  {category.spent > category.limit
                    ? `${formatCurrency(category.spent - category.limit)} over budget`
                    : `${formatCurrency(category.limit - category.spent)} remaining`}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">No budget categories set for this month</p>
            <BudgetForm
              month={currentMonth}
              year={currentYear}
              onSuccess={fetchBudget}
              hasTransactions={false}
            />
          </div>
        )}
      </div>
    </div>
  )
}
