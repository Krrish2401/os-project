"use client";

import { useState } from "react";
import { GlowingEffect } from "./ui/glowing-effect";

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
    <div className="p-6 rounded-lg shadow-md h-full flex flex-col justify-between">
      {/* Glowing Effect */}
      <GlowingEffect
        blur={0}
        borderWidth={5}
        spread={80}
        glow={true}
        disabled={false}
        proximity={64}
        inactiveZone={0.01}
      />

      {/* Content Section */}
      <div>
        {/* Heading */}
        <h2 className="text-xl font-bold mb-5 text-white">
          Organise with AI
        </h2>

        {!response && (
          <p className="mt-2 text-md text-gray-300 font-bold">
            Sort your files with AI!
          </p>
        )}

        {/* Success or Error Message */}
        {response && (
          <p className="mt-2 text-sm text-green-400 font-bold">
            AI Response: {response}
          </p>
        )}
        {error && (
          <p className="mt-2 text-sm text-red-600 font-medium">{error}</p>
        )}
      </div>

      {/* Process Button */}
      <button
        onClick={handleProcessFiles}
        disabled={processing}
        className="w-full hover:shadow-blue-200 shadow-cyan-200 px-4 py-4 text-md font-medium text-white transition-all duration-300 bg-gray-900/20 border border-gray-500/30 rounded-lg shadow-md backdrop-blur-sm hover:scale-102 hover:bg-gray-900/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 disabled:bg-gray-400"
      >
        {processing ? "Processing..." : "Process Files"}
      </button>
    </div>
  );
}