"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

// Helper function to get role badge colors
const getRoleBadgeClasses = (role: string) => {
  switch (role) {
    case "validator":
      return "bg-green-100 text-green-800";
    case "staff":
      return "bg-blue-100 text-blue-800";
    case "consultant":
      return "bg-purple-100 text-purple-800";
    case "governance":
      return "bg-orange-100 text-orange-800";
    case "executive":
      return "bg-yellow-100 text-yellow-800";
    case "controller":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function ControllerUsersPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({
    unique_user_id: "",
    full_name: "",
    email: "",
    password: "",
    division: "",
    role: "staff" as "staff" | "consultant" | "validator" | "governance" | "executive" | "controller",
    // Role-specific fields
    specialisation_field: "",
    assigned_project: "",
    compliance_score: "",
    inspection_interval: "",
    privilege_level: "",
    control_tier: "",
    access_rights: "",
    training_phase: "",
  });
  const [createError, setCreateError] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch("/api/users");
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to fetch users");
      }

      const data = await response.json();
      setUsers(data.users || []);
    } catch (err: any) {
      console.error("Error fetching users:", err);
      setError(err.message || "An error occurred while fetching users");
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError("");
    setCreating(true);

    try {
      // Prepare user data
      const userData: any = {
        unique_user_id: formData.unique_user_id,
        full_name: formData.full_name,
        email: formData.email,
        password: formData.password,
        division: formData.division,
        role: formData.role,
      };

      // Add role-specific fields
      if (formData.role === "consultant") {
        if (formData.specialisation_field) userData.specialisation_field = formData.specialisation_field;
        if (formData.assigned_project) userData.assigned_project = formData.assigned_project;
      } else if (formData.role === "governance") {
        if (formData.compliance_score) userData.compliance_score = parseInt(formData.compliance_score);
        if (formData.inspection_interval) userData.inspection_interval = formData.inspection_interval;
      } else if (formData.role === "executive") {
        if (formData.privilege_level) userData.privilege_level = formData.privilege_level;
      } else if (formData.role === "controller") {
        if (formData.control_tier) userData.control_tier = parseInt(formData.control_tier);
        if (formData.access_rights) {
          userData.access_rights = formData.access_rights
            .split(",")
            .map((r) => r.trim())
            .filter((r) => r.length > 0);
        }
      } else if (formData.role === "staff") {
        if (formData.training_phase) userData.training_phase = formData.training_phase;
      }

      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create user");
      }

      // Reset form and close modal
      setFormData({
        unique_user_id: "",
        full_name: "",
        email: "",
        password: "",
        division: "",
        role: "staff",
        specialisation_field: "",
        assigned_project: "",
        compliance_score: "",
        inspection_interval: "",
        privilege_level: "",
        control_tier: "",
        access_rights: "",
        training_phase: "",
      });
      setShowCreateForm(false);
      fetchUsers(); // Refresh the user list
    } catch (err: any) {
      setCreateError(err.message || "An error occurred while creating user");
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
        <div className="flex justify-center items-center py-12">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Create User
          </button>
          <button
            onClick={fetchUsers}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Create User Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Create New User</h2>
                <button
                  onClick={() => {
                    setShowCreateForm(false);
                    setCreateError("");
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <form onSubmit={handleCreateUser} className="p-6 space-y-4">
              {createError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {createError}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="unique_user_id" className="block text-sm font-medium text-gray-700 mb-1">
                    User ID *
                  </label>
                  <input
                    type="text"
                    id="unique_user_id"
                    name="unique_user_id"
                    required
                    value={formData.unique_user_id}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="full_name"
                    name="full_name"
                    required
                    value={formData.full_name}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label htmlFor="division" className="block text-sm font-medium text-gray-700 mb-1">
                    Division *
                  </label>
                  <input
                    type="text"
                    id="division"
                    name="division"
                    required
                    value={formData.division}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                    Role *
                  </label>
                  <select
                    id="role"
                    name="role"
                    required
                    value={formData.role}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                  >
                    <option value="staff">Staff</option>
                    <option value="consultant">Consultant</option>
                    <option value="validator">Validator</option>
                    <option value="governance">Governance</option>
                    <option value="executive">Executive</option>
                    <option value="controller">Controller</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password *
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    required
                    minLength={6}
                    value={formData.password}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                {/* Consultant fields */}
                {formData.role === "consultant" && (
                  <>
                    <div>
                      <label htmlFor="specialisation_field" className="block text-sm font-medium text-gray-700 mb-1">
                        Specialisation Field
                      </label>
                      <input
                        type="text"
                        id="specialisation_field"
                        name="specialisation_field"
                        value={formData.specialisation_field}
                        onChange={handleFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="assigned_project" className="block text-sm font-medium text-gray-700 mb-1">
                        Assigned Project
                      </label>
                      <input
                        type="text"
                        id="assigned_project"
                        name="assigned_project"
                        value={formData.assigned_project}
                        onChange={handleFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </>
                )}

                {/* Governance fields */}
                {formData.role === "governance" && (
                  <>
                    <div>
                      <label htmlFor="compliance_score" className="block text-sm font-medium text-gray-700 mb-1">
                        Compliance Score (0-100)
                      </label>
                      <input
                        type="number"
                        id="compliance_score"
                        name="compliance_score"
                        min="0"
                        max="100"
                        value={formData.compliance_score}
                        onChange={handleFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="inspection_interval" className="block text-sm font-medium text-gray-700 mb-1">
                        Inspection Interval
                      </label>
                      <input
                        type="text"
                        id="inspection_interval"
                        name="inspection_interval"
                        value={formData.inspection_interval}
                        onChange={handleFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </>
                )}

                {/* Executive fields */}
                {formData.role === "executive" && (
                  <div>
                    <label htmlFor="privilege_level" className="block text-sm font-medium text-gray-700 mb-1">
                      Privilege Level
                    </label>
                    <input
                      type="text"
                      id="privilege_level"
                      name="privilege_level"
                      value={formData.privilege_level}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                )}

                {/* Controller fields */}
                {formData.role === "controller" && (
                  <>
                    <div>
                      <label htmlFor="control_tier" className="block text-sm font-medium text-gray-700 mb-1">
                        Control Tier (1-5)
                      </label>
                      <input
                        type="number"
                        id="control_tier"
                        name="control_tier"
                        min="1"
                        max="5"
                        value={formData.control_tier}
                        onChange={handleFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="access_rights" className="block text-sm font-medium text-gray-700 mb-1">
                        Access Rights (comma-separated)
                      </label>
                      <input
                        type="text"
                        id="access_rights"
                        name="access_rights"
                        value={formData.access_rights}
                        onChange={handleFormChange}
                        placeholder="right1, right2, right3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </>
                )}

                {/* Staff fields */}
                {formData.role === "staff" && (
                  <div>
                    <label htmlFor="training_phase" className="block text-sm font-medium text-gray-700 mb-1">
                      Training Phase
                    </label>
                    <input
                      type="text"
                      id="training_phase"
                      name="training_phase"
                      value={formData.training_phase}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setCreateError("");
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                >
                  {creating ? "Creating..." : "Create User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 overflow-x-auto">
          {users.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No users found</p>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Division
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created At
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
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
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeClasses(user.role)}`}>
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
        </div>
      </div>
    </div>
  );
}
