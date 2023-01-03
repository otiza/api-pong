/*
  Warnings:

  - You are about to drop the column `Score` on the `games` table. All the data in the column will be lost.
  - Added the required column `Scorelose` to the `games` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Scorewin` to the `games` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Socket` to the `livematch` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mode` to the `livematch` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "games" DROP COLUMN "Score",
ADD COLUMN     "Scorelose" INTEGER NOT NULL,
ADD COLUMN     "Scorewin" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "livematch" ADD COLUMN     "Socket" TEXT NOT NULL,
ADD COLUMN     "mode" TEXT NOT NULL;
