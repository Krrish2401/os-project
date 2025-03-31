"use client";

import { useState } from "react";
import Link from "next/link";

interface DirectoryCardProps {
  id: string;
  name: string;
  onDelete: () => void; // Callback to refresh or update UI after deletion
}

export default function DirectoryCard({
  id,
  name,
  onDelete,
}: DirectoryCardProps) {
  const [isUpdating, setIsUpdating] = useState(false); // State to track update status
  const [isDeleting, setIsDeleting] = useState(false); // State to track delete status

  const updateAccessCount = async () => {
    if (isUpdating) return; // Prevent multiple calls
    setIsUpdating(true); // Disable further clicks
    try {
      await fetch("/api/updateDirectoryAccess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ directoryId: id }),
      });
    } catch (error) {
      console.error("Failed to update access count:", error);
    } finally {
      setIsUpdating(false); // Re-enable the link after the update
    }
  };

  const handleDelete = async () => {
    if (isDeleting) return; // Prevent multiple calls
    if (!confirm(`Are you sure you want to delete the directory "${name}"?`))
      return;

    setIsDeleting(true); // Disable further clicks
    try {
      await fetch(`/api/directory/${id}`, {
        method: "DELETE",
      });

      console.log(`Directory ${name} deleted successfully.`);
      onDelete(); // Trigger UI update
    } catch (error) {
      console.error("Error deleting directory:", error);
    } finally {
      setIsDeleting(false); // Re-enable the delete button
    }
  };

  return (
    <div className="relative hover:scale-102 mx-1.5 ">
      {/* Delete Button */}
      <button
        className="absolute top-4 right-2 inline-flex items-center hover:shadow-blue-200 shadow-red-400 justify-center px-4 py-2 text-sm font-medium text-white transition-all duration-300 bg-gray-900/20 border border-gray-500/30 rounded-lg shadow-md backdrop-blur-sm hover:scale-102 hover:bg-gray-900/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
        onClick={handleDelete}
        disabled={isDeleting}
      >
        {isDeleting ? "Deleting..." : "Delete"}
      </button>

      {/* Directory Card */}
      <Link
        href={`/directory/${id}`}
        className={`block ${
          isUpdating ? "pointer-events-none text-gray-200" : ""
        }`} // Disable link styling
        onClick={updateAccessCount}
      >
        <div className="p-6 bg-white/10 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center space-x-3">
            {/* Folder Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-yellow-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
              />
            </svg>
            {/* Directory Name */}
            <span className="text-lg font-medium text-gray-200">{name}</span>
          </div>
        </div>
      </Link>
    </div>
  );
}