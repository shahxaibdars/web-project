import type { Bill } from "../types"

// Generate dummy bills
const generateDummyBills = (userId: string): Bill[] => {
  const bills: Bill[] = [
    {
      id: "bill-1",
      userId,
      name: "Rent",
      dueDate: new Date(new Date().setDate(new Date().getDate() + 5)),
      amount: 1200,
      isRecurring: true,
    },
    {
      id: "bill-2",
      userId,
      name: "Electricity",
      dueDate: new Date(new Date().setDate(new Date().getDate() + 12)),
      amount: 85,
      isRecurring: true,
    },
    {
      id: "bill-3",
      userId,
      name: "Internet",
      dueDate: new Date(new Date().setDate(new Date().getDate() + 8)),
      amount: 65,
      isRecurring: true,
    },
    {
      id: "bill-4",
      userId,
      name: "Phone",
      dueDate: new Date(new Date().setDate(new Date().getDate() + 15)),
      amount: 45,
      isRecurring: true,
    },
    {
      id: "bill-5",
      userId,
      name: "Car Insurance",
      dueDate: new Date(new Date().setDate(new Date().getDate() + 20)),
      amount: 120,
      isRecurring: true,
    },
    {
      id: "bill-6",
      userId,
      name: "Gym Membership",
      dueDate: new Date(new Date().setDate(new Date().getDate() + 3)),
      amount: 50,
      isRecurring: true,
    },
    {
      id: "bill-7",
      userId,
      name: "Streaming Services",
      dueDate: new Date(new Date().setDate(new Date().getDate() + 18)),
      amount: 30,
      isRecurring: true,
    },
  ]

  return bills
}

// Dummy bills store
const dummyBills: Record<string, Bill[]> = {}

// Get bills for a user
export const getBills = async (userId: string): Promise<Bill[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (!dummyBills[userId]) {
        dummyBills[userId] = generateDummyBills(userId)
      }

      // Sort by due date
      const sortedBills = [...dummyBills[userId]].sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())

      resolve(sortedBills)
    }, 500)
  })
}

// Add a new bill
export const addBill = async (bill: Omit<Bill, "id">): Promise<Bill> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newBill: Bill = {
        ...bill,
        id: `bill-${Date.now()}`,
      }

      if (!dummyBills[bill.userId]) {
        dummyBills[bill.userId] = []
      }

      dummyBills[bill.userId].push(newBill)

      // Sort by due date
      dummyBills[bill.userId].sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())

      resolve(newBill)
    }, 500)
  })
}

// Update a bill
export const updateBill = async (bill: Bill): Promise<Bill> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!dummyBills[bill.userId]) {
        reject(new Error("User has no bills"))
        return
      }

      const billIndex = dummyBills[bill.userId].findIndex((b) => b.id === bill.id)

      if (billIndex === -1) {
        reject(new Error("Bill not found"))
        return
      }

      dummyBills[bill.userId][billIndex] = bill

      // Sort by due date
      dummyBills[bill.userId].sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())

      resolve(bill)
    }, 500)
  })
}

// Delete a bill
export const deleteBill = async (userId: string, billId: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!dummyBills[userId]) {
        reject(new Error("User has no bills"))
        return
      }

      const billIndex = dummyBills[userId].findIndex((b) => b.id === billId)

      if (billIndex === -1) {
        reject(new Error("Bill not found"))
        return
      }

      dummyBills[userId].splice(billIndex, 1)
      resolve()
    }, 500)
  })
}

// Get upcoming bills
export const getUpcomingBills = async (userId: string, days = 7): Promise<Bill[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (!dummyBills[userId]) {
        dummyBills[userId] = generateDummyBills(userId)
      }

      const currentDate = new Date()
      const futureDate = new Date()
      futureDate.setDate(currentDate.getDate() + days)

      const upcomingBills = dummyBills[userId].filter(
        (bill) => bill.dueDate >= currentDate && bill.dueDate <= futureDate,
      )

      // Sort by due date
      upcomingBills.sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())

      resolve(upcomingBills)
    }, 500)
  })
}
