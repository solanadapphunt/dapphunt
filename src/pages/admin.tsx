import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock, ExternalLink } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface Submission {
  id: string;
  projectName: string;
  oneLiner: string;
  category: string;
  description: string;
  liveUrl: string;
  twitter: string;
  status: 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  submittedBy: {
    id: string;
    name?: string;
    email: string;
  };
}

export default function Admin() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/submissions');
      
      if (!response.ok) {
        throw new Error('Failed to fetch submissions');
      }
      
      const data = await response.json();
      setSubmissions(data.submissions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching submissions:', err);
    } finally {
      setLoading(false);
    }
  };

  const approveSubmission = async (submissionId: string) => {
    try {
      const response = await fetch(`/api/submissions/${submissionId}/approve`, {
        method: 'POST',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to approve submission');
      }

      const result = await response.json();
      
      toast({
        title: "Submission Approved!",
        description: `${result.project.name} is now live on the platform.`,
      });

      // Refresh submissions
      fetchSubmissions();
    } catch (error) {
      console.error('Approval error:', error);
      toast({
        title: "Approval Failed",
        description: error instanceof Error ? error.message : "Something went wrong.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const getStatusBadge = (status: string) => {
    const variants = {
      PENDING: 'default',
      UNDER_REVIEW: 'secondary',
      APPROVED: 'default',
      REJECTED: 'destructive',
    } as const;

    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      UNDER_REVIEW: 'bg-blue-100 text-blue-800',
      APPROVED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800',
    } as const;

    return (
      <Badge className={colors[status as keyof typeof colors]}>
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'APPROVED':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'REJECTED':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🔧 Admin Panel
          </h1>
          <p className="text-gray-600">
            Review and approve project submissions
          </p>
        </div>

        {/* Submissions List */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="text-gray-600 mt-2">Loading submissions...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <p className="text-red-600">Error: {error}</p>
              <Button 
                onClick={fetchSubmissions}
                className="mt-2"
                variant="outline"
              >
                Try again
              </Button>
            </div>
          ) : submissions.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {submissions.map((submission) => (
                <div key={submission.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        {getStatusIcon(submission.status)}
                        <h3 className="text-lg font-semibold text-gray-900">
                          {submission.projectName}
                        </h3>
                        {getStatusBadge(submission.status)}
                      </div>
                      
                      <p className="text-gray-600 mb-2">{submission.oneLiner}</p>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                        <span>Category: {submission.category}</span>
                        <span>•</span>
                        <span>Submitted by: {submission.submittedBy.name || submission.submittedBy.email}</span>
                        <span>•</span>
                        <span>{new Date(submission.createdAt).toLocaleDateString()}</span>
                      </div>
                      
                      <p className="text-gray-700 text-sm mb-4">
                        {submission.description.substring(0, 200)}...
                      </p>
                      
                      <div className="flex items-center space-x-4">
                        <a 
                          href={submission.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm"
                        >
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Live Demo
                        </a>
                        {submission.twitter && (
                          <a 
                            href={`https://twitter.com/${submission.twitter.replace('@', '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            @{submission.twitter.replace('@', '')}
                          </a>
                        )}
                      </div>
                    </div>
                    
                    <div className="ml-6 flex space-x-2">
                      {submission.status === 'PENDING' && (
                        <>
                          <Button
                            onClick={() => approveSubmission(submission.id)}
                            className="bg-green-600 hover:bg-green-700"
                            size="sm"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 border-red-300 hover:bg-red-50"
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-gray-600">No submissions found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 