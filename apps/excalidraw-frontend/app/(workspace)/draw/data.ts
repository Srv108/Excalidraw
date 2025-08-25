import { HTTP_BACKEND } from "@/config";
import axios from "axios";

type messageDetails = {
    type: string,
    message: string,
    roomId: number | null
}
export async function getExistingData(roomId: number, token: string) {
    
    const response = await axios.get(`${HTTP_BACKEND}/chats/${roomId}`,{
        headers: {
            'access-token': token
        }
    });
    const messages = response.data.data;

    console.log(messages);
    const shape = messages.map((details: messageDetails) => {
        const data = JSON.parse(details.message);
        return data;
    })

    return shape;
}