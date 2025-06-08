-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_room_id_fkey";

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "workCallId" TEXT;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_workCallId_fkey" FOREIGN KEY ("workCallId") REFERENCES "workCall"("id") ON DELETE SET NULL ON UPDATE CASCADE;
