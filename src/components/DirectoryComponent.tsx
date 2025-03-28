// components/ProcessDirectoryAI.tsx
"use client";

import { useState } from "react";

interface ProcessDirectoryAIProps {
  directoryId: string; // ID of the directory to process
}

export default function ProcessDirectoryAI({
  directoryId,
}: ProcessDirectoryAIProps) {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<string | null>(null);

  const handleProcessFiles = async () => {
    setProcessing(true);
    setError(null);
    setResponse(null);

    try {
      // Call the backend API to process the directory
      const apiResponse = await fetch(`/api/process-directory/${directoryId}`, {
        method: "POST",
      });

      const result = await apiResponse.json();

      if (!apiResponse.ok) {
        setError(result.error || "Failed to process files.");
        return;
      }

      // Set the response from ChatGPT
      setResponse(result.message);
    } catch (err) {
      console.error("Error processing files:", err);
      setError("An error occurred while processing the files.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="p-4 bg-gray-700 rounded-lg mt-4 shadow-md">
      <h2 className="text-lg font-semibold mb-4">Process Files with AI</h2>

      {/* Process Button */}
      <button
        onClick={handleProcessFiles}
        disabled={processing}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {processing ? "Processing..." : "Process Files"}
      </button>

      {/* Success or Error Message */}
      {response && (
        <p className="mt-2 text-green-500">ChatGPT Response: {response}</p>
      )}
      {error && <p className="mt-2 text-red-500">{error}</p>}
    </div>
  );
}
