import { Button } from "@repo/ui/components/button";
import { ArrowRight, Play } from "lucide-react";
import heroIllustration from "./hero-illustration.png";
import Image from "next/image";


const Hero = () => {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-subtle">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-1/2 -right-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float"></div>
            <div className="absolute -bottom-1/2 -left-1/2 w-96 h-96 bg-creative/5 rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
        </div>

        <div className="container mx-auto px-6 pt-20 pb-16 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="space-y-8 animate-fade-up">
                <div className="space-y-4">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-light/20 text-primary text-sm font-medium">
                    ✨ Virtual whiteboard for everyone
                </div>
                <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                    Think, sketch,{" "}
                    <span className="bg-gradient-hero bg-clip-text text-transparent">
                    create
                    </span>{" "}
                    together
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
                    Turn your ideas into beautiful hand-drawn like diagrams. 
                    Collaborate in real-time with anyone, anywhere.
                </p>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                    variant="hero"
                    size="lg" 
                    className="hover-lift group"
                >
                    Start Drawing Free
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button 
                    variant="outline" 
                    size="lg"
                    className="hover-lift group"
                >
                    <Play className="mr-2 h-5 w-5" />
                    Watch Demo
                </Button>
                </div>

                {/* Social Proof */}
                <div className="flex items-center space-x-8 text-muted-foreground">
                <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">2M+</div>
                    <div className="text-sm">Active Users</div>
                </div>
                <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">50M+</div>
                    <div className="text-sm">Diagrams Created</div>
                </div>
                <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">99.9%</div>
                    <div className="text-sm">Uptime</div>
                </div>
                </div>
            </div>

            {/* Hero Image */}
            <div className="relative animate-fade-up" style={{animationDelay: '0.2s'}}>
                <div className="relative">
                <Image
                    src={heroIllustration}
                    alt="People collaborating on Excalidraw"
                    className="w-full h-auto rounded-2xl shadow-large hover-lift"
                />
                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-creative rounded-xl shadow-creative animate-float flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                </div>
                <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-primary rounded-lg shadow-medium animate-float flex items-center justify-center" style={{animationDelay: '1.5s'}}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
                    <circle cx="12" cy="12" r="3"/>
                    <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1"/>
                    </svg>
                </div>
                </div>
            </div>
            </div>
        </div>
        </section>
    );
};

export default Hero;