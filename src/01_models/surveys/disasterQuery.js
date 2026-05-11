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

exports.submitDisasterResponse = async (data) => {
  return await prisma.disasterSurveyResponse.create({
    data: {
      // Household Readiness
      householdSize:        data.householdSize ? parseInt(data.householdSize) : null,
      hasEmergencyPlan:     data.hasEmergencyPlan ?? null,
      planPracticeFreq:     data.planPracticeFreq || null,
      awareCommunityAlerts: data.awareCommunityAlerts ?? null,

      // Emergency Supplies
      hasGoBag:        data.hasGoBag ?? null,
      waterSupplyDays: data.waterSupplyDays ? parseInt(data.waterSupplyDays) : null,
      hasFirstAidKit:  data.hasFirstAidKit ?? null,
      hasFlashlight:   data.hasFlashlight ?? null,
      hasBatteryRadio: data.hasBatteryRadio ?? null,
      foodSupplyDays:  data.foodSupplyDays ? parseInt(data.foodSupplyDays) : null,

      // Evacuation Planning
      knowsEvacuationRoute:      data.knowsEvacuationRoute ?? null,
      hasDesignatedMeetingPoint: data.hasDesignatedMeetingPoint ?? null,
      practisedEvacuation:       data.practisedEvacuation ?? null,
      evacPracticeFreq:          data.evacPracticeFreq || null,
      knowsLocalShelter:         data.knowsLocalShelter ?? null,

      // General
      biggestConcern:     data.biggestConcern || null,
      additionalComments: data.additionalComments || null,

      surveyId:    parseInt(data.surveyId),
      respondentId: data.respondentId ? parseInt(data.respondentId) : null,
    }
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