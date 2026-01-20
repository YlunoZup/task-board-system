'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Clock,
  CheckCircle2,
  Circle,
  Timer,
  AlertTriangle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Task } from '@/types'
import { cn, priorityConfig, statusConfig } from '@/lib/utils'

interface CalendarViewProps {
  tasks: Task[]
  onTaskClick?: (task: Task) => void
}

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay()
}

function formatDateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function isToday(date: Date): boolean {
  const today = new Date()
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  )
}

function isPast(date: Date): boolean {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const compareDate = new Date(date)
  compareDate.setHours(0, 0, 0, 0)
  return compareDate < today
}

const statusIcons = {
  todo: Circle,
  in_progress: Timer,
  done: CheckCircle2,
}

export function CalendarView({ tasks, onTaskClick }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  // Group tasks by due date
  const tasksByDate = useMemo(() => {
    const grouped: Record<string, Task[]> = {}
    tasks.forEach((task) => {
      if (task.dueDate) {
        const dateKey = formatDateKey(new Date(task.dueDate))
        if (!grouped[dateKey]) {
          grouped[dateKey] = []
        }
        grouped[dateKey].push(task)
      }
    })
    return grouped
  }, [tasks])

  // Get tasks for selected date
  const selectedDateTasks = useMemo(() => {
    if (!selectedDate) return []
    const dateKey = formatDateKey(selectedDate)
    return tasksByDate[dateKey] || []
  }, [selectedDate, tasksByDate])

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const daysInMonth = getDaysInMonth(year, month)
    const firstDay = getFirstDayOfMonth(year, month)
    const days: (Date | null)[] = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }

    return days
  }, [year, month])

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const goToToday = () => {
    setCurrentDate(new Date())
    setSelectedDate(new Date())
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr,320px]">
      {/* Calendar Grid */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <CalendarDays className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              {MONTHS[month]} {year}
            </CardTitle>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm" onClick={goToToday}>
                Today
              </Button>
              <Button variant="ghost" size="icon" onClick={goToPreviousMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={goToNextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Days of week header */}
          <div className="grid grid-cols-7 gap-px mb-2">
            {DAYS_OF_WEEK.map((day) => (
              <div
                key={day}
                className="text-center text-xs font-medium text-muted-foreground py-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-px bg-muted rounded-lg overflow-hidden">
            {calendarDays.map((date, index) => {
              if (!date) {
                return <div key={`empty-${index}`} className="bg-background p-2 min-h-[80px] sm:min-h-[100px]" />
              }

              const dateKey = formatDateKey(date)
              const dayTasks = tasksByDate[dateKey] || []
              const isSelected = selectedDate && formatDateKey(selectedDate) === dateKey
              const hasOverdue = dayTasks.some(t => t.status !== 'done' && isPast(date))

              return (
                <motion.button
                  key={dateKey}
                  onClick={() => setSelectedDate(date)}
                  className={cn(
                    'bg-background p-1 sm:p-2 min-h-[80px] sm:min-h-[100px] text-left transition-colors hover:bg-accent/50',
                    isSelected && 'ring-2 ring-primary ring-inset',
                    isToday(date) && 'bg-primary/5'
                  )}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-start justify-between">
                    <span
                      className={cn(
                        'text-xs sm:text-sm font-medium',
                        isToday(date) &&
                          'bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center'
                      )}
                    >
                      {date.getDate()}
                    </span>
                    {hasOverdue && (
                      <AlertTriangle className="h-3 w-3 text-red-500" />
                    )}
                  </div>

                  {/* Task indicators */}
                  <div className="mt-1 space-y-0.5">
                    {dayTasks.slice(0, 3).map((task) => {
                      const prioConfig = priorityConfig[task.priority]
                      return (
                        <div
                          key={task.id}
                          className={cn(
                            'text-[8px] sm:text-[10px] truncate px-1 py-0.5 rounded',
                            task.status === 'done'
                              ? 'bg-green-500/10 text-green-600 line-through'
                              : prioConfig.color.replace('bg-', 'bg-').replace('/10', '/10')
                          )}
                        >
                          {task.title}
                        </div>
                      )
                    })}
                    {dayTasks.length > 3 && (
                      <div className="text-[8px] sm:text-[10px] text-muted-foreground">
                        +{dayTasks.length - 3} more
                      </div>
                    )}
                  </div>
                </motion.button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Selected Day Tasks */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg flex items-center gap-2">
            <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            {selectedDate ? (
              <span>
                {MONTHS[selectedDate.getMonth()].slice(0, 3)} {selectedDate.getDate()}
                {isToday(selectedDate) && (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    Today
                  </Badge>
                )}
              </span>
            ) : (
              'Select a day'
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            {!selectedDate ? (
              <div className="text-center py-8 text-muted-foreground">
                <CalendarDays className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Click on a date to see tasks</p>
              </div>
            ) : selectedDateTasks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No tasks due on this day</p>
              </div>
            ) : (
              <div className="space-y-2">
                {selectedDateTasks.map((task) => {
                  const StatusIcon = statusIcons[task.status]
                  const statConfig = statusConfig[task.status]
                  const prioConfig = priorityConfig[task.priority]
                  const isOverdue = task.status !== 'done' && isPast(selectedDate!)

                  return (
                    <motion.button
                      key={task.id}
                      onClick={() => onTaskClick?.(task)}
                      className={cn(
                        'w-full text-left p-3 rounded-lg border transition-all hover:shadow-md',
                        isOverdue && 'border-red-200 bg-red-50/50 dark:bg-red-950/20'
                      )}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <div className="flex items-start gap-2">
                        <StatusIcon
                          className={cn(
                            'h-4 w-4 mt-0.5 shrink-0',
                            statConfig.dotColor.replace('bg-', 'text-')
                          )}
                        />
                        <div className="flex-1 min-w-0">
                          <p
                            className={cn(
                              'text-sm font-medium truncate',
                              task.status === 'done' && 'line-through text-muted-foreground'
                            )}
                          >
                            {task.title}
                          </p>
                          {task.description && (
                            <p className="text-xs text-muted-foreground truncate mt-0.5">
                              {task.description}
                            </p>
                          )}
                          <div className="flex items-center gap-2 mt-2">
                            <Badge
                              variant="secondary"
                              className={cn('text-[10px]', prioConfig.color)}
                            >
                              {prioConfig.label}
                            </Badge>
                            <Badge variant="outline" className="text-[10px]">
                              {statConfig.label}
                            </Badge>
                            {isOverdue && (
                              <Badge variant="destructive" className="text-[10px]">
                                Overdue
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  )
                })}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
