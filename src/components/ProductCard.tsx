import { ArrowUp, MessageSquare, ArrowDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import { useVoting } from "@/hooks/useVoting";
import { useEffect } from "react";
import { useSession, signIn } from "next-auth/react";

interface Product {
  id: string;
  rank: number;
  name: string;
  tagline: string;
  logo: string;
  upvotes: number;
  comments: number;
  tags: string[];
  featured?: boolean;
}

interface ProductCardProps {
  product: Product;
  showDownvote?: boolean; // New prop to control downvote visibility
}

const ProductCard = ({ product, showDownvote }: ProductCardProps) => {
  const isMobile = useIsMobile(768);
  const { data: session } = useSession();
  
  const { 
    voteStats, 
    isVoting, 
    upvote, 
    downvote, 
    fetchVoteStats, 
    error 
  } = useVoting({
    projectId: product.id,
    userId: session?.user?.id,
    initialVoteStats: {
      upVotes: product.upvotes,
      downVotes: 0,
      userVote: null
    }
  });

  // Fetch initial vote stats when component mounts
  useEffect(() => {
    if (session?.user?.id) {
      fetchVoteStats();
    }
  }, [fetchVoteStats, session?.user?.id]);

  const handleUpvote = async () => {
    if (!session?.user) {
      // Redirect to sign in
      signIn();
      return;
    }
    await upvote();
  };

  const handleDownvote = async () => {
    if (!session?.user) {
      signIn();
      return;
    }
    await downvote();
  };

  if (isMobile) {
    // Mobile layout - simplified list view
    return (
      <div className="flex items-center p-4 hover:bg-gray-50 transition-colors">
        {/* Rank & Logo */}
        <div className="flex items-center space-x-3 flex-shrink-0">
          <span className="text-base font-bold text-gray-400 w-6">{product.rank}.</span>
          <img 
            src={product.logo} 
            alt={product.name}
            className="w-10 h-10 rounded-lg object-cover"
          />
        </div>
        
        {/* Product Info */}
        <div className="flex-1 ml-3 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="text-base font-semibold text-gray-900 hover:text-[#EC729C] cursor-pointer truncate">
              {product.name}
            </h3>
            {product.featured && (
              <Badge className="bg-[#FF6154] text-white text-xs">Featured</Badge>
            )}
          </div>
          <p className="text-gray-600 text-sm leading-tight line-clamp-2">{product.tagline}</p>
        </div>
        
        {/* Upvotes */}
        <div className="flex-shrink-0 ml-3">
          <button
            onClick={handleUpvote}
            disabled={isVoting}
            className={`flex items-center justify-center rounded-md px-2 py-1 transition-colors ${
              voteStats.userVote === 'up'
                ? 'bg-green-100 text-green-700 border border-green-300'
                : 'bg-gray-100 text-gray-700 hover:bg-green-50 hover:border hover:border-green-300'
            } ${isVoting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <ArrowUp className="h-3.5 w-3.5 mr-1" />
            <span className="text-sm font-medium">{voteStats.upVotes}</span>
          </button>
        </div>
      </div>
    );
  }

  // Desktop layout - card view
  return (
    <div className="flex items-center p-6 hover:bg-gray-50 transition-colors">
      {/* Rank */}
      <div className="flex-shrink-0 w-8">
        <span className="text-lg font-bold text-gray-400">{product.rank}.</span>
      </div>
      
      {/* Logo */}
      <div className="flex-shrink-0 ml-4">
        <img 
          src={product.logo} 
          alt={product.name}
          className="w-12 h-12 rounded-lg object-cover"
        />
      </div>
      
      {/* Product Info */}
      <div className="flex-1 ml-4 min-w-0">
        <div className="flex items-center space-x-3 mb-1">
          <h3 className="text-lg font-semibold text-gray-900 hover:text-[#EC729C] cursor-pointer">
            {product.name}
          </h3>
          {product.featured && (
            <Badge className="bg-[#FF6154] text-white text-xs">Featured</Badge>
          )}
        </div>
        <p className="text-gray-600 text-sm leading-relaxed mb-2">{product.tagline}</p>
        <div className="flex flex-wrap gap-1">
          {product.tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex items-center space-x-3 ml-4">
        {/* Comment button */}
        <button className="flex items-center justify-center bg-gray-100 rounded-md w-[64px] h-[40px] text-gray-700 hover:border hover:border-[#EC729C] transition-colors">
          <MessageSquare className="h-4 w-4 mr-1.5" />
          <span className="text-sm font-medium">{product.comments}</span>
        </button>
        
        {/* Downvote button */}
        {showDownvote && (
          <button 
            onClick={handleDownvote}
            disabled={isVoting}
            className={`flex items-center justify-center rounded-md w-[64px] h-[40px] transition-colors ${
              voteStats.userVote === 'down'
                ? 'bg-red-100 text-red-700 border border-red-300'
                : 'bg-gray-100 text-gray-700 hover:bg-red-50 hover:border hover:border-red-300'
            } ${isVoting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <ArrowDown className="h-4 w-4 mr-1.5" />
            <span className="text-sm font-medium">{voteStats.downVotes}</span>
          </button>
        )}
        
        {/* Upvote button */}
        <button 
          onClick={handleUpvote}
          disabled={isVoting}
          className={`flex items-center justify-center rounded-md w-[64px] h-[40px] transition-colors ${
            voteStats.userVote === 'up'
              ? 'bg-green-100 text-green-700 border border-green-300'
              : 'bg-gray-100 text-gray-700 hover:bg-green-50 hover:border hover:border-green-300'
          } ${isVoting ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <ArrowUp className="h-4 w-4 mr-1.5" />
          <span className="text-sm font-medium">{voteStats.upVotes}</span>
        </button>
      </div>
      
      {/* Error display */}
      {error && (
        <div className="ml-4 text-red-600 text-sm">
          {error}
        </div>
      )}
    </div>
  );
};

export default ProductCard;
