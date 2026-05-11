const {
  showSurvey,
  submitSurvey,
  showResults,
} = require("../../03_controllers/surveys/disasterController");

const { Router } = require("express");

const disasterSurveyRouter = Router();

disasterSurveyRouter.get("/:id", showSurvey);
disasterSurveyRouter.get("/:id/results", showResults);
disasterSurveyRouter.post("/:id/respond", submitSurvey);

module.exports = disasterSurveyRouter;
