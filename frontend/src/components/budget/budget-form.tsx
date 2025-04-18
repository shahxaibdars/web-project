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
import { updateBudgetCategory } from "@/services/budgetService"
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
}

export function BudgetForm({ month, year, existingCategory, onSuccess }: BudgetFormProps) {
  const [open, setOpen] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: existingCategory?.category || "",
      limit: existingCategory?.limit || undefined,
    },
  })

  const onSubmit = async (values: FormValues) => {
    const user = getCurrentUser()
    if (!user) return

    try {
      await updateBudgetCategory(user.id, month, year, values.category, values.limit)

      form.reset()
      setOpen(false)
      onSuccess()
    } catch (error) {
      console.error("Error updating budget category:", error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {existingCategory ? (
          <Button variant="ghost" size="icon">
            <Edit className="h-4 w-4" />
          </Button>
        ) : (
          <Button>Set Budget</Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {existingCategory ? "Edit" : "Set"} Budget for {getMonthName(month)} {year}
          </DialogTitle>
          <DialogDescription>
            {existingCategory
              ? `Update your budget limit for ${existingCategory.category}.`
              : "Set a budget limit for a category."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!!existingCategory}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories
                        .filter((cat) => cat !== "Income" && cat !== "Investments")
                        .map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="limit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Budget Limit</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0.00" {...field} step="0.01" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit">{existingCategory ? "Update" : "Set"} Budget</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
