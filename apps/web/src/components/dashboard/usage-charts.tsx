import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ErrorState } from '@/components/error-state'

export interface UsageDataPoint {
  date: string
  value: number
}

export interface UsageChartsProps {
  isLoading?: boolean
  error?: Error | null
  data?: {
    cpu: Array<UsageDataPoint>
    memory: Array<UsageDataPoint>
    bandwidth: Array<UsageDataPoint>
  }
}

function ChartSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton data-testid="chart-skeleton" className="h-5 w-32" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-48 w-full" />
      </CardContent>
    </Card>
  )
}

interface SimpleChartProps {
  data: Array<UsageDataPoint>
  unit: string
  color: string
}

function SimpleChart({ data, unit, color }: SimpleChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value), 1)

  return (
    <div className="flex h-48 items-end gap-1">
      {data.map((point) => (
        <div
          key={point.date}
          className="flex-1 flex flex-col items-center gap-1"
        >
          <div
            className="w-full rounded-t"
            style={{
              height: `${(point.value / maxValue) * 100}%`,
              backgroundColor: color,
              minHeight: '4px',
            }}
            title={`${point.date}: ${point.value}${unit}`}
          />
          <span className="text-xs text-muted-foreground truncate w-full text-center">
            {new Date(point.date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })}
          </span>
        </div>
      ))}
    </div>
  )
}

export function UsageCharts({ isLoading, error, data }: UsageChartsProps) {
  if (error) {
    return <ErrorState message="Failed to load usage charts" />
  }

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        <ChartSkeleton />
        <ChartSkeleton />
        <ChartSkeleton />
      </div>
    )
  }

  if (!data) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-center text-muted-foreground">
            No usage data available
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card data-testid="chart-container">
        <CardHeader>
          <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
        </CardHeader>
        <CardContent>
          <SimpleChart data={data.cpu} unit="%" color="hsl(var(--chart-1))" />
        </CardContent>
      </Card>

      <Card data-testid="chart-container">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
        </CardHeader>
        <CardContent>
          <SimpleChart
            data={data.memory}
            unit="%"
            color="hsl(var(--chart-2))"
          />
        </CardContent>
      </Card>

      <Card data-testid="chart-container">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Bandwidth</CardTitle>
        </CardHeader>
        <CardContent>
          <SimpleChart
            data={data.bandwidth}
            unit=" GB"
            color="hsl(var(--chart-3))"
          />
        </CardContent>
      </Card>
    </div>
  )
}
