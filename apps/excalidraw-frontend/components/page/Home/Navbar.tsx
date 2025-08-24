'use client'

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User, Home, PlusCircle, LogOut, Settings } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    return (
        <nav className="backdrop-blur-lg bg-primary shadow-lg sticky top-0 z-50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Link href="/" className="text-2xl font-extrabold tracking-wide bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                🎨 CollabCanvas
                </Link>
            </motion.div>

            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-8 items-center text-white font-medium">
                {[
                { href: "/dashboard", label: "Dashboard", icon: <Home size={18} /> },
                { href: "/create", label: "Create Room", icon: <PlusCircle size={18} /> },
                { href: "/settings", label: "Settings", icon: <Settings size={18} /> }
                ].map((item, idx) => (
                <motion.div
                    key={idx}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Link href={item.href} className="flex items-center gap-2 relative group">
                    {item.icon} {item.label}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-500 transition-all duration-300 group-hover:w-full" />
                    </Link>
                </motion.div>
                ))}

                {/* Profile dropdown */}
                <div className="relative">
                <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold shadow-md hover:shadow-lg transition"
                >
                    <User size={20} />
                </button>
                <AnimatePresence>
                    {profileOpen && (
                    <motion.ul
                        initial={{ opacity: 0, scale: 0.9, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-3 w-48 rounded-xl bg-black/80 backdrop-blur-lg shadow-xl text-white overflow-hidden"
                    >
                        <li className="px-4 py-2 hover:bg-white/10 cursor-pointer flex items-center gap-2">
                        <User size={16} /> <Link href="/profile">Profile</Link>
                        </li>
                        <li className="px-4 py-2 hover:bg-white/10 cursor-pointer flex items-center gap-2">
                        <Settings size={16} /> <Link href="/settings">Settings</Link>
                        </li>
                        <li className="px-4 py-2 hover:bg-white/10 cursor-pointer flex items-center gap-2 text-red-400">
                        <LogOut size={16} /> <Link href="/logout">Logout</Link>
                        </li>
                    </motion.ul>
                    )}
                </AnimatePresence>
                </div>
            </div>

            {/* Mobile Hamburger */}
            <div className="md:hidden flex items-center">
                <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-white">
                {isOpen ? <X size={24}/> : <Menu size={24}/>}
                </button>
            </div>
            </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
            {isOpen && (
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="md:hidden bg-black/80 backdrop-blur-lg text-white shadow-md"
            >
                <Link href="/dashboard" className="block px-4 py-3 hover:bg-white/10">Dashboard</Link>
                <Link href="/create" className="block px-4 py-3 hover:bg-white/10">Create Room</Link>
                <Link href="/settings" className="block px-4 py-3 hover:bg-white/10">Settings</Link>
                <Link href="/profile" className="block px-4 py-3 hover:bg-white/10">Profile</Link>
                <Link href="/logout" className="block px-4 py-3 hover:bg-red-500/20 text-red-400">Logout</Link>
            </motion.div>
            )}
        </AnimatePresence>
        </nav>
    );
}
