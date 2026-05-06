import { prisma } from "../lib/prisma.js";

async function populateWithTestData() {
  const user = await prisma.user.createMany({
    data: [
      {
        name: "Shai",
        email: "shai@test.com",
        password: process.env.TEST_PASSWORD,
      },
      {
        name: "Kyle",
        email: "kyle@test.com",
        password: "mabahoka",
      },
      {
        name: "Jisun Titum",
        email: "Jisun@Titum.com",
        password: "JisunMalaks",
      },
    ],
  });
}

const allUser = await prisma.user.findMany();
// const allUser = await prisma.user.deleteMany()
console.log("All Users: ", JSON.stringify(allUser, null, 2));

populateWithTestData()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (err) => {
    console.error(err);
    prisma.$disconnect();
    process.exit(1);
  });
