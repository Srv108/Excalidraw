import Canvas from "@/components/page/canvas";
import Navbar from "@/components/page/Navbar";

export default async function  Room({ params }: {
    params: {
        roomId: string
    }
}) {

    const roomId = (await params).roomId;
    if(!roomId) return;

    return (
        <>
            <div className="relative w-full h-screen">
                {/* Navbar absolute on top of Canvas */}
                <div className="absolute top-0 left-0 w-full z-10 flex justify-center">
                    <Navbar />
                </div>

                {/* Canvas takes full screen */}
                <div className="w-full h-full">
                    <Canvas />
                </div>
            </div>
        </>
    )

}