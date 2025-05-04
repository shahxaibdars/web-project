"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser } from "@/services/authService"
import { LoginForm } from "@/components/auth/login-form"
import { RegisterForm } from "@/components/auth/register-form"

export default function Home() {
  const [isLogin, setIsLogin] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const user = await getCurrentUser()
      if (user) {
        router.push("/dashboard")
      }
    }
    checkUser()
  }, [router])

  return (
    <div className="min-h-screen flex flex-col bg-navy">
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Left side - Hero */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-navy via-charcoal to-navy p-8 md:p-12 flex items-center justify-center">
          <div className="max-w-md mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-emerald mb-4">FinWise</h1>
            <p className="text-xl md:text-2xl text-off-white mb-6">Your personal finance tracker</p>
            <p className="text-muted-foreground mb-8">
              Track expenses, manage budgets, plan savings, and achieve your financial goals with our comprehensive
              financial management platform.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="glass-card p-4 rounded-lg">
                <h3 className="text-emerald font-medium mb-2">Budget Tracking</h3>
                <p className="text-sm text-muted-foreground">Set budgets and track your spending across categories</p>
              </div>
              <div className="glass-card p-4 rounded-lg">
                <h3 className="text-emerald font-medium mb-2">Expense Management</h3>
                <p className="text-sm text-muted-foreground">Record and categorize your expenses and income</p>
              </div>
              <div className="glass-card p-4 rounded-lg">
                <h3 className="text-emerald font-medium mb-2">Savings Goals</h3>
                <p className="text-sm text-muted-foreground">Set savings goals and track your progress</p>
              </div>
              <div className="glass-card p-4 rounded-lg">
                <h3 className="text-emerald font-medium mb-2">Bill Reminders</h3>
                <p className="text-sm text-muted-foreground">Never miss a payment with bill due date reminders</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Auth forms */}
        <div className="w-full md:w-1/2 bg-charcoal p-8 md:p-12 flex items-center justify-center">
          <div className="w-full max-w-md">
            <div className="glass-card rounded-xl p-8 border border-emerald/20">
              <div className="flex justify-center mb-6">
                <div className="inline-flex rounded-md overflow-hidden">
                  <button
                    className={`px-4 py-2 text-sm font-medium ${
                      isLogin ? "bg-emerald text-navy" : "bg-transparent text-off-white"
                    }`}
                    onClick={() => setIsLogin(true)}
                  >
                    Login
                  </button>
                  <button
                    className={`px-4 py-2 text-sm font-medium ${
                      !isLogin ? "bg-emerald text-navy" : "bg-transparent text-off-white"
                    }`}
                    onClick={() => setIsLogin(false)}
                  >
                    Register
                  </button>
                </div>
              </div>

              {isLogin ? <LoginForm /> : <RegisterForm />}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
