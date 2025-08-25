import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

if (typeof window === "undefined") {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const envPath = path.resolve(__dirname, "../../backend-common/.env");
    console.log("Loading ENV from:", envPath);

    dotenv.config({ path: envPath });
}

export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
export const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret";
