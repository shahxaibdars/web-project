import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number
  description?: string
  icon: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  className?: string
}

export function StatCard({ title, value, description, icon: Icon, trend, className }: StatCardProps) {
  return (
    <div className={cn("glass-card rounded-xl p-6", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className="rounded-full bg-emerald/10 p-2">
          <Icon className="h-5 w-5 text-emerald" />
        </div>
      </div>
      <div className="mt-3">
        <div className="flex items-baseline">
          <h2 className="text-2xl font-bold">{value}</h2>
          {trend && (
            <span className={cn("ml-2 text-xs font-medium", trend.isPositive ? "text-emerald" : "text-destructive")}>
              {trend.isPositive ? "+" : "-"}
              {trend.value}%
            </span>
          )}
        </div>
        {description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}
      </div>
    </div>
  )
}
