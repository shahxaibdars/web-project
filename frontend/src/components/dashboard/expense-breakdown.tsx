"use client"

import { useState, useEffect } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { getTransactionStats } from "@/services/transactionService"
import { getCurrentUser } from "@/services/authService"
import { categoryColors } from "@/services/transactionService"
import { formatCurrency } from "@/lib/utils"

interface ExpenseData {
  name: string
  value: number
  color: string
}

export function ExpenseBreakdown() {
  const [data, setData] = useState<ExpenseData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const user = getCurrentUser()
      if (user) {
        try {
          const stats = await getTransactionStats(user._id)
          // Convert category summary to chart data
          const chartData = Object.entries(stats.categorySummary)
            .map(([category, amount]) => ({
              name: category,
              value: amount,
              color: categoryColors[category] || "#64748B",
            }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 5) // Top 5 categories

          setData(chartData)
        } catch (error) {
          console.error("Error fetching expense data:", error)
        } finally {
          setIsLoading(false)
        }
      }
    }

    fetchData()
  }, [])

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-charcoal p-2 rounded-md border border-emerald/20 text-xs">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-emerald">{formatCurrency(payload[0].value)}</p>
        </div>
      )
    }
    return null
  }

  if (isLoading) {
    return (
      <div className="glass-card rounded-xl p-6 h-[300px] flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading expense data...</div>
      </div>
    )
  }

  return (
    <div className="glass-card rounded-xl p-6">
      <h3 className="text-lg font-medium mb-4">Expense Breakdown</h3>
      {data.length > 0 ? (
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
                label={({ name, percent }: any) => `${name} (${(percent * 100).toFixed(0)}%)`}
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-[250px] flex items-center justify-center text-muted-foreground">
          No expense data available
        </div>
      )}
    </div>
  )
}
