/*
  Warnings:

  - Made the column `title` on table `workCall` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "workCall" ALTER COLUMN "title" SET NOT NULL;
