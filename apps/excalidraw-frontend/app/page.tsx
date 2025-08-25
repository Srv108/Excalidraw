"use client";

import Dashbboard from "@/components/page/Dashboard/Dashbboard";
import { SessionProvider } from "next-auth/react";
export default function LandingPage() {
  return <SessionProvider> <Dashbboard /> </SessionProvider>
}
