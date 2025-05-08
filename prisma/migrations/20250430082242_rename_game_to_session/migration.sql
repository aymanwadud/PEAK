/*
  Warnings:

  - You are about to drop the column `gameId` on the `EmotionScore` table. All the data in the column will be lost.
  - You are about to drop the column `postGameId` on the `EmotionScore` table. All the data in the column will be lost.
  - You are about to drop the column `gameId` on the `PerformanceMetric` table. All the data in the column will be lost.
  - You are about to drop the column `gameId` on the `RecoveryPoint` table. All the data in the column will be lost.
  - You are about to drop the column `timeAfterGame` on the `RecoveryPoint` table. All the data in the column will be lost.
  - You are about to drop the `Game` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `sessionId` to the `EmotionScore` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sessionId` to the `PerformanceMetric` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sessionId` to the `RecoveryPoint` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timeAfterSession` to the `RecoveryPoint` table without a default value. This is not possible if the table is not empty.

*/
-- First create the new Session table
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "outcome" TEXT NOT NULL,
    "sport" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- Copy data from Game to Session
INSERT INTO "Session" ("id", "date", "outcome", "sport", "createdAt", "updatedAt")
SELECT "id", "date", "outcome", "sport", "createdAt", "updatedAt"
FROM "Game";

-- Add new columns to tables that reference Session
ALTER TABLE "EmotionScore" ADD COLUMN "sessionId" TEXT;
ALTER TABLE "EmotionScore" ADD COLUMN "postSessionId" TEXT;
ALTER TABLE "PerformanceMetric" ADD COLUMN "sessionId" TEXT;
ALTER TABLE "RecoveryPoint" ADD COLUMN "sessionId" TEXT;
ALTER TABLE "RecoveryPoint" ADD COLUMN "timeAfterSession" INTEGER;

-- Copy the foreign key references
UPDATE "EmotionScore" SET "sessionId" = "gameId" WHERE "gameId" IS NOT NULL;
UPDATE "EmotionScore" SET "postSessionId" = "postGameId" WHERE "postGameId" IS NOT NULL;
UPDATE "PerformanceMetric" SET "sessionId" = "gameId" WHERE "gameId" IS NOT NULL;
UPDATE "RecoveryPoint" SET "sessionId" = "gameId", "timeAfterSession" = "timeAfterGame" WHERE "gameId" IS NOT NULL;

-- Make the new columns required
ALTER TABLE "EmotionScore" ALTER COLUMN "sessionId" SET NOT NULL;
ALTER TABLE "PerformanceMetric" ALTER COLUMN "sessionId" SET NOT NULL;
ALTER TABLE "RecoveryPoint" ALTER COLUMN "sessionId" SET NOT NULL;
ALTER TABLE "RecoveryPoint" ALTER COLUMN "timeAfterSession" SET NOT NULL;

-- Drop old columns and foreign key constraints
ALTER TABLE "EmotionScore" DROP CONSTRAINT IF EXISTS "EmotionScore_gameId_fkey";
ALTER TABLE "EmotionScore" DROP CONSTRAINT IF EXISTS "EmotionScore_postGameId_fkey";
ALTER TABLE "PerformanceMetric" DROP CONSTRAINT IF EXISTS "PerformanceMetric_gameId_fkey";
ALTER TABLE "RecoveryPoint" DROP CONSTRAINT IF EXISTS "RecoveryPoint_gameId_fkey";

ALTER TABLE "EmotionScore" DROP COLUMN "gameId";
ALTER TABLE "EmotionScore" DROP COLUMN "postGameId";
ALTER TABLE "PerformanceMetric" DROP COLUMN "gameId";
ALTER TABLE "RecoveryPoint" DROP COLUMN "gameId";
ALTER TABLE "RecoveryPoint" DROP COLUMN "timeAfterGame";

-- Drop the old Game table
DROP TABLE "Game";

-- Add new foreign key constraints
ALTER TABLE "EmotionScore" ADD CONSTRAINT "EmotionScore_sessionId_fkey" 
    FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "EmotionScore" ADD CONSTRAINT "EmotionScore_postSessionId_fkey" 
    FOREIGN KEY ("postSessionId") REFERENCES "Session"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "PerformanceMetric" ADD CONSTRAINT "PerformanceMetric_sessionId_fkey" 
    FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "RecoveryPoint" ADD CONSTRAINT "RecoveryPoint_sessionId_fkey" 
    FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
