-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('TEXT', 'RADIO', 'CHECKBOX', 'DROPDOWN', 'RATING');

-- CreateTable
CREATE TABLE "CustomSurvey" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "creatorId" INTEGER NOT NULL,

    CONSTRAINT "CustomSurvey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomQuestion" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,
    "type" "QuestionType" NOT NULL,
    "options" TEXT,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL,
    "surveyId" INTEGER NOT NULL,

    CONSTRAINT "CustomQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomResponse" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "surveyId" INTEGER NOT NULL,
    "respondentId" INTEGER,

    CONSTRAINT "CustomResponse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomAnswer" (
    "id" SERIAL NOT NULL,
    "value" TEXT NOT NULL,
    "questionId" INTEGER NOT NULL,
    "responseId" INTEGER NOT NULL,

    CONSTRAINT "CustomAnswer_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CustomSurvey" ADD CONSTRAINT "CustomSurvey_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomQuestion" ADD CONSTRAINT "CustomQuestion_surveyId_fkey" FOREIGN KEY ("surveyId") REFERENCES "CustomSurvey"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomResponse" ADD CONSTRAINT "CustomResponse_surveyId_fkey" FOREIGN KEY ("surveyId") REFERENCES "CustomSurvey"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomResponse" ADD CONSTRAINT "CustomResponse_respondentId_fkey" FOREIGN KEY ("respondentId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomAnswer" ADD CONSTRAINT "CustomAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "CustomQuestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomAnswer" ADD CONSTRAINT "CustomAnswer_responseId_fkey" FOREIGN KEY ("responseId") REFERENCES "CustomResponse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
