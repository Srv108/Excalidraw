"use client";

import { Button } from "@repo/ui/button"; // your shared Button
import { Card } from "@repo/ui/card";   // your shared Card
import { motion } from "framer-motion";
import { Pencil, Users, Share2, Zap } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50 text-gray-900">
      {/* Navbar */}
      <header className="flex items-center justify-between px-8 py-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-blue-600">Excalidraw</h1>
        <nav className="hidden md:flex gap-6 text-gray-700">
          <a href="#features" className="hover:text-blue-600 transition">
            Features
          </a>
          <a href="#use-cases" className="hover:text-blue-600 transition">
            Use Cases
          </a>
          <a href="#community" className="hover:text-blue-600 transition">
            Community
          </a>
        </nav>
        <Button appName="landing" variant="primary" size="sm">
          Get Started
        </Button>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center text-center px-6 md:px-12 py-20">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl font-extrabold mb-6"
        >
          Sketch, Collaborate, <span className="text-blue-600">Create</span>.
        </motion.h2>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mb-8">
          Excalidraw is a virtual whiteboard for sketching diagrams, brainstorming ideas, and collaborating in real-time — simple, fast, and fun.
        </p>
        <div className="flex gap-4">
          <Button appName="landing" variant="primary" size="lg">
            Start Drawing
          </Button>
          <Button appName="landing" variant="outline" size="lg">
            Learn More
          </Button>
        </div>

        {/* Hero Image */}
        <motion.img
          src="https://excalidraw.com/og-image.png"
          alt="Excalidraw sketch preview"
          className="mt-12 rounded-2xl shadow-xl border"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        />
      </section>

      {/* Features */}
      <section id="features" className="px-6 md:px-12 py-20 bg-white">
        <h3 className="text-3xl font-bold text-center mb-12">Why Excalidraw?</h3>
        <div className="grid md:grid-cols-3 gap-8">
          <Card title="Easy Drawing" href="#">
            <Pencil className="w-6 h-6 text-blue-600 mb-2" />
            Freehand style drawing that feels natural and fun.
          </Card>
          <Card title="Real-time Collaboration" href="#">
            <Users className="w-6 h-6 text-blue-600 mb-2" />
            Work together with your team live on the same canvas.
          </Card>
          <Card title="Share Anywhere" href="#">
            <Share2 className="w-6 h-6 text-blue-600 mb-2" />
            Export, embed, and share your sketches with ease.
          </Card>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <h3 className="text-3xl md:text-4xl font-bold mb-6">
          Ready to bring your ideas to life?
        </h3>
        <Button appName="landing" variant="secondary" size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
          Start Drawing Free
        </Button>
      </section>

      {/* Footer */}
      <footer className="px-6 md:px-12 py-8 text-center text-gray-500 text-sm border-t border-gray-200">
        Built with ❤️ by the Excalidraw community · © {new Date().getFullYear()}
      </footer>
    </div>
  );
}
