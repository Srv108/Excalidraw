"use client";

import { motion } from "framer-motion";

export default function PageLoader() {
    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-white dark:bg-gray-900 z-50">
        {/* Spinner */}
        <motion.div
            className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"
            initial={{ scale: 0.8, opacity: 0.6 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
            repeat: Infinity,
            repeatType: "reverse",
            duration: 1,
            }}
        />
        {/* Loading text */}
        <motion.p
            className="mt-6 text-lg font-medium text-gray-700 dark:text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
            repeat: Infinity,
            repeatType: "reverse",
            duration: 1.5,
            }}
        >
            Loading, please wait...
        </motion.p>
        </div>
    );
}
