-- DropForeignKey
ALTER TABLE "games" DROP CONSTRAINT "games_loserid_fkey";

-- DropForeignKey
ALTER TABLE "games" DROP CONSTRAINT "games_winnerid_fkey";

-- AddForeignKey
ALTER TABLE "games" ADD CONSTRAINT "games_winnerid_fkey" FOREIGN KEY ("winnerid") REFERENCES "User"("username") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "games" ADD CONSTRAINT "games_loserid_fkey" FOREIGN KEY ("loserid") REFERENCES "User"("username") ON DELETE SET NULL ON UPDATE CASCADE;
