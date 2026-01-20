'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Plus, Search, LayoutGrid, RefreshCw, Command, Keyboard, BarChart3, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { BoardCard } from '@/components/board/board-card'
import { CreateBoardDialog } from '@/components/board/create-board-dialog'
import { EditBoardDialog } from '@/components/board/edit-board-dialog'
import { AnalyticsSection } from '@/components/board/analytics-section'
import { AdvancedAnalytics } from '@/components/analytics/advanced-analytics'
import { CommandPalette } from '@/components/command-palette/command-palette'
import { KeyboardShortcutsDialog } from '@/components/keyboard-shortcuts/keyboard-shortcuts-dialog'
import { EmptyState } from '@/components/ui/empty-state'
import { LoadingBoardCard } from '@/components/ui/loading'
import { toast } from '@/components/ui/toaster'
import { useTheme } from '@/components/providers/theme-provider'
import { BoardWithStats, CreateBoardDto, UpdateBoardDto, Analytics } from '@/types'

export default function DashboardPage() {
  const { theme, setTheme } = useTheme()
  const [boards, setBoards] = useState<BoardWithStats[]>([])
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAnalyticsLoading, setIsAnalyticsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingBoard, setEditingBoard] = useState<BoardWithStats | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Command palette and shortcuts
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false)
  const [isShortcutsDialogOpen, setIsShortcutsDialogOpen] = useState(false)
  const [showAdvancedAnalytics, setShowAdvancedAnalytics] = useState(false)

  // Fetch boards
  const fetchBoards = useCallback(async () => {
    try {
      const response = await fetch('/api/boards')
      if (!response.ok) throw new Error('Failed to fetch boards')
      const result = await response.json()
      setBoards(result.data || [])
    } catch (error) {
      console.error('Error fetching boards:', error)
      toast({
        title: 'Error',
        description: 'Failed to load boards',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Fetch analytics
  const fetchAnalytics = useCallback(async () => {
    try {
      const response = await fetch('/api/analytics')
      if (!response.ok) throw new Error('Failed to fetch analytics')
      const result = await response.json()
      setAnalytics(result.data || null)
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setIsAnalyticsLoading(false)
    }
  }, [])

  // Initial load
  useEffect(() => {
    fetchBoards()
    fetchAnalytics()
  }, [fetchBoards, fetchAnalytics])

  // Polling for real-time updates (every 30 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      fetchBoards()
      fetchAnalytics()
    }, 30000)

    return () => clearInterval(interval)
  }, [fetchBoards, fetchAnalytics])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      // ? - Show keyboard shortcuts
      if (e.key === '?' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault()
        setIsShortcutsDialogOpen(true)
      }

      // Cmd/Ctrl + B - Create new board
      if (e.key === 'b' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setIsCreateDialogOpen(true)
      }

      // Cmd/Ctrl + D - Toggle dark mode
      if (e.key === 'd' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setTheme(theme === 'dark' ? 'light' : 'dark')
      }

      // Cmd/Ctrl + R - Refresh
      if (e.key === 'r' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        handleRefresh()
      }

      // G + H - Go to home (dashboard is home)
      // G + A - Show analytics
      if (e.key === 'a' && !e.metaKey && !e.ctrlKey) {
        setShowAdvancedAnalytics(prev => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [theme, setTheme])

  // Refresh data
  const handleRefresh = async () => {
    setIsRefreshing(true)
    await Promise.all([fetchBoards(), fetchAnalytics()])
    setIsRefreshing(false)
    toast({
      title: 'Refreshed',
      description: 'Data has been updated',
      variant: 'success',
    })
  }

  // Create board
  const handleCreateBoard = async (data: CreateBoardDto) => {
    const response = await fetch('/api/boards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to create board')
    }

    const result = await response.json()
    setBoards((prev) => [result.data, ...prev])
    fetchAnalytics()

    toast({
      title: 'Board created',
      description: `"${data.name}" has been created successfully`,
      variant: 'success',
    })
  }

  // Delete board
  const handleDeleteBoard = async (id: string) => {
    const response = await fetch(`/api/boards/${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      toast({
        title: 'Error',
        description: 'Failed to delete board',
        variant: 'destructive',
      })
      return
    }

    setBoards((prev) => prev.filter((b) => b.id !== id))
    fetchAnalytics()

    toast({
      title: 'Board deleted',
      description: 'The board has been deleted',
      variant: 'success',
    })
  }

  // Edit board - open edit dialog
  const handleEditBoard = (board: BoardWithStats) => {
    setEditingBoard(board)
    setIsEditDialogOpen(true)
  }

  // Update board
  const handleUpdateBoard = async (id: string, data: UpdateBoardDto) => {
    const response = await fetch(`/api/boards/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to update board')
    }

    const result = await response.json()
    setBoards((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...result.data } : b))
    )

    toast({
      title: 'Board updated',
      description: `"${data.name}" has been updated successfully`,
      variant: 'success',
    })
  }

  // Filter boards by search query
  const filteredBoards = boards.filter((board) =>
    board.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    board.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 sm:mb-8"
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight truncate">Dashboard</h1>
              <p className="text-sm sm:text-base text-muted-foreground mt-1">
                Manage your boards and track your progress
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsCommandPaletteOpen(true)}
                className="h-9 w-9 sm:h-10 sm:w-10 hidden sm:flex"
                title="Command Palette (⌘K)"
              >
                <Command className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsShortcutsDialogOpen(true)}
                className="h-9 w-9 sm:h-10 sm:w-10 hidden md:flex"
                title="Keyboard Shortcuts (?)"
              >
                <Keyboard className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="h-9 w-9 sm:h-10 sm:w-10"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </Button>
              <Button onClick={() => setIsCreateDialogOpen(true)} className="h-9 sm:h-10">
                <Plus className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">New Board</span>
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Analytics Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <AnalyticsSection analytics={analytics} isLoading={isAnalyticsLoading} />

        {/* Advanced Analytics Toggle */}
        <div className="mt-4 flex justify-center">
          <Button
            variant="ghost"
            onClick={() => setShowAdvancedAnalytics(!showAdvancedAnalytics)}
            className="text-muted-foreground hover:text-foreground"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            {showAdvancedAnalytics ? 'Hide' : 'Show'} Advanced Analytics
            {showAdvancedAnalytics ? (
              <ChevronUp className="h-4 w-4 ml-2" />
            ) : (
              <ChevronDown className="h-4 w-4 ml-2" />
            )}
          </Button>
        </div>

        {/* Advanced Analytics */}
        {showAdvancedAnalytics && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6"
          >
            <AdvancedAnalytics analytics={analytics} isLoading={isAnalyticsLoading} />
          </motion.div>
        )}
      </motion.div>

      {/* Boards Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex flex-col gap-4 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <LayoutGrid className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
              <h2 className="text-lg sm:text-xl font-semibold">Your Boards</h2>
              <span className="text-xs sm:text-sm text-muted-foreground">
                ({filteredBoards.length})
              </span>
            </div>
            <div className="relative w-full sm:w-64 lg:w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search boards..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 sm:h-10"
              />
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <LoadingBoardCard key={i} />
            ))}
          </div>
        ) : filteredBoards.length === 0 ? (
          searchQuery ? (
            <EmptyState
              icon={Search}
              title="No boards found"
              description={`No boards match "${searchQuery}". Try a different search term.`}
              action={
                <Button variant="outline" onClick={() => setSearchQuery('')}>
                  Clear search
                </Button>
              }
            />
          ) : (
            <EmptyState
              icon={LayoutGrid}
              title="No boards yet"
              description="Create your first board to start organizing your tasks."
              action={
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Board
                </Button>
              }
            />
          )
        ) : (
          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredBoards.map((board, index) => (
              <BoardCard
                key={board.id}
                board={board}
                index={index}
                onDelete={handleDeleteBoard}
                onEdit={handleEditBoard}
              />
            ))}
          </div>
        )}
      </motion.div>

      {/* Create Board Dialog */}
      <CreateBoardDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateBoard}
      />

      {/* Edit Board Dialog */}
      <EditBoardDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        board={editingBoard}
        onSubmit={handleUpdateBoard}
      />

      {/* Command Palette */}
      <CommandPalette
        open={isCommandPaletteOpen}
        onOpenChange={setIsCommandPaletteOpen}
        boards={boards.map(b => ({ id: b.id, name: b.name, color: b.color }))}
        onCreateBoard={() => setIsCreateDialogOpen(true)}
        onRefresh={handleRefresh}
      />

      {/* Keyboard Shortcuts Dialog */}
      <KeyboardShortcutsDialog
        open={isShortcutsDialogOpen}
        onOpenChange={setIsShortcutsDialogOpen}
      />
    </div>
  )
}
