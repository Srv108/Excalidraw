'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function SignInPage() {
    return (
        <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mx-auto w-full max-w-md sm:max-w-lg md:max-w-xl"
        >
        {/* Single card container with themed glass background */}
        <div className="glass rounded-2xl shadow-2xl p-6 sm:p-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-2 text-foreground">Welcome Back</h2>
            <p className="text-center text-muted-foreground mb-6 text-base md:text-lg">Sign in to your account!</p>

            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div>
                <label htmlFor="email" className="block text-sm md:text-base font-medium text-foreground">
                Email
                </label>
                <input
                id="email"
                type="email"
                placeholder="you@example.com"
                required
                className="mt-2 block w-full rounded-md border border-border bg-background/80 px-4 py-3 text-foreground
                            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                />
            </div>

            <div>
                <label htmlFor="password" className="block text-sm md:text-base font-medium text-foreground">
                Password
                </label>
                <input
                id="password"
                type="password"
                placeholder="Enter password"
                required
                className="mt-2 block w-full rounded-md border border-border bg-background/80 px-4 py-3 text-foreground
                            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                />
            </div>

            <motion.button
                type="submit"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full rounded-md px-4 py-3 font-medium glass
                        bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:opacity-90 transition"
            >
                Sign In
            </motion.button>
            </form>

            <div className="mt-6 text-center">
            <p className="text-muted-foreground text-sm md:text-base">Or sign in with</p>
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="mt-3 w-full rounded-md px-4 py-3 font-medium border border-border bg-background/80 text-foreground transition"
            >
                Sign In with Google
            </motion.button>
            </div>
        </div>
        </motion.div>
    );
}
