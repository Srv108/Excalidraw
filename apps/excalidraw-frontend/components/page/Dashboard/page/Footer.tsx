import { Github, Twitter, Heart } from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-gradient-subtle border-t border-border">
        <div className="container mx-auto px-6 py-12">
            <div className="grid md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="space-y-4">
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
                <span className="text-xl font-bold">Excalidraw</span>
                </div>
                <p className="text-muted-foreground">
                Virtual collaborative whiteboard tool that lets you easily sketch diagrams with a hand-drawn feel.
                </p>
                <div className="flex space-x-4">
                <a 
                    href="#" 
                    className="text-muted-foreground hover:text-foreground transition-colors hover-bounce"
                    aria-label="GitHub"
                >
                    <Github size={20} />
                </a>
                <a 
                    href="#" 
                    className="text-muted-foreground hover:text-foreground transition-colors hover-bounce"
                    aria-label="Twitter"
                >
                    <Twitter size={20} />
                </a>
                </div>
            </div>

            {/* Product */}
            <div className="space-y-4">
                <h3 className="font-semibold">Product</h3>
                <div className="space-y-2">
                <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors">
                    Features
                </a>
                <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors">
                    Pricing
                </a>
                <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors">
                    API
                </a>
                <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors">
                    Integrations
                </a>
                </div>
            </div>

            {/* Resources */}
            <div className="space-y-4">
                <h3 className="font-semibold">Resources</h3>
                <div className="space-y-2">
                <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors">
                    Documentation
                </a>
                <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors">
                    Tutorials
                </a>
                <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors">
                    Blog
                </a>
                <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors">
                    Community
                </a>
                </div>
            </div>

            {/* Company */}
            <div className="space-y-4">
                <h3 className="font-semibold">Company</h3>
                <div className="space-y-2">
                <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors">
                    About
                </a>
                <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors">
                    Careers
                </a>
                <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors">
                    Contact
                </a>
                <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors">
                    Privacy
                </a>
                </div>
            </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm">
                © 2024 Excalidraw. All rights reserved.
            </p>
            <div className="flex items-center space-x-1 text-muted-foreground text-sm mt-4 md:mt-0">
                <span>Made with</span>
                <Heart size={16} className="text-red-500 fill-current" />
                <span>for creators everywhere</span>
            </div>
            </div>
        </div>
        </footer>
    );
};

export default Footer;