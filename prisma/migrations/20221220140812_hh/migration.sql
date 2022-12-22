/*
  Warnings:

  - A unique constraint covering the columns `[followerId,followingId]` on the table `follow` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "follow_followerId_followingId_key" ON "follow"("followerId", "followingId");
