-- CreateTable
CREATE TABLE "public"."_RoomMembers" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_RoomMembers_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_RoomMembers_B_index" ON "public"."_RoomMembers"("B");

-- AddForeignKey
ALTER TABLE "public"."_RoomMembers" ADD CONSTRAINT "_RoomMembers_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_RoomMembers" ADD CONSTRAINT "_RoomMembers_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
