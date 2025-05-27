/*
  Warnings:

  - Added the required column `urgency` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Urgency" AS ENUM ('IMMEDIATE', 'MODERATE', 'LOW');

-- CreateEnum
CREATE TYPE "userRole" AS ENUM ('USER', 'SERVICE_PROVIDER');

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "urgency" "Urgency" NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "userRole" NOT NULL DEFAULT 'USER';

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "category" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workCall" (
    "id" TEXT NOT NULL,
    "chatHistory" JSONB NOT NULL,
    "serviceProviderId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "workCall_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
