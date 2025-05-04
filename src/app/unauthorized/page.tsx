"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function UnauthorizedPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold text-off-white">Unauthorized Access</h1>
        <p className="text-muted-foreground">You don't have permission to access this page.</p>
        <Button onClick={() => router.push("/")}>Return to Home</Button>
      </div>
    </div>
  )
}