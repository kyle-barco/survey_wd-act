const { prisma } = require("../../../lib/prisma");

exports.getClassroomSurveyById = async (id) => {
  return await prisma.survey.findUnique({
    where: { id: parseInt(id) },
    include: { classroom: true },
  });
};

exports.submitFeedback = async (data) => {
  return await prisma.feedback.create({
    data: {
      mood: data.mood,
      understanding: parseInt(data.understanding),
      pacing: data.pacing,
      confusingPart: data.confusingPart || null,
      favoritePart: data.favoritePart || null,
      shoutout: data.shoutout || null,
      surveyId: parseInt(data.surveyId),
      studentId: data.studentId || null,
    }
  })
}

exports.getSurveyResults = async (id) => {
  return await prisma.survey.findUnique({
    where: { id: parseInt(id) },
    include: {
      classroom: true,
      responses: {
        include: { student: true }
      }
    }
  })
}
