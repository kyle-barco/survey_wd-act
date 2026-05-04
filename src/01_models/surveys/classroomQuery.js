const { prisma } = require("../../../lib/prisma");

exports.getClassroomSurveyById = async (id) => {
  return await prisma.survey.findUnique({
    where: { id: parseInt(id) },
    include: { classroom: true },
  });
};
