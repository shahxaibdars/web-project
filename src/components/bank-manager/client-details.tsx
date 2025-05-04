"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { ArrowLeft, Calendar, FileText, Users } from "lucide-react";

interface Client {
  id: string;
  name: string;
  email: string;
  totalAssets: number;
  lastConsultation: string;
  riskProfile: string;
  investmentPreferences: string[];
  accounts: {
    type: string;
    balance: number;
  }[];
}

const mockClient: Client = {
  id: "1",
  name: "John Doe",
  email: "john@example.com",
  totalAssets: 150000,
  lastConsultation: "2024-03-20",
  riskProfile: "Moderate",
  investmentPreferences: ["Stocks", "Bonds", "Real Estate"],
  accounts: [
    { type: "Savings", balance: 50000 },
    { type: "Investment", balance: 100000 },
  ],
};

export function ClientDetails({ clientId }: { clientId: string }) {
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setClient(mockClient);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [clientId]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!client) {
    return <div>Client not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/client-summaries">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">{client.name}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="p-4 border rounded-lg">
            <h2 className="font-semibold mb-2">Contact Information</h2>
            <p className="text-gray-600">{client.email}</p>
          </div>

          <div className="p-4 border rounded-lg">
            <h2 className="font-semibold mb-2">Financial Overview</h2>
            <p className="text-gray-600">
              Total Assets: ${client.totalAssets.toLocaleString()}
            </p>
            <div className="mt-2">
              {client.accounts.map((account) => (
                <p key={account.type} className="text-sm text-gray-500">
                  {account.type}: ${account.balance.toLocaleString()}
                </p>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4 border rounded-lg">
            <h2 className="font-semibold mb-2">Investment Profile</h2>
            <p className="text-gray-600">Risk Profile: {client.riskProfile}</p>
            <div className="mt-2">
              <p className="text-sm font-medium">Investment Preferences:</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {client.investmentPreferences.map((preference) => (
                  <span
                    key={preference}
                    className="px-2 py-1 bg-gray-100 rounded-full text-sm"
                  >
                    {preference}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Link href={`/clients/${clientId}/annotations`}>
              <Button className="w-full" variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                View Portfolio
              </Button>
            </Link>
            <Link href={`/clients/${clientId}/report`}>
              <Button className="w-full" variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                Generate Report
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}