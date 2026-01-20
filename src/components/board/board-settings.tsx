'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Settings,
  Palette,
  Layout,
  Eye,
  EyeOff,
  Columns,
  Grid,
  List,
  Save,
  RotateCcw,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

export interface BoardSettings {
  view: 'kanban' | 'list' | 'calendar'
  showCompletedTasks: boolean
  compactMode: boolean
  columnWidth: 'narrow' | 'normal' | 'wide'
  showTaskDescription: boolean
  showTaskDueDate: boolean
  showTaskAssignee: boolean
  showTaskLabels: boolean
  showTaskSubtasks: boolean
  sortBy: 'manual' | 'dueDate' | 'priority' | 'createdAt'
  sortDirection: 'asc' | 'desc'
  colorScheme: 'default' | 'minimal' | 'colorful'
}

const defaultSettings: BoardSettings = {
  view: 'kanban',
  showCompletedTasks: true,
  compactMode: false,
  columnWidth: 'normal',
  showTaskDescription: true,
  showTaskDueDate: true,
  showTaskAssignee: true,
  showTaskLabels: true,
  showTaskSubtasks: true,
  sortBy: 'manual',
  sortDirection: 'asc',
  colorScheme: 'default',
}

interface BoardSettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  settings: BoardSettings
  onSaveSettings: (settings: BoardSettings) => void
}

const PRESET_THEMES = [
  { id: 'default', name: 'Default', colors: ['#6366f1', '#22c55e', '#eab308', '#ef4444'] },
  { id: 'minimal', name: 'Minimal', colors: ['#64748b', '#94a3b8', '#cbd5e1', '#e2e8f0'] },
  { id: 'colorful', name: 'Colorful', colors: ['#8b5cf6', '#ec4899', '#f97316', '#06b6d4'] },
]

export function BoardSettingsDialog({
  open,
  onOpenChange,
  settings,
  onSaveSettings,
}: BoardSettingsDialogProps) {
  const [localSettings, setLocalSettings] = useState<BoardSettings>(settings)

  const handleSave = () => {
    onSaveSettings(localSettings)
    onOpenChange(false)
  }

  const handleReset = () => {
    setLocalSettings(defaultSettings)
  }

  const updateSetting = <K extends keyof BoardSettings>(
    key: K,
    value: BoardSettings[K]
  ) => {
    setLocalSettings((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Board Settings
          </DialogTitle>
          <DialogDescription>
            Customize how your board looks and behaves.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="display" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="display">Display</TabsTrigger>
            <TabsTrigger value="cards">Cards</TabsTrigger>
            <TabsTrigger value="theme">Theme</TabsTrigger>
          </TabsList>

          {/* Display Settings */}
          <TabsContent value="display" className="space-y-4 mt-4">
            <div className="space-y-4">
              {/* View Mode */}
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <Layout className="h-4 w-4 text-muted-foreground" />
                  View Mode
                </Label>
                <Select
                  value={localSettings.view}
                  onValueChange={(v) => updateSetting('view', v as BoardSettings['view'])}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kanban">
                      <span className="flex items-center gap-2">
                        <Columns className="h-4 w-4" />
                        Kanban
                      </span>
                    </SelectItem>
                    <SelectItem value="list">
                      <span className="flex items-center gap-2">
                        <List className="h-4 w-4" />
                        List
                      </span>
                    </SelectItem>
                    <SelectItem value="calendar">
                      <span className="flex items-center gap-2">
                        <Grid className="h-4 w-4" />
                        Calendar
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Column Width */}
              {localSettings.view === 'kanban' && (
                <div className="flex items-center justify-between">
                  <Label>Column Width</Label>
                  <Select
                    value={localSettings.columnWidth}
                    onValueChange={(v) =>
                      updateSetting('columnWidth', v as BoardSettings['columnWidth'])
                    }
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="narrow">Narrow</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="wide">Wide</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Sort By */}
              <div className="flex items-center justify-between">
                <Label>Default Sort</Label>
                <Select
                  value={localSettings.sortBy}
                  onValueChange={(v) => updateSetting('sortBy', v as BoardSettings['sortBy'])}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manual">Manual</SelectItem>
                    <SelectItem value="dueDate">Due Date</SelectItem>
                    <SelectItem value="priority">Priority</SelectItem>
                    <SelectItem value="createdAt">Created Date</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Show Completed */}
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  {localSettings.showCompletedTasks ? (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  )}
                  Show Completed Tasks
                </Label>
                <Switch
                  checked={localSettings.showCompletedTasks}
                  onCheckedChange={(v) => updateSetting('showCompletedTasks', v)}
                />
              </div>

              {/* Compact Mode */}
              <div className="flex items-center justify-between">
                <Label>Compact Mode</Label>
                <Switch
                  checked={localSettings.compactMode}
                  onCheckedChange={(v) => updateSetting('compactMode', v)}
                />
              </div>
            </div>
          </TabsContent>

          {/* Card Settings */}
          <TabsContent value="cards" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Show Description</Label>
                <Switch
                  checked={localSettings.showTaskDescription}
                  onCheckedChange={(v) => updateSetting('showTaskDescription', v)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Show Due Date</Label>
                <Switch
                  checked={localSettings.showTaskDueDate}
                  onCheckedChange={(v) => updateSetting('showTaskDueDate', v)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Show Assignee</Label>
                <Switch
                  checked={localSettings.showTaskAssignee}
                  onCheckedChange={(v) => updateSetting('showTaskAssignee', v)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Show Labels</Label>
                <Switch
                  checked={localSettings.showTaskLabels}
                  onCheckedChange={(v) => updateSetting('showTaskLabels', v)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Show Subtask Progress</Label>
                <Switch
                  checked={localSettings.showTaskSubtasks}
                  onCheckedChange={(v) => updateSetting('showTaskSubtasks', v)}
                />
              </div>
            </div>
          </TabsContent>

          {/* Theme Settings */}
          <TabsContent value="theme" className="space-y-4 mt-4">
            <div className="space-y-4">
              <Label className="flex items-center gap-2">
                <Palette className="h-4 w-4 text-muted-foreground" />
                Color Scheme
              </Label>
              <div className="grid grid-cols-3 gap-3">
                {PRESET_THEMES.map((theme) => (
                  <motion.button
                    key={theme.id}
                    onClick={() =>
                      updateSetting('colorScheme', theme.id as BoardSettings['colorScheme'])
                    }
                    className={cn(
                      'p-3 rounded-lg border-2 transition-all',
                      localSettings.colorScheme === theme.id
                        ? 'border-primary'
                        : 'border-muted hover:border-muted-foreground/50'
                    )}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex gap-1 mb-2">
                      {theme.colors.map((color, i) => (
                        <div
                          key={i}
                          className="h-4 w-4 rounded-full"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-medium">{theme.name}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Hook to manage board settings with localStorage persistence
export function useBoardSettings(boardId: string) {
  const storageKey = `board-settings-${boardId}`

  const getSettings = (): BoardSettings => {
    if (typeof window === 'undefined') return defaultSettings
    const stored = localStorage.getItem(storageKey)
    if (stored) {
      try {
        return { ...defaultSettings, ...JSON.parse(stored) }
      } catch {
        return defaultSettings
      }
    }
    return defaultSettings
  }

  const saveSettings = (settings: BoardSettings) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, JSON.stringify(settings))
    }
  }

  return { getSettings, saveSettings, defaultSettings }
}
