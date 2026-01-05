'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

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
  };
}

export default function ControllerDashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [aiModules, setAiModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, usersRes, aiRes] = await Promise.all([
        fetch('/api/platform/stats'),
        fetch('/api/users'),
        fetch('/api/ai/modules'),
      ]);

      const statsData = await statsRes.json();
      setStats(statsData);

      const usersData = await usersRes.json();
      setUsers(usersData.users || []);

      const aiData = await aiRes.json();
      setAiModules(aiData.modules || []);
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
      <h1 className="text-3xl font-bold text-gray-900">System Controller Dashboard</h1>

      {/* Platform Health Metrics */}
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
          <h3 className="text-sm font-medium text-gray-500">Pending Approvals</h3>
          <p className="text-2xl font-bold text-yellow-600 mt-2">
            {stats?.knowledge_stats.pending || 0}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">System Status</h3>
          <p className="text-sm text-green-600 mt-2 font-semibold">Operational</p>
        </div>
      </div>

      {/* User Management */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">User Management</h2>
        </div>
        <div className="p-6 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  User ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Division
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.unique_user_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.full_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.division}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Module Status */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">AI Module Status</h2>
        </div>
        <div className="p-6">
          {aiModules.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No AI modules configured</p>
          ) : (
            <div className="space-y-4">
              {aiModules.map((module) => (
                <div key={module._id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">{module.module_id}</h3>
                      <p className="text-sm text-gray-500">
                        Algorithm: {module.algorithm_type}
                      </p>
                      <p className="text-sm text-gray-500">
                        Performance Index: {module.performance_index}
                      </p>
                      {module.performance && (
                        <div className="mt-2 text-sm">
                          <p>Total Analyses: {module.performance.total_analyses}</p>
                          <p>Average Score: {module.performance.average_score}</p>
                          <p>Accuracy: {module.performance.accuracy}%</p>
                        </div>
                      )}
                    </div>
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      Active
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* System Logs & Security Alerts */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">System Logs & Security Alerts</h2>
        </div>
        <div className="p-6">
          <p className="text-gray-500 text-center py-8">No security alerts at this time</p>
        </div>
      </div>
    </div>
  );
}

