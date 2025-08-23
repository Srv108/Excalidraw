'use client'

import { useEffect, useRef, useState } from "react"
import { AnyShape, Draw } from "../draw/draw";
import { Circle, Rectangle } from "../draw/shapes";


type ShapeConstructor = new (x: number, y: number, width: number, height: number) => AnyShape;

/* map shape constructor */
const ShapeRegistry: Record< string, ShapeConstructor> = {
    rect: Rectangle,
    circle: Circle,
}

export default function Canvas({
    roomId,
    socket,
}: {
    roomId: number;
    socket: WebSocket;
}) {

    const [selectedShape, setSelectedShape] = useState<'rect' | 'circle'>('rect');
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const drawRef = useRef<Draw | null>(null);
    const [existingShapes, setExistingShapes] = useState<
        { type: string; shape: AnyShape }[]
    >([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !socket) return;

        const draw = new Draw(canvas, selectedShape, existingShapes, socket, roomId);
        drawRef.current = draw;

        return () => {
            draw.destroyMouseHandler();
        };
    }, [roomId, socket]);

    // Handle incoming WebSocket messages
    useEffect(() => {
        if (!socket) return;

        const handleMessage = (msg: MessageEvent) => {
        try {
            const payload = JSON.parse(msg.data);
            if (payload.type !== 'chat') return;

            const drawingDetails = JSON.parse(payload.message);
            const { type, shape } = drawingDetails;

            const ShapeClass = ShapeRegistry[type];
            if (!ShapeClass) {
                console.warn(`Shape type "${type}" not registered`);
                return;
            }

            // Ensure required properties exist with fallback values
            const startX = shape.startX ?? 0;
            const startY = shape.startY ?? 0;
            const width = shape.width ?? 0;
            const height = shape.height ?? 0;

            const reconstructedShape = new ShapeClass(startX, startY, width, height);
            const newShape = { type, shape: reconstructedShape };
            setExistingShapes((prev) => [...prev, newShape]);

            if (drawRef.current) {
                drawRef.current.ExistingData = [...drawRef.current.ExistingData, newShape];
                reconstructedShape.draw(drawRef.current.ctx); // Draw new shape directly
            }
        } catch (error) {
            console.error('Error processing message:', error);
        }
        };

        socket.addEventListener('message', handleMessage);

        // Cleanup event listener, but do not close socket
        return () => {
            socket.removeEventListener('message', handleMessage);
        };
    }, [socket]);

    useEffect(() => {
        if (!socket) return;

        const handleClose = (event: CloseEvent) => {
        console.log('Socket closed:', {
            code: event.code,
            reason: event.reason || 'No reason',
            wasClean: event.wasClean,
        });
        };

        const handleError = (error: Event) => {
            console.error('Socket error:', error);
        };

        socket.addEventListener('close', handleClose);
        socket.addEventListener('error', handleError);

        return () => {
            socket.removeEventListener('close', handleClose);
            socket.removeEventListener('error', handleError);
        };
    }, [socket]);

    return (
        <div>
            <canvas ref={canvasRef} className="w-screen h-screen bg-white text-2xl font-bold" />
        </div>
    );
}