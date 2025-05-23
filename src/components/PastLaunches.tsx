
import PastLaunchSection from "./PastLaunchSection";

const yesterdayProducts = [
  {
    id: 1,
    name: "Vectorize",
    tagline: "AI-powered vector graphics creation platform",
    logo: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=48&h=48&fit=crop",
    upvotes: 1247,
    tags: ["AI", "Design", "Graphics"]
  },
  {
    id: 2,
    name: "FlowState",
    tagline: "Focus timer with ambient sounds and productivity tracking",
    logo: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=48&h=48&fit=crop",
    upvotes: 892,
    tags: ["Productivity", "Focus"]
  },
  {
    id: 3,
    name: "CodeSnap",
    tagline: "Beautiful code screenshots with syntax highlighting",
    logo: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=48&h=48&fit=crop",
    upvotes: 734,
    tags: ["Developer Tools", "Design"]
  }
];

const lastWeekProducts = [
  {
    id: 4,
    name: "TeamSync",
    tagline: "Real-time collaboration for distributed teams",
    logo: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=48&h=48&fit=crop",
    upvotes: 2156,
    tags: ["Collaboration", "Remote Work"]
  },
  {
    id: 5,
    name: "DataPipe",
    tagline: "No-code data pipeline builder for modern teams",
    logo: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=48&h=48&fit=crop",
    upvotes: 1823,
    tags: ["Data", "No-Code", "Analytics"]
  }
];

const lastMonthProducts = [
  {
    id: 6,
    name: "MindFlow",
    tagline: "AI-powered brainstorming and idea generation tool",
    logo: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=48&h=48&fit=crop",
    upvotes: 3421,
    tags: ["AI", "Creativity", "Brainstorming"]
  },
  {
    id: 7,
    name: "SecureVault",
    tagline: "End-to-end encrypted password manager with biometric auth",
    logo: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=48&h=48&fit=crop",
    upvotes: 2987,
    tags: ["Security", "Privacy"]
  }
];

const PastLaunches = () => {
  return (
    <div className="space-y-6 mt-8">
      <PastLaunchSection 
        title="Yesterday's Top Products" 
        products={yesterdayProducts} 
      />
      <PastLaunchSection 
        title="Last Week's Top Products" 
        products={lastWeekProducts} 
      />
      <PastLaunchSection 
        title="Last Month's Top Products" 
        products={lastMonthProducts} 
      />
    </div>
  );
};

export default PastLaunches;
