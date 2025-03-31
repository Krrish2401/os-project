"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signInWithGoogle } from "../../lib/auth";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import app from "../../../firebase/fireBaseConfig";
import { GlowingEffect2 } from "@/components/ui/glowing-effect2";
import { motion } from "framer-motion";
import { TypeAnimation } from 'react-type-animation';

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const auth = getAuth(app);

  useEffect(() => {
    // Ensure reCAPTCHA loads after the component mounts
    const recaptchaContainer = document.getElementById("recaptcha-container");
    if (!recaptchaContainer) {
      const div = document.createElement("div");
      div.id = "recaptcha-container";
      document.body.appendChild(div);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) router.push("/");
    });
    return () => unsubscribe();
  }, [router, auth]); // Include auth in the dependency array

  const handleGoogleSignIn = async () => {
    console.log("handleGoogleSignIn triggered");
    setIsLoading(true);
    try {
      const user = await signInWithGoogle();
      if (!user) throw new Error("Google sign-in failed.");

      const token = await user.getIdToken();
      const name = user.displayName || "Unknown";
      const phone = user.phoneNumber || "";
      const image = user.photoURL || "";

      console.log("Sending data to /api/auth:", { token, name, phone, image });

      const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          name,
          image,
        }),
      });

      const responseData = await response.json();
      console.log("API response:", responseData);

      if (!response.ok) {
        throw new Error(`API error: ${responseData.error}`);
      }

      alert(`Signed in as ${name}`);
      router.push("/");
    } catch (error) {
      console.error("Error during Google Sign-In:", error);
      alert(
        error instanceof Error ? error.message : "An unknown error occurred."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative grid grid-rows-[20px_1fr_20px] items-center justify-start min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <main className="relative flex flex-col gap-12 row-start-2 items-start sm:items-start z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center gap-4"
        >
          <h1 className="text-6xl font-bold text-center sm:text-left bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
            Welcome to OSUI!
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-2xl"
        >
          <TypeAnimation
            sequence={[
              'Effortlessly organize and manage your files with AI-powered automation.',
              1000,
              'Intelligent categorization, deduplication, and real-time monitoring.',
              1000,
              'Fast, secure, and optimized storage for seamless collaboration.',
              1000,
              'Enhance productivity with smart search and personalized recommendations.',
              1000,
            ]}
            wrapper="p"
            speed={50}
            className="text-lg text-center sm:text-left font-[family-name:var(--font-geist-mono)] text-gray-300"
            repeat={Infinity}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex gap-6 items-center flex-col sm:flex-row"
        >
          <div className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur opacity-60 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="relative px-8 py-3 bg-black rounded-full leading-none flex items-center divide-x divide-gray-600 disabled:opacity-50"
            >
              <span className="pr-6 text-gray-100">
                {isLoading ? "Signing in..." : "Sign In with Google"}
              </span>
              <span className="pl-6 text-blue-400 group-hover:text-gray-100 transition duration-200">
                →
              </span>
            </button>
          </div>
        </motion.div>

        <div id="recaptcha-container" className="mt-4"></div>
      </main>
    </div>
  );
}