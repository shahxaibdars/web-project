"use client"

import { useEffect, useState } from "react"
import { Toaster } from "@/components/ui/toaster"
import { RefreshProvider } from "@/contexts/refresh-context"
import { ThemeProvider } from "@/components/ui/theme-provider"

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
      <RefreshProvider>
        {children}
        <Toaster />
      </RefreshProvider>
    </ThemeProvider>
  )
} 