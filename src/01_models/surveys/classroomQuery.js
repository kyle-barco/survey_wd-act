const { prisma } = require("../../../lib/prisma");

// List all surveys, grouped by classroom (for the index listing page)
exports.getAllSurveysGroupedByClassroom = async () => {
  return await prisma.classroom.findMany({
    include: {
      surveys: {
        orderBy: { createdAt: "desc" },
      },
      teacher: {
        select: { name: true },
      },
    },
    orderBy: { name: "asc" },
  });
};

// Get a single survey with its classroom (for the answer page)
exports.getClassroomSurveyById = async (id) => {
  return await prisma.survey.findUnique({
    where: { id: parseInt(id) },
    include: { classroom: true },
  });
};

const FIXED_SURVEY_ID = 1; // hardcoded survey ID

exports.submitFeedback = async (data) => {
  return await prisma.feedback.create({
    data: {
      grade:          data.grade         || "Unknown",
      subject:        data.subject       || "General",
      rating:         parseInt(data.rating, 10) || 5,
      favoriteLesson: data.favoriteLesson || "None",
      suggestions:    data.suggestions   || null,
      anonymous:      data.anonymous === true || data.anonymous === "true",
      surveyId:       FIXED_SURVEY_ID,
      studentId:      data.studentId ? parseInt(data.studentId, 10) : null,
    },
  });
};

// Get a survey with all its feedback responses (for results page)
exports.getSurveyResults = async (id) => {
  return await prisma.survey.findUnique({
    where: { id: parseInt(id) },
    include: {
      classroom: true,
      responses: {
        include: {
          student: { select: { name: true, email: true } },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });
};

exports.getClassroomFeedback = async () => {
  return await prisma.feedback.findMany({
    where: { surveyId: FIXED_SURVEY_ID },
    include: { student: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });
};