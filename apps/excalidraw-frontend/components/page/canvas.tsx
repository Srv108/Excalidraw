'use client'

import { useEffect, useRef, useState } from "react"
import Navbar from "./Navbar"
import { Rectangle, Circle } from "../draw/shapes";
import { Draw } from "../draw/draw";


export default function Canvas () {

    const [ selectedShape, setSelectedShape ] = useState<"rect" | "circle">('rect');

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const drawRef = useRef<Draw | null>(null);
    // const socketRef = useRef<WebSocket | null>(null);




    useEffect(() => {
        const canvas = canvasRef.current;
        if(!canvas) return;
        
        /* create draw instance */
        const draw = new Draw(
            canvas,
            selectedShape,
            [],
            // socketRef.current,
            "room1"
        )

        drawRef.current = draw;

        // Cleanup on unmount
        return () => {
            draw.destroyMouseHandler();
            // socket.close();
        }

    }, [ selectedShape ]);

    return <>
        <div>
            <canvas
                ref={canvasRef}
                className="w-screen h-screen bg-white text-2xl font-bold"
            />
        </div>
    </>
}