import { Square, Diamond, Circle, Eraser, Layers, Text, Pencil, SeparatorHorizontal , Image, RectangleHorizontalIcon} from "lucide-react";
import { Button } from "@repo/ui/components/button";
import { ActiveShape } from "./RoomCanvas";

interface NavbarProps {
    activeShape: ActiveShape,
    setActiveShape: React.Dispatch<React.SetStateAction<ActiveShape>>
}

export default function Navbar({ activeShape, setActiveShape }: NavbarProps) {

    const tools = [
            { id: 'rect', icon: RectangleHorizontalIcon },
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
                    onClick={() => setActiveShape(tool.id as ActiveShape)}
                    className={`p-2 rounded-lg text-sm text-black ${
                        activeShape === tool.id ? "bg-indigo-100 text-indigo-700" : "text-gray-600"
                    }`}
                >
                    <tool.icon className="w-5 h-5" />
                </Button>
            ))}
        </div>

    );
}
