'use client';


import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";

const CreatePage = () => {
    const [formData, setFormData] = useState({title: "", description: ""});
    const [error,setError] = useState<string | null>(null);
    const [isLoading,setIsLoading] = useState(false);

    const router = useRouter();

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData((prevData) =>  ({
            ...prevData,
            [e.target.name]: e.target.value
        }))
      
        
    }


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
       if(!formData.title || !formData.description) {
            setError("Please fill in all fields");
            return;
 
       }
       setError(null);
       setIsLoading(true);

       try {
         const response = await fetch('/api/blogs', {method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(formData),
         });
         if(!response.ok) {
            throw new Error("Failed to create a blog");
         }
         router.push('/');
       } catch (error) {
        console.log(error)
        setError("Failed to create a blog. Please try again.");
       }finally {
        setIsLoading(false);
       }
    }
  return (
    <div className="flex items-center justify-center h-[calc(100vh-100px)]"> 
    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Create a New Task</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-gray-700 font-medium mb-1" htmlFor="title">
                    Title
                </label>
                <input
                    type="text"
                    value={formData.title}
                    name="title"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter task title"
                    onChange={handleInputChange}
                />
            </div>

            <div>
                <label className="block text-gray-700 font-medium mb-1" htmlFor="description">
                    Description
                </label>
                <textarea
                    value={formData.description}
                    name="description"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={4}
                    placeholder="Enter task description"
                    onChange={handleInputChange}
                ></textarea>
            </div>

            <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                disabled={isLoading}
            >
               {isLoading ? "Adding...": "Add Blog"}
            </button>
        </form>
        {
            error && (
                <div className="text-red-500 text-sm py-2">{error}</div>
            )
        }
    </div>
</div>
  )
}

export default CreatePage
