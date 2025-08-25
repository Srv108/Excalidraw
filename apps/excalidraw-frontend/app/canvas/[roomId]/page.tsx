'use client'
import RoomCanvas from "@/app/(workspace)/room/RoomCanvas";
import { SessionProvider } from "next-auth/react";
import { useParams } from "next/navigation";

export default function  Room() {

    const roomId = useParams();
    if(!roomId) return;

    console.log(roomId);

    return (
        <SessionProvider> <RoomCanvas /> </SessionProvider>
        
    )
}