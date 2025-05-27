-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isAcceptedServiceProvider" BOOLEAN DEFAULT false,
ADD COLUMN     "isServiceProvider" BOOLEAN DEFAULT false;
