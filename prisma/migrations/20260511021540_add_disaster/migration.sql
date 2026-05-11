-- CreateEnum
CREATE TYPE "DisasterSurveyCategory" AS ENUM ('HOUSEHOLD_READINESS', 'EMERGENCY_SUPPLIES', 'EVACUATION_PLANNING');

-- CreateTable
CREATE TABLE "DisasterSurvey" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "category" "DisasterSurveyCategory" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "classId" INTEGER NOT NULL,

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
    "hasGoBAg" BOOLEAN,
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
ALTER TABLE "DisasterSurvey" ADD CONSTRAINT "DisasterSurvey_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Classroom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DisasterSurveyResponse" ADD CONSTRAINT "DisasterSurveyResponse_surveyId_fkey" FOREIGN KEY ("surveyId") REFERENCES "DisasterSurvey"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DisasterSurveyResponse" ADD CONSTRAINT "DisasterSurveyResponse_respondentId_fkey" FOREIGN KEY ("respondentId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
