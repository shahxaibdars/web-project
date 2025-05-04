"use client"

import { useState, useEffect } from "react"
import { Calendar } from "lucide-react"
import type { Bill } from "@/types"
import { formatCurrency, getDaysUntil } from "@/lib/utils"
import { getUpcomingBills } from "@/services/billService"
import { getCurrentUser } from "@/services/authService"

interface UpcomingBillsProps {
  refreshTrigger?: number
}

export function UpcomingBills({ refreshTrigger = 0 }: UpcomingBillsProps) {
  const [bills, setBills] = useState<Bill[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchBills = async () => {
      setIsLoading(true)
      try {
        const user = await getCurrentUser()
        if (user) {
          const data = await getUpcomingBills(user.id, 14) // Get bills due in the next 14 days
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

  if (isLoading) {
    return (
      <div className="glass-card rounded-xl p-6 h-[300px] flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading bills...</div>
      </div>
    )
  }

  return (
    <div className="glass-card rounded-xl p-6">
      <h3 className="text-lg font-medium mb-4">Upcoming Bills</h3>
      <div className="space-y-4">
        {bills.length > 0 ? (
          bills.map((bill) => {
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
                className="flex items-center justify-between py-2 border-b border-emerald/10 last:border-0"
              >
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-emerald/20">
                    <Calendar className="h-4 w-4 text-emerald" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">{bill.name}</p>
                    <p className="text-xs text-muted-foreground">{new Date(bill.dueDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="text-sm font-medium">{formatCurrency(bill.amount)}</div>
                  <div className={`text-xs ${urgencyClass}`}>
                    {daysUntil === 0
                      ? "Due today"
                      : daysUntil < 0
                        ? `Overdue by ${Math.abs(daysUntil)} days`
                        : `Due in ${daysUntil} days`}
                  </div>
                </div>
              </div>
            )
          })
        ) : (
          <div className="text-center py-4 text-muted-foreground">No upcoming bills</div>
        )}
      </div>
    </div>
  )
}
