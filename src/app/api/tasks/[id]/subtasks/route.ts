import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ApiResponse, Subtask } from '@/types'

interface RouteParams {
  params: { id: string }
}

// GET /api/tasks/[id]/subtasks - Get all subtasks for a task
export async function GET(
  request: Request,
  { params }: RouteParams
): Promise<NextResponse<ApiResponse<Subtask[]>>> {
  try {
    const { id } = params

    // Check if task exists
    const task = await prisma.task.findUnique({
      where: { id },
    })

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    const subtasks = await prisma.subtask.findMany({
      where: { taskId: id },
      orderBy: { position: 'asc' },
    })

    return NextResponse.json({ data: subtasks as Subtask[] })
  } catch (error) {
    console.error('Error fetching subtasks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch subtasks' },
      { status: 500 }
    )
  }
}

// POST /api/tasks/[id]/subtasks - Create a new subtask
export async function POST(
  request: Request,
  { params }: RouteParams
): Promise<NextResponse<ApiResponse<Subtask>>> {
  try {
    const { id } = params
    const body = await request.json()

    // Check if task exists
    const task = await prisma.task.findUnique({
      where: { id },
    })

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    // Validate required fields
    if (!body.title?.trim()) {
      return NextResponse.json(
        { error: 'Subtask title is required' },
        { status: 400 }
      )
    }

    // Get the highest position
    const lastSubtask = await prisma.subtask.findFirst({
      where: { taskId: id },
      orderBy: { position: 'desc' },
    })

    const position = lastSubtask ? lastSubtask.position + 1 : 0

    const subtask = await prisma.subtask.create({
      data: {
        title: body.title.trim(),
        taskId: id,
        position,
        completed: body.completed || false,
      },
    })

    return NextResponse.json({ data: subtask as Subtask }, { status: 201 })
  } catch (error) {
    console.error('Error creating subtask:', error)
    return NextResponse.json(
      { error: 'Failed to create subtask' },
      { status: 500 }
    )
  }
}
