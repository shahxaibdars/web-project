"use client"

import { useState, useEffect } from "react"
import type { SavingsGoal } from "@/types"
import { formatCurrency, calculatePercentage } from "@/lib/utils"
import { getSavingsGoals } from "@/services/savingsService"
import { getCurrentUser } from "@/services/authService"
import { Progress } from "@/components/ui/progress"

interface SavingsProgressProps {
  refreshTrigger?: number
}

export function SavingsProgress({ refreshTrigger = 0 }: SavingsProgressProps) {
  const [goals, setGoals] = useState<SavingsGoal[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchGoals = async () => {
      setIsLoading(true)
      try {
        const user = await getCurrentUser()
        if (user) {
          const data = await getSavingsGoals(user.id)
          setGoals(data)
        }
      } catch (error) {
        console.error("Error fetching savings goals:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchGoals()
  }, [])

  if (isLoading) {
    return (
      <div className="glass-card rounded-xl p-6 h-[300px] flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading savings goals...</div>
      </div>
    )
  }

  return (
    <div className="glass-card rounded-xl p-6">
      <h3 className="text-lg font-medium mb-4">Savings Goals</h3>
      <div className="space-y-6">
        {goals.length > 0 ? (
          goals.map((goal) => {
            const percentage = calculatePercentage(goal.currentAmount, goal.targetAmount)

            return (
              <div key={goal.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-medium">{goal.name}</h4>
                  <span className="text-xs text-muted-foreground">
                    {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
                  </span>
                </div>
                <Progress value={percentage} className="h-2" />
                <div className="flex justify-between items-center text-xs">
                  <span className="text-emerald">{percentage.toFixed(0)}%</span>
                  <span className="text-muted-foreground">
                    {formatCurrency(goal.targetAmount - goal.currentAmount)} to go
                  </span>
                </div>
              </div>
            )
          })
        ) : (
          <div className="text-center py-4 text-muted-foreground">No savings goals</div>
        )}
      </div>
    </div>
  )
}
