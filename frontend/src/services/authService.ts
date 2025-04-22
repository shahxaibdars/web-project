import type { User } from "../types"

// Simulate login
export const login = async (email: string, password: string): Promise<User> => {
  const response = await fetch('http://localhost:5001/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Login failed');
  }

  localStorage.setItem('user', JSON.stringify(data.user));
  localStorage.setItem('token', data.token);
  return data.user;
}

// Simulate register
export const register = async (name: string, email: string, password: string): Promise<User> => {
  const response = await fetch('http://localhost:5001/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, password, role: 'regular' }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Registration failed');
  }

  localStorage.setItem('user', JSON.stringify(data.user));
  localStorage.setItem('token', data.token);
  return data.user;
}

// Get current user
export const getCurrentUser = (): User | null => {
  const userJson = localStorage.getItem('user');
  return userJson ? JSON.parse(userJson) : null;
}

// Logout
export const logout = async (): Promise<void> => {
  const token = localStorage.getItem('token');
  if (token) {
    await fetch('http://localhost:5001/api/auth/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }
  localStorage.removeItem('user');
  localStorage.removeItem('token');
}
