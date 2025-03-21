"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../lib/useAuth";

export default function Home() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  // Simulate fetching data or performing side effects when user is available
  useEffect(() => {
    if (!user) {
      // If user is not available, keep loading state true
      setLoading(true);
    } else {
      // Simulate data fetching or other async operations
      setLoading(false); // Mark loading as complete once user is available
    }
  }, [user]);

  // Prevent rendering until user is available
  if (!user) return null;

  // Show loading spinner while waiting for data
  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <>
      <h1 className="text-2xl font-semibold">
        Welcome back, {user?.email || "User"}!
        <span className="text-gray-600">({user?.uid})</span>
      </h1>
      <p className="mt-4">You are now signed in.</p>
    </>
  );
}
