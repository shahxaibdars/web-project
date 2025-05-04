"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  TrendingUp,
  AlertTriangle,
  DollarSign,
  BarChart,
  LineChart,
  PieChart,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react"

interface Investment {
  id: string
  name: string
  type: "Stock" | "ETF" | "Bond" | "Real Estate" | "Crypto"
  riskLevel: "Low" | "Medium" | "High"
  expectedReturn: number
  minimumInvestment: number
  timeHorizon: string
  description: string
  pros: string[]
  cons: string[]
  performance: {
    oneYear: number
    threeYear: number
    fiveYear: number
  }
}

const mockInvestments: Investment[] = [
  {
    id: "1",
    name: "Tech Growth ETF",
    type: "ETF",
    riskLevel: "High",
    expectedReturn: 12.5,
    minimumInvestment: 1000,
    timeHorizon: "5+ years",
    description: "A diversified ETF focusing on high-growth technology companies with strong fundamentals and innovative products.",
    pros: [
      "High growth potential",
      "Diversified exposure to tech sector",
      "Lower fees than individual stocks"
    ],
    cons: [
      "Higher volatility",
      "Concentrated sector risk",
      "Sensitive to interest rate changes"
    ],
    performance: {
      oneYear: 25.3,
      threeYear: 18.7,
      fiveYear: 22.1
    }
  },
  {
    id: "2",
    name: "Global Bond Fund",
    type: "Bond",
    riskLevel: "Low",
    expectedReturn: 4.2,
    minimumInvestment: 5000,
    timeHorizon: "3+ years",
    description: "A diversified bond fund investing in high-quality government and corporate bonds across developed markets.",
    pros: [
      "Lower volatility",
      "Regular income stream",
      "Capital preservation"
    ],
    cons: [
      "Lower returns in low-rate environment",
      "Interest rate risk",
      "Currency risk for international bonds"
    ],
    performance: {
      oneYear: 3.8,
      threeYear: 4.1,
      fiveYear: 4.5
    }
  },
  {
    id: "3",
    name: "Real Estate Investment Trust",
    type: "Real Estate",
    riskLevel: "Medium",
    expectedReturn: 8.5,
    minimumInvestment: 2500,
    timeHorizon: "5+ years",
    description: "A REIT focusing on commercial properties in growing urban areas with strong rental demand.",
    pros: [
      "Regular dividend income",
      "Inflation hedge",
      "Diversification from stocks and bonds"
    ],
    cons: [
      "Interest rate sensitivity",
      "Property market risk",
      "Management fees"
    ],
    performance: {
      oneYear: 9.2,
      threeYear: 7.8,
      fiveYear: 8.3
    }
  }
]

export default function PremiumInvestmentsPage() {
  const [investments, setInvestments] = useState<Investment[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedInvestment, setSelectedInvestment] = useState<Investment | null>(null)

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setInvestments(mockInvestments)
      setSelectedInvestment(mockInvestments[0])
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

  const getChangeColor = (change: number) => {
    return change >= 0 ? "text-green-500" : "text-red-500"
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Investment Recommendations</h1>
        <Badge className="bg-purple-500">Premium Features</Badge>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            {investments.map((investment) => (
              <Card
                key={investment.id}
                className={`cursor-pointer transition-colors ${
                  selectedInvestment?.id === investment.id
                    ? "border-blue-500"
                    : "hover:border-gray-400"
                }`}
                onClick={() => setSelectedInvestment(investment)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{investment.name}</CardTitle>
                    <Badge className={getRiskColor(investment.riskLevel)}>
                      {investment.riskLevel} Risk
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Type</p>
                        <p className="font-medium">{investment.type}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Expected Return</p>
                        <p className="font-medium">{investment.expectedReturn}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Minimum Investment</p>
                        <p className="font-medium">${investment.minimumInvestment.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Time Horizon</p>
                        <p className="font-medium">{investment.timeHorizon}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{investment.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="space-y-6">
            {selectedInvestment && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <TrendingUp className="h-5 w-5 text-blue-500" />
                          <span>1 Year Return</span>
                        </div>
                        <div className="flex items-center">
                          <span className={getChangeColor(selectedInvestment.performance.oneYear)}>
                            {selectedInvestment.performance.oneYear >= 0 ? "+" : ""}
                            {selectedInvestment.performance.oneYear}%
                          </span>
                          {selectedInvestment.performance.oneYear >= 0 ? (
                            <ArrowUpRight className="h-4 w-4 text-green-500 ml-1" />
                          ) : (
                            <ArrowDownRight className="h-4 w-4 text-red-500 ml-1" />
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <BarChart className="h-5 w-5 text-green-500" />
                          <span>3 Year Return</span>
                        </div>
                        <div className="flex items-center">
                          <span className={getChangeColor(selectedInvestment.performance.threeYear)}>
                            {selectedInvestment.performance.threeYear >= 0 ? "+" : ""}
                            {selectedInvestment.performance.threeYear}%
                          </span>
                          {selectedInvestment.performance.threeYear >= 0 ? (
                            <ArrowUpRight className="h-4 w-4 text-green-500 ml-1" />
                          ) : (
                            <ArrowDownRight className="h-4 w-4 text-red-500 ml-1" />
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <LineChart className="h-5 w-5 text-purple-500" />
                          <span>5 Year Return</span>
                        </div>
                        <div className="flex items-center">
                          <span className={getChangeColor(selectedInvestment.performance.fiveYear)}>
                            {selectedInvestment.performance.fiveYear >= 0 ? "+" : ""}
                            {selectedInvestment.performance.fiveYear}%
                          </span>
                          {selectedInvestment.performance.fiveYear >= 0 ? (
                            <ArrowUpRight className="h-4 w-4 text-green-500 ml-1" />
                          ) : (
                            <ArrowDownRight className="h-4 w-4 text-red-500 ml-1" />
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Pros</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                          {selectedInvestment.pros.map((pro, index) => (
                            <li key={index}>{pro}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Cons</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                          {selectedInvestment.cons.map((con, index) => (
                            <li key={index}>{con}</li>
                          ))}
                        </ul>
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
                        <DollarSign className="mr-2 h-4 w-4" />
                        Invest Now
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <PieChart className="mr-2 h-4 w-4" />
                        Add to Watchlist
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <AlertTriangle className="mr-2 h-4 w-4" />
                        Risk Analysis
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <LineChart className="mr-2 h-4 w-4" />
                        Compare Investments
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