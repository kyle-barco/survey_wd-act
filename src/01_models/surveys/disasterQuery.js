const { prisma } = require("../../../lib/prisma");

exports.getDisasterSurveyById = async (id) => {
  return await prisma.disasterSurvey.findUnique({
    where: { id: parseInt(id) },
    include: { admin: true },
  });
};

exports.getAllDisasterSurveys = async () => {
  return await prisma.disasterSurvey.findMany({
    include: { admin: true },
    orderBy: { createdAt: "desc" },
  });
};

// helper at the top of the file
const toBoolean = (val) => {
  if (val === null || val === undefined || val === "") return null;
  return val === "true";
};

exports.submitDisasterResponse = async (data) => {
  return await prisma.disasterSurveyResponse.create({
    data: {
      // Household Readiness
      householdSize: data.householdSize ? parseInt(data.householdSize) : null,
      hasEmergencyPlan: toBoolean(data.hasEmergencyPlan),
      planPracticeFreq: data.planPracticeFreq || null,
      awareCommunityAlerts: toBoolean(data.awareCommunityAlerts),

      // Emergency Supplies
      hasGoBag: toBoolean(data.hasGoBag),
      waterSupplyDays: data.waterSupplyDays
        ? parseInt(data.waterSupplyDays)
        : null,
      hasFirstAidKit: toBoolean(data.hasFirstAidKit),
      hasFlashlight: toBoolean(data.hasFlashlight),
      hasBatteryRadio: toBoolean(data.hasBatteryRadio),
      foodSupplyDays: data.foodSupplyDays
        ? parseInt(data.foodSupplyDays)
        : null,

      // Evacuation Planning
      knowsEvacuationRoute: toBoolean(data.knowsEvacuationRoute),
      hasDesignatedMeetingPoint: toBoolean(data.hasDesignatedMeetingPoint),
      practisedEvacuation: toBoolean(data.practisedEvacuation),
      evacPracticeFreq: data.evacPracticeFreq || null,
      knowsLocalShelter: toBoolean(data.knowsLocalShelter),

      // General
      biggestConcern: data.biggestConcern || null,
      additionalComments: data.additionalComments || null,

      surveyId: parseInt(data.surveyId),
      respondentId: data.respondentId ? parseInt(data.respondentId) : null,
    },
  });
};
exports.getDisasterSurveyResults = async (id) => {
  return await prisma.disasterSurvey.findUnique({
    where: { id: parseInt(id) },
    include: {
      admin: true,
      responses: {
        include: { respondent: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });
};

exports.getDisasterSurveysByCategory = async (category) => {
  return await prisma.disasterSurvey.findMany({
    where: { category },
    include: {
      admin: true,
      responses: true,
    },
    orderBy: { createdAt: "desc" },
  });
};
