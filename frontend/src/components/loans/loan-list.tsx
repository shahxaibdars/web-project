"use client"

import { useState, useEffect } from "react"
import { BanknoteIcon, Trash2, Pencil } from "lucide-react"
import type { LoanApplication } from "@/types"
import { formatCurrency, formatDate } from "@/lib/utils"
import { getLoanApplications, deleteLoan, updateLoan } from "@/services/loanService"
import { getCurrentUser } from "@/services/authService"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

const editFormSchema = z.object({
  amount: z.coerce.number().positive({ message: "Amount must be positive" }),
  purpose: z.string().min(1, { message: "Purpose is required" }),
})

type EditFormValues = z.infer<typeof editFormSchema>

interface LoanListProps {
  refreshTrigger?: number
}

export function LoanList({ refreshTrigger = 0 }: LoanListProps) {
  const [loans, setLoans] = useState<LoanApplication[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingLoan, setEditingLoan] = useState<LoanApplication | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const editForm = useForm<EditFormValues>({
    resolver: zodResolver(editFormSchema),
    defaultValues: {
      amount: 0,
      purpose: "",
    },
  })

  const fetchLoans = async () => {
    setIsLoading(true)
    const user = getCurrentUser()
    if (user) {
      try {
        const data = await getLoanApplications(user._id)
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

  const handleDelete = async (loanId: string) => {
    try {
      await deleteLoan(loanId)
      fetchLoans()
    } catch (error) {
      console.error("Error deleting loan:", error)
    }
  }

  const handleEditClick = (loan: LoanApplication) => {
    setEditingLoan(loan)
    editForm.reset({
      amount: loan.amount,
      purpose: loan.purpose,
    })
    setIsEditDialogOpen(true)
  }

  const handleEdit = async (values: EditFormValues) => {
    if (!editingLoan) return

    try {
      await updateLoan(editingLoan._id, values)
      setEditingLoan(null)
      setIsEditDialogOpen(false)
      fetchLoans()
    } catch (error) {
      console.error("Error updating loan:", error)
    }
  }

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
            <Card key={loan._id} className="glass-card border-emerald/20">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Loan Application</CardTitle>
                    <CardDescription>Applied on {formatDate(loan.createdAt)}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    {loan.status === "pending" && (
                      <>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleEditClick(loan)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your loan application.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(loan._id)}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </>
                    )}
                    {getStatusBadge(loan.status)}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-full bg-emerald/20">
                    <BanknoteIcon className="h-4 w-4 text-emerald" />
                  </div>
                  <div className="text-sm text-muted-foreground">{loan.purpose}</div>
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

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Loan Application</DialogTitle>
            <DialogDescription>Update your loan details.</DialogDescription>
          </DialogHeader>
          <form onSubmit={editForm.handleSubmit(handleEdit)} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Amount</label>
              <Input
                type="number"
                {...editForm.register("amount")}
                step="0.01"
              />
              {editForm.formState.errors.amount && (
                <p className="text-sm text-destructive">{editForm.formState.errors.amount.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Purpose</label>
              <Input {...editForm.register("purpose")} />
              {editForm.formState.errors.purpose && (
                <p className="text-sm text-destructive">{editForm.formState.errors.purpose.message}</p>
              )}
            </div>
            <DialogFooter>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
