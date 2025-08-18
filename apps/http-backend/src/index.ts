import express from "express";
import cors from "cors";
import { CreateUserSchema } from "@repo/common/types";
import { client } from "@repo/db/client"
import bcrypt from "bcrypt";
import { isPrismaError, PrismaErrorHandler } from "./utils/db";
import  jwt  from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config"
import { isAuthenticated } from "./middleware/middleware";

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

app.post('/room', isAuthenticated, (req , res ) => {
    /*  */
})

app.listen(3001, () => {
    console.log(`app listening on 3001`);
});