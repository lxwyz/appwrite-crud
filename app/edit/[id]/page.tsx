"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";

export default function EditPage({ params }: { params: { id: string } }) {
  const [formData, setFormData] = useState({ title: "", description: "" });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/blogs/${params.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch blog");
        }
        const data = await response.json();

        setFormData({
          title: data.blog.title,
          description: data.blog.description,
        });
      } catch (error) {
        setError("Failed to add a blog");
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      setError("Please fill in all fields");
      return;
    }
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch(`/api/blogs/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error("Failed to update blog");
      }
      router.push("/");
    } catch (error) {
      console.log(error);
      setError("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-6">Edit Blog</h1>

        {/* Title Input */}
        <div className="mb-4">
          <label className="block text-gray-700" htmlFor="title">
            Title
          </label>
          <input
            type="text"
            value={formData.title}
            name="title"
            placeholder="Enter blog title"
            className="w-full p-3 border border-gray-300 rounded-lg mt-2"
            onChange={handleInputChange}
          />
        </div>

        {/* Description Input */}
        <form onSubmit={handleUpdate} className="mb-4">
          <label className="block text-gray-700" htmlFor="description">
            Description
          </label>
          <textarea
            value={formData.description}
            name="description"
            placeholder="Enter blog description"
            className="w-full p-3 border border-gray-300 rounded-lg mt-2"
            rows={5}
            onChange={handleInputChange}
          ></textarea>
          <div className="flex space-x-4">
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-300"
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Update Blog"}
            </button>
            <Link
              href="/"
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-300"
            >
              Cancel
            </Link>
          </div>
        </form>

        {/* Action Buttons */}

        {error && <div className="text-red-500 text-sm py-2">{error}</div>}
      </div>
    </div>
  );
}
