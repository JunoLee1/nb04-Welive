/*
  Warnings:

  - The `joinStatus` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `approvedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "JoinStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "approvedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "joinStatus",
ADD COLUMN     "joinStatus" "JoinStatus" NOT NULL DEFAULT 'PENDING';

-- DropEnum
DROP TYPE "joinStatus";
