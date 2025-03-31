// app/directory/[id]/page.tsx
"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import DirectoryCard from "@/components/DirectoryCard";
import { useAuth } from "@/lib/useAuth";
import FileUpload from "@/components/FileUpload";
import CreateDirectory from "@/components/CreateDire";
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

interface DirectoryContents {
  name: string;
  files: File[];
  directories: Directory[];
}

export default function DirectoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Unwrap the params promise to get the id
  const { id } = use(params);

  const [contents, setContents] = useState<DirectoryContents>({
    name: "Unknown",
    files: [],
    directories: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userId, loading: authLoading } = useAuth();
  const [directories, setDirectories] = useState<Directory[]>([]);
  const router = useRouter();

  const handleDelete = (deletedId: string) => {
    setDirectories((prev) => prev.filter((dir) => dir.id !== deletedId));
  };

  useEffect(() => {
    const fetchDirectoryContents = async () => {
      try {
        if (authLoading) return;

        if (!userId) {
          setError("User not authenticated");
          setLoading(false);
          return;
        }

        const response = await fetch(`/api/directory/${id}`, {
          headers: {
            "x-user-id": userId,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData.error || "Failed to fetch directory contents");
          return;
        }

        const data = await response.json();
        setContents(data);
      } catch (err) {
        setError("An error occurred while fetching directory contents");
      } finally {
        setLoading(false);
      }
    };

    fetchDirectoryContents();
  }, [id, userId, authLoading]);

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
        Please sign in to view this directory.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading directory contents...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
      </div>
    );
  }

 return (
   <div
     className="p-8 min-h-screen bg-cover bg-center bg-no-repeat relative"
     style={{ backgroundImage: "url('/background.png')" }}
   >
     {/* Optional Overlay for Better Contrast */}
     <div className="absolute inset-0 bg-black/50"></div>

     <div className="relative z-10">
       {/* Directory Name */}
       <h1 className="text-3xl text-center font-bold mb-6 text-white">
         Directory: {contents.name || "Unknown"}
       </h1>

       {/* Subdirectories Section */}
       <div className="flex gap-8">
         <div className="relative w-1/3 p-4 rounded-xl shadow-lg border-2 border-white/20 bg-white/10">
           <GlowingEffect
             blur={0}
             borderWidth={5}
             spread={80}
             glow={true}
             disabled={false}
             proximity={64}
             inactiveZone={0.01}
           />
           <section className="h-[50vh] rounded-lg overflow-y-auto">
             <h2 className="text-2xl font-semibold mb-6 text-white">Files</h2>
             {contents.files.length > 0 ? (
               <ul className="space-y-2">
                 {contents.files.map((file) => (
                   <li
                     key={file.id}
                     className="flex items-center space-x-2 p-2 bg-white/10 rounded shadow-sm"
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
                       className="text-blue-300 hover:underline"
                     >
                       {file.name}.{file.extension}
                     </a>
                   </li>
                 ))}
               </ul>
             ) : (
               <p className="text-gray-500">No files found.</p>
             )}
           </section>
         </div>
         {/* Subdirectories Section */}
         <div className="relative w-2/3 p-4 rounded-xl shadow-lg border-2 border-white/20 bg-white/10">
           <GlowingEffect
             blur={0}
             borderWidth={5}
             spread={80}
             glow={true}
             disabled={false}
             proximity={64}
             inactiveZone={0.01}
           />
           <section className="h-[50vh] rounded-lg overflow-y-auto">
             <h2 className="text-2xl font-semibold mb-6 text-white">
               Subdirectories
             </h2>
             {contents.directories.length > 0 ? (
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                 {contents.directories.map((dir) => (
                   <DirectoryCard
                     key={dir.id}
                     id={dir.id}
                     name={dir.name}
                     onDelete={() => handleDelete(dir.id)}
                   />
                 ))}
               </div>
             ) : (
               <p className="text-gray-500">No subdirectories found.</p>
             )}
           </section>
         </div>

         {/* Files Section */}
       </div>

       {/* Actions Section */}
       <div className="flex space-x-4 mt-8">
         <div className="relative w-full rounded-xl shadow-lg border-2 border-white/20 bg-white/10">
           <GlowingEffect2
             blur={0}
             borderWidth={5}
             spread={80}
             glow={true}
             disabled={false}
             proximity={64}
             inactiveZone={0.01}
           />
           <DirectoryComponent directoryId={id} />
         </div>

         <div className="relative w-full rounded-xl shadow-lg border-2 border-white/20 bg-white/10">
           <GlowingEffect
             blur={0}
             borderWidth={5}
             spread={80}
             glow={true}
             disabled={false}
             proximity={64}
             inactiveZone={0.01}
           />
           <CreateDirectory directoryId={id} userId={userId} />
         </div>
         <div className="relative w-full rounded-xl shadow-lg border-2 border-white/20 bg-white/10">
           <GlowingEffect
             blur={0}
             borderWidth={5}
             spread={80}
             glow={true}
             disabled={false}
             proximity={64}
             inactiveZone={0.01}
           />
           <FileUpload directoryId={id} userId={userId} />
         </div>
       </div>
     </div>
   </div>
 );
}