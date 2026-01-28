import { HTTP_BACKEND } from "@/config";
import axios from "axios";

type messageDetails = {
    id: number,
    type: string,
    message: string,
    roomId: number | null
}
export async function getExistingData(roomId: number, token: string, page: number = 1) {
    
    const response = await axios.get(`${HTTP_BACKEND}/chats/${roomId}`,{
        headers: {
            'access-token': token
        },
        params: {
            page: page
        }
    });
    const messages = response.data.data;

    // Filter messages by page number
    const shape = messages
        .map((details: messageDetails) => {
            const data = JSON.parse(details.message);
            return {
                ...data,
                chatId: details.id,  // Include the chat ID for deletion
                page: data.page || 1  // Default to page 1 for old data
            };
        })
        .filter((item: { page: number }) => item.page === page);  // Only return items for current page

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