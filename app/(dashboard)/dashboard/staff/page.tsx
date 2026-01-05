'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface KnowledgeResource {
  _id: string;
  heading: string;
  approval_state: string;
  classification: string;
  access_count: number;
}

export default function StaffDashboard() {
  const { data: session } = useSession();
  const [resources, setResources] = useState<KnowledgeResource[]>([]);
  const [trainingPhase, setTrainingPhase] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch available knowledge (authorized only)
      const response = await fetch('/api/knowledge?approval_state=Authorized&limit=20');
      const data = await response.json();
      setResources(data.resources || []);

      // Fetch user training phase
      const userRes = await fetch('/api/users/me');
      const userData = await userRes.json();
      setTrainingPhase(userData.user?.training_phase || 'Not set');
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Staff Dashboard</h1>

      {/* Training Phase */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-2">Training Phase</h2>
        <p className="text-lg text-indigo-600">{trainingPhase}</p>
      </div>

      {/* Available Knowledge Resources */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Available Knowledge Resources</h2>
        </div>
        <div className="p-6">
          {resources.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No authorized knowledge resources available
            </p>
          ) : (
            <div className="space-y-4">
              {resources.map((resource) => (
                <div
                  key={resource._id}
                  className="border rounded-lg p-4 hover:bg-gray-50"
                >
                  <Link
                    href={`/knowledge/${resource._id}`}
                    className="text-lg font-semibold text-indigo-600 hover:underline"
                  >
                    {resource.heading}
                  </Link>
                  <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                    <span>Classification: {resource.classification}</span>
                    <span>Views: {resource.access_count}</span>
                    <span
                      className={`px-2 py-1 rounded ${
                        resource.approval_state === 'Authorized'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {resource.approval_state}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

