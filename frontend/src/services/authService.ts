import type { User } from "../types"

// Dummy user data
const dummyUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "regular",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "premium",
  },
  {
    id: "3",
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
  },
]

// Simulate login
export const login = async (email: string, password: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = dummyUsers.find((u) => u.email === email)
      if (user) {
        // In a real app, we would validate the password here
        localStorage.setItem("user", JSON.stringify(user))
        resolve(user)
      } else {
        reject(new Error("Invalid credentials"))
      }
    }, 800)
  })
}

// Simulate register
export const register = async (name: string, email: string, password: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const existingUser = dummyUsers.find((u) => u.email === email)
      if (existingUser) {
        reject(new Error("User already exists"))
      } else {
        const newUser: User = {
          id: (dummyUsers.length + 1).toString(),
          name,
          email,
          role: "regular",
        }
        dummyUsers.push(newUser)
        localStorage.setItem("user", JSON.stringify(newUser))
        resolve(newUser)
      }
    }, 800)
  })
}

// Get current user
export const getCurrentUser = (): User | null => {
  const userJson = localStorage.getItem("user")
  return userJson ? JSON.parse(userJson) : null
}

// Logout
export const logout = (): void => {
  localStorage.removeItem("user")
}
