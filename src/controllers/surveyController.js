const prisma = require('../config/db');
const { validationResult } = require('express-validator');

// ── Classroom Feedback ──────────────────────────────────────

// GET /surveys/classroom-feedback
const getClassroomForm = (req, res) => {
  res.render('surveys/classroom-feedback', { title: 'Classroom Feedback Survey' });
};

// POST /surveys/classroom-feedback
const postClassroomFeedback = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash('error', errors.array().map(e => e.msg).join(', '));
    return res.redirect('/surveys/classroom-feedback');
  }
  const { name, gradeSection, subject, teacherRating, favoriteLesson, suggestions, isAnonymous } = req.body;
  const anonymous = isAnonymous === 'on';
  try {
    await prisma.classroomFeedback.create({
      data: {
        userId: req.session.user?.id || null,
        name: anonymous ? null : (name || null),
        gradeSection,
        subject,
        teacherRating: parseInt(teacherRating),
        favoriteLesson,
        suggestions,
        isAnonymous: anonymous,
      }
    });
    req.flash('success', 'Feedback submitted successfully!');
    res.redirect('/surveys/classroom-feedback');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Submission failed. Please try again.');
    res.redirect('/surveys/classroom-feedback');
  }
};

// GET /surveys/classroom-feedback/results
const getClassroomResults = async (req, res) => {
  try {
    const { subject, rating } = req.query;
    const where = {};
    if (subject) where.subject = subject;
    if (rating) where.teacherRating = parseInt(rating);
    const feedbacks = await prisma.classroomFeedback.findMany({
      where, orderBy: { createdAt: 'desc' }, include: { user: true }
    });
    res.render('surveys/classroom-results', { title: 'Feedback Results', feedbacks, subject, rating });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to load results.');
    res.redirect('/surveys/classroom-feedback');
  }
};

// ── Disaster Preparedness ────────────────────────────────────

// GET /surveys/disaster
const getDisasterForm = (req, res) => {
  res.render('surveys/disaster-preparedness', { title: 'Disaster Preparedness Survey' });
};

// POST /surveys/disaster
const postDisasterSurvey = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash('error', errors.array().map(e => e.msg).join(', '));
    return res.redirect('/surveys/disaster');
  }
  const { address, familyMembers, hasEmergencyKit, evacuationPlan, pastExperience } = req.body;
  const planArray = Array.isArray(evacuationPlan) ? evacuationPlan : evacuationPlan ? [evacuationPlan] : [];
  try {
    await prisma.disasterSurvey.create({
      data: {
        userId: req.session.user?.id || null,
        address,
        familyMembers: parseInt(familyMembers),
        hasEmergencyKit: hasEmergencyKit === 'yes',
        evacuationPlan: planArray,
        pastExperience,
      }
    });
    req.flash('success', 'Survey submitted successfully!');
    res.redirect('/surveys/disaster');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Submission failed. Please try again.');
    res.redirect('/surveys/disaster');
  }
};

// GET /surveys/disaster/results
const getDisasterResults = async (req, res) => {
  try {
    const surveys = await prisma.disasterSurvey.findMany({
      orderBy: { createdAt: 'desc' }, include: { user: true }
    });
    res.render('surveys/disaster-results', { title: 'Disaster Survey Results', surveys });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to load results.');
    res.redirect('/surveys/disaster');
  }
};

module.exports = {
  getClassroomForm, postClassroomFeedback, getClassroomResults,
  getDisasterForm, postDisasterSurvey, getDisasterResults
};
