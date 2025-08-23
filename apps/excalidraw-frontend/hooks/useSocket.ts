"use client";

import { useEffect, useRef } from "react";

let socket: WebSocket | null = null; // Singleton instance

export default function useWebSocket(
    url: string,
    onMessage?: (event: MessageEvent) => void
) {

    const socketRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        if (!socket) {
        socket = new WebSocket(url);

        socket.onopen = () => console.log("WebSocket connected:", url);
        
        socket.onclose = (e) =>
            console.log("WebSocket closed:", e.code, e.reason || "No reason");
            socket.onerror = (e) => console.error("WebSocket error:", e);
        }

        socketRef.current = socket;

        if (onMessage) {
            socket.addEventListener("message", onMessage);
        }

        return () => {
            if (onMessage && socket) {
                socket.removeEventListener("message", onMessage);
            }
        };
    }, [url, onMessage]);

    return socketRef.current;
}
