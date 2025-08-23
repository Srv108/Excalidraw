'use client'

import { useState } from "react";
import { Square, Diamond, Circle, Eraser, Layers, Text, Pencil, SeparatorHorizontal , Image} from "lucide-react";
import { Button } from "@repo/ui/components/button";
export default function Navbar() {
    const [active, setActive] = useState('rect');

    const tools = [
            { id: 'square', icon: Square },
            { id: 'diamond', icon: Diamond },
            { id: 'circle', icon: Circle },
            { id: 'line', icon: SeparatorHorizontal },
            { id: 'pencil', icon: Pencil },
            { id: 'text', icon: Text },
            { id: 'img', icon: Image },
            { id: 'eraser', icon: Eraser },
            { id: 'layers', icon: Layers },
        ];


    return (
        
        <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-xl shadow">
            {tools.map((tool) => (
            <Button
                key={tool.id}
                onClick={() => setActive(tool.id)}
                className={`p-2 rounded-lg text-sm text-black ${
                active === tool.id ? "bg-indigo-100 text-indigo-700" : "text-gray-600"
                }`}
            >
                <tool.icon className="w-5 h-5" />
            </Button>
            ))}
        </div>

    );
}
