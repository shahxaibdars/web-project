"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { getCurrentUser } from "@/services/authService"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await getCurrentUser()
        if (user) {
          setIsAuthenticated(true)
        } else {
          router.replace("/")
        }
      } catch (error) {
        console.error('Error checking authentication:', error)
        router.replace("/")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        setIsAuthenticated(false)
        window.location.href = '/'
      } else {
        throw new Error('Logout failed')
      }
    } catch (error) {
      console.error('Error during logout:', error)
      window.location.href = '/'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy">
        <div className="animate-pulse text-emerald">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen flex bg-navy">
      <Sidebar onLogout={handleLogout} />
      <div className="flex-1 md:ml-64">
        <Header onLogout={handleLogout} />
        <main className="container mx-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
