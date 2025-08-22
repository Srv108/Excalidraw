import Canvas from "@/components/page/canvas";

export default async function  Room({ params }: {
    params: {
        roomId: string
    }
}) {

    const roomId = (await params).roomId;
    if(!roomId) return;

    return <div>
        <Canvas roomId={roomId} />
    </div>
}