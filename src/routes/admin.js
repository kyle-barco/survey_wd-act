const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { isAuthenticated, isAdmin } = require('../middleware/auth');
const { getDashboard, getUsers, getEditUser, updateUser, deleteUser, getSurveys } = require('../controllers/adminController');

router.use(isAuthenticated, isAdmin);

router.get('/dashboard', getDashboard);
router.get('/users', getUsers);
router.get('/users/:id/edit', getEditUser);
router.put('/users/:id',
  [
    body('name').trim().notEmpty().withMessage('Name is required.'),
    body('email').isEmail().withMessage('Valid email required.'),
    body('role').isIn(['ADMIN', 'TEACHER', 'STUDENT']).withMessage('Invalid role.'),
    body('phone').optional().isMobilePhone().withMessage('Enter a valid phone number.'),
  ],
  updateUser
);
router.delete('/users/:id', deleteUser);
router.get('/surveys', getSurveys);

module.exports = router;
