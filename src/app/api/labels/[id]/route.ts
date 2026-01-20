import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ApiResponse, Label, UpdateLabelDto } from '@/types'

interface RouteParams {
  params: { id: string }
}

// GET /api/labels/[id] - Get a single label
export async function GET(
  request: Request,
  { params }: RouteParams
): Promise<NextResponse<ApiResponse<Label>>> {
  try {
    const label = await prisma.label.findUnique({
      where: { id: params.id },
    })

    if (!label) {
      return NextResponse.json({ error: 'Label not found' }, { status: 404 })
    }

    return NextResponse.json({ data: label as Label })
  } catch (error) {
    console.error('Error fetching label:', error)
    return NextResponse.json(
      { error: 'Failed to fetch label' },
      { status: 500 }
    )
  }
}

// PATCH /api/labels/[id] - Update a label
export async function PATCH(
  request: Request,
  { params }: RouteParams
): Promise<NextResponse<ApiResponse<Label>>> {
  try {
    const body: UpdateLabelDto = await request.json()

    // Check if label exists
    const existingLabel = await prisma.label.findUnique({
      where: { id: params.id },
    })

    if (!existingLabel) {
      return NextResponse.json({ error: 'Label not found' }, { status: 404 })
    }

    // If updating name, check for duplicates
    if (body.name && body.name.trim() !== existingLabel.name) {
      const duplicate = await prisma.label.findUnique({
        where: { name: body.name.trim() },
      })

      if (duplicate) {
        return NextResponse.json(
          { error: 'A label with this name already exists' },
          { status: 400 }
        )
      }
    }

    const label = await prisma.label.update({
      where: { id: params.id },
      data: {
        ...(body.name && { name: body.name.trim() }),
        ...(body.color && { color: body.color }),
      },
    })

    return NextResponse.json({ data: label as Label })
  } catch (error) {
    console.error('Error updating label:', error)
    return NextResponse.json(
      { error: 'Failed to update label' },
      { status: 500 }
    )
  }
}

// DELETE /api/labels/[id] - Delete a label
export async function DELETE(
  request: Request,
  { params }: RouteParams
): Promise<NextResponse<ApiResponse<{ success: boolean }>>> {
  try {
    const label = await prisma.label.findUnique({
      where: { id: params.id },
    })

    if (!label) {
      return NextResponse.json({ error: 'Label not found' }, { status: 404 })
    }

    await prisma.label.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ data: { success: true } })
  } catch (error) {
    console.error('Error deleting label:', error)
    return NextResponse.json(
      { error: 'Failed to delete label' },
      { status: 500 }
    )
  }
}
