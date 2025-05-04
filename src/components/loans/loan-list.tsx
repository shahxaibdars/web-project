"use client"

import { useState, useEffect } from "react"
import { BanknoteIcon, Trash2 } from "lucide-react"
import type { LoanApplication } from "@/types"
import { formatCurrency, formatDate } from "@/lib/utils"
import { getLoanApplications, deleteLoanApplication } from "@/services/loanService"
import { getCurrentUser } from "@/services/authService"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"

interface LoanListProps {
  refreshTrigger?: number
}

export function LoanList({ refreshTrigger = 0 }: LoanListProps) {
  const [loans, setLoans] = useState<LoanApplication[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchLoans = async () => {
    setIsLoading(true)
    const user = await getCurrentUser()
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

  const handleDeleteLoan = async (loanId: string) => {
    console.log('Deleting loan with ID:', loanId); // Debug log

    if (!loanId) {
      toast({
        title: "Error",
        description: "Invalid loan ID",
        variant: "destructive",
      });
      return;
    }

    try {
      await deleteLoanApplication(loanId);
      toast({
        title: "Success",
        description: "Loan application deleted successfully",
      });
      fetchLoans(); // Refresh the list
    } catch (error) {
      console.error("Delete error:", error);
      toast({
        title: "Error",
        description: "Failed to delete loan application. Please try again.",
        variant: "destructive",
      });
    }
  };

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
          loans.map((loan, index) => (
            <Card key={`${loan._id}-${index}`} className="glass-card border-emerald/20">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Loan Application</CardTitle>
                    <CardDescription>Applied on {formatDate(loan.createdAt)}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(loan.status)}
                    {loan.status === "pending" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => {
                          console.log('Delete button clicked for loan:', loan); // Debug log
                          handleDeleteLoan(loan._id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-full bg-emerald/20">
                    <BanknoteIcon className="h-4 w-4 text-emerald" />
                  </div>
                  <div className="text-sm text-muted-foreground">Purpose: {loan.purpose}</div>
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
                    <span>{formatCurrency(Number(loan.amount) + Number(loan.tax))}</span>
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
