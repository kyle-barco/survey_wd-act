const disasterQuery = require("../../01_models/surveys/disasterQuery");

const FIXED_SURVEY_ID = 1; // update this after running your disaster seed

// GET /disaster-survey — render the form directly
exports.showSurvey = async (req, res, next) => {
  try {
    const survey = await disasterQuery.getDisasterSurveyById(FIXED_SURVEY_ID);
    res.render("surveys/disaster", { survey });
  } catch (error) {
    next(error);
  }
};

// POST /disaster-survey/respond — save response
exports.submitSurvey = async (req, res, next) => {
  try {
    await disasterQuery.submitDisasterResponse({
      ...req.body,
      surveyId:    FIXED_SURVEY_ID,
      respondentId: req.user?.id || null,
    });
    res.redirect("/disaster-survey/thank-you");
  } catch (error) {
    next(error);
  }
};

// GET /disaster-survey/thank-you
exports.thankYou = (req, res) => {
  res.render("surveys/classroom/thank-you");
};

// GET /disaster-survey/results — teacher only
exports.showResults = async (req, res, next) => {
  try {
    const survey = await disasterQuery.getDisasterSurveyResults(FIXED_SURVEY_ID);
    if (!survey) return res.status(404).render("404");
    res.render("surveys/dresults", { survey });
  } catch (error) {
    next(error);
  }
};