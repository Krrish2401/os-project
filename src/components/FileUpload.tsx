// components/FileUpload.tsx
"use client";

import { useState } from "react";

interface FileUploadProps {
  directoryId: string;
  userId: string  // ID of the directory where the file will be uploaded
}

export default function FileUpload({ directoryId, userId }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(false);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("directoryId", directoryId);
      if (userId) {
        formData.append("userId", userId);
      }

      const response = await fetch("/api/file/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Failed to upload file.");

      }

      setSuccess(true);
    } catch (err) {
      console.error("Error uploading file:", err);
      setError("An error occurred while uploading the file.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6 rounded-lg shadow-md">
      {/* Glowing Effect */}

      {/* Heading */}
      <h2 className="text-xl font-bold mb-5 text-white">Upload File</h2>

      {/* File Input */}
      <div className="mb-4">

        <input
          id="fileInput"
          type="file"
          onChange={handleFileChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
        />
      </div>

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={uploading}
        className="w-full hover:shadow-blue-200 shadow-blue-400 px-4 py-4 text-md font-medium text-white transition-all duration-300 bg-gray-900/20 border border-gray-500/30 rounded-lg shadow-md backdrop-blur-sm hover:scale-102 hover:bg-gray-900/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 disabled:bg-gray-400"
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>

      {/* Success or Error Message */}
      {success && (
        <p className="mt-4 text-sm text-green-600 font-medium">
          File uploaded successfully!
        </p>
      )}
      {error && (
        <p className="mt-4 text-sm text-red-600 font-medium">{error}</p>
      )}
    </div>
  );
}
