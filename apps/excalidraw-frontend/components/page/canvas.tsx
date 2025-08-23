'use client'

import { useEffect, useRef, useState } from "react"
import { Draw } from "../draw/draw";


export default function Canvas ({roomId, socket}: {
    roomId: number,
    socket: WebSocket
}) {

    const [ selectedShape, setSelectedShape ] = useState<"rect" | "circle">('rect');

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const drawRef = useRef<Draw | null>(null);


    useEffect(() => {
        const canvas = canvasRef.current;
        if(!canvas) return;
        
        /* create draw instance */
        const draw = new Draw(
            canvas,
            selectedShape,
            [],
            socket,
            roomId
        )
        
        drawRef.current = draw;

        // Cleanup on unmount
        return () => {
            draw.destroyMouseHandler();
            socket.close();
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