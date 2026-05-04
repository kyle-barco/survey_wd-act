import { prisma } from "../lib/prisma.js";

async function populateWithTestData() {
 const teacher = await prisma.user.create({
    data: {
      name: "Teacher John",
      email: "teacher@test.com",
      password: "password123",
      role: "TEACHER",
    }
  })

  await prisma.classroom.create({
    data: {
      name: "Math",
      teacherId: teacher.id,
      surveys: { create: { title: "Feedback on Math Classroom" } },
    },
  })

  await prisma.classroom.create({
    data: {
      name: "Science",
      teacherId: teacher.id,
      surveys: { create: { title: "Feedback on Science Classroom" } },
    },
  })

  await prisma.classroom.create({
    data: {
      name: "Filipino",
      teacherId: teacher.id,
      surveys: { create: { title: "Feedback on Filipino Classroom" } },
    },
  })

  const allClassroom = await prisma.classroom.findMany()
  console.log("All classroom: ", JSON.stringify(allClassroom, null, 2))
}

  // const allUser = await prisma.classroom.deleteMany()

populateWithTestData()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (err) => {
    console.error(err);
    prisma.$disconnect();
    process.exit(1);
  });
