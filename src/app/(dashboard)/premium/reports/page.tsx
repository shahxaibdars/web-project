"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  FileText,
  Download,
  BarChart,
  LineChart,
  PieChart,
  Calendar,
  Filter,
  Search,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react"

interface Report {
  id: string
  title: string
  type: "Portfolio" | "Tax" | "Investment" | "Planning"
  date: string
  status: "Completed" | "In Progress" | "Pending"
  insights: string[]
  recommendations: string[]
  metrics: {
    name: string
    value: number
    change: number
  }[]
  charts: {
    type: "bar" | "line" | "pie"
    title: string
    data: any
  }[]
}

const mockReports: Report[] = [
  {
    id: "1",
    title: "Q1 2024 Portfolio Analysis",
    type: "Portfolio",
    date: "2024-03-31",
    status: "Completed",
    insights: [
      "Portfolio outperformed benchmark by 2.5%",
      "Tech sector allocation increased to 35%",
      "Bond holdings reduced by 5%"
    ],
    recommendations: [
      "Consider rebalancing tech sector exposure",
      "Increase international equity allocation",
      "Review fixed income duration"
    ],
    metrics: [
      {
        name: "Total Return",
        value: 12.5,
        change: 2.5
      },
      {
        name: "Risk-Adjusted Return",
        value: 1.8,
        change: 0.3
      },
      {
        name: "Volatility",
        value: 15.2,
        change: -1.2
      }
    ],
    charts: [
      {
        type: "pie",
        title: "Asset Allocation",
        data: {
          labels: ["Stocks", "Bonds", "Cash", "Real Estate"],
          values: [60, 25, 10, 5]
        }
      },
      {
        type: "line",
        title: "Performance vs Benchmark",
        data: {
          labels: ["Jan", "Feb", "Mar"],
          values: [5, 8, 12.5],
          benchmark: [4, 6, 10]
        }
      }
    ]
  },
  {
    id: "2",
    title: "Tax Optimization Report",
    type: "Tax",
    date: "2024-03-15",
    status: "Completed",
    insights: [
      "Potential tax savings of $5,000 identified",
      "Tax-loss harvesting opportunities available",
      "Roth conversion strategy recommended"
    ],
    recommendations: [
      "Implement tax-loss harvesting strategy",
      "Consider Roth IRA conversion",
      "Review charitable giving strategy"
    ],
    metrics: [
      {
        name: "Current Tax Liability",
        value: 25000,
        change: -5000
      },
      {
        name: "Effective Tax Rate",
        value: 22.5,
        change: -2.5
      },
      {
        name: "Tax Efficiency Score",
        value: 85,
        change: 5
      }
    ],
    charts: [
      {
        type: "bar",
        title: "Tax Liability by Category",
        data: {
          labels: ["Income", "Capital Gains", "Dividends", "Other"],
          values: [15000, 5000, 3000, 2000]
        }
      }
    ]
  },
  {
    id: "3",
    title: "Investment Strategy Review",
    type: "Investment",
    date: "2024-02-28",
    status: "Completed",
    insights: [
      "Growth portfolio performing above target",
      "Value stocks showing strong momentum",
      "International exposure below target"
    ],
    recommendations: [
      "Increase international equity allocation",
      "Consider adding emerging markets exposure",
      "Review sector weightings"
    ],
    metrics: [
      {
        name: "Portfolio Beta",
        value: 1.2,
        change: 0.1
      },
      {
        name: "Alpha",
        value: 2.5,
        change: 0.5
      },
      {
        name: "Sharpe Ratio",
        value: 1.8,
        change: 0.2
      }
    ],
    charts: [
      {
        type: "pie",
        title: "Sector Allocation",
        data: {
          labels: ["Tech", "Financials", "Healthcare", "Consumer", "Other"],
          values: [35, 20, 15, 20, 10]
        }
      }
    ]
  }
]

export default function PremiumReportsPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<string>("All")

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setReports(mockReports)
      setSelectedReport(mockReports[0])
      setLoading(false)
    }, 1000)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-500"
      case "In Progress":
        return "bg-yellow-500"
      case "Pending":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  const getChangeColor = (change: number) => {
    return change >= 0 ? "text-green-500" : "text-red-500"
  }

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterType === "All" || report.type === filterType
    return matchesSearch && matchesFilter
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Financial Reports</h1>
        <Badge className="bg-purple-500">Premium Features</Badge>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search reports..."
            className="pl-10 pr-4 py-2 w-full border rounded-md"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select
          className="border rounded-md px-4 py-2"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="All">All Types</option>
          <option value="Portfolio">Portfolio</option>
          <option value="Tax">Tax</option>
          <option value="Investment">Investment</option>
          <option value="Planning">Planning</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            {filteredReports.map((report) => (
              <Card
                key={report.id}
                className={`cursor-pointer transition-colors ${
                  selectedReport?.id === report.id
                    ? "border-blue-500"
                    : "hover:border-gray-400"
                }`}
                onClick={() => setSelectedReport(report)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{report.title}</CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline">{report.type}</Badge>
                        <Badge className={getStatusColor(report.status)}>
                          {report.status}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {new Date(report.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Key Insights</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                        {report.insights.map((insight, index) => (
                          <li key={index}>{insight}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      {report.metrics.map((metric, index) => (
                        <div key={index}>
                          <p className="text-sm text-gray-500">{metric.name}</p>
                          <div className="flex items-center">
                            <p className="font-medium">
                              {typeof metric.value === "number" && metric.value % 1 !== 0
                                ? metric.value.toFixed(2)
                                : metric.value}
                              {typeof metric.value === "number" && metric.value % 1 === 0
                                ? "%"
                                : ""}
                            </p>
                            <div className="flex items-center ml-2">
                              <span className={getChangeColor(metric.change)}>
                                {metric.change >= 0 ? "+" : ""}{metric.change}%
                              </span>
                              {metric.change >= 0 ? (
                                <ArrowUpRight className="h-4 w-4 text-green-500 ml-1" />
                              ) : (
                                <ArrowDownRight className="h-4 w-4 text-red-500 ml-1" />
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="space-y-6">
            {selectedReport && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Report Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-5 w-5 text-blue-500" />
                          <span>Generated On</span>
                        </div>
                        <span className="font-medium">
                          {new Date(selectedReport.date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <FileText className="h-5 w-5 text-green-500" />
                          <span>Status</span>
                        </div>
                        <Badge className={getStatusColor(selectedReport.status)}>
                          {selectedReport.status}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
                      {selectedReport.recommendations.map((rec, index) => (
                        <li key={index}>{rec}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start">
                        <Download className="mr-2 h-4 w-4" />
                        Download Report
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <BarChart className="mr-2 h-4 w-4" />
                        View Charts
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <LineChart className="mr-2 h-4 w-4" />
                        Compare Reports
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <PieChart className="mr-2 h-4 w-4" />
                        Generate New Report
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