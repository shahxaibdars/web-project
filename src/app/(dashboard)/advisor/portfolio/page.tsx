"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { 
  TrendingUp,
  AlertTriangle,
  Plus,
  Search,
  MessageSquare,
  CheckCircle,
  XCircle
} from "lucide-react"

interface Portfolio {
  id: string
  clientId: string
  clientName: string
  totalValue: number
  assetAllocation: {
    stocks: number
    bonds: number
    cash: number
    realEstate: number
  }
  recommendations: Recommendation[]
}

interface Recommendation {
  id: string
  date: string
  type: "buy" | "sell" | "hold"
  asset: string
  description: string
  status: "pending" | "implemented" | "rejected"
}

const mockPortfolios: Portfolio[] = [
  {
    id: "1",
    clientId: "1",
    clientName: "John Doe",
    totalValue: 250000,
    assetAllocation: {
      stocks: 60,
      bonds: 30,
      cash: 5,
      realEstate: 5
    },
    recommendations: [
      {
        id: "1",
        date: "2024-03-15",
        type: "buy",
        asset: "Tech Stocks",
        description: "Increase exposure to tech sector by 5%",
        status: "implemented"
      },
      {
        id: "2",
        date: "2024-03-20",
        type: "sell",
        asset: "Energy Stocks",
        description: "Reduce energy sector exposure by 3%",
        status: "pending"
      }
    ]
  }
]

export default function PortfolioAnalysisPage() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([])
  const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [newRecommendation, setNewRecommendation] = useState({
    type: "buy",
    asset: "",
    description: ""
  })

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setPortfolios(mockPortfolios)
      setSelectedPortfolio(mockPortfolios[0])
      setLoading(false)
    }, 1000)
  }, [])

  const handleAddRecommendation = () => {
    if (!selectedPortfolio) return

    const recommendation: Recommendation = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      type: newRecommendation.type as "buy" | "sell" | "hold",
      asset: newRecommendation.asset,
      description: newRecommendation.description,
      status: "pending"
    }

    const updatedPortfolio = {
      ...selectedPortfolio,
      recommendations: [...selectedPortfolio.recommendations, recommendation]
    }

    setSelectedPortfolio(updatedPortfolio)
    setNewRecommendation({ type: "buy", asset: "", description: "" })
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "buy":
        return "bg-green-500"
      case "sell":
        return "bg-red-500"
      case "hold":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "implemented":
        return "bg-green-500"
      case "pending":
        return "bg-yellow-500"
      case "rejected":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Portfolio Analysis</h1>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search portfolios..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : selectedPortfolio ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{selectedPortfolio.clientName}'s Portfolio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Total Value</p>
                      <p className="text-2xl font-bold">
                        ${selectedPortfolio.totalValue.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Risk Profile</p>
                      <p className="text-2xl font-bold">Moderate</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Asset Allocation</h3>
                    <div className="space-y-2">
                      {Object.entries(selectedPortfolio.assetAllocation).map(([asset, percentage]) => (
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
                <CardTitle>Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedPortfolio.recommendations.map((recommendation) => (
                    <div
                      key={recommendation.id}
                      className="border rounded-lg p-4 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Badge className={getTypeColor(recommendation.type)}>
                            {recommendation.type.toUpperCase()}
                          </Badge>
                          <Badge className={getStatusColor(recommendation.status)}>
                            {recommendation.status}
                          </Badge>
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(recommendation.date).toLocaleDateString()}
                        </span>
                      </div>
                      <h4 className="font-semibold">{recommendation.asset}</h4>
                      <p className="text-sm text-gray-600">{recommendation.description}</p>
                    </div>
                  ))}

                  <div className="border rounded-lg p-4 space-y-4">
                    <h3 className="font-semibold">Add New Recommendation</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Type</label>
                        <select
                          className="w-full p-2 border rounded-md"
                          value={newRecommendation.type}
                          onChange={(e) =>
                            setNewRecommendation({
                              ...newRecommendation,
                              type: e.target.value
                            })
                          }
                        >
                          <option value="buy">Buy</option>
                          <option value="sell">Sell</option>
                          <option value="hold">Hold</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Asset</label>
                        <Input
                          value={newRecommendation.asset}
                          onChange={(e) =>
                            setNewRecommendation({
                              ...newRecommendation,
                              asset: e.target.value
                            })
                          }
                          placeholder="Enter asset name"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Description</label>
                        <Textarea
                          value={newRecommendation.description}
                          onChange={(e) =>
                            setNewRecommendation({
                              ...newRecommendation,
                              description: e.target.value
                            })
                          }
                          placeholder="Enter recommendation details"
                        />
                      </div>
                      <Button onClick={handleAddRecommendation}>
                        Add Recommendation
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Portfolio Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Diversification</span>
                    </div>
                    <Badge className="bg-green-500">Good</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="h-5 w-5 text-yellow-500" />
                      <span>Risk Level</span>
                    </div>
                    <Badge className="bg-yellow-500">Moderate</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5 text-blue-500" />
                      <span>Performance</span>
                    </div>
                    <Badge className="bg-blue-500">+12.5%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedPortfolio.recommendations.slice(0, 3).map((recommendation) => (
                    <div key={recommendation.id} className="flex items-start space-x-2">
                      <MessageSquare className="h-4 w-4 text-gray-500 mt-1" />
                      <div>
                        <p className="text-sm font-medium">{recommendation.asset}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(recommendation.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No portfolio selected</p>
        </div>
      )}
    </div>
  )
} 