const disasterQuery = require("../../01_models/surveys/disasterQuery");

exports.showSurvey = async (req, res, next) => {
  try {
    const survey = await disasterQuery.getDisasterSurveyById(req.params.id);
    if (!survey) return res.status(404).render("404");
    res.render("surveys/disaster", { survey });
  } catch (error) {
    next(error);
  }
};

exports.submitSurvey = async (req, res, next) => {
  try {
    await disasterQuery.submitDisasterResponse({
      ...req.body,
      surveyId: req.params.id,
      respondentId: req.user?.id || null,
    });
    res.redirect(`/disaster-survey/${req.params.id}/results`);
  } catch (error) {
    next(error);
  }
};

exports.showResults = async (req, res, next) => {
  try {
    const survey = await disasterQuery.getDisasterSurveyResults(req.params.id);
    if (!survey) return res.status(404).render("404");
    res.render("surveys/dresults", { survey });
  } catch (error) {
    next(error);
  }
};

exports.showAll = async (req, res, next) => {
  try {
    const surveys = await disasterQuery.getAllDisasterSurveys();
    res.render("surveys/disaster-list", { surveys });
  } catch (error) {
    next(error);
  }
};

exports.showByCategory = async (req, res, next) => {
  try {
    const surveys = await disasterQuery.getDisasterSurveysByCategory(
      req.params.category.toUpperCase()
    );
    res.render("surveys/disaster-list", { surveys });
  } catch (error) {
    next(error);
  }
};