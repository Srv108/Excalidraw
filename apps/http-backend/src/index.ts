import express from "express";
import cors from "cors";
import { CreateRoomSchema, CreateUserSchema } from "@repo/common/types";
import { client } from "@repo/db/client"
import bcrypt from "bcrypt";
import { isPrismaError, PrismaErrorHandler } from "@repo/db/client";
import  jwt  from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config"
import { isAuthenticated } from "./middleware/middleware";
import { v4 as uuidv4 } from "uuid";
import slugify from "slugify";

const app = express();
app.use(express.json());
app.use(cors());

app.post('/signup', async(req , res ) => {

    /* check the parsed data is correct or incorrect */
    const parsedData = CreateUserSchema.safeParse(req.body);
    if(!parsedData.success){
        console.log(parsedData.error);
        return res.json({
            message: "Incorrect inputs"
        })
    }

    try {
        
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(parsedData.data.password, salt);

        const user = await client.user.create({
            data: {
                email: parsedData.data.email,
                password: hashedPassword
            }
        })

        res.json({
            message: "User created succefully",
            details: user
        })
    } catch (error) {
        if(isPrismaError(error)) throw new PrismaErrorHandler(error);
        else if (error instanceof Error) throw new Error(error.message);
        else throw error;
    }

})

app.post('/signin', async (req , res ) => {
    const parsedData = CreateUserSchema.safeParse(req.body);

    if(!parsedData.success){
        throw new Error('Incorrect inputs')
    }

    try {
        const userDetails = await client.user.findFirst({
            where: { email: parsedData.data?.email },
            select: {
                id: true,
                email: true,
                password: true,
                name: true,
                photo: true,
                bio: true
            }
        })

        if(!userDetails?.password) {
            throw new Error('something went wrong');
        }

        const isAuthenticatedUser = bcrypt.compareSync(parsedData.data.password, userDetails?.password);

        if(!isAuthenticatedUser){
            throw new Error("Incorrect password!, please try again")
        }

        const token = jwt.sign({
            id: userDetails.id,
            email: userDetails.email,
            name: userDetails.name,
            bio: userDetails.bio,
            photo: userDetails.photo
        }, JWT_SECRET as string, { expiresIn: '1d'});
        
        res.json({
            message: "Sign in successfully",
            token: token
        })
        
    } catch (error) {
        if(isPrismaError(error)) throw new PrismaErrorHandler(error);
        else if (error instanceof Error) throw new Error(error.message);
        else throw error;
    }
})

app.post('/room', isAuthenticated, async (req , res ) => {
    
    const parsedData = CreateRoomSchema.safeParse(req.body);
    if(!parsedData.success){
        return res.json({
            message: "Incorrect inputs"
        });
    }

    const name = parsedData.data.name;
    const userId = req.user?.id;

    const baseSlug = slugify(name, { lower: true, strict: true })
    const slug = `${baseSlug}-${uuidv4().slice(0, 8)}`;

    try {
        
        const [room, roomMember] = await client.$transaction(async (tx: any) => {
            // Step 1: Create the room
            const newRoom = await tx.room.create({
                data: {
                    name,
                    slug,
                    adminId: userId
                }
            });

            // Step 2: Ensure room ID exists
            if (!newRoom.id) {
                throw new Error("Failed to create room: Room ID not generated");
            }

            // Step 3: Create the RoomMember entry with the room ID
            const newRoomMember = await tx.roomMember.create({
                data: {
                    roomId: newRoom.id,
                    userId,
                    role: 'ADMIN'
                }
            });

            return [newRoom, newRoomMember];
        });

        res.status(200).json({
            message: "room created successfully",
            details: room,
        })

    } catch (error) {
        if(isPrismaError(error)) throw new PrismaErrorHandler(error);
        else if (error instanceof Error) throw new Error(error.message);
        else throw error;
    }
})

app.get('/chats/:roomId', isAuthenticated, async(req, res) => {
    /* first check the current user is authorised to this room or not */
    try {

        const userId = req.user?.id;
        const roomId = req.params?.roomId;

        if (!roomId) {
            return res.status(400).json({ error: "roomId is required in params" });
        }

        const id = parseInt(roomId);

        /* check any unique room with this user and roomid exist or not */
        const isUserExist = await client.roomMember.findUnique({
            where: {
                roomId_userId: {
                    roomId: id,
                    userId: userId
                }
            }
        })

        if(!isUserExist) return res.status(400).json({ error: "unauthorized" });

        const message = await client.chat.findMany({
            where:{
                roomId: id,
            },
            orderBy: {
                id: "desc"
            },
            take: 100
        });

        res.status(202).json({
            message: "message fetched successfully",
            data: message
        })

    } catch (error) {
        console.log(error);
        res.json({
            messages: []
        })
    }
})

app.get('/room/:slug', isAuthenticated, async (req, res) => {
    try {
        const slug = req.params.slug;

        /* check user is part of this room or not */
        const room = await client.room.findFirst({
            where: {
                slug: slug
            },include: {
                memberships: {
                    where: {
                        userId: req.user?.id
                    }
                }
            }
        })

        if (!room) return res.status(404).json({ message: "Room not found" });
        if (!room.memberships.length) return res.status(401).json({ message: "Unauthorized" });

        res.status(200).json({
            message: "room fetched successfully",
            room: room
        })

    } catch (error) {
        console.log(error);
    }
})

/* get room details by room id */
app.get('/room', isAuthenticated, async (req, res) => {
    const userId = req.user?.id;
    const roomId = req.body.roomId;
    try {
        
        /* first check the current user is part of room or not */
        const roomMember = await client.roomMember.findUnique({
            where: {
                roomId_userId: {
                    roomId: roomId,
                    userId: userId
                }
            },
            include: {
                room: true
            }
        })

        if(!roomMember){
            return res.status(403).json({ error: "You are not a member of this room" });
        }

        return res.json({
            message: "room fetched successfully",
            room: roomMember.room
        })

    } catch (error) {
        return res.status(401).json({ message: "failed to fetch the room details" });
    }
})

/* get room whole details with chat and member details also */
app.get('/room-details', isAuthenticated, async (req, res) => {
    const userId = req.user?.id;
    const roomId = req.body.roomId;
    try {
        /* first check the current user is part of room or not */
        const roomMember = await client.roomMember.findUnique({
            where: {
                roomId_userId: {
                    roomId: roomId,
                    userId: userId
                }
            },
            include: {
                room: {
                    include: {
                        memberships: {
                            include: {
                                user: true
                            }
                        },
                        chats: true
                    }
                }
            }
        })

        if(!roomMember){
            return res.status(403).json({ error: "You are not a member of this room" });
        }

        return res.json({
            message: "room fetched successfully",
            room: roomMember.room
        })

    } catch (error) {
        return res.status(401).json({ message: "failed to fetch the room details" });
    }
})

app.post('/room-invite', isAuthenticated, async(req, res) => {
    const userId = req.user?.id;
    const roomId = req.body.roomId;
    try {
        const code = uuidv4().replace(/-/g, '').slice(0, 8).toUpperCase();
        const expiredAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

        const room = await client.room.findUnique({
            where: { id: roomId, adminId: userId }
        })

        if(!room) return res.status(403).json({message: 'you are not the admin of the room...'});

        const roomInvite = await client.roomInvite.create({
            data: {
                code: code,
                roomId: roomId,
                expiresAt: expiredAt
            }
        })

        if(!roomInvite) res.status(402).json({ message: "failed to create join code"});

        res.json({
            message: "Join code created successfully",
            joinCode: code
        })
    } catch (error) {
        
    }
})

/* join room by room Id */
app.post('/join-room', isAuthenticated, async(req, res) => {
    const joinCode: string = req.body.joinCode;
    const userId = req.user?.id;
    try {
        
        /* find room with  this unique join code */
        const roomInvite = await client.roomInvite.findUnique({
            where: {
                code: joinCode
            },
            select: { roomId: true }
        });

        if(! roomInvite){
            return res.status(404).json({ error: "Invalid join code" });
        }

        const newMembership = await client.roomMember.create({
            data: {
                roomId: roomInvite.roomId,
                userId: userId,
                role: 'MEMBER'
            }
        })

        res.json({ message: "Joined room successfully", membership: newMembership });

    } catch (error) {
        console.log('error in joing room',error);
        res.json({
            message: "failed to join room"
        })
    }
})

/* get all room of a user */
app.get('/rooms', isAuthenticated, async(req, res) => {
    
    const userId = req.user?.id;
    try {
        
        const rooms = await client.roomMember.findMany({
            where: {
                userId
            },
            include: {
                room: true
            }
        })

        return {
            message: "rooms fetched successfully",
            rooms: rooms
        }
    } catch (error) {
        
    }
})

app.listen(3002, () => {
    console.log(`app listening on 3002`);
});