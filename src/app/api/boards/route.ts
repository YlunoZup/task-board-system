import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createBoardSchema } from '@/lib/validations'
import { getRandomColor } from '@/lib/utils'

// GET /api/boards - Get all boards with task counts and stats
export async function GET() {
  try {
    const boards = await prisma.board.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { tasks: true },
        },
        tasks: {
          select: {
            status: true,
          },
        },
      },
    })

    // Calculate stats for each board
    const boardsWithStats = boards.map((board) => {
      const stats = {
        todo: board.tasks.filter((t) => t.status === 'todo').length,
        in_progress: board.tasks.filter((t) => t.status === 'in_progress').length,
        done: board.tasks.filter((t) => t.status === 'done').length,
      }

      // Remove the tasks array from response to reduce payload
      const { tasks, ...boardWithoutTasks } = board

      return {
        ...boardWithoutTasks,
        stats,
      }
    })

    return NextResponse.json({ data: boardsWithStats }, { status: 200 })
  } catch (error) {
    console.error('Error fetching boards:', error)
    return NextResponse.json(
      { error: 'Failed to fetch boards' },
      { status: 500 }
    )
  }
}

// POST /api/boards - Create a new board
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validationResult = createBoardSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      )
    }

    const { name, description, color, icon } = validationResult.data

    const board = await prisma.board.create({
      data: {
        name,
        description: description || null,
        color: color || getRandomColor(),
        icon: icon || 'clipboard',
      },
      include: {
        _count: {
          select: { tasks: true },
        },
      },
    })

    return NextResponse.json(
      { data: { ...board, stats: { todo: 0, in_progress: 0, done: 0 } } },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating board:', error)
    return NextResponse.json(
      { error: 'Failed to create board' },
      { status: 500 }
    )
  }
}
