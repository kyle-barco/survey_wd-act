const { prisma } = require("../../../lib/prisma");

// ── Create ──────────────────────────────────────

exports.createCustomSurvey = async (data) => {
  const { title, creatorId, questions } = data;

  return await prisma.customSurvey.create({
    data: {
      title,
      creatorId,
      questions: {
        create: questions.map((q, i) => ({
          label:    q.label,
          type:     q.type,
          options:  q.options
            ? JSON.stringify(q.options.split("\n").filter(Boolean).map(o => o.trim()))
            : null,
          required: q.required === "true",
          order:    i,
        })),
      },
    },
    include: { questions: true },
  });
};

// ── Read ─────────────────────────────────────────

exports.getAllCustomSurveys = async () => {
  return await prisma.customSurvey.findMany({
    include: {
      creator:   true,
      questions: { orderBy: { order: "asc" } },
    },
    orderBy: { createdAt: "desc" },
  });
};

exports.getCustomSurveyById = async (id) => {
  return await prisma.customSurvey.findUnique({
    where: { id: parseInt(id) },
    include: {
      creator:   true,
      questions: { orderBy: { order: "asc" } },
    },
  });
};

exports.getCustomSurveyResults = async (id) => {
  return await prisma.customSurvey.findUnique({
    where: { id: parseInt(id) },
    include: {
      creator:   true,
      questions: { orderBy: { order: "asc" } },
      responses: {
        include: {
          respondent: true,
          answers: {
            include: { question: true },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });
};

// ── Submit Response ──────────────────────────────

exports.submitCustomResponse = async (data) => {
  const { surveyId, respondentId, answers } = data;

  return await prisma.customResponse.create({
    data: {
      surveyId:     parseInt(surveyId),
      respondentId: respondentId ? parseInt(respondentId) : null,
      answers: {
        create: Object.entries(answers).map(([questionId, value]) => ({
          questionId: parseInt(questionId),
          value: Array.isArray(value) ? value.join(", ") : value,
        })),
      },
    },
    include: { answers: true },
  });
};

// ── Delete ───────────────────────────────────────

exports.deleteCustomSurvey = async (id) => {
  // delete in order due to relations
  await prisma.customAnswer.deleteMany({
    where: { response: { surveyId: parseInt(id) } },
  });
  await prisma.customResponse.deleteMany({
    where: { surveyId: parseInt(id) },
  });
  await prisma.customAnswer.deleteMany({
    where: { question: { surveyId: parseInt(id) } },
  });
  await prisma.customQuestion.deleteMany({
    where: { surveyId: parseInt(id) },
  });
  return await prisma.customSurvey.delete({
    where: { id: parseInt(id) },
  });
};