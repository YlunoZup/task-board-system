'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Keyboard } from 'lucide-react'

interface ShortcutGroup {
  title: string
  shortcuts: {
    keys: string[]
    description: string
  }[]
}

const shortcutGroups: ShortcutGroup[] = [
  {
    title: 'General',
    shortcuts: [
      { keys: ['⌘', 'K'], description: 'Open command palette' },
      { keys: ['⌘', 'B'], description: 'Create new board' },
      { keys: ['⌘', 'D'], description: 'Toggle dark mode' },
      { keys: ['⌘', 'R'], description: 'Refresh data' },
      { keys: ['?'], description: 'Show keyboard shortcuts' },
      { keys: ['Esc'], description: 'Close dialogs' },
    ],
  },
  {
    title: 'Board View',
    shortcuts: [
      { keys: ['⌘', 'T'], description: 'Create new task' },
      { keys: ['⌘', 'F'], description: 'Focus search' },
      { keys: ['1'], description: 'Filter: All priorities' },
      { keys: ['2'], description: 'Filter: High priority' },
      { keys: ['3'], description: 'Filter: Medium priority' },
      { keys: ['4'], description: 'Filter: Low priority' },
    ],
  },
  {
    title: 'Navigation',
    shortcuts: [
      { keys: ['G', 'H'], description: 'Go to dashboard (home)' },
      { keys: ['G', 'A'], description: 'Go to analytics' },
      { keys: ['←', '→'], description: 'Navigate between boards' },
    ],
  },
  {
    title: 'Task Actions',
    shortcuts: [
      { keys: ['E'], description: 'Edit selected task' },
      { keys: ['D'], description: 'Delete selected task' },
      { keys: ['M'], description: 'Move task (opens menu)' },
      { keys: ['Space'], description: 'Toggle task completion' },
    ],
  },
]

interface KeyboardShortcutsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function KeyboardShortcutsDialog({
  open,
  onOpenChange,
}: KeyboardShortcutsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Keyboard className="h-5 w-5" />
            Keyboard Shortcuts
          </DialogTitle>
          <DialogDescription>
            Use these shortcuts to navigate and interact with TaskFlow faster.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 mt-4">
          {shortcutGroups.map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                {group.title}
              </h3>
              <div className="space-y-2">
                {group.shortcuts.map((shortcut, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <span className="text-sm">{shortcut.description}</span>
                    <div className="flex items-center gap-1">
                      {shortcut.keys.map((key, keyIndex) => (
                        <span key={keyIndex}>
                          <kbd className="inline-flex h-6 min-w-[24px] items-center justify-center rounded border bg-muted px-1.5 font-mono text-xs font-medium">
                            {key}
                          </kbd>
                          {keyIndex < shortcut.keys.length - 1 && (
                            <span className="mx-0.5 text-muted-foreground">+</span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 rounded-lg bg-muted/50 border">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Pro tip:</strong> Press{' '}
            <kbd className="mx-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded border bg-background px-1 font-mono text-xs">
              ⌘
            </kbd>
            +
            <kbd className="mx-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded border bg-background px-1 font-mono text-xs">
              K
            </kbd>
            at any time to open the command palette and quickly access any action.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
