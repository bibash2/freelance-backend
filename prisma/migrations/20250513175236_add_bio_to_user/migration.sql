/*
  Warnings:

  - You are about to drop the column `content` on the `Post` table. All the data in the column will be lost.
  - Made the column `description` on table `Post` required. This step will fail if there are existing NULL values in that column.
  - Made the column `category` on table `Post` required. This step will fail if there are existing NULL values in that column.
  - Made the column `location` on table `Post` required. This step will fail if there are existing NULL values in that column.
  - Made the column `price` on table `Post` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "content",
ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "category" SET NOT NULL,
ALTER COLUMN "location" SET NOT NULL,
ALTER COLUMN "price" SET NOT NULL,
ALTER COLUMN "isNegotiable" DROP NOT NULL,
ALTER COLUMN "isActive" DROP NOT NULL;
