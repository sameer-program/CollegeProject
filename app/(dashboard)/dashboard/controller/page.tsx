"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

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
    rejected: number;
  };
  user_stats: {
    total: number;
    role_distribution: Array<{ _id: string; count: number }>;
  };
  knowledge_by_classification: Array<{ _id: string; count: number }>;
}

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

export default function ControllerDashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [knowledgeResources, setKnowledgeResources] = useState<any[]>([]);
  const [aiModules, setAiModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError("");

      const [statsRes, usersRes, knowledgeRes, aiModulesRes] = await Promise.all([
        fetch("/api/platform/stats"),
        fetch("/api/users"),
        fetch("/api/knowledge?limit=50"),
        fetch("/api/ai/modules"),
      ]);

      if (!statsRes.ok || !usersRes.ok || !knowledgeRes.ok || !aiModulesRes.ok) {
        throw new Error("Failed to fetch data");
      }

      const statsData = await statsRes.json();
      const usersData = await usersRes.json();
      const knowledgeData = await knowledgeRes.json();
      const aiModulesData = await aiModulesRes.json();

      setStats(statsData);
      setUsers(usersData.users || []);
      setKnowledgeResources(knowledgeData.resources || []);
      setAiModules(aiModulesData.modules || []);
    } catch (err: any) {
      console.error("Error fetching data:", err);
      setError(err.message || "An error occurred while fetching data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">System Controller Dashboard</h1>
        <div className="flex justify-center items-center py-12">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  const roleData =
    stats?.user_stats.role_distribution.map((r) => ({
      role: r._id,
      users: r.count,
    })) || [];

  const knowledgeStatusData = stats?.knowledge_stats
    ? [
        { status: "Pending", count: stats.knowledge_stats.pending },
        { status: "Approved", count: stats.knowledge_stats.approved },
        { status: "Authorized", count: stats.knowledge_stats.authorized },
        { status: "Rejected", count: stats.knowledge_stats.rejected },
      ]
    : [];

  const classificationData = stats?.knowledge_by_classification || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">System Controller Dashboard</h1>
        <button
          onClick={fetchAllData}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Refresh All Data
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

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
              : 0}{" "}
            hrs
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">AI Modules</h3>
          <p className="text-2xl font-bold text-purple-600 mt-2">
            {aiModules.length}
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User Role Distribution */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">
            User Role Distribution
          </h2>
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

        {/* Knowledge Status Distribution */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">
            Knowledge Status Distribution
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={knowledgeStatusData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="status" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Knowledge by Classification */}
        {classificationData.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">
              Knowledge by Classification
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={classificationData}
                  dataKey="count"
                  nameKey="_id"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {classificationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Role Distribution Pie Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">
            User Roles (Pie Chart)
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={roleData}
                dataKey="users"
                nameKey="role"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {roleData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* All Users Section */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">All Users</h2>
          <Link
            href="/dashboard/controller/users"
            className="text-sm text-indigo-600 hover:text-indigo-500"
          >
            Manage Users →
          </Link>
        </div>
        <div className="p-6 overflow-x-auto">
          {users.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No users found</p>
          ) : (
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Created
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.slice(0, 10).map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {user.unique_user_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.full_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.division || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {users.length > 10 && (
            <div className="mt-4 text-center">
              <Link
                href="/dashboard/controller/users"
                className="text-sm text-indigo-600 hover:text-indigo-500"
              >
                View all {users.length} users →
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* All Knowledge Resources Section */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">All Knowledge Resources</h2>
          <Link
            href="/knowledge"
            className="text-sm text-indigo-600 hover:text-indigo-500"
          >
            View All →
          </Link>
        </div>
        <div className="p-6 overflow-x-auto">
          {knowledgeResources.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No knowledge resources found</p>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Resource ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Heading
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Classification
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Views
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Created By
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {knowledgeResources.slice(0, 10).map((resource) => (
                  <tr key={resource._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {resource.resource_id}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                      {resource.heading}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          resource.approval_state === "Authorized"
                            ? "bg-green-100 text-green-800"
                            : resource.approval_state === "Approved"
                            ? "bg-blue-100 text-blue-800"
                            : resource.approval_state === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {resource.approval_state}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {resource.classification}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {resource.user_rating}/5
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {resource.access_count}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {resource.created_by?.full_name || "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {knowledgeResources.length > 10 && (
            <div className="mt-4 text-center">
              <Link
                href="/knowledge"
                className="text-sm text-indigo-600 hover:text-indigo-500"
              >
                View all {knowledgeResources.length} resources →
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* AI Modules Section */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">AI Module Status</h2>
        </div>
        <div className="p-6">
          {aiModules.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No AI modules configured</p>
          ) : (
            <div className="space-y-4">
              {aiModules.map((module) => (
                <div
                  key={module._id}
                  className="border rounded-lg p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {module.module_id}
                        </h3>
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          Active
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                          <p className="text-sm text-gray-500">Algorithm Type</p>
                          <p className="text-sm font-medium text-gray-900">
                            {module.algorithm_type}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Performance Index</p>
                          <p className="text-sm font-medium text-gray-900">
                            {module.performance_index}
                          </p>
                        </div>
                      </div>
                      {module.performance && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                          <h4 className="text-sm font-semibold text-gray-900 mb-3">
                            Performance Metrics
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <p className="text-sm text-gray-500">Total Analyses</p>
                              <p className="text-lg font-semibold text-gray-900">
                                {module.performance.total_analyses || 0}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Average Score</p>
                              <p className="text-lg font-semibold text-gray-900">
                                {module.performance.average_score
                                  ? module.performance.average_score.toFixed(2)
                                  : "N/A"}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Accuracy</p>
                              <p className="text-lg font-semibold text-gray-900">
                                {module.performance.accuracy
                                  ? `${module.performance.accuracy.toFixed(1)}%`
                                  : "N/A"}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
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

