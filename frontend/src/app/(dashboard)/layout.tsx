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
    const user = getCurrentUser()
    if (user) {
      setIsAuthenticated(true)
    } else {
      router.push("/")
    }
    setIsLoading(false)
  }, [router])

  const handleLogout = () => {
    setIsAuthenticated(false)
    router.push("/")
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
