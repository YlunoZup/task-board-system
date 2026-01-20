import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/export - Export all data as JSON or CSV
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const format = searchParams.get('format') || 'json'

    // Fetch all data
    const boards = await prisma.board.findMany({
      include: {
        tasks: {
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    if (format === 'csv') {
      // Generate CSV format
      let csv = 'Board ID,Board Name,Board Description,Board Color,Task ID,Task Title,Task Description,Status,Priority,Due Date,Assigned To,Created At\n'

      boards.forEach((board) => {
        if (board.tasks.length === 0) {
          // Include board even if it has no tasks
          csv += `"${board.id}","${escapeCsvValue(board.name)}","${escapeCsvValue(board.description || '')}","${board.color}","","","","","","","","${board.createdAt.toISOString()}"\n`
        } else {
          board.tasks.forEach((task) => {
            csv += `"${board.id}","${escapeCsvValue(board.name)}","${escapeCsvValue(board.description || '')}","${board.color}","${task.id}","${escapeCsvValue(task.title)}","${escapeCsvValue(task.description || '')}","${task.status}","${task.priority}","${task.dueDate ? task.dueDate.toISOString() : ''}","${escapeCsvValue(task.assignedTo || '')}","${task.createdAt.toISOString()}"\n`
          })
        }
      })

      return new NextResponse(csv, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="taskboard-export-${new Date().toISOString().split('T')[0]}.csv"`,
        },
      })
    }

    // Default: JSON format
    const exportData = {
      exportedAt: new Date().toISOString(),
      totalBoards: boards.length,
      totalTasks: boards.reduce((sum, b) => sum + b.tasks.length, 0),
      boards: boards.map((board) => ({
        id: board.id,
        name: board.name,
        description: board.description,
        color: board.color,
        icon: board.icon,
        createdAt: board.createdAt,
        updatedAt: board.updatedAt,
        tasksCount: board.tasks.length,
        tasks: board.tasks.map((task) => ({
          id: task.id,
          title: task.title,
          description: task.description,
          status: task.status,
          priority: task.priority,
          dueDate: task.dueDate,
          assignedTo: task.assignedTo,
          position: task.position,
          createdAt: task.createdAt,
          updatedAt: task.updatedAt,
        })),
      })),
    }

    return new NextResponse(JSON.stringify(exportData, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="taskboard-export-${new Date().toISOString().split('T')[0]}.json"`,
      },
    })
  } catch (error) {
    console.error('Error exporting data:', error)
    return NextResponse.json(
      { error: 'Failed to export data' },
      { status: 500 }
    )
  }
}

// Helper to escape CSV values
function escapeCsvValue(value: string): string {
  return value.replace(/"/g, '""')
}
