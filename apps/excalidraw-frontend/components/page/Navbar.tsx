'use client'

import { useState } from "react";
import { TextCursor, Square, Diamond, Circle, Eraser, Layers, Text, Pencil, SeparatorHorizontal , Image} from "lucide-react";
import { Button } from "@repo/ui/components/button";
export default function Navbar() {
    const [active, setActive] = useState(1);

    const tools = [
            { id: 1, icon: TextCursor },
            { id: 2, icon: Square },
            { id: 3, icon: Diamond },
            { id: 4, icon: Circle },
            { id: 5, icon: SeparatorHorizontal },
            { id: 6, icon: Pencil },
            { id: 7, icon: Text },
            { id: 8, icon: Image },
            { id: 9, icon: Eraser },
            { id: 10, icon: Layers },
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
