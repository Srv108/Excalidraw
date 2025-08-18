import { JwtPayload } from "jsonwebtoken"; // if you're using JWT

declare global {
    namespace Express {
        interface Request {
        user?: string | JwtPayload; // change type as needed
        }
    }
}
