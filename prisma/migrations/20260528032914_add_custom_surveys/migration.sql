-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('short', 'long', 'multiple', 'checkbox', 'dropdown', 'rating', 'scale');

-- CreateTable
CREATE TABLE "CustomSurvey" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" INTEGER NOT NULL,

    CONSTRAINT "CustomSurvey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomSurveyQuestion" (
    "id" SERIAL NOT NULL,
    "order" INTEGER NOT NULL,
    "type" "QuestionType" NOT NULL,
    "label" TEXT NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "choices" JSONB,
    "surveyId" INTEGER NOT NULL,

    CONSTRAINT "CustomSurveyQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomSurveyResponse" (
    "id" SERIAL NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "surveyId" INTEGER NOT NULL,
    "respondent" INTEGER NOT NULL,

    CONSTRAINT "CustomSurveyResponse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomSurveyAnswer" (
    "id" SERIAL NOT NULL,
    "value" TEXT NOT NULL,
    "responseId" INTEGER NOT NULL,
    "questionId" INTEGER NOT NULL,

    CONSTRAINT "CustomSurveyAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CustomSurveyResponse_surveyId_respondent_key" ON "CustomSurveyResponse"("surveyId", "respondent");

-- AddForeignKey
ALTER TABLE "CustomSurvey" ADD CONSTRAINT "CustomSurvey_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomSurveyQuestion" ADD CONSTRAINT "CustomSurveyQuestion_surveyId_fkey" FOREIGN KEY ("surveyId") REFERENCES "CustomSurvey"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomSurveyResponse" ADD CONSTRAINT "CustomSurveyResponse_surveyId_fkey" FOREIGN KEY ("surveyId") REFERENCES "CustomSurvey"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomSurveyResponse" ADD CONSTRAINT "CustomSurveyResponse_respondent_fkey" FOREIGN KEY ("respondent") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomSurveyAnswer" ADD CONSTRAINT "CustomSurveyAnswer_responseId_fkey" FOREIGN KEY ("responseId") REFERENCES "CustomSurveyResponse"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomSurveyAnswer" ADD CONSTRAINT "CustomSurveyAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "CustomSurveyQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
