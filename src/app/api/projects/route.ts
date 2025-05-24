import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/projects - Get all projects with filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')
    const sortBy = searchParams.get('sortBy') || 'huntScore' // huntScore, totalVotes, createdAt
    const order = searchParams.get('order') || 'desc'

    const where: any = {
      status: 'LIVE',
    }

    if (category) {
      where.category = {
        slug: category
      }
    }

    if (featured === 'true') {
      where.featured = true
    }

    const projects = await prisma.project.findMany({
      where,
      include: {
        category: true,
        owner: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          }
        },
        _count: {
          select: {
            votes: true
          }
        }
      },
      orderBy: {
        [sortBy]: order as 'asc' | 'desc'
      },
      take: limit,
      skip: offset,
    })

    const total = await prisma.project.count({ where })

    return NextResponse.json({
      projects,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    })
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}

// POST /api/projects - Create new project (admin only for now)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Basic validation
    if (!body.name || !body.description || !body.liveUrl || !body.solanaAddress) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Generate slug from name
    const slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    
    // Check if slug already exists
    const existingProject = await prisma.project.findUnique({
      where: { slug }
    })

    if (existingProject) {
      return NextResponse.json(
        { error: 'Project with this name already exists' },
        { status: 409 }
      )
    }

    const project = await prisma.project.create({
      data: {
        ...body,
        slug,
        launchDate: new Date(body.launchDate),
      },
      include: {
        category: true,
        owner: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          }
        }
      }
    })

    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    )
  }
} 