import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, TrendingUp, Clock } from "lucide-react";

interface ForumThread {
  id: string;
  title: string;
  author: string;
  replies: number;
  lastActivity: string;
  isHot: boolean;
  category: string;
  isPinned: boolean;
}

interface ApiResponse {
  threads: ForumThread[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

const ForumThreads = () => {
  const [threads, setThreads] = useState<ForumThread[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/forum/threads?limit=5&sortBy=updatedAt&order=desc');
        
        if (!response.ok) {
          throw new Error('Failed to fetch forum threads');
        }
        
        const data: ApiResponse = await response.json();
        setThreads(data.threads);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching forum threads:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchThreads();
  }, []);

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return `${Math.floor(diffInDays / 7)}w ago`;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Forum Discussions</h2>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>
        </div>
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mx-auto"></div>
          <p className="text-gray-600 mt-2 text-sm">Loading discussions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Forum Discussions</h2>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>
        </div>
        <div className="p-8 text-center">
          <p className="text-red-600 text-sm">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Forum Discussions</h2>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>
      </div>
      
      <div className="divide-y divide-gray-100">
        {threads.length > 0 ? (
          threads.map((thread) => (
            <div key={thread.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {thread.isHot && (
                      <TrendingUp className="h-3.5 w-3.5 text-orange-500" />
                    )}
                    {thread.isPinned && (
                      <Badge variant="default" className="text-xs bg-blue-100 text-blue-800">
                        Pinned
                      </Badge>
                    )}
                    <Badge variant="secondary" className="text-xs">
                      {thread.category}
                    </Badge>
                  </div>
                  
                  <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2">
                    {thread.title}
                  </h3>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>by {thread.author}</span>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-3 w-3" />
                      <span>{thread.replies}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{formatTimeAgo(thread.lastActivity)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center">
            <p className="text-gray-600 text-sm">No discussions yet. Start the conversation!</p>
          </div>
        )}
      </div>
      
      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <Button className="w-full" variant="outline">
          Join Discussion
        </Button>
      </div>
    </div>
  );
};

export default ForumThreads; 