"use client"

import { useState, useEffect } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { getBudget } from "@/services/budgetService"
import { getCurrentUser } from "@/services/authService"
import { categoryColors } from "@/services/transactionService"
import { formatCurrency } from "@/lib/utils"

interface ExpenseData {
  name: string
  value: number
  color: string
  percentage: string
}

export function ExpenseBreakdown() {
  const [data, setData] = useState<ExpenseData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const user = getCurrentUser()
      if (user) {
        try {
          const currentDate = new Date()
          const budget = await getBudget(user._id, currentDate.getMonth(), currentDate.getFullYear())
          
          if (!budget || !budget.categories || budget.categories.length === 0) {
            setData([])
            return
          }

          // Filter categories with spent amount and sort by spent
          const categories = budget.categories
            .filter(cat => cat.spent > 0)
            .sort((a, b) => b.spent - a.spent)

          if (categories.length === 0) {
            setData([])
            return
          }

          // Get top 4 categories
          const topCategories = categories.slice(0, 4)
          
          // Calculate total spent
          const totalSpent = categories.reduce((sum, cat) => sum + cat.spent, 0)
          
          // Calculate other expenses
          const otherExpenses = categories.slice(4).reduce((sum, cat) => sum + cat.spent, 0)
          
          // Prepare data for pie chart
          const chartData = topCategories.map(cat => ({
            name: cat.category,
            value: cat.spent,
            color: categoryColors[cat.category] || "#64748B",
            percentage: ((cat.spent / totalSpent) * 100).toFixed(1)
          }))

          // Add "Other" category if there are remaining expenses
          if (otherExpenses > 0) {
            chartData.push({
              name: "Other",
              value: otherExpenses,
              color: "#64748B",
              percentage: ((otherExpenses / totalSpent) * 100).toFixed(1)
            })
          }

          setData(chartData)
        } catch (error) {
          console.error("Error fetching budget data:", error)
          setData([])
        } finally {
          setIsLoading(false)
        }
      }
    }

    fetchData()
  }, [])

  if (isLoading) {
    return (
      <div className="glass-card rounded-xl p-6 h-[300px] flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading expense data...</div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="glass-card rounded-xl p-6 h-[300px] flex items-center justify-center">
        <div className="text-muted-foreground">No expense data available</div>
      </div>
    )
  }

  return (
    <div className="glass-card rounded-xl p-6">
      <h3 className="text-lg font-medium mb-4">Expense Breakdown</h3>
      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              label={false}
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload as ExpenseData
                  return (
                    <div className="bg-charcoal p-2 rounded-md border border-emerald/20 text-xs">
                      <p className="font-medium">{data.name}</p>
                      <p className="text-emerald">{formatCurrency(data.value)}</p>
                      <p className="text-muted-foreground">{data.percentage}% of total</p>
                    </div>
                  )
                }
                return null
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
