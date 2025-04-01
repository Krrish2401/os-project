"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../lib/useAuth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { FaUserCircle } from "react-icons/fa"; // Import the user profile icon
import { motion } from "framer-motion";
import LoadingSpinner from "@/components/LoadinSpinner";

export default function Home() {
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [mostAccessedDirectory, setMostAccessedDirectory] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [insightsData, setInsightsData] = useState<any>(null);
  const [insightsLoading, setInsightsLoading] = useState(true);
  const [insightsError, setInsightsError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(true);
    } else {
      setLoading(false);
      const fetchMostAccessedDirectory = async () => {
        const response = await fetch("/api/getMostAccessedDirectory", {
          headers: { "x-user-id": user.uid },
        });
        const data = await response.json();
        setMostAccessedDirectory(data.directory);
      };
      fetchMostAccessedDirectory();
    }
  }, [user, authLoading]);

  useEffect(() => {
    async function fetchInsights() {
      if (!user?.uid) {
        setInsightsError("User ID is not available.");
        setInsightsLoading(false);
        return;
      }
      try {
        const response = await fetch(`/api/getMetadata?userId=${user.uid}`);
        const result = await response.json();
        if (!result.success) {
          throw new Error(result.error || "Failed to fetch insights.");
        }
        setInsightsData(result);
      } catch (err) {
        console.error(err);
        setInsightsError(err.message);
      } finally {
        setInsightsLoading(false);
      }
    }
    if (!authLoading && user) {
      fetchInsights();
    }
  }, [user, authLoading]);

  const updateAccessCount = async () => {
    if (!mostAccessedDirectory?.id) return;
    setIsUpdating(true);
    try {
      await fetch("/api/updateDirectoryAccess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ directoryId: mostAccessedDirectory.id }),
      });
    } catch (error) {
      console.error("Failed to update access count:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (authLoading || loading) {
    return <LoadingSpinner />;
  }
  if (!user) return null;

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat relative overflow-hidden"
      style={{ backgroundImage: "url('/background.png')" }}
    >
      {/* Optional Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative z-10 p-6 flex">
        {/* Left Section - 40% */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-2/5 p-6 flex flex-col items-center justify-center text-white -mt-15"
        >
          <div className="mb-6">
            {/* User Profile Icon with Gradient */}
            <FaUserCircle
              className="w-24 h-24 bg-clip-text"
              style={{
                backgroundImage:
                  "linear-gradient(to right, #4facfe, #00f2fe, #00c6ff, #0072ff)",
              }}
            />
          </div>
          <h1 className="text-3xl text-center font-bold">
            Welcome back, {user?.email || "User"}!
          </h1>
          <p className="text-gray-300 mt-2 text-center">
            Manage your files, directories, and insights all in one place.
          </p>
          <div className="mt-6 w-full flex flex-col space-y-4 items-center">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/root-dir")}
              className="relative px-6 py-3 text-sm font-medium text-white transition-all duration-300 bg-gradient-to-r from-black via-blue-500 to-black rounded-lg shadow-lg  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-400 w-3/4"
            >
              Go to Root Directory
            </motion.button>
          </div>
        </motion.div>

        {/* Right Section - 60% */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-3/5 p-6 space-y-6 h-screen"
        >
          {/* Most Accessed Directory */}
          <div className="relative p-6 rounded-xl shadow-lg border-2 border-white/20 bg-white/10">
            <GlowingEffect
              blur={0}
              borderWidth={5}
              spread={80}
              glow={true}
              disabled={false}
              proximity={64}
              inactiveZone={0.01}
            />
            <h2 className="text-xl font-semibold text-white mb-4">
              Most Accessed Directory
            </h2>
            {mostAccessedDirectory ? (
              <Link
                href={`/directory/${mostAccessedDirectory.id}`}
                className="text-lg text-[#17BEBB] hover:underline"
                onClick={updateAccessCount}
              >
                {mostAccessedDirectory.name}
              </Link>
            ) : (
              <p className="text-gray-500">No directory data available.</p>
            )}
          </div>

          {/* Recommended File */}
          <div className="relative p-4 rounded-xl shadow-lg border-2 border-white/20 bg-white/10">
            <GlowingEffect
              blur={0}
              borderWidth={5}
              spread={80}
              glow={true}
              disabled={false}
              proximity={64}
              inactiveZone={0.01}
            />
            <h3 className="text-lg font-semibold text-white mb-2">
              Recommended File to Open
            </h3>
            {insightsData?.FileName?.choices[0]?.message?.content ? (
              (() => {
                const { name, fileUrl } = JSON.parse(
                  insightsData.FileName.choices[0].message.content
                );
                return (
                  <a
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#17BEBB] hover:underline"
                  >
                    {name}
                  </a>
                );
              })()
            ) : (
              <p className="text-gray-300">No recommendation available.</p>
            )}
          </div>

          {/* File Insights */}
          <div className="relative p-4 rounded-xl shadow-lg border-2 border-white/20 bg-white/10">
            <GlowingEffect
              blur={0}
              borderWidth={5}
              spread={80}
              glow={true}
              disabled={false}
              proximity={64}
              inactiveZone={0.01}
            />
            <h3 className="text-lg font-semibold text-white mb-2">
              File Insights
            </h3>
            <ReactMarkdown
              components={{
                p: ({ node, ...props }) => (
                  <p {...props} className="text-gray-300" />
                ),
                li: ({ node, ...props }) => (
                  <li {...props} className="text-gray-300" />
                ),
              }}
            >
              {insightsData?.insights?.choices[0]?.message?.content
                ?.split("\n")
                .slice(1)
                .join("\n") || "No insights available."}
            </ReactMarkdown>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
