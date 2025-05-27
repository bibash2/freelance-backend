/*
  Warnings:

  - The `location` column on the `Post` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "acceptedServiceProviderId" TEXT,
DROP COLUMN "location",
ADD COLUMN     "location" JSONB,
ALTER COLUMN "urgency" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "location" JSONB,
ADD COLUMN     "serviceProviderLocation" JSONB;
