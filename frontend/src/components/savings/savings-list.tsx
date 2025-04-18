"use client"

import { useState, useEffect } from "react"
import { PiggyBank, Plus } from "lucide-react"
import type { SavingsGoal } from "@/types"
import { formatCurrency, calculatePercentage } from "@/lib/utils"
import { getSavingsGoals, deleteSavingsGoal, updateSavingsAmount } from "@/services/savingsService"
import { getCurrentUser } from "@/services/authService"
import { Button } from "@/components/ui/button"
import { SavingsForm } from "./savings-form"
import { Progress } from "@/components/ui/progress"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

interface SavingsListProps {
  refreshTrigger?: number
}

export function SavingsList({ refreshTrigger = 0 }: SavingsListProps) {
  const [goals, setGoals] = useState<SavingsGoal[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [goalToDelete, setGoalToDelete] = useState<string | null>(null)
  const [contributionAmount, setContributionAmount] = useState<number>(0)
  const [contributingGoalId, setContributingGoalId] = useState<string | null>(null)

  const fetchGoals = async () => {
    setIsLoading(true)
    const user = getCurrentUser()
    if (user) {
      try {
        const data = await getSavingsGoals(user.id)
        setGoals(data)
      } catch (error) {
        console.error("Error fetching savings goals:", error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  useEffect(() => {
    fetchGoals()
  }, [refreshTrigger])

  const handleDelete = async () => {
    if (!goalToDelete) return

    const user = getCurrentUser()
    if (!user) return

    try {
      await deleteSavingsGoal(user.id, goalToDelete)
      setGoals((prev) => prev.filter((g) => g.id !== goalToDelete))
      setGoalToDelete(null)
    } catch (error) {
      console.error("Error deleting savings goal:", error)
    }
  }

  const handleContribute = async () => {
    if (!contributingGoalId || contributionAmount <= 0) return

    const user = getCurrentUser()
    if (!user) return

    try {
      const updatedGoal = await updateSavingsAmount(user.id, contributingGoalId, contributionAmount)

      setGoals((prev) => prev.map((goal) => (goal.id === updatedGoal.id ? updatedGoal : goal)))

      setContributingGoalId(null)
      setContributionAmount(0)
    } catch (error) {
      console.error("Error contributing to savings goal:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="glass-card rounded-xl p-6 h-[400px] flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading savings goals...</div>
      </div>
    )
  }

  return (
    <div>
      <div className="grid grid-dashboard">
        {goals.length > 0 ? (
          goals.map((goal) => {
            const percentage = calculatePercentage(goal.currentAmount, goal.targetAmount)

            return (
              <Card key={goal.id} className="glass-card border-emerald/20">
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
                <CardFooter className="flex justify-between">
                  <div className="flex gap-2">
                    <SavingsForm existingGoal={goal} onSuccess={fetchGoals} />
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setContributingGoalId(goal.id)}>
                          <Plus className="h-4 w-4 mr-1" /> Contribute
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Contribute to {goal.name}</DialogTitle>
                          <DialogDescription>Enter the amount you want to add to your savings goal.</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <label htmlFor="amount" className="text-sm font-medium">
                              Amount
                            </label>
                            <Input
                              id="amount"
                              type="number"
                              placeholder="0.00"
                              step="0.01"
                              min="0"
                              value={contributionAmount || ""}
                              onChange={(e: any) => setContributionAmount(Number.parseFloat(e.target.value) || 0)}
                            />
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Current progress: {formatCurrency(goal.currentAmount)} of{" "}
                            {formatCurrency(goal.targetAmount)}
                          </div>
                        </div>
                        <DialogFooter>
                          <Button onClick={handleContribute}>Add Contribution</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm" onClick={() => setGoalToDelete(goal.id)}>
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Savings Goal</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this savings goal? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setGoalToDelete(null)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardFooter>
              </Card>
            )
          })
        ) : (
          <div className="col-span-full text-center py-12 glass-card rounded-xl">
            <p className="text-muted-foreground mb-4">No savings goals found</p>
            <SavingsForm onSuccess={fetchGoals} />
          </div>
        )}
      </div>
    </div>
  )
}
