-- CreateTable
CREATE TABLE "User" (
    "Userid" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "ConfId" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("Userid")
);

-- CreateTable
CREATE TABLE "userconfig" (
    "ConfigId" TEXT NOT NULL,
    "is2FA" BOOLEAN NOT NULL,

    CONSTRAINT "userconfig_pkey" PRIMARY KEY ("ConfigId")
);

-- CreateTable
CREATE TABLE "games" (
    "gameId" TEXT NOT NULL,
    "winnerid" TEXT NOT NULL,
    "loserid" TEXT NOT NULL,
    "Score" BOOLEAN[],
    "playedat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "games_pkey" PRIMARY KEY ("gameId")
);

-- CreateTable
CREATE TABLE "achievement" (
    "aId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "desc" TEXT NOT NULL,

    CONSTRAINT "achievement_pkey" PRIMARY KEY ("aId")
);

-- CreateTable
CREATE TABLE "_UserToachievement" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_frindship" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "_UserToachievement_AB_unique" ON "_UserToachievement"("A", "B");

-- CreateIndex
CREATE INDEX "_UserToachievement_B_index" ON "_UserToachievement"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_frindship_AB_unique" ON "_frindship"("A", "B");

-- CreateIndex
CREATE INDEX "_frindship_B_index" ON "_frindship"("B");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_ConfId_fkey" FOREIGN KEY ("ConfId") REFERENCES "userconfig"("ConfigId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "games" ADD CONSTRAINT "games_winnerid_fkey" FOREIGN KEY ("winnerid") REFERENCES "User"("Userid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "games" ADD CONSTRAINT "games_loserid_fkey" FOREIGN KEY ("loserid") REFERENCES "User"("Userid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserToachievement" ADD CONSTRAINT "_UserToachievement_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("Userid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserToachievement" ADD CONSTRAINT "_UserToachievement_B_fkey" FOREIGN KEY ("B") REFERENCES "achievement"("aId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_frindship" ADD CONSTRAINT "_frindship_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("Userid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_frindship" ADD CONSTRAINT "_frindship_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("Userid") ON DELETE CASCADE ON UPDATE CASCADE;
