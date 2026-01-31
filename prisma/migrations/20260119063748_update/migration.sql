/*
  Warnings:

  - A unique constraint covering the columns `[userId,apartmentId]` on the table `Resident` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Resident" ALTER COLUMN "building" SET DATA TYPE TEXT,
ALTER COLUMN "unit" SET DATA TYPE TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Resident_userId_apartmentId_key" ON "Resident"("userId", "apartmentId");
