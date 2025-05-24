import { useState, useEffect } from "react";
import { ArrowUp, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import ProductCard from "./ProductCard";

interface Project {
  id: string;
  name: string;
  slug: string;
  oneLiner: string;
  logoUrl?: string;
  huntScore: number;
  totalVotes: number;
  featured: boolean;
  category: {
    name: string;
    slug: string;
    color?: string;
  };
  owner: {
    id: string;
    name?: string;
    username?: string;
    image?: string;
  };
  rank: number;
  periodVotes: number;
  periodScore: number;
}

interface LeaderboardApiResponse {
  leaderboard: Project[];
  period: {
    type: string;
    year: number;
    month?: number;
    week?: number;
    startDate: string;
    endDate: string;
  };
  filter: string;
  total: number;
}

interface LeaderboardResultsProps {
  period: string;
  year: number;
  month: number;
  week: number | null;
  filter: 'featured' | 'all';
}

const LeaderboardResults = ({ period, year, month, week, filter }: LeaderboardResultsProps) => {
  const isMobile = useIsMobile(768);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        
        // Build query parameters
        const params = new URLSearchParams({
          period,
          year: year.toString(),
          filter,
          limit: '50'
        });

        if (month) params.append('month', month.toString());
        if (week) params.append('week', week.toString());

        const response = await fetch(`/api/leaderboard?${params}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch leaderboard data');
        }
        
        const data: LeaderboardApiResponse = await response.json();
        setProjects(data.leaderboard);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching leaderboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [period, year, month, week, filter]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="text-gray-600 mt-2">Loading leaderboard...</p>
          </div>
        </div>
      );
    }

  if (error) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-8 text-center">
          <p className="text-red-600">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 text-blue-600 hover:text-blue-800"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="divide-y divide-gray-100">
        {projects.length > 0 ? (
          projects.map((project) => (
            <ProductCard 
              key={project.id} 
              product={{
                id: project.id,
                rank: project.rank,
                name: project.name,
                tagline: project.oneLiner,
                logo: project.logoUrl || `https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=64&h=64&fit=crop&seed=${project.id}`,
                upvotes: project.totalVotes,
                comments: Math.floor(project.totalVotes * 0.1),
                tags: [project.category.name, ...(project.featured ? ['Featured'] : [])],
                featured: project.featured
              }} 
              userId="demo-user-1" 
              showDownvote={true}
            />
          ))
        ) : (
          <div className="p-8 text-center">
            <p className="text-gray-600">No projects found for this period.</p>
          </div>
        )}
      </div>
      
      {/* Navigation arrows for weeks */}
      {period === 'weekly' && (
        <div className="flex items-center justify-center space-x-4 p-4 border-t border-gray-200">
          <button className="text-gray-600 hover:text-gray-900 font-medium">
            ← Previous Week
          </button>
          <span className="text-gray-900 font-medium">
            Week {week || 1}
          </span>
          <button className="text-gray-600 hover:text-gray-900 font-medium">
            Next Week →
          </button>
        </div>
      )}
    </div>
  );
};

export default LeaderboardResults; 