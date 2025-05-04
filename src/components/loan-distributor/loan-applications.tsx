"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { getLoanApplications, updateLoanStatus } from "../../services/loanDistributorService"
import { toast } from "@/components/ui/use-toast"
import type { LoanApplication } from "../../types"

export function LoanApplications() {
  const [applications, setApplications] = useState<LoanApplication[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    loadApplications()
  }, [])

  const loadApplications = async () => {
    try {
      const data = await getLoanApplications()
      // Sort all applications by date (newest first)
      const sortedApplications = data.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      setApplications(sortedApplications)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load loan applications",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (applicationId: string, status: "approved" | "rejected") => {
    try {
      await updateLoanStatus(applicationId, status)
      toast({
        title: "Success",
        description: `Loan application ${status} successfully`,
      })
      loadApplications() // Reload the list to show updated applications
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update loan status",
        variant: "destructive",
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500"
      case "approved":
        return "bg-green-500"
      case "rejected":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Loan Applications</h2>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading applications...</div>
      ) : applications.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No applications found
        </div>
      ) : (
        <div className="grid gap-4">
          {applications.map((application) => (
            <Card key={application._id}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>{application.userName}</CardTitle>
                  <Badge className={getStatusColor(application.status)}>
                    {application.status.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Amount</p>
                    <p className="text-lg font-semibold">${application.amount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Purpose</p>
                    <p className="text-lg font-semibold">{application.purpose}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Submitted</p>
                    <p className="text-lg font-semibold">
                      {new Date(application.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  {application.status === "pending" && (
                    <>
                      <Button
                        variant="default"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleStatusUpdate(application._id, "approved")}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleStatusUpdate(application._id, "rejected")}
                      >
                        Reject
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
} 