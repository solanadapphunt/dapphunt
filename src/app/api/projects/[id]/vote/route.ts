import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { voteType, userId } = await request.json();
    const projectId = params.id;

    if (!projectId || !voteType || !userId) {
      return NextResponse.json(
        { error: 'Project ID, vote type, and user ID are required' },
        { status: 400 }
      );
    }

    if (!['up', 'down'].includes(voteType)) {
      return NextResponse.json(
        { error: 'Vote type must be either "up" or "down"' },
        { status: 400 }
      );
    }

    // Check if project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId }
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Check if user already voted on this project
    const existingVote = await prisma.vote.findFirst({
      where: {
        projectId,
        userId,
      }
    });

    if (existingVote) {
      // If same vote type, remove the vote (toggle off)
      if (existingVote.voteType === voteType.toUpperCase()) {
        await prisma.vote.delete({
          where: { id: existingVote.id }
        });

        // Update project vote counts
        const voteCount = await prisma.vote.count({
          where: { projectId, voteType: 'UP' }
        });

        await prisma.project.update({
          where: { id: projectId },
          data: {
            totalVotes: voteCount,
            huntScore: Math.max(0, voteCount * 10) // Simple scoring algorithm
          }
        });

        return NextResponse.json({
          message: 'Vote removed',
          action: 'removed',
          newVoteCount: voteCount
        });
      } else {
        // If different vote type, update the existing vote
        await prisma.vote.update({
          where: { id: existingVote.id },
          data: { voteType: voteType.toUpperCase() }
        });
      }
    } else {
      // Create new vote
      await prisma.vote.create({
        data: {
          projectId,
          userId,
          voteType: voteType.toUpperCase(),
        }
      });
    }

    // Recalculate project statistics
    const upVotes = await prisma.vote.count({
      where: { projectId, voteType: 'UP' }
    });

    const downVotes = await prisma.vote.count({
      where: { projectId, voteType: 'DOWN' }
    });

    // Update project with new vote counts
    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: {
        totalVotes: upVotes,
        huntScore: Math.max(0, (upVotes - downVotes) * 10) // Consider both up and down votes
      }
    });

    return NextResponse.json({
      message: existingVote ? 'Vote updated' : 'Vote recorded',
      action: existingVote ? 'updated' : 'created',
      voteType,
      upVotes,
      downVotes,
      newVoteCount: upVotes,
      project: {
        id: updatedProject.id,
        totalVotes: updatedProject.totalVotes,
        huntScore: updatedProject.huntScore
      }
    });

  } catch (error) {
    console.error('Error processing vote:', error);
    return NextResponse.json(
      { error: 'Failed to process vote' },
      { status: 500 }
    );
  }
}

// Get vote status for a project (check if user has voted)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const projectId = params.id;

    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }

    const voteStats = {
      upVotes: await prisma.vote.count({
        where: { projectId, voteType: 'UP' }
      }),
      downVotes: await prisma.vote.count({
        where: { projectId, voteType: 'DOWN' }
      }),
      userVote: null as string | null
    };

    if (userId) {
      const userVote = await prisma.vote.findFirst({
        where: { projectId, userId }
      });
      voteStats.userVote = userVote ? userVote.voteType.toLowerCase() : null;
    }

    return NextResponse.json(voteStats);

  } catch (error) {
    console.error('Error fetching vote stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch vote stats' },
      { status: 500 }
    );
  }
} 