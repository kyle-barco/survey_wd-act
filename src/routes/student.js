const express = require('express');
const router = express.Router();
const { isAuthenticated, isStudent } = require('../middleware/auth');
const { getDashboard, getProfile } = require('../controllers/studentController');

router.use(isAuthenticated, isStudent);
router.get('/dashboard', getDashboard);
router.get('/profile', getProfile);

module.exports = router;
