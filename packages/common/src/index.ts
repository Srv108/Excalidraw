import { z } from "zod";

export const CreateUserSchema = z.object({
    "email": z.string().min(3).max(20),
    "password": z.string(),
    "name": z.string().optional(),
    "username": z.string().optional()
});

export const SigninSchema = z.object({
    "email": z.string().email({message: "Invalid email address"}),
    "password": z.string(),
});

export const CreateRoomSchema = z.object({
    "name": z.string().min(3).max(20),
})

