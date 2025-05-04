"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  TrendingUp,
  AlertTriangle,
  PieChart,
  BarChart,
  LineChart,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react"

interface Portfolio {
  id: string
  name: string
  totalValue: number
  dailyChange: number
  monthlyChange: number
  yearlyChange: number
  riskLevel: "Low" | "Medium" | "High"
  assetAllocation: {
    stocks: number
    bonds: number
    cash: number
    realEstate: number
    crypto: number
  }
  performance: {
    alpha: number
    beta: number
    sharpeRatio: number
    volatility: number
  }
  holdings: {
    name: string
    symbol: string
    quantity: number
    value: number
    change: number
  }[]
}

const mockPortfolio: Portfolio = {
  id: "1",
  name: "Growth Portfolio",
  totalValue: 250000,
  dailyChange: 1.2,
  monthlyChange: 5.8,
  yearlyChange: 15.3,
  riskLevel: "Medium",
  assetAllocation: {
    stocks: 50,
    bonds: 20,
    cash: 10,
    realEstate: 15,
    crypto: 5
  },
  performance: {
    alpha: 2.5,
    beta: 1.1,
    sharpeRatio: 1.8,
    volatility: 12.5
  },
  holdings: [
    {
      name: "Apple Inc.",
      symbol: "AAPL",
      quantity: 100,
      value: 17500,
      change: 2.5
    },
    {
      name: "Microsoft Corp.",
      symbol: "MSFT",
      quantity: 50,
      value: 15000,
      change: 1.8
    },
    {
      name: "Tesla Inc.",
      symbol: "TSLA",
      quantity: 25,
      value: 5000,
      change: -0.5
    },
    {
      name: "Vanguard Total Bond",
      symbol: "BND",
      quantity: 200,
      value: 20000,
      change: 0.3
    }
  ]
}

export default function PremiumPortfolioPage() {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setPortfolio(mockPortfolio)
      setLoading(false)
    }, 1000)
  }, [])

  const getChangeColor = (change: number) => {
    return change >= 0 ? "text-green-500" : "text-red-500"
  }

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Portfolio Analysis</h1>
        <Badge className="bg-purple-500">Premium Features</Badge>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : portfolio && (
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
                        ${portfolio.totalValue.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Daily Change</p>
                      <div className="flex items-center">
                        <p className={`text-xl font-bold ${getChangeColor(portfolio.dailyChange)}`}>
                          {portfolio.dailyChange >= 0 ? "+" : ""}{portfolio.dailyChange}%
                        </p>
                        {portfolio.dailyChange >= 0 ? (
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
                      {Object.entries(portfolio.assetAllocation).map(([asset, percentage]) => (
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
                <CardTitle>Holdings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {portfolio.holdings.map((holding, index) => (
                    <div
                      key={index}
                      className="border rounded-lg p-4 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">{holding.name}</h4>
                          <p className="text-sm text-gray-500">{holding.symbol}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">
                            ${holding.value.toLocaleString()}
                          </p>
                          <div className="flex items-center justify-end">
                            <span className={getChangeColor(holding.change)}>
                              {holding.change >= 0 ? "+" : ""}{holding.change}%
                            </span>
                            {holding.change >= 0 ? (
                              <ArrowUpRight className="h-4 w-4 text-green-500 ml-1" />
                            ) : (
                              <ArrowDownRight className="h-4 w-4 text-red-500 ml-1" />
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>Quantity: {holding.quantity}</span>
                        <span>Value: ${(holding.value / holding.quantity).toFixed(2)} per share</span>
                      </div>
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
                      <TrendingUp className="h-5 w-5 text-blue-500" />
                      <span>Alpha</span>
                    </div>
                    <span className={getChangeColor(portfolio.performance.alpha)}>
                      {portfolio.performance.alpha >= 0 ? "+" : ""}{portfolio.performance.alpha}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <BarChart className="h-5 w-5 text-green-500" />
                      <span>Beta</span>
                    </div>
                    <span>{portfolio.performance.beta}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <LineChart className="h-5 w-5 text-purple-500" />
                      <span>Sharpe Ratio</span>
                    </div>
                    <span>{portfolio.performance.sharpeRatio}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="h-5 w-5 text-yellow-500" />
                      <span>Volatility</span>
                    </div>
                    <span>{portfolio.performance.volatility}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Risk Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Risk Level</span>
                    <Badge className={getRiskColor(portfolio.riskLevel)}>
                      {portfolio.riskLevel}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      Your portfolio is currently balanced for {portfolio.riskLevel.toLowerCase()} risk tolerance.
                      Consider adjusting your asset allocation based on your investment goals and time horizon.
                    </p>
                    <Button variant="outline" className="w-full">
                      Optimize Portfolio
                    </Button>
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
                    Rebalance Portfolio
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <BarChart className="mr-2 h-4 w-4" />
                    Tax-Loss Harvesting
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <LineChart className="mr-2 h-4 w-4" />
                    Performance Analysis
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