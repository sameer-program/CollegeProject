'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface KnowledgeResource {
  _id: string;
  resource_id: string;
  heading: string;
  data_body: string;
  approval_state: string;
  classification: string;
  user_rating: number;
  access_count: number;
  keywords: string[];
  created_by: {
    full_name: string;
    email: string;
  };
  createdAt: string;
}

export default function KnowledgeListPage() {
  const { data: session } = useSession();
  const [resources, setResources] = useState<KnowledgeResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    keyword: '',
    classification: '',
    approval_state: '',
  });

  useEffect(() => {
    fetchKnowledge();
  }, [filters]);

  const fetchKnowledge = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.keyword) params.append('keyword', filters.keyword);
      if (filters.classification) params.append('classification', filters.classification);
      if (filters.approval_state) params.append('approval_state', filters.approval_state);

      const response = await fetch(`/api/knowledge?${params.toString()}`);
      const data = await response.json();
      setResources(data.resources || []);
    } catch (error) {
      console.error('Error fetching knowledge:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Knowledge Resources</h1>
        <Link
          href="/knowledge/create"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Create New
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Keyword
            </label>
            <input
              type="text"
              value={filters.keyword}
              onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Search keywords..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Classification
            </label>
            <input
              type="text"
              value={filters.classification}
              onChange={(e) => setFilters({ ...filters, classification: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Filter by classification..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Approval State
            </label>
            <select
              value={filters.approval_state}
              onChange={(e) => setFilters({ ...filters, approval_state: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">All</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Authorized">Authorized</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Knowledge List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          {resources.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No knowledge resources found</p>
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
                  <p className="text-gray-600 mt-2 line-clamp-2">{resource.data_body}</p>
                  <div className="mt-3 flex items-center space-x-4 text-sm text-gray-500">
                    <span
                      className={`px-2 py-1 rounded ${
                        resource.approval_state === 'Pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : resource.approval_state === 'Approved'
                          ? 'bg-green-100 text-green-800'
                          : resource.approval_state === 'Authorized'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {resource.approval_state}
                    </span>
                    <span>Classification: {resource.classification}</span>
                    <span>Views: {resource.access_count}</span>
                    <span>Rating: {resource.user_rating}/5</span>
                    {resource.keywords && resource.keywords.length > 0 && (
                      <span>Keywords: {resource.keywords.join(', ')}</span>
                    )}
                    <span>By: {resource.created_by?.full_name}</span>
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

