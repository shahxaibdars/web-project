"use client"

import { useState, useEffect } from "react"
import { BanknoteIcon } from "lucide-react"
import type { LoanApplication } from "@/types"
import { formatCurrency, formatDate } from "@/lib/utils"
import { getLoanApplications } from "@/services/loanService"
import { getCurrentUser } from "@/services/authService"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface LoanListProps {
  refreshTrigger?: number
}

export function LoanList({ refreshTrigger = 0 }: LoanListProps) {
  const [loans, setLoans] = useState<LoanApplication[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchLoans = async () => {
    setIsLoading(true)
    const user = getCurrentUser()
    if (user) {
      try {
        const data = await getLoanApplications(user.id)
        setLoans(data)
      } catch (error) {
        console.error("Error fetching loans:", error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  useEffect(() => {
    fetchLoans()
  }, [refreshTrigger])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-emerald text-emerald-950">Approved</Badge>
      case "rejected":
        return <Badge className="bg-destructive text-destructive-foreground">Rejected</Badge>
      case "pending":
        return <Badge className="bg-amber-500 text-amber-950">Pending</Badge>
      default:
        return null
    }
  }

  if (isLoading) {
    return (
      <div className="glass-card rounded-xl p-6 h-[400px] flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading loan applications...</div>
      </div>
    )
  }

  return (
    <div>
      <div className="grid grid-dashboard">
        {loans.length > 0 ? (
          loans.map((loan) => (
            <Card key={loan.id} className="glass-card border-emerald/20">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Loan Application</CardTitle>
                    <CardDescription>Applied on {formatDate(loan.createdAt)}</CardDescription>
                  </div>
                  {getStatusBadge(loan.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-full bg-emerald/20">
                    <BanknoteIcon className="h-4 w-4 text-emerald" />
                  </div>
                  <div className="text-sm text-muted-foreground">Loan ID: {loan.id}</div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Loan Amount:</span>
                    <span className="font-medium">{formatCurrency(loan.amount)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax:</span>
                    <span>{formatCurrency(loan.tax)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-medium pt-2 border-t border-emerald/10">
                    <span>Total Repayable:</span>
                    <span>{formatCurrency(loan.amount + loan.tax)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12 glass-card rounded-xl">
            <p className="text-muted-foreground mb-4">No loan applications found</p>
          </div>
        )}
      </div>
    </div>
  )
}
