'use client';

import Header from "@/components/Header";
import ProductLeaderboard from "@/components/ProductLeaderboard";
import ForumThreads from "@/components/ForumThreads";
import PastLaunches from "@/components/PastLaunches";

export default function DappHuntPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 lg:px-6 py-4 lg:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
          {/* Left Column - 75% width */}
          <div className="lg:col-span-3">
            <ProductLeaderboard />
            <PastLaunches />
          </div>
          
          {/* Right Column - 25% width */}
          <div className="lg:col-span-1">
            <ForumThreads />
          </div>
        </div>
      </main>
    </div>
  );
} 