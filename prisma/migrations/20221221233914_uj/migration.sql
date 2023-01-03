-- DropIndex
DROP INDEX "User_avatar_key";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "avatar" DROP NOT NULL;
