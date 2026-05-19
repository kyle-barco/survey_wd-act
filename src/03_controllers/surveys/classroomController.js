const classroomQuery = require("../../01_models/surveys/classroomQuery"); 

// GET /classroom-survey — Main survey listing page or form
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
    // Fallback logic to determine if response should be marked anonymous
    const isAnonymous = req.body.anonymous === 'true' || req.body.anonymous === true;

    await classroomQuery.submitFeedback({
      ...req.body,
      anonymous: isAnonymous,
      // If the student chooses anonymity, your schema allows studentId to be null
      studentId: isAnonymous ? null : (req.user?.id || null),
    });
    
    res.redirect("/classroom-survey/thank-you");
  } catch (error) {
    next(error);
  }
};

// GET /classroom-survey/thank-you (or with /:id/thank-you)
// Note: Merged the duplicate function declarations into one flexible handler
exports.thankYou = (req, res) => {
  res.render("surveys/classroom/thank-you", { 
    surveyId: req.params.id || null 
  });
};

// GET /classroom-survey/:id/results — teacher only
exports.showResults = async (req, res, next) => {
  try {
    // Parse the ID to an integer since your Prisma schema uses Auto-Increment Int IDs
    const surveyId = parseInt(req.params.id, 10);
    
    if (isNaN(surveyId)) {
      return res.status(400).render("404", { message: "Invalid Survey ID" });
    }

    const survey = await classroomQuery.getSurveyResults(surveyId);
    
    if (!survey) {
      return res.status(404).render("404");
    }
    
    res.render("surveys/classroom/results", { survey });
  } catch (error) {
    next(error);
  }
};