/*
  Warnings:

  - You are about to drop the column `ConfId` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[Userid]` on the table `userconfig` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `Userid` to the `userconfig` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_ConfId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "ConfId";

-- AlterTable
ALTER TABLE "userconfig" ADD COLUMN     "Userid" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "userconfig_Userid_key" ON "userconfig"("Userid");

-- AddForeignKey
ALTER TABLE "userconfig" ADD CONSTRAINT "userconfig_Userid_fkey" FOREIGN KEY ("Userid") REFERENCES "User"("Userid") ON DELETE RESTRICT ON UPDATE CASCADE;
