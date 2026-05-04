const classroomQuery = require("../../01_models/surveys/classroomQuery");

exports.showSurvey = async (req, res, next) => {
  try {
    const survey = await classroomQuery.getClassroomSurveyById(req.params.id);
    if (!survey) return res.status(404).render("404");
    res.render("surveys/classroom", { survey });
  } catch (error) {
    next(error);
  }
};

exports.submitSurvey = async (req, res, next) => {
  try {
    await classroomQuery.submitFeedback({
      ...req.body,
      surveyId: req.params.id,
      studentId: req.user?.id || null,
    });
    res.redirect(`/classroom-survey/${req.params.id}/results`);
  } catch (error) {
    next(error);
  }
};

exports.showResults = async (req, res, next) => {
  try {
    const survey = await classroomQuery.getSurveyResults(req.params.id);
    if (!survey) return res.status(404).send("Survey not found");
    res.render("surveys/results", { survey });
  } catch (error) {
    next(error);
  }
};
