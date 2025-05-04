"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  FileText,
  Download,
  Search,
  Plus,
  BarChart,
  PieChart,
  LineChart,
  Calendar
} from "lucide-react"

interface Report {
  id: string
  clientId: string
  clientName: string
  title: string
  date: string
  type: "portfolio" | "risk" | "performance" | "custom"
  status: "draft" | "published" | "archived"
  insights: string[]
  recommendations: string[]
}

const mockReports: Report[] = [
  {
    id: "1",
    clientId: "1",
    clientName: "John Doe",
    title: "Q1 2024 Portfolio Analysis",
    date: "2024-03-31",
    type: "portfolio",
    status: "published",
    insights: [
      "Portfolio has shown 12.5% growth YTD",
      "Tech sector exposure increased by 5%",
      "Bond allocation within target range"
    ],
    recommendations: [
      "Consider rebalancing tech stocks",
      "Increase international exposure",
      "Review emergency fund allocation"
    ]
  },
  {
    id: "2",
    clientId: "2",
    clientName: "Jane Smith",
    title: "Risk Assessment Report",
    date: "2024-03-15",
    type: "risk",
    status: "published",
    insights: [
      "Risk tolerance remains moderate",
      "Diversification score improved",
      "Liquidity position strong"
    ],
    recommendations: [
      "Maintain current asset allocation",
      "Consider adding inflation-protected securities",
      "Review insurance coverage"
    ]
  }
]

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setReports(mockReports)
      setLoading(false)
    }, 1000)
  }, [])

  const filteredReports = reports.filter(report =>
    report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    report.clientName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "portfolio":
        return <PieChart className="h-4 w-4" />
      case "risk":
        return <BarChart className="h-4 w-4" />
      case "performance":
        return <LineChart className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-500"
      case "draft":
        return "bg-yellow-500"
      case "archived":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Financial Reports</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Generate New Report
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search reports..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            {filteredReports.map((report) => (
              <Card key={report.id}>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-xl">{report.title}</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(report.status)}>
                        {report.status}
                      </Badge>
                      <div className="flex items-center space-x-1 text-sm text-gray-500">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(report.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-gray-500">
                        {getTypeIcon(report.type)}
                        <span className="capitalize">{report.type}</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Key Insights</h3>
                      <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                        {report.insights.map((insight, index) => (
                          <li key={index}>{insight}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Recommendations</h3>
                      <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                        {report.recommendations.map((recommendation, index) => (
                          <li key={index}>{recommendation}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Report Types</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button variant="outline" className="w-full justify-start">
                    <PieChart className="mr-2 h-4 w-4" />
                    Portfolio Analysis
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <BarChart className="mr-2 h-4 w-4" />
                    Risk Assessment
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <LineChart className="mr-2 h-4 w-4" />
                    Performance Review
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="mr-2 h-4 w-4" />
                    Custom Report
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reports.slice(0, 3).map((report) => (
                    <div key={report.id} className="flex items-start space-x-2">
                      <FileText className="h-4 w-4 text-gray-500 mt-1" />
                      <div>
                        <p className="text-sm font-medium">{report.title}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(report.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
} 