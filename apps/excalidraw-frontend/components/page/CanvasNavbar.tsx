'use client'

import { useState } from "react";
import { Menu, Share2, BookOpen } from "lucide-react";
import { Button } from "@repo/ui/components/button";
export default function Navbar() {
    const [active, setActive] = useState(1);

    const tools = [
        { id: 1, icon: "cursor" },
        { id: 2, icon: "square" },
        { id: 3, icon: "diamond" },
        { id: 4, icon: "circle" },
        { id: 5, icon: "line" },
        { id: 6, icon: "pencil" },
        { id: 7, icon: "text" },
        { id: 8, icon: "image" },
        { id: 9, icon: "eraser" },
        { id: 10, icon: "layers" },
    ];

    return (
        <div className="flex items-center justify-between p-4 bg-white shadow-md rounded-xl">
        {/* Left Menu */}
        <Button variant="ghost" size="icon" className="rounded-xl">
            <Menu />
        </Button>

        {/* Center Toolbar */}
        <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-xl shadow">
            {tools.map((tool) => (
            <button
                key={tool.id}
                onClick={() => setActive(tool.id)}
                className={`p-2 rounded-lg text-sm ${
                active === tool.id ? "bg-indigo-100 text-indigo-700" : "text-gray-600"
                }`}
            >
                {tool.icon}
            </button>
            ))}
        </div>

        {/* Right Buttons */}
        <div className="flex items-center gap-2">
            <Button className="bg-indigo-500 text-white hover:bg-indigo-600 rounded-xl">
            <Share2 size={16} /> Share
            </Button>
            <Button variant="outline" className="rounded-xl">
            <BookOpen size={16} /> Library
            </Button>
        </div>
        </div>
    );
}
