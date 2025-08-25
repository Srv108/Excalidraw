'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { signIn } from 'next-auth/react';
import { FaGoogle, FaFacebook, FaInstagram } from 'react-icons/fa';
import axios from 'axios';
import { HTTP_BACKEND } from '@/config';

export default function SignUpPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirm) return alert("Passwords do not match");

        console.log(email, password);
        // Call your signup API
        const res = await axios.post(`${HTTP_BACKEND}/signup`,{
            email: email,
            password: password,
        });

        console.log('coming response', res);
        if(res){
            await signIn("credentials", {
                email,
                password,
                callbackUrl: "/dashboard",
            });
        } else {
            alert("Signup failed");
        }
    };

    return (
        <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mx-auto w-full max-w-md sm:max-w-lg md:max-w-xl"
        >
        <div className="glass rounded-2xl shadow-2xl p-6 sm:p-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-2 text-foreground">
            Create Your Account
            </h2>
            <p className="text-center text-muted-foreground mb-6 text-base md:text-lg">
            Join us today!
            </p>

            {/* Credentials Signup */}
            <form className="space-y-5" onSubmit={handleSignup}>
            <div>
                <label htmlFor="email" className="block text-sm md:text-base font-medium text-foreground">
                Email
                </label>
                <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-2 block w-full rounded-md border border-border bg-background/80 px-4 py-3 text-foreground
                            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                />
            </div>

            <div>
                <label htmlFor="confirmPassword" className="block text-sm md:text-base font-medium text-foreground">
                Confirm Password
                </label>
                <input
                id="confirmPassword"
                type="password"
                placeholder="Confirm password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
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
                Sign Up
            </motion.button>
            </form>

            {/* Social Signup */}
            <div className="mt-6 text-center">
            <p className="text-muted-foreground text-sm md:text-base">Or sign up with</p>
            <div className="mt-3 grid grid-cols-3 gap-3">
                <motion.button
                onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-2 w-full rounded-md px-4 py-3 font-medium border border-border bg-background/80 text-foreground transition"
                >
                <FaGoogle /> Google
                </motion.button>
                <motion.button
                onClick={() => signIn("facebook", { callbackUrl: "/dashboard" })}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-2 w-full rounded-md px-4 py-3 font-medium border border-border bg-background/80 text-foreground transition"
                >
                <FaFacebook /> Facebook
                </motion.button>
                <motion.button
                onClick={() => signIn("instagram", { callbackUrl: "/dashboard" })}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-2 w-full rounded-md px-4 py-3 font-medium border border-border bg-background/80 text-foreground transition"
                >
                <FaInstagram /> Instagram
                </motion.button>
            </div>
            </div>
        </div>
        </motion.div>
    );
}
