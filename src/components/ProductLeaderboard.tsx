import ProductCard from "./ProductCard";

const mockProducts = [
  {
    id: 1,
    rank: 1,
    name: "AI Studio Pro",
    tagline: "Create stunning AI-powered content in minutes",
    logo: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=64&h=64&fit=crop",
    upvotes: 847,
    comments: 89,
    tags: ["AI", "Productivity", "Design"],
    featured: true
  },
  {
    id: 2,
    rank: 2,
    name: "DevFlow",
    tagline: "Streamline your development workflow with smart automation",
    logo: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=64&h=64&fit=crop",
    upvotes: 623,
    comments: 67,
    tags: ["Developer Tools", "Productivity"]
  },
  {
    id: 3,
    rank: 3,
    name: "DataViz Studio",
    tagline: "Transform your data into beautiful, interactive visualizations",
    logo: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=64&h=64&fit=crop",
    upvotes: 451,
    comments: 34,
    tags: ["Analytics", "Data Science", "Business"]
  },
  {
    id: 4,
    rank: 4,
    name: "CloudSync",
    tagline: "Seamlessly sync your files across all devices and platforms",
    logo: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=64&h=64&fit=crop",
    upvotes: 389,
    comments: 28,
    tags: ["Cloud Storage", "Productivity"]
  },
  {
    id: 5,
    rank: 5,
    name: "MindMapper",
    tagline: "Visualize your thoughts and ideas with intelligent mind mapping",
    logo: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=64&h=64&fit=crop",
    upvotes: 267,
    comments: 19,
    tags: ["Productivity", "Education", "Mind Mapping"]
  }
];

const ProductLeaderboard = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200 bg-gray-50 px-4 lg:px-6 py-4">
          <h2 className="text-lg lg:text-xl font-semibold text-gray-900">🚀 Top Products Launching Today</h2>
          <p className="text-sm text-gray-600 mt-1">The most exciting launches of the day</p>
        </div>
        
        <div className="divide-y divide-gray-100">
          {mockProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductLeaderboard;
