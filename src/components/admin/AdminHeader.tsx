"use client"

import React, { useState, useEffect } from 'react';
import { Bell, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getCurrentUser } from '@/services/authService';

export function AdminHeader() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    };
    fetchUser();
  }, []);
  
  return (
    <header className="bg-white border-b border-gray-200 py-4 px-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold text-gray-800">Admin Dashboard</h1>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </Button>
          
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-emerald flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
            <div className="text-sm">
              <p className="font-medium">{user?.name || 'Admin User'}</p>
              <p className="text-gray-500 text-xs">Administrator</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
} 