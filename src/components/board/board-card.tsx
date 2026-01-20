'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  MoreHorizontal,
  Trash2,
  Edit2,
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
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { BoardWithStats } from '@/types'
import { formatRelativeTime } from '@/lib/utils'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  clipboard: Clipboard,
  rocket: Rocket,
  megaphone: Megaphone,
  bug: Bug,
  folder: Folder,
  star: Star,
  zap: Zap,
  target: Target,
  calendar: Calendar,
}

interface BoardCardProps {
  board: BoardWithStats
  onDelete: (id: string) => void
  onEdit: (board: BoardWithStats) => void
  index: number
}

export function BoardCard({ board, onDelete, onEdit, index }: BoardCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const IconComponent = iconMap[board.icon || 'clipboard'] || Clipboard
  const totalTasks = board._count.tasks

  const handleDelete = async () => {
    setIsDeleting(true)
    await onDelete(board.id)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Link href={`/board/${board.id}`}>
        <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg active:scale-[0.98] sm:hover:scale-[1.02] cursor-pointer border-2 hover:border-primary/20 h-full">
          {/* Color accent bar */}
          <div
            className="absolute top-0 left-0 right-0 h-1"
            style={{ backgroundColor: board.color }}
          />

          <CardHeader className="p-3 sm:p-6 pb-2">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                <div
                  className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg sm:rounded-xl text-white shadow-sm flex-shrink-0"
                  style={{ backgroundColor: board.color }}
                >
                  <IconComponent className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-base sm:text-lg leading-tight group-hover:text-primary transition-colors truncate">
                    {board.name}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">
                    {formatRelativeTime(board.createdAt)}
                  </p>
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 sm:h-8 sm:w-8 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      onEdit(board)
                    }}
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit Board
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      handleDelete()
                    }}
                    className="text-destructive focus:text-destructive"
                    disabled={isDeleting}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    {isDeleting ? 'Deleting...' : 'Delete Board'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>

          <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
            {board.description && (
              <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mb-3 sm:mb-4">
                {board.description}
              </p>
            )}

            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <Badge variant="secondary" className="text-[10px] sm:text-xs">
                {totalTasks} {totalTasks === 1 ? 'task' : 'tasks'}
              </Badge>
              {board.stats && (
                <>
                  {board.stats.todo > 0 && (
                    <Badge variant="outline" className="text-[10px] sm:text-xs bg-slate-50 dark:bg-slate-900">
                      {board.stats.todo} to do
                    </Badge>
                  )}
                  {board.stats.in_progress > 0 && (
                    <Badge variant="info" className="text-[10px] sm:text-xs">
                      {board.stats.in_progress} in progress
                    </Badge>
                  )}
                  {board.stats.done > 0 && (
                    <Badge variant="success" className="text-[10px] sm:text-xs">
                      {board.stats.done} done
                    </Badge>
                  )}
                </>
              )}
            </div>

            {/* Progress bar */}
            {totalTasks > 0 && board.stats && (
              <div className="mt-3 sm:mt-4">
                <div className="flex items-center justify-between text-[10px] sm:text-xs text-muted-foreground mb-1">
                  <span>Progress</span>
                  <span>{Math.round((board.stats.done / totalTasks) * 100)}%</span>
                </div>
                <div className="h-1.5 sm:h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 transition-all duration-500"
                    style={{
                      width: `${(board.stats.done / totalTasks) * 100}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}
