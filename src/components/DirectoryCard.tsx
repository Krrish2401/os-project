// components/DirectoryCard.tsx
"use client";

import Link from "next/link";

interface DirectoryCardProps {
  id: string;
  name: string;
}

export default function DirectoryCard({ id, name }: DirectoryCardProps) {
  return (
    <Link href={`/directory/${id}`} className="block">
      <div className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
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
          <span className="text-lg font-medium text-gray-800">{name}</span>
        </div>
      </div>
    </Link>
  );
}
