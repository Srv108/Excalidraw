import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '@repo/backend-common/config';

export interface userDetails {
    id: String,
    email: String,
    name?: String,
    bio?: String,
    photo?: String
}

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    const token = Array.isArray(req.headers["access-token"]) 
        ? req.headers["access-token"][0] 
        : req.headers["access-token"] || "";

    const decoded = jwt.verify(token as string, JWT_SECRET as string) as userDetails;

    if(decoded && decoded.id && decoded.email){
        req.user = decoded
        next();
    } else {
        return res.status(403).json({
            message: "You are not authenticated "
        });
    }
}