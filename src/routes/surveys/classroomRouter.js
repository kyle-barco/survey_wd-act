const {
  showSurvey,
} = require("../../03_controllers/surveys/classroomController");
const { Router } = require("express");

const surveyRouter = Router();

surveyRouter.get("/", showSurvey);
module.exports = surveyRouter;
