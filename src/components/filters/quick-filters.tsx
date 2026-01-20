'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Filter,
  X,
  Star,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Circle,
  Timer,
  CalendarDays,
  User,
  Tag,
  ChevronDown,
  Save,
  Trash2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { TaskStatus, TaskPriority } from '@/types'

export interface FilterState {
  status: TaskStatus[]
  priority: TaskPriority[]
  assignee: string[]
  dueDateRange: 'all' | 'overdue' | 'today' | 'week' | 'month'
  searchQuery: string
}

export interface SavedFilter {
  id: string
  name: string
  filters: FilterState
  isDefault?: boolean
}

interface QuickFiltersProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  savedFilters?: SavedFilter[]
  onSaveFilter?: (name: string, filters: FilterState) => void
  onDeleteFilter?: (id: string) => void
  onApplySavedFilter?: (filter: SavedFilter) => void
  assignees?: string[]
}

const defaultFilters: FilterState = {
  status: [],
  priority: [],
  assignee: [],
  dueDateRange: 'all',
  searchQuery: '',
}

const statusOptions: { value: TaskStatus; label: string; icon: typeof Circle; color: string }[] = [
  { value: 'todo', label: 'To Do', icon: Circle, color: 'text-slate-500' },
  { value: 'in_progress', label: 'In Progress', icon: Timer, color: 'text-blue-500' },
  { value: 'done', label: 'Done', icon: CheckCircle2, color: 'text-green-500' },
]

const priorityOptions: { value: TaskPriority; label: string; color: string }[] = [
  { value: 'high', label: 'High', color: 'bg-red-500/10 text-red-600 border-red-200' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-500/10 text-yellow-600 border-yellow-200' },
  { value: 'low', label: 'Low', color: 'bg-slate-500/10 text-slate-600 border-slate-200' },
]

const dateRangeOptions = [
  { value: 'all', label: 'Any time', icon: CalendarDays },
  { value: 'overdue', label: 'Overdue', icon: AlertTriangle },
  { value: 'today', label: 'Due today', icon: Clock },
  { value: 'week', label: 'This week', icon: CalendarDays },
  { value: 'month', label: 'This month', icon: CalendarDays },
] as const

export function QuickFilters({
  filters,
  onFiltersChange,
  savedFilters = [],
  onSaveFilter,
  onDeleteFilter,
  onApplySavedFilter,
  assignees = [],
}: QuickFiltersProps) {
  const [saveFilterName, setSaveFilterName] = useState('')
  const [isSavePopoverOpen, setIsSavePopoverOpen] = useState(false)

  const activeFilterCount =
    filters.status.length +
    filters.priority.length +
    filters.assignee.length +
    (filters.dueDateRange !== 'all' ? 1 : 0)

  const hasActiveFilters = activeFilterCount > 0

  const toggleStatus = (status: TaskStatus) => {
    const newStatus = filters.status.includes(status)
      ? filters.status.filter((s) => s !== status)
      : [...filters.status, status]
    onFiltersChange({ ...filters, status: newStatus })
  }

  const togglePriority = (priority: TaskPriority) => {
    const newPriority = filters.priority.includes(priority)
      ? filters.priority.filter((p) => p !== priority)
      : [...filters.priority, priority]
    onFiltersChange({ ...filters, priority: newPriority })
  }

  const toggleAssignee = (assignee: string) => {
    const newAssignee = filters.assignee.includes(assignee)
      ? filters.assignee.filter((a) => a !== assignee)
      : [...filters.assignee, assignee]
    onFiltersChange({ ...filters, assignee: newAssignee })
  }

  const setDateRange = (range: FilterState['dueDateRange']) => {
    onFiltersChange({ ...filters, dueDateRange: range })
  }

  const clearFilters = () => {
    onFiltersChange(defaultFilters)
  }

  const handleSaveFilter = () => {
    if (saveFilterName.trim() && onSaveFilter) {
      onSaveFilter(saveFilterName.trim(), filters)
      setSaveFilterName('')
      setIsSavePopoverOpen(false)
    }
  }

  return (
    <div className="space-y-3">
      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Saved Filters Dropdown */}
        {savedFilters.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1.5">
                <Star className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Saved Views</span>
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              {savedFilters.map((filter) => (
                <DropdownMenuItem
                  key={filter.id}
                  className="flex items-center justify-between"
                  onClick={() => onApplySavedFilter?.(filter)}
                >
                  <span className="flex items-center gap-2">
                    {filter.isDefault && <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />}
                    {filter.name}
                  </span>
                  {onDeleteFilter && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100"
                      onClick={(e) => {
                        e.stopPropagation()
                        onDeleteFilter(filter.id)
                      }}
                    >
                      <Trash2 className="h-3 w-3 text-muted-foreground" />
                    </Button>
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Status Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant={filters.status.length > 0 ? 'secondary' : 'outline'}
              size="sm"
              className="h-8 gap-1.5"
            >
              <Circle className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Status</span>
              {filters.status.length > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                  {filters.status.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {statusOptions.map((option) => {
              const Icon = option.icon
              const isSelected = filters.status.includes(option.value)
              return (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => toggleStatus(option.value)}
                  className={cn(isSelected && 'bg-accent')}
                >
                  <Icon className={cn('h-4 w-4 mr-2', option.color)} />
                  {option.label}
                  {isSelected && <CheckCircle2 className="ml-auto h-4 w-4 text-primary" />}
                </DropdownMenuItem>
              )
            })}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Priority Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant={filters.priority.length > 0 ? 'secondary' : 'outline'}
              size="sm"
              className="h-8 gap-1.5"
            >
              <AlertTriangle className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Priority</span>
              {filters.priority.length > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                  {filters.priority.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {priorityOptions.map((option) => {
              const isSelected = filters.priority.includes(option.value)
              return (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => togglePriority(option.value)}
                  className={cn(isSelected && 'bg-accent')}
                >
                  <Badge variant="outline" className={cn('mr-2', option.color)}>
                    {option.label}
                  </Badge>
                  {isSelected && <CheckCircle2 className="ml-auto h-4 w-4 text-primary" />}
                </DropdownMenuItem>
              )
            })}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Due Date Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant={filters.dueDateRange !== 'all' ? 'secondary' : 'outline'}
              size="sm"
              className="h-8 gap-1.5"
            >
              <CalendarDays className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Due Date</span>
              {filters.dueDateRange !== 'all' && (
                <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                  1
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {dateRangeOptions.map((option) => {
              const Icon = option.icon
              const isSelected = filters.dueDateRange === option.value
              return (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => setDateRange(option.value)}
                  className={cn(isSelected && 'bg-accent')}
                >
                  <Icon className={cn('h-4 w-4 mr-2', option.value === 'overdue' && 'text-red-500')} />
                  {option.label}
                  {isSelected && <CheckCircle2 className="ml-auto h-4 w-4 text-primary" />}
                </DropdownMenuItem>
              )
            })}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Assignee Filter */}
        {assignees.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant={filters.assignee.length > 0 ? 'secondary' : 'outline'}
                size="sm"
                className="h-8 gap-1.5"
              >
                <User className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Assignee</span>
                {filters.assignee.length > 0 && (
                  <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                    {filters.assignee.length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {assignees.map((assignee) => {
                const isSelected = filters.assignee.includes(assignee)
                return (
                  <DropdownMenuItem
                    key={assignee}
                    onClick={() => toggleAssignee(assignee)}
                    className={cn(isSelected && 'bg-accent')}
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-medium mr-2">
                      {assignee.charAt(0).toUpperCase()}
                    </div>
                    {assignee}
                    {isSelected && <CheckCircle2 className="ml-auto h-4 w-4 text-primary" />}
                  </DropdownMenuItem>
                )
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Divider */}
        {hasActiveFilters && <div className="h-6 w-px bg-border" />}

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-muted-foreground hover:text-foreground"
            onClick={clearFilters}
          >
            <X className="h-3.5 w-3.5 mr-1" />
            Clear all
          </Button>
        )}

        {/* Save Filter */}
        {hasActiveFilters && onSaveFilter && (
          <Popover open={isSavePopoverOpen} onOpenChange={setIsSavePopoverOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 text-muted-foreground hover:text-foreground">
                <Save className="h-3.5 w-3.5 mr-1" />
                Save view
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64" align="start">
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-sm font-medium">View name</label>
                  <Input
                    value={saveFilterName}
                    onChange={(e) => setSaveFilterName(e.target.value)}
                    placeholder="e.g., My high priority tasks"
                    className="h-8"
                  />
                </div>
                <Button
                  size="sm"
                  className="w-full"
                  onClick={handleSaveFilter}
                  disabled={!saveFilterName.trim()}
                >
                  Save View
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>

      {/* Active Filter Pills */}
      <AnimatePresence>
        {hasActiveFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap gap-2"
          >
            {filters.status.map((status) => {
              const option = statusOptions.find((o) => o.value === status)!
              const Icon = option.icon
              return (
                <Badge
                  key={`status-${status}`}
                  variant="secondary"
                  className="gap-1 pl-2 pr-1 py-1"
                >
                  <Icon className={cn('h-3 w-3', option.color)} />
                  {option.label}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 ml-1 hover:bg-transparent"
                    onClick={() => toggleStatus(status)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )
            })}
            {filters.priority.map((priority) => {
              const option = priorityOptions.find((o) => o.value === priority)!
              return (
                <Badge
                  key={`priority-${priority}`}
                  variant="outline"
                  className={cn('gap-1 pl-2 pr-1 py-1', option.color)}
                >
                  {option.label} Priority
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 ml-1 hover:bg-transparent"
                    onClick={() => togglePriority(priority)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )
            })}
            {filters.dueDateRange !== 'all' && (
              <Badge variant="secondary" className="gap-1 pl-2 pr-1 py-1">
                <CalendarDays className="h-3 w-3" />
                {dateRangeOptions.find((o) => o.value === filters.dueDateRange)?.label}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 ml-1 hover:bg-transparent"
                  onClick={() => setDateRange('all')}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            {filters.assignee.map((assignee) => (
              <Badge key={`assignee-${assignee}`} variant="secondary" className="gap-1 pl-2 pr-1 py-1">
                <User className="h-3 w-3" />
                {assignee}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 ml-1 hover:bg-transparent"
                  onClick={() => toggleAssignee(assignee)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
