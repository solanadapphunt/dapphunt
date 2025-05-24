import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/forum/threads - Get forum threads
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')
    const sortBy = searchParams.get('sortBy') || 'updatedAt' // updatedAt, createdAt, replyCount
    const order = searchParams.get('order') || 'desc'

    const where: any = {}

    if (category) {
      where.category = category
    }

    const threads = await prisma.forumThread.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          }
        },
        _count: {
          select: {
            posts: true
          }
        }
      },
      orderBy: [
        { isPinned: 'desc' }, // Pinned threads first
        { isHot: 'desc' },    // Hot threads next
        { [sortBy]: order as 'asc' | 'desc' }
      ],
      take: limit,
      skip: offset,
    })

    const total = await prisma.forumThread.count({ where })

    // Format threads for frontend
    const formattedThreads = threads.map(thread => ({
      id: thread.id,
      title: thread.title,
      author: thread.author.name || thread.author.username || 'Anonymous',
      replies: thread._count.posts,
      lastActivity: thread.updatedAt,
      isHot: thread.isHot,
      category: thread.category,
      isPinned: thread.isPinned,
    }))

    return NextResponse.json({
      threads: formattedThreads,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    })
  } catch (error) {
    console.error('Error fetching forum threads:', error)
    return NextResponse.json(
      { error: 'Failed to fetch forum threads' },
      { status: 500 }
    )
  }
}

// POST /api/forum/threads - Create new thread (requires authentication)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Basic validation
    if (!body.title || !body.content || !body.category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // For now, we'll use a hardcoded user ID
    // In a real app, you'd get this from the session
    const demoUser = await prisma.user.findUnique({
      where: { email: 'demo@dapphunt.com' }
    })

    if (!demoUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const thread = await prisma.forumThread.create({
      data: {
        title: body.title,
        content: body.content,
        category: body.category,
        authorId: demoUser.id,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          }
        }
      }
    })

    return NextResponse.json(thread, { status: 201 })
  } catch (error) {
    console.error('Error creating forum thread:', error)
    return NextResponse.json(
      { error: 'Failed to create forum thread' },
      { status: 500 }
    )
  }
} 