"use client"

import { useState, useEffect } from "react"
import { Calendar } from "lucide-react"
import type { Bill } from "@/types"
import { formatCurrency, getDaysUntil } from "@/lib/utils"
import { getBills, deleteBill } from "@/services/billService"
import { getCurrentUser } from "@/services/authService"
import { Button } from "@/components/ui/button"
import { BillForm } from "./bill-form"
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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface BillListProps {
  refreshTrigger?: number
}

export function BillList({ refreshTrigger = 0 }: BillListProps) {
  const [bills, setBills] = useState<Bill[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [billToDelete, setBillToDelete] = useState<string | null>(null)

  const fetchBills = async () => {
    setIsLoading(true)
    const user = getCurrentUser()
    if (user) {
      try {
        const data = await getBills(user.id)
        setBills(data)
      } catch (error) {
        console.error("Error fetching bills:", error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  useEffect(() => {
    fetchBills()
  }, [refreshTrigger])

  const handleDelete = async () => {
    if (!billToDelete) return

    const user = getCurrentUser()
    if (!user) return

    try {
      await deleteBill(user.id, billToDelete)
      setBills((prev) => prev.filter((b) => b.id !== billToDelete))
      setBillToDelete(null)
    } catch (error) {
      console.error("Error deleting bill:", error)
    }
  }

  const getBillStatusClass = (dueDate: Date) => {
    const daysUntil = getDaysUntil(dueDate)

    if (daysUntil <= 0) {
      return "bg-destructive text-destructive-foreground"
    } else if (daysUntil <= 3) {
      return "bg-amber-500 text-amber-950"
    } else {
      return "bg-emerald text-emerald-950"
    }
  }

  const getBillStatusText = (dueDate: Date) => {
    const daysUntil = getDaysUntil(dueDate)

    if (daysUntil < 0) {
      return `Overdue by ${Math.abs(daysUntil)} days`
    } else if (daysUntil === 0) {
      return "Due today"
    } else if (daysUntil === 1) {
      return "Due tomorrow"
    } else {
      return `Due in ${daysUntil} days`
    }
  }

  if (isLoading) {
    return (
      <div className="glass-card rounded-xl p-6 h-[400px] flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading bills...</div>
      </div>
    )
  }

  return (
    <div>
      <div className="grid grid-dashboard">
        {bills.length > 0 ? (
          bills.map((bill) => (
            <Card key={bill.id} className="glass-card border-emerald/20">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{bill.name}</CardTitle>
                    <CardDescription>Due on {new Date(bill.dueDate).toLocaleDateString()}</CardDescription>
                  </div>
                  {bill.isRecurring && (
                    <Badge variant="outline" className="border-emerald/30 text-emerald">
                      Recurring
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-full bg-emerald/20">
                      <Calendar className="h-4 w-4 text-emerald" />
                    </div>
                    <Badge className={getBillStatusClass(bill.dueDate)}>{getBillStatusText(bill.dueDate)}</Badge>
                  </div>
                  <div className="text-xl font-bold">{formatCurrency(bill.amount)}</div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <BillForm existingBill={bill} onSuccess={fetchBills} />
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm" onClick={() => setBillToDelete(bill.id)}>
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Bill</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this bill? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel onClick={() => setBillToDelete(null)}>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12 glass-card rounded-xl">
            <p className="text-muted-foreground mb-4">No bills found</p>
            <BillForm onSuccess={fetchBills} />
          </div>
        )}
      </div>
    </div>
  )
}
