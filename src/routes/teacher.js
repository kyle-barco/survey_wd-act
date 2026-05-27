const express = require('express');
const router = express.Router();
const { isAuthenticated, isTeacher } = require('../middleware/auth');
const { getDashboard, getProfile } = require('../controllers/teacherController');

router.use(isAuthenticated, isTeacher);
router.get('/dashboard', getDashboard);
router.get('/profile', getProfile);

module.exports = router;
