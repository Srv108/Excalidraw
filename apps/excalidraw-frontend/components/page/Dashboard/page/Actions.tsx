import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@repo/ui/components/button';

export default function Actions(){

    const router = useRouter();

    return (
        <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-main animate-gradient" />
        
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-white/10 animate-float" />
        <div className="absolute bottom-10 right-10 w-24 h-24 rounded-full bg-white/10 animate-float" style={{ animationDelay: '3s' }} />
        <div className="absolute top-1/2 left-1/4 w-16 h-16 rounded-full bg-white/5 animate-float" style={{ animationDelay: '1.5s' }} />
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">
            <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            >
            <div className="flex justify-center mb-6">
                <div className="glass rounded-full p-4">
                <Sparkles className="w-12 h-12 text-white" />
                </div>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Ready to Start Creating?
            </h2>
            
            <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed max-w-2xl mx-auto">
                Join thousands of creators who are already bringing their ideas to life. 
                Start your creative journey today – completely free!
            </p>
            
            <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                viewport={{ once: true }}
            >
                <Button 
                size="lg" 
                onClick={() => router.push('/signin')}
                className="glass hover:glass text-foreground group hover:scale-105 transition-all duration-300 px-8 py-4 text-lg font-semibold animate-pulse-glow"
                >
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                
                <div className="text-white/80 text-sm">
                No credit card required • Free forever
                </div>
            </motion.div>
            </motion.div>
            
            {/* Stats */}
            <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16"
            >
            <div className="glass rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-white mb-2">10K+</div>
                <div className="text-white/80">Active Creators</div>
            </div>
            <div className="glass rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-white mb-2">1M+</div>
                <div className="text-white/80">Drawings Created</div>
            </div>
            <div className="glass rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-white mb-2">99%</div>
                <div className="text-white/80">User Satisfaction</div>
            </div>
            </motion.div>
        </div>
        </section>
    );
};
