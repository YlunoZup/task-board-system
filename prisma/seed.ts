import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Clear existing data (in correct order for foreign keys)
  await prisma.subtask.deleteMany()
  await prisma.taskLabel.deleteMany()
  await prisma.task.deleteMany()
  await prisma.label.deleteMany()
  await prisma.board.deleteMany()

  // Create labels
  const labels = await Promise.all([
    prisma.label.create({ data: { name: 'Feature', color: '#22c55e' } }),
    prisma.label.create({ data: { name: 'Bug', color: '#ef4444' } }),
    prisma.label.create({ data: { name: 'Enhancement', color: '#3b82f6' } }),
    prisma.label.create({ data: { name: 'Documentation', color: '#a855f7' } }),
    prisma.label.create({ data: { name: 'Urgent', color: '#f97316' } }),
    prisma.label.create({ data: { name: 'Backend', color: '#06b6d4' } }),
    prisma.label.create({ data: { name: 'Frontend', color: '#ec4899' } }),
    prisma.label.create({ data: { name: 'DevOps', color: '#eab308' } }),
  ])

  console.log(`Created ${labels.length} labels`)

  // Create sample boards
  const projectAlpha = await prisma.board.create({
    data: {
      name: 'Project Alpha',
      description: 'Main product development board for Q1 2026',
      color: '#6366f1',
      icon: 'rocket',
      tasks: {
        create: [
          {
            title: 'Set up project infrastructure',
            description: 'Initialize repository, CI/CD pipeline, and deployment configs',
            status: 'done',
            priority: 'high',
            position: 0,
          },
          {
            title: 'Design system architecture',
            description: 'Create system design document with component diagrams',
            status: 'done',
            priority: 'high',
            position: 1,
          },
          {
            title: 'Implement user authentication',
            description: 'Add JWT-based auth with refresh tokens',
            status: 'in_progress',
            priority: 'high',
            assignedTo: 'John Doe',
            position: 0,
          },
          {
            title: 'Build dashboard UI',
            description: 'Create responsive dashboard with charts and metrics',
            status: 'in_progress',
            priority: 'medium',
            assignedTo: 'Jane Smith',
            position: 1,
          },
          {
            title: 'API rate limiting',
            description: 'Implement rate limiting middleware',
            status: 'todo',
            priority: 'medium',
            position: 0,
          },
          {
            title: 'Write unit tests',
            description: 'Achieve 80% code coverage',
            status: 'todo',
            priority: 'low',
            position: 1,
          },
          {
            title: 'Performance optimization',
            description: 'Optimize database queries and caching',
            status: 'todo',
            priority: 'medium',
            dueDate: new Date('2026-02-15'),
            position: 2,
          },
        ],
      },
    },
  })

  const marketingBoard = await prisma.board.create({
    data: {
      name: 'Marketing Campaign',
      description: 'Q1 Marketing initiatives and content calendar',
      color: '#ec4899',
      icon: 'megaphone',
      tasks: {
        create: [
          {
            title: 'Create social media calendar',
            description: 'Plan posts for January-March',
            status: 'done',
            priority: 'high',
            position: 0,
          },
          {
            title: 'Design email newsletter',
            description: 'New template for product announcements',
            status: 'in_progress',
            priority: 'medium',
            assignedTo: 'Marketing Team',
            position: 0,
          },
          {
            title: 'Launch landing page',
            description: 'A/B test two variations',
            status: 'todo',
            priority: 'high',
            dueDate: new Date('2026-01-30'),
            position: 0,
          },
          {
            title: 'Influencer outreach',
            description: 'Contact 20 micro-influencers',
            status: 'todo',
            priority: 'medium',
            position: 1,
          },
        ],
      },
    },
  })

  const bugTracker = await prisma.board.create({
    data: {
      name: 'Bug Tracker',
      description: 'Track and resolve reported issues',
      color: '#ef4444',
      icon: 'bug',
      tasks: {
        create: [
          {
            title: 'Fix login redirect loop',
            description: 'Users getting stuck in redirect after OAuth',
            status: 'done',
            priority: 'high',
            position: 0,
          },
          {
            title: 'Memory leak in dashboard',
            description: 'Dashboard component not unmounting properly',
            status: 'in_progress',
            priority: 'high',
            assignedTo: 'Dev Team',
            position: 0,
          },
          {
            title: 'Mobile layout broken',
            description: 'Sidebar overlaps content on small screens',
            status: 'todo',
            priority: 'medium',
            position: 0,
          },
        ],
      },
    },
  })

  // Get all tasks to add labels and subtasks
  const allTasks = await prisma.task.findMany()

  // Add labels to tasks
  const labelMap = {
    'Feature': labels[0].id,
    'Bug': labels[1].id,
    'Enhancement': labels[2].id,
    'Documentation': labels[3].id,
    'Urgent': labels[4].id,
    'Backend': labels[5].id,
    'Frontend': labels[6].id,
    'DevOps': labels[7].id,
  }

  // Assign labels to some tasks
  for (const task of allTasks) {
    const taskLabels: string[] = []

    if (task.title.toLowerCase().includes('auth') || task.title.toLowerCase().includes('api')) {
      taskLabels.push(labelMap['Backend'])
    }
    if (task.title.toLowerCase().includes('ui') || task.title.toLowerCase().includes('dashboard') || task.title.toLowerCase().includes('layout')) {
      taskLabels.push(labelMap['Frontend'])
    }
    if (task.title.toLowerCase().includes('bug') || task.title.toLowerCase().includes('fix') || task.title.toLowerCase().includes('leak')) {
      taskLabels.push(labelMap['Bug'])
    }
    if (task.priority === 'high') {
      taskLabels.push(labelMap['Urgent'])
    }
    if (task.title.toLowerCase().includes('set up') || task.title.toLowerCase().includes('infrastructure')) {
      taskLabels.push(labelMap['DevOps'])
    }

    for (const labelId of taskLabels) {
      await prisma.taskLabel.create({
        data: { taskId: task.id, labelId }
      })
    }
  }

  // Add subtasks to the first few tasks
  const tasksWithSubtasks = allTasks.slice(0, 5)

  const subtaskData = [
    ['Research best practices', 'Set up development environment', 'Write initial code', 'Code review'],
    ['Create wireframes', 'Design mockups', 'Get stakeholder approval', 'Implement design'],
    ['Set up OAuth providers', 'Implement JWT tokens', 'Add refresh token logic', 'Test authentication flow'],
    ['Design component library', 'Build chart components', 'Add responsive breakpoints', 'Test on mobile devices'],
    ['Research rate limiting strategies', 'Implement middleware', 'Add Redis caching', 'Load testing'],
  ]

  for (let i = 0; i < tasksWithSubtasks.length; i++) {
    const task = tasksWithSubtasks[i]
    const subtasks = subtaskData[i]

    for (let j = 0; j < subtasks.length; j++) {
      await prisma.subtask.create({
        data: {
          title: subtasks[j],
          taskId: task.id,
          position: j,
          completed: j < 2, // First two subtasks are completed
        }
      })
    }
  }

  console.log('Seeding completed!')
  console.log(`Created boards: ${projectAlpha.name}, ${marketingBoard.name}, ${bugTracker.name}`)
  console.log(`Created ${labels.length} labels and subtasks for ${tasksWithSubtasks.length} tasks`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
