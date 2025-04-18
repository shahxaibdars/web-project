import type { Transaction } from "../types"

// Categories for transactions
export const categories = [
  "Housing",
  "Transportation",
  "Food",
  "Utilities",
  "Insurance",
  "Healthcare",
  "Savings",
  "Personal",
  "Entertainment",
  "Debt",
  "Education",
  "Gifts",
  "Income",
  "Investments",
  "Other",
]

// Category colors for charts
export const categoryColors: Record<string, string> = {
  Housing: "#10B981",
  Transportation: "#3B82F6",
  Food: "#F59E0B",
  Utilities: "#8B5CF6",
  Insurance: "#EC4899",
  Healthcare: "#EF4444",
  Savings: "#06B6D4",
  Personal: "#F97316",
  Entertainment: "#6366F1",
  Debt: "#DC2626",
  Education: "#0EA5E9",
  Gifts: "#D946EF",
  Income: "#22C55E",
  Investments: "#14B8A6",
  Other: "#64748B",
}

// Generate dummy transactions
const generateDummyTransactions = (userId: string): Transaction[] => {
  const transactions: Transaction[] = []
  const currentDate = new Date()

  // Generate transactions for the last 3 months
  for (let i = 0; i < 50; i++) {
    const date = new Date(currentDate)
    date.setDate(date.getDate() - Math.floor(Math.random() * 90)) // Random date in the last 90 days

    const type = Math.random() > 0.3 ? "expense" : "income"
    const category = type === "income" ? "Income" : categories[Math.floor(Math.random() * (categories.length - 1))]

    const amount = type === "income" ? Math.floor(Math.random() * 3000) + 1000 : Math.floor(Math.random() * 500) + 10

    transactions.push({
      id: `trans-${i}`,
      userId,
      amount,
      category,
      date,
      description: `${type === "income" ? "Received" : "Paid for"} ${category.toLowerCase()}`,
      type,
    })
  }

  return transactions.sort((a, b) => b.date.getTime() - a.date.getTime())
}

// Dummy transactions store
const dummyTransactions: Record<string, Transaction[]> = {}

// Get transactions for a user
export const getTransactions = async (userId: string): Promise<Transaction[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (!dummyTransactions[userId]) {
        dummyTransactions[userId] = generateDummyTransactions(userId)
      }
      resolve(dummyTransactions[userId])
    }, 500)
  })
}

// Add a new transaction
export const addTransaction = async (transaction: Omit<Transaction, "id">): Promise<Transaction> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newTransaction: Transaction = {
        ...transaction,
        id: `trans-${Date.now()}`,
      }

      if (!dummyTransactions[transaction.userId]) {
        dummyTransactions[transaction.userId] = []
      }

      dummyTransactions[transaction.userId].unshift(newTransaction)
      resolve(newTransaction)
    }, 500)
  })
}

// Delete a transaction
export const deleteTransaction = async (userId: string, transactionId: string): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (dummyTransactions[userId]) {
        dummyTransactions[userId] = dummyTransactions[userId].filter((t) => t.id !== transactionId)
      }
      resolve()
    }, 500)
  })
}

// Get transaction statistics
export const getTransactionStats = async (
  userId: string,
): Promise<{
  totalIncome: number
  totalExpense: number
  netSavings: number
  categorySummary: Record<string, number>
}> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (!dummyTransactions[userId]) {
        dummyTransactions[userId] = generateDummyTransactions(userId)
      }

      const transactions = dummyTransactions[userId]

      const totalIncome = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

      const totalExpense = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

      const categorySummary: Record<string, number> = {}

      transactions
        .filter((t) => t.type === "expense")
        .forEach((t) => {
          if (!categorySummary[t.category]) {
            categorySummary[t.category] = 0
          }
          categorySummary[t.category] += t.amount
        })

      resolve({
        totalIncome,
        totalExpense,
        netSavings: totalIncome - totalExpense,
        categorySummary,
      })
    }, 500)
  })
}
