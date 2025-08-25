import { HTTP_BACKEND } from "@/config";
import axios from "axios";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import InstagramProvider from "next-auth/providers/instagram";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from "@repo/backend-common/config";

// ---------------- Extend NextAuth types ----------------
declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            email: string;
            name: string | null;
            bio: string | null;
            photo: string | null;
            provider: string;
        };
        jwt?: string | null;
    }

    interface User {
        id: string;
        email: string;
        name: string | null;
        bio: string | null;
        photo: string | null;
        provider: string;
        jwt?: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id?: string;
        email?: string;
        name?: string | null;
        bio?: string | null;
        photo?: string | null;
        provider?: string;
        jwt?: string | null;
    }
}

// ---------- Backend JWT payload ----------
type DecodedUser = {
    id: string;
    email: string;
    name: string | null;
    bio: string | null;
    photo: string | null;
    iat: number;
    exp: number;
};

// ---------- Auth Config ----------
export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                try {
                    const res = await axios.post(`${HTTP_BACKEND}/signin`, {
                        email: credentials?.email,
                        password: credentials?.password,
                    });

                    const token = res.data.token;
                    if (!token) return null;

                    const decoded = jwt.verify(token, JWT_SECRET) as DecodedUser;

                    console.log('default login initiated');
                    console.log(decoded);

                    return {
                        id: decoded.id,
                        email: decoded.email,
                        name: decoded.name,
                        bio: decoded.bio,
                        photo: decoded.photo,
                        provider: "credentials",
                        jwt: token,
                    };
                } catch (error) {
                    console.error("Authentication error:", error);
                    return null;
                }
            },
        }),

        GoogleProvider({
            clientId: GOOGLE_CLIENT_ID!,
            clientSecret: GOOGLE_CLIENT_SECRET!,
        }),
        FacebookProvider({
            clientId: process.env.FACEBOOK_CLIENT_ID!,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
        }),
        InstagramProvider({
            clientId: process.env.INSTAGRAM_CLIENT_ID!,
            clientSecret: process.env.INSTAGRAM_CLIENT_SECRET!,
        }),
    ],

    session: { strategy: "jwt" },

    callbacks: {
        async jwt({ token, user, account, profile }) {
            // Case 1: Credentials login
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.name = user.name;
                token.photo = user.photo;
                token.bio = user.bio;
                token.provider = user.provider;
                token.jwt = user.jwt ?? null;
            }

            // Case 2: Social providers
            if (account && profile) {
                if (account.provider === "google") {

                    console.log("google account details ",profile , account);

                    const googleProfile = profile as {
                        sub: string;
                        email: string;
                        name: string;
                        picture: string;
                    };
                    token.provider = "google";
                    token.id = googleProfile.sub;
                    token.email = googleProfile.email;
                    token.name = googleProfile.name;
                    token.photo = googleProfile.picture;
                }

                if (account.provider === "facebook") {
                    const fbProfile = profile as {
                        id: string;
                        email?: string;
                        name: string;
                    };
                    token.provider = "facebook";
                    token.id = fbProfile.id;
                    token.name = fbProfile.name;
                    token.email = fbProfile.email ?? "";
                }

                if (account.provider === "instagram") {
                    const instaProfile = profile as {
                        id: string;
                        username: string;
                        picture?: string;
                    };
                    token.provider = "instagram";
                    token.id = instaProfile.id;
                    token.name = instaProfile.username;
                    token.photo = instaProfile.picture ?? null;
                }
            }

            // Verify backend JWT (credentials only)
            if (token.provider === "credentials" && token.jwt) {
                try {
                    jwt.verify(token.jwt, JWT_SECRET);
                } catch {
                    token.jwt = null;
                }
            }

            return token;
        },

        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id!;
                session.user.email = token.email ?? "";
                session.user.name = token.name ?? null;
                session.user.photo = token.photo ?? null;
                session.user.bio = token.bio ?? null;
                session.user.provider = token.provider ?? "unknown";
                session.jwt = token.jwt ?? null;
            }
            return session;
        },
    },

    pages: {
        signIn: "/signin",
        newUser: "/signup",
    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
