# TaskFlow - Enterprise Task Board System

A powerful, enterprise-grade task management system built with Next.js 14, featuring Kanban-style boards, real-time updates, advanced analytics, and comprehensive project management tools.

## Live Demo

**[https://task-board-system-gamma.vercel.app](https://task-board-system-gamma.vercel.app)**

![Next.js](https://img.shields.io/badge/Next.js-14.2-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Prisma](https://img.shields.io/badge/Prisma-5.9-teal)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-336791)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-black)

## Features

### Core Features (All PRD Requirements Met)
- **Dashboard**: View all boards with task statistics and progress tracking
- **Kanban Boards**: Organize tasks in To Do, In Progress, and Done columns
- **Drag & Drop**: Intuitive task management with @dnd-kit
- **Task Management**: Full CRUD operations with immediate updates
- **Filter & Sort**: Filter by status, priority, search; sort by date/priority
- **Real-time Updates**: Auto-refresh data polling

### Bonus Features (All 3 Implemented!)
- **Analytics Dashboard**: Comprehensive statistics with Recharts visualizations
  - Total boards and tasks count
  - Task distribution by status (pie charts, bar charts)
  - Completion rate percentage
  - Trend analysis over time
- **Real-Time Updates**: 30-second polling for multi-window sync
- **Data Export**: Download all data in JSON or CSV format

### Enterprise Features (Beyond PRD)
- **Command Palette** (`Cmd/Ctrl + K`): Quick navigation and actions
- **Keyboard Shortcuts**: Full keyboard navigation with help dialog (`?`)
- **Confetti Celebrations**: Visual feedback when completing tasks
- **Labels/Tags System**: Color-coded labels with management UI
- **Subtasks/Checklists**: Break tasks into subtasks with progress tracking
- **Calendar View**: View tasks by due date in monthly calendar
- **Quick Filters**: Save and load custom filter configurations
- **Activity Feed**: Track recent actions on the board
- **Board Settings**: Customize view mode, card display, themes
- **Advanced Analytics**: Toggle detailed analytics with multiple chart types
- **Dark/Light Mode**: Full theme support with system preference detection
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Toast Notifications**: Instant feedback on all actions
- **Smooth Animations**: Polished UI with Framer Motion

## Requirements

- Node.js 18 or higher
- npm, yarn, or pnpm

## Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/YlunoZup/task-board-system.git
cd task-board-system
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Database

For local development with SQLite:
```bash
# Create .env file
echo 'POSTGRES_PRISMA_URL="file:./dev.db"' > .env
echo 'POSTGRES_URL_NON_POOLING="file:./dev.db"' >> .env

# Generate Prisma client and push schema
npm run db:generate
npm run db:push

# (Optional) Seed with sample data
npm run db:seed
```

For production with PostgreSQL (Neon):
```bash
# Set your Neon connection strings in .env
POSTGRES_PRISMA_URL="postgresql://..."
POSTGRES_URL_NON_POOLING="postgresql://..."
```

### 4. Start Development Server

```bash
npm run dev
```

### 5. Open Application

Visit [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | Next.js 14.2 (App Router) |
| Language | TypeScript 5.3 |
| Database | PostgreSQL (Neon) / SQLite |
| ORM | Prisma 5.9 |
| Styling | Tailwind CSS 3.4 |
| UI Components | Radix UI Primitives |
| Animations | Framer Motion |
| Drag & Drop | @dnd-kit |
| Charts | Recharts |
| Command Palette | cmdk |
| Confetti | canvas-confetti |
| Validation | Zod |
| Icons | Lucide React |
| Deployment | Vercel |
| CI/CD | GitHub Actions |

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   ├── boards/       # Board CRUD operations
│   │   ├── tasks/        # Task CRUD operations
│   │   ├── labels/       # Labels CRUD operations
│   │   ├── analytics/    # Analytics endpoint
│   │   └── export/       # Data export endpoint
│   ├── board/[id]/       # Board detail page
│   └── page.tsx          # Dashboard page
├── components/            # React components
│   ├── activity/         # Activity feed
│   ├── analytics/        # Advanced analytics
│   ├── board/            # Board-related components
│   ├── calendar/         # Calendar view
│   ├── command-palette/  # Command palette
│   ├── filters/          # Quick filters
│   ├── keyboard-shortcuts/ # Keyboard shortcuts dialog
│   ├── labels/           # Labels manager
│   ├── layout/           # Layout components
│   ├── providers/        # Context providers
│   ├── subtasks/         # Subtask list
│   ├── task/             # Task-related components
│   └── ui/               # Reusable UI components
├── lib/                   # Utility functions
└── types/                 # TypeScript types
```

## API Endpoints

### Boards
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/boards` | Get all boards with stats |
| POST | `/api/boards` | Create a new board |
| GET | `/api/boards/[id]` | Get board with tasks |
| PATCH | `/api/boards/[id]` | Update a board |
| DELETE | `/api/boards/[id]` | Delete a board |

### Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get tasks (filter by boardId) |
| POST | `/api/tasks` | Create a new task |
| PATCH | `/api/tasks/[id]` | Update a task |
| DELETE | `/api/tasks/[id]` | Delete a task |

### Subtasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks/[id]/subtasks` | Get subtasks for a task |
| POST | `/api/tasks/[id]/subtasks` | Create a subtask |
| PATCH | `/api/tasks/[id]/subtasks/[subtaskId]` | Update a subtask |
| DELETE | `/api/tasks/[id]/subtasks/[subtaskId]` | Delete a subtask |

### Labels
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/labels` | Get all labels |
| POST | `/api/labels` | Create a label |
| PATCH | `/api/labels/[id]` | Update a label |
| DELETE | `/api/labels/[id]` | Delete a label |

### Other
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics` | Get dashboard analytics |
| GET | `/api/export?format=json` | Export data as JSON |
| GET | `/api/export?format=csv` | Export data as CSV |

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl + K` | Open command palette |
| `Cmd/Ctrl + N` | Create new task |
| `Cmd/Ctrl + D` | Toggle dark mode |
| `Cmd/Ctrl + R` | Refresh data |
| `Cmd/Ctrl + F` | Focus search |
| `?` | Show keyboard shortcuts |
| `A` | Toggle advanced analytics |
| `1-4` | Filter by priority |

## Scripts

```bash
# Development
npm run dev           # Start dev server

# Build
npm run build         # Build for production
npm run start         # Start production server

# Database
npm run db:generate   # Generate Prisma client
npm run db:push       # Push schema to database
npm run db:seed       # Seed sample data
npm run db:studio     # Open Prisma Studio

# Lint
npm run lint          # Run ESLint
```

## Deployment

This project is deployed on **Vercel** with **Neon PostgreSQL**.

### Deploy Your Own

1. Fork this repository
2. Import to Vercel
3. Add Neon Postgres from Storage marketplace
4. Deploy!

Vercel auto-detects Next.js and configures everything automatically.

## PRD Compliance Checklist

### Required Features
- [x] Dashboard page showing all boards
- [x] Can create a new board
- [x] Can click a board to see its tasks
- [x] Board detail page showing all tasks
- [x] Tasks organized by status (Kanban columns)
- [x] Can create a new task
- [x] Can change task status (drag & drop or click)
- [x] Can edit task title and details
- [x] Can delete a task
- [x] Filter tasks by status
- [x] Sort tasks by field
- [x] Data saves to database
- [x] Basic error handling
- [x] README with setup instructions
- [x] AI workflow document
- [x] Architecture decisions document

### Bonus Features (All 3!)
- [x] **Analytics**: Dashboard with charts, completion rates, task distribution
- [x] **Real-Time Updates**: 30-second polling for live sync
- [x] **Export Data**: JSON and CSV export functionality

### Beyond Requirements
- [x] Command Palette
- [x] Keyboard Shortcuts
- [x] Labels/Tags System
- [x] Subtasks/Checklists
- [x] Calendar View
- [x] Quick Filters
- [x] Activity Feed
- [x] Board Customization
- [x] Confetti Celebrations
- [x] Dark Mode
- [x] CI/CD Pipeline

## Author

Built for the Developer Assessment by **YlunoZup**.

- GitHub: [@YlunoZup](https://github.com/YlunoZup)
- Live Demo: [task-board-system-gamma.vercel.app](https://task-board-system-gamma.vercel.app)

## License

MIT License - feel free to use this code for learning purposes.
