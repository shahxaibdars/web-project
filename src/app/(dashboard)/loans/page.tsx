"use client"

import { useState } from "react"
import { LoanForm } from "@/components/loans/loan-form"
import { LoanList } from "@/components/loans/loan-list"

export default function LoansPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleLoanAdded = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold">Loan Applications</h1>
        <LoanForm onSuccess={handleLoanAdded} />
      </div>

      <LoanList refreshTrigger={refreshTrigger} />
    </div>
  )
}
