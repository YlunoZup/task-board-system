'use client'

import { motion } from 'framer-motion'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  TrendingUp,
  Target,
  Zap,
  Clock,
  CheckCircle2,
  BarChart3,
  PieChart as PieChartIcon,
  ListTodo,
} from 'lucide-react'
import { Analytics, Task } from '@/types'
import { format, subDays, startOfDay, isAfter } from 'date-fns'

interface AdvancedAnalyticsProps {
  analytics: Analytics | null
  isLoading: boolean
}

export function AdvancedAnalytics({ analytics, isLoading }: AdvancedAnalyticsProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:gap-6 grid-cols-1 lg:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="h-[350px]">
            <CardHeader>
              <div className="h-6 w-32 animate-pulse rounded bg-muted" />
            </CardHeader>
            <CardContent>
              <div className="h-[250px] animate-pulse rounded bg-muted" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!analytics) return null

  // Calculate real priority distribution from recent activity
  const recentTasks = analytics.recentActivity || []
  const highPriority = recentTasks.filter(t => t.priority === 'high').length
  const mediumPriority = recentTasks.filter(t => t.priority === 'medium').length
  const lowPriority = recentTasks.filter(t => t.priority === 'low').length

  const priorityDistribution = [
    { name: 'High', value: highPriority, color: '#ef4444' },
    { name: 'Medium', value: mediumPriority, color: '#eab308' },
    { name: 'Low', value: lowPriority, color: '#94a3b8' },
  ].filter(item => item.value > 0)

  // Status distribution (real data)
  const { todo, in_progress, done } = analytics.tasksByStatus
  const statusDistribution = [
    { name: 'To Do', value: todo, color: '#94a3b8' },
    { name: 'In Progress', value: in_progress, color: '#3b82f6' },
    { name: 'Done', value: done, color: '#22c55e' },
  ].filter(item => item.value > 0)

  // Calculate tasks by day (last 7 days based on updatedAt)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i)
    return {
      date: format(date, 'EEE'),
      fullDate: startOfDay(date),
    }
  })

  const tasksByDay = last7Days.map(day => {
    const tasksOnDay = recentTasks.filter(task => {
      const taskDate = startOfDay(new Date(task.updatedAt))
      return taskDate.getTime() === day.fullDate.getTime()
    }).length
    return {
      day: day.date,
      tasks: tasksOnDay,
    }
  })

  // Board distribution (count tasks per board)
  const boardCounts: Record<string, { name: string; count: number; color: string }> = {}
  recentTasks.forEach((task: Task & { board?: { name: string; color: string } }) => {
    if (task.board) {
      if (!boardCounts[task.board.name]) {
        boardCounts[task.board.name] = { name: task.board.name, count: 0, color: task.board.color || '#6366f1' }
      }
      boardCounts[task.board.name].count++
    }
  })
  const boardDistribution = Object.values(boardCounts)

  // Metrics calculations
  const avgTasksPerDay = analytics.totalTasks > 0 ? (analytics.totalTasks / 7).toFixed(1) : '0'
  const completedToday = recentTasks.filter(t => {
    const today = startOfDay(new Date())
    const taskDate = startOfDay(new Date(t.updatedAt))
    return taskDate.getTime() === today.getTime() && t.status === 'done'
  }).length

  const inProgressCount = analytics.tasksByStatus.in_progress
  const velocity = done > 0 ? done : 0

  return (
    <div className="space-y-6">
      {/* Performance Metrics - Real Data */}
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-500/20 to-transparent rounded-bl-full" />
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Completed</p>
                  <p className="text-xl sm:text-2xl font-bold">{done}</p>
                  <p className="text-[10px] sm:text-xs text-green-500 flex items-center gap-1 mt-1">
                    <CheckCircle2 className="h-3 w-3" />
                    {analytics.completionRate}% completion
                  </p>
                </div>
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/20 to-transparent rounded-bl-full" />
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">In Progress</p>
                  <p className="text-xl sm:text-2xl font-bold">{inProgressCount}</p>
                  <p className="text-[10px] sm:text-xs text-blue-500 flex items-center gap-1 mt-1">
                    <Clock className="h-3 w-3" />
                    Active tasks
                  </p>
                </div>
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-500/20 to-transparent rounded-bl-full" />
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">To Do</p>
                  <p className="text-xl sm:text-2xl font-bold">{todo}</p>
                  <p className="text-[10px] sm:text-xs text-purple-500 flex items-center gap-1 mt-1">
                    <ListTodo className="h-3 w-3" />
                    Pending tasks
                  </p>
                </div>
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                  <ListTodo className="h-5 w-5 sm:h-6 sm:w-6 text-purple-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-500/20 to-transparent rounded-bl-full" />
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Boards</p>
                  <p className="text-xl sm:text-2xl font-bold">{analytics.totalBoards}</p>
                  <p className="text-[10px] sm:text-xs text-orange-500 flex items-center gap-1 mt-1">
                    <Target className="h-3 w-3" />
                    Active boards
                  </p>
                </div>
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
                  <Target className="h-5 w-5 sm:h-6 sm:w-6 text-orange-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts - Real Data */}
      <div className="grid gap-4 md:gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Status Distribution Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                    <PieChartIcon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    Status Distribution
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Current tasks by status
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="text-xs">Live Data</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] sm:h-[300px]">
                {statusDistribution.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {statusDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--popover))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    No tasks yet
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Priority Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                    <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    Priority Distribution
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Tasks by priority level
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="text-xs">Live Data</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] sm:h-[300px]">
                {priorityDistribution.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={priorityDistribution} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis type="number" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                      <YAxis dataKey="name" type="category" tick={{ fill: 'hsl(var(--muted-foreground))' }} width={80} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--popover))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                      />
                      <Bar dataKey="value" name="Tasks" radius={[0, 4, 4, 0]}>
                        {priorityDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    No tasks yet
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tasks by Board */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    Tasks by Board
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Distribution across boards
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="text-xs">Live Data</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] sm:h-[300px]">
                {boardDistribution.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={boardDistribution}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                      <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--popover))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                      />
                      <Bar dataKey="count" name="Tasks" radius={[4, 4, 0, 0]}>
                        {boardDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    No boards yet
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Activity This Week */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    Activity This Week
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Task updates per day
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="text-xs">Last 7 Days</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] sm:h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={tasksByDay}>
                    <defs>
                      <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="day" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                    <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--popover))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="tasks"
                      name="Tasks Updated"
                      stroke="#6366f1"
                      fillOpacity={1}
                      fill="url(#colorTasks)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
