import type { Budget, BudgetCategory } from "../types"
import { categories } from "./transactionService"

// Generate dummy budget
const generateDummyBudget = (userId: string): Budget => {
  const currentDate = new Date()
  const month = currentDate.getMonth()
  const year = currentDate.getFullYear()

  const budgetCategories: BudgetCategory[] = categories
    .filter((cat) => cat !== "Income" && cat !== "Investments")
    .map((category) => ({
      category,
      limit: Math.floor(Math.random() * 1000) + 200,
      spent: Math.floor(Math.random() * 800),
    }))

  return {
    id: `budget-${userId}-${month}-${year}`,
    userId,
    month,
    year,
    categories: budgetCategories,
  }
}

// Dummy budgets store
const dummyBudgets: Record<string, Budget> = {}

// Get budget for a user
export const getBudget = async (userId: string, month?: number, year?: number): Promise<Budget> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const currentDate = new Date()
      const targetMonth = month !== undefined ? month : currentDate.getMonth()
      const targetYear = year !== undefined ? year : currentDate.getFullYear()

      const budgetKey = `${userId}-${targetMonth}-${targetYear}`

      if (!dummyBudgets[budgetKey]) {
        const newBudget = generateDummyBudget(userId)
        newBudget.month = targetMonth
        newBudget.year = targetYear
        dummyBudgets[budgetKey] = newBudget
      }

      resolve(dummyBudgets[budgetKey])
    }, 500)
  })
}

// Update budget category
export const updateBudgetCategory = async (
  userId: string,
  month: number,
  year: number,
  category: string,
  limit: number,
): Promise<Budget> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const budgetKey = `${userId}-${month}-${year}`

      if (!dummyBudgets[budgetKey]) {
        dummyBudgets[budgetKey] = generateDummyBudget(userId)
        dummyBudgets[budgetKey].month = month
        dummyBudgets[budgetKey].year = year
      }

      const budget = dummyBudgets[budgetKey]
      const categoryIndex = budget.categories.findIndex((c) => c.category === category)

      if (categoryIndex >= 0) {
        budget.categories[categoryIndex].limit = limit
      } else {
        budget.categories.push({
          category,
          limit,
          spent: 0,
        })
      }

      resolve(budget)
    }, 500)
  })
}

// Get budget summary
export const getBudgetSummary = async (
  userId: string,
): Promise<{
  totalBudgeted: number
  totalSpent: number
  remainingBudget: number
  mostOverspentCategory?: string
  healthiestCategory?: string
}> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const currentDate = new Date()
      const month = currentDate.getMonth()
      const year = currentDate.getFullYear()
      const budgetKey = `${userId}-${month}-${year}`

      if (!dummyBudgets[budgetKey]) {
        dummyBudgets[budgetKey] = generateDummyBudget(userId)
      }

      const budget = dummyBudgets[budgetKey]

      const totalBudgeted = budget.categories.reduce((sum, cat) => sum + cat.limit, 0)
      const totalSpent = budget.categories.reduce((sum, cat) => sum + cat.spent, 0)

      // Find most overspent category
      let mostOverspentCategory: string | undefined
      let highestOverspentRatio = 0

      // Find healthiest category
      let healthiestCategory: string | undefined
      let lowestSpentRatio = 1

      budget.categories.forEach((cat) => {
        if (cat.limit > 0) {
          const ratio = cat.spent / cat.limit

          if (ratio > 1 && ratio > highestOverspentRatio) {
            highestOverspentRatio = ratio
            mostOverspentCategory = cat.category
          }

          if (ratio < lowestSpentRatio && cat.spent > 0) {
            lowestSpentRatio = ratio
            healthiestCategory = cat.category
          }
        }
      })

      resolve({
        totalBudgeted,
        totalSpent,
        remainingBudget: totalBudgeted - totalSpent,
        mostOverspentCategory,
        healthiestCategory,
      })
    }, 500)
  })
}
