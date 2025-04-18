"use client"

import { useState } from "react"
import { BillForm } from "../../../components/bills/bill-form"
import { BillList } from "../../../components/bills/bill-list"

export default function BillsPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleBillAdded = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold">Bills</h1>
        <BillForm onSuccess={handleBillAdded} />
      </div>

      <BillList refreshTrigger={refreshTrigger} />
    </div>
  )
}
