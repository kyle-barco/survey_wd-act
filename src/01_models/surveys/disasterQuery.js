const { prisma } = require("../../../lib/prisma");

const FIXED_SURVEY_ID = 1; // update after running your disaster seed

const toBoolean = (val) => {
  if (val === null || val === undefined || val === "") return null;
  return val === "true";
};

exports.getDisasterSurveyById = async (id) => {
  return await prisma.disasterSurvey.findUnique({
    where: { id: parseInt(id) },
    include: { admin: true },
  });
};

exports.submitDisasterResponse = async (data) => {
  return await prisma.disasterSurveyResponse.create({
    data: {
      // Household Info
      address:       data.address       || null,
      householdSize: data.householdSize ? parseInt(data.householdSize) : null,

      // Preparedness Check
      hasGoBag:                  toBoolean(data.hasGoBag),
      hasDesignatedMeetingPoint: data.hasDesignatedMeetingPoint === "true",
      knowsLocalShelter:         data.knowsLocalShelter         === "true",
      knowsEvacuationRoute:      data.knowsEvacuationRoute      === "true",

      // Past Disaster Experience
      biggestConcern:     data.biggestConcern     || null,
      additionalComments: data.additionalComments || null,

      surveyId:    FIXED_SURVEY_ID,
      respondentId: data.respondentId ? parseInt(data.respondentId) : null,
    },
  });
};

exports.getDisasterSurveyResults = async () => {
  return await prisma.disasterSurvey.findUnique({
    where: { id: FIXED_SURVEY_ID },
    include: {
      admin: true,
      responses: {
        include: { respondent: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });
};