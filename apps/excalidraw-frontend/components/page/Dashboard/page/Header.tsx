'use client'

import { Button } from "@repo/ui/components/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <nav className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-hero rounded-lg flex items-center justify-center">
                <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24" 
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-white"
                >
                    <path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"/>
                    <polygon points="18,2 22,6 12,16 8,16 8,12 18,2"/>
                </svg>
                </div>
                <span className="text-xl font-bold text-foreground">Excalidraw</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
                <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                Features
                </a>
                <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors">
                About
                </a>
                <a href="#community" className="text-muted-foreground hover:text-foreground transition-colors">
                Community
                </a>
                <Button variant="outline" size="sm">
                Sign in
                </Button>
                <Button variant="hero" size="sm">
                Get Started
                </Button>
            </div>

            {/* Mobile menu button */}
            <button
                className="md:hidden p-2"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
            >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            </div>

            {/* Mobile Navigation */}
            {isMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-border">
                <div className="flex flex-col space-y-4 pt-4">
                <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                    Features
                </a>
                <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors">
                    About
                </a>
                <a href="#community" className="text-muted-foreground hover:text-foreground transition-colors">
                    Community
                </a>
                <div className="flex flex-col space-y-2 pt-2">
                    <Button variant="outline" size="sm">
                    Sign in
                    </Button>
                    <Button variant="hero" size="sm">
                    Get Started
                    </Button>
                </div>
                </div>
            </div>
            )}
        </nav>
        </header>
    );
};

export default Header;