import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Clear existing data
  await prisma.task.deleteMany()
  await prisma.board.deleteMany()

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

  console.log('Seeding completed!')
  console.log(`Created boards: ${projectAlpha.name}, ${marketingBoard.name}, ${bugTracker.name}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
