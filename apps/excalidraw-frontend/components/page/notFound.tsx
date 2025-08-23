"use client";

import { Button } from "@repo/ui/components/button";
import { motion } from "framer-motion";

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-900 px-6 text-center">
        {/* Animated "404" */}
        <motion.h1
            className="text-7xl md:text-9xl font-extrabold text-blue-600 mb-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
        >
            404
        </motion.h1>

        {/* Message */}
        <motion.p
            className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
        >
            Oops! The page you’re looking for doesn’t exist or has been moved.
        </motion.p>

        {/* Buttons */}
        <div className="flex gap-4">
            <Button >
            Go Home
            </Button>
            <Button >
            Contact Support
            </Button>
        </div>
        </div>
    );
}
