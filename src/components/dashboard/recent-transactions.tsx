"use client"

import { useState, useEffect } from "react"
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react"
import type { Transaction } from "@/types"
import { formatCurrency, formatDate } from "@/lib/utils"
import { getTransactions } from "@/services/transactionService"
import { getCurrentUser } from "@/services/authService"

interface RecentTransactionsProps {
  refreshTrigger?: number
}

export function RecentTransactions({ refreshTrigger = 0 }: RecentTransactionsProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchTransactions = async () => {
      setIsLoading(true)
      try {
        const user = await getCurrentUser()
        if (user) {
          const data = await getTransactions(user.id)
          setTransactions(data.slice(0, 5)) // Get only the 5 most recent
        }
      } catch (error) {
        console.error("Error fetching transactions:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTransactions()
  }, [refreshTrigger])

  if (isLoading) {
    return (
      <div className="glass-card rounded-xl p-6 h-[300px] flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading transactions...</div>
      </div>
    )
  }

  return (
    <div className="glass-card rounded-xl p-6">
      <h3 className="text-lg font-medium mb-4">Recent Transactions</h3>
      <div className="space-y-4">
        {transactions.length > 0 ? (
          transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between py-2 border-b border-emerald/10 last:border-0"
            >
              <div className="flex items-center">
                <div
                  className={`p-2 rounded-full ${
                    transaction.type === "income" ? "bg-emerald/20" : "bg-destructive/20"
                  }`}
                >
                  {transaction.type === "income" ? (
                    <ArrowUpIcon className="h-4 w-4 text-emerald" />
                  ) : (
                    <ArrowDownIcon className="h-4 w-4 text-destructive" />
                  )}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">{transaction.category}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(transaction.date)}</p>
                </div>
              </div>
              <div
                className={`text-sm font-medium ${transaction.type === "income" ? "text-emerald" : "text-destructive"}`}
              >
                {transaction.type === "income" ? "+" : "-"}
                {formatCurrency(transaction.amount)}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-muted-foreground">No recent transactions</div>
        )}
      </div>
    </div>
  )
}
