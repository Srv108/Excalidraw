'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden">
      {/* Themed gradient background (single owner) */}
      <div className="absolute inset-0 bg-gradient-main animate-gradient" />

      {/* Subtle floating accents (optional) */}
      <div className="absolute -top-6 -left-6 w-28 h-28 rounded-full bg-white/10 animate-float" />
      <div className="absolute bottom-10 right-12 w-20 h-20 rounded-full bg-white/10 animate-float" style={{ animationDelay: '2s' }} />

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full px-4"
      >
        {children}
      </motion.div>
    </div>
  );
}
