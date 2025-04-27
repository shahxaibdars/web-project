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
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

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

  const getExpenseBreakdown = () => {
    if (!budget) return [];

    // Filter expense categories and sort by spent amount
    const expenseCategories = budget.categories
      .filter(cat => cat.spent > 0)
      .sort((a, b) => b.spent - a.spent);

    // Get top 4 expenses
    const topExpenses = expenseCategories.slice(0, 4);
    
    // Calculate total spent
    const totalSpent = expenseCategories.reduce((sum, cat) => sum + cat.spent, 0);
    
    // Calculate other expenses
    const otherExpenses = expenseCategories.slice(4).reduce((sum, cat) => sum + cat.spent, 0);
    
    // Prepare data for pie chart
    const data = topExpenses.map(cat => ({
      name: cat.category,
      value: cat.spent,
      percentage: ((cat.spent / totalSpent) * 100).toFixed(1)
    }));

    // Add "Other" category if there are remaining expenses
    if (otherExpenses > 0) {
      data.push({
        name: "Other",
        value: otherExpenses,
        percentage: ((otherExpenses / totalSpent) * 100).toFixed(1)
      });
    }

    return data;
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          {getMonthName(currentMonth)} {currentYear}
        </h2>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={handlePreviousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : budget ? (
        <div className="space-y-8">
          {/* Budget Categories */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Budget Categories</h3>
            {budget.categories.map((category) => (
              <div key={category.category} className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">{category.category}</span>
                  <span className={getBudgetStatus(category)}>
                    {formatCurrency(category.spent)} / {formatCurrency(category.limit)}
                  </span>
                </div>
                <Progress
                  value={calculatePercentage(category.spent, category.limit)}
                  className="h-2"
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>No budget data available</div>
      )}
    </div>
  )
}
