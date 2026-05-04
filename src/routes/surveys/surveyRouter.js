const {
  showSurvey,
  submitSurvey,
  showResults
} = require("../../03_controllers/surveys/classroomController");
const { Router } = require("express");

const surveyRouter = Router();

surveyRouter.get("/:id", showSurvey);
surveyRouter.get("/:id/results", showResults) 
surveyRouter.post("/:id/respond", submitSurvey)

module.exports = surveyRouter;
