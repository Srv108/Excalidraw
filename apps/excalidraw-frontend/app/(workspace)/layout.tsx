import Navbar from "@/components/page/Home/Navbar";

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="w-full h-screen flex flex-col overflow-hidden">
            <Navbar />  

            <div className="flex-1 overflow-hidden">
                {children}
            </div>
        </div>
    )
}
