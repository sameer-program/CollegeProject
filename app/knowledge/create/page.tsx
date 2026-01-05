"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function CreateKnowledgePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    heading: "",
    data_body: "",
    classification: "",
    keywords: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
    setError("");
    setLoading(true);

    try {
      const keywordsArray = formData.keywords
        .split(",")
        .map((k) => k.trim())
        .filter((k) => k.length > 0);

      const response = await fetch("/api/knowledge", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          keywords: keywordsArray,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create knowledge resource");
      }

      router.push(`/knowledge/${data.resource._id}`);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Create Knowledge Resource
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow p-6 space-y-6"
      >
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div>
          <label
            htmlFor="heading"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Heading *
          </label>
          <input
            type="text"
            id="heading"
            name="heading"
            required
            value={formData.heading}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 bg-white"
            placeholder="Enter knowledge resource heading"
          />
        </div>

        <div>
          <label
            htmlFor="classification"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Classification *
          </label>
          <input
            type="text"
            id="classification"
            name="classification"
            required
            value={formData.classification}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 bg-white"
            placeholder="e.g., Technical, Best Practices, Case Study"
          />
        </div>

        <div>
          <label
            htmlFor="data_body"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Content *
          </label>
          <textarea
            id="data_body"
            name="data_body"
            required
            rows={10}
            value={formData.data_body}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 bg-white"
            placeholder="Enter knowledge content..."
          />
        </div>

        <div>
          <label
            htmlFor="keywords"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Keywords (comma-separated)
          </label>
          <input
            type="text"
            id="keywords"
            name="keywords"
            value={formData.keywords}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 bg-white"
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
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Knowledge Resource"}
          </button>
        </div>
      </form>
    </div>
  );
}
