'use client';

import { ReactNode, useEffect } from 'react';
import { SessionProvider } from "next-auth/react";
import { useStore } from '@/hooks/store/useStore';

export default function WorkspaceLayoutClient({
    jwtToken,
    children,
    }: {
    jwtToken: string;
    children: ReactNode;
    }) {
    const setToken = useStore((state) => state.setToken);

    useEffect(() => {
        if (jwtToken) {
        setToken(jwtToken);
        }
    }, [jwtToken, setToken]);

    return <SessionProvider>{children}</SessionProvider>;
}
