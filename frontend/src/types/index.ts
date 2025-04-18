export interface User {
  id: string
  name: string
  email: string
  role: "regular" | "premium" | "admin" | "bank_manager" | "loan_distributor" | "financial_advisor"
}

export interface Transaction {
  id: string
  userId: string
  amount: number
  category: string
  date: Date
  description?: string
  type: "income" | "expense"
}

export interface Budget {
  id: string
  userId: string
  month: number
  year: number
  categories: BudgetCategory[]
}

export interface BudgetCategory {
  category: string
  limit: number
  spent: number
}

export interface Bill {
  id: string
  userId: string
  name: string
  dueDate: Date
  amount: number
  isRecurring: boolean
}

export interface SavingsGoal {
  id: string
  userId: string
  name: string
  targetAmount: number
  currentAmount: number
}

export interface LoanApplication {
  id: string
  userId: string
  amount: number
  status: "pending" | "approved" | "rejected"
  tax: number
  createdAt: Date
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

export interface DashboardStats {
  totalIncome: number
  totalExpense: number
  savingsRate: number
  upcomingBills: number
  pendingLoans: number
}

export type CategoryColors = Record<string, string>

export interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor: string[]
    borderColor: string[]
    borderWidth: number
  }[]
}
