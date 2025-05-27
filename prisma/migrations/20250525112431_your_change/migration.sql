/*
  Warnings:

  - Added the required column `updatedAt` to the `workCall` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "workCall" ADD COLUMN     "budget" DOUBLE PRECISION,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "title" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
