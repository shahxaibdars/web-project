"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { 
  Calendar as CalendarIcon,
  Clock,
  User,
  Plus,
  Search
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface Consultation {
  id: string
  clientId: string
  clientName: string
  date: Date
  time: string
  status: "scheduled" | "completed" | "cancelled"
  notes: string
}

const mockConsultations: Consultation[] = [
  {
    id: "1",
    clientId: "1",
    clientName: "John Doe",
    date: new Date("2024-04-20"),
    time: "10:00 AM",
    status: "scheduled",
    notes: "Annual portfolio review"
  },
  {
    id: "2",
    clientId: "2",
    clientName: "Jane Smith",
    date: new Date("2024-04-25"),
    time: "2:30 PM",
    status: "scheduled",
    notes: "Investment strategy discussion"
  }
]

export default function ConsultationsPage() {
  const [consultations, setConsultations] = useState<Consultation[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setConsultations(mockConsultations)
      setLoading(false)
    }, 1000)
  }, [])

  const filteredConsultations = consultations.filter(consultation =>
    consultation.clientName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-500"
      case "completed":
        return "bg-green-500"
      case "cancelled":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Consultations</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Schedule Consultation
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search consultations..."
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
            <div className="space-y-4">
              {filteredConsultations.map((consultation) => (
                <Card key={consultation.id}>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-xl">{consultation.clientName}</CardTitle>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(consultation.status)}>
                          {consultation.status}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {format(consultation.date, "PPP")} at {consultation.time}
                        </span>
                      </div>
                    </div>
                    <Button variant="outline">View Details</Button>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">{consultation.notes}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Available Time Slots</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {["9:00 AM", "10:30 AM", "2:00 PM", "3:30 PM"].map((time) => (
                  <Button
                    key={time}
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    {time}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 