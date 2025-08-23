import { HTTP_BACKEND } from "@/config";
import axios from "axios";

export async function getExistingData(roomId: number) {

    const response = await axios.get(`${HTTP_BACKEND}/chats/${roomId}`,{
        headers: {
            "access-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjQ1NGZiYTJlLTBjMGUtNGYxMi05NDI2LTEwMzI0MjJjYTQzNiIsImVtYWlsIjoic2F1cmF2N0BnbWFpbC5jb20iLCJuYW1lIjpudWxsLCJiaW8iOm51bGwsInBob3RvIjpudWxsLCJpYXQiOjE3NTU5MzAyOTYsImV4cCI6MTc1NjAxNjY5Nn0.xMNPxwIT2V6RYDPTDvJWZ-wAOpUs6L8VVZ3UCZ0yrCY"
        }
    });
    const messages = response.data.data;

    // @ts-ignore
    const shape = messages.map((details: any) => {
        const data = JSON.parse(details.message);
        return data;
    })

    console.log(shape);
    return shape;
}