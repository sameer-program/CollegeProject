"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface KnowledgeResource {
  _id: string;
  resource_id: string;
  heading: string;
  approval_state: string;
  access_count: number;
  user_rating: number;
  createdAt: string;
}

export default function ConsultantDashboard() {
  const { data: session } = useSession();
  const [resources, setResources] = useState<KnowledgeResource[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyKnowledge();
  }, []);

  const fetchMyKnowledge = async () => {
    try {
      const userId = (session?.user as any)?.id;
      const response = await fetch(`/api/knowledge?created_by=${userId}`);
      const data = await response.json();

      if (data.resources) {
        setResources(data.resources);

        const stats = {
          total: data.resources.length,
          pending: data.resources.filter(
            (r: any) => r.approval_state === "Pending"
          ).length,
          approved: data.resources.filter(
            (r: any) => r.approval_state === "Approved"
          ).length,
          rejected: data.resources.filter(
            (r: any) => r.approval_state === "Rejected"
          ).length,
        };
        setStats(stats);
      }
    } catch (error) {
      console.error("Error fetching knowledge:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">
          Consultant Dashboard
        </h1>
        <Link
          href="/knowledge/create"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Create New Knowledge
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">
            Total Submissions
          </h3>
          <p className="text-2xl font-bold text-gray-900 mt-2">{stats.total}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Pending</h3>
          <p className="text-2xl font-bold text-yellow-600 mt-2">
            {stats.pending}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Approved</h3>
          <p className="text-2xl font-bold text-green-600 mt-2">
            {stats.approved}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Rejected</h3>
          <p className="text-2xl font-bold text-red-600 mt-2">
            {stats.rejected}
          </p>
        </div>
      </div>

      {/* My Submitted Knowledge */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            My Submitted Knowledge
          </h2>
        </div>
        <div className="p-6">
          {resources.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No knowledge resources submitted yet. Create your first one!
            </p>
          ) : (
            <div className="space-y-4">
              {resources.map((resource) => (
                <div
                  key={resource._id}
                  className="border rounded-lg p-4 hover:bg-gray-50"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <Link
                        href={`/knowledge/${resource._id}`}
                        className="text-lg font-semibold text-indigo-600 hover:underline"
                      >
                        {resource.heading}
                      </Link>
                      <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                        <span
                          className={`px-2 py-1 rounded ${
                            resource.approval_state === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : resource.approval_state === "Approved"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {resource.approval_state}
                        </span>
                        <span>Views: {resource.access_count}</span>
                        <span>Rating: {resource.user_rating}/5</span>
                        <span>
                          {new Date(resource.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Most Viewed Content */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Most Viewed Content
          </h2>
        </div>
        <div className="p-6">
          {resources.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No content available
            </p>
          ) : (
            <div className="space-y-2">
              {[...resources]
                .sort((a, b) => b.access_count - a.access_count)
                .slice(0, 5)
                .map((resource) => (
                  <div
                    key={resource._id}
                    className="flex justify-between items-center p-3 border rounded"
                  >
                    <Link
                      href={`/knowledge/${resource._id}`}
                      className="text-indigo-600 hover:underline"
                    >
                      {resource.heading}
                    </Link>
                    <span className="text-sm text-gray-500">
                      {resource.access_count} views
                    </span>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
