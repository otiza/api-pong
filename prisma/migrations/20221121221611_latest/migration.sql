-- DropForeignKey
ALTER TABLE "userconfig" DROP CONSTRAINT "userconfig_Userid_fkey";

-- AddForeignKey
ALTER TABLE "userconfig" ADD CONSTRAINT "userconfig_Userid_fkey" FOREIGN KEY ("Userid") REFERENCES "User"("Userid") ON DELETE CASCADE ON UPDATE CASCADE;
