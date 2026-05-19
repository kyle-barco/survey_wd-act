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

// Updated to accept the new demographic fields
exports.userRegister = async ({ userName, userEmail, password, role, gender, birthday, institution }) => {
  const user = await prisma.user.create({
    data: {
      name: userName,
      email: userEmail,
      password: password,
      role: role,
      gender: gender,                  // Expects "MALE", "FEMALE", or "OTHER"
      birthday: new Date(birthday),    // Converts the HTML date string to a proper backend DateTime object
      institution: institution || null // If empty, sets it as null in the database
    }
  });
  
  console.log("User Registered: " + user.name);
  return user;
};