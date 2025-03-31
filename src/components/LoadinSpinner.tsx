import { motion } from "framer-motion";

export default function LoadingSpinner() {
    return (
        <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
            <motion.div
                className="w-16 h-16 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
            />
        </div>
    );
}