// 'use client';

// import { createContext } from 'zustand/context';
// import { create } from 'zustand';
// import { ReactNode } from 'react';

// interface StoreState {
//   user: string | null;
//   setUser: (user: string | null) => void;

//   isConnected: boolean;
//   setConnected: (status: boolean) => void;

//   token: string | null;
//   setToken: (jwt: string) => void;
// }

// // Create a vanilla store factory
// const createStore = () =>
//   create<StoreState>((set) => ({
//     user: null,
//     setUser: (user) => set({ user }),

//     isConnected: false,
//     setConnected: (status) => set({ isConnected: status }),

//     token: null,
//     setToken: (jwt: string) => set({ token: jwt }),
//   }));

// // Create a Zustand context
// const { Provider, useStore } = createContext<ReturnType<typeof createStore>>();

// // Wrap in a Provider
// export function StoreProvider({ children }: { children: ReactNode }) {
//   return <Provider createStore={createStore}>{children}</Provider>;
// }

// // Export the hook to access store
// export { useStore };
