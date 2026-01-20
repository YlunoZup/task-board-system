import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createTaskSchema } from '@/lib/validations'

// GET /api/tasks - Get tasks (optionally filtered by boardId)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const boardId = searchParams.get('boardId')
    const status = searchParams.get('status')
    const priority = searchParams.get('priority')

    const where: Record<string, unknown> = {}

    if (boardId) {
      where.boardId = boardId
    }

    if (status && status !== 'all') {
      where.status = status
    }

    if (priority && priority !== 'all') {
      where.priority = priority
    }

    const tasks = await prisma.task.findMany({
      where,
      orderBy: [
        { position: 'asc' },
        { createdAt: 'desc' },
      ],
    })

    return NextResponse.json({ data: tasks }, { status: 200 })
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    )
  }
}

// POST /api/tasks - Create a new task
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validationResult = createTaskSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      )
    }

    const { boardId, title, description, status, priority, dueDate, assignedTo } =
      validationResult.data

    // Check if board exists
    const board = await prisma.board.findUnique({
      where: { id: boardId },
    })

    if (!board) {
      return NextResponse.json(
        { error: 'Board not found' },
        { status: 404 }
      )
    }

    // Get the max position for the status column
    const maxPositionTask = await prisma.task.findFirst({
      where: { boardId, status: status || 'todo' },
      orderBy: { position: 'desc' },
      select: { position: true },
    })

    const newPosition = (maxPositionTask?.position ?? -1) + 1

    const task = await prisma.task.create({
      data: {
        title,
        description: description || null,
        status: status || 'todo',
        priority: priority || 'medium',
        dueDate: dueDate ? new Date(dueDate) : null,
        assignedTo: assignedTo || null,
        boardId,
        position: newPosition,
      },
    })

    return NextResponse.json({ data: task }, { status: 201 })
  } catch (error) {
    console.error('Error creating task:', error)
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    )
  }
}
