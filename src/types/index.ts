// Board types
export interface Board {
  id: string
  name: string
  description: string | null
  color: string
  icon: string | null
  createdAt: Date | string
  updatedAt: Date | string
  tasks?: Task[]
  _count?: {
    tasks: number
  }
}

export interface BoardWithTasks extends Board {
  tasks: Task[]
}

export interface BoardWithStats extends Board {
  _count: {
    tasks: number
  }
  stats?: {
    todo: number
    in_progress: number
    done: number
  }
}

// Task types
export type TaskStatus = 'todo' | 'in_progress' | 'done'
export type TaskPriority = 'low' | 'medium' | 'high'

export interface Task {
  id: string
  title: string
  description: string | null
  status: TaskStatus
  priority: TaskPriority
  dueDate: Date | string | null
  assignedTo: string | null
  position: number
  boardId: string
  createdAt: Date | string
  updatedAt: Date | string
  labels?: TaskLabel[]
  subtasks?: Subtask[]
}

// Subtask types
export interface Subtask {
  id: string
  title: string
  completed: boolean
  position: number
  taskId: string
  createdAt: Date | string
  updatedAt: Date | string
}

// Label types
export interface Label {
  id: string
  name: string
  color: string
  createdAt: Date | string
  updatedAt: Date | string
}

export interface TaskLabel {
  id: string
  taskId: string
  labelId: string
  label?: Label
  createdAt: Date | string
}

// API Response types
export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

// Create/Update DTOs
export interface CreateBoardDto {
  name: string
  description?: string
  color?: string
  icon?: string
}

export interface UpdateBoardDto {
  name?: string
  description?: string
  color?: string
  icon?: string
}

export interface CreateTaskDto {
  title: string
  description?: string
  status?: TaskStatus
  priority?: TaskPriority
  dueDate?: string
  assignedTo?: string
  boardId: string
}

export interface UpdateTaskDto {
  title?: string
  description?: string | null
  status?: TaskStatus
  priority?: TaskPriority
  dueDate?: Date | string | null
  assignedTo?: string | null
  position?: number
  labelIds?: string[]
}

export interface CreateLabelDto {
  name: string
  color?: string
}

export interface UpdateLabelDto {
  name?: string
  color?: string
}

// Analytics types
export interface Analytics {
  totalBoards: number
  totalTasks: number
  tasksByStatus: {
    todo: number
    in_progress: number
    done: number
  }
  completionRate: number
  recentActivity: Task[]
}

// Filter and Sort types
export interface TaskFilters {
  status?: TaskStatus | 'all'
  priority?: TaskPriority | 'all'
  search?: string
}

export type TaskSortField = 'createdAt' | 'updatedAt' | 'priority' | 'dueDate' | 'title'
export type SortDirection = 'asc' | 'desc'

export interface TaskSort {
  field: TaskSortField
  direction: SortDirection
}
