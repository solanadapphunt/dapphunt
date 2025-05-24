import React, { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import Header from '../components/Header';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Calendar, ExternalLink, Edit } from 'lucide-react';

interface UserSubmission {
  id: string;
  projectName: string;
  oneLiner: string;
  status: string;
  createdAt: string;
  liveUrl: string;
}

export default function Profile() {
  const { data: session, status } = useSession();
  const [submissions, setSubmissions] = useState<UserSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user) {
      // In a real app, you'd fetch user's submissions here
      // For now, we'll show a placeholder
      setLoading(false);
    }
  }, [session]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto py-20 px-4 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="text-gray-600 mt-2">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto py-20 px-4 text-center">
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
            <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Sign in to view your profile
            </h1>
            <p className="text-gray-600 mb-6">
              Access your submissions, voting history, and account settings.
            </p>
            <Button 
              onClick={() => signIn()}
              className="bg-[#FF6154] hover:bg-[#E55347]"
            >
              Sign In
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Profile Header */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-start space-x-6">
            <img 
              src={session.user.image || `https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=96&h=96&fit=crop&crop=face`}
              alt="Profile"
              className="w-24 h-24 rounded-full"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-2xl font-bold text-gray-900">
                  {session.user.name}
                </h1>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  @{session.user.username || 'user'}
                </div>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  {session.user.email}
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Member since {new Date().toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Submissions</h3>
            <p className="text-3xl font-bold text-[#FF6154]">0</p>
            <p className="text-sm text-gray-600">Projects submitted</p>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Votes Cast</h3>
            <p className="text-3xl font-bold text-green-600">0</p>
            <p className="text-sm text-gray-600">Total votes given</p>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Reputation</h3>
            <p className="text-3xl font-bold text-blue-600">100</p>
            <p className="text-sm text-gray-600">Community score</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-900">Your Submissions</h2>
            <p className="text-sm text-gray-600 mt-1">Projects you've submitted to DappHunt</p>
          </div>
          
          <div className="p-6">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                <p className="text-gray-600 mt-2">Loading submissions...</p>
              </div>
            ) : submissions.length > 0 ? (
              <div className="space-y-4">
                {submissions.map((submission) => (
                  <div key={submission.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{submission.projectName}</h3>
                        <p className="text-gray-600 text-sm mt-1">{submission.oneLiner}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <Badge variant="secondary">{submission.status}</Badge>
                          <span className="text-xs text-gray-500">
                            Submitted {new Date(submission.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <a 
                        href={submission.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No submissions yet</h3>
                <p className="text-gray-600 mb-4">
                  You haven't submitted any projects to DappHunt yet.
                </p>
                <Button asChild className="bg-[#FF6154] hover:bg-[#E55347]">
                  <a href="/submit">Submit Your First Project</a>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 