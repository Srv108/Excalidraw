'use client';

import { ReactNode, useEffect } from 'react';
import { SessionProvider } from "next-auth/react";
// import { useStore } from '@/hooks/store/useStore';

export default function WorkspaceLayoutClient({
    children,
    }: {
    children: ReactNode;
    }) {
    // const setToken = useStore((state: any) => state.setToken);

    // useEffect(() => {
    //     if (jwtToken) {
    //     setToken(jwtToken);
    //     }
    // }, [jwtToken, setToken]);

    return <SessionProvider>{children}</SessionProvider>;
}
