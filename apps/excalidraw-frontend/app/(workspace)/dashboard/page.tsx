'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@repo/ui/components/button';
import { useRouter } from 'next/navigation';
import { HTTP_BACKEND } from '@/config';
import axios from 'axios';
import { useSession } from 'next-auth/react';

export default function Dashboard() {
    const [showJoinForm, setShowJoinForm] = useState(false);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [roomId, setRoomId] = useState('');
    const [roomName, setRoomName] = useState('');
    const [jwtToken, setJwtToken] = useState<string | null>(null);
    const { data: session } = useSession();
    const router = useRouter();


    useEffect(() => {
        if (session) {
            setJwtToken(session.jwt ?? null);
        }
    }, [session]);

    const handleJoin = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('handleJoin called');
        if (!roomId.trim()) return;
        console.log('Joining room with ID:', roomId);
        router.push(`/canvas/${roomId}`);
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('handleCreate called');
        if (!roomName.trim()) return;
        if (!jwtToken) {
            console.error('No token available');
            return;
        }

        try {
            console.log('Creating room...');
            console.log(jwtToken);
            const room = await axios.post(`${HTTP_BACKEND}/room`,{ name: roomName },
                { headers: { 'access-token': jwtToken } }
            );

            console.log(room.data);
            const newRoomId = room.data?.details?.id;
            if (newRoomId) {
                console.log('Redirecting to new room:', newRoomId);
                router.push(`/canvas/${newRoomId}`);
            }
        } catch (error) {
            console.error('Error creating room:', error);
        }
    };

    return (
        <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-main animate-gradient" />

            {/* Floating shapes */}
            <div className="absolute top-20 left-10 w-20 h-20 rounded-full bg-primary/20 animate-float" />
            <div
                className="absolute top-40 right-20 w-32 h-32 rounded-full bg-secondary/20 animate-float"
                style={{ animationDelay: '2s' }}
            />
            <div
                className="absolute bottom-32 left-1/4 w-16 h-16 rounded-full bg-accent/20 animate-float"
                style={{ animationDelay: '4s' }}
            />

            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="relative z-10 w-full max-w-4xl"
            >
                <div className="glass rounded-2xl shadow-2xl p-10 sm:p-12 text-center">
                    <motion.h1
                        className="text-4xl md:text-5xl font-bold text-foreground mb-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        Welcome to{' '}
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent">
                            DoodleGlow
                        </span>
                    </motion.h1>

                    <motion.p
                        className="text-muted-foreground text-lg md:text-xl mb-10"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                    >
                        Choose an option to get started with your creative journey
                    </motion.p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Create Room */}
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.97 }}
                            className="glass rounded-xl p-8 shadow-lg hover:shadow-2xl transition"
                        >
                            {!showCreateForm ? (
                                <>
                                    <h2 className="text-2xl font-semibold text-foreground mb-4">
                                        Create a New Room
                                    </h2>
                                    <p className="text-muted-foreground mb-6">
                                        Start a fresh canvas and invite others to collaborate.
                                    </p>
                                    <Button
                                        type="button"
                                        onClick={() => setShowCreateForm(true)}
                                        className="inline-block w-full rounded-md px-6 py-3 font-medium bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:opacity-90 transition animate-pulse-glow"
                                    >
                                        Create Room
                                    </Button>
                                </>
                            ) : (
                                <form onSubmit={handleCreate} className="space-y-4">
                                    <h2 className="text-2xl font-semibold text-foreground mb-4">
                                        Enter Room Name
                                    </h2>
                                    <input
                                        type="text"
                                        value={roomName}
                                        onChange={(e) => setRoomName(e.target.value)}
                                        placeholder="e.g. My Creative Space"
                                        className="w-full rounded-md border border-border bg-background/80 px-4 py-3 text-center text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                        required
                                    />
                                    <div className="flex gap-4">
                                        <Button
                                            type="submit"
                                            className="flex-1 rounded-md px-6 py-3 font-medium bg-[hsl(var(--primary))] text-white hover:opacity-90 transition"
                                        >
                                            Create
                                        </Button>
                                        <Button
                                            type="button"
                                            onClick={() => setShowCreateForm(false)}
                                            className="flex-1 rounded-md px-6 py-3 font-medium border border-border bg-background/80 text-foreground hover:opacity-80 transition"
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </form>
                            )}
                        </motion.div>

                        {/* Join Room */}
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.97 }}
                            className="glass rounded-xl p-8 shadow-lg hover:shadow-2xl transition"
                        >
                            {!showJoinForm ? (
                                <>
                                    <h2 className="text-2xl font-semibold text-foreground mb-4">
                                        Join a Room
                                    </h2>
                                    <p className="text-muted-foreground mb-6">
                                        Enter a room code to join an existing collaboration.
                                    </p>
                                    <Button
                                        type="button"
                                        onClick={() => setShowJoinForm(true)}
                                        className="inline-block w-full rounded-md px-6 py-3 font-medium bg-[hsl(var(--secondary))] text-white hover:opacity-90 transition animate-pulse-glow"
                                    >
                                        Join Room
                                    </Button>
                                </>
                            ) : (
                                <form onSubmit={handleJoin} className="space-y-4">
                                    <h2 className="text-2xl font-semibold text-foreground mb-4">
                                        Enter Room ID
                                    </h2>
                                    <input
                                        type="text"
                                        value={roomId}
                                        onChange={(e) => setRoomId(e.target.value)}
                                        placeholder="e.g. abc-123-xyz"
                                        className="w-full rounded-md border border-border bg-background/80 px-4 py-3 text-center text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                        required
                                    />
                                    <div className="flex gap-4">
                                        <Button
                                            type="submit"
                                            className="flex-1 rounded-md px-6 py-3 font-medium bg-[hsl(var(--secondary))] text-white hover:opacity-90 transition"
                                        >
                                            Join
                                        </Button>
                                        <Button
                                            type="button"
                                            onClick={() => setShowJoinForm(false)}
                                            className="flex-1 rounded-md px-6 py-3 font-medium border border-border bg-background/80 text-foreground hover:opacity-80 transition"
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </form>
                            )}
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}
