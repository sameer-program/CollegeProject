'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface KnowledgeResource {
  _id: string;
  heading: string;
  data_body: string;
  classification: string;
  keywords: string[];
}

export default function EditKnowledgePage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    heading: '',
    data_body: '',
    classification: '',
    keywords: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (params.id) {
      fetchResource();
    }
  }, [params.id]);

  const fetchResource = async () => {
    try {
      const response = await fetch(`/api/knowledge/${params.id}`);
      const data = await response.json();
      
      setFormData({
        heading: data.heading,
        data_body: data.data_body,
        classification: data.classification,
        keywords: data.keywords?.join(', ') || '',
      });
    } catch (error) {
      console.error('Error fetching resource:', error);
      setError('Failed to load resource');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const keywordsArray = formData.keywords
        .split(',')
        .map((k) => k.trim())
        .filter((k) => k.length > 0);

      const response = await fetch(`/api/knowledge/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          heading: formData.heading,
          data_body: formData.data_body,
          classification: formData.classification,
          keywords: keywordsArray,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update knowledge resource');
      }

      router.push(`/knowledge/${params.id}`);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Knowledge Resource</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="heading" className="block text-sm font-medium text-gray-700 mb-2">
            Heading *
          </label>
          <input
            type="text"
            id="heading"
            name="heading"
            required
            value={formData.heading}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="classification" className="block text-sm font-medium text-gray-700 mb-2">
            Classification *
          </label>
          <input
            type="text"
            id="classification"
            name="classification"
            required
            value={formData.classification}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="data_body" className="block text-sm font-medium text-gray-700 mb-2">
            Content *
          </label>
          <textarea
            id="data_body"
            name="data_body"
            required
            rows={10}
            value={formData.data_body}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="keywords" className="block text-sm font-medium text-gray-700 mb-2">
            Keywords (comma-separated)
          </label>
          <input
            type="text"
            id="keywords"
            name="keywords"
            value={formData.keywords}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="keyword1, keyword2, keyword3"
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}

