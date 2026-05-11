import { prisma } from "../lib/prisma.js";

async function populateWithTestData() {
  const admin = await prisma.user.upsert({
    where: { email: "admin@disasterprep.com" },
    update: {},
    create: {
      name: "Admin Maria",
      email: "admin@disasterprep.com",
      password: "password123",
      role: "TEACHER",
    }
  });

  await prisma.disasterSurvey.createMany({
    data: [
      {
        title: "Disaster Preparedness Survey - Household Readiness",
        category: "HOUSEHOLD_READINESS",
        adminId: admin.id,
      },
      {
        title: "Disaster Preparedness Survey - Emergency Supplies",
        category: "EMERGENCY_SUPPLIES",
        adminId: admin.id,
      },
      {
        title: "Disaster Preparedness Survey - Evacuation Planning",
        category: "EVACUATION_PLANNING",
        adminId: admin.id,
      },
    ],
    skipDuplicates: true,
  });

  const disaster = await prisma.disasterSurvey.findMany();
  console.log("All disaster surveys: ", JSON.stringify(disaster, null, 2));
}

populateWithTestData()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (err) => {
    console.error(err);
    prisma.$disconnect();
    process.exit(1);
  });