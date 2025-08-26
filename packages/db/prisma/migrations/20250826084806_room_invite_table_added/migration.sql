-- CreateTable
CREATE TABLE "public"."RoomInvite" (
    "id" SERIAL NOT NULL,
    "code" TEXT,
    "roomId" INTEGER NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RoomInvite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RoomInvite_code_key" ON "public"."RoomInvite"("code");

-- CreateIndex
CREATE UNIQUE INDEX "RoomInvite_roomId_key" ON "public"."RoomInvite"("roomId");

-- AddForeignKey
ALTER TABLE "public"."RoomInvite" ADD CONSTRAINT "RoomInvite_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "public"."Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;
