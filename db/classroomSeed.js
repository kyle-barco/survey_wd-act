import { prisma } from "../lib/prisma.js";

async function main() {
  // 1. Find existing teacher/admin
  const admin = await prisma.user.findFirst({ where: { role: "TEACHER" } });
  console.log("Admin:", admin?.id, admin?.name);

  // 2. Create one disaster survey covering all required fields
  const survey = await prisma.disasterSurvey.create({
    data: {
      title: "Disaster Preparedness Survey",
      category: "HOUSEHOLD_READINESS",
      adminId: admin.id,
    },
  });
  console.log("Disaster survey created with ID:", survey.id);
  console.log("\n✅ Use this in disasterQuery.js → FIXED_SURVEY_ID =", survey.id);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());