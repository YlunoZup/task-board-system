'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  MoreHorizontal,
  Trash2,
  Edit2,
  Calendar,
  User,
  ChevronRight,
  Minus,
  Equal,
  ChevronsUp,
  GripVertical,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LabelBadges } from '@/components/labels/labels-manager'
import { SubtaskProgress } from '@/components/subtasks/subtask-list'
import { Task, TaskStatus, TaskPriority, Label } from '@/types'
import { formatDate, priorityConfig, statusConfig, cn } from '@/lib/utils'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const priorityIcons = {
  low: Minus,
  medium: Equal,
  high: ChevronsUp,
}

interface TaskCardProps {
  task: Task
  onUpdate: (id: string, data: Partial<Task>) => Promise<void>
  onDelete: (id: string) => Promise<void>
  onEdit: (task: Task) => void
}

export function TaskCard({ task, onUpdate, onDelete, onEdit }: TaskCardProps) {
  const [isUpdating, setIsUpdating] = useState(false)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id })

  // Only apply transform when actively dragging to prevent invisible cards after column change
  const style: React.CSSProperties = {
    transform: isDragging ? CSS.Transform.toString(transform) : undefined,
    transition: isDragging ? transition : undefined,
    opacity: isDragging ? 0.5 : 1,
  }

  const PriorityIcon = priorityIcons[task.priority]
  const prioConfig = priorityConfig[task.priority]
  const statConfig = statusConfig[task.status]

  const handleStatusChange = async (newStatus: TaskStatus) => {
    setIsUpdating(true)
    try {
      await onUpdate(task.id, { status: newStatus })
    } finally {
      setIsUpdating(false)
    }
  }

  const handlePriorityChange = async (newPriority: TaskPriority) => {
    setIsUpdating(true)
    try {
      await onUpdate(task.id, { priority: newPriority })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDelete = async () => {
    setIsUpdating(true)
    try {
      await onDelete(task.id)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      initial={false}
      animate={{ opacity: isDragging ? 0.5 : 1, scale: 1 }}
      className={cn(
        'transition-shadow',
        isDragging && 'shadow-lg z-50'
      )}
    >
      <Card
        className={cn(
          'group cursor-pointer hover:shadow-md transition-all border-l-4',
          isUpdating && 'opacity-70 pointer-events-none'
        )}
        style={{ borderLeftColor: task.priority === 'high' ? '#ef4444' : task.priority === 'medium' ? '#eab308' : '#94a3b8' }}
      >
        <CardContent className="p-3 sm:p-4">
          {/* Header with drag handle and menu */}
          <div className="flex items-start justify-between gap-1.5 sm:gap-2 mb-2">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-1 min-w-0">
              <button
                {...attributes}
                {...listeners}
                className="cursor-grab active:cursor-grabbing p-1 -ml-1 rounded hover:bg-muted opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity touch-none"
              >
                <GripVertical className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
              </button>
              <Badge className={cn('text-[10px] sm:text-xs px-1.5 sm:px-2', prioConfig.color)}>
                <PriorityIcon className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1" />
                {prioConfig.label}
              </Badge>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 sm:h-8 sm:w-8 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity -mr-1 sm:-mr-2 -mt-1"
                >
                  <MoreHorizontal className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => onEdit(task)}>
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit Task
                </DropdownMenuItem>

                {/* Status submenu */}
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <ChevronRight className="h-4 w-4 mr-2" />
                    Change Status
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    {(['todo', 'in_progress', 'done'] as TaskStatus[]).map((status) => (
                      <DropdownMenuItem
                        key={status}
                        onClick={() => handleStatusChange(status)}
                        disabled={task.status === status}
                      >
                        <div
                          className={cn(
                            'h-2 w-2 rounded-full mr-2',
                            statusConfig[status].dotColor
                          )}
                        />
                        {statusConfig[status].label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuSub>

                {/* Priority submenu */}
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <ChevronRight className="h-4 w-4 mr-2" />
                    Change Priority
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    {(['low', 'medium', 'high'] as TaskPriority[]).map((priority) => {
                      const Icon = priorityIcons[priority]
                      return (
                        <DropdownMenuItem
                          key={priority}
                          onClick={() => handlePriorityChange(priority)}
                          disabled={task.priority === priority}
                        >
                          <Icon className="h-4 w-4 mr-2" />
                          {priorityConfig[priority].label}
                        </DropdownMenuItem>
                      )
                    })}
                  </DropdownMenuSubContent>
                </DropdownMenuSub>

                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleDelete}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Task
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Task Title */}
          <h4
            className={cn(
              'font-medium text-xs sm:text-sm mb-1 leading-tight',
              task.status === 'done' && 'line-through text-muted-foreground'
            )}
          >
            {task.title}
          </h4>

          {/* Description */}
          {task.description && (
            <p className="text-[10px] sm:text-xs text-muted-foreground line-clamp-2 mb-2 sm:mb-3">
              {task.description}
            </p>
          )}

          {/* Labels */}
          {task.labels && task.labels.length > 0 && (
            <LabelBadges
              labels={task.labels.map(tl => tl.label!).filter(Boolean)}
              size="sm"
              className="mb-2"
            />
          )}

          {/* Subtask Progress */}
          {task.subtasks && task.subtasks.length > 0 && (
            <SubtaskProgress subtasks={task.subtasks} className="mb-2" />
          )}

          {/* Footer with metadata */}
          <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs text-muted-foreground flex-wrap">
            {task.dueDate && (
              <div className="flex items-center gap-0.5 sm:gap-1">
                <Calendar className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                <span>{formatDate(task.dueDate)}</span>
              </div>
            )}
            {task.assignedTo && (
              <div className="flex items-center gap-0.5 sm:gap-1">
                <User className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                <span className="truncate max-w-[80px] sm:max-w-[100px]">{task.assignedTo}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
