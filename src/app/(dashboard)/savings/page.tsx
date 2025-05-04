"use client"

import { useState } from "react"
import { SavingsForm } from "@/components/savings/savings-form"
import { SavingsList } from "@/components/savings/savings-list"

export default function SavingsPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleSavingsAdded = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold">Savings Goals</h1>
        <SavingsForm onSuccess={handleSavingsAdded} />
      </div>

      <SavingsList refreshTrigger={refreshTrigger} />
    </div>
  )
}
