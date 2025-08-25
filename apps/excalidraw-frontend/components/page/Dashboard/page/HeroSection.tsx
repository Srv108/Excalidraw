import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Button } from '@repo/ui/components/button';
import  heroDrawing  from "../../../../public/hero-drawing.jpg";

export default function Hero(){

    const router = useRouter();

    return (
        <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-main animate-gradient" />
        
        {/* Floating shapes for decoration */}
        <div className="absolute top-20 left-10 w-20 h-20 rounded-full bg-primary/20 animate-float" />
        <div className="absolute top-40 right-20 w-32 h-32 rounded-full bg-secondary/20 animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-32 left-1/4 w-16 h-16 rounded-full bg-accent/20 animate-float" style={{ animationDelay: '4s' }} />
        
        <div className="relative z-10 max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
            >
            <motion.h1 
                className="text-5xl md:text-7xl font-bold text-white mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
            >
                Draw Your 
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80 block">
                Ideas to Life
                </span>
            </motion.h1>
            
            <motion.p 
                className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
            >
                Create stunning diagrams, sketches, and collaborate with your team in real-time. 
                The ultimate creative canvas for modern teams.
            </motion.p>
            
            <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
            >
                <Button 
                    size="lg"
                    onClick={() => router.push('/signin')}
                    className=" glass hover:glass text-foreground hover:scale-105 transition-all duration-300 animate-pulse-glow text-lg font-semibold"
                >
                    Start Drawing Now
                </Button>
                <Button 
                    variant="outline" 
                    size="lg"
                    className="glass border-white/30 text-white hover:bg-white/10 hover:scale-105 transition-all duration-300  text-lg"
                >
                    Watch Demo
                </Button>
            </motion.div>
            </motion.div>
            
            <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
            >
            <div className="glass rounded-2xl p-6 shadow-2xl">
                <Image 
                    src={heroDrawing} 
                    alt="Creative drawing illustration" 
                    className="w-full h-auto rounded-xl"
                />
            </div>
            
            {/* Floating UI elements */}
            <motion.div 
                className="absolute -top-6 -right-6 glass rounded-full p-4 shadow-lg"
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 4, repeat: Infinity }}
            >
                <div className="w-6 h-6 bg-primary rounded-full" />
            </motion.div>
            
            <motion.div 
                className="absolute -bottom-6 -left-6 glass rounded-full p-4 shadow-lg"
                animate={{ y: [10, -10, 10] }}
                transition={{ duration: 3, repeat: Infinity }}
            >
                <div className="w-6 h-6 bg-secondary rounded-full" />
            </motion.div>
            </motion.div>
        </div>
        </section>
    );
};

