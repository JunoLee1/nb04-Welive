/*
  Warnings:

  - Added the required column `building` to the `Resident` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Resident` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unit` to the `Resident` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Resident" ADD COLUMN     "building" INTEGER NOT NULL,
ADD COLUMN     "isHouseholder" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "unit" INTEGER NOT NULL;
