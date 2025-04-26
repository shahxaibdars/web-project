"use client"

import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { applyForLoan } from "@/services/loanService"
import { getCurrentUser } from "@/services/authService"
import { formatCurrency } from "@/lib/utils"

const formSchema = z.object({
  amount: z.coerce.number().positive({ message: "Amount must be positive" }),
  purpose: z.string().min(1, { message: "Purpose is required" }),
})

type FormValues = z.infer<typeof formSchema>

interface LoanFormProps {
  onSuccess: () => void
}

export function LoanForm({ onSuccess }: LoanFormProps) {
  const [open, setOpen] = useState(false)
  const [calculatedTax, setCalculatedTax] = useState(0)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
      purpose: "",
    },
  })

  const calculateTax = (amount: number) => {
    return amount * 0.05 // 5% tax
  }

  const onValueChange = (value: number) => {
    setCalculatedTax(calculateTax(value || 0))
  }

  const onSubmit = async (values: FormValues) => {
    const user = getCurrentUser()
    if (!user) return

    try {
      await applyForLoan(user._id, values.amount, values.purpose)
      form.reset()
      setOpen(false)
      onSuccess()
    } catch (error) {
      console.error("Error applying for loan:", error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Apply for Loan
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Apply for Loan</DialogTitle>
          <DialogDescription>Enter the loan amount you wish to apply for.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }: any) => (
                <FormItem>
                  <FormLabel>Loan Amount</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0.00"
                      {...field}
                      step="0.01"
                      onChange={(e: any) => {
                        field.onChange(e)
                        onValueChange(Number.parseFloat(e.target.value) || 0)
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="purpose"
              render={({ field }: any) => (
                <FormItem>
                  <FormLabel>Loan Purpose</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter loan purpose"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="rounded-md border p-4 space-y-2">
              <h4 className="text-sm font-medium">Loan Summary</h4>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Loan Amount:</span>
                <span>{formatCurrency(form.watch("amount") || 0)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax (5%):</span>
                <span>{formatCurrency(calculatedTax)}</span>
              </div>
              <div className="flex justify-between text-sm font-medium pt-2 border-t">
                <span>Total Repayable:</span>
                <span>{formatCurrency(Number(form.watch("amount") || 0) + Number(calculatedTax))}</span>
              </div>
            </div>

            <DialogFooter>
              <Button type="submit">Apply for Loan</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
