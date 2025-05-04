"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { calculateTax } from "@/services/loanDistributorService"
import { toast } from "@/components/ui/use-toast"
import type { TaxCalculation } from "@/types"

export function TaxCalculator() {
  const [amount, setAmount] = useState<string>("")
  const [calculation, setCalculation] = useState<TaxCalculation | null>(null)
  const [loading, setLoading] = useState(false)

  const handleCalculate = async () => {
    const numericAmount = parseFloat(amount)
    if (isNaN(numericAmount) || numericAmount <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const result = await calculateTax(numericAmount)
      setCalculation(result)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to calculate tax",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Tax Calculator</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Calculate Loan Tax</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Loan Amount</Label>
              <div className="flex gap-2">
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter loan amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                <Button onClick={handleCalculate} disabled={loading}>
                  {loading ? "Calculating..." : "Calculate"}
                </Button>
              </div>
            </div>

            {calculation && (
              <div className="space-y-4 mt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Principal Amount</p>
                    <p className="text-lg font-semibold">
                      ${calculation.principal.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tax Rate</p>
                    <p className="text-lg font-semibold">{(calculation.taxRate * 100).toFixed(1)}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tax Amount</p>
                    <p className="text-lg font-semibold">
                      ${calculation.taxAmount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Net Amount</p>
                    <p className="text-lg font-semibold">
                      ${calculation.netAmount.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 