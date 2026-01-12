"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface KnowledgeResource {
  _id: string;
  resource_id: string;
  heading: string;
  data_body: string;
  approval_state: string;
  classification: string;
  created_by: {
    full_name: string;
    email: string;
  };
  createdAt: string;
}

export default function ValidatorDashboard() {
  const { data: session } = useSession();
  const [pendingResources, setPendingResources] = useState<KnowledgeResource[]>(
    []
  );
  const [history, setHistory] = useState<KnowledgeResource[]>([]);
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    avgTime: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch pending resources
      const pendingRes = await fetch("/api/knowledge?approval_state=Pending");
      const pendingData = await pendingRes.json();
      setPendingResources(pendingData.resources || []);

      // Fetch approved/rejected resources
      const approvedRes = await fetch("/api/knowledge?approval_state=Approved");
      const rejectedRes = await fetch("/api/knowledge?approval_state=Rejected");
      const approvedData = await approvedRes.json();
      const rejectedData = await rejectedRes.json();

      const allHistory = [
        ...(approvedData.resources || []),
        ...(rejectedData.resources || []),
      ];
      setHistory(allHistory.slice(0, 10));

      // Calculate stats
      const validator = await fetch("/api/users/me").then((r) => r.json());
      setStats({
        pending: pendingData.resources?.length || 0,
        approved: validator.user?.approved_submissions || 0,
        rejected: 0,
        avgTime: 0, // Would calculate from timestamps in production
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (resourceId: string) => {
    try {
      const response = await fetch(`/api/knowledge/${resourceId}/approve`, {
        method: "POST",
      });
      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error("Error approving resource:", error);
    }
  };

  const handleReject = async (resourceId: string) => {
    const reason = prompt("Enter rejection reason:");
    if (!reason) return;

    try {
      const response = await fetch(`/api/knowledge/${resourceId}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });
      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error("Error rejecting resource:", error);
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
      <h1 className="text-3xl font-bold text-gray-900">Validator Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">
            Pending Approvals
          </h3>
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
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">
            Avg. Validation Time
          </h3>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            {stats.avgTime}m
          </p>
        </div>
      </div>

      {/* Pending Approvals */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Pending Approvals
          </h2>
        </div>
        <div className="p-6">
          {pendingResources.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No pending approvals
            </p>
          ) : (
            <div className="space-y-4">
              {pendingResources.map((resource) => (
                <div key={resource._id} className="border rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {resource.heading}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    By: {resource.created_by?.full_name} (
                    {resource.created_by?.email})
                  </p>
                  <p className="text-sm text-gray-500">
                    Classification: {resource.classification}
                  </p>
                  <p className="text-gray-700 mt-2 line-clamp-3">
                    {resource.data_body}
                  </p>
                  <div className="mt-4 flex space-x-2">
                    <button
                      onClick={() => handleApprove(resource._id)}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(resource._id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Approval History */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Approval History
          </h2>
        </div>
        <div className="p-6">
          {history.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No approval history
            </p>
          ) : (
            <div className="space-y-2">
              {history.map((resource) => (
                <div
                  key={resource._id}
                  className="flex justify-between items-center p-3 border rounded"
                >
                  <div>
                    <span className="font-medium">{resource.heading}</span>
                    <span
                      className={`ml-2 px-2 py-1 rounded text-xs ${
                        resource.approval_state === "Approved"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {resource.approval_state}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(resource.createdAt).toLocaleDateString()}
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
