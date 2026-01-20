'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Task, TaskStatus, TaskPriority, UpdateTaskDto } from '@/types'

interface EditTaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  task: Task | null
  onSubmit: (id: string, data: UpdateTaskDto) => Promise<void>
}

export function EditTaskDialog({
  open,
  onOpenChange,
  task,
  onSubmit,
}: EditTaskDialogProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState<TaskStatus>('todo')
  const [priority, setPriority] = useState<TaskPriority>('medium')
  const [dueDate, setDueDate] = useState('')
  const [assignedTo, setAssignedTo] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Populate form when task changes
  useEffect(() => {
    if (task) {
      setTitle(task.title)
      setDescription(task.description || '')
      setStatus(task.status)
      setPriority(task.priority)
      setDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '')
      setAssignedTo(task.assignedTo || '')
    }
  }, [task])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!task) return

    if (!title.trim()) {
      setError('Task title is required')
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit(task.id, {
        title: title.trim(),
        description: description.trim() || null,
        status,
        priority,
        dueDate: dueDate ? new Date(dueDate).toISOString() : null,
        assignedTo: assignedTo.trim() || null,
      })
      onOpenChange(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="pb-2 sm:pb-4">
            <DialogTitle className="text-lg sm:text-xl">Edit Task</DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Make changes to this task. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3 sm:gap-4 py-3 sm:py-4">
            {/* Task Title */}
            <div className="space-y-1.5 sm:space-y-2">
              <label htmlFor="edit-title" className="text-xs sm:text-sm font-medium">
                Task Title <span className="text-destructive">*</span>
              </label>
              <Input
                id="edit-title"
                placeholder="e.g., Implement user authentication"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={200}
                className="h-9 sm:h-10 text-sm"
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5 sm:space-y-2">
              <label htmlFor="edit-description" className="text-xs sm:text-sm font-medium">
                Description
              </label>
              <Textarea
                id="edit-description"
                placeholder="Add more details about this task..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={2000}
                rows={2}
                className="text-sm min-h-[60px] sm:min-h-[80px]"
              />
            </div>

            {/* Status and Priority */}
            <div className="grid grid-cols-2 gap-2 sm:gap-4">
              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-xs sm:text-sm font-medium">Status</label>
                <Select value={status} onValueChange={(v) => setStatus(v as TaskStatus)}>
                  <SelectTrigger className="h-9 sm:h-10 text-xs sm:text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo" className="text-xs sm:text-sm">To Do</SelectItem>
                    <SelectItem value="in_progress" className="text-xs sm:text-sm">In Progress</SelectItem>
                    <SelectItem value="done" className="text-xs sm:text-sm">Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-xs sm:text-sm font-medium">Priority</label>
                <Select value={priority} onValueChange={(v) => setPriority(v as TaskPriority)}>
                  <SelectTrigger className="h-9 sm:h-10 text-xs sm:text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low" className="text-xs sm:text-sm">Low</SelectItem>
                    <SelectItem value="medium" className="text-xs sm:text-sm">Medium</SelectItem>
                    <SelectItem value="high" className="text-xs sm:text-sm">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Due Date and Assigned To */}
            <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 sm:gap-4">
              <div className="space-y-1.5 sm:space-y-2">
                <label htmlFor="edit-dueDate" className="text-xs sm:text-sm font-medium">
                  Due Date
                </label>
                <Input
                  id="edit-dueDate"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="h-9 sm:h-10 text-sm"
                />
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <label htmlFor="edit-assignedTo" className="text-xs sm:text-sm font-medium">
                  Assigned To
                </label>
                <Input
                  id="edit-assignedTo"
                  placeholder="e.g., John Doe"
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  maxLength={100}
                  className="h-9 sm:h-10 text-sm"
                />
              </div>
            </div>

            {error && (
              <p className="text-xs sm:text-sm text-destructive">{error}</p>
            )}
          </div>

          <DialogFooter className="flex-col-reverse sm:flex-row gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="w-full sm:w-auto h-9 sm:h-10 text-sm"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto h-9 sm:h-10 text-sm">
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
