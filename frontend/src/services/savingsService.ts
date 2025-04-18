import type { SavingsGoal } from "../types"

// Generate dummy savings goals
const generateDummySavingsGoals = (userId: string): SavingsGoal[] => {
  return [
    {
      id: "savings-1",
      userId,
      name: "Emergency Fund",
      targetAmount: 10000,
      currentAmount: 5600,
    },
    {
      id: "savings-2",
      userId,
      name: "Vacation",
      targetAmount: 3000,
      currentAmount: 1200,
    },
    {
      id: "savings-3",
      userId,
      name: "New Car",
      targetAmount: 20000,
      currentAmount: 4500,
    },
    {
      id: "savings-4",
      userId,
      name: "Home Down Payment",
      targetAmount: 50000,
      currentAmount: 15000,
    },
  ]
}

// Dummy savings goals store
const dummySavingsGoals: Record<string, SavingsGoal[]> = {}

// Get savings goals for a user
export const getSavingsGoals = async (userId: string): Promise<SavingsGoal[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (!dummySavingsGoals[userId]) {
        dummySavingsGoals[userId] = generateDummySavingsGoals(userId)
      }

      resolve(dummySavingsGoals[userId])
    }, 500)
  })
}

// Add a new savings goal
export const addSavingsGoal = async (goal: Omit<SavingsGoal, "id">): Promise<SavingsGoal> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newGoal: SavingsGoal = {
        ...goal,
        id: `savings-${Date.now()}`,
      }

      if (!dummySavingsGoals[goal.userId]) {
        dummySavingsGoals[goal.userId] = []
      }

      dummySavingsGoals[goal.userId].push(newGoal)
      resolve(newGoal)
    }, 500)
  })
}

// Update a savings goal
export const updateSavingsGoal = async (goal: SavingsGoal): Promise<SavingsGoal> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!dummySavingsGoals[goal.userId]) {
        reject(new Error("User has no savings goals"))
        return
      }

      const goalIndex = dummySavingsGoals[goal.userId].findIndex((g) => g.id === goal.id)

      if (goalIndex === -1) {
        reject(new Error("Savings goal not found"))
        return
      }

      dummySavingsGoals[goal.userId][goalIndex] = goal
      resolve(goal)
    }, 500)
  })
}

// Delete a savings goal
export const deleteSavingsGoal = async (userId: string, goalId: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!dummySavingsGoals[userId]) {
        reject(new Error("User has no savings goals"))
        return
      }

      const goalIndex = dummySavingsGoals[userId].findIndex((g) => g.id === goalId)

      if (goalIndex === -1) {
        reject(new Error("Savings goal not found"))
        return
      }

      dummySavingsGoals[userId].splice(goalIndex, 1)
      resolve()
    }, 500)
  })
}

// Update savings goal amount
export const updateSavingsAmount = async (userId: string, goalId: string, amount: number): Promise<SavingsGoal> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!dummySavingsGoals[userId]) {
        reject(new Error("User has no savings goals"))
        return
      }

      const goalIndex = dummySavingsGoals[userId].findIndex((g) => g.id === goalId)

      if (goalIndex === -1) {
        reject(new Error("Savings goal not found"))
        return
      }

      const goal = dummySavingsGoals[userId][goalIndex]
      goal.currentAmount += amount

      // Ensure we don't exceed the target
      if (goal.currentAmount > goal.targetAmount) {
        goal.currentAmount = goal.targetAmount
      }

      resolve(goal)
    }, 500)
  })
}
