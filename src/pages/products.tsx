import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import { Filter, Calendar, TrendingUp } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  createdAt: string;
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

export default function Products() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('huntScore');
  const [order, setOrder] = useState('desc');
  const [filter, setFilter] = useState('all');

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        limit: '50',
        sortBy,
        order,
        ...(filter !== 'all' && { filter })
      });
      
      const response = await fetch(`/api/projects?${params}`);
      
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

  useEffect(() => {
    fetchProjects();
  }, [sortBy, order, filter]);

  // Transform API data to match ProductCard interface
  const transformedProducts = projects.map((project, index) => ({
    id: project.id,
    rank: index + 1,
    name: project.name,
    tagline: project.oneLiner,
    logo: project.logoUrl || `https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=64&h=64&fit=crop&seed=${project.id}`,
    upvotes: project.totalVotes,
    comments: Math.floor(project.totalVotes * 0.1),
    tags: [project.category.name, ...(project.featured ? ['Featured'] : [])],
    featured: project.featured
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🚀 All Products
          </h1>
          <p className="text-gray-600">
            Discover and explore amazing Solana dapps built by the community
          </p>
        </div>

        {/* Filters and Sorting */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Sort by:</span>
            </div>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="huntScore">
                  <div className="flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Hunt Score
                  </div>
                </SelectItem>
                <SelectItem value="totalVotes">
                  <div className="flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Total Votes
                  </div>
                </SelectItem>
                <SelectItem value="createdAt">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    Launch Date
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            <Select value={order} onValueChange={setOrder}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">Highest First</SelectItem>
                <SelectItem value="asc">Lowest First</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Products</SelectItem>
                <SelectItem value="featured">Featured Only</SelectItem>
                <SelectItem value="recent">Recent Launches</SelectItem>
              </SelectContent>
            </Select>

            <div className="ml-auto text-sm text-gray-500">
              {projects.length} products found
            </div>
          </div>
        </div>

        {/* Products List */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="text-gray-600 mt-2">Loading products...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <p className="text-red-600">Error: {error}</p>
              <Button 
                onClick={fetchProjects}
                className="mt-2"
                variant="outline"
              >
                Try again
              </Button>
            </div>
          ) : transformedProducts.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {transformedProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  showDownvote={true} // Allow downvote on products page
                />
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-gray-600">No products found matching your criteria.</p>
              <Button 
                onClick={() => {
                  setSortBy('huntScore');
                  setOrder('desc');
                  setFilter('all');
                }}
                className="mt-2"
                variant="outline"
              >
                Reset Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 