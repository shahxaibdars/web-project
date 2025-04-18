import type { LoanApplication } from "../types"

// Generate dummy loan applications
const generateDummyLoanApplications = (userId: string): LoanApplication[] => {
  return [
    {
      id: "loan-1",
      userId,
      amount: 5000,
      status: "approved",
      tax: 250,
      createdAt: new Date(new Date().setDate(new Date().getDate() - 30)),
    },
    {
      id: "loan-2",
      userId,
      amount: 10000,
      status: "pending",
      tax: 500,
      createdAt: new Date(new Date().setDate(new Date().getDate() - 5)),
    },
    {
      id: "loan-3",
      userId,
      amount: 2000,
      status: "rejected",
      tax: 100,
      createdAt: new Date(new Date().setDate(new Date().getDate() - 60)),
    },
  ]
}

// Dummy loan applications store
const dummyLoanApplications: Record<string, LoanApplication[]> = {}

// Get loan applications for a user
export const getLoanApplications = async (userId: string): Promise<LoanApplication[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (!dummyLoanApplications[userId]) {
        dummyLoanApplications[userId] = generateDummyLoanApplications(userId)
      }

      // Sort by created date (newest first)
      const sortedApplications = [...dummyLoanApplications[userId]].sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
      )

      resolve(sortedApplications)
    }, 500)
  })
}

// Apply for a new loan
export const applyForLoan = async (userId: string, amount: number): Promise<LoanApplication> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const tax = amount * 0.05 // 5% tax

      const newLoan: LoanApplication = {
        id: `loan-${Date.now()}`,
        userId,
        amount,
        status: "pending",
        tax,
        createdAt: new Date(),
      }

      if (!dummyLoanApplications[userId]) {
        dummyLoanApplications[userId] = []
      }

      dummyLoanApplications[userId].unshift(newLoan)
      resolve(newLoan)
    }, 500)
  })
}

// Get pending loans count
export const getPendingLoansCount = async (userId: string): Promise<number> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (!dummyLoanApplications[userId]) {
        dummyLoanApplications[userId] = generateDummyLoanApplications(userId)
      }

      const pendingCount = dummyLoanApplications[userId].filter((loan) => loan.status === "pending").length

      resolve(pendingCount)
    }, 500)
  })
}
