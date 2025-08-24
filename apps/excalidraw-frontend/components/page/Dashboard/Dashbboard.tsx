import React from 'react';
import { motion } from 'framer-motion';
import Hero from './page/HeroSection';
import Feature from './page/FeaturesSection';
import Actions from './page/Actions';

const Index = () => {
    return (
        <main className="overflow-hidden">
            {/* Hero Section */}
            <Hero />
            
            {/* Features Section */}
            <Feature />
            
            {/* Call to Action Section */}
            <Actions/>
            
            {/* Footer */}
            <footer className="py-12 px-4 bg-muted/5">
                <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center"
                >
                    <h3 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent">
                    DoodleGlow
                    </h3>
                    <p className="text-muted-foreground mb-6">
                    The ultimate creative canvas for modern teams
                    </p>
                    <div className="flex justify-center items-center gap-8 text-sm text-muted-foreground">
                    <span>© 2024 DoodleGlow. All rights reserved.</span>
                    <span>Privacy Policy</span>
                    <span>Terms of Service</span>
                    </div>
                </motion.div>
                </div>
            </footer>
        </main>
    );
};

export default Index;