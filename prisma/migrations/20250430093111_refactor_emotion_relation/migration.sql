/*
  Warnings:

  - You are about to drop the column `postSessionId` on the `EmotionScore` table. All the data in the column will be lost.
  - Added the required column `type` to the `EmotionScore` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EmotionScoreType" AS ENUM ('PRE', 'POST');

-- DropForeignKey
ALTER TABLE "EmotionScore" DROP CONSTRAINT "EmotionScore_postSessionId_fkey";

-- AlterTable
ALTER TABLE "EmotionScore" DROP COLUMN "postSessionId",
ADD COLUMN     "type" "EmotionScoreType" NOT NULL;
