'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, X, Tag, Pencil, Trash2, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Label } from '@/types'
import { cn } from '@/lib/utils'

const PRESET_COLORS = [
  '#ef4444', // red
  '#f97316', // orange
  '#eab308', // yellow
  '#22c55e', // green
  '#14b8a6', // teal
  '#3b82f6', // blue
  '#6366f1', // indigo
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#64748b', // slate
]

interface LabelsManagerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  labels: Label[]
  onCreateLabel: (name: string, color: string) => Promise<void>
  onUpdateLabel: (id: string, name: string, color: string) => Promise<void>
  onDeleteLabel: (id: string) => Promise<void>
}

export function LabelsManager({
  open,
  onOpenChange,
  labels,
  onCreateLabel,
  onUpdateLabel,
  onDeleteLabel,
}: LabelsManagerProps) {
  const [newLabelName, setNewLabelName] = useState('')
  const [newLabelColor, setNewLabelColor] = useState('#6366f1')
  const [editingLabel, setEditingLabel] = useState<Label | null>(null)
  const [editName, setEditName] = useState('')
  const [editColor, setEditColor] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleCreate = async () => {
    if (!newLabelName.trim()) return
    setIsCreating(true)
    try {
      await onCreateLabel(newLabelName.trim(), newLabelColor)
      setNewLabelName('')
      setNewLabelColor('#6366f1')
    } finally {
      setIsCreating(false)
    }
  }

  const handleUpdate = async () => {
    if (!editingLabel || !editName.trim()) return
    setIsUpdating(true)
    try {
      await onUpdateLabel(editingLabel.id, editName.trim(), editColor)
      setEditingLabel(null)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this label?')) return
    await onDeleteLabel(id)
  }

  const startEditing = (label: Label) => {
    setEditingLabel(label)
    setEditName(label.name)
    setEditColor(label.color)
  }

  const cancelEditing = () => {
    setEditingLabel(null)
    setEditName('')
    setEditColor('')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Manage Labels
          </DialogTitle>
          <DialogDescription>
            Create and manage labels to organize your tasks.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Create new label */}
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 shrink-0"
                  style={{ backgroundColor: newLabelColor }}
                >
                  <span className="sr-only">Pick color</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-3" align="start">
                <div className="grid grid-cols-5 gap-2">
                  {PRESET_COLORS.map((color) => (
                    <button
                      key={color}
                      className={cn(
                        'h-8 w-8 rounded-md border-2 transition-all',
                        newLabelColor === color
                          ? 'border-foreground scale-110'
                          : 'border-transparent hover:scale-105'
                      )}
                      style={{ backgroundColor: color }}
                      onClick={() => setNewLabelColor(color)}
                    />
                  ))}
                </div>
              </PopoverContent>
            </Popover>
            <Input
              placeholder="New label name..."
              value={newLabelName}
              onChange={(e) => setNewLabelName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              className="flex-1"
            />
            <Button
              size="icon"
              onClick={handleCreate}
              disabled={!newLabelName.trim() || isCreating}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Labels list */}
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            <AnimatePresence>
              {labels.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Tag className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No labels yet</p>
                  <p className="text-xs">Create your first label above</p>
                </div>
              ) : (
                labels.map((label) => (
                  <motion.div
                    key={label.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 group"
                  >
                    {editingLabel?.id === label.id ? (
                      <>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 shrink-0"
                              style={{ backgroundColor: editColor }}
                            >
                              <span className="sr-only">Pick color</span>
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-3" align="start">
                            <div className="grid grid-cols-5 gap-2">
                              {PRESET_COLORS.map((color) => (
                                <button
                                  key={color}
                                  className={cn(
                                    'h-8 w-8 rounded-md border-2 transition-all',
                                    editColor === color
                                      ? 'border-foreground scale-110'
                                      : 'border-transparent hover:scale-105'
                                  )}
                                  style={{ backgroundColor: color }}
                                  onClick={() => setEditColor(color)}
                                />
                              ))}
                            </div>
                          </PopoverContent>
                        </Popover>
                        <Input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleUpdate()}
                          className="flex-1 h-8"
                          autoFocus
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={handleUpdate}
                          disabled={isUpdating}
                        >
                          <Check className="h-4 w-4 text-green-500" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={cancelEditing}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Badge
                          variant="secondary"
                          className="py-1 px-3"
                          style={{
                            backgroundColor: `${label.color}20`,
                            color: label.color,
                            borderColor: label.color,
                          }}
                        >
                          {label.name}
                        </Badge>
                        <div className="flex-1" />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => startEditing(label)}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-destructive"
                          onClick={() => handleDelete(label.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </>
                    )}
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

interface LabelPickerProps {
  labels: Label[]
  selectedLabelIds: string[]
  onToggleLabel: (labelId: string) => void
  className?: string
}

export function LabelPicker({
  labels,
  selectedLabelIds,
  onToggleLabel,
  className,
}: LabelPickerProps) {
  if (labels.length === 0) {
    return (
      <div className={cn('text-xs text-muted-foreground', className)}>
        No labels available
      </div>
    )
  }

  return (
    <div className={cn('flex flex-wrap gap-1.5', className)}>
      {labels.map((label) => {
        const isSelected = selectedLabelIds.includes(label.id)
        return (
          <button
            key={label.id}
            onClick={() => onToggleLabel(label.id)}
            className={cn(
              'inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-all',
              isSelected
                ? 'ring-2 ring-offset-1'
                : 'opacity-60 hover:opacity-100'
            )}
            style={{
              backgroundColor: `${label.color}20`,
              color: label.color,
              borderColor: label.color,
              ...(isSelected && { ringColor: label.color }),
            }}
          >
            {isSelected && <Check className="h-3 w-3" />}
            {label.name}
          </button>
        )
      })}
    </div>
  )
}

interface LabelBadgesProps {
  labels: Label[]
  size?: 'sm' | 'md'
  className?: string
}

export function LabelBadges({ labels, size = 'sm', className }: LabelBadgesProps) {
  if (labels.length === 0) return null

  return (
    <div className={cn('flex flex-wrap gap-1', className)}>
      {labels.map((label) => (
        <Badge
          key={label.id}
          variant="secondary"
          className={cn(
            'font-normal',
            size === 'sm' ? 'text-[10px] px-1.5 py-0' : 'text-xs px-2 py-0.5'
          )}
          style={{
            backgroundColor: `${label.color}20`,
            color: label.color,
          }}
        >
          {label.name}
        </Badge>
      ))}
    </div>
  )
}
