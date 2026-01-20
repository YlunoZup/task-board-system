# Architecture Decisions Document

## Technology Choices

### Why Next.js 14 with App Router?

**Choice:** Next.js 14 with App Router (not Pages Router)

**Reasoning:**
- **Server Components**: Better performance with server-side rendering by default
- **Improved routing**: File-based routing with layouts and parallel routes
- **Built-in API routes**: Simplified backend without separate server
- **Modern patterns**: Aligned with React's future direction
- **TypeScript support**: First-class TypeScript integration

**Trade-offs:**
- Newer patterns may have less community resources
- Some libraries still catching up with App Router

### Why SQLite with Prisma?

**Choice:** SQLite database with Prisma ORM

**Reasoning:**
- **Zero configuration**: No separate database server needed
- **Portability**: Single file database, easy to share and test
- **Prisma benefits**: Type-safe queries, migrations, great DX
- **Development speed**: Instant setup for assessment purposes
- **Production-ready**: Can easily swap to PostgreSQL/MySQL

**Trade-offs:**
- Limited concurrent write performance (fine for this use case)
- No real-time subscriptions (implemented polling instead)

### Why Tailwind CSS?

**Choice:** Tailwind CSS with custom theme configuration

**Reasoning:**
- **Rapid development**: Utility-first speeds up styling
- **Consistency**: Design tokens ensure visual consistency
- **Dark mode**: Built-in dark mode support
- **Bundle size**: Only includes used styles
- **Team collaboration**: Clear, readable class names

**Trade-offs:**
- Long class strings can reduce readability
- Learning curve for utility-first approach

## Data Model Design

### Board Schema
```prisma
model Board {
  id          String   @id @default(cuid())
  name        String
  description String?
  color       String   @default("#6366f1")
  icon        String?  @default("clipboard")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  tasks       Task[]
}
```

**Design decisions:**
- **CUID for IDs**: Globally unique, URL-safe, sortable by creation time
- **Optional fields**: Description and icon are optional for flexibility
- **Color customization**: Allows visual board differentiation
- **Cascade delete**: Deleting a board removes all its tasks

### Task Schema
```prisma
model Task {
  id          String   @id @default(cuid())
  title       String
  description String?
  status      String   @default("todo")
  priority    String   @default("medium")
  dueDate     DateTime?
  assignedTo  String?
  position    Int      @default(0)
  boardId     String
  board       Board    @relation(...)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

**Design decisions:**
- **Status as string**: Allows easy extension (vs enum)
- **Position field**: Enables custom ordering within columns
- **Foreign key**: Enforces referential integrity
- **Indexes**: Added on boardId, status, and createdAt for query performance

### On Board Deletion

**Decision:** Cascade delete all tasks

**Reasoning:**
- Tasks are meaningless without their board
- Prevents orphaned records
- Simpler data model
- Matches user expectations

**Alternative considered:** Prevent deletion if tasks exist (rejected as too restrictive)

## API Design

### RESTful Endpoints

```
Boards:
  GET    /api/boards       - List all boards
  POST   /api/boards       - Create board
  GET    /api/boards/:id   - Get board with tasks
  PATCH  /api/boards/:id   - Update board
  DELETE /api/boards/:id   - Delete board

Tasks:
  GET    /api/tasks        - List tasks (filter by boardId)
  POST   /api/tasks        - Create task
  GET    /api/tasks/:id    - Get task
  PATCH  /api/tasks/:id    - Update task
  DELETE /api/tasks/:id    - Delete task
```

**Design decisions:**
- **PATCH over PUT**: Partial updates are more common
- **Query parameters**: Filtering via query strings for flexibility
- **Consistent response format**: `{ data: T }` or `{ error: string }`
- **Proper status codes**: 200, 201, 400, 404, 500

### Response Format

```typescript
// Success
{ data: Board | Task | Analytics }

// Error
{ error: "Human-readable error message" }
```

**Reasoning:**
- Consistent structure simplifies client code
- Clear error messages for debugging
- Type-safe with TypeScript

## Frontend Architecture

### Component Structure

```
components/
├── board/              # Board-specific components
│   ├── board-card.tsx
│   ├── create-board-dialog.tsx
│   └── analytics-section.tsx
├── task/               # Task-specific components
│   ├── task-card.tsx
│   ├── kanban-column.tsx
│   ├── create-task-dialog.tsx
│   └── edit-task-dialog.tsx
├── ui/                 # Reusable UI primitives
│   ├── button.tsx
│   ├── dialog.tsx
│   ├── input.tsx
│   └── ...
├── layout/            # Layout components
│   └── header.tsx
└── providers/         # Context providers
    └── theme-provider.tsx
```

**Design decisions:**
- **Feature-based grouping**: Components grouped by domain
- **UI primitives**: Reusable, unstyled base components
- **Composition**: Small, focused components composed together

### State Management

**Choice:** React hooks (useState, useCallback) with fetch

**Reasoning:**
- **Simplicity**: No external state library needed
- **Local state**: Each page manages its own data
- **Optimistic updates**: Immediate UI feedback with server sync
- **Polling**: 30-second refresh for "real-time" feel

**What I'd change for production:**
- Add React Query or SWR for caching
- WebSocket for true real-time updates
- Global state for cross-page data

### Routing

```
/                   - Dashboard (all boards)
/board/[id]         - Board detail (Kanban view)
```

**Design decisions:**
- **Simple flat structure**: No deep nesting needed
- **Dynamic routes**: Board ID in URL for sharing/bookmarking
- **No nested layouts**: Each page is independent

## What I Would Change

### With More Time

1. **Authentication**: Add user accounts with NextAuth.js
2. **Real-time sync**: WebSocket with Pusher or Socket.io
3. **Board sharing**: Invite users to collaborate
4. **Task history**: Audit log for changes
5. **Attachments**: File uploads for tasks
6. **Labels/Tags**: Additional categorization
7. **Due date reminders**: Email/push notifications
8. **Keyboard shortcuts**: Power user features
9. **Offline support**: PWA with service workers
10. **Mobile app**: React Native version

### Known Limitations

1. **Polling vs WebSockets**: Currently polls every 30s instead of true real-time
2. **No auth**: Anyone can access and modify data
3. **No pagination**: Could be slow with many boards/tasks
4. **No caching**: Each page fetch hits the database
5. **No tests**: Would add Jest/Testing Library in production

### Production Considerations

1. **Database**: Switch to PostgreSQL for scalability
2. **Caching**: Add Redis for session/data caching
3. **CDN**: Static assets on CloudFlare or Vercel
4. **Monitoring**: Add error tracking (Sentry)
5. **Analytics**: User behavior tracking
6. **Rate limiting**: API protection
7. **Input sanitization**: Enhanced security
8. **Backup strategy**: Database backups

## Conclusion

The architecture prioritizes:
1. **Developer experience**: Fast iteration with hot reload
2. **User experience**: Smooth animations, instant feedback
3. **Maintainability**: Clear structure, typed code
4. **Extensibility**: Easy to add new features

The technical choices align with the assessment requirements while leaving room for growth into a production application.
