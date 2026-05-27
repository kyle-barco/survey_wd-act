const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { getLogin, postLogin, getRegister, postRegister, logout } = require('../controllers/authController');
const { isGuest, isAuthenticated } = require('../middleware/auth');

// Home → redirect
router.get('/', (req, res) => {
  if (req.session.user) {
    const role = req.session.user.role;
    if (role === 'ADMIN') return res.redirect('/admin/dashboard');
    if (role === 'TEACHER') return res.redirect('/teacher/dashboard');
    return res.redirect('/student/dashboard');
  }
  res.redirect('/login');
});

router.get('/login', isGuest, getLogin);
router.post('/login', isGuest,
  [
    body('email').isEmail().withMessage('Valid email required.'),
    body('password').notEmpty().withMessage('Password is required.'),
  ],
  postLogin
);

router.get('/register', isGuest, getRegister);
router.post('/register', isGuest,
  [
    body('name').trim().notEmpty().withMessage('Full name is required.'),
    body('email').isEmail().withMessage('Valid email required.'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters.'),
    body('confirmPassword').custom((val, { req }) => {
      if (val !== req.body.password) throw new Error('Passwords do not match.');
      return true;
    }),
    body('phone').optional().isMobilePhone().withMessage('Enter a valid phone number.'),
  ],
  postRegister
);

router.post('/logout', isAuthenticated, logout);

module.exports = router;
