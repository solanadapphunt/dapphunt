import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

// GET /api/submissions - Get all submissions (admin only)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    const where: any = {}

    if (status) {
      where.status = status
    }

    const submissions = await prisma.submission.findMany({
      where,
      include: {
        submittedBy: {
          select: {
            id: true,
            name: true,
            username: true,
            email: true,
            image: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit,
      skip: offset,
    })

    const total = await prisma.submission.count({ where })

    return NextResponse.json({
      submissions,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    })
  } catch (error) {
    console.error('Error fetching submissions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch submissions' },
      { status: 500 }
    )
  }
}

// POST /api/submissions - Submit new project
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'You must be signed in to submit a project' },
        { status: 401 }
      )
    }

    const body = await request.json()
    
    // Basic validation
    if (!body.projectName || !body.description || !body.liveUrl || !body.solanaAddress) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create submission
    const submission = await prisma.submission.create({
      data: {
        projectName: body.projectName,
        oneLiner: body.oneLiner,
        category: body.category,
        subCategory: body.subCategory,
        description: body.description,
        keyFeatures: body.keyFeatures,
        uniqueValue: body.uniqueValue,
        targetAudience: body.targetAudience,
        solanaAddress: body.solanaAddress,
        githubRepo: body.githubRepo,
        liveUrl: body.liveUrl,
        testnetUrl: body.testnetUrl,
        auditStatus: body.auditStatus,
        tokenSymbol: body.tokenSymbol,
        tokenAddress: body.tokenAddress,
        tvl: body.tvl,
        revenueModel: body.revenueModel,
        tokenDistribution: body.tokenDistribution,
        founders: body.founders,
        teamSize: body.teamSize,
        twitter: body.twitter,
        discord: body.discord,
        telegram: body.telegram,
        blog: body.blog,
        launchDate: new Date(body.launchDate),
        currentStage: body.currentStage,
        fundingStatus: body.fundingStatus,
        achievements: body.achievements,
        submittedById: session.user.id,
      },
      include: {
        submittedBy: {
          select: {
            id: true,
            name: true,
            username: true,
            email: true,
          }
        }
      }
    })

    return NextResponse.json(
      { 
        message: 'Submission received successfully!',
        submission: {
          id: submission.id,
          projectName: submission.projectName,
          status: submission.status,
          createdAt: submission.createdAt
        }
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating submission:', error)
    return NextResponse.json(
      { error: 'Failed to create submission' },
      { status: 500 }
    )
  }
} 