"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle,
  Plus,
  Search
} from "lucide-react"
import { Input } from "@/components/ui/input"

interface ClientSummary {
  id: string
  name: string
  riskProfile: "Low" | "Medium" | "High"
  totalAssets: number
  lastConsultation: string
  nextAppointment: string
  keyMetrics: {
    netWorth: number
    debtToIncome: number
    savingsRate: number
    investmentGrowth: number
  }
}

const mockClients: ClientSummary[] = [
  {
    id: "1",
    name: "John Doe",
    riskProfile: "Medium",
    totalAssets: 150000,
    lastConsultation: "2024-03-15",
    nextAppointment: "2024-04-20",
    keyMetrics: {
      netWorth: 250000,
      debtToIncome: 0.35,
      savingsRate: 0.15,
      investmentGrowth: 0.08
    }
  },
  {
    id: "2",
    name: "Jane Smith",
    riskProfile: "Low",
    totalAssets: 300000,
    lastConsultation: "2024-03-20",
    nextAppointment: "2024-04-25",
    keyMetrics: {
      netWorth: 450000,
      debtToIncome: 0.25,
      savingsRate: 0.20,
      investmentGrowth: 0.12
    }
  }
]

export default function ClientSummariesPage() {
  const [clients, setClients] = useState<ClientSummary[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setClients(mockClients)
      setLoading(false)
    }, 1000)
  }, [])

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getRiskProfileColor = (risk: string) => {
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
        <h1 className="text-2xl font-bold">Client Summaries</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add New Client
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search clients..."
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
        <div className="grid gap-6">
          {filteredClients.map((client) => (
            <Card key={client.id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-xl">{client.name}</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge className={getRiskProfileColor(client.riskProfile)}>
                      {client.riskProfile} Risk
                    </Badge>
                    <span className="text-sm text-gray-500">
                      Last Consultation: {new Date(client.lastConsultation).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <Button variant="outline">View Details</Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium">Net Worth</span>
                    </div>
                    <p className="text-2xl font-bold">
                      ${client.keyMetrics.netWorth.toLocaleString()}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium">Debt to Income</span>
                    </div>
                    <p className="text-2xl font-bold">
                      {(client.keyMetrics.debtToIncome * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium">Savings Rate</span>
                    </div>
                    <p className="text-2xl font-bold">
                      {(client.keyMetrics.savingsRate * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium">Investment Growth</span>
                    </div>
                    <p className="text-2xl font-bold">
                      {(client.keyMetrics.investmentGrowth * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
} 