'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
} from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import {
  ArrowLeft,
  Plus,
  Search,
  Filter,
  SortAsc,
  RefreshCw,
  MoreHorizontal,
  Trash2,
  Keyboard,
  Command,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { KanbanColumn } from '@/components/task/kanban-column'
import { TaskCard } from '@/components/task/task-card'
import { CreateTaskDialog } from '@/components/task/create-task-dialog'
import { EditTaskDialog } from '@/components/task/edit-task-dialog'
import { LoadingPage } from '@/components/ui/loading'
import { toast } from '@/components/ui/toaster'
import { CommandPalette } from '@/components/command-palette/command-palette'
import { KeyboardShortcutsDialog } from '@/components/keyboard-shortcuts/keyboard-shortcuts-dialog'
import { triggerTaskCompleteConfetti, triggerBoardCompleteConfetti } from '@/components/ui/confetti'
import { useTheme } from '@/components/providers/theme-provider'
import {
  BoardWithTasks,
  Task,
  TaskStatus,
  TaskPriority,
  CreateTaskDto,
  UpdateTaskDto,
} from '@/types'
import { cn } from '@/lib/utils'

const statuses: TaskStatus[] = ['todo', 'in_progress', 'done']

interface BoardPageProps {
  params: { id: string }
}

export default function BoardPage({ params }: BoardPageProps) {
  const { id } = params
  const router = useRouter()
  const { theme, setTheme } = useTheme()

  const [board, setBoard] = useState<BoardWithTasks | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Filters and sorting
  const [searchQuery, setSearchQuery] = useState('')
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'all'>('all')
  const [sortBy, setSortBy] = useState<'createdAt' | 'priority' | 'dueDate'>('createdAt')

  // Dialogs
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [createDialogStatus, setCreateDialogStatus] = useState<TaskStatus>('todo')
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  // Command palette and shortcuts
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false)
  const [isShortcutsDialogOpen, setIsShortcutsDialogOpen] = useState(false)

  // Drag and drop
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const [dragStartStatus, setDragStartStatus] = useState<TaskStatus | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Fetch board data
  const fetchBoard = useCallback(async () => {
    try {
      const response = await fetch(`/api/boards/${id}`)
      if (!response.ok) {
        if (response.status === 404) {
          toast({
            title: 'Board not found',
            description: 'This board does not exist',
            variant: 'destructive',
          })
          router.push('/')
          return
        }
        throw new Error('Failed to fetch board')
      }
      const result = await response.json()
      setBoard(result.data)
    } catch (error) {
      console.error('Error fetching board:', error)
      toast({
        title: 'Error',
        description: 'Failed to load board',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }, [id, router])

  useEffect(() => {
    fetchBoard()
  }, [fetchBoard])

  // Polling for real-time updates
  useEffect(() => {
    const interval = setInterval(fetchBoard, 30000)
    return () => clearInterval(interval)
  }, [fetchBoard])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      // ? - Show keyboard shortcuts
      if (e.key === '?' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault()
        setIsShortcutsDialogOpen(true)
      }

      // Cmd/Ctrl + T - Create new task
      if (e.key === 't' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        handleOpenCreateDialog('todo')
      }

      // Cmd/Ctrl + D - Toggle dark mode
      if (e.key === 'd' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setTheme(theme === 'dark' ? 'light' : 'dark')
      }

      // Cmd/Ctrl + R - Refresh
      if (e.key === 'r' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        handleRefresh()
      }

      // Cmd/Ctrl + F - Focus search
      if (e.key === 'f' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        const searchInput = document.querySelector('input[placeholder="Search..."]') as HTMLInputElement
        searchInput?.focus()
      }

      // Number keys for priority filter
      if (e.key === '1' && !e.metaKey && !e.ctrlKey) {
        setPriorityFilter('all')
      }
      if (e.key === '2' && !e.metaKey && !e.ctrlKey) {
        setPriorityFilter('high')
      }
      if (e.key === '3' && !e.metaKey && !e.ctrlKey) {
        setPriorityFilter('medium')
      }
      if (e.key === '4' && !e.metaKey && !e.ctrlKey) {
        setPriorityFilter('low')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme, setTheme])

  // Refresh handler
  const handleRefresh = async () => {
    setIsRefreshing(true)
    await fetchBoard()
    setIsRefreshing(false)
    toast({
      title: 'Refreshed',
      description: 'Board data has been updated',
      variant: 'success',
    })
  }

  // Delete board
  const handleDeleteBoard = async () => {
    if (!board) return

    if (!confirm('Are you sure you want to delete this board? All tasks will be deleted.')) {
      return
    }

    try {
      const response = await fetch(`/api/boards/${id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Failed to delete board')

      toast({
        title: 'Board deleted',
        description: 'The board has been deleted',
        variant: 'success',
      })
      router.push('/')
    } catch (error) {
      console.error('Error deleting board:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete board',
        variant: 'destructive',
      })
    }
  }

  // Create task
  const handleCreateTask = async (data: Omit<CreateTaskDto, 'boardId'>) => {
    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, boardId: id }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to create task')
    }

    const result = await response.json()
    setBoard((prev) =>
      prev ? { ...prev, tasks: [...prev.tasks, result.data] } : null
    )

    toast({
      title: 'Task created',
      description: `"${data.title}" has been created`,
      variant: 'success',
    })
  }

  // Update task
  const handleUpdateTask = async (taskId: string, data: UpdateTaskDto) => {
    // Check if this is a completion (moving to done)
    const taskBeforeUpdate = board?.tasks.find(t => t.id === taskId)
    const isCompletingTask = data.status === 'done' && taskBeforeUpdate?.status !== 'done'

    const response = await fetch(`/api/tasks/${taskId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to update task')
    }

    const result = await response.json()
    setBoard((prev) => {
      if (!prev) return null
      const updatedTasks = prev.tasks.map((t) =>
        t.id === taskId ? result.data : t
      )

      // Check if all tasks are now complete
      const allTasksComplete = updatedTasks.length > 0 && updatedTasks.every(t => t.status === 'done')

      // Trigger big celebration if all tasks complete
      if (allTasksComplete && isCompletingTask) {
        setTimeout(() => triggerBoardCompleteConfetti(), 100)
        toast({
          title: '🎉 All tasks completed!',
          description: 'Amazing! You\'ve completed all tasks on this board!',
          variant: 'success',
        })
      } else if (isCompletingTask) {
        // Trigger task complete confetti
        triggerTaskCompleteConfetti()
      }

      return { ...prev, tasks: updatedTasks }
    })

    if (!isCompletingTask) {
      toast({
        title: 'Task updated',
        description: 'Changes have been saved',
        variant: 'success',
      })
    } else {
      toast({
        title: '✅ Task completed!',
        description: 'Great job! Keep up the momentum.',
        variant: 'success',
      })
    }
  }

  // Delete task
  const handleDeleteTask = async (taskId: string) => {
    const response = await fetch(`/api/tasks/${taskId}`, { method: 'DELETE' })

    if (!response.ok) {
      toast({
        title: 'Error',
        description: 'Failed to delete task',
        variant: 'destructive',
      })
      return
    }

    setBoard((prev) =>
      prev
        ? { ...prev, tasks: prev.tasks.filter((t) => t.id !== taskId) }
        : null
    )

    toast({
      title: 'Task deleted',
      description: 'The task has been deleted',
      variant: 'success',
    })
  }

  // Open create dialog with specific status
  const handleOpenCreateDialog = (status: TaskStatus) => {
    setCreateDialogStatus(status)
    setIsCreateDialogOpen(true)
  }

  // Open edit dialog
  const handleOpenEditDialog = (task: Task) => {
    setEditingTask(task)
    setIsEditDialogOpen(true)
  }

  // Drag handlers
  const handleDragStart = (event: DragStartEvent) => {
    const task = board?.tasks.find((t) => t.id === event.active.id)
    if (task) {
      setActiveTask(task)
      setDragStartStatus(task.status) // Save original status before any optimistic updates
    }
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over || !board) return

    const activeTask = board.tasks.find((t) => t.id === active.id)
    if (!activeTask) return

    // Check if dropping over a column
    const overStatus = statuses.find((s) => s === over.id)
    if (overStatus && activeTask.status !== overStatus) {
      setBoard((prev) =>
        prev
          ? {
              ...prev,
              tasks: prev.tasks.map((t) =>
                t.id === active.id ? { ...t, status: overStatus } : t
              ),
            }
          : null
      )
    }
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    const originalStatus = dragStartStatus // Capture before clearing
    setActiveTask(null)
    setDragStartStatus(null)

    if (!over || !board || !originalStatus) return

    const activeTaskId = active.id as string

    // Determine the target status
    let targetStatus: TaskStatus | null = null

    // Check if dropping over a column
    if (statuses.includes(over.id as TaskStatus)) {
      targetStatus = over.id as TaskStatus
    } else {
      // Dropping over another task - get that task's status
      const overTask = board.tasks.find((t) => t.id === over.id)
      if (overTask) {
        targetStatus = overTask.status
      }
    }

    // Compare with ORIGINAL status (before drag), not current status (which was optimistically updated)
    if (targetStatus && originalStatus !== targetStatus) {
      try {
        await handleUpdateTask(activeTaskId, { status: targetStatus })
      } catch (error) {
        // Revert optimistic update on error
        fetchBoard()
      }
    } else if (targetStatus && originalStatus === targetStatus) {
      // Dropped back to original column - revert UI to match
      setBoard((prev) =>
        prev
          ? {
              ...prev,
              tasks: prev.tasks.map((t) =>
                t.id === activeTaskId ? { ...t, status: originalStatus } : t
              ),
            }
          : null
      )
    }
  }

  // Filter and sort tasks
  const getFilteredTasks = (status: TaskStatus) => {
    if (!board) return []

    let tasks = board.tasks.filter((t) => t.status === status)

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      tasks = tasks.filter(
        (t) =>
          t.title.toLowerCase().includes(query) ||
          t.description?.toLowerCase().includes(query)
      )
    }

    // Apply priority filter
    if (priorityFilter !== 'all') {
      tasks = tasks.filter((t) => t.priority === priorityFilter)
    }

    // Apply sorting
    tasks.sort((a, b) => {
      switch (sortBy) {
        case 'priority': {
          const priorityOrder = { high: 0, medium: 1, low: 2 }
          return priorityOrder[a.priority] - priorityOrder[b.priority]
        }
        case 'dueDate': {
          if (!a.dueDate && !b.dueDate) return 0
          if (!a.dueDate) return 1
          if (!b.dueDate) return -1
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        }
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
    })

    return tasks
  }

  if (isLoading) {
    return <LoadingPage message="Loading board..." />
  }

  if (!board) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40"
      >
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
          {/* Top row - Back button, title, actions */}
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
              <Link href="/">
                <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0">
                  <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </Link>
              <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                <div
                  className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg flex items-center justify-center text-white flex-shrink-0"
                  style={{ backgroundColor: board.color }}
                >
                  <span className="text-sm sm:text-lg font-bold">
                    {board.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-base sm:text-xl font-bold truncate">{board.name}</h1>
                  {board.description && (
                    <p className="text-xs sm:text-sm text-muted-foreground truncate hidden sm:block">
                      {board.description}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              <Badge variant="secondary" className="text-[10px] sm:text-xs hidden xs:inline-flex">
                {board.tasks.length} {board.tasks.length === 1 ? 'task' : 'tasks'}
              </Badge>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsCommandPaletteOpen(true)}
                className="h-8 w-8 sm:h-10 sm:w-10 hidden sm:flex"
                title="Command Palette (⌘K)"
              >
                <Command className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsShortcutsDialogOpen(true)}
                className="h-8 w-8 sm:h-10 sm:w-10 hidden md:flex"
                title="Keyboard Shortcuts (?)"
              >
                <Keyboard className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="h-8 w-8 sm:h-10 sm:w-10"
              >
                <RefreshCw className={cn('h-3.5 w-3.5 sm:h-4 sm:w-4', isRefreshing && 'animate-spin')} />
              </Button>
              <Button onClick={() => handleOpenCreateDialog('todo')} className="h-8 sm:h-10 px-2 sm:px-4">
                <Plus className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Add Task</span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10">
                    <MoreHorizontal className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={handleDeleteBoard}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Board
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Filters - scrollable on mobile */}
          <div className="flex items-center gap-2 sm:gap-3 mt-3 sm:mt-4 overflow-x-auto pb-2 -mb-2 scrollbar-hide">
            <div className="relative flex-shrink-0 w-[160px] sm:w-[200px] md:flex-1 md:max-w-xs">
              <Search className="absolute left-2.5 sm:left-3 top-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 sm:pl-9 h-8 sm:h-10 text-sm"
              />
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
              <Filter className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground hidden sm:block" />
              <Select
                value={priorityFilter}
                onValueChange={(v) => setPriorityFilter(v as TaskPriority | 'all')}
              >
                <SelectTrigger className="w-[100px] sm:w-[130px] h-8 sm:h-10 text-xs sm:text-sm">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
              <SortAsc className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground hidden sm:block" />
              <Select
                value={sortBy}
                onValueChange={(v) => setSortBy(v as typeof sortBy)}
              >
                <SelectTrigger className="w-[100px] sm:w-[140px] h-8 sm:h-10 text-xs sm:text-sm">
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt">Date</SelectItem>
                  <SelectItem value="priority">Priority</SelectItem>
                  <SelectItem value="dueDate">Due Date</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Kanban Board - horizontal scroll on mobile */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex-1 overflow-x-auto overflow-y-auto"
      >
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-3 sm:gap-4 md:gap-6 min-h-[calc(100vh-200px)] p-3 sm:p-4 md:p-6 lg:p-8">
            {statuses.map((status) => (
              <KanbanColumn
                key={status}
                status={status}
                tasks={getFilteredTasks(status)}
                onAddTask={handleOpenCreateDialog}
                onUpdateTask={handleUpdateTask}
                onDeleteTask={handleDeleteTask}
                onEditTask={handleOpenEditDialog}
              />
            ))}
          </div>

          <DragOverlay>
            {activeTask && (
              <div className="w-[260px] sm:w-[280px]">
                <TaskCard
                  task={activeTask}
                  onUpdate={handleUpdateTask}
                  onDelete={handleDeleteTask}
                  onEdit={handleOpenEditDialog}
                />
              </div>
            )}
          </DragOverlay>
        </DndContext>
      </motion.div>

      {/* Dialogs */}
      <CreateTaskDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateTask}
        defaultStatus={createDialogStatus}
      />

      <EditTaskDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        task={editingTask}
        onSubmit={handleUpdateTask}
      />

      {/* Command Palette */}
      <CommandPalette
        open={isCommandPaletteOpen}
        onOpenChange={setIsCommandPaletteOpen}
        onCreateTask={() => handleOpenCreateDialog('todo')}
        onRefresh={handleRefresh}
      />

      {/* Keyboard Shortcuts Dialog */}
      <KeyboardShortcutsDialog
        open={isShortcutsDialogOpen}
        onOpenChange={setIsShortcutsDialogOpen}
      />
    </div>
  )
}
