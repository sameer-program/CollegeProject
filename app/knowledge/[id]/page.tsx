'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface KnowledgeResource {
  _id: string;
  resource_id: string;
  heading: string;
  data_body: string;
  approval_state: string;
  classification: string;
  revision_number: number;
  user_rating: number;
  access_count: number;
  keywords: string[];
  created_by: {
    _id: string;
    full_name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default function KnowledgeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [resource, setResource] = useState<KnowledgeResource | null>(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);

  useEffect(() => {
    if (params.id) {
      fetchResource();
    }
  }, [params.id]);

  const fetchResource = async () => {
    try {
      const response = await fetch(`/api/knowledge/${params.id}`);
      const data = await response.json();
      setResource(data);
      setRating(data.user_rating || 0);
    } catch (error) {
      console.error('Error fetching resource:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRating = async () => {
    try {
      const response = await fetch(`/api/knowledge/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_rating: rating }),
      });
      if (response.ok) {
        fetchResource();
      }
    } catch (error) {
      console.error('Error updating rating:', error);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this resource?')) return;

    try {
      const response = await fetch(`/api/knowledge/${params.id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        router.push('/knowledge');
      }
    } catch (error) {
      console.error('Error deleting resource:', error);
    }
  };

  const canEdit =
    resource &&
    session &&
    ((resource.created_by._id === (session.user as any).id) ||
      (session.user as any).role === 'controller');

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!resource) {
    return <div className="text-center py-8">Resource not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <Link
            href="/knowledge"
            className="text-indigo-600 hover:underline mb-4 inline-block"
          >
            ← Back to Knowledge List
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">{resource.heading}</h1>
        </div>
        {canEdit && (
          <div className="flex space-x-2">
            <Link
              href={`/knowledge/${params.id}/edit`}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Edit
            </Link>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-4 mb-4 text-sm text-gray-500">
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
          <span>Revision: {resource.revision_number}</span>
          <span>Views: {resource.access_count}</span>
          <span>Created: {new Date(resource.createdAt).toLocaleDateString()}</span>
        </div>

        {resource.keywords && resource.keywords.length > 0 && (
          <div className="mb-4">
            <span className="text-sm font-medium text-gray-700">Keywords: </span>
            {resource.keywords.map((keyword, index) => (
              <span
                key={index}
                className="inline-block px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm mr-2"
              >
                {keyword}
              </span>
            ))}
          </div>
        )}

        <div className="prose max-w-none">
          <p className="text-gray-700 whitespace-pre-wrap">{resource.data_body}</p>
        </div>

        <div className="mt-6 pt-6 border-t">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Created by</p>
              <p className="font-medium">{resource.created_by.full_name}</p>
              <p className="text-sm text-gray-500">{resource.created_by.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min="0"
                  max="5"
                  value={rating}
                  onChange={(e) => setRating(parseFloat(e.target.value))}
                  className="w-20 px-3 py-2 border border-gray-300 rounded-md"
                />
                <span className="text-gray-500">/ 5</span>
                <button
                  onClick={handleUpdateRating}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

