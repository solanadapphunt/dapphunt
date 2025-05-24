import { useState, useCallback } from 'react';

interface VoteStats {
  upVotes: number;
  downVotes: number;
  userVote: string | null;
}

interface UseVotingProps {
  projectId: string;
  userId?: string;
  initialVoteStats?: VoteStats;
}

interface VoteResponse {
  message: string;
  action: string;
  voteType?: string;
  upVotes: number;
  downVotes: number;
  newVoteCount: number;
  project: {
    id: string;
    totalVotes: number;
    huntScore: number;
  };
}

export const useVoting = ({ projectId, userId, initialVoteStats }: UseVotingProps) => {
  const [voteStats, setVoteStats] = useState<VoteStats>(
    initialVoteStats || { upVotes: 0, downVotes: 0, userVote: null }
  );
  const [isVoting, setIsVoting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVoteStats = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (userId) params.append('userId', userId);
      
      const response = await fetch(`/api/projects/${projectId}/vote?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch vote stats');
      }
      
      const stats: VoteStats = await response.json();
      setVoteStats(stats);
      return stats;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch vote stats';
      setError(errorMessage);
      console.error('Error fetching vote stats:', err);
      return null;
    }
  }, [projectId, userId]);

  const vote = useCallback(async (voteType: 'up' | 'down') => {
    if (!userId) {
      setError('You must be logged in to vote');
      return null;
    }

    setIsVoting(true);
    setError(null);

    try {
      const response = await fetch(`/api/projects/${projectId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          voteType,
          userId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to vote');
      }

      const result: VoteResponse = await response.json();
      
      // Update local state with new vote stats
      setVoteStats({
        upVotes: result.upVotes,
        downVotes: result.downVotes,
        userVote: result.action === 'removed' ? null : voteType,
      });

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to vote';
      setError(errorMessage);
      console.error('Error voting:', err);
      return null;
    } finally {
      setIsVoting(false);
    }
  }, [projectId, userId]);

  const upvote = useCallback(() => vote('up'), [vote]);
  const downvote = useCallback(() => vote('down'), [vote]);

  return {
    voteStats,
    isVoting,
    error,
    vote,
    upvote,
    downvote,
    fetchVoteStats,
    clearError: () => setError(null),
  };
}; 