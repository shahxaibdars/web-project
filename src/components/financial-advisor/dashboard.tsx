"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, FileText, Users, BarChart } from "lucide-react";
import Link from "next/link";

interface ClientSummary {
  id: string;
  name: string;
  riskProfile: string;
  totalAssets: number;
  lastConsultation: string;
  nextAppointment: string;
}

const mockClients: ClientSummary[] = [
  {
    id: "1",
    name: "John Doe",
    riskProfile: "Moderate",
    totalAssets: 150000,
    lastConsultation: "2024-03-20",
    nextAppointment: "2024-04-05",
  },
  {
    id: "2",
    name: "Jane Smith",
    riskProfile: "Conservative",
    totalAssets: 250000,
    lastConsultation: "2024-03-18",
    nextAppointment: "2024-04-10",
  },
  {
    id: "3",
    name: "Bob Wilson",
    riskProfile: "Aggressive",
    totalAssets: 75000,
    lastConsultation: "2024-03-15",
    nextAppointment: "2024-04-15",
  },
];

export function AdvisorDashboard() {
  const [clients, setClients] = useState<ClientSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setClients(mockClients);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Financial Advisor Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/advisor/clients">
          <Card className="hover:bg-gray-50 transition-colors cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{clients.length}</div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/advisor/consultations">
          <Card className="hover:bg-gray-50 transition-colors cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Consultations</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {clients.filter(c => new Date(c.nextAppointment) > new Date()).length}
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/advisor/reports">
          <Card className="hover:bg-gray-50 transition-colors cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reports Generated</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/advisor/analytics">
          <Card className="hover:bg-gray-50 transition-colors cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Portfolio Analytics</CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {clients.map((client) => (
                <div
                  key={client.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <h3 className="font-semibold">{client.name}</h3>
                    <p className="text-sm text-gray-500">
                      Risk Profile: {client.riskProfile}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/advisor/clients/${client.id}/portfolio`}>
                      <Button variant="outline" size="sm">
                        View Portfolio
                      </Button>
                    </Link>
                    <Link href={`/advisor/clients/${client.id}/report`}>
                      <Button variant="outline" size="sm">
                        Generate Report
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Consultations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {clients
                .filter((client) => new Date(client.nextAppointment) > new Date())
                .map((client) => (
                  <div
                    key={client.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <h3 className="font-semibold">{client.name}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(client.nextAppointment).toLocaleDateString()}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 