'use client'

import { useEffect, useRef, useState } from "react";
import PageLoader from "../../../components/page/pageLoader";
import Canvas from "./canvas";
import Navbar from "../../../components/page/Navbar";
import { HTTP_BACKEND, WS_URL } from "@/config";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { KeyRound, Loader2, Share2 } from "lucide-react";
import { Button } from "@repo/ui/components/button";
import axios from "axios";
import { FcInvite } from "react-icons/fc";


export type ActiveShape = 'rect' | 'circle' | 'diamond' | 'oval' |
                'text' | 'line' | 'arrow' | 'pencil' |
                'eraser' | 'layers' | 'img';

export default function RoomCanvas() {
    const socketRef = useRef<WebSocket | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [ activeShape, setActiveShape ] = useState<ActiveShape>('rect');
    const [ jwtToken, setJwtToken ] = useState<string | null>(null);

    const { data: session, status } = useSession();

    const params = useParams();
    const router = useRouter();
    const roomId = params.roomId ? parseInt(params.roomId as string) : null;

    const [loadingCode, setLoadingCode] = useState(false);
    const [joinCode, setJoinCode] = useState<string | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (jwtToken && roomId) {
            handleAdminStatus();
        }
    }, [jwtToken, roomId])

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push('/signin');
        }
        if(session){
            setJwtToken(session.jwt ?? null);
            if (jwtToken && roomId) {
                handleAdminStatus();
            }
        }
    }, [session]);

    useEffect(() => {
        let isMounted = true;

        const connectWebSocket = async () => {
            try {

                const ws = new WebSocket(`${WS_URL}?token=${jwtToken}`);
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
    }, [roomId, jwtToken]);

    /* check user is the admin of this room or not */
    const handleAdminStatus = async() => {
        try {
            const res = await axios.get(`${HTTP_BACKEND}/admin/${roomId}`,{
                headers: { 'access-token': jwtToken }
            });

            if (res?.data?.status) {
                setIsAdmin(true);
            } else {
                setIsAdmin(false);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleInviteCode = async () => {
        try {
            setLoadingCode(true);
            console.log('loading join code .....');
            const res = await axios.post(`${HTTP_BACKEND}/room-invite`, {
                roomId: roomId
            }, {
                headers: { 'access-token': jwtToken }
            });

            if (res.data?.code) {
                setJoinCode(res.data.code);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoadingCode(false);
        }
    }

    const handleCopy = async() => {
        if (!joinCode) return;
        await navigator.clipboard.writeText(joinCode ?? "");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    if (status === "loading") {
        return <PageLoader />
    }

    if (isLoading || !socketRef.current) {
        return error ? <div>Error: {error}</div> : <PageLoader />;
    }

    return <>
        <div className="relative w-full h-screen">
            {/* Navbar */}

            <div className="absolute top-4 left-0 w-full z-10 flex justify-center">
                <Navbar activeShape={activeShape} setActiveShape={setActiveShape} />
            </div>
            {/* Animated Invite Button in top-right corner */}
            {isAdmin && (
                <div className="absolute top-4 right-8 z-50">
                    <Button 
                        className="p-2 bg-blue-600 text-white hover:bg-blue-700 rounded z-50 relative"
                    >
                        {loadingCode ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                            ) : joinCode ? (
                            <span
                                onClick={handleCopy}
                                className="px-2 py-1 rounded text-white font-bold cursor-pointer bg-blue-600 hover:bg-blue-700"
                            >
                                {copied ? "Copied!" : joinCode}
                            </span>
                            ) : (
                                <div 
                                    onClick={handleInviteCode}
                                    className="flex items-center gap-2 px-2 cursor-pointer"
                                >
                                    <FcInvite
                                        
                                        className="size-4" 
                                    />
                                    <span className="text-sm font-semibold text-shadow-violet-200">
                                        Invite
                                    </span>
                                </div>
                            )
                        }
                    </Button>
                </div>
            )}
            {/* Canvas */}
            <div className="w-full h-full">
                <Canvas activeShape={activeShape} roomId={roomId} socket={socketRef.current} />
            </div>
        </div>
                
    </>
}