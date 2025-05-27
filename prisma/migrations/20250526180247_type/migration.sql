-- CreateEnum
CREATE TYPE "workCallType" AS ENUM ('BY_ME', 'TO_ME');

-- AlterTable
ALTER TABLE "workCall" ADD COLUMN     "type" "workCallType";
