'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, Reorder } from 'framer-motion'
import {
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  GripVertical,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Subtask } from '@/types'
import { cn } from '@/lib/utils'

interface SubtaskListProps {
  subtasks: Subtask[]
  onAddSubtask: (title: string) => Promise<void>
  onToggleSubtask: (id: string, completed: boolean) => Promise<void>
  onDeleteSubtask: (id: string) => Promise<void>
  onReorderSubtasks?: (subtasks: Subtask[]) => Promise<void>
  isReadOnly?: boolean
}

export function SubtaskList({
  subtasks,
  onAddSubtask,
  onToggleSubtask,
  onDeleteSubtask,
  onReorderSubtasks,
  isReadOnly = false,
}: SubtaskListProps) {
  const [newSubtask, setNewSubtask] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const [showAddInput, setShowAddInput] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const completedCount = subtasks.filter((s) => s.completed).length
  const totalCount = subtasks.length
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0

  useEffect(() => {
    if (showAddInput && inputRef.current) {
      inputRef.current.focus()
    }
  }, [showAddInput])

  const handleAdd = async () => {
    if (!newSubtask.trim()) return
    setIsAdding(true)
    try {
      await onAddSubtask(newSubtask.trim())
      setNewSubtask('')
    } finally {
      setIsAdding(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAdd()
    }
    if (e.key === 'Escape') {
      setShowAddInput(false)
      setNewSubtask('')
    }
  }

  return (
    <div className="space-y-3">
      {/* Progress indicator */}
      {totalCount > 0 && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">
              {completedCount}/{totalCount} ({Math.round(progress)}%)
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}

      {/* Subtask list */}
      <div className="space-y-1">
        <AnimatePresence mode="popLayout">
          {subtasks.length === 0 && !showAddInput ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-4 text-muted-foreground text-sm"
            >
              No subtasks yet
            </motion.div>
          ) : (
            subtasks
              .sort((a, b) => a.position - b.position)
              .map((subtask) => (
                <SubtaskItem
                  key={subtask.id}
                  subtask={subtask}
                  onToggle={onToggleSubtask}
                  onDelete={onDeleteSubtask}
                  isReadOnly={isReadOnly}
                />
              ))
          )}
        </AnimatePresence>
      </div>

      {/* Add subtask input */}
      {!isReadOnly && (
        <div className="mt-2">
          {showAddInput ? (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2"
            >
              <Input
                ref={inputRef}
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Add a subtask..."
                className="h-8 text-sm"
                disabled={isAdding}
              />
              <Button
                size="sm"
                onClick={handleAdd}
                disabled={!newSubtask.trim() || isAdding}
                className="h-8 px-3"
              >
                <Plus className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setShowAddInput(false)
                  setNewSubtask('')
                }}
                className="h-8 px-2"
              >
                <X className="h-4 w-4" />
              </Button>
            </motion.div>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAddInput(true)}
              className="w-full justify-start text-muted-foreground hover:text-foreground h-8"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add subtask
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

interface SubtaskItemProps {
  subtask: Subtask
  onToggle: (id: string, completed: boolean) => Promise<void>
  onDelete: (id: string) => Promise<void>
  isReadOnly?: boolean
}

function SubtaskItem({ subtask, onToggle, onDelete, isReadOnly }: SubtaskItemProps) {
  const [isUpdating, setIsUpdating] = useState(false)

  const handleToggle = async () => {
    if (isReadOnly || isUpdating) return
    setIsUpdating(true)
    try {
      await onToggle(subtask.id, !subtask.completed)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDelete = async () => {
    if (isReadOnly || isUpdating) return
    setIsUpdating(true)
    try {
      await onDelete(subtask.id)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={cn(
        'flex items-center gap-2 p-2 rounded-lg group transition-colors',
        'hover:bg-muted/50',
        isUpdating && 'opacity-50 pointer-events-none'
      )}
    >
      {!isReadOnly && (
        <GripVertical className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 cursor-grab" />
      )}
      <button
        onClick={handleToggle}
        disabled={isReadOnly || isUpdating}
        className="shrink-0 transition-transform hover:scale-110"
      >
        {subtask.completed ? (
          <CheckCircle2 className="h-5 w-5 text-green-500" />
        ) : (
          <Circle className="h-5 w-5 text-muted-foreground hover:text-primary" />
        )}
      </button>
      <span
        className={cn(
          'flex-1 text-sm transition-all',
          subtask.completed && 'line-through text-muted-foreground'
        )}
      >
        {subtask.title}
      </span>
      {!isReadOnly && (
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDelete}
          disabled={isUpdating}
          className="h-7 w-7 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </motion.div>
  )
}

// Compact version for task cards
interface SubtaskProgressProps {
  subtasks: Subtask[]
  className?: string
}

export function SubtaskProgress({ subtasks, className }: SubtaskProgressProps) {
  if (subtasks.length === 0) return null

  const completedCount = subtasks.filter((s) => s.completed).length
  const totalCount = subtasks.length
  const progress = (completedCount / totalCount) * 100

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
        <motion.div
          className={cn(
            'h-full rounded-full',
            progress === 100 ? 'bg-green-500' : 'bg-primary'
          )}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
      <span className="text-[10px] text-muted-foreground whitespace-nowrap">
        {completedCount}/{totalCount}
      </span>
    </div>
  )
}
