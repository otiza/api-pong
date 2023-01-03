-- DropForeignKey
ALTER TABLE "games" DROP CONSTRAINT "games_loserid_fkey";

-- DropForeignKey
ALTER TABLE "games" DROP CONSTRAINT "games_winnerid_fkey";

-- AlterTable
ALTER TABLE "games" ALTER COLUMN "winnerid" DROP NOT NULL,
ALTER COLUMN "loserid" DROP NOT NULL;

-- CreateTable
CREATE TABLE "livematch" (
    "matchid" TEXT NOT NULL,
    "p1id" TEXT NOT NULL,
    "p2id" TEXT NOT NULL,

    CONSTRAINT "livematch_pkey" PRIMARY KEY ("matchid")
);

-- CreateIndex
CREATE UNIQUE INDEX "livematch_p1id_key" ON "livematch"("p1id");

-- CreateIndex
CREATE UNIQUE INDEX "livematch_p2id_key" ON "livematch"("p2id");

-- AddForeignKey
ALTER TABLE "games" ADD CONSTRAINT "games_winnerid_fkey" FOREIGN KEY ("winnerid") REFERENCES "User"("Userid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "games" ADD CONSTRAINT "games_loserid_fkey" FOREIGN KEY ("loserid") REFERENCES "User"("Userid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "livematch" ADD CONSTRAINT "livematch_p1id_fkey" FOREIGN KEY ("p1id") REFERENCES "User"("Userid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "livematch" ADD CONSTRAINT "livematch_p2id_fkey" FOREIGN KEY ("p2id") REFERENCES "User"("Userid") ON DELETE RESTRICT ON UPDATE CASCADE;
