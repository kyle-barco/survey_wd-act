
const { prisma } = require("../../../lib/prisma");
const customQuery = require("../../01_models/surveys/customSurveyQuery");

// ── Show Create Form ─────────────────────────────

exports.showCreateForm = async (req, res, next) => {
  try {
    if (!req.user) return res.redirect("/login");
    res.render("surveys/custom-survey", { survey: null, mode: 'create' });
  } catch (error) {
    next(error);
  }
};

// ── Create Survey ────────────────────────────────

exports.createSurvey = async (req, res, next) => {
  try {
    if (!req.user) return res.redirect("/login");

    const { title, questions } = req.body;

    if (!questions) {
      return res.status(400).render("surveys/custom-survey", {
        error: "Please add at least one question.",
      });
    }

    await customQuery.createCustomSurvey({
      title,
      creatorId: req.user.id,
      questions: Object.values(questions),
    });

    res.redirect("/");
  } catch (error) {
    next(error);
  }
};

// ── Show Survey (Take) ───────────────────────────

exports.showSurvey = async (req, res, next) => {
  try {
    const surveyData = await customQuery.getCustomSurveyById(req.params.id);
    if (!surveyData) return res.status(404).render("404");

    const formattedQuestions = surveyData.questions.map(q => {
      let parsedOptions = [];
      if (q.options) {
        try {
          parsedOptions = typeof q.options === 'string' ? JSON.parse(q.options) : q.options;
        } catch (e) {
          parsedOptions = [];
        }
      }
      return {
        id: q.id,
        label: q.label,
        type: q.type,
        required: q.required,
        options: parsedOptions
      };
    });

    // Pass 'survey' and set mode to 'take'
    res.render("surveys/custom-survey", { 
      survey: {
        id: surveyData.id,
        title: surveyData.title,
        questions: formattedQuestions
      },
      mode: 'take' 
    });
  } catch (error) {
    next(error);
  }
};

// ── Submit Response ──────────────────────────────

exports.submitSurvey = async (req, res, next) => {
  try {
    const surveyId = parseInt(req.params.id);
    let answersData = req.body.answers;

    if (!answersData) {
      return res.status(400).send("No answers submitted.");
    }

    // 1. Create the parent CustomResponse record
    const newResponse = await prisma.customResponse.create({
      data: {
        surveyId: surveyId,
        respondentId: req.user ? req.user.id : null
      }
    });

    // 2. Isolate keys and filter out anything that isn't a strict question ID
    const validQuestionIds = Object.keys(answersData).filter(key => {
      const parsed = parseInt(key);
      return !isNaN(parsed); // Only process numeric keys (database IDs)
    });

    // 3. Map out the answer creations
    const answerPromises = validQuestionIds.map(async (key) => {
      const questionId = parseInt(key);
      let rawValue = answersData[key];

      // Cleanly flatten checkbox arrays to a single string if needed
      if (Array.isArray(rawValue)) {
        rawValue = rawValue.filter(v => v !== "").join(", ");
      }

      // Final type safety check: Skip if value is missing but questionId exists
      return prisma.customAnswer.create({
        data: {
          value: rawValue !== undefined && rawValue !== null ? String(rawValue) : "",
          questionId: questionId,
          responseId: newResponse.id
        }
      });
    });

    // 4. Resolve the batch safely
    await Promise.all(answerPromises);

    // Success! Redirect to results view
    res.redirect(`/custom-survey/${surveyId}/results`);

  } catch (error) {
    console.error("Error saving survey responses:", error);
    next(error);
  }
};

// ── Show Results ─────────────────────────────────

exports.showResults = async (req, res, next) => {
  try {
    if (!req.user) return res.redirect("/login");

    // Fetch deep nested relationships from disasterQuery model wrapper
    const surveyData = await customQuery.getCustomSurveyResults(req.params.id);
    if (!surveyData) return res.status(404).render("404");

    // Cleanly map questions to ensure options are always arrays
    const formattedQuestions = surveyData.questions.map(q => {
      let parsedOptions = [];
      if (q.options) {
        try {
          parsedOptions = typeof q.options === 'string' ? JSON.parse(q.options) : q.options;
        } catch (e) {
          parsedOptions = [];
        }
      }
      return {
        id: q.id,
        label: q.label,
        type: q.type, // Matches QuestionType enum
        required: q.required,
        options: Array.isArray(parsedOptions) ? parsedOptions : []
      };
    });

    // Deep map responses to decouple Prisma runtime proxies
    const formattedResponses = (surveyData.responses || []).map(r => {
      return {
        id: r.id,
        createdAt: r.createdAt,
        respondent: r.respondent ? { name: r.respondent.name, email: r.respondent.email } : null,
        answers: (r.answers || []).map(a => ({
          id: a.id,
          value: a.value || "",
          questionId: a.questionId
        }))
      };
    });

    // Send perfectly decoupled data structures to the template engine
    res.render("surveys/custom-result", { 
      survey: {
        id: surveyData.id,
        title: surveyData.title,
        questions: formattedQuestions,
        responses: formattedResponses
      } 
    });
  } catch (error) {
    next(error);
  }
};

// ── Show All ─────────────────────────────────────

exports.showAll = async (req, res, next) => {
  try {
    const surveys = await prisma.customSurvey.findMany({
      include: {
        questions: true,
        _count: {
          select: { responses: true } // Dynamically aggregates total submissions
        }
      }
    });

    res.render("surveys/custom-list", { surveys });
  } catch (error) {
    next(error);
  }
};

// ── Delete Survey ────────────────────────────────

exports.deleteSurvey = async (req, res, next) => {
  try {
    if (!req.user) return res.redirect("/login");

    await customQuery.deleteCustomSurvey(req.params.id);
    res.redirect("/");
  } catch (error) {
    next(error);
  }
};