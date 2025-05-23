'use client';

import Header from "@/components/Header";
import Leaderboard from "@/pages/Leaderboard";

interface LeaderboardParamsPageProps {
  params: {
    params?: string[];
  };
}

export default function LeaderboardParamsPage({ params }: LeaderboardParamsPageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Leaderboard />
    </div>
  );
} 