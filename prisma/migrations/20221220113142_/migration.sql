/*
  Warnings:

  - You are about to drop the `_friendreq` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_frindship` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_friendreq" DROP CONSTRAINT "_friendreq_A_fkey";

-- DropForeignKey
ALTER TABLE "_friendreq" DROP CONSTRAINT "_friendreq_B_fkey";

-- DropForeignKey
ALTER TABLE "_frindship" DROP CONSTRAINT "_frindship_A_fkey";

-- DropForeignKey
ALTER TABLE "_frindship" DROP CONSTRAINT "_frindship_B_fkey";

-- DropTable
DROP TABLE "_friendreq";

-- DropTable
DROP TABLE "_frindship";

-- CreateTable
CREATE TABLE "follow" (
    "followId" TEXT NOT NULL,
    "followerId" TEXT NOT NULL,
    "followingId" TEXT NOT NULL,

    CONSTRAINT "follow_pkey" PRIMARY KEY ("followId")
);

-- AddForeignKey
ALTER TABLE "follow" ADD CONSTRAINT "follow_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "User"("username") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "follow" ADD CONSTRAINT "follow_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "User"("username") ON DELETE CASCADE ON UPDATE CASCADE;
