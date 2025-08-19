import { client } from "@repo/db/client";

export const isUserPartOfRoom = async(roomId: number, user: string) => {
    try {
        const room = await client.roomMember.findFirst({
            where: {roomId: roomId, userId: user}
        });

        if(!room) {
            return new Error('Room doesnot exist');
        }
        /* check user exist as member of room or not */

        return room;

    } catch (error: unknown) {
        console.log(error);
    }
}