/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `achievement` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "achievement_name_key" ON "achievement"("name");
