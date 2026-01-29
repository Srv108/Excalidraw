import fs from "fs";
import path from "path";
import https from "https";
import http from "http";
import { WebSocket, WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { client } from "@repo/db/client"

// Try to load SSL certs; fall back to self-signed if not available
let server: any;
const keyPath = path.join(__dirname, "../../../certs/key.pem");
const certPath = path.join(__dirname, "../../../certs/cert.pem");

try {
    server = https.createServer({
        key: fs.readFileSync(keyPath),
        cert: fs.readFileSync(certPath)
    });
} catch (err) {
    console.warn("SSL certs not found, creating HTTP-only server. For WSS, provide valid certs at certs/key.pem and certs/cert.pem");
    server = http.createServer();
}

const wss = new WebSocketServer({ server });
interface User {
    ws: WebSocket,
    rooms: String[],
    userId: String
}

const users: User[] = []

/* check user is authenticated or not */
function checkUser (token: string): string | null {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        
        if(typeof decoded === "string") return null;

        if(!decoded || !decoded.id) return null;

        const userId = decoded.id;

        return userId;
    } catch (error) {
        return null;
    }
}

wss.on('connection', function(ws, request) {
    const url = request.url;

    if(!url) return;

    /* extract the token from the url */
    const queryParams = new URLSearchParams(url.split('?')[1]);
    const token = queryParams.get('token') || "";

    /* check user  */
    const userId = checkUser(token);

    /* if user is not authenticated close the websocket sever */
    if(!userId) {
        console.log('you are not authenticated');
        ws.close();
        return null;
    }

    console.log('new client gets connected',userId);

    /* two condition comes here if you want to allow duplicates users from multiple tabs or session 
    
        1.  allow single session
        2.  allow multiple session
    */

    /* for single session */

    /* const duplicateUser = users.find(user => user.userId === userId);

    if(duplicateUser){

        // first close previous running session
        duplicateUser.ws.close();
        users.splice(users.indexOf(duplicateUser), 1);
    } */
    

    /* push the current user to active user array */
    users.push({
        ws,
        rooms: [],
        userId
    })

    /* send message of connection got established to the users */
    ws.send(JSON.stringify({
        type: "connection",
        message: "User connected to socket"
    }))

    ws.on('message', async function (data) {
        let parsedData;

        if(typeof data !== "string"){
            parsedData = JSON.parse(data.toString());
        } else parsedData = JSON.parse(data);

        /* logic to join the room or subscribe to the room */
        if(parsedData.type === 'join_room'){

            const roomId = parsedData.roomId;

            /* check room id exist in database or not */
            try {
                const room = await client.room.findFirst({
                    where: {
                        id: roomId
                    }
                })
                
                /* send message to the user room not exist */
                if(!room) {
                    ws.send(JSON.stringify({
                        message: "room does not exist"
                    }));
                    return;
                }
                
                /* check user is actually part of this room or not */
                const validUser = await client.roomMember.findUnique({
                    where: {
                        roomId_userId: {
                            roomId,
                            userId
                        }
                    }
                })

                if(!validUser) {
                    ws.send(JSON.stringify({
                        message: "you are not the member of this room"
                    }));
                    return;
                }

                /* now confirmed that current user is part of the room so we can join this room */
                
                /* push the roomId to the current users room array */

                const user = users.find(data => data.ws === ws);

                if(user){

                    if(!user.rooms) user.rooms = [];

                    if(!user.rooms.includes(parsedData.roomId)) {
                        user.rooms.push(parsedData.roomId);
                        ws.send(JSON.stringify({
                            message: `${userId} connected to room ${roomId}`
                        }))
                    }
                }

            } catch (error) {
                ws.send(JSON.stringify({
                    message: "something went wrong in joining room"
                }));
            }
        } 
        
        /* logic to leave the room */
        if (parsedData.type === 'leave_room'){

            /* find user in users array */
            const user = users.find(data => data.ws === ws);

            /* if user not exist then no issue */
            if(!user) return;

            user.rooms = user.rooms.filter((roomId) => roomId !== parsedData.roomId);

            ws.send(JSON.stringify({
                message: `${userId} left the room ${parsedData.roomId}`
            }))
        }


        if(parsedData.type === 'chat'){
            const roomId = parsedData.roomId;
            const message = parsedData.message;

            /* check current user is part of this room or not */
            const user = users.find(data => data.ws === ws);
            const isValidMember = user?.rooms.includes(roomId);
            if(!isValidMember) return;

            try {
                /* push this message to db */

                await client.chat.create({
                    data: {
                        roomId,
                        userId,
                        message
                    }
                })

            } catch (error) {
                /* failed to push message to db */
                ws.send(JSON.stringify({
                    type: "error",
                    message: "Failed to send message",
                    error
                }));
            }

            /* broadcast this message to all user who joined this room only if user is member */
            users.forEach(user => {
                if(user.rooms.includes(roomId)){
                    user.ws.send(JSON.stringify({
                        type: "chat",
                        message: message,
                        roomId
                    }))
                }
            })
        }

        /* handle shape deletion (eraser) */
        if(parsedData.type === 'delete_shape'){
            const roomId = parsedData.roomId;
            const chatId = parsedData.chatId;

            /* check current user is part of this room or not */
            const user = users.find(data => data.ws === ws);
            const isValidMember = user?.rooms.includes(roomId);
            if(!isValidMember) return;

            /* broadcast the deletion to all users in the room */
            users.forEach(user => {
                if(user.rooms.includes(roomId)){
                    user.ws.send(JSON.stringify({
                        type: "delete_shape",
                        chatId: chatId,
                        roomId
                    }))
                }
            })
        }

        /* handle page change */
        if(parsedData.type === 'page_change'){
            const roomId = parsedData.roomId;
            const page = parsedData.page;

            /* check current user is part of this room or not */
            const user = users.find(data => data.ws === ws);
            const isValidMember = user?.rooms.includes(roomId);
            if(!isValidMember) return;

            /* broadcast the page change to all users in the room */
            users.forEach(user => {
                if(user.rooms.includes(roomId)){
                    user.ws.send(JSON.stringify({
                        type: "page_change",
                        page: page,
                        roomId
                    }))
                }
            })
        }
    })

    ws.on('close', (code, reason) => {
        const index = users.findIndex(u => u.ws === ws);
        if (index !== -1) users.splice(index, 1);
        console.log(`user get disconnected ${userId} code=${code} reason is ${reason}`);
    })
})

// HTTP health check server on port 8081 for Render/load balancer detection
const healthServer = http.createServer((req, res) => {
    if (req.url === '/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'ok' }));
    } else {
        res.writeHead(404);
        res.end();
    }
});

healthServer.listen(8081, () => console.log("Health check server running on http://0.0.0.0:8081"));

const isHttps = server instanceof https.Server;
const protocol = isHttps ? "wss" : "ws";
server.listen(8080, () => console.log(`${protocol.toUpperCase()} server running on ${protocol}://0.0.0.0:8080`));