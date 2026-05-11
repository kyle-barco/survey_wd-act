const {
  showSurvey,
  submitSurvey,
  showResults,
} = require("../../03_controllers/surveys/classroomController");

const { Router } = require("express");

const classroomsurveyRouter = Router();

classroomsurveyRouter.get("/:id", showSurvey);
classroomsurveyRouter.get("/:id/results", showResults);
classroomsurveyRouter.post("/:id/respond", submitSurvey);

module.exports = classroomsurveyRouter;
