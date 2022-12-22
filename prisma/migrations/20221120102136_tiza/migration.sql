-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_ConfId_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "ConfId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_ConfId_fkey" FOREIGN KEY ("ConfId") REFERENCES "userconfig"("ConfigId") ON DELETE SET NULL ON UPDATE CASCADE;
