import React, { useState } from 'react';
import { CheckCircle2, Clock, XCircle } from 'lucide-react';

type ApplicationStatus = 'pending' | 'reviewing' | 'approved' | 'rejected';

interface ApplicationDetails {
  id: string;
  status: ApplicationStatus;
  submittedAt: string;
  lastUpdated: string;
  feedback?: string;
}

export function Status() {
  const [applicationId, setApplicationId] = useState('');
  const [application, setApplication] = useState<ApplicationDetails | null>(null);

  // Mock function to simulate checking application status
  const checkStatus = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    setApplication({
      id: applicationId,
      status: 'reviewing',
      submittedAt: '2025-03-15T10:30:00Z',
      lastUpdated: '2025-03-16T14:20:00Z',
      feedback: 'Your application is currently being reviewed by our AI consensus system.'
    });
  };

  const getStatusColor = (status: ApplicationStatus) => {
    switch (status) {
      case 'approved':
        return 'text-green-500';
      case 'rejected':
        return 'text-red-500';
      default:
        return 'text-blue-500';
    }
  };

  const getStatusIcon = (status: ApplicationStatus) => {
    switch (status) {
      case 'approved':
        return <CheckCircle2 className="h-8 w-8 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-8 w-8 text-red-500" />;
      default:
        return <Clock className="h-8 w-8 text-blue-500" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Check Application Status</h1>

        <form onSubmit={checkStatus} className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="mb-6">
            <label htmlFor="applicationId" className="block text-sm font-medium text-gray-700 mb-2">
              Application ID
            </label>
            <input
              type="text"
              id="applicationId"
              value={applicationId}
              onChange={(e) => setApplicationId(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your application ID"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 transition-colors"
            >
              Check Status
            </button>
          </div>
        </form>

        {application && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Application Details</h2>
              {getStatusIcon(application.status)}
            </div>

            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-500">Application ID</div>
                <div className="font-medium">{application.id}</div>
              </div>

              <div>
                <div className="text-sm text-gray-500">Status</div>
                <div className={`font-medium ${getStatusColor(application.status)} capitalize`}>
                  {application.status}
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-500">Submitted At</div>
                <div className="font-medium">
                  {new Date(application.submittedAt).toLocaleDateString()}
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-500">Last Updated</div>
                <div className="font-medium">
                  {new Date(application.lastUpdated).toLocaleDateString()}
                </div>
              </div>

              {application.feedback && (
                <div>
                  <div className="text-sm text-gray-500">Feedback</div>
                  <div className="mt-1 p-3 bg-gray-50 rounded-lg text-gray-700">
                    {application.feedback}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}