-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'TEACHER', 'STUDENT');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'STUDENT',
    "phone" TEXT,
    "address" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "resetPasswordToken" TEXT,
    "resetPasswordExpires" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClassroomFeedback" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "name" TEXT,
    "gradeSection" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "teacherRating" INTEGER NOT NULL,
    "favoriteLesson" TEXT NOT NULL,
    "suggestions" TEXT NOT NULL,
    "isAnonymous" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClassroomFeedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DisasterSurvey" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "address" TEXT NOT NULL,
    "familyMembers" INTEGER NOT NULL,
    "hasEmergencyKit" BOOLEAN NOT NULL,
    "evacuationPlan" TEXT[],
    "pastExperience" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DisasterSurvey_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "ClassroomFeedback" ADD CONSTRAINT "ClassroomFeedback_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DisasterSurvey" ADD CONSTRAINT "DisasterSurvey_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
