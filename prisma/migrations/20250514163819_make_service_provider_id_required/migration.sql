/*
  Warnings:

  - Added the required column `updatedAt` to the `Bid` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Bid" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE INDEX "Bid_postId_idx" ON "Bid"("postId");

-- CreateIndex
CREATE INDEX "Bid_serviceProviderId_idx" ON "Bid"("serviceProviderId");

-- AddForeignKey
ALTER TABLE "Bid" ADD CONSTRAINT "Bid_serviceProviderId_fkey" FOREIGN KEY ("serviceProviderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
