"use client"

import { useState } from "react"
import { TransactionForm } from "@/components/transactions/transaction-form"
import { TransactionList } from "@/components/transactions/transaction-list"

export default function TransactionsPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleTransactionAdded = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold">Transactions</h1>
        <TransactionForm onSuccess={handleTransactionAdded} />
      </div>

      <TransactionList refreshTrigger={refreshTrigger} />
    </div>
  )
}
