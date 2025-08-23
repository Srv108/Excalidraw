import Navbar from "@/components/page/Navbar";
import RoomCanvas from "@/components/page/RoomCanvas";

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
                    <RoomCanvas roomId={parseInt(roomId)} />
                </div>
            </div>
        </>
    )

}