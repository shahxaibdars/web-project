"use client"

import { BudgetOverview } from "../../../components/budget/budget-overview"

export default function BudgetPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Budget</h1>

      <BudgetOverview />
    </div>
  )
}
