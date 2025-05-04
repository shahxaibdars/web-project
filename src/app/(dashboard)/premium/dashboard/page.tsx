"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  TrendingUp,
  DollarSign,
  PieChart,
  BarChart,
  LineChart,
  Calendar,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react"

interface PortfolioMetrics {
  totalValue: number
  dailyChange: number
  monthlyChange: number
  yearlyChange: number
  assetAllocation: {
    stocks: number
    bonds: number
    cash: number
    realEstate: number
  }
}

interface MarketInsights {
  title: string
  description: string
  impact: "positive" | "negative" | "neutral"
  date: string
}

const mockMetrics: PortfolioMetrics = {
  totalValue: 250000,
  dailyChange: 1.2,
  monthlyChange: 5.8,
  yearlyChange: 15.3,
  assetAllocation: {
    stocks: 60,
    bonds: 25,
    cash: 10,
    realEstate: 5
  }
}

const mockInsights: MarketInsights[] = [
  {
    title: "Tech Sector Rally",
    description: "Major tech companies showing strong Q1 earnings",
    impact: "positive",
    date: "2024-04-22"
  },
  {
    title: "Interest Rate Update",
    description: "Federal Reserve maintains current interest rates",
    impact: "neutral",
    date: "2024-04-21"
  },
  {
    title: "Market Volatility",
    description: "Increased volatility in emerging markets",
    impact: "negative",
    date: "2024-04-20"
  }
]

export default function PremiumDashboardPage() {
  const [metrics, setMetrics] = useState<PortfolioMetrics | null>(null)
  const [insights, setInsights] = useState<MarketInsights[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setMetrics(mockMetrics)
      setInsights(mockInsights)
      setLoading(false)
    }, 1000)
  }, [])

  const getChangeColor = (change: number) => {
    return change >= 0 ? "text-green-500" : "text-red-500"
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "positive":
        return "bg-green-500"
      case "negative":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Premium Dashboard</h1>
        <Badge className="bg-purple-500">Premium Member</Badge>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : metrics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Portfolio Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Total Value</p>
                      <p className="text-2xl font-bold">
                        ${metrics.totalValue.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Daily Change</p>
                      <div className="flex items-center">
                        <p className={`text-xl font-bold ${getChangeColor(metrics.dailyChange)}`}>
                          {metrics.dailyChange >= 0 ? "+" : ""}{metrics.dailyChange}%
                        </p>
                        {metrics.dailyChange >= 0 ? (
                          <ArrowUpRight className="h-5 w-5 text-green-500 ml-1" />
                        ) : (
                          <ArrowDownRight className="h-5 w-5 text-red-500 ml-1" />
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Asset Allocation</h3>
                    <div className="space-y-2">
                      {Object.entries(metrics.assetAllocation).map(([asset, percentage]) => (
                        <div key={asset} className="flex items-center justify-between">
                          <span className="capitalize">{asset}</span>
                          <div className="w-48 bg-gray-200 rounded-full h-2.5">
                            <div
                              className="bg-blue-600 h-2.5 rounded-full"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="w-12 text-right">{percentage}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Market Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {insights.map((insight, index) => (
                    <div
                      key={index}
                      className="border rounded-lg p-4 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Badge className={getImpactColor(insight.impact)}>
                            {insight.impact}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {new Date(insight.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <h4 className="font-semibold">{insight.title}</h4>
                      <p className="text-sm text-gray-600">{insight.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-5 w-5 text-blue-500" />
                      <span>Monthly Change</span>
                    </div>
                    <div className="flex items-center">
                      <span className={getChangeColor(metrics.monthlyChange)}>
                        {metrics.monthlyChange >= 0 ? "+" : ""}{metrics.monthlyChange}%
                      </span>
                      {metrics.monthlyChange >= 0 ? (
                        <ArrowUpRight className="h-5 w-5 text-green-500 ml-1" />
                      ) : (
                        <ArrowDownRight className="h-5 w-5 text-red-500 ml-1" />
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5 text-green-500" />
                      <span>Yearly Change</span>
                    </div>
                    <div className="flex items-center">
                      <span className={getChangeColor(metrics.yearlyChange)}>
                        {metrics.yearlyChange >= 0 ? "+" : ""}{metrics.yearlyChange}%
                      </span>
                      {metrics.yearlyChange >= 0 ? (
                        <ArrowUpRight className="h-5 w-5 text-green-500 ml-1" />
                      ) : (
                        <ArrowDownRight className="h-5 w-5 text-red-500 ml-1" />
                      )}
                    </div>
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
                    <PieChart className="mr-2 h-4 w-4" />
                    Portfolio Analysis
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <BarChart className="mr-2 h-4 w-4" />
                    Investment Tools
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <LineChart className="mr-2 h-4 w-4" />
                    Tax Optimization
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    Risk Assessment
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
} 