import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react"

interface StatsCardProps {
  title: string
  value: number
  prevValue?: number
  icon: React.ReactNode
  description?: string
  loading?: boolean
  formatValue?: (value: number) => string
}

export default function StatsCard({
  title,
  value,
  prevValue,
  icon,
  description,
  loading = false,
  formatValue = (val) => val.toString(),
}: StatsCardProps) {
  // Calcular a diferença percentual
  const calculateDiff = () => {
    if (prevValue === undefined || prevValue === 0) return 0
    return ((value - prevValue) / prevValue) * 100
  }

  const diff = calculateDiff()
  const isPositive = diff >= 0

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-4 w-4 text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-9 w-24 animate-pulse rounded bg-muted"></div>
        ) : (
          <div className="text-2xl font-bold">{formatValue(value)}</div>
        )}
        {prevValue !== undefined && !loading && (
          <p className="text-xs text-muted-foreground">
            <span className={`inline-flex items-center ${isPositive ? "text-green-500" : "text-red-500"}`}>
              {isPositive ? <ArrowUpIcon className="mr-1 h-3 w-3" /> : <ArrowDownIcon className="mr-1 h-3 w-3" />}
              {Math.abs(diff).toFixed(1)}%
            </span>{" "}
            em relação ao período anterior
          </p>
        )}
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
      </CardContent>
    </Card>
  )
}

