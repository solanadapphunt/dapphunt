import { ArrowUp, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";

interface Product {
  id: number;
  name: string;
  tagline: string;
  logo: string;
  upvotes: number;
  comments: number;
  tags: string[];
  rank?: number;
}

interface LeaderboardResultsProps {
  period: string;
  year: number;
  month: number;
  week: number | null;
  filter: 'featured' | 'all';
}

// Mock data based on the ProductHunt examples
const mockLeaderboardData: Product[] = [
  {
    id: 1,
    name: "Algebras AI",
    tagline: "Translate apps with AI, no proofreading",
    logo: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=64&h=64&fit=crop",
    upvotes: 940,
    comments: 216,
    tags: ["Open Source", "Languages", "Artificial Intelligence"]
  },
  {
    id: 2,
    name: "Raycast for iOS",
    tagline: "Powerful productivity on the go",
    logo: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=64&h=64&fit=crop",
    upvotes: 852,
    comments: 54,
    tags: ["iOS", "Productivity", "Artificial Intelligence"]
  },
  {
    id: 3,
    name: "Appwrite Sites",
    tagline: "The open-source Vercel alternative",
    logo: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=64&h=64&fit=crop",
    upvotes: 833,
    comments: 222,
    tags: ["Productivity", "Software Engineering", "Developer Tools"]
  },
  {
    id: 4,
    name: "AI Meeting Notes by Notion",
    tagline: "Perfect meeting memory in Notion",
    logo: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=64&h=64&fit=crop",
    upvotes: 828,
    comments: 48,
    tags: ["Productivity", "Meetings", "Artificial Intelligence"]
  },
  {
    id: 5,
    name: "Tofu Pages",
    tagline: "Infinite landing pages from your existing website",
    logo: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=64&h=64&fit=crop",
    upvotes: 820,
    comments: 168,
    tags: ["Chrome Extensions", "Marketing", "SaaS"]
  },
  {
    id: 6,
    name: "A-Leads",
    tagline: "Unlock 50 Free Leads with AI-Powered Lead Intelligence",
    logo: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=64&h=64&fit=crop",
    upvotes: 756,
    comments: 89,
    tags: ["Sales", "Lead Generation", "Artificial Intelligence"]
  }
];

const LeaderboardResults = ({ period, year, month, week, filter }: LeaderboardResultsProps) => {
  const isMobile = useIsMobile(768);

  // Add rank to products
  const rankedProducts = mockLeaderboardData.map((product, index) => ({
    ...product,
    rank: index + 1
  }));

  const ProductCard = ({ product }: { product: Product }) => {
    if (isMobile) {
      return (
        <div className="flex items-center p-4 hover:bg-gray-50 transition-colors border-b border-gray-100">
          <div className="flex items-center space-x-3 flex-shrink-0">
            <span className="text-base font-bold text-gray-400 w-6">{product.rank}.</span>
            <img 
              src={product.logo} 
              alt={product.name}
              className="w-12 h-12 rounded-lg object-cover"
            />
          </div>
          
          <div className="flex-1 ml-3 min-w-0">
            <h3 className="text-base font-semibold text-gray-900 hover:text-[#EC729C] cursor-pointer">
              {product.name}
            </h3>
            <p className="text-gray-600 text-sm mt-1 line-clamp-2">{product.tagline}</p>
            <div className="flex items-center space-x-1 mt-2">
              {product.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="flex-shrink-0 ml-3">
            <div className="flex items-center justify-center bg-gray-100 rounded-md px-2 py-1 text-gray-700">
              <ArrowUp className="h-3.5 w-3.5 mr-1" />
              <span className="text-sm font-medium">{product.upvotes}</span>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center p-6 hover:bg-gray-50 transition-colors border-b border-gray-100">
        <div className="flex items-center space-x-4 flex-1">
          {/* Rank and Logo */}
          <div className="flex items-center space-x-4">
            <span className="text-lg font-bold text-gray-400 w-8">{product.rank}.</span>
            <img 
              src={product.logo} 
              alt={product.name}
              className="w-12 h-12 rounded-lg object-cover"
            />
          </div>
          
          {/* Product Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 hover:text-[#EC729C] cursor-pointer">
              {product.name}
            </h3>
            <p className="text-gray-600 text-sm mt-1">{product.tagline}</p>
            <div className="flex items-center space-x-1 mt-2">
              {product.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex items-center space-x-4 ml-4">
          <button className="flex items-center justify-center bg-gray-100 rounded-md w-[64px] h-[40px] text-gray-700 hover:border hover:border-[#EC729C] transition-colors">
            <MessageSquare className="h-4 w-4 mr-1.5" />
            <span className="text-sm font-medium">{product.comments}</span>
          </button>
          
          <button className="flex items-center justify-center bg-gray-100 rounded-md w-[64px] h-[40px] text-gray-700 hover:border hover:border-[#EC729C] transition-colors">
            <ArrowUp className="h-4 w-4 mr-1.5" />
            <span className="text-sm font-medium">{product.upvotes}</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="divide-y divide-gray-100">
        {rankedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
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