import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, TrendingUp, Clock } from "lucide-react";

const ForumThreads = () => {
  const threads = [
    {
      id: 1,
      title: "Best practices for dApp development",
      author: "DevExpert",
      replies: 23,
      lastActivity: "2h ago",
      isHot: true,
      category: "Development"
    },
    {
      id: 2,
      title: "Upcoming token launches to watch",
      author: "CryptoAnalyst",
      replies: 45,
      lastActivity: "4h ago",
      isHot: true,
      category: "Trading"
    },
    {
      id: 3,
      title: "UI/UX design trends in Web3",
      author: "DesignPro",
      replies: 12,
      lastActivity: "6h ago",
      isHot: false,
      category: "Design"
    },
    {
      id: 4,
      title: "Security audit checklist",
      author: "SecurityGuru",
      replies: 18,
      lastActivity: "8h ago",
      isHot: false,
      category: "Security"
    },
    {
      id: 5,
      title: "Solana ecosystem updates",
      author: "SolanaFan",
      replies: 34,
      lastActivity: "12h ago",
      isHot: true,
      category: "News"
    }
  ];

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
        {threads.map((thread) => (
          <div key={thread.id} className="p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {thread.isHot && (
                    <TrendingUp className="h-3.5 w-3.5 text-orange-500" />
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
                    <span>{thread.lastActivity}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
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