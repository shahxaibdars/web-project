import type { User } from "../types"

// Login
export const login = async (email: string, password: string): Promise<User> => {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || "Failed to login")
  }

  if (!data.user) {
    throw new Error("No user data received")
  }

  return data.user
}

// Register
export const register = async (name: string, email: string, password: string): Promise<User> => {
  const response = await fetch("/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to register")
  }

  const data = await response.json()
  return data.user
}

// Get current user
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const response = await fetch("/api/auth/me", {
      credentials: 'include'
    })
    if (!response.ok) return null
    const data = await response.json()
    return data.user
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

// Logout
export const logout = async (): Promise<void> => {
  await fetch("/api/auth/logout", {
    method: "POST",
    credentials: 'include'
  })
}
