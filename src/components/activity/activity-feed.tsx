'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Activity,
  CheckCircle2,
  Circle,
  Timer,
  Pencil,
  Trash2,
  Plus,
  ArrowRight,
  User,
  Calendar,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Clock,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

export interface ActivityItem {
  id: string
  type: 'task_created' | 'task_updated' | 'task_deleted' | 'task_moved' | 'task_completed' | 'comment_added' | 'assignee_changed' | 'due_date_changed'
  taskId?: string
  taskTitle: string
  userId?: string
  userName: string
  timestamp: Date
  details?: {
    from?: string
    to?: string
    field?: string
    oldValue?: string
    newValue?: string
  }
}

interface ActivityFeedProps {
  activities: ActivityItem[]
  maxItems?: number
  showExpanded?: boolean
  className?: string
}

const activityConfig: Record<ActivityItem['type'], {
  icon: typeof Activity
  color: string
  bgColor: string
  getMessage: (activity: ActivityItem) => string
}> = {
  task_created: {
    icon: Plus,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    getMessage: (a) => `created task "${a.taskTitle}"`,
  },
  task_updated: {
    icon: Pencil,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    getMessage: (a) => `updated ${a.details?.field || 'task'} "${a.taskTitle}"`,
  },
  task_deleted: {
    icon: Trash2,
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
    getMessage: (a) => `deleted task "${a.taskTitle}"`,
  },
  task_moved: {
    icon: ArrowRight,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
    getMessage: (a) => `moved "${a.taskTitle}" from ${a.details?.from} to ${a.details?.to}`,
  },
  task_completed: {
    icon: CheckCircle2,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    getMessage: (a) => `completed task "${a.taskTitle}"`,
  },
  comment_added: {
    icon: MessageSquare,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
    getMessage: (a) => `commented on "${a.taskTitle}"`,
  },
  assignee_changed: {
    icon: User,
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-500/10',
    getMessage: (a) => a.details?.to
      ? `assigned "${a.taskTitle}" to ${a.details.to}`
      : `unassigned "${a.taskTitle}"`,
  },
  due_date_changed: {
    icon: Calendar,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
    getMessage: (a) => a.details?.to
      ? `set due date for "${a.taskTitle}" to ${a.details.to}`
      : `removed due date from "${a.taskTitle}"`,
  },
}

function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return 'Just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function groupActivitiesByDate(activities: ActivityItem[]): Record<string, ActivityItem[]> {
  const groups: Record<string, ActivityItem[]> = {}

  activities.forEach((activity) => {
    const date = new Date(activity.timestamp)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    let key: string
    if (date.toDateString() === today.toDateString()) {
      key = 'Today'
    } else if (date.toDateString() === yesterday.toDateString()) {
      key = 'Yesterday'
    } else {
      key = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
    }

    if (!groups[key]) {
      groups[key] = []
    }
    groups[key].push(activity)
  })

  return groups
}

export function ActivityFeed({
  activities,
  maxItems = 10,
  showExpanded = false,
  className,
}: ActivityFeedProps) {
  const [isExpanded, setIsExpanded] = useState(showExpanded)

  const displayedActivities = isExpanded ? activities : activities.slice(0, maxItems)
  const hasMore = activities.length > maxItems
  const groupedActivities = groupActivitiesByDate(displayedActivities)

  if (activities.length === 0) {
    return (
      <Card className={className}>
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg flex items-center gap-2">
            <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            Activity Feed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
              <Clock className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">No activity yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              Actions will appear here as you work
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base sm:text-lg flex items-center gap-2">
            <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            Activity Feed
          </CardTitle>
          <Badge variant="secondary" className="text-xs">
            {activities.length} {activities.length === 1 ? 'action' : 'actions'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <ScrollArea className={cn(isExpanded ? 'h-[400px]' : 'h-auto')}>
          <div className="space-y-6">
            {Object.entries(groupedActivities).map(([date, items]) => (
              <div key={date}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {date}
                  </span>
                  <div className="flex-1 h-px bg-border" />
                </div>
                <div className="space-y-3">
                  <AnimatePresence>
                    {items.map((activity, index) => {
                      const config = activityConfig[activity.type]
                      const Icon = config.icon

                      return (
                        <motion.div
                          key={activity.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex items-start gap-3 group"
                        >
                          <div className={cn(
                            'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                            config.bgColor
                          )}>
                            <Icon className={cn('h-4 w-4', config.color)} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm">
                              <span className="font-medium">{activity.userName}</span>
                              {' '}
                              <span className="text-muted-foreground">
                                {config.getMessage(activity)}
                              </span>
                            </p>
                            {activity.details?.from && activity.details?.to && activity.type === 'task_moved' && (
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {activity.details.from}
                                </Badge>
                                <ArrowRight className="h-3 w-3 text-muted-foreground" />
                                <Badge variant="outline" className="text-xs">
                                  {activity.details.to}
                                </Badge>
                              </div>
                            )}
                            <p className="text-xs text-muted-foreground mt-1">
                              {formatRelativeTime(new Date(activity.timestamp))}
                            </p>
                          </div>
                        </motion.div>
                      )
                    })}
                  </AnimatePresence>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {hasMore && (
          <Button
            variant="ghost"
            size="sm"
            className="w-full mt-4 text-muted-foreground"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <>
                <ChevronUp className="h-4 w-4 mr-1" />
                Show less
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-1" />
                Show {activities.length - maxItems} more
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

// Hook to manage activity state
export function useActivityFeed() {
  const [activities, setActivities] = useState<ActivityItem[]>([])

  const addActivity = (activity: Omit<ActivityItem, 'id' | 'timestamp'>) => {
    const newActivity: ActivityItem = {
      ...activity,
      id: `activity-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
    }
    setActivities((prev) => [newActivity, ...prev])
  }

  const clearActivities = () => {
    setActivities([])
  }

  return {
    activities,
    addActivity,
    clearActivities,
  }
}
