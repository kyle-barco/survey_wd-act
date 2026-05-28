const prisma = require('../config/db');

// ── GET /surveys/custom ── List all surveys (teacher/admin view)
const listSurveys = async (req, res) => {
  try {
    const surveys = await prisma.customSurvey.findMany({
      where: { createdBy: req.user.id },
      include: {
        _count: { select: { questions: true, responses: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.render('surveys/custom-survey-list', { title: 'My Surveys', surveys, user: req.user });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};
 
// ── GET /surveys/custom/builder ── Show the drag-and-drop builder (create)
const showBuilder = (req, res) => {
  res.render('surveys/custom-survey-builder', { title: 'Survey Builder', survey: null, user: req.user });
};
 
// ── GET /surveys/custom/:id/edit ── Load an existing survey into the builder
const editBuilder = async (req, res) => {
  try {
    const survey = await prisma.customSurvey.findFirst({
      where: { id: parseInt(req.params.id), createdBy: req.user.id },
      include: { questions: { orderBy: { order: 'asc' } } },
    });
    if (!survey) return res.status(404).send('Survey not found');
    res.render('surveys/custom-survey-builder', { title: 'Edit Survey', survey, user: req.user });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};
 
// ── POST /surveys/custom ── Save a new survey from the builder JSON
const createSurvey = async (req, res) => {
  try {
    const { title, description, questions } = req.body;
 
    const survey = await prisma.customSurvey.create({
      data: {
        title,
        description,
        createdBy: req.user.id,
        questions: {
          create: questions.map((q) => ({
            order:    q.order,
            type:     q.type,
            label:    q.label,
            required: q.required,
            choices:  q.choices ?? [],
          })),
        },
      },
    });
 
    res.json({ success: true, surveyId: survey.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to save survey' });
  }
};
 
// ── PUT /surveys/custom/:id ── Update an existing survey
const updateSurvey = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { title, description, questions } = req.body;
 
    // Delete old questions then recreate (simplest approach)
    await prisma.customSurveyQuestion.deleteMany({ where: { surveyId: id } });
 
    await prisma.customSurvey.update({
      where: { id },
      data: {
        title,
        description,
        questions: {
          create: questions.map((q) => ({
            order:    q.order,
            type:     q.type,
            label:    q.label,
            required: q.required,
            choices:  q.choices ?? [],
          })),
        },
      },
    });
 
    res.json({ success: true, surveyId: id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to update survey' });
  }
};
 
// ── DELETE /surveys/custom/:id ── Delete a survey
const deleteSurvey = async (req, res) => {
  try {
    await prisma.customSurvey.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};
 
// ── GET /surveys/custom/:id/fill ── Student fills out the survey
const fillSurvey = async (req, res) => {
  try {
    const survey = await prisma.customSurvey.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { questions: { orderBy: { order: 'asc' } } },
    });
    if (!survey || !survey.isActive) return res.status(404).send('Survey not found');
 
    // Check if student already responded
    const existing = await prisma.customSurveyResponse.findFirst({
      where: { surveyId: survey.id, respondent: req.user.id },
    });
 
    res.render('surveys/custom-survey-fill', {
      title: survey.title,
      survey,
      alreadySubmitted: !!existing,
      user: req.user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};
 
// ── POST /surveys/custom/:id/submit ── Student submits answers
const submitSurvey = async (req, res) => {
  try {
    const surveyId = parseInt(req.params.id);
    const { answers } = req.body; // [{ questionId, value }]
 
    // Prevent double submission
    const existing = await prisma.customSurveyResponse.findFirst({
      where: { surveyId, respondent: req.user.id },
    });
    if (existing) return res.json({ success: false, message: 'Already submitted' });
 
    await prisma.customSurveyResponse.create({
      data: {
        surveyId,
        respondent: req.user.id,
        answers: {
          create: answers.map((a) => ({
            questionId: a.questionId,
            value: Array.isArray(a.value) ? JSON.stringify(a.value) : String(a.value),
          })),
        },
      },
    });
 
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Submission failed' });
  }
};
 
// ── GET /surveys/custom/:id/results ── Teacher views aggregated results
const viewResults = async (req, res) => {
  try {
    const survey = await prisma.customSurvey.findFirst({
      where: { id: parseInt(req.params.id), createdBy: req.user.id },
      include: {
        questions: { orderBy: { order: 'asc' } },
        responses: {
          include: {
            user:    { select: { name: true, email: true } },
            answers: true,
          },
        },
      },
    });
    if (!survey) return res.status(404).send('Survey not found');
 
    // Build aggregated stats per question
    const stats = survey.questions.map((q) => {
      const allAnswers = survey.responses.flatMap((r) =>
        r.answers.filter((a) => a.questionId === q.id).map((a) => a.value)
      );
 
      let summary = null;
      if (['multiple', 'dropdown'].includes(q.type)) {
        const counts = {};
        allAnswers.forEach((v) => { counts[v] = (counts[v] || 0) + 1; });
        summary = counts;
      } else if (q.type === 'checkbox') {
        const counts = {};
        allAnswers.forEach((v) => {
          try { JSON.parse(v).forEach((item) => { counts[item] = (counts[item] || 0) + 1; }); }
          catch { counts[v] = (counts[v] || 0) + 1; }
        });
        summary = counts;
      } else if (['rating', 'scale'].includes(q.type)) {
        const nums = allAnswers.map(Number).filter((n) => !isNaN(n));
        summary = {
          avg: nums.length ? (nums.reduce((a, b) => a + b, 0) / nums.length).toFixed(1) : 'N/A',
          count: nums.length,
        };
      }
 
      return { ...q, allAnswers, summary };
    });
 
    res.render('surveys/custom-survey-results', {
      title: `Results – ${survey.title}`,
      survey,
      stats,
      totalResponses: survey.responses.length,
      user: req.user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};
 
module.exports = {
  listSurveys,
  showBuilder,
  editBuilder,
  createSurvey,
  updateSurvey,
  deleteSurvey,
  fillSurvey,
  submitSurvey,
  viewResults,
};