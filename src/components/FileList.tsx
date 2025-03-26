// app/components/FileList.tsx
"use client";

import React from "react";

interface File {
  id: string;
  name: string;
  extension: string;
  fileUrl: string;
}

interface FileListProps {
  files: File[];
}

const FileList: React.FC<FileListProps> = ({ files }) => {
  return (
    <ul className="space-y-2">
      {files.length > 0 ? (
        files.map((file) => (
          <li
            key={file.id}
            className="flex items-center space-x-2 p-2 bg-white rounded shadow-sm"
          >
            {/* File Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            {/* File Name and Link */}
            <a
              href={file.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {file.name}.{file.extension}
            </a>
          </li>
        ))
      ) : (
        <p className="text-gray-500">No files found.</p>
      )}
    </ul>
  );
};

export default FileList;
