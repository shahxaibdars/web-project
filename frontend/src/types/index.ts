export interface User {
  _id: string
  name: string
  email: string
  role: "regular" | "premium" | "admin" | "bank_manager" | "loan_distributor" | "financial_advisor"
}

export interface Transaction {
  _id: string
  user: string
  type: 'income' | 'expense'
  amount: number
  category: string
  description?: string
  date: Date
  status: 'pending' | 'completed' | 'failed'
  tags?: string[]
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
  _id: string
  userId: string
  name: string
  dueDate: Date
  amount: number
  isRecurring: boolean
}

export interface SavingsGoal {
  _id: string
  name: string
  targetAmount: number
  currentAmount: number
  status: 'in_progress' | 'completed'
  user: string
  createdAt: string
  updatedAt: string
}

export interface LoanApplication {
  _id: string
  userId: string
  amount: number
  status: "pending" | "approved" | "rejected"
  tax: number
  createdAt: Date
  purpose: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

export interface DashboardStats {
  totalIncome: number
  totalExpense: number
  incomeChange: number
  expenseChange: number
  savingsProgress: number
  upcomingBills: number
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
