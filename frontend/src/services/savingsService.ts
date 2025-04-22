import type { SavingsGoal } from "@/types"

// Get all savings goals
export const getSavingsGoals = async (): Promise<SavingsGoal[]> => {
  const token = localStorage.getItem('token')
  if (!token) {
    throw new Error('No authentication token found')
  }

  try {
    console.log('Fetching savings goals...');
    const response = await fetch('/api/savings', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      },
    })

    if (!response.ok) {
      let errorMessage = 'Failed to fetch savings goals';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        // If response is not JSON, use the status text
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('Fetched savings goals:', data);
    return data;
  } catch (error) {
    console.error('Error in getSavingsGoals:', error);
    throw error;
  }
}

// Get a specific savings goal
export const getSavingsGoal = async (id: string): Promise<SavingsGoal> => {
  const token = localStorage.getItem('token')
  if (!token) {
    throw new Error('No authentication token found')
  }

  try {
    const response = await fetch(`/api/savings/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      },
    })

    if (!response.ok) {
      let errorMessage = 'Failed to fetch savings goal';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        // If response is not JSON, use the status text
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error in getSavingsGoal:', error);
    throw error;
  }
}

// Create a new savings goal
export const addSavingsGoal = async (goal: Omit<SavingsGoal, '_id'>): Promise<SavingsGoal> => {
  const token = localStorage.getItem('token')
  if (!token) {
    throw new Error('No authentication token found')
  }

  try {
    console.log('Creating savings goal:', goal);
    const response = await fetch('/api/savings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(goal),
    })

    if (!response.ok) {
      let errorMessage = 'Failed to create savings goal';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        // If response is not JSON, use the status text
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('Created savings goal:', data);
    return data;
  } catch (error) {
    console.error('Error in addSavingsGoal:', error);
    throw error;
  }
}

// Update a savings goal
export const updateSavingsGoal = async (id: string, updates: Partial<SavingsGoal>): Promise<SavingsGoal> => {
  const token = localStorage.getItem('token')
  if (!token) {
    throw new Error('No authentication token found')
  }

  const response = await fetch(`/api/savings/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(updates),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Failed to update savings goal')
  }

  return response.json()
}

// Delete a savings goal
export const deleteSavingsGoal = async (id: string): Promise<void> => {
  const token = localStorage.getItem('token')
  if (!token) {
    throw new Error('No authentication token found')
  }

  const response = await fetch(`/api/savings/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to delete savings goal')
  }
}

// Update progress for a savings goal
export const updateSavingsAmount = async (id: string, amount: number): Promise<SavingsGoal> => {
  const token = localStorage.getItem('token')
  if (!token) {
    throw new Error('No authentication token found')
  }

  const response = await fetch(`/api/savings/${id}/progress`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ amount }),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Failed to update savings progress')
  }

  return response.json()
}
