import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Navbar from "@/components/page/Home/Navbar";
import WorkspaceLayoutClient from "./workspaceLayoutClient";

export default async function WorkspaceLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions);

    if (!session?.jwt) {
        redirect("/signin");
    }

    return <WorkspaceLayoutClient jwtToken={session.jwt}>
        <div className="w-full h-screen flex flex-col overflow-hidden">
            <Navbar />
            <div className="flex-1 overflow-hidden">
                {children}
            </div>
        </div>
    </WorkspaceLayoutClient>;
}
