const express = require('express');
const router  = express.Router();
const {
  listSurveys,
  showBuilder,
  editBuilder,
  createSurvey,
  updateSurvey,
  deleteSurvey,
  fillSurvey,
  submitSurvey,
  viewResults,
} = require('../controllers/customSurveyController');

// Replace isAuthenticated / isTeacher with whatever middleware you already use
const { isAuthenticated, isTeacher } = require('../middleware/auth');

// ── Teacher / Admin routes ────────────────────────────────────────────────────
router.get('/',                    isAuthenticated, isTeacher, listSurveys);
router.get('/builder',             isAuthenticated, isTeacher, showBuilder);
router.get('/:id/edit',            isAuthenticated, isTeacher, editBuilder);
router.post('/',                   isAuthenticated, isTeacher, createSurvey);
router.put('/:id',                 isAuthenticated, isTeacher, updateSurvey);
router.delete('/:id',              isAuthenticated, isTeacher, deleteSurvey);
router.get('/:id/results',         isAuthenticated, isTeacher, viewResults);

// ── Student routes ────────────────────────────────────────────────────────────
router.get('/:id/fill',            isAuthenticated, fillSurvey);
router.post('/:id/submit',         isAuthenticated, submitSurvey);

module.exports = router;

// ─── ADD THIS LINE to your app.js / main router file ─────────────────────────
// app.use('/surveys/custom', require('./routes/customSurvey'));