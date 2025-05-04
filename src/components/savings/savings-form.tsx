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

import type { SavingsGoal } from "@/types"
import { addSavingsGoal, updateSavingsGoal } from "@/services/savingsService"
import { getCurrentUser } from "@/services/authService"

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  targetAmount: z.coerce.number().positive({ message: "Target amount must be positive" }),
  currentAmount: z.coerce.number().min(0, { message: "Current amount cannot be negative" }),
})

type FormValues = z.infer<typeof formSchema>

interface SavingsFormProps {
  existingGoal?: SavingsGoal
  onSuccess: () => void
}

export function SavingsForm({ existingGoal, onSuccess }: SavingsFormProps) {
  const [open, setOpen] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: existingGoal?.name || "",
      targetAmount: existingGoal?.targetAmount || 0,
      currentAmount: existingGoal?.currentAmount || 0,
    },
  })

  const onSubmit = async (values: FormValues) => {
    const user = await getCurrentUser()
    if (!user) return

    try {
      if (existingGoal) {
        await updateSavingsGoal({
          ...existingGoal,
          name: values.name,
          targetAmount: values.targetAmount,
          currentAmount: values.currentAmount,
        })
      } else {
        await addSavingsGoal({
          userId: user.id,
          name: values.name,
          targetAmount: values.targetAmount,
          currentAmount: values.currentAmount,
        })
      }

      form.reset()
      setOpen(false)
      onSuccess()
    } catch (error) {
      console.error("Error saving goal:", error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {existingGoal ? (
          <Button variant="outline" size="sm">
            Edit
          </Button>
        ) : (
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Savings Goal
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{existingGoal ? "Edit" : "Add"} Savings Goal</DialogTitle>
          <DialogDescription>
            {existingGoal ? "Update your savings goal details below." : "Enter the details of your savings goal below."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Goal Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Vacation, Emergency Fund, etc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="targetAmount"
              render={({ field }: any) => (
                <FormItem>
                  <FormLabel>Target Amount</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0.00" {...field} step="0.01" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="currentAmount"
              render={({ field }: any) => (
                <FormItem>
                  <FormLabel>Current Amount</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0.00" {...field} step="0.01" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit">{existingGoal ? "Update" : "Add"} Goal</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
