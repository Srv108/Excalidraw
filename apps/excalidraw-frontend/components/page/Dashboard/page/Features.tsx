import { Button } from "@repo/ui/components/button";
import { Card, CardContent } from "@repo/ui/components/card";
import { Users, Palette, Zap, Download, Globe, Shield } from "lucide-react";

const Features = () => {
    const features = [
        {
        icon: Users,
        title: "Real-time Collaboration",
        description: "Work together with your team in real-time. See cursors, selections, and changes as they happen."
        },
        {
        icon: Palette,
        title: "Hand-drawn Feel",
        description: "Create beautiful diagrams with a natural, hand-drawn aesthetic that feels personal and engaging."
        },
        {
        icon: Zap,
        title: "Lightning Fast",
        description: "Built for speed and performance. Start drawing instantly without any setup or installation."
        },
        {
        icon: Download,
        title: "Export Anywhere",
        description: "Export your creations as PNG, SVG, or share them directly with a simple link."
        },
        {
        icon: Globe,
        title: "Works Everywhere",
        description: "Access from any device with a web browser. No downloads, no installations required."
        },
        {
        icon: Shield,
        title: "Privacy First",
        description: "Your data stays private. End-to-end encryption ensures your ideas remain secure."
        }
    ];

    return (
        <section id="features" className="py-24 bg-background">
        <div className="container mx-auto px-6">
            {/* Section Header */}
            <div className="text-center mb-16 animate-fade-up">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-creative-light/20 text-creative text-sm font-medium mb-4">
                🚀 Powerful Features
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Everything you need to{" "}
                <span className="bg-gradient-creative bg-clip-text text-transparent">
                bring ideas to life
                </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                From simple sketches to complex diagrams, Excalidraw provides all the tools 
                you need to visualize your thoughts and collaborate effectively.
            </p>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
                <Card 
                key={index} 
                className="bg-gradient-card border-0 shadow-soft hover-lift animate-fade-up"
                style={{animationDelay: `${index * 0.1}s`}}
                >
                <CardContent className="p-8">
                    <div className="mb-4">
                    <div className="w-12 h-12 bg-gradient-hero rounded-xl flex items-center justify-center mb-4">
                        <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                        {feature.description}
                    </p>
                    </div>
                </CardContent>
                </Card>
            ))}
            </div>

            {/* Bottom CTA */}
            <div className="text-center mt-16 animate-fade-up">
            <div className="bg-gradient-card rounded-2xl p-8 shadow-medium max-w-4xl mx-auto">
                <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Ready to start creating?
                </h3>
                <p className="text-muted-foreground mb-6 text-lg">
                Join millions of creators who use Excalidraw to bring their ideas to life.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="hero" size="lg" className="hover-lift">
                    Try it Free
                </Button>
                <Button variant="outline" size="lg" className="hover-lift">
                    View Examples
                </Button>
                </div>
            </div>
            </div>
        </div>
        </section>
    );
};

export default Features;