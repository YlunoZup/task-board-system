import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ApiResponse, Subtask } from '@/types'

interface RouteParams {
  params: { id: string; subtaskId: string }
}

// PATCH /api/tasks/[id]/subtasks/[subtaskId] - Update a subtask
export async function PATCH(
  request: Request,
  { params }: RouteParams
): Promise<NextResponse<ApiResponse<Subtask>>> {
  try {
    const { id, subtaskId } = params
    const body = await request.json()

    // Check if subtask exists and belongs to the task
    const existingSubtask = await prisma.subtask.findFirst({
      where: { id: subtaskId, taskId: id },
    })

    if (!existingSubtask) {
      return NextResponse.json({ error: 'Subtask not found' }, { status: 404 })
    }

    const subtask = await prisma.subtask.update({
      where: { id: subtaskId },
      data: {
        ...(body.title !== undefined && { title: body.title.trim() }),
        ...(body.completed !== undefined && { completed: body.completed }),
        ...(body.position !== undefined && { position: body.position }),
      },
    })

    return NextResponse.json({ data: subtask as Subtask })
  } catch (error) {
    console.error('Error updating subtask:', error)
    return NextResponse.json(
      { error: 'Failed to update subtask' },
      { status: 500 }
    )
  }
}

// DELETE /api/tasks/[id]/subtasks/[subtaskId] - Delete a subtask
export async function DELETE(
  request: Request,
  { params }: RouteParams
): Promise<NextResponse<ApiResponse<{ success: boolean }>>> {
  try {
    const { id, subtaskId } = params

    // Check if subtask exists and belongs to the task
    const existingSubtask = await prisma.subtask.findFirst({
      where: { id: subtaskId, taskId: id },
    })

    if (!existingSubtask) {
      return NextResponse.json({ error: 'Subtask not found' }, { status: 404 })
    }

    await prisma.subtask.delete({
      where: { id: subtaskId },
    })

    return NextResponse.json({ data: { success: true } })
  } catch (error) {
    console.error('Error deleting subtask:', error)
    return NextResponse.json(
      { error: 'Failed to delete subtask' },
      { status: 500 }
    )
  }
}
