/*
  Warnings:

  - You are about to drop the column `awareCommunityAlerts` on the `DisasterSurveyResponse` table. All the data in the column will be lost.
  - You are about to drop the column `evacPracticeFreq` on the `DisasterSurveyResponse` table. All the data in the column will be lost.
  - You are about to drop the column `foodSupplyDays` on the `DisasterSurveyResponse` table. All the data in the column will be lost.
  - You are about to drop the column `hasBatteryRadio` on the `DisasterSurveyResponse` table. All the data in the column will be lost.
  - You are about to drop the column `hasEmergencyPlan` on the `DisasterSurveyResponse` table. All the data in the column will be lost.
  - You are about to drop the column `hasFirstAidKit` on the `DisasterSurveyResponse` table. All the data in the column will be lost.
  - You are about to drop the column `hasFlashlight` on the `DisasterSurveyResponse` table. All the data in the column will be lost.
  - You are about to drop the column `planPracticeFreq` on the `DisasterSurveyResponse` table. All the data in the column will be lost.
  - You are about to drop the column `practisedEvacuation` on the `DisasterSurveyResponse` table. All the data in the column will be lost.
  - You are about to drop the column `waterSupplyDays` on the `DisasterSurveyResponse` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "DisasterSurveyResponse" DROP COLUMN "awareCommunityAlerts",
DROP COLUMN "evacPracticeFreq",
DROP COLUMN "foodSupplyDays",
DROP COLUMN "hasBatteryRadio",
DROP COLUMN "hasEmergencyPlan",
DROP COLUMN "hasFirstAidKit",
DROP COLUMN "hasFlashlight",
DROP COLUMN "planPracticeFreq",
DROP COLUMN "practisedEvacuation",
DROP COLUMN "waterSupplyDays",
ADD COLUMN     "address" TEXT;
