/*
  Warnings:

  - You are about to drop the `_RoomMembers` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('MEMBER', 'ADMIN');

-- DropForeignKey
ALTER TABLE "public"."_RoomMembers" DROP CONSTRAINT "_RoomMembers_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_RoomMembers" DROP CONSTRAINT "_RoomMembers_B_fkey";

-- DropTable
DROP TABLE "public"."_RoomMembers";

-- CreateTable
CREATE TABLE "public"."RoomMember" (
    "roomId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL DEFAULT 'MEMBER',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RoomMember_pkey" PRIMARY KEY ("roomId","userId")
);

-- AddForeignKey
ALTER TABLE "public"."RoomMember" ADD CONSTRAINT "RoomMember_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "public"."Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RoomMember" ADD CONSTRAINT "RoomMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
