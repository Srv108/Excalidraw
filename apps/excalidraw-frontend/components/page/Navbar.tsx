import { ArrowRight, Diamond, Circle, Eraser, Layers, Pencil , Image, RectangleHorizontalIcon, Minus, LucideIcon, Text as TextIcon} from "lucide-react";
import { Button } from "@repo/ui/components/button";
import { ActiveShape } from "./RoomCanvas";

interface NavbarProps {
    activeShape: ActiveShape,
    setActiveShape: React.Dispatch<React.SetStateAction<ActiveShape>>
}

export default function Navbar({ activeShape, setActiveShape }: NavbarProps) {

    const tools: {id: string, icon: LucideIcon}[] = [
            { id: 'rect', icon: RectangleHorizontalIcon },
            { id: 'diamond', icon: Diamond },
            { id: 'circle', icon: Circle },
            { id: 'arrow', icon: ArrowRight },
            { id: 'line', icon: Minus },
            { id: 'pencil', icon: Pencil },
            { id: 'text', icon: TextIcon },
            { id: 'img', icon: Image },
            { id: 'eraser', icon: Eraser },
            { id: 'layers', icon: Layers },
        ];


    return (
        
        <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-xl shadow">
        {tools.map((tool: {id: string, icon: LucideIcon}) => (
            <Button
                key={tool.id}
                onClick={() => setActiveShape(tool.id as ActiveShape)}
                className={`p-2 rounded-lg text-sm ${
                    activeShape === tool.id
                    ? "bg-gray-500 text-white shadow-md"  // Active = purple with white icon
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200" // Inactive = neutral gray
                }`}
                >
                <tool.icon className="w-5 h-5" />
            </Button>
        ))}
        </div>
    );
}
