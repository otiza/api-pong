/*
  Warnings:

  - Added the required column `Socket` to the `livematch` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mode` to the `livematch` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "livematch" ADD COLUMN     "Socket" TEXT NOT NULL,
ADD COLUMN     "mode" TEXT NOT NULL;
