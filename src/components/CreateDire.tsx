// components/CreateDirectory.tsx
"use client";

import { useState } from "react";

interface CreateDirectoryProps {
  directoryId: string; // ID of the parent directory where the subdirectory will be created
  userId: string;
}

export default function CreateDirectory({ directoryId }: CreateDirectoryProps) {
  const [directoryName, setDirectoryName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!directoryName.trim()) {
      setError("Directory name cannot be empty");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch("/api/directory/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          parentId: directoryId,
          name: directoryName,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Failed to create directory");
        return;
      }

      setDirectoryName(""); // Clear the input field
      setSuccess(true);
    } catch (err) {
      console.error("Error creating directory:", err);
      setError("An error occurred while creating the directory.");
    } finally {
      setLoading(false);
    }
  };

 return (
   <div className="p-6 rounded-lg shadow-md">
     {/* Heading */}
     <h2 className="text-xl font-bold mb-5 text-white">Create Subdirectory</h2>

     <form onSubmit={handleSubmit} className="space-y-4">
       {/* Input for Directory Name */}
       <div>
        
        
         <input
           id="directoryName"
           type="text"
           value={directoryName}
           onChange={(e) => setDirectoryName(e.target.value)}
           placeholder="Enter directory name"
           className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
           required
         />
       </div>

       {/* Submit Button */}
       <button
         type="submit"
         disabled={loading}
         className="w-full hover:shadow-blue-200 shadow-blue-400 px-4 py-4 text-md font-medium text-white transition-all duration-300 bg-gray-900/20 border border-gray-500/30 rounded-lg shadow-md backdrop-blur-sm hover:scale-102 hover:bg-gray-900/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 disabled:bg-gray-400"
       >
         {loading ? "Creating..." : "Create Directory"}
       </button>
     </form>

     {/* Success or Error Message */}
     {success && (
       <p className="mt-4 text-sm text-green-600 font-medium">
         Directory created successfully!
       </p>
     )}
     {error && <p className="mt-4 text-sm text-red-600 font-medium">{error}</p>}
   </div>
 );
}