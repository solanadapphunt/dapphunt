
import { ArrowUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Product {
  id: number;
  name: string;
  tagline: string;
  logo: string;
  upvotes: number;
  tags: string[];
}

interface PastLaunchSectionProps {
  title: string;
  products: Product[];
}

const PastLaunchSection = ({ title, products }: PastLaunchSectionProps) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
        <h3 className="text-md font-semibold text-gray-900">{title}</h3>
      </div>
      
      <div className="divide-y divide-gray-100">
        {products.map((product, index) => (
          <div key={product.id} className="flex items-center p-4 hover:bg-gray-50 transition-colors">
            <div className="flex-shrink-0 w-6 text-right">
              <span className="text-sm font-bold text-gray-400">#{index + 1}</span>
            </div>
            
            <div className="flex-shrink-0 ml-4">
              <img 
                src={product.logo} 
                alt={product.name}
                className="w-10 h-10 rounded-lg object-cover"
              />
            </div>
            
            <div className="flex-1 ml-4 min-w-0">
              <h4 className="text-md font-semibold text-gray-900 hover:text-[#EC729C] cursor-pointer">
                {product.name}
              </h4>
              <p className="text-gray-600 text-sm mt-1">{product.tagline}</p>
              <div className="flex items-center space-x-1 mt-2">
                {product.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="flex items-center space-x-2 ml-4">
              {/* Updated upvote button to match reference image */}
              <div className="flex items-center justify-center bg-gray-100 rounded-md px-3 py-1.5 text-gray-700 hover:border hover:border-[#EC729C] transition-colors">
                <ArrowUp className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">{product.upvotes}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PastLaunchSection;
