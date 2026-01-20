'use client'

import { Plus } from 'lucide-react'
import { useDroppable } from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TaskCard } from './task-card'
import { Task, TaskStatus } from '@/types'
import { statusConfig, cn } from '@/lib/utils'

interface KanbanColumnProps {
  status: TaskStatus
  tasks: Task[]
  onAddTask: (status: TaskStatus) => void
  onUpdateTask: (id: string, data: Partial<Task>) => Promise<void>
  onDeleteTask: (id: string) => Promise<void>
  onEditTask: (task: Task) => void
}

export function KanbanColumn({
  status,
  tasks,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onEditTask,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  })

  const config = statusConfig[status]
  const taskIds = tasks.map((t) => t.id)

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex-shrink-0 w-[280px] sm:w-[300px] md:w-[320px] lg:flex-1 lg:min-w-[280px] lg:max-w-[400px]',
        'flex flex-col bg-muted/50 rounded-xl p-3 sm:p-4',
        isOver && 'ring-2 ring-primary ring-offset-2'
      )}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className={cn('h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full', config.dotColor)} />
          <h3 className="font-semibold text-sm sm:text-base">{config.label}</h3>
          <Badge variant="secondary" className="ml-1 text-[10px] sm:text-xs">
            {tasks.length}
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 sm:h-8 sm:w-8"
          onClick={() => onAddTask(status)}
        >
          <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </Button>
      </div>

      {/* Tasks List */}
      <div className="flex-1 space-y-2 sm:space-y-3 min-h-[150px] sm:min-h-[200px] overflow-y-auto">
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onUpdate={onUpdateTask}
              onDelete={onDeleteTask}
              onEdit={onEditTask}
            />
          ))}
        </SortableContext>

        {tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center h-24 sm:h-32 border-2 border-dashed rounded-lg text-muted-foreground">
            <p className="text-xs sm:text-sm">No tasks</p>
            <Button
              variant="link"
              size="sm"
              className="mt-1 text-xs sm:text-sm h-auto py-1"
              onClick={() => onAddTask(status)}
            >
              Add a task
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
