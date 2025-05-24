import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const submissionId = params.id

    // Get the submission
    const submission = await prisma.submission.findUnique({
      where: { id: submissionId },
      include: { submittedBy: true }
    })

    if (!submission) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      )
    }

    if (submission.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'Submission already processed' },
        { status: 400 }
      )
    }

    // Find or create category
    let category = await prisma.category.findFirst({
      where: { name: submission.category }
    })

    if (!category) {
      category = await prisma.category.create({
        data: {
          name: submission.category,
          slug: submission.category.toLowerCase().replace(/\s+/g, '-'),
          description: `${submission.category} applications`,
        }
      })
    }

    // Create project from submission
    const project = await prisma.project.create({
      data: {
        name: submission.projectName,
        slug: submission.projectName.toLowerCase().replace(/\s+/g, '-'),
        oneLiner: submission.oneLiner,
        description: submission.description,
        liveUrl: submission.liveUrl,
        githubUrl: submission.githubRepo,
        twitterHandle: submission.twitter,
        discordUrl: submission.discord,
        telegramUrl: submission.telegram,
        blogUrl: submission.blog,
        solanaAddress: submission.solanaAddress,
        tokenSymbol: submission.tokenSymbol,
        tokenAddress: submission.tokenAddress,
        tvl: submission.tvl,
        launchDate: submission.launchDate,
        status: 'LIVE',
        categoryId: category.id,
        ownerId: submission.submittedById,
      }
    })

    // Update submission status
    await prisma.submission.update({
      where: { id: submissionId },
      data: {
        status: 'APPROVED',
        reviewNotes: 'Automatically approved and converted to project'
      }
    })

    return NextResponse.json({
      message: 'Submission approved successfully',
      project: {
        id: project.id,
        name: project.name,
        slug: project.slug,
        status: project.status
      }
    })
  } catch (error) {
    console.error('Error approving submission:', error)
    return NextResponse.json(
      { error: 'Failed to approve submission' },
      { status: 500 }
    )
  }
} 