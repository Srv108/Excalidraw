import { create } from "zustand";

interface StoreState {
    user: string | null;
    setUser: (user: string | null) => void;

    isConnected: boolean;
    setConnected: (status: boolean) => void;

    token: string | null,
    setToken: (jwt: string) => void
}

export const useStore = create<StoreState>((set) => ({
    user: null,
    setUser: (user) => set({ user }),

    isConnected: false,
    setConnected: (status) => set({ isConnected: status }),

    token: null,
    setToken: (jwt: string) => set({token: jwt})
}));
