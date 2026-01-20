import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ApiResponse, Label, CreateLabelDto } from '@/types'

// GET /api/labels - Get all labels
export async function GET(): Promise<NextResponse<ApiResponse<Label[]>>> {
  try {
    const labels = await prisma.label.findMany({
      orderBy: { name: 'asc' },
    })

    return NextResponse.json({ data: labels as Label[] })
  } catch (error) {
    console.error('Error fetching labels:', error)
    return NextResponse.json(
      { error: 'Failed to fetch labels' },
      { status: 500 }
    )
  }
}

// POST /api/labels - Create a new label
export async function POST(
  request: Request
): Promise<NextResponse<ApiResponse<Label>>> {
  try {
    const body: CreateLabelDto = await request.json()

    // Validate required fields
    if (!body.name?.trim()) {
      return NextResponse.json(
        { error: 'Label name is required' },
        { status: 400 }
      )
    }

    // Check if label with same name exists
    const existingLabel = await prisma.label.findUnique({
      where: { name: body.name.trim() },
    })

    if (existingLabel) {
      return NextResponse.json(
        { error: 'A label with this name already exists' },
        { status: 400 }
      )
    }

    const label = await prisma.label.create({
      data: {
        name: body.name.trim(),
        color: body.color || '#6366f1',
      },
    })

    return NextResponse.json({ data: label as Label }, { status: 201 })
  } catch (error) {
    console.error('Error creating label:', error)
    return NextResponse.json(
      { error: 'Failed to create label' },
      { status: 500 }
    )
  }
}
