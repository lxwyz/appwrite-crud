'use client';
import Link from "next/link";
import { useEffect, useState } from "react";

interface BlogInter {
  $id: string;
  title: string;
  description: string;
}

export default function Home() {
  const [blogs, setBlogs] = useState<BlogInter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/blogs");
        if (!res.ok) {
          throw new Error("Failed to fetch blogs");
        }
        const data = await res.json();
        setBlogs(data);
      } catch (error) {
        console.log("Error", error);
        setError("Failed to fetch blogs. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Render nothing until the client has loaded to avoid hydration issues.
  if (typeof window === 'undefined') {
    return null;  // This ensures no content is rendered on SSR
  }

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/blogs/${id}`, { method: "DELETE" });
      setBlogs((prevBlogs) => prevBlogs?.filter((i) => i.$id !== id));
    } catch (error) {
      setError("Failed to delete blog. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {error && <p className="py-4 text-red-500">{error}</p>}
      {isLoading ? (
        <p>Loading Blogs...</p>
      ) : blogs?.length > 0 ? (
        <div className="space-y-3">
          {blogs?.map((blog) => (
            <div key={blog.$id} className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-xl font-semibold mb-2">{blog.title}</h2>
              <p className="text-gray-600 mb-4">{blog.description}</p>
              <div className="flex space-x-4">
                <Link
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-300"
                  href={`/edit/${blog.$id}`}
                >
                  Edit
                </Link>
                <button onClick={() => handleDelete(blog.$id)} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-300">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No blogs available</p> // Show this message if no blogs are available
      )}
    </div>
  );
}
