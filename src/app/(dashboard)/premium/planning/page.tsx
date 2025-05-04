"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Calculator,
  Target,
  DollarSign,
  Home,
  GraduationCap,
  Clock,
  TrendingUp,
  AlertTriangle
} from "lucide-react"

interface FinancialGoal {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
  targetDate: string
  monthlyContribution: number
  progress: number
  type: "Retirement" | "Education" | "Home" | "Other"
  riskLevel: "Low" | "Medium" | "High"
}

const mockGoals: FinancialGoal[] = [
  {
    id: "1",
    name: "Retirement Fund",
    targetAmount: 1000000,
    currentAmount: 250000,
    targetDate: "2045-12-31",
    monthlyContribution: 2000,
    progress: 25,
    type: "Retirement",
    riskLevel: "Medium"
  },
  {
    id: "2",
    name: "College Fund",
    targetAmount: 100000,
    currentAmount: 25000,
    targetDate: "2030-12-31",
    monthlyContribution: 500,
    progress: 25,
    type: "Education",
    riskLevel: "Low"
  },
  {
    id: "3",
    name: "Down Payment",
    targetAmount: 100000,
    currentAmount: 50000,
    targetDate: "2025-12-31",
    monthlyContribution: 1000,
    progress: 50,
    type: "Home",
    riskLevel: "Low"
  }
]

export default function PremiumPlanningPage() {
  const [goals, setGoals] = useState<FinancialGoal[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedGoal, setSelectedGoal] = useState<FinancialGoal | null>(null)

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setGoals(mockGoals)
      setSelectedGoal(mockGoals[0])
      setLoading(false)
    }, 1000)
  }, [])

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low":
        return "bg-green-500"
      case "Medium":
        return "bg-yellow-500"
      case "High":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getGoalIcon = (type: string) => {
    switch (type) {
      case "Retirement":
        return <Clock className="h-5 w-5 text-blue-500" />
      case "Education":
        return <GraduationCap className="h-5 w-5 text-purple-500" />
      case "Home":
        return <Home className="h-5 w-5 text-green-500" />
      default:
        return <Target className="h-5 w-5 text-gray-500" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Financial Planning</h1>
        <Badge className="bg-purple-500">Premium Features</Badge>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            {goals.map((goal) => (
              <Card
                key={goal.id}
                className={`cursor-pointer transition-colors ${
                  selectedGoal?.id === goal.id
                    ? "border-blue-500"
                    : "hover:border-gray-400"
                }`}
                onClick={() => setSelectedGoal(goal)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getGoalIcon(goal.type)}
                      <CardTitle>{goal.name}</CardTitle>
                    </div>
                    <Badge className={getRiskColor(goal.riskLevel)}>
                      {goal.riskLevel} Risk
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Target Amount</p>
                        <p className="font-medium">
                          ${goal.targetAmount.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Current Amount</p>
                        <p className="font-medium">
                          ${goal.currentAmount.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Monthly Contribution</p>
                        <p className="font-medium">
                          ${goal.monthlyContribution.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Target Date</p>
                        <p className="font-medium">
                          {new Date(goal.targetDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-500">Progress</span>
                        <span className="text-sm font-medium">{goal.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full"
                          style={{ width: `${goal.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="space-y-6">
            {selectedGoal && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Goal Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Calculator className="h-5 w-5 text-blue-500" />
                          <span>Time to Goal</span>
                        </div>
                        <span className="font-medium">
                          {Math.ceil(
                            (new Date(selectedGoal.targetDate).getTime() - new Date().getTime()) /
                              (1000 * 60 * 60 * 24 * 30)
                          )}{" "}
                          months
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <DollarSign className="h-5 w-5 text-green-500" />
                          <span>Required Return</span>
                        </div>
                        <span className="font-medium">
                          {(
                            ((selectedGoal.targetAmount - selectedGoal.currentAmount) /
                              selectedGoal.monthlyContribution /
                              ((new Date(selectedGoal.targetDate).getTime() - new Date().getTime()) /
                                (1000 * 60 * 60 * 24 * 30))) *
                            100
                          ).toFixed(2)}
                          %
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <TrendingUp className="h-5 w-5 text-purple-500" />
                          <span>Projected Value</span>
                        </div>
                        <span className="font-medium">
                          $
                          {(
                            selectedGoal.currentAmount +
                            selectedGoal.monthlyContribution *
                              ((new Date(selectedGoal.targetDate).getTime() - new Date().getTime()) /
                                (1000 * 60 * 60 * 24 * 30))
                          ).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="h-5 w-5 text-yellow-500" />
                        <p className="text-sm text-gray-600">
                          Based on your current progress and target date, consider increasing your
                          monthly contribution to reach your goal faster.
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="h-5 w-5 text-green-500" />
                        <p className="text-sm text-gray-600">
                          Your current risk level is appropriate for your time horizon and goal type.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start">
                        <Calculator className="mr-2 h-4 w-4" />
                        Adjust Contributions
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Target className="mr-2 h-4 w-4" />
                        Set New Goal
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <TrendingUp className="mr-2 h-4 w-4" />
                        Investment Strategy
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <AlertTriangle className="mr-2 h-4 w-4" />
                        Risk Assessment
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
} 