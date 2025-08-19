import { JwtPayload } from "jsonwebtoken"; // if you're using JWT
import { userDetails } from "../middleware/middleware";

declare global {
    namespace Express {
        interface Request {
        user?: userDetails | JwtPayload; // change type as needed
        }
    }
}
