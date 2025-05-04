"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface Client {
  id: string;
  name: string;
  email: string;
  totalAssets: number;
  lastConsultation: string;
}

const mockClients: Client[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    totalAssets: 150000,
    lastConsultation: "2024-03-20",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    totalAssets: 250000,
    lastConsultation: "2024-03-18",
  },
  {
    id: "3",
    name: "Bob Wilson",
    email: "bob@example.com",
    totalAssets: 75000,
    lastConsultation: "2024-03-15",
  },
];

export function ClientSummaries() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setClients(mockClients);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Client Summaries</h1>
        <Input
          placeholder="Search clients..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 border rounded-lg">
              <Skeleton className="h-4 w-1/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredClients.map((client) => (
            <div
              key={client.id}
              className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{client.name}</h3>
                  <p className="text-gray-600">{client.email}</p>
                  <div className="mt-2 text-sm text-gray-500">
                    <p>Total Assets: ${client.totalAssets.toLocaleString()}</p>
                    <p>Last Consultation: {client.lastConsultation}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Link href={`/clients/${client.id}/annotations`}>
                    <Button variant="outline" size="sm">
                      View Portfolio
                    </Button>
                  </Link>
                  <Link href={`/clients/${client.id}/report`}>
                    <Button variant="outline" size="sm">
                      Generate Report
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 