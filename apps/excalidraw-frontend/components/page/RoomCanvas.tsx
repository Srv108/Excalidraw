'use client'

import { HTTP_BACKEND, WS_URL } from "@/config";
import { useEffect, useRef, useState } from "react";
import PageLoader from "./pageLoader";
import Canvas from "./canvas";
import axios from "axios";

export default function RoomCanvas({ roomId }: { roomId: number }) {
    const socketRef = useRef<WebSocket | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchToken = async () => {
        try {
            const response = await axios.post(`${HTTP_BACKEND}/signin`, {
                email: "saurav7@gmail.com",
                password: "3264o12ifnj",
            });
            return response.data.token;
        } catch (err) {
            console.error("Token fetch error:", err);
            throw new Error("Failed to authenticate. Please check credentials or server.");
        }
    };



    useEffect(() => {
        let isMounted = true;

        const connectWebSocket = async () => {
            try {
                const token = await fetchToken();
                const ws = new WebSocket(`${WS_URL}?token=${token}`);
                socketRef.current = ws;

                ws.onopen = () => {
                    const data = JSON.stringify({
                        type: "join_room",
                        roomId: roomId
                    });
                    ws.send(data);
                    setIsLoading(false);
                };

                // /* update the message */
                // ws.onmessage = (msg) => {
                //     console.log("Message received:", msg.data);
                // };

                ws.onclose = (e) => {
                    console.log(`WebSocket closed - code: ${e.code}, reason: ${e.reason || "No reason"}`);
                    if (isMounted) setIsLoading(true); // Revert to loading if still mounted
                };

                ws.onerror = (e) => {
                    console.error("WebSocket error:", e);
                    if (isMounted) setError("WebSocket connection failed. Check server logs.");
                };

            } catch (err: unknown) {
                console.error("Connection error:", err);
            }
        };

        connectWebSocket();

        return () => {
            isMounted = false;
            if (socketRef.current) {
                socketRef.current.close(1000, "Component unmounted");
                socketRef.current = null;
            }
        };
    }, [roomId]);

    if (isLoading || !socketRef.current) {
        return error ? <div>Error: {error}</div> : <PageLoader />;
    }

    return <Canvas roomId={roomId} socket={socketRef.current} />;
}