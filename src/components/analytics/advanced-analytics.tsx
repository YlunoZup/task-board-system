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
  TrendingDown,
  Target,
  Zap,
  Clock,
  CheckCircle2,
  BarChart3,
  PieChart as PieChartIcon,
} from 'lucide-react'
import { Analytics, Task } from '@/types'

interface AdvancedAnalyticsProps {
  analytics: Analytics | null
  isLoading: boolean
}

// Mock data for demo - in production, this would come from the API
const velocityData = [
  { week: 'Week 1', completed: 8, added: 12 },
  { week: 'Week 2', completed: 15, added: 10 },
  { week: 'Week 3', completed: 12, added: 14 },
  { week: 'Week 4', completed: 18, added: 8 },
  { week: 'Week 5', completed: 22, added: 15 },
  { week: 'Week 6', completed: 19, added: 11 },
]

const burndownData = [
  { day: 'Mon', remaining: 45, ideal: 45 },
  { day: 'Tue', remaining: 42, ideal: 37.5 },
  { day: 'Wed', remaining: 38, ideal: 30 },
  { day: 'Thu', remaining: 32, ideal: 22.5 },
  { day: 'Fri', remaining: 25, ideal: 15 },
  { day: 'Sat', remaining: 18, ideal: 7.5 },
  { day: 'Sun', remaining: 12, ideal: 0 },
]

const priorityDistribution = [
  { name: 'High', value: 8, color: '#ef4444' },
  { name: 'Medium', value: 15, color: '#eab308' },
  { name: 'Low', value: 12, color: '#94a3b8' },
]

const COLORS = ['#ef4444', '#eab308', '#94a3b8']

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

  const completionTrend = analytics.completionRate > 50 ? 'up' : 'down'
  const avgTasksPerDay = (analytics.totalTasks / 7).toFixed(1)

  return (
    <div className="space-y-6">
      {/* Performance Metrics */}
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
                  <p className="text-xs sm:text-sm text-muted-foreground">Velocity</p>
                  <p className="text-xl sm:text-2xl font-bold">18.5</p>
                  <p className="text-[10px] sm:text-xs text-green-500 flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3" />
                    +12% from last week
                  </p>
                </div>
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-green-500" />
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
                  <p className="text-xs sm:text-sm text-muted-foreground">Avg. Cycle Time</p>
                  <p className="text-xl sm:text-2xl font-bold">2.4d</p>
                  <p className="text-[10px] sm:text-xs text-blue-500 flex items-center gap-1 mt-1">
                    <Clock className="h-3 w-3" />
                    -8% improvement
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
                  <p className="text-xs sm:text-sm text-muted-foreground">Sprint Goal</p>
                  <p className="text-xl sm:text-2xl font-bold">{analytics.completionRate}%</p>
                  <p className="text-[10px] sm:text-xs text-purple-500 flex items-center gap-1 mt-1">
                    <Target className="h-3 w-3" />
                    On track
                  </p>
                </div>
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                  <Target className="h-5 w-5 sm:h-6 sm:w-6 text-purple-500" />
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
                  <p className="text-xs sm:text-sm text-muted-foreground">Tasks/Day</p>
                  <p className="text-xl sm:text-2xl font-bold">{avgTasksPerDay}</p>
                  <p className="text-[10px] sm:text-xs text-orange-500 flex items-center gap-1 mt-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Average daily
                  </p>
                </div>
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-orange-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Velocity Chart */}
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
                    <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    Team Velocity
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Tasks completed vs added per week
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="text-xs">Last 6 weeks</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] sm:h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={velocityData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="week" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                    <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--popover))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend />
                    <Bar dataKey="completed" name="Completed" fill="#22c55e" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="added" name="Added" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Burndown Chart */}
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
                    <TrendingDown className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    Sprint Burndown
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Remaining work vs ideal trajectory
                  </CardDescription>
                </div>
                <Badge variant="outline" className="text-xs text-green-600 border-green-600">On Track</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] sm:h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={burndownData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="day" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                    <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--popover))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="ideal"
                      name="Ideal"
                      stroke="#94a3b8"
                      fill="#94a3b8"
                      fillOpacity={0.1}
                      strokeDasharray="5 5"
                    />
                    <Area
                      type="monotone"
                      dataKey="remaining"
                      name="Remaining"
                      stroke="#6366f1"
                      fill="#6366f1"
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Priority Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                <PieChartIcon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                Priority Distribution
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Breakdown of tasks by priority level
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] sm:h-[300px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={priorityDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {priorityDistribution.map((entry, index) => (
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
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Completion Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                Completion Trend
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Tasks completed over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] sm:h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={[
                      { date: 'Jan', tasks: 12 },
                      { date: 'Feb', tasks: 19 },
                      { date: 'Mar', tasks: 15 },
                      { date: 'Apr', tasks: 25 },
                      { date: 'May', tasks: 32 },
                      { date: 'Jun', tasks: 28 },
                    ]}
                  >
                    <defs>
                      <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="date" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                    <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
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
                      stroke="#22c55e"
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
