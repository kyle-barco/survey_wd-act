const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { isAuthenticated, isTeacher } = require('../middleware/auth');
const {
  getClassroomForm, postClassroomFeedback, getClassroomResults,
  getDisasterForm, postDisasterSurvey, getDisasterResults
} = require('../controllers/surveyController');

// ── Classroom Feedback ─────────────────────────────────────
router.get('/classroom-feedback', isAuthenticated, getClassroomForm);
router.post('/classroom-feedback', isAuthenticated,
  [
    body('gradeSection').notEmpty().withMessage('Grade & Section is required.'),
    body('subject').notEmpty().withMessage('Subject is required.'),
    body('teacherRating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5.'),
    body('favoriteLesson').trim().notEmpty().withMessage('Favorite lesson is required.'),
    body('suggestions').trim().notEmpty().withMessage('Suggestions are required.'),
  ],
  postClassroomFeedback
);
router.get('/classroom-feedback/results', isAuthenticated, isTeacher, getClassroomResults);

// ── Disaster Preparedness ──────────────────────────────────
router.get('/disaster', isAuthenticated, getDisasterForm);
router.post('/disaster', isAuthenticated,
  [
    body('address').trim().notEmpty().withMessage('Address is required.'),
    body('familyMembers').isInt({ min: 1 }).withMessage('Family members must be at least 1.'),
    body('hasEmergencyKit').isIn(['yes', 'no']).withMessage('Emergency kit answer required.'),
    body('pastExperience').trim().notEmpty().withMessage('Past disaster experience is required.'),
  ],
  postDisasterSurvey
);
router.get('/disaster/results', isAuthenticated, isTeacher, getDisasterResults);

module.exports = router;
