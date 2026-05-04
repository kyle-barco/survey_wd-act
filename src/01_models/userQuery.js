const { prisma } = require("../../lib/prisma");

exports.getId = async (userId) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  return user;
};

exports.getEmail = async (userEmail) => {
  const user = await prisma.user.findUnique({
    where: {
      email: userEmail,
    },
  });
  return user;
};

exports.userRegister = async({userName, userEmail, password, role}) => {
  const user = await prisma.user.create({
    data: {
      name: userName,
      email: userEmail,
      password: password,
    }
  })
    console.log("user Registered: " + user.name)
    return user
}
