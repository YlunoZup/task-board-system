import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { updateBoardSchema } from '@/lib/validations'

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET /api/boards/[id] - Get a single board with all its tasks
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    const board = await prisma.board.findUnique({
      where: { id },
      include: {
        tasks: {
          orderBy: [
            { position: 'asc' },
            { createdAt: 'desc' },
          ],
        },
        _count: {
          select: { tasks: true },
        },
      },
    })

    if (!board) {
      return NextResponse.json(
        { error: 'Board not found' },
        { status: 404 }
      )
    }

    // Calculate stats
    const stats = {
      todo: board.tasks.filter((t) => t.status === 'todo').length,
      in_progress: board.tasks.filter((t) => t.status === 'in_progress').length,
      done: board.tasks.filter((t) => t.status === 'done').length,
    }

    return NextResponse.json(
      { data: { ...board, stats } },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching board:', error)
    return NextResponse.json(
      { error: 'Failed to fetch board' },
      { status: 500 }
    )
  }
}

// PATCH /api/boards/[id] - Update a board
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const body = await request.json()

    // Check if board exists
    const existingBoard = await prisma.board.findUnique({
      where: { id },
    })

    if (!existingBoard) {
      return NextResponse.json(
        { error: 'Board not found' },
        { status: 404 }
      )
    }

    // Validate input
    const validationResult = updateBoardSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      )
    }

    const board = await prisma.board.update({
      where: { id },
      data: validationResult.data,
      include: {
        _count: {
          select: { tasks: true },
        },
      },
    })

    return NextResponse.json({ data: board }, { status: 200 })
  } catch (error) {
    console.error('Error updating board:', error)
    return NextResponse.json(
      { error: 'Failed to update board' },
      { status: 500 }
    )
  }
}

// DELETE /api/boards/[id] - Delete a board and all its tasks
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    // Check if board exists
    const existingBoard = await prisma.board.findUnique({
      where: { id },
    })

    if (!existingBoard) {
      return NextResponse.json(
        { error: 'Board not found' },
        { status: 404 }
      )
    }

    // Delete board (cascade will delete all tasks)
    await prisma.board.delete({
      where: { id },
    })

    return NextResponse.json(
      { message: 'Board deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting board:', error)
    return NextResponse.json(
      { error: 'Failed to delete board' },
      { status: 500 }
    )
  }
}
