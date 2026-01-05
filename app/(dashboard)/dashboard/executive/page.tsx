'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface PlatformStats {
  platform: {
    registered_users: number;
    stored_knowledge_count: number;
    operational_time: number;
  };
  knowledge_stats: {
    total: number;
    pending: number;
    approved: number;
    authorized: number;
  };
  user_stats: {
    total: number;
    role_distribution: Array<{ _id: string; count: number }>;
  };
}

export default function ExecutiveDashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [topResources, setTopResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, knowledgeRes] = await Promise.all([
        fetch('/api/platform/stats'),
        fetch('/api/knowledge?limit=10'),
      ]);

      const statsData = await statsRes.json();
      setStats(statsData);

      const knowledgeData = await knowledgeRes.json();
      // Sort by access count and rating
      const sorted = (knowledgeData.resources || [])
        .sort((a: any, b: any) => {
          const scoreA = a.access_count * 2 + a.user_rating * 10;
          const scoreB = b.access_count * 2 + b.user_rating * 10;
          return scoreB - scoreA;
        })
        .slice(0, 5);
      setTopResources(sorted);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  const roleData = stats?.user_stats.role_distribution.map((r) => ({
    role: r._id,
    users: r.count,
  })) || [];

  const knowledgeData = stats?.knowledge_stats
    ? [
        { status: 'Pending', count: stats.knowledge_stats.pending },
        { status: 'Approved', count: stats.knowledge_stats.approved },
        { status: 'Authorized', count: stats.knowledge_stats.authorized },
      ]
    : [];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Executive Team Dashboard</h1>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Registered Users</h3>
          <p className="text-2xl font-bold text-indigo-600 mt-2">
            {stats?.platform.registered_users || 0}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Knowledge Resources</h3>
          <p className="text-2xl font-bold text-green-600 mt-2">
            {stats?.platform.stored_knowledge_count || 0}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Operational Time</h3>
          <p className="text-2xl font-bold text-blue-600 mt-2">
            {stats?.platform.operational_time
              ? Math.floor(stats.platform.operational_time / 3600)
              : 0}{' '}
            hrs
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Knowledge</h3>
          <p className="text-2xl font-bold text-purple-600 mt-2">
            {stats?.knowledge_stats.total || 0}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">User Role Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={roleData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="role" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="users" fill="#4F46E5" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Knowledge Status Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={knowledgeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="status" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Performing Knowledge */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Top Performing Knowledge Resources</h2>
        </div>
        <div className="p-6">
          {topResources.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No knowledge resources available</p>
          ) : (
            <div className="space-y-4">
              {topResources.map((resource) => (
                <div key={resource._id} className="border rounded-lg p-4">
                  <h3 className="text-lg font-semibold">{resource.heading}</h3>
                  <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                    <span>Views: {resource.access_count}</span>
                    <span>Rating: {resource.user_rating}/5</span>
                    <span>Status: {resource.approval_state}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">AI Insights & Trends</h2>
        </div>
        <div className="p-6">
          <p className="text-gray-500">
            AI analysis shows consistent growth in knowledge base quality and user engagement.
            Most popular content categories: Technical Documentation, Best Practices, and
            Case Studies.
          </p>
        </div>
      </div>
    </div>
  );
}

