// app/root/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/useAuth";
import DirectoryCard from "@/components/DirectoryCard";
import CreateDirectory from "@/components/CreateDire";
import FileUpload from "@/components/FileUpload";
import FileList from "@/components/FileList"; // Import the FileList component
import DirectoryComponent from "@/components/DirectoryComponent";

interface File {
  id: string;
  name: string;
  extension: string;
  fileUrl: string;
}

interface Directory {
  id: string;
  name: string;
}

export default function RootDirectoryPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [rootdirid, setrootdirid] = useState<string>("");
  const [directories, setDirectories] = useState<Directory[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, userId, loading: authLoading } = useAuth();
  

  useEffect(() => {
    const fetchRootDirectory = async () => {
      try {
        if (authLoading) return;

        if (!userId) {
          setError("User not authenticated");
          setLoading(false);
          return;
        }

        const response = await fetch("/api/root-dir", {
          headers: {
            "x-user-id": userId,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData.error || "Failed to fetch root directory");
          return;
        }

        const data = await response.json();
        setFiles(data.files);
        setDirectories(data.directories);
        setrootdirid(data.rootdir);
      } catch (err) {
        setError("An error occurred while fetching the root directory");
      } finally {
        setLoading(false);
      }
    };

    fetchRootDirectory();
  }, [userId, authLoading]);

  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading authentication state...
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="flex justify-center items-center h-screen">
        Please sign in to view your root directory.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading root directory...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Error: {error}
      </div>
    );
  }
  const handleDelete = (deletedId: string) => {
    setDirectories((prev) => prev.filter((dir) => dir.id !== deletedId));
  };

  return (
    <div className="p-8 bg-gray-800 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Root Directory</h1>

      {/* Files Section */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Files</h2>
        <FileList files={files} /> {/* Use the FileList component here */}
      </section>

      {/* Directories Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Directories</h2>
        {directories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {directories.map((dir) => (
              <DirectoryCard
                key={dir.id}
                id={dir.id}
                name={dir.name}
                onDelete={() => handleDelete(dir.id)}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No directories found.</p>
        )}
      </section>
      <div className="flex space-x-4">
        <div className="w-1/3">
          <CreateDirectory directoryId={rootdirid} userId={userId} />
        </div>
        <div className="w-1/3">
          <FileUpload directoryId={rootdirid} userId={userId} />
        </div>
        <div className="w-1/3">
          <DirectoryComponent directoryId={rootdirid} />
        </div>
      </div>
    </div>
  );
}
