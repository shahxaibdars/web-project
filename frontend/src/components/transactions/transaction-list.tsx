"use client"

import { useState, useEffect } from "react"
import { ArrowDownIcon, ArrowUpIcon, Search, Trash2, Pencil, ChevronLeft, ChevronRight } from "lucide-react"
import type { Transaction } from "@/types"
import { formatCurrency, formatDate, getMonthName } from "@/lib/utils"
import { getTransactions, deleteTransaction } from "@/services/transactionService"
import { getCurrentUser } from "@/services/authService"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { categories } from "@/services/transactionService"
import { TransactionForm } from "@/components/transactions/transaction-form"

interface TransactionListProps {
  refreshTrigger?: number
}

export function TransactionList({ refreshTrigger = 0 }: TransactionListProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null)
  const [transactionToEdit, setTransactionToEdit] = useState<Transaction | null>(null)
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())

  const fetchTransactions = async () => {
    setIsLoading(true)
    const user = getCurrentUser()
    if (user) {
      try {
        console.log('Fetching transactions for:', { month: currentMonth, year: currentYear })
        const { transactions: data } = await getTransactions(user._id, 1, 10, {
          month: currentMonth,
          year: currentYear
        })
        console.log('Fetched transactions:', data)
        setTransactions(data)
        setFilteredTransactions(data)
      } catch (error) {
        console.error("Error fetching transactions:", error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [refreshTrigger, currentMonth, currentYear])

  const handlePreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  useEffect(() => {
    // Apply filters
    let filtered = [...transactions]

    if (searchTerm) {
      filtered = filtered.filter(
        (transaction) =>
          transaction.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          transaction.category.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter((transaction) => transaction.type === typeFilter)
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter((transaction) => transaction.category === categoryFilter)
    }

    setFilteredTransactions(filtered)
  }, [searchTerm, typeFilter, categoryFilter, transactions])

  const handleDelete = async () => {
    if (!transactionToDelete) return

    const user = getCurrentUser()
    if (!user) return

    try {
      await deleteTransaction(transactionToDelete)
      setTransactions((prev) => prev.filter((t) => t._id !== transactionToDelete))
      setTransactionToDelete(null)
    } catch (error) {
      console.error("Error deleting transaction:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="glass-card rounded-xl p-6 h-[400px] flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading transactions...</div>
      </div>
    )
  }

  return (
    <div className="glass-card rounded-xl p-6">
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            className="pl-9"
            value={searchTerm}
            onChange={(e: any) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={handlePreviousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium min-w-[120px] text-center">
              {getMonthName(currentMonth)} {currentYear}
            </span>
            <Button variant="outline" size="icon" onClick={handleNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
            </SelectContent>
          </Select>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-emerald/20">
              <th className="text-left py-3 px-4 font-medium">Type</th>
              <th className="text-left py-3 px-4 font-medium">Category</th>
              <th className="text-left py-3 px-4 font-medium">Date</th>
              <th className="text-left py-3 px-4 font-medium">Description</th>
              <th className="text-right py-3 px-4 font-medium">Amount</th>
              <th className="text-right py-3 px-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((transaction) => (
                <tr key={transaction._id} className="border-b border-emerald/10 hover:bg-charcoal/30 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <div
                        className={`p-1 rounded-full ${
                          transaction.type === "income" ? "bg-emerald/20" : "bg-destructive/20"
                        }`}
                      >
                        {transaction.type === "income" ? (
                          <ArrowUpIcon className="h-3 w-3 text-emerald" />
                        ) : (
                          <ArrowDownIcon className="h-3 w-3 text-destructive" />
                        )}
                      </div>
                      <span className="ml-2 text-sm capitalize">{transaction.type}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm">{transaction.category}</td>
                  <td className="py-3 px-4 text-sm">{formatDate(transaction.date)}</td>
                  <td className="py-3 px-4 text-sm">{transaction.description || "-"}</td>
                  <td
                    className={`py-3 px-4 text-sm text-right font-medium ${
                      transaction.type === "income" ? "text-emerald" : "text-destructive"
                    }`}
                  >
                    {transaction.type === "income" ? "+" : "-"}
                    {formatCurrency(transaction.amount)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => setTransactionToEdit(transaction)}
                      >
                        <Pencil className="h-4 w-4 text-muted-foreground hover:text-primary" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => setTransactionToDelete(transaction._id)}>
                            <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the transaction.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-8 text-center text-muted-foreground">
                  No transactions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {transactionToEdit && (
        <TransactionForm
          initialData={transactionToEdit}
          onSuccess={() => {
            setTransactionToEdit(null)
            fetchTransactions()
          }}
        />
      )}
    </div>
  )
}
