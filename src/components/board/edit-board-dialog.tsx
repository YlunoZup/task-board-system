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
import { BoardWithStats, UpdateBoardDto } from '@/types'
import {
  Clipboard,
  Rocket,
  Megaphone,
  Bug,
  Folder,
  Star,
  Zap,
  Target,
  Calendar,
} from 'lucide-react'

const icons = [
  { name: 'clipboard', icon: Clipboard },
  { name: 'rocket', icon: Rocket },
  { name: 'megaphone', icon: Megaphone },
  { name: 'bug', icon: Bug },
  { name: 'folder', icon: Folder },
  { name: 'star', icon: Star },
  { name: 'zap', icon: Zap },
  { name: 'target', icon: Target },
  { name: 'calendar', icon: Calendar },
]

const colors = [
  '#6366f1', // Indigo
  '#8b5cf6', // Violet
  '#ec4899', // Pink
  '#ef4444', // Red
  '#f97316', // Orange
  '#eab308', // Yellow
  '#22c55e', // Green
  '#14b8a6', // Teal
  '#06b6d4', // Cyan
  '#3b82f6', // Blue
]

interface EditBoardDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  board: BoardWithStats | null
  onSubmit: (id: string, data: UpdateBoardDto) => Promise<void>
}

export function EditBoardDialog({
  open,
  onOpenChange,
  board,
  onSubmit,
}: EditBoardDialogProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [selectedColor, setSelectedColor] = useState('#6366f1')
  const [selectedIcon, setSelectedIcon] = useState('clipboard')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Populate form when board changes
  useEffect(() => {
    if (board) {
      setName(board.name)
      setDescription(board.description || '')
      setSelectedColor(board.color || '#6366f1')
      setSelectedIcon(board.icon || 'clipboard')
    }
  }, [board])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!board) return

    if (!name.trim()) {
      setError('Board name is required')
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit(board.id, {
        name: name.trim(),
        description: description.trim() || undefined,
        color: selectedColor,
        icon: selectedIcon,
      })
      onOpenChange(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update board')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="pb-2 sm:pb-4">
            <DialogTitle className="text-lg sm:text-xl">Edit Board</DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Make changes to your board. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3 sm:gap-4 py-3 sm:py-4">
            {/* Board Name */}
            <div className="space-y-1.5 sm:space-y-2">
              <label htmlFor="edit-board-name" className="text-xs sm:text-sm font-medium">
                Board Name <span className="text-destructive">*</span>
              </label>
              <Input
                id="edit-board-name"
                placeholder="e.g., Project Alpha, Marketing Campaign"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={100}
                className="h-9 sm:h-10 text-sm"
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5 sm:space-y-2">
              <label htmlFor="edit-board-description" className="text-xs sm:text-sm font-medium">
                Description
              </label>
              <Textarea
                id="edit-board-description"
                placeholder="What is this board for?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={500}
                rows={2}
                className="text-sm min-h-[60px]"
              />
            </div>

            {/* Icon Selection */}
            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-xs sm:text-sm font-medium">Icon</label>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {icons.map(({ name, icon: Icon }) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => setSelectedIcon(name)}
                    className={`flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg border-2 transition-all ${
                      selectedIcon === name
                        ? 'border-primary bg-primary/10'
                        : 'border-transparent bg-muted hover:bg-muted/80'
                    }`}
                  >
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-xs sm:text-sm font-medium">Color</label>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`h-7 w-7 sm:h-8 sm:w-8 rounded-full transition-transform ${
                      selectedColor === color
                        ? 'ring-2 ring-offset-2 ring-primary scale-110'
                        : 'hover:scale-110'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Preview */}
            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-xs sm:text-sm font-medium">Preview</label>
              <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg border bg-muted/50">
                <div
                  className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg text-white flex-shrink-0"
                  style={{ backgroundColor: selectedColor }}
                >
                  {(() => {
                    const IconComponent =
                      icons.find((i) => i.name === selectedIcon)?.icon ||
                      Clipboard
                    return <IconComponent className="h-4 w-4 sm:h-5 sm:w-5" />
                  })()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm sm:text-base truncate">{name || 'Board Name'}</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                    {description || 'Board description'}
                  </p>
                </div>
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
