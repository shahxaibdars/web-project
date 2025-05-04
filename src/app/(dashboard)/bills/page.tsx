"use client"

import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import type { Bill } from "@/types"
import { formatCurrency, getDaysUntil } from "@/lib/utils"
import { getBills, addBill, updateBill, deleteBill } from "@/services/billService"
import { getCurrentUser } from "@/services/authService"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useRefresh } from "@/contexts/refresh-context"

interface BillFormData {
  name: string
  dueDate: string
  amount: number
  isRecurring: boolean
}

export default function BillsPage() {
  const [bills, setBills] = useState<Bill[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newBill, setNewBill] = useState<BillFormData>({
    name: "",
    dueDate: new Date().toISOString().split("T")[0],
    amount: 0,
    isRecurring: true,
  })
  const { refreshTrigger, triggerRefresh } = useRefresh()

  useEffect(() => {
    const fetchBills = async () => {
      setIsLoading(true)
      try {
        const user = await getCurrentUser()
        if (user) {
          const data = await getBills(user.id)
          setBills(data)
        }
      } catch (error) {
        console.error("Error fetching bills:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBills()
  }, [refreshTrigger])

  const handleAddBill = async () => {
    try {
      const user = await getCurrentUser()
      if (user) {
        await addBill({
          ...newBill,
          userId: user.id,
          dueDate: new Date(newBill.dueDate),
        })
        setNewBill({
          name: "",
          dueDate: new Date().toISOString().split("T")[0],
          amount: 0,
          isRecurring: true,
        })
        setIsDialogOpen(false)
        triggerRefresh()
      }
    } catch (error) {
      console.error("Error adding bill:", error)
    }
  }

  const handleUpdateBill = async (bill: Bill) => {
    try {
      await updateBill(bill)
      triggerRefresh()
    } catch (error) {
      console.error("Error updating bill:", error)
    }
  }

  const handleDeleteBill = async (billId: string) => {
    try {
      const user = await getCurrentUser()
      if (user) {
        await deleteBill(user.id, billId)
        triggerRefresh()
      }
    } catch (error) {
      console.error("Error deleting bill:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="h-[400px] flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading bills...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Bills</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Bill
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Bill</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newBill.name}
                  onChange={(e) => setNewBill({ ...newBill, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={newBill.dueDate}
                  onChange={(e) => setNewBill({ ...newBill, dueDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  value={newBill.amount}
                  onChange={(e) => setNewBill({ ...newBill, amount: parseFloat(e.target.value) })}
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  id="isRecurring"
                  type="checkbox"
                  checked={newBill.isRecurring}
                  onChange={(e) => setNewBill({ ...newBill, isRecurring: e.target.checked })}
                />
                <Label htmlFor="isRecurring">Recurring Bill</Label>
              </div>
              <Button onClick={handleAddBill}>Add Bill</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {bills.map((bill) => {
          const daysUntil = getDaysUntil(bill.dueDate)
          let urgencyClass = "text-emerald"

          if (daysUntil <= 3) {
            urgencyClass = "text-destructive"
          } else if (daysUntil <= 7) {
            urgencyClass = "text-amber-500"
          }

          return (
            <div
              key={bill.id}
              className="flex items-center justify-between p-4 rounded-lg border border-emerald/10"
            >
              <div>
                <h3 className="font-medium">{bill.name}</h3>
                <p className="text-sm text-muted-foreground">
                  Due: {new Date(bill.dueDate).toLocaleDateString()}
                </p>
                <p className={`text-sm ${urgencyClass}`}>
                  {daysUntil === 0
                    ? "Due today"
                    : daysUntil < 0
                      ? `Overdue by ${Math.abs(daysUntil)} days`
                      : `Due in ${daysUntil} days`}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <span className="font-medium">{formatCurrency(bill.amount)}</span>
                <Button
                  variant="outline"
                  onClick={() => handleUpdateBill({ ...bill, isRecurring: !bill.isRecurring })}
                >
                  {bill.isRecurring ? "Mark as One-time" : "Mark as Recurring"}
                </Button>
                <Button variant="destructive" onClick={() => handleDeleteBill(bill.id)}>
                  Delete
                </Button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
