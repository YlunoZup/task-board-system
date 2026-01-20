# TaskFlow - Modern Task Board System

A powerful, modern task management system built with Next.js 14, featuring Kanban-style boards, real-time updates, analytics dashboard, and data export capabilities.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Prisma](https://img.shields.io/badge/Prisma-5.9-teal)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)

## Features

### Core Features
- **Dashboard**: View all boards with task statistics and progress tracking
- **Kanban Boards**: Organize tasks in To Do, In Progress, and Done columns
- **Drag & Drop**: Intuitive task management with drag-and-drop support
- **Task Management**: Create, edit, update status, and delete tasks
- **Real-time Updates**: Auto-refresh data every 30 seconds

### Bonus Features (All Implemented!)
- **Analytics Dashboard**: Comprehensive statistics with visual charts
  - Total boards and tasks count
  - Task distribution by status
  - Completion rate percentage
  - Recent activity feed
- **Data Export**: Download all data in JSON or CSV format
- **Dark Mode**: Full dark/light theme support

### Additional Innovations
- **Search & Filter**: Filter tasks by priority, search by title/description
- **Sorting**: Sort tasks by date, priority, or due date
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Toast Notifications**: Instant feedback on all actions
- **Smooth Animations**: Polished UI with Framer Motion animations
- **Color-coded Boards**: Custom colors and icons for each board

## Requirements

- Node.js 18 or higher
- npm, yarn, or pnpm

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Database

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database (creates SQLite database)
npm run db:push

# (Optional) Seed with sample data
npm run db:seed
```

### 3. Start Development Server

```bash
npm run dev
```

### 4. Open Application

Visit [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5.3 |
| Database | SQLite (via Prisma ORM) |
| Styling | Tailwind CSS 3.4 |
| UI Components | Radix UI Primitives |
| Animations | Framer Motion |
| Drag & Drop | @dnd-kit |
| Validation | Zod |
| Icons | Lucide React |

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   ├── boards/       # Board CRUD operations
│   │   ├── tasks/        # Task CRUD operations
│   │   ├── analytics/    # Analytics endpoint
│   │   └── export/       # Data export endpoint
│   ├── board/[id]/       # Board detail page
│   └── page.tsx          # Dashboard page
├── components/            # React components
│   ├── board/            # Board-related components
│   ├── task/             # Task-related components
│   ├── ui/               # Reusable UI components
│   ├── layout/           # Layout components
│   └── providers/        # Context providers
├── lib/                   # Utility functions
│   ├── prisma.ts         # Prisma client
│   ├── utils.ts          # Helper functions
│   └── validations.ts    # Zod schemas
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
| GET | `/api/tasks/[id]` | Get a single task |
| PATCH | `/api/tasks/[id]` | Update a task |
| DELETE | `/api/tasks/[id]` | Delete a task |

### Other
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics` | Get dashboard analytics |
| GET | `/api/export?format=json` | Export data as JSON |
| GET | `/api/export?format=csv` | Export data as CSV |

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
npm run db:migrate    # Run migrations
npm run db:seed       # Seed sample data
npm run db:studio     # Open Prisma Studio

# Lint
npm run lint          # Run ESLint
```

## Environment Variables

Copy `.env.example` to `.env`:

```bash
# SQLite (default - recommended for local development)
DATABASE_URL="file:./dev.db"

# PostgreSQL (for production)
# DATABASE_URL="postgresql://user:password@localhost:5432/taskboard"
```

## Screenshots

### Dashboard
- Board cards with task statistics
- Analytics section with charts
- Search and filter capabilities

### Kanban Board
- Drag-and-drop task management
- Filter by priority and search
- Sort by date, priority, or due date

### Dark Mode
- Full theme support
- System preference detection

## Author

Built for the Developer Assessment by YlunoZup.

## License

MIT License - feel free to use this code for learning purposes.
