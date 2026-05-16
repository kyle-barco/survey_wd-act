const classroomQuery = require("../../01_models/surveys/classroomQuery"); // fix path to yours

exports.showSurvey = async (req, res, next) => {
  try {
    const feedbacks = await classroomQuery.getClassroomFeedback();
    res.render("surveys/classroom/classroom", { feedbacks });
  } catch (error) {
    next(error);
  }
};

// POST /classroom-survey/respond — save feedback
exports.submitSurvey = async (req, res, next) => {
  try {
    await classroomQuery.submitFeedback({
      ...req.body,
      studentId: req.user?.id || null,
    });
    res.redirect("/classroom-survey/thank-you");
  } catch (error) {
    next(error);
  }
};

// GET /classroom-survey/thank-you
exports.thankYou = (req, res) => {
  res.render("surveys/classroom/thank-you");
};

// GET /classroom-survey/:id/thank-you — confirmation page
exports.thankYou = (req, res) => {
  res.render("surveys/classroom/thank-you", { surveyId: req.params.id });
};

// GET /classroom-survey/:id/results — teacher only
exports.showResults = async (req, res, next) => {
  try {
    const survey = await classroomQuery.getSurveyResults(req.params.id);
    if (!survey) return res.status(404).render("404");
    res.render("surveys/classroom/results", { survey });
  } catch (error) {
    next(error);
  }
};