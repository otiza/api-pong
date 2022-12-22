-- CreateTable
CREATE TABLE "_friendreq" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_friendreq_AB_unique" ON "_friendreq"("A", "B");

-- CreateIndex
CREATE INDEX "_friendreq_B_index" ON "_friendreq"("B");

-- AddForeignKey
ALTER TABLE "_friendreq" ADD CONSTRAINT "_friendreq_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("Userid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_friendreq" ADD CONSTRAINT "_friendreq_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("Userid") ON DELETE CASCADE ON UPDATE CASCADE;
