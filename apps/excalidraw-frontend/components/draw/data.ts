import { HTTP_BACKEND } from "@/config";
import axios from "axios";

import { AnyShape } from "./draw";

type messageDetails = {
    type: string,
    message: string,
    roomId: number
}
export async function getExistingData(roomId: number) {

    const response = await axios.get(`${HTTP_BACKEND}/chats/${roomId}`,{
        headers: {
            "access-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjQ1NGZiYTJlLTBjMGUtNGYxMi05NDI2LTEwMzI0MjJjYTQzNiIsImVtYWlsIjoic2F1cmF2N0BnbWFpbC5jb20iLCJuYW1lIjpudWxsLCJiaW8iOm51bGwsInBob3RvIjpudWxsLCJpYXQiOjE3NTYwMTgzMjQsImV4cCI6MTc1NjEwNDcyNH0.3poxQyx3OnpGriSsPhxcSIqt00gILtIlraK4Zwtvr7Q"
        }
    });
    const messages = response.data.data;

    const shape = messages.map((details: messageDetails) => {
        const data = JSON.parse(details.message);
        return data;
    })

    return shape;
}