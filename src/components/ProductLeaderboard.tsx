import { useState, useEffect } from "react";
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
  _count: {
    votes: number;
  };
}

interface ApiResponse {
  projects: Project[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

const ProductLeaderboard = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/projects?limit=10&sortBy=huntScore&order=desc');
        
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }
        
        const data: ApiResponse = await response.json();
        setProjects(data.projects);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching projects:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Transform API data to match ProductCard interface
  const transformedProducts = projects.map((project, index) => ({
    id: project.id, // Use string ID directly
    rank: index + 1,
    name: project.name,
    tagline: project.oneLiner,
    logo: project.logoUrl || `https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=64&h=64&fit=crop&seed=${project.id}`,
    upvotes: project.totalVotes,
    comments: Math.floor(project.totalVotes * 0.1), // Estimate comments as 10% of votes
    tags: [project.category.name, ...(project.featured ? ['Featured'] : [])],
    featured: project.featured
  }));

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200 bg-gray-50 px-4 lg:px-6 py-4">
            <h2 className="text-lg lg:text-xl font-semibold text-gray-900">🚀 Top Products Launching Today</h2>
            <p className="text-sm text-gray-600 mt-1">The most exciting launches of the day</p>
          </div>
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading projects...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200 bg-gray-50 px-4 lg:px-6 py-4">
            <h2 className="text-lg lg:text-xl font-semibold text-gray-900">🚀 Top Products Launching Today</h2>
            <p className="text-sm text-gray-600 mt-1">The most exciting launches of the day</p>
          </div>
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
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200 bg-gray-50 px-4 lg:px-6 py-4">
          <h2 className="text-lg lg:text-xl font-semibold text-gray-900">🚀 Top Products Launching Today</h2>
          <p className="text-sm text-gray-600 mt-1">The most exciting launches of the day</p>
        </div>
        
        <div className="divide-y divide-gray-100">
          {transformedProducts.length > 0 ? (
            transformedProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                showDownvote={false} // Hide downvote on home page
              />
            ))
          ) : (
            <div className="p-8 text-center">
              <p className="text-gray-600">No projects found. Be the first to submit one!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductLeaderboard;
