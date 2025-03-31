// app/root/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/useAuth";
import DirectoryCard from "@/components/DirectoryCard";
import CreateDirectory from "@/components/CreateDire";
import FileUpload from "@/components/FileUpload";
import FileList from "@/components/FileList"; // Import the FileList component
import DirectoryComponent from "@/components/DirectoryComponent";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { GlowingEffect2 } from "@/components/ui/glowing-effect2";

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
    <div
      className="p-8 min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: "url('/background.png')" }}
    >
      {/* Optional Overlay for Better Contrast */}
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative z-10">
        <h1 className="text-3xl text-center font-bold mb-6 text-white">
          Root Directory
        </h1>

        {/* Files Section */}
        <div className="flex gap-8">
          {/* Files Section */}
          <div className="relative w-1/3 p-4 rounded-xl shadow-lg border-2 border-white/20 bg-white/10 ">
            <GlowingEffect
              blur={0}
              borderWidth={5}
              spread={80}
              glow={true}
              disabled={false}
              proximity={64}
              inactiveZone={0.01}
            />
            <section className=" rounded-lg   h-[50vh] overflow-y-auto">
              <h2 className="text-2xl  font-semibold mb-6 text-white">Files</h2>
              <FileList files={files} /> {/* Use the FileList component here */}
            </section>
          </div>

          {/* Directories Section */}
          <div className="relative w-2/3 p-4 rounded-xl shadow-lg border-2 border-white/20 bg-white/10 ">
            <GlowingEffect
              blur={0}
              borderWidth={5}
              spread={80}
              glow={true}
              disabled={false}
              proximity={64}
              inactiveZone={0.01}
            />
            <section className="h-[50vh] rounded-lg  overflow-y-auto">
              <h2 className="text-2xl  font-semibold mb-6 text-white">
                Directories
              </h2>
              {directories.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2   lg:grid-cols-2 gap-4">
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
          </div>
        </div>

        <div className="flex space-x-4 mt-8">
          <div className="relative w-full   rounded-xl shadow-lg border-2 border-white/20 bg-white/10">
            <GlowingEffect2
              blur={0}
              borderWidth={5}
              spread={80}
              glow={true}
              disabled={false}
              proximity={64}
              inactiveZone={0.01}
            />
            <DirectoryComponent directoryId={rootdirid} />
          </div>

          <div className="relative w-full   rounded-xl shadow-lg border-2 border-white/20 bg-white/10">
            <GlowingEffect
              blur={0}
              borderWidth={5}
              spread={80}
              glow={true}
              disabled={false}
              proximity={64}
              inactiveZone={0.01}
            />
            <FileUpload directoryId={rootdirid} userId={userId} />
          </div>
          <div className="relative w-full   rounded-xl shadow-lg border-2 border-white/20 bg-white/10">
            <GlowingEffect
              blur={0}
              borderWidth={5}
              spread={80}
              glow={true}
              disabled={false}
              proximity={64}
              inactiveZone={0.01}
            />
            <div className="">
              <CreateDirectory directoryId={rootdirid} userId={userId} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}