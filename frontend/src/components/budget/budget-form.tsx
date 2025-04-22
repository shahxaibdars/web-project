"use client"

import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Edit } from "lucide-react"

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import type { BudgetCategory } from "@/types"
import { categories } from "@/services/transactionService"
import { getCurrentUser } from "@/services/authService"
import { getMonthName } from "@/lib/utils"

const formSchema = z.object({
  category: z.string().min(1, { message: "Please select a category" }),
  limit: z.coerce.number().positive({ message: "Limit must be positive" }),
})

type FormValues = z.infer<typeof formSchema>

interface BudgetFormProps {
  month: number
  year: number
  existingCategory?: BudgetCategory
  onSuccess: () => void
  hasTransactions: boolean
}

export function BudgetForm({ month, year, existingCategory, onSuccess, hasTransactions }: BudgetFormProps) {
  const [open, setOpen] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: existingCategory?.category || "",
      limit: existingCategory?.limit || 0,
    },
  })

  const onSubmit = async (values: FormValues) => {
    // Budget editing is disabled
    return
  }

  if (!hasTransactions) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {existingCategory ? (
          <Button variant="ghost" size="icon" disabled>
            <Edit className="h-4 w-4" />
          </Button>
        ) : (
          <Button disabled>Set Budget</Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            Budget editing is disabled
          </DialogTitle>
          <DialogDescription>
            Budgets are automatically managed based on your transactions.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
