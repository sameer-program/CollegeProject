"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function ControllerAIModulesPage() {
  const { data: session } = useSession();
  const [aiModules, setAiModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAIModules();
  }, []);

  const fetchAIModules = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch("/api/ai/modules");
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to fetch AI modules");
      }

      const data = await response.json();
      setAiModules(data.modules || []);
    } catch (err: any) {
      console.error("Error fetching AI modules:", err);
      setError(err.message || "An error occurred while fetching AI modules");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">AI Module Management</h1>
        <div className="text-center py-8 text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">AI Module Management</h1>
        <button
          onClick={fetchAIModules}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            AI Module Status
          </h2>
        </div>
        <div className="p-6">
          {aiModules.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No AI modules configured
            </p>
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

