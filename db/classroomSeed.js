import { prisma } from "../lib/prisma.js";

async function main() {
  // 1. Find existing teacher
  const teacher = await prisma.user.findFirst({ where: { role: "TEACHER" } });
  console.log("Teacher:", teacher?.id, teacher?.name);

  // 2. Create Math classroom
  const mathClassroom = await prisma.classroom.create({
    data: { name: "Math", teacherId: teacher.id },
  });
  console.log("Math classroom created:", mathClassroom.id);

  // 3. Create Science classroom
  const scienceClassroom = await prisma.classroom.create({
    data: { name: "Science", teacherId: teacher.id },
  });
  console.log("Science classroom created:", scienceClassroom.id);

  // 4. Create English classroom
  const englishClassroom = await prisma.classroom.create({
    data: { name: "English", teacherId: teacher.id },
  });
  console.log("English classroom created:", englishClassroom.id);

  // 5. Create surveys for each classroom
  const mathSurvey = await prisma.survey.create({
    data: { title: "Feedback on Math Classroom", classId: mathClassroom.id },
  });
  console.log("Math survey created with ID:", mathSurvey.id);

  const scienceSurvey = await prisma.survey.create({
    data: { title: "Feedback on Science Classroom", classId: scienceClassroom.id },
  });
  console.log("Science survey created with ID:", scienceSurvey.id);

  const englishSurvey = await prisma.survey.create({
    data: { title: "Feedback on English Classroom", classId: englishClassroom.id },
  });
  console.log("English survey created with ID:", englishSurvey.id);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());