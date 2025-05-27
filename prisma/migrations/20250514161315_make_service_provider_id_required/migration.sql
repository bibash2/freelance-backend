/*
  Warnings:

  - You are about to drop the column `price` on the `Bid` table. All the data in the column will be lost.
  - Added the required column `bidAmount` to the `Bid` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bidMessage` to the `Bid` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Bid" DROP COLUMN "price",
ADD COLUMN     "bidAmount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "bidMessage" TEXT NOT NULL;
