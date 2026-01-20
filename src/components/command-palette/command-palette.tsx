'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Command } from 'cmdk'
import {
  LayoutDashboard,
  Plus,
  Search,
  Moon,
  Sun,
  Settings,
  Keyboard,
  BarChart3,
  Calendar,
  Tag,
  Filter,
  Download,
  RefreshCw,
  Zap,
  Clock,
  CheckCircle2,
  Circle,
  ArrowRight,
} from 'lucide-react'
import { useTheme } from '@/components/providers/theme-provider'
import { cn } from '@/lib/utils'

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  boards?: Array<{ id: string; name: string; color: string }>
  onCreateBoard?: () => void
  onCreateTask?: () => void
  onExport?: (format: 'json' | 'csv') => void
  onRefresh?: () => void
}

export function CommandPalette({
  open,
  onOpenChange,
  boards = [],
  onCreateBoard,
  onCreateTask,
  onExport,
  onRefresh,
}: CommandPaletteProps) {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [search, setSearch] = React.useState('')

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        onOpenChange(!open)
      }
      if (e.key === 'Escape') {
        onOpenChange(false)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [open, onOpenChange])

  const runCommand = React.useCallback((command: () => void) => {
    onOpenChange(false)
    command()
  }, [onOpenChange])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in-0"
        onClick={() => onOpenChange(false)}
      />

      {/* Command Dialog */}
      <div className="fixed left-1/2 top-[20%] z-50 w-full max-w-[640px] -translate-x-1/2 animate-in fade-in-0 zoom-in-95 slide-in-from-top-2">
        <Command
          className="rounded-xl border bg-popover text-popover-foreground shadow-2xl overflow-hidden"
          loop
        >
          {/* Search Input */}
          <div className="flex items-center border-b px-4 py-3">
            <Search className="mr-3 h-5 w-5 shrink-0 text-muted-foreground" />
            <Command.Input
              value={search}
              onValueChange={setSearch}
              placeholder="Type a command or search..."
              className="flex h-10 w-full rounded-md bg-transparent text-base outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            />
            <kbd className="pointer-events-none hidden h-6 select-none items-center gap-1 rounded border bg-muted px-2 font-mono text-xs font-medium text-muted-foreground sm:flex">
              ESC
            </kbd>
          </div>

          <Command.List className="max-h-[400px] overflow-y-auto p-2">
            <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
              No results found.
            </Command.Empty>

            {/* Quick Actions */}
            <Command.Group heading="Quick Actions" className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
              {onCreateBoard && (
                <Command.Item
                  onSelect={() => runCommand(onCreateBoard)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm cursor-pointer aria-selected:bg-accent aria-selected:text-accent-foreground"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
                    <Plus className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium">Create New Board</span>
                    <span className="text-xs text-muted-foreground">Start a new project board</span>
                  </div>
                  <kbd className="ml-auto text-xs text-muted-foreground">⌘B</kbd>
                </Command.Item>
              )}
              {onCreateTask && (
                <Command.Item
                  onSelect={() => runCommand(onCreateTask)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm cursor-pointer aria-selected:bg-accent aria-selected:text-accent-foreground"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-green-500/10">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium">Create New Task</span>
                    <span className="text-xs text-muted-foreground">Add a task to current board</span>
                  </div>
                  <kbd className="ml-auto text-xs text-muted-foreground">⌘T</kbd>
                </Command.Item>
              )}
              {onRefresh && (
                <Command.Item
                  onSelect={() => runCommand(onRefresh)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm cursor-pointer aria-selected:bg-accent aria-selected:text-accent-foreground"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-500/10">
                    <RefreshCw className="h-4 w-4 text-blue-500" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium">Refresh Data</span>
                    <span className="text-xs text-muted-foreground">Sync latest changes</span>
                  </div>
                  <kbd className="ml-auto text-xs text-muted-foreground">⌘R</kbd>
                </Command.Item>
              )}
            </Command.Group>

            {/* Navigation */}
            <Command.Group heading="Navigation" className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
              <Command.Item
                onSelect={() => runCommand(() => router.push('/'))}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm cursor-pointer aria-selected:bg-accent aria-selected:text-accent-foreground"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-violet-500/10">
                  <LayoutDashboard className="h-4 w-4 text-violet-500" />
                </div>
                <div className="flex flex-col">
                  <span className="font-medium">Go to Dashboard</span>
                  <span className="text-xs text-muted-foreground">View all boards</span>
                </div>
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => router.push('/#analytics'))}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm cursor-pointer aria-selected:bg-accent aria-selected:text-accent-foreground"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-orange-500/10">
                  <BarChart3 className="h-4 w-4 text-orange-500" />
                </div>
                <div className="flex flex-col">
                  <span className="font-medium">View Analytics</span>
                  <span className="text-xs text-muted-foreground">Track your progress</span>
                </div>
              </Command.Item>
            </Command.Group>

            {/* Boards */}
            {boards.length > 0 && (
              <Command.Group heading="Boards" className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                {boards.slice(0, 5).map((board) => (
                  <Command.Item
                    key={board.id}
                    onSelect={() => runCommand(() => router.push(`/board/${board.id}`))}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm cursor-pointer aria-selected:bg-accent aria-selected:text-accent-foreground"
                  >
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-md text-white"
                      style={{ backgroundColor: board.color }}
                    >
                      <span className="text-sm font-bold">{board.name.charAt(0)}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium">{board.name}</span>
                      <span className="text-xs text-muted-foreground">Open board</span>
                    </div>
                    <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground" />
                  </Command.Item>
                ))}
              </Command.Group>
            )}

            {/* Export */}
            {onExport && (
              <Command.Group heading="Export" className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                <Command.Item
                  onSelect={() => runCommand(() => onExport('json'))}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm cursor-pointer aria-selected:bg-accent aria-selected:text-accent-foreground"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-emerald-500/10">
                    <Download className="h-4 w-4 text-emerald-500" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium">Export as JSON</span>
                    <span className="text-xs text-muted-foreground">Download all data</span>
                  </div>
                </Command.Item>
                <Command.Item
                  onSelect={() => runCommand(() => onExport('csv'))}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm cursor-pointer aria-selected:bg-accent aria-selected:text-accent-foreground"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-emerald-500/10">
                    <Download className="h-4 w-4 text-emerald-500" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium">Export as CSV</span>
                    <span className="text-xs text-muted-foreground">Spreadsheet format</span>
                  </div>
                </Command.Item>
              </Command.Group>
            )}

            {/* Theme */}
            <Command.Group heading="Appearance" className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
              <Command.Item
                onSelect={() => runCommand(() => setTheme(theme === 'dark' ? 'light' : 'dark'))}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm cursor-pointer aria-selected:bg-accent aria-selected:text-accent-foreground"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-yellow-500/10">
                  {theme === 'dark' ? (
                    <Sun className="h-4 w-4 text-yellow-500" />
                  ) : (
                    <Moon className="h-4 w-4 text-yellow-500" />
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="font-medium">Toggle Theme</span>
                  <span className="text-xs text-muted-foreground">
                    Switch to {theme === 'dark' ? 'light' : 'dark'} mode
                  </span>
                </div>
                <kbd className="ml-auto text-xs text-muted-foreground">⌘D</kbd>
              </Command.Item>
            </Command.Group>

            {/* Help */}
            <Command.Group heading="Help" className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
              <Command.Item
                onSelect={() => runCommand(() => {})}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm cursor-pointer aria-selected:bg-accent aria-selected:text-accent-foreground"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-pink-500/10">
                  <Keyboard className="h-4 w-4 text-pink-500" />
                </div>
                <div className="flex flex-col">
                  <span className="font-medium">Keyboard Shortcuts</span>
                  <span className="text-xs text-muted-foreground">View all shortcuts</span>
                </div>
                <kbd className="ml-auto text-xs text-muted-foreground">?</kbd>
              </Command.Item>
            </Command.Group>
          </Command.List>

          {/* Footer */}
          <div className="flex items-center justify-between border-t px-4 py-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Zap className="h-3.5 w-3.5" />
              <span>TaskFlow Command Palette</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <kbd className="rounded border px-1.5 py-0.5">↑</kbd>
                <kbd className="rounded border px-1.5 py-0.5">↓</kbd>
                to navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="rounded border px-1.5 py-0.5">↵</kbd>
                to select
              </span>
            </div>
          </div>
        </Command>
      </div>
    </div>
  )
}
