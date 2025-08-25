'use client'

import { useEffect, useRef, useState } from "react"
import { AnyShape, Draw } from "../draw/draw";
import { Arrow, Circle, Diamond, Line, Rectangle, Text } from "../draw/shapes";
import { ActiveShape } from "./RoomCanvas";
import { useSession } from "next-auth/react";

export type ShapeConstructor = 
            | (new (x: number, y: number, width: number, height: number, fillColor: string) => AnyShape) 
            | (new (x: number, y: number, text: string, fontSize: number) => Text)

/* map shape constructor */
const ShapeRegistry: Record< string, ShapeConstructor> = {
    rect: Rectangle,
    circle: Circle,
    line: Line,
    diamond: Diamond,
    arrow: Arrow,
    text: Text
}

export default function Canvas({
    roomId,
    socket,
    activeShape
}: {
    roomId: number | null,
    socket: WebSocket,
    activeShape: ActiveShape
}) {

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const drawRef = useRef<Draw | null>(null);
    const [existingShapes, setExistingShapes] = useState<
        { type: string; shape: AnyShape | Text }[]
    >([]);
    const [ jwtToken, setJwtToken ] = useState<string | null>(null);

    const { data: session } = useSession();

    useEffect(() => {
        console.log(session);
        if(session){
            setJwtToken(session.jwt ?? null);
        }
    },[ session ])


    useEffect(() => {
        if(drawRef.current) {
            drawRef.current.selectedShape = activeShape;
        }
    }, [activeShape]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !socket || roomId === null || jwtToken === null) return;

        const draw = new Draw(canvas, activeShape, existingShapes, socket, roomId, jwtToken);
        drawRef.current = draw;
        draw.init();

        return () => {
            draw.destroyMouseHandler();
        };
    }, [roomId, socket, jwtToken]);

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
            const text = shape?.text ?? "Hey Saurav";
            const fontSize = shape?.fontSize ?? 30;
            const fillColor = shape?.fillColor ?? "red";

            let reconstructedShape;

            if(type === 'text'){
                console.log(shape);
                const TextClass = ShapeClass as new (x: number, y: number, text: string, fontSize: number, fillColor: string) => Text;
                reconstructedShape = new TextClass(startX, startY, text, fontSize, fillColor);
            } else {
                const GenericClass =  ShapeClass as new (x: number, y: number, width: number, height: number) => AnyShape;
                reconstructedShape = new GenericClass(startX, startY, width, height);
            }

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