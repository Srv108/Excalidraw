import RoomCanvas from "@/components/page/RoomCanvas";

export default async function  Room({ params }: {
    params: {
        roomId: string
    }
}) {

    const roomId = (await params).roomId;
    if(!roomId) return;

    return (
        <RoomCanvas roomId={parseInt(roomId)} />
    )

}