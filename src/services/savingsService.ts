import type { SavingsGoal } from "../types"

// Get savings goals for a user
export const getSavingsGoals = async (userId: string): Promise<SavingsGoal[]> => {
  try {
    const response = await fetch(`/api/savings?userId=${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch savings goals');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching savings goals:', error);
    throw error;
  }
};

// Add a new savings goal
export const addSavingsGoal = async (goal: Omit<SavingsGoal, "id">): Promise<SavingsGoal> => {
  try {
    const response = await fetch('/api/savings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(goal),
    });

    if (!response.ok) {
      throw new Error('Failed to add savings goal');
    }

    return await response.json();
  } catch (error) {
    console.error('Error adding savings goal:', error);
    throw error;
  }
};

// Update a savings goal
export const updateSavingsGoal = async (goal: SavingsGoal): Promise<SavingsGoal> => {
  try {
    const response = await fetch('/api/savings', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(goal),
    });

    if (!response.ok) {
      throw new Error('Failed to update savings goal');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating savings goal:', error);
    throw error;
  }
};

// Delete a savings goal
export const deleteSavingsGoal = async (userId: string, goalId: string): Promise<void> => {
  try {
    const response = await fetch(`/api/savings?userId=${userId}&goalId=${goalId}`, {
      method: 'DELETE',
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error('Failed to delete savings goal');
    }
  } catch (error) {
    console.error('Error deleting savings goal:', error);
    throw error;
  }
};

// Update savings goal amount
export const updateSavingsAmount = async (userId: string, goalId: string, amount: number): Promise<SavingsGoal> => {
  try {
    const response = await fetch('/api/savings/amount', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        userId,
        goalId,
        amount,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to update savings amount');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating savings amount:', error);
    throw error;
  }
};
