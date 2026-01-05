'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

interface KnowledgeResource {
  _id: string;
  heading: string;
  approval_state: string;
  classification: string;
  created_by: {
    full_name: string;
  };
  createdAt: string;
}

export default function GovernanceDashboard() {
  const { data: session } = useSession();
  const [approvedResources, setApprovedResources] = useState<KnowledgeResource[]>([]);
  const [complianceScore, setComplianceScore] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch approved but not authorized resources
      const response = await fetch('/api/knowledge?approval_state=Approved');
      const data = await response.json();
      setApprovedResources(data.resources || []);

      // Fetch user compliance score
      const userRes = await fetch('/api/users/me');
      const userData = await userRes.json();
      setComplianceScore(userData.user?.compliance_score || 0);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAuthorize = async (resourceId: string) => {
    try {
      const response = await fetch(`/api/knowledge/${resourceId}/authorize`, {
        method: 'POST',
      });
      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Error authorizing resource:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-gray-900">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Governance Board Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Pending Authorization</h3>
          <p className="text-2xl font-bold text-yellow-600 mt-2">
            {approvedResources.length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Compliance Score</h3>
          <p className="text-2xl font-bold text-indigo-600 mt-2">{complianceScore}%</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Inspection Status</h3>
          <p className="text-sm text-gray-700 mt-2">Up to date</p>
        </div>
      </div>

      {/* Approved but Not Authorized Content */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Approved Content Pending Authorization</h2>
        </div>
        <div className="p-6">
          {approvedResources.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No content pending authorization
            </p>
          ) : (
            <div className="space-y-4">
              {approvedResources.map((resource) => (
                <div key={resource._id} className="border rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900">{resource.heading}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    By: {resource.created_by?.full_name} | Classification:{' '}
                    {resource.classification}
                  </p>
                  <p className="text-sm text-gray-500">
                    Submitted: {new Date(resource.createdAt).toLocaleDateString()}
                  </p>
                  <div className="mt-4">
                    <button
                      onClick={() => handleAuthorize(resource._id)}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    >
                      Authorize
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Policy Violation Alerts */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Policy Violation Alerts</h2>
        </div>
        <div className="p-6">
          <p className="text-gray-500 text-center py-8">No policy violations detected</p>
        </div>
      </div>
    </div>
  );
}

