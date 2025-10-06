import { HTTP_BACKEND } from "@/config";
import axios from "axios";

type messageDetails = {
    id: number,
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

    const shape = messages.map((details: messageDetails) => {
        const data = JSON.parse(details.message);
        return {
            ...data,
            chatId: details.id  // Include the chat ID for deletion
        };
    })

    return shape;
}

export async function deleteShape(chatId: number, token: string) {
    try {
        const response = await axios.delete(`${HTTP_BACKEND}/chat/${chatId}`, {
            headers: {
                'access-token': token
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting shape:', error);
        throw error;
    }
}