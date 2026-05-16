/*
  Warnings:

  - You are about to drop the column `confusingPart` on the `Feedback` table. All the data in the column will be lost.
  - You are about to drop the column `favoritePart` on the `Feedback` table. All the data in the column will be lost.
  - You are about to drop the column `mood` on the `Feedback` table. All the data in the column will be lost.
  - You are about to drop the column `pacing` on the `Feedback` table. All the data in the column will be lost.
  - You are about to drop the column `shoutout` on the `Feedback` table. All the data in the column will be lost.
  - You are about to drop the column `understanding` on the `Feedback` table. All the data in the column will be lost.
  - Added the required column `favoriteLesson` to the `Feedback` table without a default value. This is not possible if the table is not empty.
  - Added the required column `grade` to the `Feedback` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rating` to the `Feedback` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subject` to the `Feedback` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "DisasterSurveyCategory" AS ENUM ('HOUSEHOLD_READINESS', 'EMERGENCY_SUPPLIES', 'EVACUATION_PLANNING');

-- AlterTable
ALTER TABLE "Feedback" DROP COLUMN "confusingPart",
DROP COLUMN "favoritePart",
DROP COLUMN "mood",
DROP COLUMN "pacing",
DROP COLUMN "shoutout",
DROP COLUMN "understanding",
ADD COLUMN     "anonymous" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "favoriteLesson" TEXT NOT NULL,
ADD COLUMN     "grade" TEXT NOT NULL,
ADD COLUMN     "rating" INTEGER NOT NULL,
ADD COLUMN     "subject" TEXT NOT NULL,
ADD COLUMN     "suggestions" TEXT;

-- CreateTable
CREATE TABLE "DisasterSurvey" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "category" "DisasterSurveyCategory" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "adminId" INTEGER NOT NULL,

    CONSTRAINT "DisasterSurvey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DisasterSurveyResponse" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "householdSize" INTEGER,
    "hasEmergencyPlan" BOOLEAN,
    "planPracticeFreq" TEXT,
    "awareCommunityAlerts" BOOLEAN,
    "hasGoBag" BOOLEAN,
    "waterSupplyDays" INTEGER,
    "hasFirstAidKit" BOOLEAN,
    "hasFlashlight" BOOLEAN,
    "hasBatteryRadio" BOOLEAN,
    "foodSupplyDays" INTEGER,
    "knowsEvacuationRoute" BOOLEAN,
    "hasDesignatedMeetingPoint" BOOLEAN,
    "practisedEvacuation" BOOLEAN,
    "evacPracticeFreq" TEXT,
    "knowsLocalShelter" BOOLEAN,
    "biggestConcern" TEXT,
    "additionalComments" TEXT,
    "surveyId" INTEGER NOT NULL,
    "respondentId" INTEGER,

    CONSTRAINT "DisasterSurveyResponse_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DisasterSurvey" ADD CONSTRAINT "DisasterSurvey_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DisasterSurveyResponse" ADD CONSTRAINT "DisasterSurveyResponse_surveyId_fkey" FOREIGN KEY ("surveyId") REFERENCES "DisasterSurvey"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DisasterSurveyResponse" ADD CONSTRAINT "DisasterSurveyResponse_respondentId_fkey" FOREIGN KEY ("respondentId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
