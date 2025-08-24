import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@repo/ui/components/card';
import  collaborationImg  from "../../../../public/collaboration.jpg";
import  toolsImg  from "../../../../public/tools-icon.jpg";
import Image from 'next/image';
import { Download, Palette, Pen, Share2, Users, Zap } from 'lucide-react';

const features = [
    {
        icon: <Pen className="w-8 h-8" />,
        title: "Intuitive Drawing Tools",
        description: "Professional drawing tools with smooth pen strokes, shapes, and advanced editing capabilities."
    },
    {
        icon: <Users className="w-8 h-8" />,
        title: "Real-time Collaboration",
        description: "Work together seamlessly with your team. See changes instantly and collaborate in real-time."
    },
    {
        icon: <Zap className="w-8 h-8" />,
        title: "Lightning Fast",
        description: "Optimized performance ensures smooth drawing experience even with complex diagrams."
    },
    {
        icon: <Palette className="w-8 h-8" />,
        title: "Rich Customization",
        description: "Extensive color palettes, brush styles, and customization options for your creative needs."
    },
    {
        icon: <Share2 className="w-8 h-8" />,
        title: "Easy Sharing",
        description: "Share your creations instantly with team members or export in multiple formats."
    },
    {
        icon: <Download className="w-8 h-8" />,
        title: "Multiple Exports",
        description: "Export your work as PNG, SVG, PDF, or other formats for any use case."
    }
];

export default function Feature() {
    return (
        <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-muted/20 to-background" />
        
        <div className="relative z-10 max-w-6xl mx-auto">
            <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
            >
            <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent">
                Powerful Features
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Everything you need to bring your ideas to life with professional-grade tools and seamless collaboration.
            </p>
            </motion.div>

            {/* Feature Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {features.map((feature, index) => (
                <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                >
                <Card className="glass p-6 hover:scale-105 transition-all duration-300 h-full">
                    <div className="text-primary mb-4">
                    {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                </Card>
                </motion.div>
            ))}
            </div>

            {/* Visual Showcase */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
            >
                <div className="glass rounded-2xl p-6 shadow-2xl">
                <Image 
                    src={collaborationImg} 
                    alt="Team collaboration" 
                    className="w-full h-auto rounded-xl"
                />
                </div>
            </motion.div>
            
            <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="space-y-6"
            >
                <h3 className="text-3xl md:text-4xl font-bold">
                Collaborate Like Never Before
                </h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                Experience seamless real-time collaboration with your team. Watch as ideas come together 
                instantly, with every stroke and edit synchronized across all devices.
                </p>
                <div className="flex items-center gap-4">
                <div className="glass rounded-lg p-4">
                    <Image 
                    src={toolsImg} 
                    alt="Creative tools" 
                    className="w-16 h-16 object-cover rounded"
                    />
                </div>
                <div>
                    <h4 className="font-semibold text-lg">Professional Tools</h4>
                    <p className="text-muted-foreground">Access to premium drawing and design tools</p>
                </div>
                </div>
            </motion.div>
            </div>
        </div>
        </section>
    );
};
