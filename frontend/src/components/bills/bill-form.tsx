"use client"

import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CalendarIcon, Plus } from "lucide-react"
import { format } from "date-fns"

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
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"

import type { Bill } from "@/types"
import { addBill, updateBill } from "@/services/billService"
import { getCurrentUser } from "@/services/authService"

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  amount: z.coerce.number().positive({ message: "Amount must be positive" }),
  dueDate: z.date(),
  isRecurring: z.boolean().default(false).optional(),
})

type FormValues = z.infer<typeof formSchema>

interface BillFormProps {
  existingBill?: Bill
  onSuccess: () => void
}

export function BillForm({ existingBill, onSuccess }: BillFormProps) {
  const [open, setOpen] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: existingBill?.name || "",
      amount: existingBill?.amount || undefined,
      dueDate: existingBill?.dueDate ? new Date(existingBill.dueDate) : new Date(),
      isRecurring: existingBill?.isRecurring ?? false,
    },
  })

  const onSubmit = async (values: FormValues) => {
    const user = getCurrentUser()
    if (!user) return

    try {
      if (existingBill) {
        await updateBill({
          ...existingBill,
          name: values.name,
          amount: values.amount,
          dueDate: values.dueDate,
          isRecurring: values.isRecurring ?? false,
        })
      } else {
        await addBill({
          userId: user.id,
          name: values.name,
          amount: values.amount,
          dueDate: values.dueDate,
          isRecurring: values.isRecurring ?? false,
        })
      }

      form.reset()
      setOpen(false)
      onSuccess()
    } catch (error) {
      console.error("Error saving bill:", error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {existingBill ? (
          <Button variant="outline" size="sm">
            Edit
          </Button>
        ) : (
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Bill
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{existingBill ? "Edit" : "Add"} Bill</DialogTitle>
          <DialogDescription>
            {existingBill ? "Update your bill details below." : "Enter the details of your bill below."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }: any) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Rent, Electricity, etc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }: any) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0.00" {...field} step="0.01" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }: any) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Due Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button variant={"outline"} className="w-full pl-3 text-left font-normal">
                          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isRecurring"
              render={({ field }: any) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Recurring Bill</FormLabel>
                    <p className="text-sm text-muted-foreground">This bill repeats on a regular basis.</p>
                  </div>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit">{existingBill ? "Update" : "Add"} Bill</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
