import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/analytics - Get dashboard analytics
export async function GET() {
  try {
    // Get total counts
    const [totalBoards, totalTasks, tasksByStatus, recentTasks] = await Promise.all([
      prisma.board.count(),
      prisma.task.count(),
      prisma.task.groupBy({
        by: ['status'],
        _count: {
          status: true,
        },
      }),
      prisma.task.findMany({
        take: 10,
        orderBy: { updatedAt: 'desc' },
        include: {
          board: {
            select: {
              id: true,
              name: true,
              color: true,
            },
          },
        },
      }),
    ])

    // Process status counts
    const statusCounts = {
      todo: 0,
      in_progress: 0,
      done: 0,
    }

    tasksByStatus.forEach((item) => {
      if (item.status in statusCounts) {
        statusCounts[item.status as keyof typeof statusCounts] = item._count.status
      }
    })

    // Calculate completion rate
    const completionRate = totalTasks > 0
      ? Math.round((statusCounts.done / totalTasks) * 100)
      : 0

    const analytics = {
      totalBoards,
      totalTasks,
      tasksByStatus: statusCounts,
      completionRate,
      recentActivity: recentTasks,
    }

    return NextResponse.json({ data: analytics }, { status: 200 })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}
