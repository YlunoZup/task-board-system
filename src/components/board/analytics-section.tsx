'use client'

import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  CheckSquare,
  Clock,
  TrendingUp,
  Activity,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Analytics, Task } from '@/types'
import { formatRelativeTime, statusConfig } from '@/lib/utils'

interface AnalyticsSectionProps {
  analytics: Analytics | null
  isLoading: boolean
}

export function AnalyticsSection({ analytics, isLoading }: AnalyticsSectionProps) {
  if (isLoading) {
    return (
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-6 sm:pb-2">
              <div className="h-3 sm:h-4 w-16 sm:w-24 animate-pulse rounded bg-muted" />
              <div className="h-6 w-6 sm:h-8 sm:w-8 animate-pulse rounded bg-muted" />
            </CardHeader>
            <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
              <div className="h-6 sm:h-8 w-12 sm:w-16 animate-pulse rounded bg-muted" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!analytics) {
    return null
  }

  const stats = [
    {
      title: 'Total Boards',
      value: analytics.totalBoards,
      icon: LayoutDashboard,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Total Tasks',
      value: analytics.totalTasks,
      icon: CheckSquare,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'In Progress',
      value: analytics.tasksByStatus.in_progress,
      icon: Clock,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
    },
    {
      title: 'Completion Rate',
      value: `${analytics.completionRate}%`,
      icon: TrendingUp,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
  ]

  return (
    <div id="analytics" className="space-y-4 sm:space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2 p-3 sm:p-6 sm:pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`rounded-md sm:rounded-lg p-1.5 sm:p-2 ${stat.bgColor}`}>
                  <stat.icon className={`h-3 w-3 sm:h-4 sm:w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
                <div className="text-xl sm:text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Status Distribution & Recent Activity */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2">
        {/* Status Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Card className="h-full">
            <CardHeader className="p-3 sm:p-6 pb-2 sm:pb-4">
              <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                Task Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
              <div className="space-y-3 sm:space-y-4">
                {Object.entries(analytics.tasksByStatus).map(([status, count]) => {
                  const config = statusConfig[status as keyof typeof statusConfig]
                  const percentage = analytics.totalTasks > 0
                    ? Math.round((count / analytics.totalTasks) * 100)
                    : 0

                  return (
                    <div key={status} className="space-y-1.5 sm:space-y-2">
                      <div className="flex items-center justify-between text-xs sm:text-sm">
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <div className={`h-2 w-2 sm:h-3 sm:w-3 rounded-full ${config.dotColor}`} />
                          <span>{config.label}</span>
                        </div>
                        <span className="font-medium">
                          {count} ({percentage}%)
                        </span>
                      </div>
                      <div className="h-1.5 sm:h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full ${config.dotColor}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 0.5, delay: 0.5 }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <Card className="h-full">
            <CardHeader className="p-3 sm:p-6 pb-2 sm:pb-4">
              <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
              {analytics.recentActivity.length === 0 ? (
                <p className="text-xs sm:text-sm text-muted-foreground text-center py-4">
                  No recent activity
                </p>
              ) : (
                <div className="space-y-2 sm:space-y-3 max-h-[180px] sm:max-h-[250px] overflow-y-auto">
                  {analytics.recentActivity.slice(0, 5).map((task: Task & { board?: { name: string; color: string } }) => {
                    const config = statusConfig[task.status as keyof typeof statusConfig]
                    return (
                      <div
                        key={task.id}
                        className="flex items-start sm:items-center justify-between gap-2 p-2 rounded-lg bg-muted/50"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm font-medium truncate">
                            {task.title}
                          </p>
                          {task.board && (
                            <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                              {task.board.name}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-1 sm:gap-2 flex-shrink-0">
                          <Badge
                            className={`text-[10px] sm:text-xs px-1.5 py-0 sm:px-2.5 sm:py-0.5 ${config.color}`}
                          >
                            {config.label}
                          </Badge>
                          <span className="text-[10px] sm:text-xs text-muted-foreground whitespace-nowrap">
                            {formatRelativeTime(task.updatedAt)}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
