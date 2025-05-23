import { ArrowUp, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";

interface Product {
  id: number;
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
}

const ProductCard = ({ product }: ProductCardProps) => {
  const isMobile = useIsMobile(768);

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
          <div className="flex items-center justify-center bg-gray-100 rounded-md px-2 py-1 text-gray-700">
            <ArrowUp className="h-3.5 w-3.5 mr-1" />
            <span className="text-sm font-medium">{product.upvotes}</span>
          </div>
        </div>
      </div>
    );
  }

  // Desktop layout - original design
  return (
    <div className="flex items-center p-6 hover:bg-gray-50 transition-colors">
      {/* Rank */}
      <div className="flex-shrink-0 w-8 text-right">
        <span className="text-lg font-bold text-gray-400">#{product.rank}</span>
      </div>
      
      {/* Product Logo */}
      <div className="flex-shrink-0 ml-4">
        <img 
          src={product.logo} 
          alt={product.name}
          className="w-12 h-12 rounded-lg object-cover"
        />
      </div>
      
      {/* Product Info */}
      <div className="flex-1 ml-4 min-w-0">
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-semibold text-gray-900 hover:text-[#EC729C] cursor-pointer">
            {product.name}
          </h3>
          {product.featured && (
            <Badge className="bg-[#FF6154] text-white text-xs">Featured</Badge>
          )}
        </div>
        <p className="text-gray-600 mt-1 text-sm leading-relaxed">{product.tagline}</p>
        <div className="flex items-center space-x-2 mt-2">
          {product.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs bg-gray-100 text-gray-700 hover:bg-gray-200">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
      
      {/* Actions */}
      <div className="flex items-center space-x-4 ml-4">
        {/* Updated comment button to match reference image */}
        <button className="flex items-center justify-center bg-gray-100 rounded-md w-[64px] h-[40px] text-gray-700 hover:border hover:border-[#EC729C] transition-colors">
          <MessageSquare className="h-4 w-4 mr-1.5" />
          <span className="text-sm font-medium">{product.comments}</span>
        </button>
        
        {/* Updated upvote button to match reference image */}
        <button className="flex items-center justify-center bg-gray-100 rounded-md w-[64px] h-[40px] text-gray-700 hover:border hover:border-[#EC729C] transition-colors">
          <ArrowUp className="h-4 w-4 mr-1.5" />
          <span className="text-sm font-medium">{product.upvotes}</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
