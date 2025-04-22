"use client"

import { useState, useEffect } from "react"
import type { SavingsGoal } from "@/types"
import { formatCurrency, calculatePercentage } from "@/lib/utils"
import { getSavingsGoals } from "@/services/savingsService"
import { getCurrentUser } from "@/services/authService"
import { Progress } from "@/components/ui/progress"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { PiggyBank } from "lucide-react"

export function SavingsProgress() {
  const [goals, setGoals] = useState<SavingsGoal[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchGoals = async () => {
      const user = getCurrentUser()
      if (user) {
        try {
          const data = await getSavingsGoals()
          // Sort by creation date and take only 2 most recent
          const recentGoals = data
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 2)
          setGoals(recentGoals)
        } catch (error) {
          console.error("Error fetching savings goals:", error)
        } finally {
          setIsLoading(false)
        }
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
              <Card key={goal._id} className="glass-card border-emerald/20">
                <CardHeader className="pb-2">
                  <CardTitle>{goal.name}</CardTitle>
                  <CardDescription>
                    {formatCurrency(goal.currentAmount)} of {formatCurrency(goal.targetAmount)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-full bg-emerald/20">
                      <PiggyBank className="h-4 w-4 text-emerald" />
                    </div>
                    <div className="text-sm text-muted-foreground">{percentage.toFixed(0)}% Complete</div>
                  </div>
                  <Progress value={percentage} className="h-2" />
                  <div className="text-sm text-muted-foreground">
                    {formatCurrency(goal.targetAmount - goal.currentAmount)} left to reach your goal
                  </div>
                </CardContent>
              </Card>
            )
          })
        ) : (
          <div className="text-center py-4 text-muted-foreground">No savings goals</div>
        )}
      </div>
    </div>
  )
}
