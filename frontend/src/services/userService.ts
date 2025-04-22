import type { User } from "@/types"

// Update user profile
export const updateProfile = async (updates: {
  name?: string
  email?: string
  currentPassword?: string
  newPassword?: string
}): Promise<{ message: string }> => {
  const token = localStorage.getItem('token')
  if (!token) {
    throw new Error('No authentication token found')
  }

  const response = await fetch('/api/users/profile', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(updates),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Failed to update profile')
  }

  return response.json()
}

// Delete user account
export const deleteAccount = async (): Promise<{ message: string }> => {
  const token = localStorage.getItem('token')
  if (!token) {
    throw new Error('No authentication token found')
  }

  const response = await fetch('/api/users/account', {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Failed to delete account')
  }

  // Clear local storage after successful deletion
  localStorage.removeItem('token')
  return response.json()
} 