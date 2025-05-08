/*
  Warnings:

  - Made the column `postSessionId` on table `EmotionScore` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "EmotionScore" DROP CONSTRAINT "EmotionScore_postSessionId_fkey";

-- AlterTable
ALTER TABLE "EmotionScore" ALTER COLUMN "postSessionId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "EmotionScore" ADD CONSTRAINT "EmotionScore_postSessionId_fkey" FOREIGN KEY ("postSessionId") REFERENCES "Session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
