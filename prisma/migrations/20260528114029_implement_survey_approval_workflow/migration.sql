-- CreateEnum
CREATE TYPE "SurveyStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "CustomSurvey" ADD COLUMN     "status" "SurveyStatus" NOT NULL DEFAULT 'PENDING';
