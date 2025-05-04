"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Calculator,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  FileText,
  BarChart,
  LineChart,
  PieChart
} from "lucide-react"

interface TaxScenario {
  id: string
  name: string
  description: string
  currentTax: number
  optimizedTax: number
  savings: number
  implementation: string
  risk: "Low" | "Medium" | "High"
  complexity: "Simple" | "Moderate" | "Complex"
}

const mockScenarios: TaxScenario[] = [
  {
    id: "1",
    name: "Tax-Loss Harvesting",
    description: "Sell investments at a loss to offset capital gains and reduce tax liability.",
    currentTax: 15000,
    optimizedTax: 10000,
    savings: 5000,
    implementation: "Sell underperforming investments and reinvest in similar but not identical securities.",
    risk: "Low",
    complexity: "Moderate"
  },
  {
    id: "2",
    name: "Roth Conversion",
    description: "Convert traditional IRA funds to Roth IRA to reduce future tax liability.",
    currentTax: 20000,
    optimizedTax: 15000,
    savings: 5000,
    implementation: "Convert a portion of traditional IRA to Roth IRA each year to stay in lower tax bracket.",
    risk: "Medium",
    complexity: "Complex"
  },
  {
    id: "3",
    name: "Charitable Giving",
    description: "Donate appreciated securities to charity to avoid capital gains tax.",
    currentTax: 10000,
    optimizedTax: 5000,
    savings: 5000,
    implementation: "Donate stocks with long-term gains directly to charity instead of cash.",
    risk: "Low",
    complexity: "Simple"
  }
]

export default function PremiumTaxPage() {
  const [scenarios, setScenarios] = useState<TaxScenario[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedScenario, setSelectedScenario] = useState<TaxScenario | null>(null)

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setScenarios(mockScenarios)
      setSelectedScenario(mockScenarios[0])
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

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "Simple":
        return "bg-green-500"
      case "Moderate":
        return "bg-yellow-500"
      case "Complex":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Tax Optimization</h1>
        <Badge className="bg-purple-500">Premium Features</Badge>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            {scenarios.map((scenario) => (
              <Card
                key={scenario.id}
                className={`cursor-pointer transition-colors ${
                  selectedScenario?.id === scenario.id
                    ? "border-blue-500"
                    : "hover:border-gray-400"
                }`}
                onClick={() => setSelectedScenario(scenario)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{scenario.name}</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge className={getRiskColor(scenario.risk)}>
                        {scenario.risk} Risk
                      </Badge>
                      <Badge className={getComplexityColor(scenario.complexity)}>
                        {scenario.complexity}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">{scenario.description}</p>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Current Tax</p>
                        <p className="font-medium">
                          ${scenario.currentTax.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Optimized Tax</p>
                        <p className="font-medium">
                          ${scenario.optimizedTax.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Potential Savings</p>
                        <p className="font-medium text-green-500">
                          ${scenario.savings.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="space-y-6">
            {selectedScenario && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Implementation Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-5 w-5 text-blue-500" />
                        <p className="text-sm text-gray-600">{selectedScenario.implementation}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Risk Level</p>
                          <Badge className={getRiskColor(selectedScenario.risk)}>
                            {selectedScenario.risk}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Complexity</p>
                          <Badge className={getComplexityColor(selectedScenario.complexity)}>
                            {selectedScenario.complexity}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Tax Impact Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <DollarSign className="h-5 w-5 text-blue-500" />
                          <span>Current Tax Liability</span>
                        </div>
                        <span className="font-medium">
                          ${selectedScenario.currentTax.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <TrendingUp className="h-5 w-5 text-green-500" />
                          <span>Optimized Tax Liability</span>
                        </div>
                        <span className="font-medium">
                          ${selectedScenario.optimizedTax.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <AlertTriangle className="h-5 w-5 text-yellow-500" />
                          <span>Potential Savings</span>
                        </div>
                        <span className="font-medium text-green-500">
                          ${selectedScenario.savings.toLocaleString()}
                        </span>
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
                        Calculate Impact
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <BarChart className="mr-2 h-4 w-4" />
                        Compare Scenarios
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <LineChart className="mr-2 h-4 w-4" />
                        Tax Projection
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <PieChart className="mr-2 h-4 w-4" />
                        Portfolio Impact
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