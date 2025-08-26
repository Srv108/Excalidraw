'use client'
import RoomCanvas from "@/app/(workspace)/room/RoomCanvas";
import { SessionProvider } from "next-auth/react";

export default function  Room() {

    return (
        <SessionProvider> <RoomCanvas /> </SessionProvider>
    )
}