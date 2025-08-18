import { Prisma, PrismaClient } from "@prisma/client";

export const client = new PrismaClient();
export const prisma = Prisma;
