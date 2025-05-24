import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/leaderboard - Get leaderboard data with period filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || 'monthly' // daily, weekly, monthly, yearly
    const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString())
    const month = searchParams.get('month') ? parseInt(searchParams.get('month')!) : undefined
    const week = searchParams.get('week') ? parseInt(searchParams.get('week')!) : undefined
    const filter = searchParams.get('filter') || 'all' // featured, all
    const limit = parseInt(searchParams.get('limit') || '50')

    // Build date range based on period
    let startDate: Date
    let endDate: Date

    switch (period) {
      case 'daily':
        if (month) {
          startDate = new Date(year, month - 1, 1)
          endDate = new Date(year, month - 1 + 1, 0) // Last day of month
        } else {
          startDate = new Date(year, 0, 1)
          endDate = new Date(year, 11, 31)
        }
        break
      case 'weekly':
        if (month && week) {
          // Calculate week dates within the month
          const firstDayOfMonth = new Date(year, month - 1, 1)
          const startOfWeek = new Date(firstDayOfMonth.getTime() + (week - 1) * 7 * 24 * 60 * 60 * 1000)
          startDate = startOfWeek
          endDate = new Date(startOfWeek.getTime() + 7 * 24 * 60 * 60 * 1000)
        } else {
          startDate = new Date(year, 0, 1)
          endDate = new Date(year, 11, 31)
        }
        break
      case 'monthly':
        if (month) {
          startDate = new Date(year, month - 1, 1)
          endDate = new Date(year, month, 0) // Last day of month
        } else {
          startDate = new Date(year, 0, 1)
          endDate = new Date(year, 11, 31)
        }
        break
      case 'yearly':
      default:
        startDate = new Date(year, 0, 1)
        endDate = new Date(year, 11, 31)
        break
    }

    const where: any = {
      status: 'LIVE',
      launchDate: {
        gte: startDate,
        lte: endDate,
      }
    }

    if (filter === 'featured') {
      where.featured = true
    }

    // Get projects with votes and calculate scores
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
        votes: {
          where: {
            createdAt: {
              gte: startDate,
              lte: endDate,
            }
          }
        },
        _count: {
          select: {
            votes: true
          }
        }
      },
      orderBy: [
        { huntScore: 'desc' },
        { totalVotes: 'desc' },
        { createdAt: 'desc' }
      ],
      take: limit,
    })

    // Calculate dynamic scores based on period
    const leaderboard = projects.map((project, index) => ({
      ...project,
      rank: index + 1,
      periodVotes: project.votes.length,
      // You can add more sophisticated scoring logic here
      periodScore: project.votes.length * 10 + project.huntScore,
    }))

    return NextResponse.json({
      leaderboard,
      period: {
        type: period,
        year,
        month,
        week,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      },
      filter,
      total: projects.length,
    })
  } catch (error) {
    console.error('Error fetching leaderboard:', error)
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    )
  }
} 